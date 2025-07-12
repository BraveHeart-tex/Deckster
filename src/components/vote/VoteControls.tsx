'use client';

import { useUser } from '@clerk/nextjs';
import { useMutation } from 'convex/react';
import { redirect, useParams } from 'next/navigation';
import { useMemo } from 'react';

import { api } from '@/convex/_generated/api';
import { ERROR_CODES } from '@/shared/errorCodes';
import SettingsDialog from '@/src/components/settings/SettingsDialog';
import { Button } from '@/src/components/ui/button';
import { showErrorToast } from '@/src/components/ui/sonner';
import { handleApplicationError } from '@/src/helpers/handleApplicationError';
import { useRoomDetails } from '@/src/hooks/useRoomDetails';
import { ROUTES } from '@/src/lib/routes';
import { RoomPageParameters } from '@/src/types/room';

const VoteControls = () => {
  const roomCode = useParams<RoomPageParameters>().code;
  const roomDetails = useRoomDetails();
  const { user } = useUser();

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
        roomCode,
      });
      if (current) {
        localStore.setQuery(
          api.rooms.getRoomWithDetailsByCode,
          { roomCode },
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
      roomCode,
    });
    if (current) {
      localStore.setQuery(
        api.rooms.getRoomWithDetailsByCode,
        { roomCode },
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

  const roomHasVotes: boolean = useMemo(() => {
    if (!roomDetails) {
      return false;
    }

    return roomDetails.participants.some((participant) => participant.vote);
  }, [roomDetails]);

  const handleDeleteEstimates = async () => {
    if (!roomDetails) {
      return;
    }
    try {
      await deleteVotes({
        roomId: roomDetails.room._id,
      });
    } catch (error) {
      handleApplicationError(error, {
        [ERROR_CODES.UNAUTHORIZED]: () => {
          showErrorToast('You are not authorized to perform this action.');
          redirect(ROUTES.AUTH);
        },
        [ERROR_CODES.NOT_FOUND]: () => {
          showErrorToast('Room not found');
          redirect(ROUTES.HOME);
        },
        [ERROR_CODES.FORBIDDEN]: () => {
          showErrorToast('Only the room creator can delete estimates.');
        },
      });
    }
  };

  const handleRevealVotes = async () => {
    if (!roomDetails) {
      return;
    }

    try {
      await toggleVotesRevealed({
        roomId: roomDetails.room._id,
      });
    } catch (error) {
      handleApplicationError(error, {
        [ERROR_CODES.UNAUTHORIZED]: () => {
          showErrorToast('You are not authorized to perform this action.');
          redirect(ROUTES.AUTH);
        },
        [ERROR_CODES.NOT_FOUND]: () => {
          showErrorToast('Room not found');
          redirect(ROUTES.HOME);
        },
        [ERROR_CODES.FORBIDDEN]: () => {
          showErrorToast('Only the room creator can reveal votes.');
        },
      });
    }
  };

  return (
    <div className="flex gap-2">
      <Button
        onClick={handleDeleteEstimates}
        disabled={!roomHasVotes}
        variant="outline"
      >
        Delete Estimates
      </Button>
      <Button onClick={handleRevealVotes} className="min-w-[110px]">
        {roomDetails && roomDetails.room.votesRevealed ? 'Hide' : 'Show'} Votes
      </Button>
      <SettingsDialog />
    </div>
  );
};

export default VoteControls;
