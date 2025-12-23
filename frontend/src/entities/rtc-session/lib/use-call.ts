import { useMediaStream } from '@entities/media-stream'
import { PeerConnectionService } from '@entities/rtc-session'
import {
	answerSchema,
	existingUsersSchema,
	iceCandidateSchema,
	offerSchema,
	userConnectedSchema,
	userDisconnectedSchema
} from '@entities/rtc-session/model/schemas/call-events.schema.ts'
import { CallSessionService } from '@entities/rtc-session/model/services/call-session.service.ts'
import { getSocketLastMessage } from '@entities/socket'
import { getUser } from '@entities/user'
import { ENV_CONFIG } from '@shared/config/environment-config'
import { useAppDispatch, useAppSelector } from '@shared/lib'
import { useCallback, useEffect, useRef, useState } from 'react'

export const useCall = (channelId: string) => {
	const dispatch = useAppDispatch()
	const { ref, mediaStreamService, isLoadedMedia } = useMediaStream()

	const peerConnectionsRef = useRef<Map<string, PeerConnectionService>>(new Map())

	const remoteUsersRef = useRef<
		Map<string, { nickname: string; joinedAt: string; socketId: string; userId: string; mediaStream?: MediaStream }>
	>(new Map())

	const [preparedRemoteUsers, setPreparedRemoteUsers] = useState<
		Array<{ nickname: string; joinedAt: string; socketId: string; userId: string; mediaStream: MediaStream }>
	>([])

	const pendingIceCandidatesRef = useRef<Map<string, RTCIceCandidateInit[]>>(new Map())
	const pendingUsersToConnectRef = useRef<{ socketId: string; userId: string; nickname: string; joinedAt: string }[]>([])

	const { userId } = useAppSelector(getUser)
	const lastMessage = useAppSelector(getSocketLastMessage)

	const callSessionService = useRef<CallSessionService | null>(null)

	if (!callSessionService.current) {
		callSessionService.current = new CallSessionService(dispatch, channelId, userId)
	}

	const onCreatePeerConnection = useCallback(
		(
			remoteUser: { socketId: string; userId: string; nickname: string; joinedAt: string },
			direction: 'offer' | 'answer',
			offer?: RTCSessionDescriptionInit
		) => {
			if (!mediaStreamService.current || !callSessionService.current || peerConnectionsRef.current.has(remoteUser.userId)) {
				return
			}

			const connection = new PeerConnectionService(
				dispatch,
				mediaStreamService.current,
				callSessionService.current.sendCandidate,
				JSON.parse(ENV_CONFIG.VITE_APP_ICE_SERVERS),
				remoteUser.userId
			)

			if (!remoteUsersRef.current.has(remoteUser.userId)) {
				remoteUsersRef.current.set(remoteUser.userId, remoteUser)
			}

			peerConnectionsRef.current.set(remoteUser.userId, connection)
			callSessionService.current.addPeerConnection(remoteUser.userId, connection)

			const pendingCandidates = pendingIceCandidatesRef.current.get(remoteUser.userId)
			if (pendingCandidates) {
				pendingCandidates.forEach((candidate) => {
					connection.receiveRemoteIceCandidate(candidate).catch(console.error)
				})
				pendingIceCandidatesRef.current.delete(remoteUser.userId)
			}

			if (direction === 'offer') {
				callSessionService.current.sendOffer(remoteUser.userId).catch(console.error)
				return
			}
			if (direction === 'answer' && offer) {
				callSessionService.current.sendAnswer(remoteUser.userId, offer).catch(console.error)
			}
		},
		[dispatch, mediaStreamService]
	)
	const onTrack = useCallback((userId: string, tracks: MediaStreamTrack[]) => {
		const remoteUser = remoteUsersRef.current.get(userId)

		if (!remoteUser) return

		const mediaStream = new MediaStream()

		tracks.forEach((track) => {
			mediaStream.addTrack(track)
		})

		setPreparedRemoteUsers((prev) => {
			const foundedUserIndex = prev.findIndex((needle) => needle.userId === remoteUser.userId)

			if (foundedUserIndex !== -1) {
				return prev.map((user, index) => (index === foundedUserIndex ? { ...user, mediaStream } : user))
			}

			return [...prev, { ...remoteUser, mediaStream }]
		})

		remoteUsersRef.current.set(userId, {
			...remoteUser,
			mediaStream
		})
	}, [])

	useEffect(() => {
		if (!mediaStreamService.current) {
			return
		}

		mediaStreamService.current.setOnTrackRemoteExternal(onTrack)
	}, [mediaStreamService, onTrack])

	useEffect(() => {
		if (!callSessionService.current) {
			return
		}

		callSessionService.current.joinChannel()

		return () => {
			if (!callSessionService.current) {
				return
			}

			callSessionService.current.leaveChannel(channelId)
		}
	}, [channelId, userId])

	useEffect(() => {
		if (!isLoadedMedia || pendingUsersToConnectRef.current.length === 0) {
			return
		}

		pendingUsersToConnectRef.current.forEach((user) => onCreatePeerConnection(user, 'offer'))
		pendingUsersToConnectRef.current = []
	}, [isLoadedMedia, onCreatePeerConnection])

	useEffect(() => {
		if (!callSessionService.current || !mediaStreamService.current || !lastMessage || !lastMessage.topic) {
			return
		}

		switch (lastMessage.topic) {
			case 'existing-users': {
				const users = existingUsersSchema.parse(lastMessage).data
				if (!isLoadedMedia) {
					pendingUsersToConnectRef.current = users
					break
				}
				users.forEach((user) => onCreatePeerConnection(user, 'offer'))
				break
			}
			case 'user-connected': {
				const parsed = userConnectedSchema.parse(lastMessage)

				if (parsed.data.userId === userId) {
					return
				}

				remoteUsersRef.current.set(parsed.data.userId, parsed.data)
				break
			}
			case 'user-disconnected': {
				const parsed = userDisconnectedSchema.parse(lastMessage)

				setPreparedRemoteUsers((prev) => {
					return prev.filter((needle) => needle.userId !== parsed.data)
				})

				const connection = peerConnectionsRef.current.get(parsed.data)

				if (!connection) {
					console.warn('No actual connection found in buffer for delete')
					return
				}

				connection.close()
				remoteUsersRef.current.delete(parsed.data)
				peerConnectionsRef.current.delete(parsed.data)
				callSessionService.current.removePeerConnection(parsed.data)
				mediaStreamService.current.clearCurrentRemoteTrack(parsed.data)
				break
			}
			case 'offer': {
				const parsed = offerSchema.parse(lastMessage)

				const remoteUser = remoteUsersRef.current.get(parsed.data.senderUserId)

				if (!remoteUser) {
					console.error('Lifecycle is dead. trying create pc before saving user data in storage')
					break
				}

				onCreatePeerConnection(remoteUser, 'answer', parsed.data.offer)
				break
			}
			case 'answer': {
				const parsed = answerSchema.parse(lastMessage)

				const connection = peerConnectionsRef.current.get(parsed.data.senderUserId)

				if (!connection) {
					console.error('No actual connection found in buffer for delete')
					break
				}

				connection.setRemoteDescription(parsed.data.answer).catch(console.error)
				break
			}
			case 'ice-candidate': {
				const parsed = iceCandidateSchema.parse(lastMessage)

				const connection = peerConnectionsRef.current.get(parsed.data.senderUserId)

				if (!connection) {
					const pending = pendingIceCandidatesRef.current.get(parsed.data.senderUserId) ?? []
					pending.push(parsed.data.candidate)
					pendingIceCandidatesRef.current.set(parsed.data.senderUserId, pending)
					break
				}

				connection.receiveRemoteIceCandidate(parsed.data.candidate).catch(console.error)
				break
			}
		}
	}, [lastMessage, userId, isLoadedMedia, mediaStreamService, onCreatePeerConnection])

	return {
		ref,
		users: preparedRemoteUsers
	}
}
