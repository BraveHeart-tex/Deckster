'use client';

import { CopyIcon, MoreHorizontalIcon, Trash2Icon } from 'lucide-react';
import type { Doc } from '@/convex/_generated/dataModel';
import { useGuestSession } from '@/src/components/GuestSessionProvider';
import { Button } from '@/src/components/ui/button';
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/src/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/src/components/ui/dropdown-menu';
import { showErrorToast, showSuccessToast } from '@/src/components/ui/sonner';
import { MODAL_TYPES, useModalStore } from '@/src/store/modal';

interface RoomCardProps {
  room: Doc<'rooms'>;
  onJoinRoom: (roomCode: string) => void;
}

export const RoomCard = ({ onJoinRoom, room }: RoomCardProps) => {
  const { user } = useGuestSession();
  const openModal = useModalStore((state) => state.openModal);
  const isOwner = user?.id === room.ownerId;

  const handleCopyRoomCode = async () => {
    try {
      await navigator.clipboard.writeText(room.code);
      showSuccessToast('Room code copied to clipboard!');
    } catch (error) {
      console.error('Failed to copy room code:', error);
      showErrorToast('Failed to copy room code');
    }
  };

  return (
    <Card className='group flex flex-col justify-between transition-shadow hover:shadow-lg'>
      <CardHeader className='flex items-start justify-between gap-4'>
        <div className='min-w-0 flex-1'>
          <CardTitle className='line-clamp-2 text-xl leading-snug'>
            {room.name}
          </CardTitle>
          <CardDescription className='mt-2 font-mono text-xs tracking-[0.24em] uppercase'>
            {room.code}
          </CardDescription>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant='ghost'
              size='icon'
              aria-label={`More actions for ${room.name}`}
              className='shrink-0 opacity-70 transition-opacity group-hover:opacity-100'
            >
              <MoreHorizontalIcon className='h-4 w-4' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuItem onClick={handleCopyRoomCode}>
              <CopyIcon className='h-4 w-4' />
              Copy Room Code
            </DropdownMenuItem>
            {isOwner ? (
              <DropdownMenuItem
                variant='destructive'
                onClick={() =>
                  openModal({
                    type: MODAL_TYPES.DELETE_ROOM,
                    payload: {
                      roomId: room._id,
                      roomCode: room.code,
                      roomName: room.name,
                      ownerId: room.ownerId,
                    },
                  })
                }
              >
                <Trash2Icon className='h-4 w-4' />
                Delete Room
              </DropdownMenuItem>
            ) : null}
          </DropdownMenuContent>
        </DropdownMenu>
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
