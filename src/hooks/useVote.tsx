import { useUser } from '@clerk/nextjs';
import { useMutation } from 'convex/react';
import { useParams, useRouter } from 'next/navigation';
import { useCallback } from 'react';
import { api } from '@/convex/_generated/api';
import { DOMAIN_ERROR_CODES } from '@/shared/domainErrorCodes';
import { showErrorToast } from '../components/ui/sonner';
import { handleDomainError } from '../helpers/handleDomainError';
import { ROUTES } from '../lib/routes';
import type { RoomPageParameters } from '../types/room';
import { useRoomDetails } from './useRoomDetails';

export const useVote = () => {
  const router = useRouter();
  const { code: roomCode } = useParams<RoomPageParameters>();
  const roomDetails = useRoomDetails();
  const { user } = useUser();

  const castVote = useMutation(api.votes.castVote).withOptimisticUpdate(
    (localStore, args) => {
      if (!user || !roomCode) return;

      const current = localStore.getQuery(api.rooms.getRoomWithDetailsByCode, {
        roomCode,
      });

      if (!current) return;

      localStore.setQuery(
        api.rooms.getRoomWithDetailsByCode,
        { roomCode },
        {
          ...current,
          currentUserVote: args.value,
          participants: current.participants.map((participant) =>
            participant.userId === user.id
              ? { ...participant, vote: args.value }
              : participant
          ),
        }
      );
    }
  );

  const vote = useCallback(
    async (option: string) => {
      const roomId = roomDetails?.room?._id;
      if (!roomId) return;

      try {
        await castVote({ roomId, value: option });
      } catch (error) {
        handleDomainError(error, {
          [DOMAIN_ERROR_CODES.AUTH.UNAUTHORIZED]: (err) => {
            showErrorToast(err.data.message);
            router.push(ROUTES.SIGN_IN);
          },
          [DOMAIN_ERROR_CODES.ROOM.NOT_FOUND]: (err) => {
            showErrorToast(err.data.message);
            router.push(ROUTES.HOME);
          },
        });
      }
    },
    [castVote, roomDetails?.room?._id, router]
  );

  return {
    roomDetails,
    vote,
  };
};
