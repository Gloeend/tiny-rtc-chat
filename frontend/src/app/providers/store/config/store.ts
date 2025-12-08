import { channelSliceReducer } from '@entities/channel'
import { mediaStreamReducer } from '@entities/media-stream'
import { rtcSessionSliceReducer } from '@entities/rtc-session'
import { chatSocketMiddleware, socketSliceReducer } from '@entities/socket'
import { themeSliceReducer } from '@entities/theme'
import { userSliceReducer } from '@entities/user'
import { configureStore } from '@reduxjs/toolkit'
import { ENV_CONFIG } from '@shared/config/environment-config'
import { httpBaseApi } from '@shared/config/http-config'

export const store = configureStore({
	reducer: {
		user: userSliceReducer,
		theme: themeSliceReducer,
		socket: socketSliceReducer,
		channel: channelSliceReducer,
		rtcSession: rtcSessionSliceReducer,
		mediaStream: mediaStreamReducer,
		[httpBaseApi.reducerPath]: httpBaseApi.reducer
	},
	middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat([httpBaseApi.middleware, chatSocketMiddleware]),
	devTools: ENV_CONFIG.VITE_APP_MODE === 'dev'
})
