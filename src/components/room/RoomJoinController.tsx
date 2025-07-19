'use client';

import { useAuth } from '@clerk/nextjs';
import { useMutation } from 'convex/react';
import { useParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { api } from '@/convex/_generated/api';
import { DOMAIN_ERROR_CODES } from '@/shared/domainErrorCodes';
import JoiningRoomIndicator from '@/src/components/room/JoiningRoomIndicator';
import { showErrorToast } from '@/src/components/ui/sonner';
import {
  handleDomainError,
  isDomainError,
} from '@/src/helpers/handleDomainError';
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
        // TODO: handle auth.unauthorized error
        handleDomainError(error, {
          [DOMAIN_ERROR_CODES.ROOM.INVALID_CODE]: () => {
            toastAndRedirect(
              'Invalid room code. Make sure the room code is valid.'
            );
          },
          [DOMAIN_ERROR_CODES.ROOM.NOT_FOUND]: () => {
            toastAndRedirect('Room not found');
          },
          [DOMAIN_ERROR_CODES.ROOM.BANNED]: () => {
            toastAndRedirect(
              isDomainError(error)
                ? error.data.message
                : 'You are banned from this room'
            );
          },
          [DOMAIN_ERROR_CODES.ROOM.LOCKED]: () => {
            toastAndRedirect('Room is currently locked. Try again later.');
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
