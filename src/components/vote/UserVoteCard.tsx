import { CheckIcon } from 'lucide-react';

import { cn } from '@/src/lib/utils';

interface UserVoteCardProps {
  vote: string | null;
  votesRevealed?: boolean;
  shouldHighlightConsensus?: boolean;
}

const UserVoteCard = ({
  vote,
  votesRevealed,
  shouldHighlightConsensus = false,
}: UserVoteCardProps) => {
  return (
    <div className="h-12 w-8 [perspective:800px]">
      <div
        className={cn(
          'relative h-full w-full transition-transform duration-500 [transform-style:preserve-3d]',
          votesRevealed ? '[transform:rotateY(180deg)]' : ''
        )}
      >
        {/* Front face */}
        <div className="bg-muted text-muted-foreground absolute inset-0 flex items-center justify-center rounded-md text-sm font-semibold [backface-visibility:hidden]">
          {vote ? (
            <CheckIcon className="text-muted-foreground text-base" />
          ) : (
            '?'
          )}
        </div>

        {/* Back face */}
        <div
          className={cn(
            'bg-muted text-muted-foreground absolute inset-0 flex [transform:rotateY(180deg)] items-center justify-center rounded-md text-base font-semibold [backface-visibility:hidden]',
            shouldHighlightConsensus && 'bg-success text-success-foreground'
          )}
        >
          {vote || '-'}
        </div>
      </div>
    </div>
  );
};

export default UserVoteCard;
