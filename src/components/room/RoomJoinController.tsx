'use client';

import { useAuth } from '@clerk/nextjs';
import { useMutation } from 'convex/react';
import { useParams, useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

import { api } from '@/convex/_generated/api';
import { DOMAIN_ERROR_CODES } from '@/shared/domainErrorCodes';
import { JoiningRoomIndicator } from '@/src/components/room/JoiningRoomIndicator';
import { RoomPasswordForm } from '@/src/components/room/RoomPasswordFormDialog';
import { showErrorToast } from '@/src/components/ui/sonner';
import {
  defaultDomainErrorHandler,
  handleDomainError,
} from '@/src/helpers/handleDomainError';
import { useStateBus } from '@/src/hooks/useStateBus';
import { ROUTES } from '@/src/lib/routes';
import type { RoomPageParameters } from '@/src/types/room';

export const RoomJoinController = () => {
  const [isJoining, setIsJoining] = useStateBus('isJoiningRoom');
  const parameters = useParams<RoomPageParameters>();
  const { isSignedIn } = useAuth();
  const joinRoom = useMutation(api.rooms.joinRoom);
  const router = useRouter();
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  const handleJoinRoom = useCallback(
    async ({
      roomCode,
      roomPassword,
    }: {
      roomCode: string;
      roomPassword: string;
    }) => {
      setIsJoining(true);

      try {
        await joinRoom({ roomCode, roomPassword });
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
            [DOMAIN_ERROR_CODES.ROOM.INVALID_PASSWORD]: (domainError) => {
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
    },
    [joinRoom, setIsJoining, router]
  );

  const onPasswordFormSubmit = useCallback(
    async (roomPassword: string) => {
      await handleJoinRoom({
        roomCode: parameters.code,
        roomPassword,
      });
    },
    [handleJoinRoom, parameters.code]
  );

  useEffect(() => {
    if (!isSignedIn || !parameters.code) {
      return;
    }

    handleJoinRoom({
      roomCode: parameters.code,
      roomPassword: '',
    });
  }, [isSignedIn, parameters.code, handleJoinRoom]);

  if (isJoining) {
    if (showPasswordForm) {
      return <RoomPasswordForm onFormSubmit={onPasswordFormSubmit} />;
    }
    return <JoiningRoomIndicator />;
  }

  return null;
};
