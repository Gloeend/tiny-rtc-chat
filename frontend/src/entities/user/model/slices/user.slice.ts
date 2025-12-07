import { StorageKeys } from '@entities/user'
import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { v4 as uuid } from 'uuid'

import type { User } from '../types'

type UserSlice = User

const INITIAL_STATE = {} as UserSlice

const userSlice = createSlice({
	initialState: INITIAL_STATE,
	name: 'user',
	reducers: {
		login: (
			state,
			{ payload }: PayloadAction<Omit<UserSlice, 'avatar' | 'userId'> & Partial<Pick<UserSlice, 'userId'>>>
		) => {
			state.username = payload.username
			const userId = payload.userId ?? uuid()
			state.userId = userId

			const storage = {
				userId: localStorage.getItem(StorageKeys.USER_ID),
				username: localStorage.getItem(StorageKeys.USERNAME)
			}

			if (storage.userId !== userId || storage.username !== payload.username) {
				localStorage.setItem(StorageKeys.USERNAME, payload.username)
				localStorage.setItem(StorageKeys.USER_ID, userId)
			}
		},
		setAvatar: (state, { payload }: PayloadAction<string>) => {
			state.avatar = payload
			localStorage.setItem(StorageKeys.AVATAR, payload)
		}
	}
})

export const userSliceReducer = userSlice.reducer
export const userSliceActions = userSlice.actions
