import { UserIdentity } from 'convex/server';

export const getUserNameFromIdentity = (userIdentity: UserIdentity): string => {
  if (userIdentity.name || userIdentity.familyName) {
    return `${userIdentity.name ?? ''} ${userIdentity.familyName ?? ''}`.trim();
  }

  return userIdentity.preferredUsername || userIdentity.email || 'Anonymous';
};
