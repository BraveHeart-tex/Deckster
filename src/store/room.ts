'use client';
import { MOCK_ROOM_CODE } from '@/constants/room.constants';
import { User } from '@/types/user';
import { create } from 'zustand';

interface RoomSettings {
  allowOthersToRevealVotes?: boolean;
  allowOthersToDeleteVotes?: boolean;
}

interface RoomState {
  roomCode: string;
  votesRevealed: boolean;
  ownerId: string;
  settings: RoomSettings;
  users: Record<string, User>;
  votes: Record<string, string>;
  currentUserId: string;

  setUsers: (users: Record<string, User>) => void;
  voteForCurrentUser: (vote: string) => void;
  deleteVotes: () => void;
  setVotes: (votes: Record<string, string>) => void;
  getAllVoted: () => boolean;
}

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

export const useRoomStore = create<RoomState>((set, get) => ({
  roomCode: MOCK_ROOM_CODE,
  votesRevealed: false,
  ownerId: '',
  settings: {
    allowOthersToRevealVotes: false,
    allowOthersToDeleteVotes: false,
  },
  currentUserId: MOCK_USERS.user1.id,
  users: MOCK_USERS,
  setUsers: (users) => set({ users }),
  votes: {},
  setVotes: (votes) => set({ votes }),
  deleteVotes: () =>
    set((state) => ({
      votes: Object.fromEntries(
        Object.keys(state.votes).map((userId) => [userId, ''])
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
