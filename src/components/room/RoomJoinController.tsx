'use client';

import { useAuth } from '@clerk/nextjs';
import { useMutation } from 'convex/react';
import { useParams } from 'next/navigation';
import { useEffect } from 'react';

import { api } from '@/convex/_generated/api';
import JoiningRoomIndicator from '@/src/components/room/JoiningRoomIndicator';
import { handleJoinRoomError } from '@/src/helpers/room';
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

  useEffect(() => {
    if (!isSignedIn || !parameters.code) {
      return;
    }

    const doJoin = async () => {
      setIsJoining(true);
      try {
        await joinRoom({ roomCode: parameters.code });
      } catch (error) {
        handleJoinRoomError(error);
      } finally {
        setIsJoining(false);
      }
    };

    doJoin();
  }, [isSignedIn, joinRoom, parameters.code, setIsJoining]);

  if (isJoining) {
    return <JoiningRoomIndicator />;
  }

  return null;
};

export default RoomJoinController;
