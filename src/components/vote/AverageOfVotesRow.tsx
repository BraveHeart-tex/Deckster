'use client';

import { useMemo } from 'react';

import { TableHead, TableRow } from '@/src/components/ui/table';
import { useRoomDetails } from '@/src/hooks/useRoomDetails';

const AverageOfVotesRow = () => {
  const roomDetails = useRoomDetails();

  const average = useMemo(() => {
    if (!roomDetails?.participants || roomDetails.participants.length === 0) {
      return 'N/A';
    }

    let sum = 0;
    let count = 0;

    for (const participant of roomDetails.participants) {
      const vote = parseFloat(participant.vote || '0');
      if (!isNaN(vote)) {
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
      <TableHead className="font-semibold">Average</TableHead>
      <TableHead className="text-center font-semibold">
        {roomDetails.room.votesRevealed ? average : '?'}
      </TableHead>
    </TableRow>
  );
};

export default AverageOfVotesRow;
