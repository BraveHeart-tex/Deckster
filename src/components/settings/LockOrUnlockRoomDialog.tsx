'use client';
import { useMutation } from 'convex/react';
import { useRouter } from 'next/navigation';
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
import { showErrorToast, showSuccessToast } from '@/src/components/ui/sonner';
import { handleDomainError } from '@/src/helpers/handleDomainError';
import { useRoomDetails } from '@/src/hooks/useRoomDetails';
import { ROUTES } from '@/src/lib/routes';
import type { CommonDialogProps } from '@/src/types/dialog';

const LockOrUnlockRoomDialog = ({
  isOpen,
  onOpenChange,
}: CommonDialogProps) => {
  const [isPending, setIsPending] = useState(false);
  const roomDetails = useRoomDetails();
  const toggleRoomLock = useMutation(api.rooms.toggleRoomLock);
  const router = useRouter();

  if (!roomDetails) {
    return null;
  }

  const handleLockOrUnlockRoom = async () => {
    setIsPending(true);
    const successToastMessage = `Room ${
      roomDetails.room.locked ? 'unlocked' : 'locked'
    } successfully.`;

    try {
      await toggleRoomLock({ roomId: roomDetails.room._id });
      showSuccessToast(successToastMessage);
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
      setIsPending(false);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you sure you want to{' '}
            {roomDetails.room.locked ? 'lock' : 'unlock'} this room?
          </AlertDialogTitle>
          <AlertDialogDescription>
            {roomDetails.room.locked
              ? "Participants won't be able to join the room once it's locked."
              : "Participants will be able to join the room once it's unlocked."}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <Button
            disabled={isPending}
            onClick={handleLockOrUnlockRoom}
            isLoading={isPending}
            aria-label={`${roomDetails.room.locked ? 'Unlock' : 'Lock'} room`}
          >
            {roomDetails.room.locked ? 'Unlock Room' : 'Lock Room'}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default LockOrUnlockRoomDialog;
