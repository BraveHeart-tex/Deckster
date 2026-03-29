'use client';

import { useRoomDetails } from '@/src/hooks/useRoomDetails';
import { UserAvatar } from '../common/UserAvatar';

export const RoomParticipants = () => {
  const roomDetails = useRoomDetails();

  return (
    <div className='flex flex-wrap justify-center gap-5'>
      {roomDetails?.participants.map((participant) => (
        <div
          key={participant._id}
          className='flex min-w-28 flex-col items-center justify-center gap-2'
        >
          <UserAvatar
            userId={participant.userId}
            username={participant.userName}
            hasVoted={!!participant.vote}
            role={participant.isOwner ? 'owner' : participant.role}
            className='size-12'
          />
          <span className='max-w-28 truncate text-center text-sm font-semibold'>
            {participant.userName}
          </span>
        </div>
      ))}
    </div>
  );
};
