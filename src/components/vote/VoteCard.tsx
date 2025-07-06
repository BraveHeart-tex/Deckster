'use client';
import { Button } from '@/src/components/ui/button';
import { VoteOption } from '@/src/types/voteOption';

interface VoteCardProps {
  option: VoteOption;
  isSelected: boolean;
  onClick: (option: VoteOption) => void;
}

const VoteCard = ({ option, isSelected, onClick }: VoteCardProps) => {
  return (
    <Button
      aria-pressed={isSelected}
      title={option.description}
      type="button"
      className="flex h-[6.25rem] w-[4.375rem] items-center justify-center text-3xl font-medium"
      variant={isSelected ? 'default' : 'outline'}
      onClick={() => onClick(option)}
    >
      {option.label}
    </Button>
  );
};

export default VoteCard;
