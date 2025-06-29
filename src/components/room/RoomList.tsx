'use client';

import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { Button } from '@/src/components/ui/button';
import { ROUTES } from '@/src/constants/routes';
import { useQuery } from 'convex/react';
import { useRouter } from 'next/navigation';

const RoomList = () => {
  const rooms = useQuery(api.room.getUserRooms) || [];
  const router = useRouter();

  if (rooms.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center space-y-6 py-16 text-center">
        <p className="text-muted-foreground max-w-md text-sm">
          No rooms yet. Create a new room or join an existing one to get
          started.
        </p>
        <div className="grid w-full max-w-sm grid-cols-1 gap-4 sm:grid-cols-2">
          <Button variant="default" className="w-full">
            Create Room
          </Button>
          <Button variant="secondary" className="w-full">
            Join Room
          </Button>
        </div>
      </div>
    );
  }

  const onJoinRoom = (roomId: Id<'rooms'>) => {
    router.push(ROUTES.ROOM(roomId));
  };

  return (
    <div className="mx-auto max-w-2xl">
      <h2 className="mb-4 text-2xl font-semibold">Your Rooms</h2>
      <div className="space-y-3">
        {rooms.map((room) => (
          <div
            key={room._id}
            className="flex items-center justify-between rounded-lg border bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
          >
            <div>
              <h3 className="text-lg font-semibold">{room.name}</h3>
              <p className="text-secondary text-sm">
                {room.isVotingActive ? (
                  <span className="text-green-600">• Voting Active</span>
                ) : (
                  <span className="text-gray-500">• Waiting</span>
                )}
                {room.currentStory && (
                  <span className="ml-2">Story: {room.currentStory}</span>
                )}
              </p>
            </div>
            <button
              onClick={() => onJoinRoom(room._id)}
              className="bg-primary hover:bg-primary-hover rounded px-4 py-2 text-white transition-colors"
            >
              Enter Room
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoomList;
