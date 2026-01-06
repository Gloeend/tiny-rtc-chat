import { httpBaseApi } from '@shared/config/http-config'

import type { CreateRoomBodyDTO, CreateRoomResponseDTO, GetRoomsResponseDTO } from '../model/types'

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
		createRoom: build.mutation<CreateRoomResponseDTO, CreateRoomBodyDTO>({
			query: (dto) => {
				return {
					url: '/api/rooms',
					method: 'post',
					data: dto
				}
			}
		})
	})
})
