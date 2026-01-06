import { v4 as uuidv4 } from 'uuid';
import { Room, Participant } from '../types/index.js';
import { config } from '../config/index.js';

class RoomService {
  private rooms = new Map<string, Room>();
  private cleanupInterval?: NodeJS.Timeout;
  private onRoomDeletedCallback?: (roomId: string, roomInfo: { id: string; name: string; participantCount: number; maxParticipants: number; createdAt: Date }) => void;

  constructor() {
    this.startCleanup();
  }

  onRoomDeleted(callback: (roomId: string, roomInfo: { id: string; name: string; participantCount: number; maxParticipants: number; createdAt: Date }) => void): void {
    this.onRoomDeletedCallback = callback;
  }

  createRoom(name: string, maxParticipants?: number): Room {
    const roomId = uuidv4();
    const room: Room = {
      id: roomId,
      name,
      participants: [],
      createdAt: new Date(),
      maxParticipants: maxParticipants ?? config.room.maxParticipants,
    };

    this.rooms.set(roomId, room);
    console.log(`Room created: ${roomId} (${name})`);
    return room;
  }

  getRoom(roomId: string): Room | undefined {
    return this.rooms.get(roomId);
  }

  getAllRoomIds(): string[] {
    return Array.from(this.rooms.keys());
  }

  getAllRoomsInfo(): Array<{
    id: string;
    name: string;
    participantCount: number;
    maxParticipants: number;
    createdAt: Date;
  }> {
    return Array.from(this.rooms.values()).map(room => ({
      id: room.id,
      name: room.name,
      participantCount: room.participants.length,
      maxParticipants: room.maxParticipants,
      createdAt: room.createdAt,
    }));
  }

  deleteRoom(roomId: string): boolean {
    const room = this.rooms.get(roomId);
    if (!room) return false;

    const roomInfo = {
      id: room.id,
      name: room.name,
      participantCount: room.participants.length,
      maxParticipants: room.maxParticipants,
      createdAt: room.createdAt,
    };

    const deleted = this.rooms.delete(roomId);
    if (deleted) {
      console.log(`Room deleted: ${roomId}`);
      this.onRoomDeletedCallback?.(roomId, roomInfo);
    }
    return deleted;
  }

  addParticipant(roomId: string, socketId: string, userId?: string, nickname?: string, isCameraEnabled = true): Participant | null {
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
      isCameraEnabled,
    };

    room.participants.push(participant);
    console.log(`Participant ${participant.nickname} (${socketId}) joined room ${roomId}`);
    return participant;
  }

  updateParticipantCamera(socketId: string, isEnabled: boolean): { roomId: string; userId: string } | null {
    for (const [roomId, room] of this.rooms.entries()) {
      const participant = room.participants.find(p => p.socketId === socketId);
      if (participant) {
        participant.isCameraEnabled = isEnabled;
        return { roomId, userId: participant.userId };
      }
    }
    return null;
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
