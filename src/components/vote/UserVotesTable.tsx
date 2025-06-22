'use client';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import UserVotesTableRow from '@/components/vote/UserVotesTableRow';
import { useRoomStore } from '@/store/room';
import { useMemo } from 'react';

const UserVotesTable = () => {
  const usersRecord = useRoomStore((state) => state.users);
  const votes = useRoomStore((state) => state.votes);
  const votesRevealed = useRoomStore((state) => state.votesRevealed);

  const currentUserId = useRoomStore((state) => state.currentUserId);

  const users = useMemo(() => {
    return Object.values(usersRecord);
  }, [usersRecord]);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <Button
            onClick={() => {
              useRoomStore.setState((state) => ({
                votesRevealed: !state.votesRevealed,
              }));
            }}
          >
            {votesRevealed ? 'Hide Votes' : 'Reveal Votes'}
          </Button>
        </TableRow>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead className="text-center">Story Points</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <UserVotesTableRow
            key={user.id}
            user={user}
            vote={votes[user.id]}
            votesRevealed={votesRevealed}
            isSelf={user.id === currentUserId}
            hasVoted={Boolean(votes[user.id])}
          />
        ))}
      </TableBody>
    </Table>
  );
};

export default UserVotesTable;
