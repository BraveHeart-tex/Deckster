'use client';

import { useState } from 'react';

import RoomJoinController from '@/src/components/room/RoomJoinController';
import UserVotesTable from '@/src/components/vote/UserVotesTable';
import VoteCards from '@/src/components/vote/VoteCards';
import VoteControls from '@/src/components/vote/VoteControls';

interface VoteCardsProps {
  roomCode: string;
}

const RoomPageClient = ({ roomCode }: VoteCardsProps) => {
  const [isJoining, setIsJoining] = useState(true);

  if (isJoining) {
    return (
      <RoomJoinController isJoining={isJoining} setIsJoining={setIsJoining} />
    );
  }

  return (
    <div className="mx-auto flex h-full max-w-screen-md flex-col items-center justify-center space-y-4">
      <div className="space-y-2 text-center">
        <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight">
          Estimate the Effort
        </h2>
        <p className="text-muted-foreground max-w-md text-center text-sm">
          Pick a card that reflects how complex you think this task is.
        </p>
      </div>
      <VoteCards />
      <VoteControls />
      <UserVotesTable roomCode={roomCode} />
    </div>
  );
};

export default RoomPageClient;
