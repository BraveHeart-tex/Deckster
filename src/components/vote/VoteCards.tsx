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
      className="flex h-[4.375rem] w-[4.375rem] items-center justify-center text-lg font-semibold"
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
    <div className="flex max-w-screen-sm flex-wrap items-center justify-center gap-2">
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
