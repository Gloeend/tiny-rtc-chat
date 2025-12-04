import { Socket } from 'socket.io';

// Room types
export interface Participant {
  socketId: string;
  userId: string;
  nickname: string;
  joinedAt: Date;
}

export interface Room {
  id: string;
  participants: Participant[];
  createdAt: Date;
  maxParticipants: number;
}

// WebRTC signaling types
export interface OfferData {
  target: string;
  offer: RTCSessionDescriptionInit;
}

export interface AnswerData {
  target: string;
  answer: RTCSessionDescriptionInit;
}

export interface IceCandidateData {
  target: string;
  candidate: RTCIceCandidateInit;
}

// Socket events
export interface JoinRoomData {
  roomId: string;
  userId?: string;
  nickname?: string;
}

export interface ServerToClientEvents {
  'user-connected': (participant: Participant) => void;
  'user-disconnected': (socketId: string) => void;
  'existing-users': (participants: Participant[]) => void;
  'room-closed': () => void;
  'error': (message: string) => void;
  'offer': (data: { offer: RTCSessionDescriptionInit; sender: string }) => void;
  'answer': (data: { answer: RTCSessionDescriptionInit; sender: string }) => void;
  'ice-candidate': (data: { candidate: RTCIceCandidateInit; sender: string }) => void;
}

export interface ClientToServerEvents {
  'join-room': (data: JoinRoomData) => void;
  'leave-room': (roomId: string) => void;
  'offer': (data: OfferData) => void;
  'answer': (data: AnswerData) => void;
  'ice-candidate': (data: IceCandidateData) => void;
}

export type TypedSocket = Socket<ClientToServerEvents, ServerToClientEvents>;
