import { themeSliceReducer } from '@entities/theme'
import { userSliceReducer } from '@entities/user'
import { configureStore } from '@reduxjs/toolkit'
import { ENV_CONFIG } from '@shared/config/environment-config'

export const store = configureStore({
	reducer: {
		user: userSliceReducer,
		theme: themeSliceReducer
	},
	middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat([]),
	devTools: ENV_CONFIG.VITE_APP_MODE === 'development'
})
