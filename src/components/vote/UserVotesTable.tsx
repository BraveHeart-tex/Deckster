'use client';
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/src/components/ui/table';
import UserVotesTableRow from '@/src/components/vote/UserVotesTableRow';
import { useRoomStore } from '@/src/store/room';
import { useMemo } from 'react';
import { useShallow } from 'zustand/shallow';

const UserVotesTable = () => {
  const usersRecord = useRoomStore(useShallow((state) => state.users));
  const currentUserId = useRoomStore((state) => state.currentUserId);

  const users = useMemo(() => {
    return Object.values(usersRecord);
  }, [usersRecord]);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead className="text-center">Story Points</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.length === 0 ? (
          <TableRow>
            <TableHead colSpan={2} className="text-center">
              No users found
            </TableHead>
          </TableRow>
        ) : (
          users.map((user) => (
            <UserVotesTableRow
              key={user.id}
              user={user}
              isSelf={user.id === currentUserId}
            />
          ))
        )}
      </TableBody>
    </Table>
  );
};

export default UserVotesTable;
