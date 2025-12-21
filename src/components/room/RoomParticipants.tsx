'use client';
import { useRoomDetails } from '@/src/hooks/useRoomDetails';
import { UserAvatar } from '../common/UserAvatar';

export const RoomParticipants = () => {
  const roomDetails = useRoomDetails();

  return (
    <div className='flex flex-wrap gap-2'>
      {roomDetails?.participants.map((participant) => (
        <div
          key={participant._id}
          className='flex flex-col items-center justify-center gap-2'
        >
          <UserAvatar
            userId={participant.userId}
            username={participant.userName}
            presence={'online'}
            className='size-11'
          />
          <span className='max-w-28 text-center text-sm prose prose-sm prose-neutral font-semibold overflow-hidden truncate'>
            {participant.userName}
          </span>
        </div>
      ))}
    </div>
  );
};
