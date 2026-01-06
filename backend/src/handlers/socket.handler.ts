import { Server } from 'socket.io';
import { TypedSocket, RoomInfo } from '../types/index.js';
import { roomService } from '../services/room.service.js';
import {
  validateJoinRoomData,
  validateRoomId,
  validateOfferData,
  validateAnswerData,
  validateIceCandidateData,
  validateToggleCameraData,
  ValidationError,
} from '../utils/validation.js';

const emitRoomUpdated = (io: Server, roomId: string): void => {
  const room = roomService.getRoom(roomId);
  if (room) {
    const roomInfo: RoomInfo = {
      id: room.id,
      name: room.name,
      participantCount: room.participants.length,
      maxParticipants: room.maxParticipants,
      createdAt: room.createdAt,
    };
    io.emit('room-updated', roomInfo);
  }
};

export const setupSocketHandlers = (io: Server): void => {
  io.on('connection', (socket: TypedSocket) => {
    console.log('User connected:', socket.id);

    // Join room handler
    socket.on('join-room', (data) => {
      try {
        const { roomId, userId, nickname, isCameraEnabled } = validateJoinRoomData(data);
        const room = roomService.getRoom(roomId);

        if (!room) {
          socket.emit('error', 'Room not found');
          return;
        }

        const participant = roomService.addParticipant(roomId, socket.id, userId, nickname, isCameraEnabled);

        if (!participant) {
          socket.emit('error', 'Could not join room. Room might be full.');
          return;
        }

        // Join the Socket.IO room
        socket.join(roomId);

        // Notify other participants about new user
        socket.to(roomId).emit('user-connected', participant);

        // Send existing participants to the new user
        const otherParticipants = roomService.getOtherParticipants(roomId, socket.id);
        if (otherParticipants.length > 0) {
          socket.emit('existing-users', otherParticipants);
        }

        // Broadcast room update to all clients
        emitRoomUpdated(io, roomId);

        console.log(`User ${participant.nickname} joined room ${roomId} (${room.participants.length}/${room.maxParticipants})`);
      } catch (error) {
        if (error instanceof ValidationError) {
          socket.emit('error', error.message);
        } else {
          console.error('Error in join-room:', error);
          socket.emit('error', 'Failed to join room');
        }
      }
    });

    // Leave room handler
    socket.on('leave-room', (data) => {
      try {
        const roomId = validateRoomId(data);
        const userId = roomService.getUserIdBySocketId(socket.id);
        const removed = roomService.removeParticipant(roomId, socket.id);

        if (removed && userId) {
          socket.to(roomId).emit('user-disconnected', userId);
          socket.leave(roomId);
          emitRoomUpdated(io, roomId);
          console.log(`User ${userId} left room ${roomId}`);
        }
      } catch (error) {
        if (error instanceof ValidationError) {
          socket.emit('error', error.message);
        } else {
          console.error('Error in leave-room:', error);
        }
      }
    });

    // WebRTC offer handler
    socket.on('offer', (data) => {
      try {
        const { targetUserId, offer } = validateOfferData(data);
        const targetSocketId = roomService.getSocketIdByUserId(targetUserId);
        const senderUserId = roomService.getUserIdBySocketId(socket.id);

        if (!targetSocketId) {
          socket.emit('error', 'Target user not found');
          return;
        }

        if (!senderUserId) {
          socket.emit('error', 'You must join a room first');
          return;
        }

        socket.to(targetSocketId).emit('offer', {
          offer,
          senderUserId,
        });
      } catch (error) {
        if (error instanceof ValidationError) {
          socket.emit('error', error.message);
        } else {
          console.error('Error in offer:', error);
        }
      }
    });

    // WebRTC answer handler
    socket.on('answer', (data) => {
      try {
        const { targetUserId, answer } = validateAnswerData(data);
        const targetSocketId = roomService.getSocketIdByUserId(targetUserId);
        const senderUserId = roomService.getUserIdBySocketId(socket.id);

        if (!targetSocketId) {
          socket.emit('error', 'Target user not found');
          return;
        }

        if (!senderUserId) {
          socket.emit('error', 'You must join a room first');
          return;
        }

        socket.to(targetSocketId).emit('answer', {
          answer,
          senderUserId,
        });
      } catch (error) {
        if (error instanceof ValidationError) {
          socket.emit('error', error.message);
        } else {
          console.error('Error in answer:', error);
        }
      }
    });

    // ICE candidate handler
    socket.on('ice-candidate', (data) => {
      try {
        const { targetUserId, candidate } = validateIceCandidateData(data);
        const targetSocketId = roomService.getSocketIdByUserId(targetUserId);
        const senderUserId = roomService.getUserIdBySocketId(socket.id);

        if (!targetSocketId) {
          socket.emit('error', 'Target user not found');
          return;
        }

        if (!senderUserId) {
          socket.emit('error', 'You must join a room first');
          return;
        }

        socket.to(targetSocketId).emit('ice-candidate', {
          candidate,
          senderUserId,
        });
      } catch (error) {
        if (error instanceof ValidationError) {
          socket.emit('error', error.message);
        } else {
          console.error('Error in ice-candidate:', error);
        }
      }
    });

    // Toggle camera handler
    socket.on('toggle-camera', (data) => {
      try {
        const { roomId, isEnabled } = validateToggleCameraData(data);
        const result = roomService.updateParticipantCamera(socket.id, isEnabled);

        if (!result) {
          socket.emit('error', 'You must join a room first');
          return;
        }

        // Notify all other participants in the room
        socket.to(roomId).emit('camera-toggled', {
          userId: result.userId,
          isEnabled,
        });
      } catch (error) {
        if (error instanceof ValidationError) {
          socket.emit('error', error.message);
        } else {
          console.error('Error in toggle-camera:', error);
        }
      }
    });

    // Disconnect handler
    socket.on('disconnect', () => {
      // Get userId before removing from rooms
      const userId = roomService.getUserIdBySocketId(socket.id);
      console.log('User disconnected:', userId || socket.id);

      // Remove user from all rooms they're in
      const affectedRooms = roomService.removeParticipantFromAllRooms(socket.id);

      // Notify other participants in affected rooms
      if (userId) {
        affectedRooms.forEach(roomId => {
          socket.to(roomId).emit('user-disconnected', userId);
          emitRoomUpdated(io, roomId);
        });
      }
    });
  });
};
