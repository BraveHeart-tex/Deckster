import { useParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { api } from '@/convex/_generated/api';
import { DOMAIN_ERROR_CODES } from '@/shared/domainErrorCodes';
import { showErrorToast } from '@/src/components/ui/sonner';
import { handleDomainError } from '@/src/helpers/handleDomainError';
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
      handleDomainError(error, {
        [DOMAIN_ERROR_CODES.AUTH.UNAUTHORIZED]: (domainError) => {
          showErrorToast(domainError.data.message);
          router.push(ROUTES.AUTH);
          handledError = true;
        },
        [DOMAIN_ERROR_CODES.ROOM.INVALID_CODE]: (domainError) => {
          showErrorToast(domainError.data.message);
          router.push(ROUTES.HOME);
          handledError = true;
        },
        [DOMAIN_ERROR_CODES.ROOM.NOT_FOUND]: (domainError) => {
          showErrorToast(domainError.data.message);
          router.push(ROUTES.HOME);
          handledError = true;
        },
        [DOMAIN_ERROR_CODES.ROOM.BANNED]: (domainError) => {
          showErrorToast(domainError.data.message);
          router.push(ROUTES.HOME);
          handledError = true;
        },
        [DOMAIN_ERROR_CODES.ROOM.NOT_PARTICIPANT]: (domainError) => {
          showErrorToast(domainError.data.message);
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
