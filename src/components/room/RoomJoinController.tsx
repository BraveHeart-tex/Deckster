'use client';

import { useAuth } from '@clerk/nextjs';
import { useMutation } from 'convex/react';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { api } from '@/convex/_generated/api';
import { DOMAIN_ERROR_CODES } from '@/shared/domainErrorCodes';
import JoiningRoomIndicator from '@/src/components/room/JoiningRoomIndicator';
import { showErrorToast } from '@/src/components/ui/sonner';
import {
  defaultDomainErrorHandler,
  handleDomainError,
} from '@/src/helpers/handleDomainError';
import { useStateBus } from '@/src/hooks/useStateBus';
import { ROUTES } from '@/src/lib/routes';
import type { RoomPageParameters } from '@/src/types/room';

const RoomJoinController = () => {
  const [isJoining, setIsJoining] = useStateBus('isJoiningRoom');
  const parameters = useParams<RoomPageParameters>();
  const { isSignedIn } = useAuth();
  const joinRoom = useMutation(api.rooms.joinRoom);
  const router = useRouter();
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  useEffect(() => {
    if (!isSignedIn || !parameters.code) {
      return;
    }

    const doJoin = async () => {
      setIsJoining(true);
      try {
        await joinRoom({ roomCode: parameters.code });
        setIsJoining(false);
      } catch (error) {
        handleDomainError(
          error,
          {
            [DOMAIN_ERROR_CODES.AUTH.UNAUTHORIZED]: (domainError) => {
              showErrorToast(domainError.data.message);
              router.push(ROUTES.SIGN_IN);
            },
            [DOMAIN_ERROR_CODES.ROOM.PASSWORD_REQUIRED]: (domainError) => {
              showErrorToast(domainError.data.message);
              setShowPasswordForm(true);
            },
          },
          (error) => {
            defaultDomainErrorHandler(error);
            setIsJoining(false);
          }
        );
      }
    };

    doJoin();
  }, [isSignedIn, joinRoom, parameters.code, router, setIsJoining]);

  if (isJoining) {
    if (showPasswordForm) {
      return <div>Room password form</div>;
    }
    return <JoiningRoomIndicator />;
  }

  return null;
};

export default RoomJoinController;
