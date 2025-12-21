'use client';
import { useUser } from '@clerk/nextjs';
import { useMutation } from 'convex/react';
import { useParams, useRouter } from 'next/navigation';
import { useCallback } from 'react';

import { api } from '@/convex/_generated/api';
import { DOMAIN_ERROR_CODES } from '@/shared/domainErrorCodes';
import { showErrorToast } from '@/src/components/ui/sonner';
import { VoteCard } from '@/src/components/vote/VoteCard';
import { DEFAULT_DECK } from '@/src/constants/vote.constants';
import { handleDomainError } from '@/src/helpers/handleDomainError';
import { useRoomDetails } from '@/src/hooks/useRoomDetails';
import { ROUTES } from '@/src/lib/routes';
import type { RoomPageParameters } from '@/src/types/room';

export const VoteCards = () => {
  const router = useRouter();
  const roomPageParameters = useParams<RoomPageParameters>();
  const roomDetails = useRoomDetails();
  const { user } = useUser();
  const castVote = useMutation(api.votes.castVote).withOptimisticUpdate(
    (localStore, args) => {
      const current = localStore.getQuery(api.rooms.getRoomWithDetailsByCode, {
        roomCode: roomPageParameters.code,
      });
      if (current && user) {
        localStore.setQuery(
          api.rooms.getRoomWithDetailsByCode,
          { roomCode: roomPageParameters.code },
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
    }
  );

  const handleVote = useCallback(
    async (option: string) => {
      if (!roomDetails?.room) {
        return;
      }

      try {
        await castVote({ roomId: roomDetails.room._id, value: option });
      } catch (error) {
        handleDomainError(error, {
          [DOMAIN_ERROR_CODES.AUTH.UNAUTHORIZED]: (error) => {
            showErrorToast(error.data.message);
            router.push(ROUTES.SIGN_IN);
          },
          [DOMAIN_ERROR_CODES.ROOM.NOT_FOUND]: (error) => {
            showErrorToast(error.data.message);
            router.push(ROUTES.HOME);
          },
        });
      }
    },
    [castVote, roomDetails?.room, router]
  );

  return (
    <fieldset
      className='flex max-w-screen-sm flex-wrap items-center justify-center gap-2'
      aria-label='Vote options'
    >
      <legend className='sr-only'>Vote options</legend>
      {(roomDetails?.roomSettings?.deck || DEFAULT_DECK).map(
        (option, index) => (
          <VoteCard
            key={`${index}--${option}`}
            option={option}
            isSelected={option === roomDetails?.currentUserVote}
            onClick={handleVote}
          />
        )
      )}
    </fieldset>
  );
};
