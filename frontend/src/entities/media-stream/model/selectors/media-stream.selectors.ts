import type { RootState } from '@shared/config/store-config'

export const getMediaStreamPermissions = (store: RootState) => store.mediaStream.permissions
export const getMediaStreamAvailableVideoDevices = (store: RootState) => store.mediaStream.availableVideoDevices
export const getMediaStreamAvailableAudioDevices = (store: RootState) => store.mediaStream.availableAudioDevices
export const getMediaStreamSelectedVideoDeviceId = (store: RootState) => store.mediaStream.selectedVideoDeviceId
export const getMediaStreamSelectedAudioDeviceId = (store: RootState) => store.mediaStream.selectedAudioDeviceId
