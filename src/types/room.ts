import { User } from '@/types/user';

export interface RoomSettings {
  allowOthersToRevealVotes?: boolean;
  allowOthersToDeleteVotes?: boolean;
}

export interface RoomData {
  roomCode: string;
  votesRevealed: boolean;
  ownerId: string;
  settings: RoomSettings;
  users: Record<string, User>;
  votes: Record<string, string>;
  currentUserId: string;
}

export interface RoomActions {
  setUsers: (users: Record<string, User>) => void;
  voteForCurrentUser: (vote: string) => void;
  deleteVotes: () => void;
  setVotes: (votes: Record<string, string>) => void;
  getAllVoted: () => boolean;
  resetState: () => void;
}

export type RoomState = RoomData & RoomActions;
