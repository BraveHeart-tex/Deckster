import { v } from 'convex/values';

import { ApplicationError, ERROR_CODES } from '../shared/errorCodes';
import { authMutation, ensureUniqueDisplayName } from './helpers';

export const changeDisplayName = authMutation({
  args: {
    displayName: v.string(),
    participantId: v.id('participants'),
  },
  handler: async (ctx, args) => {
    const participant = await ctx.db.get(args.participantId);

    if (!participant) {
      throw new ApplicationError({
        code: ERROR_CODES.NOT_FOUND,
        message: 'Participant not found',
      });
    }

    if (participant.userId !== ctx.userIdentity.userId) {
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

export const removeParticipantFromRoom = authMutation({
  args: {
    participantId: v.id('participants'),
  },

  handler: async (ctx, args) => {
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

    if (room.ownerId !== ctx.userIdentity.userId) {
      throw new ApplicationError({
        code: ERROR_CODES.FORBIDDEN,
        message: 'Only the room owner can remove participants',
      });
    }

    await ctx.db.delete(args.participantId);
  },
});
