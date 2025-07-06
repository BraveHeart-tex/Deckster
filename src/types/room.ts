import { User } from '@/src/types/user';

export interface RoomSettings {
  allowOthersToRevealVotes?: boolean;
  allowOthersToDeleteVotes?: boolean;
  showUserPresence?: boolean;
  showAverageOfVotes?: boolean;
}

export interface RoomData {
  roomCode: string;
  votesRevealed: boolean;
  ownerId: string;
  settings: RoomSettings;
  users: Record<string, User>;
  votes: Record<string, string | null>;
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

export interface RoomPageParameters {
  code: string;
  [key: string]: string;
}
