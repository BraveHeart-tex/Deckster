'use client';

import { useUser } from '@clerk/nextjs';
import type { PresenceState } from '@convex-dev/presence/react';
import { useConvexAuth } from 'convex/react';
import { useCallback, useMemo, useState } from 'react';
import { useRoomDetails } from '@/src/hooks/useRoomDetails';
import type { ViewMode } from '@/src/types/view';
import { PresenceSubscriber } from '../common/PresenceSubscriber';
import { UserVotesChart } from '../vote/UserVotesChart';
import { UserVotesTable } from '../vote/UserVotesTable';

interface ViewContainerProps {
  roomCode: string;
  viewMode: ViewMode;
}

export const VotesViewContainer = ({
  roomCode,
  viewMode,
}: ViewContainerProps) => {
  const [presenceState, setPresenceState] = useState<
    PresenceState[] | undefined
  >(undefined);
  const roomDetails = useRoomDetails();

  const { user } = useUser();
  const { isAuthenticated } = useConvexAuth();

  const onPresenceStateChange = useCallback(
    (state: PresenceState[] | undefined) => {
      setPresenceState(state);
    },
    []
  );

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
      {isAuthenticated &&
        user?.id !== undefined &&
        roomDetails?.roomSettings?.showUserPresence && (
          <PresenceSubscriber
            onStateChange={onPresenceStateChange}
            roomCode={roomCode}
            userId={user.id}
          />
        )}
      {viewMode === 'table' && (
        <UserVotesTable
          presenceState={presenceState}
          roomDetails={roomDetails}
          shouldHighlightConsensus={shouldHighlightConsensus}
          user={user}
        />
      )}
      {viewMode === 'chart' && (
        <UserVotesChart
          presenceState={presenceState}
          roomDetails={roomDetails}
          shouldHighlightConsensus={shouldHighlightConsensus}
          user={user}
        />
      )}
    </>
  );
};
