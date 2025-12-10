import { JoinRoomData, OfferData, AnswerData, IceCandidateData } from '../types';

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export const validateRoomId = (roomId: unknown): string => {
  if (typeof roomId !== 'string' || roomId.trim().length === 0) {
    throw new ValidationError('Invalid room ID');
  }
  return roomId.trim();
};

export const validateUserId = (userId: unknown): string => {
  if (typeof userId !== 'string' || userId.trim().length === 0) {
    throw new ValidationError('Invalid user ID');
  }
  return userId.trim();
};

export const validateJoinRoomData = (data: unknown): JoinRoomData => {
  if (!data || typeof data !== 'object') {
    throw new ValidationError('Invalid join room data');
  }

  const { roomId, userId } = data as Partial<JoinRoomData>;

  return {
    roomId: validateRoomId(roomId),
    userId: userId ? validateUserId(userId) : undefined,
  };
};

export const validateOfferData = (data: unknown): OfferData => {
  if (!data || typeof data !== 'object') {
    throw new ValidationError('Invalid offer data');
  }

  const { targetUserId, offer } = data as Partial<OfferData>;

  if (!targetUserId || typeof targetUserId !== 'string') {
    throw new ValidationError('Invalid target user ID');
  }

  if (!offer || typeof offer !== 'object') {
    throw new ValidationError('Invalid offer data');
  }

  return { targetUserId, offer };
};

export const validateAnswerData = (data: unknown): AnswerData => {
  if (!data || typeof data !== 'object') {
    throw new ValidationError('Invalid answer data');
  }

  const { targetUserId, answer } = data as Partial<AnswerData>;

  if (!targetUserId || typeof targetUserId !== 'string') {
    throw new ValidationError('Invalid target user ID');
  }

  if (!answer || typeof answer !== 'object') {
    throw new ValidationError('Invalid answer data');
  }

  return { targetUserId, answer };
};

export const validateIceCandidateData = (data: unknown): IceCandidateData => {
  if (!data || typeof data !== 'object') {
    throw new ValidationError('Invalid ICE candidate data');
  }

  const { targetUserId, candidate } = data as Partial<IceCandidateData>;

  if (!targetUserId || typeof targetUserId !== 'string') {
    throw new ValidationError('Invalid target user ID');
  }

  if (!candidate || typeof candidate !== 'object') {
    throw new ValidationError('Invalid ICE candidate data');
  }

  return { targetUserId, candidate };
};
