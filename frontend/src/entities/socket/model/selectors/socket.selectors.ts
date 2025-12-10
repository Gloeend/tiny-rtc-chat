import type { RootState } from '@shared/config/store-config'

export const getSocketIsConnected = (store: RootState) => store.socket.isConnected
export const getSocketIsError = (store: RootState) => store.socket.isError
export const getSocketIsLoading = (store: RootState) => store.socket.isLoading
export const getSocketLastMessage = (store: RootState) => store.socket.lastMessage
