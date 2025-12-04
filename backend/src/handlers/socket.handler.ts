import { Server } from 'socket.io';
import { TypedSocket } from '../types';
import { roomService } from '../services/room.service';
import {
  validateJoinRoomData,
  validateRoomId,
  validateOfferData,
  validateAnswerData,
  validateIceCandidateData,
  ValidationError,
} from '../utils/validation';

export const setupSocketHandlers = (io: Server): void => {
  io.on('connection', (socket: TypedSocket) => {
    console.log('User connected:', socket.id);

    // Join room handler
    socket.on('join-room', (data) => {
      try {
        const { roomId, userId, nickname } = validateJoinRoomData(data);
        const room = roomService.getRoom(roomId);

        if (!room) {
          socket.emit('error', 'Room not found');
          return;
        }

        const participant = roomService.addParticipant(roomId, socket.id, userId, nickname);

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
        const removed = roomService.removeParticipant(roomId, socket.id);

        if (removed) {
          socket.to(roomId).emit('user-disconnected', socket.id);
          socket.leave(roomId);
          console.log(`User ${socket.id} left room ${roomId}`);
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
        const { target, offer } = validateOfferData(data);
        socket.to(target).emit('offer', {
          offer,
          sender: socket.id,
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
        const { target, answer } = validateAnswerData(data);
        socket.to(target).emit('answer', {
          answer,
          sender: socket.id,
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
        const { target, candidate } = validateIceCandidateData(data);
        socket.to(target).emit('ice-candidate', {
          candidate,
          sender: socket.id,
        });
      } catch (error) {
        if (error instanceof ValidationError) {
          socket.emit('error', error.message);
        } else {
          console.error('Error in ice-candidate:', error);
        }
      }
    });

    // Disconnect handler
    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);

      // Remove user from all rooms they're in
      const affectedRooms = roomService.removeParticipantFromAllRooms(socket.id);

      // Notify other participants in affected rooms
      affectedRooms.forEach(roomId => {
        socket.to(roomId).emit('user-disconnected', socket.id);
      });
    });
  });
};
