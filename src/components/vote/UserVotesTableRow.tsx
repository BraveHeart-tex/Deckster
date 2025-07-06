'use client';
import { useUser } from '@clerk/nextjs';
import { memo, useMemo } from 'react';

import { Doc, Id } from '@/convex/_generated/dataModel';
import ChangeDisplaynameDialog from '@/src/components/room/ChangeDisplaynameDialog';
import { TableCell, TableRow } from '@/src/components/ui/table';
import UserVoteCard from '@/src/components/vote/UserVoteCard';
import { cn } from '@/src/lib/utils';
import { useRoomStore } from '@/src/store/room';

interface UserVotesTableRowProps {
  vote: Doc<'votes'> | null;
  participantId: Id<'participants'>;
  userName: string;
  participantUserId: string;
}

const UserVotesTableRow = memo(
  ({
    vote,
    userName,
    participantUserId,
    participantId,
  }: UserVotesTableRowProps) => {
    const votesRevealed = useRoomStore((state) => state.votesRevealed);
    const { user } = useUser();

    const isSelf = useMemo(() => {
      return user?.id && participantUserId && user.id === participantUserId;
    }, [user?.id, participantUserId]);

    return (
      <TableRow>
        <TableCell className={cn(isSelf && 'group font-semibold')}>
          <div className="flex items-center gap-2">
            <span className="truncate">
              {userName} {isSelf && '(You)'}{' '}
              {isSelf && (
                <ChangeDisplaynameDialog
                  defaultValue={userName}
                  participantId={participantId}
                />
              )}
            </span>
          </div>
        </TableCell>
        <TableCell className="flex items-center justify-center text-center">
          <UserVoteCard
            vote={vote?.value || ''}
            votesRevealed={votesRevealed}
          />
        </TableCell>
      </TableRow>
    );
  }
);

UserVotesTableRow.displayName = 'UserVotesTableRow';

export default UserVotesTableRow;
