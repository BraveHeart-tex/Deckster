'use client';

import { useUser } from '@clerk/nextjs';
import { useCallback, useMemo } from 'react';

import SettingsDialog from '@/src/components/settings/SettingsDialog';
import { Skeleton } from '@/src/components/ui/skeleton';
import DeleteEstimatesButton from '@/src/components/vote/DeleteEstimatesButton';
import ToggleVotesButton from '@/src/components/vote/ToggleVotesButton';
import { useRoomDetails } from '@/src/hooks/useRoomDetails';

const VoteControls = () => {
  const roomDetails = useRoomDetails();
  const { user } = useUser();

  const isCurrentUserModerator = useMemo(() => {
    return roomDetails?.participants.some(
      (participant) =>
        participant.isCurrentUser && participant.role === 'moderator'
    );
  }, [roomDetails?.participants]);

  const renderControls = useCallback(() => {
    if (!roomDetails) {
      return (
        // biome-ignore lint/a11y/useSemanticElements: its fine
        <div
          className='flex items-center gap-2'
          role='status'
          aria-live='polite'
          aria-label='Loading controls'
        >
          <span className='sr-only'>Loading controls...</span>
          <Skeleton className='w-20 h-9 rounded-md' />
          <Skeleton className='w-20 h-9 rounded-md' />
          <Skeleton className='size-9 rounded-md' />
        </div>
      );
    }

    if (roomDetails.room.ownerId === user?.id) {
      return (
        <>
          <DeleteEstimatesButton />
          <ToggleVotesButton />
          {roomDetails && roomDetails.room.ownerId === user?.id && (
            <SettingsDialog />
          )}
        </>
      );
    }

    return (
      <>
        {(roomDetails.roomSettings?.allowOthersToDeleteVotes ||
          isCurrentUserModerator) && <DeleteEstimatesButton />}
        {(roomDetails.roomSettings?.allowOthersToRevealVotes ||
          isCurrentUserModerator) && <ToggleVotesButton />}
      </>
    );
  }, [roomDetails, user?.id, isCurrentUserModerator]);

  return <div className='flex gap-2'>{renderControls()}</div>;
};

export default VoteControls;
