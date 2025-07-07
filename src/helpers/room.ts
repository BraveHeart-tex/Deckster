import { redirect } from 'next/navigation';

import { ERROR_CODES } from '@/shared/errorCodes';
import { showErrorToast } from '@/src/components/ui/sonner';
import { handleApplicationError } from '@/src/helpers/handleApplicationError';
import { ROUTES } from '@/src/lib/routes';

export const handleJoinRoomError = (error: unknown) => {
  return handleApplicationError(error, {
    [ERROR_CODES.UNAUTHORIZED]: () => redirect(ROUTES.AUTH),
    [ERROR_CODES.NOT_FOUND]: () => {
      showErrorToast('Room not found');
      redirect(ROUTES.HOME);
    },
    [ERROR_CODES.VALIDATION_ERROR]: () => {
      showErrorToast('Invalid data while joining room. Please try again.');
      redirect(ROUTES.HOME);
    },
  });
};
