import { CookieKeys } from '@entities/user'
import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import Cookies from 'js-cookie'

import type { User } from '../types'

type UserSlice = User

const INITIAL_STATE = {} as UserSlice

const userSlice = createSlice({
	initialState: INITIAL_STATE,
	name: 'user',
	reducers: {
		login: (state, { payload }: PayloadAction<UserSlice['username']>) => {
			state.username = payload
			Cookies.set(CookieKeys.USERNAME, payload)
		}
	}
})

export const userSliceReducer = userSlice.reducer
export const userSliceActions = userSlice.actions
