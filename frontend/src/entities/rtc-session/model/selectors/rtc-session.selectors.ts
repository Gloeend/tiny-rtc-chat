import type { RootState } from '@shared/config/store-config'

export const getRtcSessionIceCandidates = (store: RootState) => store.rtcSession.iceCandidates
export const getRtcSessionIceGatheringState = (store: RootState) => store.rtcSession.iceGatheringState
export const getRtcSessionConnectionState = (store: RootState) => store.rtcSession.connectionState
