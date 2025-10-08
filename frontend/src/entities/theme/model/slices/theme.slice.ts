import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

import type { ThemeEnum } from '../types'

const themeSlice = createSlice({
	name: 'theme',
	initialState: 'LIGHT' as ThemeEnum,
	reducers: {
		setTheme: (_, { payload }: PayloadAction<ThemeEnum>) => payload
	}
})

export const themeSliceReducer = themeSlice.reducer
export const themeSliceActions = themeSlice.actions
