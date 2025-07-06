'use client';
import { useShallow } from 'zustand/shallow';

import VoteCard from '@/src/components/vote/VoteCard';
import { VOTE_OPTIONS } from '@/src/constants/vote.constants';
import { useRoomStore } from '@/src/store/room';

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
