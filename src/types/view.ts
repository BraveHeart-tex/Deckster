import type { PresenceState } from '@convex-dev/presence/react';
import type { useRoomDetails } from '../hooks/useRoomDetails';
import type { GuestUser } from './guest-session';

export type ViewMode = 'chart' | 'table';

export interface CommonViewProps {
  presenceState: PresenceState[] | undefined;
  roomDetails: ReturnType<typeof useRoomDetails>;
  shouldHighlightConsensus: boolean;
  user: GuestUser | null;
}
