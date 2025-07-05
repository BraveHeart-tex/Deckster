'use client';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/src/components/ui/table';
import UserVotesTableRow from '@/src/components/vote/UserVotesTableRow';
import { useQuery } from 'convex/react';

interface UserVotesTable {
  roomId: Id<'rooms'>;
}

const UserVotesTable = ({ roomId }: UserVotesTable) => {
  const participantsWithVotes = useQuery(
    api.participants.getParticipantsWithVotes,
    { roomId }
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
            />
          ))
        )}
      </TableBody>
    </Table>
  );
};

export default UserVotesTable;
