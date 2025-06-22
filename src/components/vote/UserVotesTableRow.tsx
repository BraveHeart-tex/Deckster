'use client';
import { TableCell, TableRow } from '@/components/ui/table';
import { generateAvatarUrl } from '@/lib/avatar.utils';
import { cn } from '@/lib/utils';
import { User } from '@/types/user';
import Image from 'next/image';
import { useMemo } from 'react';

interface UserVotesTableRowProps {
  user: User;
  vote: string;
  votesRevealed: boolean;
  isSelf: boolean;
}

const UserVotesTableRow = ({
  isSelf,
  user,
  vote,
  votesRevealed,
}: UserVotesTableRowProps) => {
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
      <TableCell>{votesRevealed ? vote : 'Pending Votes...'}</TableCell>
    </TableRow>
  );
};

export default UserVotesTableRow;
