import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { ENV_CONFIG } from '@shared/config/environment-config'

import { isLocalCandidate } from '../../lib/isLocalCandidate'

type InitialState = {
	iceCandidates: Record<string, true>
	connectionState: RTCPeerConnectionState | null
	iceGatheringState: RTCIceGatheringState | null
}

const INITIAL_STATE = {
	iceCandidates: {},
	connectionState: null,
	iceGatheringState: null
} as InitialState

const rtcSessionSlice = createSlice({
	name: 'rtc-session',
	initialState: INITIAL_STATE,
	reducers: {
		setIceCandidate: (state, { payload }: PayloadAction<RTCIceCandidate>) => {
			if (ENV_CONFIG.VITE_APP_MODE === 'prod' && isLocalCandidate(payload)) {
				return
			}

			const jsonCandidate = JSON.stringify(payload)

			if (!state.iceCandidates[jsonCandidate]) {
				state.iceCandidates[jsonCandidate] = true
			}
		},
		setConnectionState: (state, { payload }: PayloadAction<RTCPeerConnectionState | null>) => {
			state.connectionState = payload
		},
		setIceGatheringState: (state, { payload }: PayloadAction<RTCIceGatheringState | null>) => {
			state.iceGatheringState = payload
		},
		reset: () => INITIAL_STATE
	}
})

export const rtcSessionSliceActions = rtcSessionSlice.actions
export const rtcSessionSliceReducer = rtcSessionSlice.reducer
