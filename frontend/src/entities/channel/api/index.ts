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
			},
			async onQueryStarted(_, { dispatch, queryFulfilled }) {
				try {
					const { data } = await queryFulfilled

					dispatch(
						channelRtkApi.util.updateQueryData('getRooms', undefined, (draft) => {
							draft.rooms.push({
								id: data.roomId,
								name: data.name,
								maxParticipants: data.maxParticipants,
								createdAt: new Date(data.createdAt),
								participants: [],
								participantCount: 0
							})
						})
					)
				} catch (e) {
					console.error(e)
				}
			}
		})
	})
})
