import { redirect } from 'next/navigation';

import { ApplicationError, ErrorCode } from '@/shared/errorCodes';
import { showErrorToast } from '@/src/components/ui/sonner';
import { ROUTES } from '@/src/lib/routes';
import { isApplicationError } from '@/src/misc/isApplicationError';

export type ErrorHandlingAction = (error: ApplicationError) => void;
export type ErrorHandlerMap = Partial<Record<ErrorCode, ErrorHandlingAction>>;

export function handleApplicationError(
  error: unknown,
  handlers: ErrorHandlerMap = {},
  defaultHandler: (error: unknown) => void = defaultErrorHandler
) {
  if (!isApplicationError(error)) {
    return defaultHandler(error);
  }

  const code = error.data.code;
  const handler = handlers[code];

  if (handler) {
    return handler(error);
  }

  return defaultHandler(error);
}

export function defaultErrorHandler(error: unknown) {
  if (process.env.NODE_ENV === 'development') {
    console.error(error);
  }
  showErrorToast('An unexpected error occurred. Please try again later.');
  redirect(ROUTES.HOME);
}
