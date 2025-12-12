import { Router, Request, Response } from 'express';
import { Server } from 'socket.io';
import { roomService } from '../services/room.service.js';
import { validateRoomId } from '../utils/validation.js';

export const createRoomRouter = (io: Server): Router => {
  const router = Router();

  // Get all rooms
  router.get('/rooms', (_req: Request, res: Response) => {
    try {
      const roomIds = roomService.getAllRoomIds();
      res.json({ rooms: roomIds });
    } catch (error) {
      console.error('Error getting rooms:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Create new room
  router.post('/rooms', (_req: Request, res: Response) => {
    try {
      const room = roomService.createRoom();
      res.status(201).json({
        roomId: room.id,
        maxParticipants: room.maxParticipants,
        createdAt: room.createdAt,
      });
    } catch (error) {
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
        participantCount: room.participants.length,
        maxParticipants: room.maxParticipants,
        createdAt: room.createdAt,
      });
    } catch (error) {
      console.error('Error getting room:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Delete room
  router.delete('/rooms/:id', (req: Request, res: Response) => {
    try {
      const roomId = validateRoomId(req.params.id);
      const room = roomService.getRoom(roomId);

      if (!room) {
        return res.status(404).json({ error: 'Room not found' });
      }

      // Notify all participants that room is closing
      io.to(roomId).emit('room-closed');

      // Delete the room
      roomService.deleteRoom(roomId);

      res.json({ message: 'Room deleted successfully' });
    } catch (error) {
      console.error('Error deleting room:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  return router;
};
