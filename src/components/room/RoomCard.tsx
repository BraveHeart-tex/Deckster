'use client';

import { Doc } from '@/convex/_generated/dataModel';
import { Badge } from '@/src/components/ui/badge';
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
    <Card className="flex flex-col justify-between transition-shadow hover:shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">{room.name}</CardTitle>
          <Badge variant={room.isVotingActive ? 'default' : 'secondary'}>
            {room.isVotingActive ? 'Voting Active' : 'Waiting'}
          </Badge>
        </div>
      </CardHeader>
      <CardFooter className="justify-end">
        <Button onClick={() => onJoinRoom(room.code)}>Enter Room</Button>
      </CardFooter>
    </Card>
  );
};

export default RoomCard;
