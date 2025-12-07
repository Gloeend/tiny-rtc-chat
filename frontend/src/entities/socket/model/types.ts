export const ChatSocketActionEnum = {
	CONNECT: 'socket/CONNECT',
	DISCONNECT: 'socket/DISCONNECT',
	SUBSCRIBE: 'socket/SUBSCRIBE',
	UNSUBSCRIBE: 'socket/UNSUBSCRIBE',
	SEND: 'socket/SEND',
	JOIN_ROOM: 'socket/JOIN_ROOM',
	LEAVE_ROOM: 'socket/LEAVE_ROOM'
}

export interface SocketMessage<T = unknown> {
	topic: string
	data: T
	timestamp?: number
}

export interface RoomMessage {
	roomId: string
	userId: string
	username?: string
	message: string
	timestamp: number
}

export interface UserJoinedMessage {
	roomId: string
	userId: string
	username?: string
	timestamp: number
}

export interface UserLeftMessage {
	roomId: string
	userId: string
	username?: string
	timestamp: number
}

export const socketActions = {
	connect: () => ({ type: ChatSocketActionEnum.CONNECT }) as const,
	disconnect: () => ({ type: ChatSocketActionEnum.DISCONNECT }) as const,
	subscribe: (event: string) =>
		({
			type: ChatSocketActionEnum.SUBSCRIBE,
			payload: { event }
		}) as const,
	unsubscribe: (event: string) =>
		({
			type: ChatSocketActionEnum.UNSUBSCRIBE,
			payload: { event }
		}) as const,
	send: <T = unknown>(event: string, payload: T, ack?: (response: unknown) => void) =>
		({
			type: ChatSocketActionEnum.SEND,
			payload: { event, payload, ack }
		}) as const,
	joinRoom: (roomId: string) =>
		({
			type: ChatSocketActionEnum.JOIN_ROOM,
			payload: { roomId }
		}) as const,
	leaveRoom: (roomId: string) =>
		({
			type: ChatSocketActionEnum.LEAVE_ROOM,
			payload: { roomId }
		}) as const
}

export type ChatSocketActions =
	| ReturnType<typeof socketActions.connect>
	| ReturnType<typeof socketActions.disconnect>
	| ReturnType<typeof socketActions.subscribe>
	| ReturnType<typeof socketActions.unsubscribe>
	| ReturnType<typeof socketActions.send>
	| ReturnType<typeof socketActions.joinRoom>
	| ReturnType<typeof socketActions.leaveRoom>
