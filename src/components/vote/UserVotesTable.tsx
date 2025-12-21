'use client';

import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/src/components/ui/table';
import { AverageOfVotesRow } from '@/src/components/vote/AverageOfVotesRow';
import { UserRowSkeleton } from '@/src/components/vote/UserRowSkeleton';
import { UserVotesTableRow } from '@/src/components/vote/UserVotesTableRow';
import type { CommonViewProps } from '@/src/types/view';

interface UserVotesTableProps extends CommonViewProps {}

export const UserVotesTable = ({
  presenceState,
  roomDetails,
  shouldHighlightConsensus,
  user,
}: UserVotesTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead className='text-center'>Story Points</TableHead>
          <TableHead className='text-center'>
            {roomDetails && roomDetails.room.ownerId === user?.id && 'Actions'}
          </TableHead>
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
                  !!presenceState?.find((p) => p.userId === participant.userId)
                    ?.online
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
  );
};
