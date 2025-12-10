export { socketSliceActions, socketSliceReducer } from './model/slices/socket.slice'
export { chatSocketMiddleware } from './config'
export { socketActions } from './model/types'
export type { SocketMessage, RoomMessage, UserJoinedMessage, UserLeftMessage, ChatSocketActions } from './model/types'

export {
	getSocketIsConnected,
	getSocketIsError,
	getSocketIsLoading,
	getSocketLastMessage
} from './model/selectors/socket.selectors'
export { useConnectSocket } from './lib/hooks/use-connect-socket'
