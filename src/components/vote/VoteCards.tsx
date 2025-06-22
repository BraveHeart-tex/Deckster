'use client';
import { Button } from '@/components/ui/button';
import { VOTE_OPTIONS } from '@/constants/vote.constants';
import { useRoomStore } from '@/store/room';
import { VoteOption } from '@/types/voteOption';
import { useShallow } from 'zustand/shallow';

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
      className="flex h-16 w-full items-center justify-center text-lg font-semibold hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
      variant={isSelected ? 'default' : 'outline'}
      onClick={() => onClick(option)}
    >
      {option.label}
    </Button>
  );
};

const VoteCards = () => {
  const vote = useRoomStore(
    useShallow((state) => state.votes[state.currentUserId])
  );

  return (
    <div className="grid grid-cols-2 justify-center gap-4 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
      {VOTE_OPTIONS.map((option) => (
        <VoteCard
          key={option.value}
          option={option}
          isSelected={option.value === vote}
          onClick={(option) =>
            useRoomStore.getState().voteForCurrentUser(option.value)
          }
        />
      ))}
    </div>
  );
};

export default VoteCards;
