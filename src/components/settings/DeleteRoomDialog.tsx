import { useMutation } from 'convex/react';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';

import { api } from '@/convex/_generated/api';
import type { Id } from '@/convex/_generated/dataModel';
import { DOMAIN_ERROR_CODES } from '@/shared/domainErrorCodes';
import { useGuestSession } from '@/src/components/GuestSessionProvider';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/src/components/ui/alert-dialog';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { showErrorToast, showSuccessToast } from '@/src/components/ui/sonner';
import { handleDomainError } from '@/src/helpers/handleDomainError';
import { useRoomDetails } from '@/src/hooks/useRoomDetails';
import { ROUTES } from '@/src/lib/routes';
import type { CommonDialogProps } from '@/src/types/dialog';
import type { RoomPageParameters } from '@/src/types/room';

interface DeleteRoomDialogProps extends CommonDialogProps {
  roomId?: Id<'rooms'>;
  roomCode?: string;
  roomName?: string;
  ownerId?: string;
}

export const DeleteRoomDialog = ({
  isOpen,
  onOpenChange,
  roomId: roomIdProp,
  roomCode: roomCodeProp,
  roomName,
  ownerId,
}: DeleteRoomDialogProps) => {
  const [enteredCode, setEnteredCode] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const routeRoomCode = useParams<RoomPageParameters>().code;
  const roomDetails = useRoomDetails();
  const deleteRoom = useMutation(api.rooms.deleteRoom);
  const router = useRouter();
  const { user } = useGuestSession();

  const targetRoomId = roomIdProp || roomDetails?.room._id;
  const targetRoomCode =
    roomCodeProp || roomDetails?.room.code || routeRoomCode;
  const targetRoomName = roomName || roomDetails?.room.name;
  const targetOwnerId = ownerId || roomDetails?.room.ownerId;
  const isDeletingCurrentRoom = routeRoomCode === targetRoomCode;

  if (
    !targetRoomId ||
    !targetRoomCode ||
    (targetOwnerId && user?.id !== targetOwnerId)
  ) {
    return null;
  }

  const handleRoomCodeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEnteredCode(event.target.value);
  };

  const handleDeleteRoom = async () => {
    setIsDeleting(true);
    try {
      await deleteRoom({
        roomId: targetRoomId,
        sessionToken: targetOwnerId as string,
      });
      showSuccessToast('Room deleted successfully!');
      if (isDeletingCurrentRoom) {
        router.push(ROUTES.HOME);
      } else {
        router.refresh();
      }
      onOpenChange(false);
    } catch (error) {
      handleDomainError(error, {
        [DOMAIN_ERROR_CODES.AUTH.UNAUTHORIZED]: (error) => {
          showErrorToast(error.data.message);
          router.refresh();
        },
        [DOMAIN_ERROR_CODES.ROOM.NOT_FOUND]: (error) => {
          showErrorToast(error.data.message);
          router.push(ROUTES.HOME);
        },
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && enteredCode === targetRoomCode) {
      handleDeleteRoom();
    }
  };

  const handleOpenChange = (isOpen: boolean) => {
    onOpenChange(isOpen);
    if (!isOpen) {
      setEnteredCode('');
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={handleOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you sure you want to delete this room
            {targetRoomName ? `, ${targetRoomName}` : ''}?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action is permanent and cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className='space-y-2'>
          <p className='text-muted-foreground text-sm'>
            To confirm, please type the room code:
            <span className='text-foreground bg-muted ml-2 inline-flex items-center rounded-md border px-2 py-0.5 font-mono text-xs font-medium tracking-wide'>
              {targetRoomCode}
            </span>
          </p>
          <Input
            type='text'
            placeholder='Enter room code'
            className='w-full'
            value={enteredCode}
            onChange={handleRoomCodeChange}
            maxLength={targetRoomCode.length}
            disabled={isDeleting}
            onKeyDown={handleKeyDown}
            autoComplete='off'
          />
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button
            disabled={enteredCode !== targetRoomCode || isDeleting}
            variant='destructive'
            onClick={handleDeleteRoom}
            isLoading={isDeleting}
            aria-label='Delete Room'
          >
            {isDeleting ? 'Deleting' : 'Delete'} Room
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
