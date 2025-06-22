import { User } from '@/types/user';
import { create } from 'zustand';

interface SessionState {
  roomCode: string;
  sessionStarted: boolean;
  votesRevealed: boolean;
  ownerId: string;
  settings: {
    allowVoteReveal?: boolean;
  };
  users: User[];
  votes: Record<string, string | null>;
  setVotes: (votes: Record<string, string | null>) => void;
}

const MOCK_USERS: User[] = [
  { id: '1', name: 'Alice', isOwner: true },
  { id: '2', name: 'Bob', isOwner: false },
  { id: '3', name: 'Charlie', isOwner: false },
  { id: '4', name: 'Diana', isOwner: false },
  { id: '5', name: 'Eve', isOwner: false },
  { id: '6', name: 'Frank', isOwner: false },
  { id: '7', name: 'Grace', isOwner: false },
];

export const useSessionStore = create<SessionState>((set) => ({
  roomCode: '',
  sessionStarted: false,
  votesRevealed: false,
  ownerId: '',
  settings: {
    allowVoteReveal: false,
  },
  users: MOCK_USERS,
  votes: {},
  setVotes: (votes) => set({ votes }),
}));
