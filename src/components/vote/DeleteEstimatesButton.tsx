import { useUser } from '@clerk/nextjs';
import { useMutation } from 'convex/react';
import { useRouter } from 'next/navigation';
import { useMemo } from 'react';

import { api } from '@/convex/_generated/api';
import { DOMAIN_ERROR_CODES } from '@/shared/domainErrorCodes';
import { Button } from '@/src/components/ui/button';
import { showErrorToast } from '@/src/components/ui/sonner';
import { handleDomainError } from '@/src/helpers/handleDomainError';
import { useRoomDetails } from '@/src/hooks/useRoomDetails';
import { ROUTES } from '@/src/lib/routes';

const DeleteEstimatesButton = () => {
  const roomDetails = useRoomDetails();
  const { user } = useUser();
  const router = useRouter();

  const deleteVotes = useMutation(api.votes.deleteVotes).withOptimisticUpdate(
    (localStore) => {
      if (!roomDetails) {
        return;
      }

      if (
        !roomDetails.roomSettings?.allowOthersToDeleteVotes &&
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
              votesRevealed: false,
            },
            currentUserVote: null,
            participants: current.participants.map((participant) => ({
              ...participant,
              vote: null,
            })),
          }
        );
      }
    }
  );

  const handleDeleteEstimates = async () => {
    if (!roomDetails) {
      return;
    }
    try {
      await deleteVotes({
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

  const roomHasVotes: boolean = useMemo(() => {
    if (!roomDetails) {
      return false;
    }

    return roomDetails.participants.some((participant) => participant.vote);
  }, [roomDetails]);

  return (
    <Button
      onClick={handleDeleteEstimates}
      disabled={!roomHasVotes}
      variant='outline'
      aria-label='Delete estimates'
    >
      Delete Estimates
    </Button>
  );
};
export default DeleteEstimatesButton;
