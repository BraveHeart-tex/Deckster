'use client';
import { TableCell, TableRow } from '@/components/ui/table';
import { generateAvatarUrl } from '@/lib/avatar.utils';
import { cn } from '@/lib/utils';
import { useRoomStore } from '@/store/room';
import { User } from '@/types/user';
import { CheckIcon } from 'lucide-react';
import Image from 'next/image';
import { memo, useMemo } from 'react';
import { useShallow } from 'zustand/shallow';

interface UserVotesTableRowProps {
  user: User;
  isSelf: boolean;
}

const UserVotesTableRow = memo(({ isSelf, user }: UserVotesTableRowProps) => {
  const vote = useRoomStore(useShallow((state) => state.votes[user.id]));
  const votesRevealed = useRoomStore((state) => state.votesRevealed);

  const avatarUrl = useMemo(() => {
    return generateAvatarUrl(user.id);
  }, [user.id]);

  return (
    <TableRow>
      <TableCell className={cn(isSelf && 'font-semibold')}>
        <div className="flex items-center gap-2">
          <Image
            src={avatarUrl}
            alt={`${user.name} avatar`}
            width={32}
            height={32}
            className="rounded-full object-cover"
          />
          <span className="truncate">
            {user.name} {isSelf && '(You)'}
          </span>
        </div>
      </TableCell>
      <TableCell className="flex items-center justify-center text-center">
        <UserVoteCard
          hasVoted={!!vote}
          vote={vote}
          votesRevealed={votesRevealed}
        />
      </TableCell>
    </TableRow>
  );
});

UserVotesTableRow.displayName = 'UserVotesTableRow';

interface UserVoteCardProps {
  vote: string | null;
  votesRevealed: boolean;
  hasVoted: boolean;
}

const UserVoteCard = ({ hasVoted, vote, votesRevealed }: UserVoteCardProps) => {
  const frontFace = useMemo(() => {
    if (!hasVoted) {
      return votesRevealed ? '?' : '-';
    }

    return <CheckIcon className="text-muted-foreground" />;
  }, [hasVoted, votesRevealed]);

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
          {frontFace}
        </div>

        {/* Back face */}
        <div className="bg-muted text-muted-foreground absolute inset-0 flex [transform:rotateY(180deg)] items-center justify-center rounded-md text-sm font-medium [backface-visibility:hidden]">
          {vote}
        </div>
      </div>
    </div>
  );
};

export default UserVotesTableRow;
