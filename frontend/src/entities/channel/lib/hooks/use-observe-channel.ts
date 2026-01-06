import { channelRtkApiCacheUtils } from '@entities/channel/lib/utils'
import { getSocketLastMessage, socketActions } from '@entities/socket'
import { useAppDispatch, useAppSelector } from '@shared/lib'
import { useCallback, useEffect } from 'react'
import { z } from 'zod'

export const roomCreatedSchema = z.object({
	topic: z.literal('room-created'),
	data: z.object({
		id: z.uuid(),
		name: z.string(),
		participantCount: z.number(),
		maxParticipants: z.number(),
		createdAt: z.string()
	}),
	timestamp: z.number()
})

export const roomUpdateSchema = z.object({
	topic: z.literal('room-updated'),
	data: z.object({
		id: z.uuid(),
		name: z.string(),
		participantCount: z.number(),
		maxParticipants: z.number(),
		createdAt: z.string()
	}),
	timestamp: z.number()
})

export const roomClosedSchema = z.object({
	topic: z.literal('room-closed'),
	data: z.object({
		id: z.uuid(),
		name: z.string(),
		participantCount: z.number(),
		maxParticipants: z.number(),
		createdAt: z.string()
	}),
	timestamp: z.number()
})

const topics = ['room-created', 'room-closed', 'room-updated'] as const

export const useObserveChannel = () => {
	const dispatch = useAppDispatch()
	const lastMessage = useAppSelector(getSocketLastMessage)

	const onRoomCreated = useCallback(
		(dto: unknown) => {
			const parsed = roomCreatedSchema.safeParse(dto)

			if (!parsed.success) {
				console.error(parsed.error)
				return
			}

			dispatch(channelRtkApiCacheUtils.appendRoom(parsed.data.data))
		},
		[dispatch]
	)

	const onRoomUpdated = useCallback(
		(dto: unknown) => {
			const parsed = roomUpdateSchema.safeParse(dto)

			if (!parsed.success) {
				console.error(parsed.error)
				return
			}

			dispatch(channelRtkApiCacheUtils.updateRoom(parsed.data.data))
		},
		[dispatch]
	)

	const onRoomClosed = useCallback(
		(dto: unknown) => {
			const parsed = roomClosedSchema.safeParse(dto)

			if (!parsed.success) {
				console.error(parsed.error)
				return
			}

			dispatch(channelRtkApiCacheUtils.deleteRoom(parsed.data.data.id))
		},
		[dispatch]
	)

	useEffect(() => {
		topics.forEach((topic) => {
			dispatch(socketActions.subscribe(topic))
		})

		return () => {
			topics.forEach((topic) => {
				dispatch(socketActions.unsubscribe(topic))
			})
		}
	}, [dispatch])

	useEffect(() => {
		if (!lastMessage || !topics.some((topic) => topic === lastMessage.topic)) {
			return
		}

		switch (lastMessage.topic) {
			case 'room-created': {
				onRoomCreated(lastMessage)
				break
			}
			case 'room-updated': {
				onRoomUpdated(lastMessage)
				break
			}
			case 'room-closed': {
				onRoomClosed(lastMessage)
				break
			}
			default:
				break
		}
	}, [lastMessage, onRoomClosed, onRoomCreated, onRoomUpdated])
}
