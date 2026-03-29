'use client';

import { useMemo } from 'react';
import { useGuestSession } from '@/src/components/GuestSessionProvider';
import { useRoomDetails } from '@/src/hooks/useRoomDetails';
import type { ViewMode } from '@/src/types/view';
import { UserVotesChart } from '../vote/UserVotesChart';
import { UserVotesTable } from '../vote/UserVotesTable';

interface ViewContainerProps {
  roomCode: string;
  viewMode: ViewMode;
}

export const VotesViewContainer = ({
  roomCode: _roomCode,
  viewMode,
}: ViewContainerProps) => {
  const roomDetails = useRoomDetails();

  const { user } = useGuestSession();

  const shouldHighlightConsensus: boolean = useMemo(() => {
    if (
      !roomDetails?.roomSettings?.highlightConsensusVotes ||
      !roomDetails?.room.votesRevealed
    ) {
      return false;
    }

    return (
      roomDetails.participants.reduce<string | false>(
        (accumulator, participant) => {
          if (accumulator === false) {
            return false;
          } // already failed

          const vote = participant.vote;
          if (vote === null || vote === undefined) {
            return false;
          } // missing vote

          if (accumulator === '') {
            return vote;
          } // first vote encountered

          return accumulator === vote ? accumulator : false; // mismatch => false
        },
        ''
      ) !== false
    );
  }, [
    roomDetails?.participants,
    roomDetails?.room.votesRevealed,
    roomDetails?.roomSettings?.highlightConsensusVotes,
  ]);

  return (
    <>
      {viewMode === 'table' && (
        <UserVotesTable
          roomDetails={roomDetails}
          shouldHighlightConsensus={shouldHighlightConsensus}
          user={user}
        />
      )}
      {viewMode === 'chart' && (
        <UserVotesChart
          roomDetails={roomDetails}
          shouldHighlightConsensus={shouldHighlightConsensus}
          user={user}
        />
      )}
    </>
  );
};
