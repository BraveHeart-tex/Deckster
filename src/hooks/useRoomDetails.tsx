import { useParams } from 'next/navigation';

import { api } from '@/convex/_generated/api';
import { useAuthenticatedQueryWithStatus } from '@/src/hooks/useAuthenticatedQueryWithStatus';
import { RoomPageParameters } from '@/src/types/room';

export const useRoomDetails = () => {
  const roomCode = useParams<RoomPageParameters>().code;
  const { data } = useAuthenticatedQueryWithStatus(
    api.rooms.getRoomWithDetailsByCode,
    roomCode
      ? {
          roomCode,
        }
      : 'skip'
  );

  return data;
};
