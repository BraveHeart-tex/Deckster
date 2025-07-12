import { CheckIcon } from 'lucide-react';

import { cn } from '@/src/lib/utils';

interface UserVoteCardProps {
  vote: string | null;
  votesRevealed?: boolean;
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

export default UserVoteCard;
