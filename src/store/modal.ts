import { create } from 'zustand';

import { Id } from '@/convex/_generated/dataModel';

export const MODAL_TYPES = {
  REMOVE_PARTICIPANT: 'REMOVE_PARTICIPANT',
  BAN_USER: 'BAN_USER',
  TRANSFER_OWNERSHIP: 'TRANSFER_OWNERSHIP',
  DELETE_ROOM: 'DELETE_ROOM',
  LOCK_OR_UNLOCK_ROOM: 'LOCK_OR_UNLOCK_ROOM',
  CHANGE_DECK: 'CHANGE_DECK',
} as const;

export type Modal =
  | {
      type: typeof MODAL_TYPES.REMOVE_PARTICIPANT;
      payload: { participantId: Id<'participants'>; userName: string };
    }
  | {
      type: typeof MODAL_TYPES.BAN_USER;
      payload: { userName: string; userId: string; roomId: Id<'rooms'> };
    }
  | {
      type: typeof MODAL_TYPES.TRANSFER_OWNERSHIP;
    }
  | {
      type: typeof MODAL_TYPES.DELETE_ROOM;
    }
  | {
      type: typeof MODAL_TYPES.LOCK_OR_UNLOCK_ROOM;
    }
  | {
      type: typeof MODAL_TYPES.CHANGE_DECK;
    };

interface ModalStore {
  modal: Modal | null;
  openModal: (modal: Modal) => void;
  closeModal: () => void;
}

export const useModalStore = create<ModalStore>((set) => ({
  modal: null,
  openModal: (modal) => set({ modal }),
  closeModal: () => set({ modal: null }),
}));
