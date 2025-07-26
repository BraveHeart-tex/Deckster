export const DOMAIN_ERROR_CODES = {
  ROOM: {
    INVALID_CODE: 'ROOM.VALIDATION.INVALID_CODE',
    NOT_FOUND: 'ROOM.NOT_FOUND',
    LOCKED: 'ROOM.ACCESS.LOCKED',
    BANNED: 'ROOM.ACCESS.BANNED',
    NOT_PARTICIPANT: 'ROOM.ACCESS.NOT_PARTICIPANT',
  },
  ROOM_SETTINGS: {
    NOT_FOUND: 'ROOM_SETTINGS.NOT_FOUND',
  },
  PARTICIPANT: {
    ALREADY_JOINED: 'PARTICIPANT.CONFLICT.ALREADY_JOINED',
    DISPLAY_NAME_TAKEN: 'PARTICIPANT.CONFLICT.DISPLAY_NAME_TAKEN',
    NOT_FOUND: 'PARTICIPANT.NOT_FOUND',
  },
  BANNED_USER: {
    NOT_FOUND: 'BANNED_USER.NOT_FOUND',
  },
  USER: {
    INVALID_NAME: 'USER.VALIDATION.INVALID_NAME',
  },
  AUTH: {
    UNAUTHORIZED: 'AUTH.UNAUTHORIZED',
    FORBIDDEN: 'AUTH.FORBIDDEN',
  },
} as const;

// Type-safe union of all domain error codes
type ValueOf<T> = T[keyof T];
export type DomainErrorCode =
  | ValueOf<(typeof DOMAIN_ERROR_CODES)['ROOM']>
  | ValueOf<(typeof DOMAIN_ERROR_CODES)['PARTICIPANT']>
  | ValueOf<(typeof DOMAIN_ERROR_CODES)['USER']>
  | ValueOf<(typeof DOMAIN_ERROR_CODES)['AUTH']>
  | ValueOf<(typeof DOMAIN_ERROR_CODES)['ROOM_SETTINGS']>
  | ValueOf<(typeof DOMAIN_ERROR_CODES)['BANNED_USER']>;

// Domain error shape
export type DomainErrorData = {
  code: DomainErrorCode;
  message: string;
};

// Domain-specific error class
import { ConvexError } from 'convex/values';

export class DomainError extends ConvexError<DomainErrorData> {
  constructor(data: DomainErrorData) {
    super(data);
  }
}
