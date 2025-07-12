'use client';

import { useUser } from '@clerk/nextjs';
import usePresence from '@convex-dev/presence/react';

import { api } from '@/convex/_generated/api';
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/src/components/ui/table';
import UserVotesTableRow from '@/src/components/vote/UserVotesTableRow';
import { useRoomDetails } from '@/src/hooks/useRoomDetails';

interface UserVotesTable {
  roomCode: string;
}

const UserVotesTable = ({ roomCode }: UserVotesTable) => {
  const roomDetails = useRoomDetails();

  const { user } = useUser();

  const presenceState = usePresence(api.presence, roomCode, user?.id as string);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead className="text-center">Story Points</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {!roomDetails ? (
          <TableRow>
            <TableHead colSpan={2} className="text-center">
              Loading...
            </TableHead>
          </TableRow>
        ) : roomDetails.participants.length === 0 ? (
          <TableRow>
            <TableHead colSpan={2} className="text-center">
              No users found
            </TableHead>
          </TableRow>
        ) : (
          roomDetails.participants.map((participant) => (
            <UserVotesTableRow
              key={participant._id}
              vote={participant.vote || ''}
              userName={participant.userName}
              participantUserId={participant.userId}
              participantId={participant._id}
              isOwner={participant.isOwner}
              isOnline={
                !!presenceState?.find((p) => p.userId === participant.userId)
                  ?.online
              }
            />
          ))
        )}
      </TableBody>
    </Table>
  );
};

export default UserVotesTable;
