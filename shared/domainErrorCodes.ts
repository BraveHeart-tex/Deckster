export const DOMAIN_ERROR_CODES = {
  ROOM: {
    INVALID_CODE: 'ROOM.VALIDATION.INVALID_CODE',
    NOT_FOUND: 'ROOM.NOT_FOUND',
    LOCKED: 'ROOM.ACCESS.LOCKED',
    BANNED: 'ROOM.ACCESS.BANNED',
    NOT_PARTICIPANT: 'ROOM.ACCESS.NOT_PARTICIPANT',
  },
  PARTICIPANT: {
    ALREADY_JOINED: 'PARTICIPANT.CONFLICT.ALREADY_JOINED',
  },
  USER: {
    INVALID_NAME: 'USER.VALIDATION.INVALID_NAME',
  },
  AUTH: {
    UNAUTHORIZED: 'AUTH.UNAUTHORIZED',
  },
} as const;

// Type-safe union of all domain error codes
type ValueOf<T> = T[keyof T];
export type DomainErrorCode =
  | ValueOf<(typeof DOMAIN_ERROR_CODES)['ROOM']>
  | ValueOf<(typeof DOMAIN_ERROR_CODES)['PARTICIPANT']>
  | ValueOf<(typeof DOMAIN_ERROR_CODES)['USER']>
  | ValueOf<(typeof DOMAIN_ERROR_CODES)['AUTH']>;

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
