'use client';
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

    default: {
      return null;
    }
  }
};
export default ModalHost;
