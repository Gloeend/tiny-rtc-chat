import type { RootState } from '@shared/config/store-config'

export const getChannelChannelId = (store: RootState) => store.channel.channelId
export const getChannelParticipants = (store: RootState) => store.channel.participants
export const getChannelMaxParticipants = (store: RootState) => store.channel.maxParticipants
