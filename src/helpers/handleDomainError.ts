import { DomainError, DomainErrorCode } from '@/shared/domainErrorCodes';
import { showErrorToast } from '@/src/components/ui/sonner';

export type DomainErrorHandlingAction = (error: DomainError) => void;
export type DomainErrorHandlerMap = Partial<
  Record<DomainErrorCode, DomainErrorHandlingAction>
>;

export function isDomainError(error: unknown): error is DomainError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'data' in error &&
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    typeof (error as any).data.code === 'string'
  );
}

export function handleDomainError(
  error: unknown,
  handlers: DomainErrorHandlerMap = {},
  defaultHandler: (error: unknown) => void = defaultDomainErrorHandler
) {
  if (!isDomainError(error)) {
    return defaultHandler(error);
  }

  const code = error.data.code;
  const handler = handlers[code];

  if (handler) {
    return handler(error);
  }

  return defaultHandler(error);
}

export function defaultDomainErrorHandler(error: unknown) {
  if (process.env.NODE_ENV === 'development') {
    console.error(error);
  }

  if (isDomainError(error)) {
    showErrorToast(error.data.message);
  } else {
    showErrorToast('An unexpected error occurred. Please try again later.');
  }
}
