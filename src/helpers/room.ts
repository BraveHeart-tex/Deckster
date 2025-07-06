import { redirect } from 'next/navigation';

import { ApplicationError, ERROR_CODES } from '@/shared/errorCodes';
import { showErrorToast } from '@/src/components/ui/sonner';
import { ROUTES } from '@/src/lib/routes';

export const handleJoinRoomError = (error: unknown) => {
  console.error('Failed to join room:', error);

  if (!(error instanceof ApplicationError)) {
    showErrorToast('An unexpected error occurred. Please try again later.');
    return;
  }

  const code = error.data.code;

  if (code === ERROR_CODES.UNAUTHORIZED) {
    redirect(ROUTES.AUTH);
  }

  if (code === ERROR_CODES.NOT_FOUND) {
    showErrorToast('Room not found');
    redirect(ROUTES.HOME);
  }

  if (code === ERROR_CODES.VALIDATION_ERROR) {
    showErrorToast(
      'Unexpected error occurred while joining your room. Please try again later.'
    );
    redirect(ROUTES.HOME);
  }

  showErrorToast('An unexpected error occurred. Please try again later.');
};
