'use client';

import { VoteCard } from '@/src/components/vote/VoteCard';
import { DEFAULT_DECK } from '@/src/constants/vote.constants';
import { useVote } from '@/src/hooks/useVote';

export const VoteCards = () => {
  const { vote, roomDetails } = useVote();

  return (
    <fieldset
      className='flex max-w-screen-sm flex-wrap items-center justify-center gap-2'
      aria-label='Vote options'
    >
      <legend className='sr-only'>Vote options</legend>
      {(roomDetails?.roomSettings?.deck || DEFAULT_DECK).map(
        (option, index) => (
          <VoteCard
            key={`${index}--${option}`}
            option={option}
            isSelected={option === roomDetails?.currentUserVote}
            onClick={vote}
          />
        )
      )}
    </fieldset>
  );
};
