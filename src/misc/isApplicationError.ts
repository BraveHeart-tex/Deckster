import { ConvexError } from 'convex/values';

import { AppErrorData, ApplicationError } from '@/shared/errorCodes';

export const isApplicationError = (
  error: unknown
): error is ApplicationError => {
  return (
    error instanceof ConvexError &&
    typeof (error as ConvexError<AppErrorData>).data === 'object' &&
    error?.data !== null &&
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    typeof (error as any).data.code === 'string' &&
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    typeof (error as any).data.message === 'string'
  );
};
