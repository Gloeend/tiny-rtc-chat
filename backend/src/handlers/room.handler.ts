import { Router, Request, Response } from 'express';
import { Server } from 'socket.io';
import { roomService } from '../services/room.service.js';
import { validateRoomId, validateCreateRoomData, ValidationError } from '../utils/validation.js';

export const createRoomRouter = (io: Server): Router => {
  const router = Router();

  // Get all rooms with full info
  router.get('/rooms', (_req: Request, res: Response) => {
    try {
      const rooms = roomService.getAllRoomsInfo();
      res.json({ rooms });
    } catch (error) {
      console.error('Error getting rooms:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Create new room
  router.post('/rooms', (req: Request, res: Response) => {
    try {
      const { name, maxParticipants } = validateCreateRoomData(req.body);
      const room = roomService.createRoom(name, maxParticipants);

      // Broadcast to all connected clients
      io.emit('room-created', {
        id: room.id,
        name: room.name,
        participantCount: 0,
        maxParticipants: room.maxParticipants,
        createdAt: room.createdAt,
      });

      res.status(201).json({
        roomId: room.id,
        name: room.name,
        maxParticipants: room.maxParticipants,
        createdAt: room.createdAt,
      });
    } catch (error) {
      if (error instanceof ValidationError) {
        return res.status(400).json({ error: error.message });
      }
      console.error('Error creating room:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Get room details
  router.get('/rooms/:id', (req: Request, res: Response) => {
    try {
      const roomId = validateRoomId(req.params.id);
      const room = roomService.getRoom(roomId);

      if (!room) {
        return res.status(404).json({ error: 'Room not found' });
      }

      res.json({
        id: room.id,
        name: room.name,
        participantCount: room.participants.length,
        maxParticipants: room.maxParticipants,
        createdAt: room.createdAt,
      });
    } catch (error) {
      console.error('Error getting room:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Rooms are deleted automatically after timeout (see config.room.emptyRoomTimeout)
  // No manual DELETE endpoint to prevent unauthorized deletion

  return router;
};
