export type { Participant, Channel, GetRoomsResponseDTO, GetRoomByIdResponseDTO, CreateRoomResponseDTO } from './model/types'

export { channelSliceReducer, channelSliceActions } from './model/slices/channel.slice'

export { getChannelParticipants, getChannelChannelId, getChannelMaxParticipants } from './model/selectors/channel.selectors'

export { ChannelCard } from './ui/channel-card'

export { channelRtkApi } from './api'

export { useCreateChannel } from './lib/hooks/use-create-channel'
export { useObserveChannel } from './lib/hooks/use-observe-channel'
