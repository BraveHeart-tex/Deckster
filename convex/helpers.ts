import { UserIdentity } from 'convex/server';

import { ApplicationError, ERROR_CODES } from '../shared/errorCodes';
import { type QueryCtx } from './_generated/server';

export const getUserNameFromIdentity = (userIdentity: UserIdentity): string => {
  if (userIdentity.name || userIdentity.familyName) {
    return `${userIdentity.name ?? ''} ${userIdentity.familyName ?? ''}`.trim();
  }

  return userIdentity.preferredUsername || userIdentity.email || 'Anonymous';
};

export const ensureUniqueDisplayName = async (
  ctx: QueryCtx,
  displayName: string
): Promise<void> => {
  const existing = await ctx.db
    .query('participants')
    .withIndex('by_userName', (q) => q.eq('userName', displayName))
    .first();

  if (existing !== null) {
    throw new ApplicationError({
      code: ERROR_CODES.CONFLICT,
      message: 'Display name already taken',
    });
  }
};
