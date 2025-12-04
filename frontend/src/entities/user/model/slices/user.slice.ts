import { StorageKeys } from '@entities/user'
import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

import type { User } from '../types'

type UserSlice = User

const INITIAL_STATE = {} as UserSlice

const userSlice = createSlice({
	initialState: INITIAL_STATE,
	name: 'user',
	reducers: {
		login: (state, { payload }: PayloadAction<UserSlice['username']>) => {
			state.username = payload
			localStorage.setItem(StorageKeys.USERNAME, payload)
		},
		setAvatar: (state, { payload }: PayloadAction<string>) => {
			state.avatar = payload
			localStorage.setItem(StorageKeys.AVATAR, payload)
		}
	}
})

export const userSliceReducer = userSlice.reducer
export const userSliceActions = userSlice.actions
