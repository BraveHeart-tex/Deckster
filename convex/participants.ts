import { v } from 'convex/values';

import { ApplicationError, ERROR_CODES } from '../shared/errorCodes';
import { mutation } from './_generated/server';
import { ensureUniqueDisplayName } from './helpers';

export const changeDisplayName = mutation({
  args: {
    displayName: v.string(),
    participantId: v.id('participants'),
  },
  handler: async (ctx, args) => {
    const userIdentity = await ctx.auth.getUserIdentity();
    if (!userIdentity) {
      throw new ApplicationError({
        code: ERROR_CODES.UNAUTHORIZED,
        message: 'You must be logged in to change your display name',
      });
    }

    const participant = await ctx.db.get(args.participantId);

    if (!participant) {
      throw new ApplicationError({
        code: ERROR_CODES.NOT_FOUND,
        message: 'Participant not found',
      });
    }

    if (participant.userId !== userIdentity.userId) {
      throw new ApplicationError({
        code: ERROR_CODES.FORBIDDEN,
        message: 'Forbidden',
      });
    }

    if (participant.userName === args.displayName) {
      return;
    }

    await ensureUniqueDisplayName(ctx, args.displayName);

    await ctx.db.patch(args.participantId, {
      userName: args.displayName,
    });

    return args.displayName;
  },
});

export const removeParticipantFromRoom = mutation({
  args: {
    participantId: v.id('participants'),
  },

  handler: async (ctx, args) => {
    const userIdentity = await ctx.auth.getUserIdentity();
    if (!userIdentity) {
      throw new ApplicationError({
        code: ERROR_CODES.UNAUTHORIZED,
        message: 'You are not authorized to perform this action',
      });
    }

    const participant = await ctx.db.get(args.participantId);

    if (!participant) {
      throw new ApplicationError({
        code: ERROR_CODES.NOT_FOUND,
        message: 'Participant not found',
      });
    }

    const room = await ctx.db.get(participant.roomId);

    if (!room) {
      throw new ApplicationError({
        code: ERROR_CODES.NOT_FOUND,
        message: 'Room not found',
      });
    }

    if (room.ownerId !== userIdentity.userId) {
      throw new ApplicationError({
        code: ERROR_CODES.FORBIDDEN,
        message: 'Only the room owner can remove participants',
      });
    }

    await ctx.db.delete(args.participantId);
  },
});
