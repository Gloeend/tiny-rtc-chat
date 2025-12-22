export const config = {
  port: process.env.PORT || 3001,

  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },

  room: {
    maxParticipants: 10,
    cleanupInterval: 60000, // 1 minute
    emptyRoomTimeout: 3600000, // 1 hour
  },
};
