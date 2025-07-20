'use client';
import { useMemo } from 'react';

import { Badge } from '@/src/components/ui/badge';
import { useRoomDetails } from '@/src/hooks/useRoomDetails';

const VotingIndicator = () => {
  const roomDetails = useRoomDetails();

  const voted: number = useMemo(() => {
    return roomDetails?.participants
      ? roomDetails.participants.filter((participant) => !!participant.vote)
          .length
      : 0;
  }, [roomDetails?.participants]);

  if (!roomDetails || !roomDetails.roomSettings?.showVotingIndicator) {
    return null;
  }

  return (
    <Badge
      variant={
        voted === roomDetails.participants.length ? 'success' : 'default'
      }
    >
      {voted} / {roomDetails.participants.length} Voted
    </Badge>
  );
};

export default VotingIndicator;
