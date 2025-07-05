'use client';

import { api } from '@/convex/_generated/api';
import { Doc, Id } from '@/convex/_generated/dataModel';
import CreateRoomFormDialog from '@/src/components/room/CreateRoomFormDialog';
import JoinRoomDialog from '@/src/components/room/JoinRoomDialog';
import { Badge } from '@/src/components/ui/badge';
import { Button } from '@/src/components/ui/button';
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/src/components/ui/card';
import { ROUTES } from '@/src/constants/routes';
import { type Preloaded, usePreloadedQuery } from 'convex/react';

import { useRouter } from 'next/navigation';

interface RoomListProps {
  preloadedRooms: Preloaded<typeof api.rooms.getUserRooms>;
}

const RoomList = ({ preloadedRooms }: RoomListProps) => {
  const rooms = usePreloadedQuery(preloadedRooms);
  const router = useRouter();

  if (rooms.length === 0) {
    return (
      <div className="box-border flex min-h-svh flex-col items-center justify-center space-y-6 text-center">
        <p className="text-muted-foreground max-w-md text-sm">
          No rooms yet. Create a new room or join an existing one to get
          started.
        </p>
        <div className="grid w-full max-w-sm grid-cols-1 gap-4 sm:grid-cols-2">
          <CreateRoomFormDialog />
          <JoinRoomDialog />
        </div>
      </div>
    );
  }

  const onJoinRoom = (roomId: Id<'rooms'>) => {
    router.refresh();
    router.push(ROUTES.ROOM(roomId));
  };

  return (
    <div>
      <h2 className="mb-4 text-2xl font-semibold">Your Rooms</h2>
      <div className="space-y-3">
        {rooms.map((room) => (
          <RoomCard room={room} onJoinRoom={onJoinRoom} key={room._id} />
        ))}
      </div>
    </div>
  );
};

interface RoomCardProps {
  room: Doc<'rooms'>;
  onJoinRoom: (roomId: Id<'rooms'>) => void;
}

export const RoomCard = ({ onJoinRoom, room }: RoomCardProps) => {
  return (
    <Card className="flex flex-col justify-between transition-shadow hover:shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">{room.name}</CardTitle>
          <Badge variant={room.isVotingActive ? 'default' : 'secondary'}>
            {room.isVotingActive ? 'Voting Active' : 'Waiting'}
          </Badge>
        </div>
        {room.currentStory && (
          <CardDescription className="text-muted-foreground mt-2">
            Story: {room.currentStory}
          </CardDescription>
        )}
      </CardHeader>
      <CardFooter className="justify-end">
        <Button onClick={() => onJoinRoom(room._id)}>Enter Room</Button>
      </CardFooter>
    </Card>
  );
};

export default RoomList;
