export type Participant = {
	socketId: string
	userId: string
	nickname: string
	joinedAt: Date
}

export type Channel = {
	id: string
	participants: Participant[]
	createdAt: string
	name: string
	maxParticipants: number
	participantCount: number
}

export type GetRoomsResponseDTO = {
	rooms: Omit<Channel, 'participants'>[]
}

export type GetRoomByIdResponseDTO = Channel

export type CreateRoomResponseDTO = {
	roomId: string
	maxParticipants: number
	createdAt: string
	name: string
}

export type CreateRoomBodyDTO = {
	name: string
	maxParticipants?: number
}
