'use client';

import { useUser } from '@clerk/nextjs';
import type { PresenceState } from '@convex-dev/presence/react';
import { useConvexAuth } from 'convex/react';
import { useCallback, useMemo, useState } from 'react';

import PresenceSubscriber from '@/src/components/common/PresenceSubscriber';
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/src/components/ui/table';
import AverageOfVotesRow from '@/src/components/vote/AverageOfVotesRow';
import UserRowSkeleton from '@/src/components/vote/UserRowSkeleton';
import UserVotesTableRow from '@/src/components/vote/UserVotesTableRow';
import { useRoomDetails } from '@/src/hooks/useRoomDetails';

interface UserVotesTable {
  roomCode: string;
}

const UserVotesTable = ({ roomCode }: UserVotesTable) => {
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
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead className='text-center'>Story Points</TableHead>
            {roomDetails && roomDetails.room.ownerId === user?.id && (
              <TableHead className='text-center'>Actions</TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {!roomDetails ? (
            Array.from({ length: 2 }).map((_, index) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: this is a false positive
              <UserRowSkeleton key={index} />
            ))
          ) : (
            <>
              {roomDetails.participants.map((participant) => (
                <UserVotesTableRow
                  key={participant._id}
                  vote={participant.vote || ''}
                  userName={participant.userName}
                  participantUserId={participant.userId}
                  participantId={participant._id}
                  isOwner={roomDetails.room.ownerId === participant.userId}
                  isOnline={
                    !!presenceState?.find(
                      (p) => p.userId === participant.userId
                    )?.online
                  }
                  role={participant.role}
                  shouldHighlightConsensus={shouldHighlightConsensus}
                />
              ))}
              {roomDetails.roomSettings?.showAverageOfVotes ? (
                <AverageOfVotesRow />
              ) : null}
            </>
          )}
        </TableBody>
      </Table>
      {isAuthenticated &&
        user?.id !== undefined &&
        roomDetails?.roomSettings?.showUserPresence && (
          <PresenceSubscriber
            onStateChange={onPresenceStateChange}
            roomCode={roomCode}
            userId={user.id}
          />
        )}
    </>
  );
};

export default UserVotesTable;
