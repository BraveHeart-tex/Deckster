import { redirect } from 'next/navigation';

import { ERROR_CODES } from '@/shared/errorCodes';
import { showErrorToast } from '@/src/components/ui/sonner';
import { ROUTES } from '@/src/lib/routes';
import { isApplicationError } from '@/src/misc/isApplicationError';

export const handleJoinRoomError = (error: unknown) => {
  if (!isApplicationError(error)) {
    showErrorToast('An unexpected error occurred. Please try again later.');
    redirect(ROUTES.HOME);
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
