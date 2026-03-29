'use client';

import { useMemo } from 'react';
import { DEFAULT_DECK } from '@/src/constants/vote.constants';
import { useVote } from '@/src/hooks/useVote';
import { cn } from '@/src/lib/utils';
import type { CommonViewProps } from '@/src/types/view';
import { VoteCard } from './VoteCard';
import { VoteProgressBar } from './VoteProgressBar';

interface UserVotesChartProps extends CommonViewProps {}

export const UserVotesChart = ({
  roomDetails,
  shouldHighlightConsensus,
}: UserVotesChartProps) => {
  const { vote } = useVote();

  const votePercentages = useMemo(() => {
    const participants = roomDetails?.participants;
    if (!participants || participants.length === 0) {
      return {} as Record<string, number>;
    }

    const counts: Record<string, number> = Object.create(null);
    let totalVotes = 0;

    for (const { vote } of participants) {
      if (!vote) continue;
      totalVotes++;
      counts[vote] = (counts[vote] ?? 0) + 1;
    }

    if (totalVotes === 0) return {};

    for (const option in counts) {
      counts[option] = (counts[option] / totalVotes) * 100;
    }

    return counts;
  }, [roomDetails?.participants]);

  const voteToParticipantNames = useMemo(() => {
    const participants = roomDetails?.participants;
    if (!participants || participants.length === 0) {
      return {} as Record<string, string[]>;
    }

    const voteToParticipantNames: Record<string, string[]> = {};

    for (const { vote, userName } of participants) {
      if (!vote) continue;
      if (!voteToParticipantNames[vote]) {
        voteToParticipantNames[vote] = [];
      }
      voteToParticipantNames[vote].push(userName);
    }

    return voteToParticipantNames;
  }, [roomDetails?.participants]);

  const votesRevealed = roomDetails?.room.votesRevealed;

  return (
    <div className='flex flex-col gap-2 justify-center items-center w-full'>
      <fieldset className='flex flex-col gap-2 justify-center items-center w-full'>
        {(roomDetails?.roomSettings?.deck || DEFAULT_DECK).map(
          (option, index) => (
            <div
              key={`${index}--${option}`}
              className='relative w-full min-h-11'
            >
              <div
                className={cn(
                  'absolute top-1/2 z-10 -translate-y-1/2 transition-all duration-500 ease-in-out',
                  votesRevealed
                    ? 'left-0 translate-x-0'
                    : 'left-1/2 -translate-x-1/2'
                )}
              >
                <VoteCard
                  option={option}
                  isSelected={option === roomDetails?.currentUserVote}
                  onClick={vote}
                  size='small'
                />
              </div>
              <div
                className={cn(
                  'w-full min-w-0 overflow-hidden transition-all duration-600 ease-in-out',
                  votesRevealed
                    ? 'pl-13 opacity-100'
                    : 'pl-0 opacity-0 pointer-events-none duration-300'
                )}
              >
                <VoteProgressBar
                  participantNames={voteToParticipantNames[option]}
                  percentage={votePercentages[option] ?? 0}
                  shouldHighlightConsensus={shouldHighlightConsensus}
                  votesRevealed={votesRevealed}
                />
              </div>
            </div>
          )
        )}
      </fieldset>
    </div>
  );
};
