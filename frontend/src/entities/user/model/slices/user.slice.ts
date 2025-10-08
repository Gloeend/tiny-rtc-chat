import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

import type { User } from '../types'

type UserSlice = User

const INITIAL_STATE = {} as UserSlice

const userSlice = createSlice({
	initialState: INITIAL_STATE,
	name: 'user',
	reducers: {
		setUser: (state, { payload }: PayloadAction<Partial<UserSlice>>) => {
			Object.assign(state, payload)
		}
	},
	selectors: {}
})

export const userSliceReducer = userSlice.reducer
export const userSliceActions = userSlice.actions
