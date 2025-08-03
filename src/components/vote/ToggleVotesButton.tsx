'use client';

import { useUser } from '@clerk/nextjs';
import { useMutation } from 'convex/react';
import { useRouter } from 'next/navigation';

import { api } from '@/convex/_generated/api';
import { DOMAIN_ERROR_CODES } from '@/shared/domainErrorCodes';
import { Button } from '@/src/components/ui/button';
import { showErrorToast } from '@/src/components/ui/sonner';
import { handleDomainError } from '@/src/helpers/handleDomainError';
import { useRoomDetails } from '@/src/hooks/useRoomDetails';
import { ROUTES } from '@/src/lib/routes';

const ToggleVotesButton = () => {
  const roomDetails = useRoomDetails();
  const { user } = useUser();
  const router = useRouter();

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
    });
    if (current) {
      localStore.setQuery(
        api.rooms.getRoomWithDetailsByCode,
        { roomCode: roomDetails.room.code },
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

    try {
      await toggleVotesRevealed({
        roomId: roomDetails.room._id,
      });
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
  };

  return (
    <Button
      onClick={handleRevealVotes}
      className='min-w-[110px]'
      aria-label={roomDetails?.room.votesRevealed ? 'Hide votes' : 'Show votes'}
    >
      {roomDetails?.room.votesRevealed ? 'Hide' : 'Show'} Votes
    </Button>
  );
};

export default ToggleVotesButton;
