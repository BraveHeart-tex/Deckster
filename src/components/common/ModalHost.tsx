'use client';
import ResetRoomPasswordDialog from '@/src/components/room/ResetRoomPasswordDialog';
import BannedUsersDialog from '@/src/components/settings/BannedUsersDialog';
import ChangeDeckDialog from '@/src/components/settings/ChangeDeckDialog';
import DeleteRoomDialog from '@/src/components/settings/DeleteRoomDialog';
import LockOrUnlockRoomDialog from '@/src/components/settings/LockOrUnlockRoomDialog';
import ModifyRoleDialog from '@/src/components/settings/ModifyRoleDialog';
import RoomPasswordDialog from '@/src/components/settings/RoomPasswordDialog';
import TransferOwnershipDialog from '@/src/components/settings/TransferOwnershipDialog';
import BanUserDialog from '@/src/components/vote/BanUserDialog';
import RemoveParticipantDialog from '@/src/components/vote/RemoveParticipantDialog';
import { MODAL_TYPES, useModalStore } from '@/src/store/modal';

const ModalHost = () => {
  const modal = useModalStore((state) => state.modal);
  const closeModal = useModalStore((state) => state.closeModal);

  switch (modal?.type) {
    case MODAL_TYPES.REMOVE_PARTICIPANT: {
      return (
        <RemoveParticipantDialog
          isOpen
          onOpenChange={closeModal}
          {...modal.payload}
        />
      );
    }

    case MODAL_TYPES.BAN_USER: {
      return (
        <BanUserDialog isOpen onOpenChange={closeModal} {...modal.payload} />
      );
    }

    case MODAL_TYPES.TRANSFER_OWNERSHIP: {
      return (
        <TransferOwnershipDialog
          isOpen
          onOpenChange={closeModal}
          {...modal.payload}
        />
      );
    }

    case MODAL_TYPES.DELETE_ROOM: {
      return <DeleteRoomDialog isOpen onOpenChange={closeModal} />;
    }

    case MODAL_TYPES.LOCK_OR_UNLOCK_ROOM: {
      return <LockOrUnlockRoomDialog isOpen onOpenChange={closeModal} />;
    }

    case MODAL_TYPES.CHANGE_DECK: {
      return <ChangeDeckDialog isOpen onOpenChange={closeModal} />;
    }

    case MODAL_TYPES.BANNED_USERS: {
      return (
        <BannedUsersDialog
          isOpen
          onOpenChange={closeModal}
          {...modal.payload}
        />
      );
    }

    case MODAL_TYPES.SET_ROOM_PASSWORD: {
      return (
        <RoomPasswordDialog
          isOpen
          onOpenChange={closeModal}
          {...modal.payload}
        />
      );
    }

    case MODAL_TYPES.RESET_ROOM_PASSWORD: {
      return (
        <ResetRoomPasswordDialog
          isOpen
          onOpenChange={closeModal}
          {...modal.payload}
        />
      );
    }

    case MODAL_TYPES.MODIFY_ROLE: {
      return (
        <ModifyRoleDialog isOpen onOpenChange={closeModal} {...modal.payload} />
      );
    }

    default: {
      return null;
    }
  }
};
export default ModalHost;
