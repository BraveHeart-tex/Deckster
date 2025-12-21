'use client';

import { RoomJoinController } from '@/src/components/room/RoomJoinController';
import { VoteCards } from '@/src/components/vote/VoteCards';
import { VoteControls } from '@/src/components/vote/VoteControls';
import { VotingIndicator } from '@/src/components/vote/VotingIndicator';
import { useStateBus } from '@/src/hooks/useStateBus';
import type { ViewMode } from '@/src/types/view';
import { ViewModeToggle } from '../ViewModeToggle';
import { RoomParticipants } from './RoomParticipants';
import { VotesViewContainer } from './VotesViewContainer';

interface VoteCardsProps {
  roomCode: string;
  initialViewMode: ViewMode;
}

export const RoomPageClient = ({
  roomCode,
  initialViewMode,
}: VoteCardsProps) => {
  const [isJoining] = useStateBus('isJoiningRoom');

  return (
    <div className='mx-auto flex h-full max-w-3xl flex-col items-center  space-y-4'>
      {isJoining ? (
        <RoomJoinController />
      ) : (
        <>
          {initialViewMode === 'table' && (
            <div className='space-y-2 text-center'>
              <h2 className='scroll-m-20 text-2xl font-semibold tracking-tight'>
                Estimate the Effort
              </h2>
              <p className='text-muted-foreground max-w-md text-center text-sm'>
                Pick a card that reflects how complex you think this task is.
              </p>
            </div>
          )}
          <VotingIndicator />
          {initialViewMode === 'chart' && <RoomParticipants />}
          {initialViewMode === 'table' && <VoteCards />}
          <div className='flex items-center gap-2'>
            <VoteControls />
            <ViewModeToggle initialViewMode={initialViewMode} />
          </div>

          <VotesViewContainer roomCode={roomCode} viewMode={initialViewMode} />
        </>
      )}
    </div>
  );
};
