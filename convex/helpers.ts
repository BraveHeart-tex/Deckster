import { UserIdentity } from 'convex/server';

export const getUserNameFromIdentity = (userIdentity: UserIdentity): string =>
  userIdentity.preferredUsername || userIdentity.email || 'Anonymous';
