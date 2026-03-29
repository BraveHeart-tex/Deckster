'use client';

import { GUEST_NAME_COOKIE, GUEST_SESSION_COOKIE } from '@/constants';

const COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

const readCookie = (name: string): string | null => {
  if (typeof document === 'undefined') {
    return null;
  }

  const cookie = document.cookie
    .split('; ')
    .find((entry) => entry.startsWith(`${name}=`));

  if (!cookie) {
    return null;
  }

  return decodeURIComponent(cookie.split('=').slice(1).join('='));
};

const writeCookie = (name: string, value: string) => {
  if (typeof document === 'undefined') {
    return;
  }

  // biome-ignore lint/suspicious/noDocumentCookie: guest session data is stored in first-party cookies for lightweight persistence
  document.cookie = `${name}=${encodeURIComponent(value)}; Path=/; Max-Age=${COOKIE_MAX_AGE}; SameSite=Lax`;
};

const clearCookie = (name: string) => {
  if (typeof document === 'undefined') {
    return;
  }

  // biome-ignore lint/suspicious/noDocumentCookie: clearing the first-party guest session cookie requires direct cookie assignment here
  document.cookie = `${name}=; Path=/; Max-Age=0; SameSite=Lax`;
};

const createSessionToken = () => {
  if (
    typeof crypto !== 'undefined' &&
    typeof crypto.randomUUID === 'function'
  ) {
    return `guest_${crypto.randomUUID()}`;
  }

  return `guest_${Math.random().toString(36).slice(2, 12)}`;
};

const createGuestName = (sessionToken: string) => {
  return `Guest ${sessionToken.slice(-4).toUpperCase()}`;
};

export const getStoredGuestUser = () => {
  const sessionToken = readCookie(GUEST_SESSION_COOKIE);
  const displayName = readCookie(GUEST_NAME_COOKIE);

  if (!sessionToken) {
    return null;
  }

  return {
    id: sessionToken,
    name: displayName || createGuestName(sessionToken),
  };
};

export const ensureGuestUser = () => {
  const storedGuestUser = getStoredGuestUser();
  if (storedGuestUser) {
    if (!readCookie(GUEST_NAME_COOKIE)) {
      writeCookie(GUEST_NAME_COOKIE, storedGuestUser.name);
    }

    return storedGuestUser;
  }

  const sessionToken = createSessionToken();
  const displayName = createGuestName(sessionToken);

  writeCookie(GUEST_SESSION_COOKIE, sessionToken);
  writeCookie(GUEST_NAME_COOKIE, displayName);

  return {
    id: sessionToken,
    name: displayName,
  };
};

export const storeGuestDisplayName = (displayName: string) => {
  writeCookie(GUEST_NAME_COOKIE, displayName);
};

export const clearStoredGuestUser = () => {
  clearCookie(GUEST_SESSION_COOKIE);
  clearCookie(GUEST_NAME_COOKIE);
};
