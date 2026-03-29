import { v } from 'convex/values';

import { DOMAIN_ERROR_CODES, DomainError } from '../shared/domainErrorCodes';
import type { Doc as Document_ } from './_generated/dataModel';
import {
  action,
  type MutationCtx,
  mutation,
  type QueryCtx,
  query,
} from './_generated/server';

export const authQuery = query;
export const authMutation = mutation;
export const authAction = action;
export const sessionTokenValidator = v.string();

export const ensureUniqueDisplayName = async (
  ctx: QueryCtx,
  displayName: string
): Promise<void> => {
  const existing = await ctx.db
    .query('participants')
    .withIndex('by_userName', (q) => q.eq('userName', displayName))
    .first();

  if (existing !== null) {
    throw new DomainError({
      code: DOMAIN_ERROR_CODES.PARTICIPANT.DISPLAY_NAME_TAKEN,
      message: 'Display name already taken',
    });
  }
};

export const requireSessionToken = (sessionToken: string): string => {
  if (!sessionToken.trim()) {
    throw new DomainError({
      code: DOMAIN_ERROR_CODES.AUTH.UNAUTHORIZED,
      message: 'A guest session is required to perform this action',
    });
  }

  return sessionToken;
};

export const getStoredUser = async (
  ctx: QueryCtx | MutationCtx,
  userId: string
) => {
  return await ctx.db
    .query('users')
    .withIndex('byExternalId', (query) => query.eq('externalId', userId))
    .unique();
};

export const getStoredUserName = async (
  ctx: QueryCtx | MutationCtx,
  userId: string
) => {
  const user = await getStoredUser(ctx, userId);
  return user?.name || 'Anonymous';
};

export const upsertGuestUser = async (
  ctx: MutationCtx,
  { userId, name }: { userId: string; name: string }
) => {
  const user = await getStoredUser(ctx, userId);

  if (user === null) {
    await ctx.db.insert('users', {
      externalId: userId,
      name,
    });
    return;
  }

  if (user.name !== name) {
    await ctx.db.patch(user._id, {
      name,
    });
  }
};

export function assertRoomExists(
  room: Document_<'rooms'> | null
): asserts room is Document_<'rooms'> {
  if (!room) {
    throw new DomainError({
      code: DOMAIN_ERROR_CODES.ROOM.NOT_FOUND,
      message: 'Room not found',
    });
  }
}
