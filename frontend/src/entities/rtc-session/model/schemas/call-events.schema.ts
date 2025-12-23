import { z } from 'zod'

export const existingUsersSchema = z.object({
	topic: z.literal('existing-users'),
	data: z.array(
		z.object({
			socketId: z.string(),
			userId: z.string(),
			nickname: z.string(),
			joinedAt: z.string()
		})
	),
	timestamp: z.number()
})

export const userConnectedSchema = z.object({
	topic: z.literal('user-connected'),
	timestamp: z.number(),
	data: z.object({
		socketId: z.string(),
		userId: z.string(),
		nickname: z.string(),
		joinedAt: z.string()
	})
})

export const userDisconnectedSchema = z.object({
	topic: z.literal('user-disconnected'),
	data: z.string(),
	timestamp: z.number()
})

export const offerSchema = z.object({
	topic: z.literal('offer'),
	data: z.object({
		senderUserId: z.string(),
		offer: z.object({
			sdp: z.string(),
			type: z.enum(['answer', 'offer', 'pranswer', 'rollback'] as const)
		})
	})
})

export const answerSchema = z.object({
	topic: z.literal('answer'),
	timestamp: z.number(),
	data: z.object({
		senderUserId: z.string(),
		answer: z.object({
			sdp: z.string(),
			type: z.enum(['answer', 'offer', 'pranswer', 'rollback'] as const)
		})
	})
})

export const iceCandidateSchema = z.object({
	topic: z.literal('ice-candidate'),
	timestamp: z.number(),
	data: z.object({
		senderUserId: z.string(),
		candidate: z.any()
	})
})
