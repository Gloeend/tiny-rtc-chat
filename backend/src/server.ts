import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { config } from './config/index.js';
import { createRoomRouter } from './handlers/room.handler.js';
import { setupSocketHandlers } from './handlers/socket.handler.js';
import { ServerToClientEvents, ClientToServerEvents } from './types/index.js';
import { roomService } from './services/room.service.js';

// Initialize Express app
const app = express();
const server = http.createServer(app);

// Initialize Socket.IO with typed events
const io = new Server<ClientToServerEvents, ServerToClientEvents>(server, {
  cors: {
    origin: config.cors.origin,
    methods: config.cors.methods,
  },
});

// Middleware
app.use(cors());
app.use(express.json());

// Setup routes
app.use('/api', createRoomRouter(io));

// Setup Socket.IO handlers
setupSocketHandlers(io);

// Notify clients when room is deleted
roomService.onRoomDeleted((roomId, roomInfo) => {
  // Notify participants in the room
  io.to(roomId).emit('room-closed', roomInfo);
  // Broadcast to all clients (for lobby/room list)
  io.emit('room-closed', roomInfo);
});

// Health check endpoint
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start server
server.listen(config.port, () => {
  console.log(`
╔════════════════════════════════════════════════╗
║           WebRTC Signaling Server             ║
╠════════════════════════════════════════════════╣
║ Status: Running                                ║
║ Port: ${config.port}                                   ║
║ REST API: http://localhost:${config.port}/api         ║
║ WebSocket: ws://localhost:${config.port}              ║
║ CORS Origin: ${config.cors.origin}   ║
╚════════════════════════════════════════════════╝
  `);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Closing server gracefully...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('\nSIGINT received. Closing server gracefully...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});
