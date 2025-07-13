'use client';
import { EllipsisIcon } from 'lucide-react';

import { Id } from '@/convex/_generated/dataModel';
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
}

const UserActionsDropdown = ({
  participantId,
  userName,
}: UserActionsDropdownProps) => {
  const openModal = useModalStore((state) => state.openModal);

  const onRemoveFromRoom = () => {
    openModal({
      type: MODAL_TYPES.REMOVE_PARTICIPANT,
      payload: { participantId, userName },
    });
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="icon" variant="ghost">
            <EllipsisIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem>Transfer Ownership</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={onRemoveFromRoom}>
            Remove from Room
          </DropdownMenuItem>
          <DropdownMenuItem variant="destructive">Ban</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default UserActionsDropdown;
