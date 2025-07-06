'use client';

import { useQuery } from 'convex/react';

import { api } from '@/convex/_generated/api';
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/src/components/ui/table';
import UserVotesTableRow from '@/src/components/vote/UserVotesTableRow';

interface UserVotesTable {
  roomCode: string;
}

const UserVotesTable = ({ roomCode }: UserVotesTable) => {
  const participantsWithVotes = useQuery(
    api.participants.getParticipantsWithVotes,
    {
      roomCode,
    }
  );

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead className="text-center">Story Points</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {!participantsWithVotes ? (
          <TableRow>
            <TableHead colSpan={2} className="text-center">
              Loading...
            </TableHead>
          </TableRow>
        ) : participantsWithVotes.length === 0 ? (
          <TableRow>
            <TableHead colSpan={2} className="text-center">
              No users found
            </TableHead>
          </TableRow>
        ) : (
          participantsWithVotes.map((participant) => (
            <UserVotesTableRow
              key={participant._id}
              vote={participant.vote}
              userName={participant.userName}
              participantUserId={participant.userId}
              participantId={participant._id}
              isOwner={participant.isOwner}
            />
          ))
        )}
      </TableBody>
    </Table>
  );
};

export default UserVotesTable;
