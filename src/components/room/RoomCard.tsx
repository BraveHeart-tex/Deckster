'use client';

import type { Doc } from '@/convex/_generated/dataModel';
import { Button } from '@/src/components/ui/button';
import {
  Card,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/src/components/ui/card';

interface RoomCardProps {
  room: Doc<'rooms'>;
  onJoinRoom: (roomCode: string) => void;
}

const RoomCard = ({ onJoinRoom, room }: RoomCardProps) => {
  return (
    <Card className='flex flex-col justify-between transition-shadow hover:shadow-lg'>
      <CardHeader>
        <CardTitle className='text-xl'>{room.name}</CardTitle>
      </CardHeader>
      <CardFooter className='justify-end'>
        <Button onClick={() => onJoinRoom(room.code)}>Enter Room</Button>
      </CardFooter>
    </Card>
  );
};

export default RoomCard;
