'use client';

import { CheckIcon, CopyIcon } from 'lucide-react';
import { useState } from 'react';
import type { Doc } from '@/convex/_generated/dataModel';
import { Button } from '@/src/components/ui/button';
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/src/components/ui/card';
import { showErrorToast } from '@/src/components/ui/sonner';

interface RoomCardProps {
  room: Doc<'rooms'>;
  onJoinRoom: (roomCode: string) => void;
}

const RoomCard = ({ onJoinRoom, room }: RoomCardProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(room.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy room code:', error);
      showErrorToast('Failed to copy room code');
    }
  };

  return (
    <Card className='flex flex-col justify-between transition-shadow hover:shadow-lg'>
      <CardHeader className='flex items-center justify-between gap-4'>
        <CardTitle className='text-xl'>{room.name}</CardTitle>

        <div className='flex items-center justify-between rounded-md border bg-muted px-3 py-2'>
          <CardDescription className='font-mono text-sm tracking-wide'>
            {room.code}
          </CardDescription>

          <Button
            variant='ghost'
            size='icon'
            onClick={handleCopy}
            aria-label='Copy room code'
          >
            {copied ? (
              <CheckIcon className='h-4 w-4 text-success' />
            ) : (
              <CopyIcon className='h-4 w-4' />
            )}
          </Button>
        </div>
      </CardHeader>

      <CardFooter className='justify-end'>
        <Button
          onClick={() => onJoinRoom(room.code)}
          aria-label={`Join Room named ${room.name}`}
        >
          Enter Room
        </Button>
      </CardFooter>
    </Card>
  );
};

export default RoomCard;
