export type Participant = {
	socketId: string
	userId: string
	nickname: string
	joinedAt: Date
}

export type Channel = {
	id: string
	participants: Participant[]
	createdAt: Date
	name: string
	maxParticipants: number
	participantCount: 0
}

export type GetRoomsResponseDTO = {
	rooms: Channel[]
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
