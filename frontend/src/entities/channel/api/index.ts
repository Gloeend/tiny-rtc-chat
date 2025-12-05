import { httpBaseApi } from '@shared/config/http-config'

import type { GetRoomByIdResponseDTO, GetRoomsResponseDTO } from '../model/types'

export const channelRtkApi = httpBaseApi.injectEndpoints({
	endpoints: (build) => ({
		getRooms: build.query<GetRoomsResponseDTO, void>({
			query: () => {
				return {
					url: '/api/rooms',
					method: 'get'
				}
			}
		}),
		getRoomById: build.query<GetRoomByIdResponseDTO, void>({
			query: () => {
				return {
					url: '/api/rooms',
					method: 'get'
				}
			}
		})
	})
})
