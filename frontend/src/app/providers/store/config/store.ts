import { themeSliceReducer } from '@entities/theme'
import { userSliceReducer } from '@entities/user'
import { configureStore } from '@reduxjs/toolkit'
import { ENV_CONFIG } from '@shared/config/environment-config'
import { httpBaseApi } from '@shared/config/http-config'

export const store = configureStore({
	reducer: {
		user: userSliceReducer,
		theme: themeSliceReducer,
		[httpBaseApi.reducerPath]: httpBaseApi.reducer
	},
	middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat([httpBaseApi.middleware]),
	devTools: ENV_CONFIG.VITE_APP_MODE === 'development'
})
