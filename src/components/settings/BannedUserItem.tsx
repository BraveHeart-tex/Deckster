'use client';

import { useMutation } from 'convex/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { api } from '@/convex/_generated/api';
import type { Doc, Id } from '@/convex/_generated/dataModel';
import { DOMAIN_ERROR_CODES } from '@/shared/domainErrorCodes';
import UserAvatar from '@/src/components/common/UserAvatar';
import { Button } from '@/src/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/src/components/ui/dropdown-menu';
import { showErrorToast, showSuccessToast } from '@/src/components/ui/sonner';
import { handleDomainError } from '@/src/helpers/handleDomainError';
import { ROUTES } from '@/src/lib/routes';

interface BannedUserItemProps {
  user: Doc<'bannedUsers'> & {
    email?: string;
    name: string;
  };
  roomId: Id<'rooms'>;
}

const BannedUserItem = ({ user, roomId }: BannedUserItemProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isRevoking, setIsRevoking] = useState(false);
  const revokeBan = useMutation(api.rooms.revokeBan);
  const router = useRouter();

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleRevokeBan = async () => {
    setIsRevoking(true);
    setIsOpen(false);
    try {
      await revokeBan({ roomId, userId: user.userId });
      showSuccessToast('Ban revoked successfully!');
    } catch (error) {
      handleDomainError(error, {
        [DOMAIN_ERROR_CODES.AUTH.UNAUTHORIZED]: (error) => {
          showErrorToast(error.data.message);
          router.push(ROUTES.SIGN_IN);
        },
      });
    } finally {
      setIsRevoking(false);
    }
  };

  return (
    <div
      key={user._id}
      className='flex items-start justify-between gap-4 rounded-md py-2 transition'
    >
      <div className='flex items-start gap-2'>
        <UserAvatar userId={user.userId} username={user.name} />
        <div className='space-y-0.5'>
          <p className='text-sm leading-none font-medium'>{user.name}</p>
          <p className='text-muted-foreground text-xs'>{user.email}</p>
          <p className='text-destructive text-xs'>Reason: {user.reason}</p>
        </div>
      </div>
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant='destructiveOutline'
            disabled={isRevoking}
            isLoading={isRevoking}
            aria-label='Revoke ban'
          >
            {isRevoking ? 'Revoking...' : 'Revoke'}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className='w-56 p-2'>
          <span className='text-sm font-medium'>
            Are you sure you want to revoke this user&apos;s ban?
          </span>
          <div className='grid gap-2 md:grid-cols-2'>
            <Button
              onClick={handleClose}
              variant='outline'
              disabled={isRevoking}
              aria-label="Cancel revoking user's ban"
            >
              Cancel
            </Button>
            <Button
              variant='destructive'
              onClick={handleRevokeBan}
              disabled={isRevoking}
              aria-label='Revoke user ban'
            >
              Revoke
            </Button>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default BannedUserItem;
