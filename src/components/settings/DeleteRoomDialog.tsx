import { useUser } from '@clerk/nextjs';
import { useMutation } from 'convex/react';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';

import { api } from '@/convex/_generated/api';
import { DOMAIN_ERROR_CODES } from '@/shared/domainErrorCodes';
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

export const DeleteRoomDialog = ({
  isOpen,
  onOpenChange,
}: CommonDialogProps) => {
  const [enteredCode, setEnteredCode] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const roomCode = useParams<RoomPageParameters>().code;
  const roomDetails = useRoomDetails();
  const deleteRoom = useMutation(api.rooms.deleteRoom);
  const router = useRouter();
  const { user } = useUser();

  if (!roomDetails || user?.id !== roomDetails.room.ownerId) {
    return null;
  }

  const handleRoomCodeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEnteredCode(event.target.value);
  };

  const handleDeleteRoom = async () => {
    setIsDeleting(true);
    try {
      await deleteRoom({ roomId: roomDetails.room._id });
      router.push(ROUTES.HOME);
      showSuccessToast('Room deleted successfully!');
      onOpenChange(false);
    } catch (error) {
      handleDomainError(error, {
        [DOMAIN_ERROR_CODES.AUTH.UNAUTHORIZED]: (error) => {
          showErrorToast(error.data.message);
          router.push(ROUTES.SIGN_IN);
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
    if (event.key === 'Enter' && enteredCode === roomCode) {
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
            Are you sure you want to delete this room?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action is permanent and cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className='space-y-2'>
          <p className='text-muted-foreground text-sm'>
            To confirm, please type the room code:
            <span className='text-foreground bg-muted ml-2 inline-flex items-center rounded-md border px-2 py-0.5 font-mono text-xs font-medium tracking-wide'>
              {roomCode}
            </span>
          </p>
          <Input
            type='text'
            placeholder='Enter room code'
            className='w-full'
            value={enteredCode}
            onChange={handleRoomCodeChange}
            maxLength={roomCode.length}
            disabled={isDeleting}
            onKeyDown={handleKeyDown}
            autoComplete='off'
          />
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button
            disabled={enteredCode !== roomCode || isDeleting}
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
