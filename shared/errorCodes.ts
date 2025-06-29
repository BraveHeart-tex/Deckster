import { ConvexError } from 'convex/values';

export const ERROR_CODES = {
  UNAUTHORIZED: 'UNAUTHORIZED',
  NOT_FOUND: 'NOT_FOUND',
  FORBIDDEN: 'FORBIDDEN',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  CONFLICT: 'CONFLICT',
  RESOURCE_INACTIVE: 'RESOURCE_INACTIVE',
} as const;

export type ErrorCode = (typeof ERROR_CODES)[keyof typeof ERROR_CODES];

export type AppErrorData = {
  code: ErrorCode;
  message: string;
};

export class ApplicationError extends ConvexError<AppErrorData> {
  constructor(data: AppErrorData) {
    super(data);
  }
}
