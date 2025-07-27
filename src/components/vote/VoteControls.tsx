'use client';

import { useUser } from '@clerk/nextjs';
import { useCallback } from 'react';

import SettingsDialog from '@/src/components/settings/SettingsDialog';
import { Skeleton } from '@/src/components/ui/skeleton';
import DeleteEstimatesButton from '@/src/components/vote/DeleteEstimatesButton';
import ToggleVotesButton from '@/src/components/vote/ToggleVotesButton';
import { useRoomDetails } from '@/src/hooks/useRoomDetails';

const VoteControls = () => {
  const roomDetails = useRoomDetails();
  const { user } = useUser();

  const renderControls = useCallback(() => {
    if (!roomDetails) {
      return (
        <div className='flex items-center gap-2'>
          <Skeleton className='w-[5rem] h-9 rounded-md' />
          <Skeleton className='w-[5rem] h-9 rounded-md' />
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
        {roomDetails.roomSettings?.allowOthersToDeleteVotes && (
          <DeleteEstimatesButton />
        )}
        {roomDetails.roomSettings?.allowOthersToRevealVotes && (
          <ToggleVotesButton />
        )}
      </>
    );
  }, [roomDetails, user?.id]);

  return <div className='flex gap-2'>{renderControls()}</div>;
};

export default VoteControls;
