import { useQuery } from 'convex/react';
import { useParams } from 'next/navigation';

import { api } from '@/convex/_generated/api';
import { RoomPageParameters } from '@/src/types/room';

export const useRoomDetails = () => {
  const roomCode = useParams<RoomPageParameters>().code;
  return useQuery(api.rooms.getRoomWithDetailsByCode, {
    roomCode,
  });
};
