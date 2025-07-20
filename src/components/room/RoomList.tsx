'use client';

import { AlertTriangleIcon, PlusCircleIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ReactNode } from 'react';

import CreateRoomFormDialog from '@/src/components/room/CreateRoomFormDialog';
import JoinRoomDialog from '@/src/components/room/JoinRoomDialog';
import RoomCard from '@/src/components/room/RoomCard';
import RoomCardSkeleton from '@/src/components/room/RoomCardSkeleton';
import { useUserRooms } from '@/src/hooks/useUserRooms';
import { ROUTES } from '@/src/lib/routes';

const RoomList = () => {
  const { data: rooms, isPending, isError } = useUserRooms();
  const router = useRouter();

  const onJoinRoom = (roomCode: string) => {
    router.refresh();
    router.push(ROUTES.ROOM(roomCode));
  };

  const renderFallback = (icon: ReactNode, message: string) => (
    <div className="flex flex-1 flex-col items-center justify-center space-y-4">
      {icon}
      <p className="text-muted-foreground text-sm">{message}</p>
      <div className="flex items-center space-x-2">
        <JoinRoomDialog />
        <CreateRoomFormDialog />
      </div>
    </div>
  );

  return (
    <div className="flex h-full flex-col space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Your Rooms</h2>
        <div className="flex items-center space-x-2">
          <JoinRoomDialog />
          <CreateRoomFormDialog />
        </div>
      </div>

      {isPending ? (
        <div className="grid h-max grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <RoomCardSkeleton key={index} />
          ))}
        </div>
      ) : isError ? (
        renderFallback(
          <AlertTriangleIcon className="text-destructive h-12 w-12" />,
          'Failed to load rooms. Please try again.'
        )
      ) : rooms && rooms.length === 0 ? (
        renderFallback(
          <PlusCircleIcon className="text-muted-foreground h-12 w-12" />,
          'You don’t have any rooms yet. Create one and invite others!'
        )
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {rooms.map((room) => (
            <RoomCard key={room._id} room={room} onJoinRoom={onJoinRoom} />
          ))}
        </div>
      )}
    </div>
  );
};

export default RoomList;
