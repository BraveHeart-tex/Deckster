'use client';
import usePresence, { PresenceState } from '@convex-dev/presence/react';
import { useEffect } from 'react';

import { api } from '@/convex/_generated/api';

interface PresenceSubscriberProps {
  roomCode: string;
  userId: string;
  onStateChange: (state: PresenceState[] | undefined) => void;
}

const PresenceSubscriber = ({
  roomCode,
  userId,
  onStateChange,
}: PresenceSubscriberProps) => {
  const presenceState = usePresence(api.presence, roomCode, userId);

  useEffect(() => {
    onStateChange(presenceState);

    return () => {
      onStateChange(undefined);
    };
  }, [onStateChange, presenceState]);

  return null;
};

export default PresenceSubscriber;
