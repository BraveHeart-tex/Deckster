import { UserIdentity } from 'convex/server';
import {
  customAction,
  customCtx,
  customMutation,
  customQuery,
} from 'convex-helpers/server/customFunctions';

import { DOMAIN_ERROR_CODES, DomainError } from '../shared/domainErrorCodes';
import { Doc as Document_ } from './_generated/dataModel';
import {
  action,
  type ActionCtx,
  mutation,
  type MutationCtx,
  query,
  type QueryCtx,
} from './_generated/server';

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
    throw new DomainError({
      code: DOMAIN_ERROR_CODES.PARTICIPANT.DISPLAY_NAME_TAKEN,
      message: 'Display name already taken',
    });
  }
};

const ensureAuthenticated = async (ctx: QueryCtx | MutationCtx | ActionCtx) => {
  const identity = await ctx.auth.getUserIdentity();
  if (identity === null) {
    throw new DomainError({
      code: DOMAIN_ERROR_CODES.AUTH.UNAUTHORIZED,
      message: 'You must be logged in to perform this action',
    });
  }
  return identity;
};

const injectUserIdentity = async (ctx: QueryCtx | MutationCtx | ActionCtx) => {
  const userIdentity = await ensureAuthenticated(ctx);
  return {
    userIdentity,
  };
};

export const authQuery = customQuery(
  query,
  customCtx(async (ctx) => injectUserIdentity(ctx))
);

export const authMutation = customMutation(
  mutation,
  customCtx(async (ctx) => injectUserIdentity(ctx))
);

export const authAction = customAction(
  action,
  customCtx(async (ctx) => injectUserIdentity(ctx))
);

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
