'use client';

import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  clearStoredGuestUser,
  ensureGuestUser,
  storeGuestDisplayName,
} from '@/src/lib/guestSession';
import type { GuestSessionState, GuestUser } from '@/src/types/guest-session';

const GuestSessionContext = createContext<GuestSessionState | null>(null);

export const GuestSessionProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<GuestUser | null>(null);

  useEffect(() => {
    setUser(ensureGuestUser());
  }, []);

  const value = useMemo<GuestSessionState>(
    () => ({
      user,
      isReady: user !== null,
      setDisplayName: (displayName) => {
        if (!user) {
          return;
        }

        const nextUser = {
          ...user,
          name: displayName,
        };

        storeGuestDisplayName(displayName);
        setUser(nextUser);
      },
      resetSession: () => {
        clearStoredGuestUser();
        setUser(ensureGuestUser());
      },
    }),
    [user]
  );

  return (
    <GuestSessionContext.Provider value={value}>
      {children}
    </GuestSessionContext.Provider>
  );
};

export const useGuestSession = () => {
  const context = useContext(GuestSessionContext);

  if (context === null) {
    throw new Error(
      'useGuestSession must be used within a GuestSessionProvider'
    );
  }

  return context;
};
