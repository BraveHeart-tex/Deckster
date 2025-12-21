'use client';

import { useMemo } from 'react';

import { TableHead, TableRow } from '@/src/components/ui/table';
import { useRoomDetails } from '@/src/hooks/useRoomDetails';
import { cn } from '@/src/lib/utils';

export const AverageOfVotesRow = () => {
  const roomDetails = useRoomDetails();

  const average = useMemo(() => {
    if (!roomDetails?.participants || roomDetails.participants.length === 0) {
      return 'N/A';
    }

    let sum = 0;
    let count = 0;

    for (const participant of roomDetails.participants) {
      const vote = parseFloat(participant.vote || '0');
      if (!Number.isNaN(vote)) {
        sum += vote;
        count += 1;
      }
    }

    return count > 0 ? (sum / count).toFixed(2) : 'N/A';
  }, [roomDetails?.participants]);

  if (!roomDetails || !roomDetails.roomSettings?.showAverageOfVotes) {
    return null;
  }

  return (
    <TableRow>
      <TableHead className='font-semibold'>Average</TableHead>
      <TableHead className='relative text-center font-semibold'>
        <div className='relative inline-block h-6 w-12'>
          <span
            className={cn(
              'absolute inset-0 flex items-center justify-center opacity-100 transition-opacity duration-500',
              roomDetails.room.votesRevealed && 'opacity-0'
            )}
          >
            ?
          </span>
          <span
            className={cn(
              'absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-500',
              roomDetails.room.votesRevealed && 'opacity-100'
            )}
          >
            {average}
          </span>
        </div>
      </TableHead>
    </TableRow>
  );
};
