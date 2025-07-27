'use client';
import { useMutation } from 'convex/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { api } from '@/convex/_generated/api';
import type { Id } from '@/convex/_generated/dataModel';
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
import { ROUTES } from '@/src/lib/routes';
import type { CommonDialogProps } from '@/src/types/dialog';

interface ResetRoomPasswordDialogProps extends CommonDialogProps {
  roomId: Id<'rooms'>;
}

const ResetRoomPasswordDialog = ({
  isOpen,
  onOpenChange,
  roomId,
}: ResetRoomPasswordDialogProps) => {
  const [isResetting, setIsResetting] = useState(false);
  const resetRoomPassword = useMutation(api.rooms.resetRoomPassword);
  const router = useRouter();

  const handleResetRoomPassword = async () => {
    setIsResetting(true);
    try {
      await resetRoomPassword({ roomId });
      showSuccessToast('Room password reset successfully!');
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
        [DOMAIN_ERROR_CODES.AUTH.FORBIDDEN]: (error) => {
          showErrorToast(error.data.message);
          onOpenChange(false);
        },
      });
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you sure you want to reset the room password?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This will enable users to join the room without a password.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel asChild>
            <Button variant='outline' disabled={isResetting}>
              Cancel
            </Button>
          </AlertDialogCancel>
          <Button
            disabled={isResetting}
            isLoading={isResetting}
            onClick={handleResetRoomPassword}
          >
            {isResetting ? 'Resetting' : 'Reset'} Password
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ResetRoomPasswordDialog;
