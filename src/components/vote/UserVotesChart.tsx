'use client';

import { useMemo } from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/src/components/ui/tooltip';
import { DEFAULT_DECK } from '@/src/constants/vote.constants';
import { useVote } from '@/src/hooks/useVote';
import { cn } from '@/src/lib/utils';
import type { CommonViewProps } from '@/src/types/view';
import { VoteCard } from './VoteCard';

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
    <TooltipProvider>
      <div className='flex flex-col gap-2 justify-center items-center w-full'>
        <fieldset className='flex flex-col gap-2 justify-center items-center w-full'>
          {(roomDetails?.roomSettings?.deck || DEFAULT_DECK).map(
            (option, index) => (
              <div
                key={`${index}--${option}`}
                className='flex gap-2 items-center w-full transition-all duration-500 ease-in-out'
              >
                <VoteCard
                  option={option}
                  isSelected={option === roomDetails?.currentUserVote}
                  onClick={vote}
                  size='small'
                />
                <div className='overflow-hidden w-full'>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div
                        className={cn(
                          'space-y-2 min-w-0 transition-all duration-500 ease-in-out',
                          votesRevealed && voteToParticipantNames[option]
                            ? 'opacity-100'
                            : 'opacity-0'
                        )}
                      >
                        <div className='h-3 w-full overflow-hidden rounded-md'>
                          <div
                            className={cn(
                              'h-full rounded-md transition-all duration-500 ease-in-out',
                              shouldHighlightConsensus
                                ? 'bg-success'
                                : 'bg-primary'
                            )}
                            style={{
                              width: `${votePercentages[option] ?? 0}%`,
                            }}
                          />
                        </div>
                        <div
                          className={cn(
                            'text-sm text-muted-foreground transition-all duration-500 ease-in-out',
                            votePercentages[option] !== undefined
                              ? 'opacity-100'
                              : 'opacity-0'
                          )}
                        >
                          {(votePercentages[option] ?? 0)?.toFixed(0)}%
                        </div>
                      </div>
                    </TooltipTrigger>
                    {voteToParticipantNames[option] !== undefined && (
                      <TooltipContent>
                        {voteToParticipantNames[option]?.join(', ')}
                      </TooltipContent>
                    )}
                  </Tooltip>
                </div>
              </div>
            )
          )}
        </fieldset>
      </div>
    </TooltipProvider>
  );
};
