import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

import type { SocketMessage } from '../types'

type InitialState = {
	isConnected: boolean
	isLoading: boolean
	isError: boolean
	lastMessage: SocketMessage | null
}

const INITIAL_STATE: InitialState = {
	isConnected: false,
	isLoading: false,
	isError: false,
	lastMessage: null
}

const socketSlice = createSlice({
	name: 'socket-slice',
	initialState: INITIAL_STATE,
	reducers: {
		setIsLoading: (state, { payload }: PayloadAction<boolean>) => {
			state.isLoading = payload
		},
		setIsConnected: (state, { payload }: PayloadAction<boolean>) => {
			state.isConnected = payload
		},
		setIsError: (state, { payload }: PayloadAction<boolean>) => {
			state.isError = payload
		},
		receiveMessage: (state, { payload }: PayloadAction<SocketMessage | null>) => {
			state.lastMessage = payload
		}
	}
})

export const socketSliceActions = socketSlice.actions
export const socketSliceReducer = socketSlice.reducer