import { httpBaseApi } from '@shared/config/http-config'

import type { CreateRoomResponseDTO, GetRoomByIdResponseDTO, GetRoomsResponseDTO } from '../model/types'

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
		createRoom: build.mutation<CreateRoomResponseDTO, void>({
			query: () => {
				return {
					url: '/api/rooms',
					method: 'post'
				}
			},
			async onQueryStarted(_, { dispatch, queryFulfilled }) {
				const tempId = `temp-${Date.now()}`

				const patchResult = dispatch(
					channelRtkApi.util.updateQueryData('getRooms', undefined, (draft) => {
						draft.rooms.unshift(tempId)
					})
				)

				try {
					const { data } = await queryFulfilled
					dispatch(
						channelRtkApi.util.updateQueryData('getRooms', undefined, (draft) => {
							const index = draft.rooms.indexOf(tempId)
							if (index !== -1) {
								draft.rooms[index] = data.roomId
							}
						})
					)
				} catch {
					patchResult.undo()
				}
			}
		}),
		getRoomById: build.query<GetRoomByIdResponseDTO, string>({
			query: (roomId) => {
				return {
					url: `/api/rooms/${roomId}`,
					method: 'get'
				}
			}
		})
	})
})
