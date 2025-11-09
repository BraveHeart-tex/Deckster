import { v } from 'convex/values';

import { DOMAIN_ERROR_CODES, DomainError } from '../shared/domainErrorCodes';
import {
  assertRoomExists,
  authMutation,
  ensureUniqueDisplayName,
} from './helpers';

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

    assertRoomExists(room);

    if (room.ownerId !== ctx.userIdentity.userId) {
      throw new DomainError({
        code: DOMAIN_ERROR_CODES.AUTH.FORBIDDEN,
        message: 'Only the room owner can remove participants',
      });
    }

    await ctx.db.delete(args.participantId);
  },
});

export const modifyParticipantRole = authMutation({
  args: {
    participantId: v.id('participants'),
    role: v.union(v.literal('participant'), v.literal('moderator')),
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

    assertRoomExists(room);

    if (room.ownerId !== ctx.userIdentity.userId) {
      throw new DomainError({
        code: DOMAIN_ERROR_CODES.AUTH.FORBIDDEN,
        message: 'Only the room owner can modify participant roles',
      });
    }

    await ctx.db.patch(args.participantId, {
      role: args.role,
    });

    return args.role;
  },
});
