import { useParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { api } from '@/convex/_generated/api';
import { ERROR_CODES } from '@/shared/errorCodes';
import { showErrorToast } from '@/src/components/ui/sonner';
import { handleApplicationError } from '@/src/helpers/handleApplicationError';
import { useAuthenticatedQueryWithStatus } from '@/src/hooks/useAuthenticatedQueryWithStatus';
import { ROUTES } from '@/src/lib/routes';
import { RoomPageParameters } from '@/src/types/room';

let handledError = false;

export const useRoomDetails = () => {
  const roomCode = useParams<RoomPageParameters>().code;
  const { data, error, isError } = useAuthenticatedQueryWithStatus(
    api.rooms.getRoomWithDetailsByCode,
    roomCode
      ? {
          roomCode,
        }
      : 'skip'
  );

  const router = useRouter();

  useEffect(() => {
    if (error && isError && !handledError) {
      handleApplicationError(error, {
        [ERROR_CODES.UNAUTHORIZED]: () => {
          showErrorToast('You are not authorized to perform this action.');
          router.push(ROUTES.AUTH);
          handledError = true;
        },
        [ERROR_CODES.VALIDATION_ERROR]: () => {
          showErrorToast('Invalid room code');
          router.push(ROUTES.HOME);
          handledError = true;
        },
        [ERROR_CODES.NOT_FOUND]: () => {
          showErrorToast('Room not found');
          router.push(ROUTES.HOME);
          handledError = true;
        },
        [ERROR_CODES.FORBIDDEN]: () => {
          showErrorToast('You are not a participant of this room');
          router.push(ROUTES.HOME);
          handledError = true;
        },
      });
    }

    return () => {
      handledError = false;
    };
  }, [error, isError, router]);

  return data;
};
