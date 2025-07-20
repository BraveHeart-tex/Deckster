'use client';

import { useAuth } from '@clerk/nextjs';
import { useMutation } from 'convex/react';
import { useParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { api } from '@/convex/_generated/api';
import { DOMAIN_ERROR_CODES } from '@/shared/domainErrorCodes';
import JoiningRoomIndicator from '@/src/components/room/JoiningRoomIndicator';
import { showErrorToast } from '@/src/components/ui/sonner';
import { handleDomainError } from '@/src/helpers/handleDomainError';
import { ROUTES } from '@/src/lib/routes';
import { RoomPageParameters } from '@/src/types/room';

interface RoomJoinControllerProps {
  isJoining: boolean;
  setIsJoining: (isJoining: boolean) => void;
}

const RoomJoinController = ({
  isJoining,
  setIsJoining,
}: RoomJoinControllerProps) => {
  const parameters = useParams<RoomPageParameters>();
  const { isSignedIn } = useAuth();
  const joinRoom = useMutation(api.rooms.joinRoom);
  const router = useRouter();

  useEffect(() => {
    if (!isSignedIn || !parameters.code) {
      return;
    }

    function toastAndRedirect(message: string, path: string = ROUTES.HOME) {
      return () => {
        showErrorToast(message);
        router.push(path);
      };
    }

    const doJoin = async () => {
      setIsJoining(true);
      try {
        await joinRoom({ roomCode: parameters.code });
        setIsJoining(false);
      } catch (error) {
        handleDomainError(error, {
          [DOMAIN_ERROR_CODES.AUTH.UNAUTHORIZED]: (domainError) => {
            toastAndRedirect(domainError.data.message, ROUTES.SIGN_IN);
          },
          [DOMAIN_ERROR_CODES.ROOM.INVALID_CODE]: (domainError) => {
            toastAndRedirect(domainError.data.message);
          },
          [DOMAIN_ERROR_CODES.ROOM.NOT_FOUND]: (domainError) => {
            toastAndRedirect(domainError.data.message);
          },
          [DOMAIN_ERROR_CODES.ROOM.BANNED]: (domainError) => {
            toastAndRedirect(domainError.data.message);
          },
          [DOMAIN_ERROR_CODES.ROOM.LOCKED]: (domainError) => {
            toastAndRedirect(domainError.data.message);
          },
        });
        setIsJoining(false);
      }
    };

    doJoin();
  }, [isSignedIn, joinRoom, parameters.code, router, setIsJoining]);

  if (isJoining) {
    return <JoiningRoomIndicator />;
  }

  return null;
};

export default RoomJoinController;
