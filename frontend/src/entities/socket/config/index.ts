import { socketSliceActions } from '@entities/socket'
import type { Middleware } from '@reduxjs/toolkit'
import { ENV_CONFIG } from '@shared/config/environment-config'
import { io, Socket } from 'socket.io-client'

import { ChatSocketActionEnum, type ChatSocketActions, type SocketMessage } from '../model/types'

interface PendingMessage {
	event: string
	payload: unknown
	ack?: (response: unknown) => void
}

interface PendingSubscription {
	event: string
	handler: (data: unknown) => void
}

let socket: Socket | null = null
let isConnecting = false
const subscriptions = new Map<string, (data: unknown) => void>()
const pendingSubscriptions: PendingSubscription[] = []
const pendingMessages: PendingMessage[] = []
const joinedRooms = new Set<string>()

function subscribeToEvent(event: string, handler: (data: unknown) => void) {
	if (!socket) return

	if (!subscriptions.has(event)) {
		const wrappedHandler = (data: unknown) => {
			try {
				handler(data)
			} catch (error) {
				console.error(`Socket.IO: Error in handler for event ${event}`, error)
			}
		}

		socket.on(event, wrappedHandler)
		subscriptions.set(event, wrappedHandler)
		console.info(`Socket.IO: Subscribed to event ${event}`)
	} else {
		console.warn(`Socket.IO: Already subscribed to event ${event}`)
	}
}

function unsubscribeFromEvent(event: string) {
	if (!socket) return

	const handler = subscriptions.get(event)
	if (handler) {
		socket.off(event, handler)
		subscriptions.delete(event)
		console.info(`Socket.IO: Unsubscribed from event ${event}`)
	}
}

function sendMessage(event: string, payload: unknown, ack?: (response: unknown) => void) {
	if (!socket || !socket.connected) return

	try {
		if (ack) {
			socket.emit(event, payload, (response: unknown) => {
				console.info(`Socket.IO: ACK received for event "${event}"`, response)
				ack(response)
			})
		} else {
			socket.emit(event, payload)
		}
		console.info(`Socket.IO: Event "${event}" sent`, payload)
	} catch (error) {
		console.error('Socket.IO: Failed to send message', error)
	}
}

