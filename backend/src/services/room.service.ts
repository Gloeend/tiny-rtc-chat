import { v4 as uuidv4 } from 'uuid';
import { Room, Participant } from '../types';
import { config } from '../config';

class RoomService {
  private rooms = new Map<string, Room>();
  private cleanupInterval?: NodeJS.Timeout;

  constructor() {
    this.startCleanup();
  }

  createRoom(): Room {
    const roomId = uuidv4();
    const room: Room = {
      id: roomId,
      participants: [],
      createdAt: new Date(),
      maxParticipants: config.room.maxParticipants,
    };

    this.rooms.set(roomId, room);
    console.log(`Room created: ${roomId}`);
    return room;
  }

  getRoom(roomId: string): Room | undefined {
    return this.rooms.get(roomId);
  }

  getAllRoomIds(): string[] {
    return Array.from(this.rooms.keys());
  }

  deleteRoom(roomId: string): boolean {
    const deleted = this.rooms.delete(roomId);
    if (deleted) {
      console.log(`Room deleted: ${roomId}`);
    }
    return deleted;
  }

  addParticipant(roomId: string, socketId: string, userId?: string, nickname?: string): Participant | null {
    const room = this.rooms.get(roomId);
    if (!room) {
      console.error(`Room not found: ${roomId}`);
      return null;
    }

    if (room.participants.length >= room.maxParticipants) {
      console.error(`Room is full: ${roomId}`);
      return null;
    }

    // Check if user already in room
    if (room.participants.some(p => p.socketId === socketId)) {
      console.warn(`User already in room: ${socketId}`);
      return null;
    }

    const participant: Participant = {
      socketId,
      userId: userId || socketId,
      nickname: nickname || `User${socketId.substring(0, 4)}`,
      joinedAt: new Date(),
    };

    room.participants.push(participant);
    console.log(`Participant ${participant.nickname} (${socketId}) joined room ${roomId}`);
    return participant;
  }

  removeParticipant(roomId: string, socketId: string): boolean {
    const room = this.rooms.get(roomId);
    if (!room) return false;

    const initialLength = room.participants.length;
    room.participants = room.participants.filter(p => p.socketId !== socketId);

    const removed = room.participants.length !== initialLength;
    if (removed) {
      console.log(`Participant ${socketId} left room ${roomId}`);
    }

    return removed;
  }

  removeParticipantFromAllRooms(socketId: string): string[] {
    const affectedRooms: string[] = [];

    this.rooms.forEach((room, roomId) => {
      const removed = this.removeParticipant(roomId, socketId);
      if (removed) {
        affectedRooms.push(roomId);
      }
    });

    return affectedRooms;
  }

  getOtherParticipants(roomId: string, excludeSocketId: string): Participant[] {
    const room = this.rooms.get(roomId);
    if (!room) return [];

    return room.participants.filter(p => p.socketId !== excludeSocketId);
  }

  getSocketIdByUserId(userId: string): string | null {
    for (const room of this.rooms.values()) {
      const participant = room.participants.find(p => p.userId === userId);
      if (participant) return participant.socketId;
    }
    return null;
  }

  getUserIdBySocketId(socketId: string): string | null {
    for (const room of this.rooms.values()) {
      const participant = room.participants.find(p => p.socketId === socketId);
      if (participant) return participant.userId;
    }
    return null;
  }

  private startCleanup(): void {
    this.cleanupInterval = setInterval(() => {
      this.cleanupEmptyRooms();
    }, config.room.cleanupInterval);
  }

  private cleanupEmptyRooms(): void {
    const now = Date.now();
    const roomsToDelete: string[] = [];

    this.rooms.forEach((room, roomId) => {
      if (room.participants.length === 0) {
        const roomAge = now - room.createdAt.getTime();
        if (roomAge > config.room.emptyRoomTimeout) {
          roomsToDelete.push(roomId);
        }
      }
    });

    roomsToDelete.forEach(roomId => {
      this.deleteRoom(roomId);
      console.log(`Cleaned up empty room: ${roomId}`);
    });
  }

  stopCleanup(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
  }
}

export const roomService = new RoomService();
