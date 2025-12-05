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
	maxParticipants: number
}

export type GetRoomsResponseDTO = {
	rooms: string[]
}

export type GetRoomByIdResponseDTO = Channel
