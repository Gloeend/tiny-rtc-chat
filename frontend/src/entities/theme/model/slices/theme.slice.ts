import { StorageKeys } from '@entities/theme/model/consts.ts'
import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

import type { ThemeEnum } from '../types'

const themeSlice = createSlice({
	name: 'theme',
	initialState: 'LIGHT' as ThemeEnum,
	reducers: {
		setTheme: (_, { payload }: PayloadAction<ThemeEnum>) => {
			localStorage.setItem(StorageKeys.THEME, payload)
			return payload
		}
	}
})

export const themeSliceReducer = themeSlice.reducer
export const themeSliceActions = themeSlice.actions
