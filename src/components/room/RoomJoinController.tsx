'use client';

import { useMutation } from 'convex/react';
import { useParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

import { api } from '@/convex/_generated/api';
import { DOMAIN_ERROR_CODES } from '@/shared/domainErrorCodes';
import { useGuestSession } from '@/src/components/GuestSessionProvider';
import { JoiningRoomIndicator } from '@/src/components/room/JoiningRoomIndicator';
import { RoomPasswordForm } from '@/src/components/room/RoomPasswordFormDialog';
import { showErrorToast } from '@/src/components/ui/sonner';
import {
  defaultDomainErrorHandler,
  handleDomainError,
} from '@/src/helpers/handleDomainError';
import { useStateBus } from '@/src/hooks/useStateBus';
import type { RoomPageParameters } from '@/src/types/room';

export const RoomJoinController = () => {
  const [isJoining, setIsJoining] = useStateBus('isJoiningRoom');
  const parameters = useParams<RoomPageParameters>();
  const { user } = useGuestSession();
  const joinRoom = useMutation(api.rooms.joinRoom);
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
        await joinRoom({
          roomCode,
          roomPassword,
          sessionToken: user?.id || '',
          userDisplayName: user?.name,
        });
        setIsJoining(false);
      } catch (error) {
        handleDomainError(
          error,
          {
            [DOMAIN_ERROR_CODES.AUTH.UNAUTHORIZED]: (domainError) => {
              showErrorToast(domainError.data.message);
              setIsJoining(false);
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
    [joinRoom, setIsJoining, user?.id, user?.name]
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
    if (!user?.id || !parameters.code) {
      return;
    }

    handleJoinRoom({
      roomCode: parameters.code,
      roomPassword: '',
    });
  }, [user?.id, parameters.code, handleJoinRoom]);

  if (isJoining) {
    if (showPasswordForm) {
      return <RoomPasswordForm onFormSubmit={onPasswordFormSubmit} />;
    }
    return <JoiningRoomIndicator />;
  }

  return null;
};
