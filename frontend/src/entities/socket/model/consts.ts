// Socket.IO Connection Configuration
export const SOCKET_CONFIG = {
	RECONNECTION_ATTEMPTS: 5,
	RECONNECTION_DELAY: 1000,
	RECONNECTION_DELAY_MAX: 5000,
	TIMEOUT: 20000,
	PING_INTERVAL: 30000 // 30 seconds
} as const

// Socket Events
export const SOCKET_EVENTS = {
	// System events
	CONNECT: 'connect',
	DISCONNECT: 'disconnect',
	CONNECT_ERROR: 'connect_error',
	ERROR: 'error',
	PING: 'ping',
	PONG: 'pong',

	// Room events
	JOIN: 'join',
	LEAVE: 'leave',
	ROOM_MESSAGE: 'room:message',

	// User events
	USER_JOINED: 'user:joined',
	USER_LEFT: 'user:left'
} as const

// Socket State
export const SOCKET_STATE = {
	CONNECTED: 'connected',
	DISCONNECTED: 'disconnected',
	CONNECTING: 'connecting',
	ERROR: 'error'
} as const
