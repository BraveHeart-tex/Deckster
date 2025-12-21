import type { useUser } from '@clerk/nextjs';
import type { PresenceState } from '@convex-dev/presence/react';
import type { useRoomDetails } from '../hooks/useRoomDetails';

export type ViewMode = 'chart' | 'table';

export interface CommonViewProps {
  presenceState: PresenceState[] | undefined;
  roomDetails: ReturnType<typeof useRoomDetails>;
  shouldHighlightConsensus: boolean;
  user: ReturnType<typeof useUser>['user'];
}
