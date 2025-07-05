'use client';
import { Doc } from '@/convex/_generated/dataModel';
import { TableCell, TableRow } from '@/src/components/ui/table';
import { cn } from '@/src/lib/utils';
import { useRoomStore } from '@/src/store/room';
import { useUser } from '@clerk/nextjs';
import { CheckIcon } from 'lucide-react';
import { memo, useMemo } from 'react';

interface UserVotesTableRowProps {
  vote: Doc<'votes'> | null;
  userName: string;
  participantUserId: string;
}

const UserVotesTableRow = memo(
  ({ vote, userName, participantUserId }: UserVotesTableRowProps) => {
    const votesRevealed = useRoomStore((state) => state.votesRevealed);
    const { user } = useUser();

    const isSelf = useMemo(() => {
      return user?.id && participantUserId && user.id === participantUserId;
    }, [user?.id, participantUserId]);

    return (
      <TableRow>
        <TableCell className={cn(isSelf && 'font-semibold')}>
          <div className="flex items-center gap-2">
            <span className="truncate">
              {vote?.userName || userName} {isSelf && '(You)'}
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

interface UserVoteCardProps {
  vote: string | null;
  votesRevealed: boolean;
}

const UserVoteCard = ({ vote, votesRevealed }: UserVoteCardProps) => {
  return (
    <div className="h-12 w-8 [perspective:800px]">
      <div
        className={cn(
          'relative h-full w-full transition-transform duration-500 [transform-style:preserve-3d]',
          votesRevealed ? '[transform:rotateY(180deg)]' : ''
        )}
      >
        {/* Front face */}
        <div className="bg-muted text-muted-foreground absolute inset-0 flex items-center justify-center rounded-md text-sm font-medium [backface-visibility:hidden]">
          {vote ? <CheckIcon className="text-muted-foreground" /> : '?'}
        </div>

        {/* Back face */}
        <div className="bg-muted text-muted-foreground absolute inset-0 flex [transform:rotateY(180deg)] items-center justify-center rounded-md text-sm font-medium [backface-visibility:hidden]">
          {vote || '-'}
        </div>
      </div>
    </div>
  );
};

export default UserVotesTableRow;
