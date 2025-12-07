import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

import type { SerializableDeviceInfo } from '../types'

type InitialState = {
	permissions: {
		video: boolean
		audio: boolean
	} | null
	availableVideoDevices: SerializableDeviceInfo[]
	availableAudioDevices: SerializableDeviceInfo[]
	selectedVideoDeviceId: string | null
	selectedAudioDeviceId: string | null
	isVideoEnabled: boolean
	isAudioEnabled: boolean
}

const INITIAL_STATE: InitialState = {
	permissions: null,
	availableVideoDevices: [],
	availableAudioDevices: [],
	selectedVideoDeviceId: null,
	selectedAudioDeviceId: null,
	isVideoEnabled: true,
	isAudioEnabled: true
}

const mediaStreamSlice = createSlice({
	name: 'media-stream',
	initialState: INITIAL_STATE,
	reducers: {
		setPermissions: (state, { payload }: PayloadAction<InitialState['permissions']>) => {
			state.permissions = payload
		},
		setAvailableVideoDevices: (state, { payload }: PayloadAction<SerializableDeviceInfo[]>) => {
			state.availableVideoDevices = payload
		},
		setAvailableAudioDevices: (state, { payload }: PayloadAction<SerializableDeviceInfo[]>) => {
			state.availableAudioDevices = payload
		},
		setSelectedVideoDeviceId: (state, { payload }: PayloadAction<string | null>) => {
			state.selectedVideoDeviceId = payload
		},
		setSelectedAudioDeviceId: (state, { payload }: PayloadAction<string | null>) => {
			state.selectedAudioDeviceId = payload
		},
		setIsVideoEnabled: (state, { payload }: PayloadAction<boolean>) => {
			state.isVideoEnabled = payload
		},
		setIsAudioEnabled: (state, { payload }: PayloadAction<boolean>) => {
			state.isAudioEnabled = payload
		},
		clear: () => INITIAL_STATE
	}
})

export const mediaStreamActions = mediaStreamSlice.actions
export const mediaStreamReducer = mediaStreamSlice.reducer
