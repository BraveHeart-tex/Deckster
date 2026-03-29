'use client';

import { useRoomDetails } from '@/src/hooks/useRoomDetails';
import { UserAvatar } from '../common/UserAvatar';

export const RoomParticipants = () => {
  const roomDetails = useRoomDetails();

  return (
    <div className='flex flex-wrap justify-center gap-4'>
      {roomDetails?.participants.map((participant) => (
        <div
          key={participant._id}
          className='bg-card/60 flex w-24 flex-col items-center gap-2 rounded-2xl border px-3 py-3 text-center shadow-sm backdrop-blur-sm'
          title={participant.userName}
        >
          <UserAvatar
            userId={participant.userId}
            username={participant.userName}
            hasVoted={!!participant.vote}
            role={participant.isOwner ? 'owner' : participant.role}
            className='size-12'
          />
          <span className='block w-full truncate text-sm leading-none font-semibold'>
            {participant.userName}
          </span>
        </div>
      ))}
    </div>
  );
};
