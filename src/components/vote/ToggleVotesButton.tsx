'use client';

import { useMutation } from 'convex/react';
import { useRouter } from 'next/navigation';
import { useMemo } from 'react';

import { api } from '@/convex/_generated/api';
import { DOMAIN_ERROR_CODES } from '@/shared/domainErrorCodes';
import { useGuestSession } from '@/src/components/GuestSessionProvider';
import { Button } from '@/src/components/ui/button';
import { showErrorToast } from '@/src/components/ui/sonner';
import { handleDomainError } from '@/src/helpers/handleDomainError';
import { useRoomDetails } from '@/src/hooks/useRoomDetails';

export const ToggleVotesButton = () => {
  const roomDetails = useRoomDetails();
  const { user } = useGuestSession();
  const router = useRouter();
  const roomHasVotes = useMemo(() => {
    if (!roomDetails) {
      return false;
    }

    return roomDetails.participants.some((participant) => participant.vote);
  }, [roomDetails]);

  const toggleVotesRevealed = useMutation(
    api.rooms.toggleVotesRevealed
  ).withOptimisticUpdate((localStore) => {
    if (!roomDetails || !roomDetails.roomSettings) {
      return;
    }

    if (
      !roomDetails.roomSettings.allowOthersToRevealVotes &&
      user?.id !== roomDetails.room.ownerId
    ) {
      return;
    }

    const current = localStore.getQuery(api.rooms.getRoomWithDetailsByCode, {
      roomCode: roomDetails.room.code,
      sessionToken: user?.id || '',
    });
    if (current) {
      localStore.setQuery(
        api.rooms.getRoomWithDetailsByCode,
        {
          roomCode: roomDetails.room.code,
          sessionToken: user?.id || '',
        },
        {
          ...current,
          room: {
            ...current.room,
            votesRevealed: !current.room.votesRevealed,
          },
        }
      );
    }
  });

  const handleRevealVotes = async () => {
    if (!roomDetails) {
      return;
    }

    if (!roomDetails.room.votesRevealed && !roomHasVotes) {
      return;
    }

    try {
      await toggleVotesRevealed({
        roomId: roomDetails.room._id,
        sessionToken: user?.id || '',
      });
    } catch (error) {
      handleDomainError(error, {
        [DOMAIN_ERROR_CODES.AUTH.UNAUTHORIZED]: (error) => {
          showErrorToast(error.data.message);
        },
        [DOMAIN_ERROR_CODES.ROOM.NOT_FOUND]: (error) => {
          showErrorToast(error.data.message);
          router.refresh();
        },
        [DOMAIN_ERROR_CODES.ROOM.NO_VOTES_TO_REVEAL]: (error) => {
          showErrorToast(error.data.message);
        },
      });
    }
  };

  return (
    <Button
      onClick={handleRevealVotes}
      disabled={!roomDetails?.room.votesRevealed && !roomHasVotes}
      className='min-w-[110px]'
      aria-label={roomDetails?.room.votesRevealed ? 'Hide votes' : 'Show votes'}
    >
      {roomDetails?.room.votesRevealed ? 'Hide' : 'Show'} Votes
    </Button>
  );
};
