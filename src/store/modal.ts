import { create } from 'zustand';

import type { Doc, Id } from '@/convex/_generated/dataModel';

export const MODAL_TYPES = {
  REMOVE_PARTICIPANT: 'REMOVE_PARTICIPANT',
  BAN_USER: 'BAN_USER',
  TRANSFER_OWNERSHIP: 'TRANSFER_OWNERSHIP',
  DELETE_ROOM: 'DELETE_ROOM',
  LOCK_OR_UNLOCK_ROOM: 'LOCK_OR_UNLOCK_ROOM',
  CHANGE_DECK: 'CHANGE_DECK',
  BANNED_USERS: 'BANNED_USERS',
  SET_ROOM_PASSWORD: 'SET_ROOM_PASSWORD',
  RESET_ROOM_PASSWORD: 'RESET_ROOM_PASSWORD',
  MODIFY_ROLE: 'MODIFY_ROLE',
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
      payload?: { selectedUserId: string; selectedUserName: string };
    }
  | {
      type: typeof MODAL_TYPES.DELETE_ROOM;
    }
  | {
      type: typeof MODAL_TYPES.LOCK_OR_UNLOCK_ROOM;
    }
  | {
      type: typeof MODAL_TYPES.CHANGE_DECK;
    }
  | {
      type: typeof MODAL_TYPES.BANNED_USERS;
      payload: { roomId: Id<'rooms'> };
    }
  | {
      type: typeof MODAL_TYPES.SET_ROOM_PASSWORD;
      payload: { roomId: Id<'rooms'> };
    }
  | {
      type: typeof MODAL_TYPES.RESET_ROOM_PASSWORD;
      payload: { roomId: Id<'rooms'> };
    }
  | {
      type: typeof MODAL_TYPES.MODIFY_ROLE;
      payload: {
        participantId: Id<'participants'>;
        userName: string;
        currentRole: Doc<'participants'>['role'];
      };
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
