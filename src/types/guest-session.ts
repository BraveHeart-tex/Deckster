export interface GuestUser {
  id: string;
  name: string;
}

export interface GuestSessionState {
  user: GuestUser | null;
  isReady: boolean;
  setDisplayName: (displayName: string) => void;
  resetSession: () => void;
}
