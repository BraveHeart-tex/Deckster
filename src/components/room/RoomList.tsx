'use client';

import { type Preloaded, usePreloadedQuery } from 'convex/react';
import { PlusCircleIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { api } from '@/convex/_generated/api';
import CreateRoomFormDialog from '@/src/components/room/CreateRoomFormDialog';
import JoinRoomDialog from '@/src/components/room/JoinRoomDialog';
import RoomCard from '@/src/components/room/RoomCard';
import { ROUTES } from '@/src/lib/routes';

interface RoomListProps {
  preloadedRooms: Preloaded<typeof api.rooms.getUserRooms>;
}

const RoomList = ({ preloadedRooms }: RoomListProps) => {
  const rooms = usePreloadedQuery(preloadedRooms);
  const router = useRouter();

  if (rooms.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-6 text-center">
        <div className="flex max-w-md flex-col items-center space-y-6">
          <PlusCircleIcon className="text-muted-foreground h-16 w-16" />
          <p className="text-muted-foreground text-sm">
            You don’t have any rooms yet. Create one and invite others!
          </p>
          <div className="flex items-center space-x-2">
            <CreateRoomFormDialog />
            <JoinRoomDialog />
          </div>
        </div>
      </div>
    );
  }

  const onJoinRoom = (roomCode: string) => {
    router.refresh();
    router.push(ROUTES.ROOM(roomCode));
  };

  return (
    <div className="flex h-full flex-col space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Your Rooms</h2>
        <div className="flex items-center space-x-2">
          <CreateRoomFormDialog />
          <JoinRoomDialog />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {rooms.map((room) => (
          <RoomCard key={room._id} room={room} onJoinRoom={onJoinRoom} />
        ))}
      </div>
    </div>
  );
};

export default RoomList;
