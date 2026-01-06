import { channelRtkApi } from '@entities/channel'

import type { Channel } from '../../model/types'

export const channelRtkApiCacheUtils = {
	appendRoom: (dto: Omit<Channel, 'participants'>) => {
		return channelRtkApi.util.updateQueryData('getRooms', undefined, (draft) => {
			draft.rooms.push(dto)
		})
	},
	updateRoom: (dto: Omit<Channel, 'participants'>) => {
		return channelRtkApi.util.updateQueryData('getRooms', undefined, (draft) => {
			const index = draft.rooms.findIndex((room) => room.id === dto.id)
			if (index !== -1) {
				draft.rooms[index] = dto
			} else {
				draft.rooms.push(dto)
			}
		})
	},
	deleteRoom: (id: string) => {
		return channelRtkApi.util.updateQueryData('getRooms', undefined, (draft) => {
			draft.rooms = draft.rooms.filter((room) => room.id !== id)
		})
	}
}
