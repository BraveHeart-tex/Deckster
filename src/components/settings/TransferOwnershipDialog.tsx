'use client';
import { useUser } from '@clerk/nextjs';
import { useMutation } from 'convex/react';
import { CheckIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { api } from '@/convex/_generated/api';
import { DOMAIN_ERROR_CODES } from '@/shared/domainErrorCodes';
import UserAvatar from '@/src/components/common/UserAvatar';
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

interface TransferOwnershipDialogProps extends CommonDialogProps {
  selectedUserId?: string;
  selectedUserName?: string;
}

const TransferOwnershipDialog = ({
  isOpen,
  onOpenChange,
  selectedUserId,
  selectedUserName,
}: TransferOwnershipDialogProps) => {
  const roomDetails = useRoomDetails();
  const [selectedUser, setSelectedUser] = useState<string | null>(
    selectedUserId || null
  );
  const [isTransferring, setIsTransferring] = useState(false);
  const { user } = useUser();
  const transferRoomOwnership = useMutation(api.rooms.transferRoomOwnership);
  const router = useRouter();

  const handleTransferOwnership = async () => {
    if (!roomDetails) {
      return;
    }

    if (!selectedUser) {
      showErrorToast('Please select a user to transfer ownership to.');
      return;
    }

    setIsTransferring(true);
    try {
      await transferRoomOwnership({
        newOwnerId: selectedUser,
        roomId: roomDetails.room._id,
      });
      showSuccessToast('Ownership transferred successfully!');
      onOpenChange(false);
    } catch (error) {
      handleDomainError(error, {
        [DOMAIN_ERROR_CODES.AUTH.UNAUTHORIZED]: () => {
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
      setIsTransferring(false);
    }
  };

  const handleOpenChange = (isOpen: boolean) => {
    onOpenChange(isOpen);
    if (!isOpen) {
      setSelectedUser(null);
    }
  };

  if (!roomDetails) {
    return null;
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={handleOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Transfer Room Ownership</AlertDialogTitle>
          <AlertDialogDescription>
            {!selectedUserId && !selectedUserName ? (
              'Select the user you want to transfer ownership to. This action cannot be undone.'
            ) : (
              <>
                Are you sure you want to transfer ownership to &quot;
                {selectedUserName}&quot;?
              </>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        {!selectedUserId && !selectedUserName && (
          <div className='flex max-h-[300px] flex-col gap-2 overflow-y-auto'>
            {roomDetails.participants.map((participant) =>
              participant.userId === user?.id ? null : (
                <button
                  type='button'
                  aria-label={`Select user ${participant.userName} to transfer ownership to`}
                  key={participant._id}
                  className='hover:bg-muted relative flex items-center justify-between gap-2 rounded-md p-2 not-last:border-b'
                  onClick={setSelectedUser.bind(
                    null,
                    selectedUser === participant.userId
                      ? null
                      : participant.userId
                  )}
                >
                  <div className='flex items-center gap-2'>
                    <UserAvatar
                      userId={participant.userId}
                      username={participant.userName}
                    />
                    <span className='font-semibold'>
                      {participant.userName}
                    </span>
                  </div>
                  {selectedUser === participant.userId && (
                    <CheckIcon className='h-5 w-5' />
                  )}
                </button>
              )
            )}
          </div>
        )}
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isTransferring}>
            Cancel
          </AlertDialogCancel>
          <Button
            variant='destructiveOutline'
            disabled={!selectedUser || isTransferring}
            isLoading={isTransferring}
            aria-label="Transfer room's ownership"
            onClick={handleTransferOwnership}
          >
            {isTransferring ? 'Transferring' : 'Transfer'} Ownership
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default TransferOwnershipDialog;
