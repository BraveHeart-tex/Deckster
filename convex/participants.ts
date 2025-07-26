import { v } from 'convex/values';

import { DOMAIN_ERROR_CODES, DomainError } from '../shared/domainErrorCodes';
import { authMutation, ensureUniqueDisplayName } from './helpers';

export const changeDisplayName = authMutation({
  args: {
    displayName: v.string(),
    participantId: v.id('participants'),
  },
  handler: async (ctx, args) => {
    const participant = await ctx.db.get(args.participantId);

    if (!participant) {
      throw new DomainError({
        code: DOMAIN_ERROR_CODES.PARTICIPANT.NOT_FOUND,
        message: 'Participant not found',
      });
    }

    if (participant.userId !== ctx.userIdentity.userId) {
      throw new DomainError({
        code: DOMAIN_ERROR_CODES.AUTH.FORBIDDEN,
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
      throw new DomainError({
        code: DOMAIN_ERROR_CODES.PARTICIPANT.NOT_FOUND,
        message: 'Participant not found',
      });
    }

    const room = await ctx.db.get(participant.roomId);

    if (!room) {
      throw new DomainError({
        code: DOMAIN_ERROR_CODES.ROOM.NOT_FOUND,
        message: 'Room not found',
      });
    }

    if (room.ownerId !== ctx.userIdentity.userId) {
      throw new DomainError({
        code: DOMAIN_ERROR_CODES.AUTH.FORBIDDEN,
        message: 'Only the room owner can remove participants',
      });
    }

    await ctx.db.delete(args.participantId);
  },
});
