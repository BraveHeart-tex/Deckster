'use client';
import { EllipsisIcon } from 'lucide-react';

import type { Doc, Id } from '@/convex/_generated/dataModel';
import { Button } from '@/src/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/src/components/ui/dropdown-menu';
import { MODAL_TYPES, useModalStore } from '@/src/store/modal';

interface UserActionsDropdownProps {
  userName: string;
  participantId: Id<'participants'>;
  roomId: Id<'rooms'>;
  userId: string;
  role: Doc<'participants'>['role'];
}

const UserActionsDropdown = ({
  participantId,
  userName,
  roomId,
  userId,
  role,
}: UserActionsDropdownProps) => {
  const openModal = useModalStore((state) => state.openModal);

  const onRemoveFromRoom = () => {
    openModal({
      type: MODAL_TYPES.REMOVE_PARTICIPANT,
      payload: { participantId, userName },
    });
  };

  const onBanUser = () => {
    openModal({
      type: MODAL_TYPES.BAN_USER,
      payload: { roomId, userId, userName },
    });
  };

  const onTransferOwnership = () => {
    openModal({
      type: MODAL_TYPES.TRANSFER_OWNERSHIP,
      payload: {
        selectedUserId: userId,
        selectedUserName: userName,
      },
    });
  };

  const handleModifyRole = () => {
    openModal({
      type: MODAL_TYPES.MODIFY_ROLE,
      payload: { participantId, userName, currentRole: role },
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size='icon'
          variant='ghost'
          aria-label={`See actions for ${userName}`}
        >
          <span className='sr-only'>See actions for {userName}</span>
          <EllipsisIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem onClick={onTransferOwnership}>
          Transfer Ownership
        </DropdownMenuItem>
        <DropdownMenuItem
          variant={role === 'participant' ? 'default' : 'destructive'}
          onClick={handleModifyRole}
        >
          {role === 'participant' && 'Make Moderator'}
          {role === 'moderator' && 'Revoke Moderator'}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onRemoveFromRoom}>
          Remove from Room
        </DropdownMenuItem>
        <DropdownMenuItem variant='destructive' onClick={onBanUser}>
          Ban
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserActionsDropdown;
