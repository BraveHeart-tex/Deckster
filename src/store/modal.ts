import { create } from 'zustand';

import { Id } from '@/convex/_generated/dataModel';

export const MODAL_TYPES = {
  REMOVE_PARTICIPANT: 'REMOVE_PARTICIPANT',
} as const;

// TODO: Will add more modal with discriminated union type
export type Modal = {
  type: typeof MODAL_TYPES.REMOVE_PARTICIPANT;
  payload: { participantId: Id<'participants'>; userName: string };
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
