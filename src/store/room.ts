'use client';
import { MOCK_ROOM_CODE } from '@/constants/room.constants';
import type { RoomData, RoomSettings, RoomState } from '@/types/room';
import { create } from 'zustand';

const defaultSettings: RoomSettings = {
  allowOthersToRevealVotes: false,
  allowOthersToDeleteVotes: false,
};

const MOCK_USERS = {
  user1: { id: 'user1', name: 'Alice', isOwner: true },
  user2: { id: 'user2', name: 'Bob', isOwner: false },
  user3: { id: 'user3', name: 'Charlie', isOwner: false },
  user4: { id: 'user4', name: 'Diana', isOwner: false },
  user5: { id: 'user5', name: 'Eve', isOwner: false },
  user6: { id: 'user6', name: 'Frank', isOwner: false },
  user7: { id: 'user7', name: 'Grace', isOwner: false },
  user8: { id: 'user8', name: 'Heidi', isOwner: false },
};

const defaultRoomState: RoomData = {
  roomCode: MOCK_ROOM_CODE,
  votesRevealed: false,
  ownerId: '',
  settings: defaultSettings,
  currentUserId: MOCK_USERS.user1.id,
  users: MOCK_USERS,
  votes: {},
};

export const useRoomStore = create<RoomState>((set, get) => ({
  ...defaultRoomState,
  resetState: () =>
    set({
      ...defaultRoomState,
    }),
  setUsers: (users) => set({ users }),
  setVotes: (votes) => set({ votes }),
  deleteVotes: () =>
    set((state) => ({
      votes: Object.fromEntries(
        Object.keys(state.votes).map((userId) => [userId, null])
      ),
      votesRevealed: false,
    })),
  getAllVoted: () => {
    const { users, votes } = get();
    return Object.values(users).every((user) => votes[user.id] !== null);
  },
  voteForCurrentUser: (vote) =>
    set((state) => ({
      votes: {
        ...state.votes,
        [state.currentUserId]: vote,
      },
    })),
}));
