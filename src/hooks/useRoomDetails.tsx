import { useParams } from 'next/navigation';

import { api } from '@/convex/_generated/api';
import { useQueryWithStatus } from '@/src/hooks/useQueryWithStatus';
import { RoomPageParameters } from '@/src/types/room';

export const useRoomDetails = () => {
  const roomCode = useParams<RoomPageParameters>().code;
  const { data } = useQueryWithStatus(api.rooms.getRoomWithDetailsByCode, {
    roomCode,
  });

  return data;
};
