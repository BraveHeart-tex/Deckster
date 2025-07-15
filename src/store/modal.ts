import { create } from 'zustand';

import { Id } from '@/convex/_generated/dataModel';

export const MODAL_TYPES = {
  REMOVE_PARTICIPANT: 'REMOVE_PARTICIPANT',
  BAN_USER: 'BAN_USER',
  TRANSFER_OWNERSHIP: 'TRANSFER_OWNERSHIP',
  DELETE_ROOM: 'DELETE_ROOM',
} as const;

// TODO: Will add more modal with discriminated union type
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
