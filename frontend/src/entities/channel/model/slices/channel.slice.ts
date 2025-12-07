import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

import type { Participant } from '../types'

type InitialState = {
	channelId?: string
	participants?: Participant[]
	maxParticipants?: number
}

const INITIAL_STATE = {} as InitialState

const channelSlice = createSlice({
	name: 'channel',
	initialState: INITIAL_STATE,
	reducers: {
		set: (state, { payload }: PayloadAction<Partial<InitialState>>) => {
			Object.assign(state, payload)
		}
	}
})

export const channelSliceActions = channelSlice.actions
export const channelSliceReducer = channelSlice.reducer