export const chatSocketMiddleware: Middleware = (store) => (next) => (action) => {
	const typedAction = action as ChatSocketActions

	switch (typedAction.type) {
		case ChatSocketActionEnum.CONNECT:
			if (!socket && !isConnecting) {
				isConnecting = true
				store.dispatch(socketSliceActions.setIsLoading(true))

				try {
					socket = io(ENV_CONFIG.VITE_APP_BACKEND_WS_URL, {
						transports: ['websocket', 'polling'],
						reconnection: true,
						reconnectionAttempts: 5,
						reconnectionDelay: 1000,
						reconnectionDelayMax: 5000,
						timeout: 20000,
						autoConnect: true,
						forceNew: false
					})

					socket.on('connect', () => {
						console.info('Socket.IO: Connected successfully')
						isConnecting = false
						store.dispatch(socketSliceActions.setIsLoading(false))
						store.dispatch(socketSliceActions.setIsConnected(true))
						store.dispatch(socketSliceActions.setIsError(false))

						if (joinedRooms.size > 0) {
							console.info(`Socket.IO: Rejoining ${joinedRooms.size} room(s) after reconnection`)
							joinedRooms.forEach((roomId) => {
								if (socket) {
									socket.emit('join', { roomId })
								}
							})
						}

						pendingSubscriptions.forEach(({ event, handler }) => {
							subscribeToEvent(event, handler)
						})
						pendingSubscriptions.length = 0

						pendingMessages.forEach(({ event, payload, ack }) => {
							sendMessage(event, payload, ack)
						})
						pendingMessages.length = 0
					})

					socket.on('disconnect', (reason: Socket.DisconnectReason) => {
						console.info(`Socket.IO: Disconnected. Reason: ${reason}`)
						isConnecting = false
						store.dispatch(socketSliceActions.setIsConnected(false))

						if (reason === 'io server disconnect') {
							store.dispatch(socketSliceActions.setIsError(true))
						}
					})

					socket.on('connect_error', (error: Error) => {
						console.error('Socket.IO: Connection error', error.message)
						isConnecting = false
						store.dispatch(socketSliceActions.setIsLoading(false))
						store.dispatch(socketSliceActions.setIsConnected(false))
						store.dispatch(socketSliceActions.setIsError(true))
					})

					socket.on('error', (error: Error) => {
						console.error('Socket.IO: Error', error)
						store.dispatch(socketSliceActions.setIsError(true))
					})

					let pingInterval: NodeJS.Timeout | null = null
					socket.on('connect', () => {
						if (pingInterval) clearInterval(pingInterval)
						pingInterval = setInterval(() => {
							if (socket && socket.connected) {
								socket.emit('ping', { timestamp: Date.now() })
							}
						}, 30000)
					})

					socket.on('disconnect', () => {
						if (pingInterval) {
							clearInterval(pingInterval)
							pingInterval = null
						}
					})

					socket.on('pong', (data: { timestamp: number }) => {
						const latency = Date.now() - data.timestamp
						console.debug(`Socket.IO: Latency ${latency}ms`)
					})

					socket.connect()
				} catch (error) {
					console.error('Socket.IO: Connection failed', error)
					isConnecting = false
					store.dispatch(socketSliceActions.setIsLoading(false))
					store.dispatch(socketSliceActions.setIsConnected(false))
					store.dispatch(socketSliceActions.setIsError(true))
				}
			}
			break

		case ChatSocketActionEnum.SUBSCRIBE: {
			if (!('payload' in typedAction)) break
			const { event } = typedAction.payload as { event: string }

			if (socket && socket.connected) {
				subscribeToEvent(event, (data: unknown) => {
					const message: SocketMessage = {
						topic: event,
						data,
						timestamp: Date.now()
					}
					store.dispatch(socketSliceActions.receiveMessage(message))
				})
			} else {
				console.warn('Socket.IO: Not connected, adding to pending subscriptions')
				pendingSubscriptions.push({
					event,
					handler: (data: unknown) => {
						const message: SocketMessage = {
							topic: event,
							data,
							timestamp: Date.now()
						}
						store.dispatch(socketSliceActions.receiveMessage(message))
					}
				})
				if (!socket && !isConnecting) {
					store.dispatch({ type: ChatSocketActionEnum.CONNECT })
				}
			}
			break
		}

		case ChatSocketActionEnum.UNSUBSCRIBE: {
			if (!('payload' in typedAction)) break
			const { event } = typedAction.payload as { event: string }

			if (socket) {
				unsubscribeFromEvent(event)
			}
			break
		}

		case ChatSocketActionEnum.SEND: {
			if (!('payload' in typedAction)) break
			const { event, payload, ack } = typedAction.payload as {
				event: string
				payload: unknown
				ack?: (response: unknown) => void
			}

			if (socket && socket.connected) {
				sendMessage(event, payload, ack)
			} else {
				console.warn('Socket.IO: Not connected, adding to pending messages')
				pendingMessages.push({ event, payload, ack })
				if (!socket && !isConnecting) {
					store.dispatch({ type: ChatSocketActionEnum.CONNECT })
				}
			}
			break
		}

		case ChatSocketActionEnum.DISCONNECT:
			if (socket) {
				isConnecting = false
				pendingSubscriptions.length = 0
				pendingMessages.length = 0
				joinedRooms.clear()

				subscriptions.forEach((_, event) => {
					unsubscribeFromEvent(event)
				})
				subscriptions.clear()

				socket.disconnect()
				socket = null
				store.dispatch(socketSliceActions.setIsConnected(false))
				console.info('Socket.IO: Disconnected by user')
			}
			break
	}

	return next(action)
}
