import { v } from 'convex/values';

import { DOMAIN_ERROR_CODES, DomainError } from '../shared/domainErrorCodes';
import { api } from './_generated/api';
import { authMutation } from './helpers';

export const castVote = authMutation({
  args: {
    roomId: v.id('rooms'),
    value: v.string(),
  },
  handler: async (ctx, args) => {
    const room = await ctx.db.get(args.roomId);
    if (!room) {
      throw new DomainError({
        code: DOMAIN_ERROR_CODES.ROOM.NOT_FOUND,
        message: 'Room not found',
      });
    }

    const participant = await ctx.db
      .query('participants')
      .withIndex('by_room_and_user', (q) =>
        q
          .eq('roomId', args.roomId)
          .eq('userId', ctx.userIdentity.userId as string)
      )
      .unique();

    if (!participant) {
      throw new DomainError({
        code: DOMAIN_ERROR_CODES.AUTH.FORBIDDEN,
        message: 'Must be a room participant to vote',
      });
    }

    const existingVote = await ctx.db
      .query('votes')
      .withIndex('by_room_and_user', (q) =>
        q
          .eq('roomId', args.roomId)
          .eq('userId', ctx.userIdentity.userId as string)
      )
      .unique();

    if (existingVote) {
      await ctx.db.patch(existingVote._id, {
        value: args.value,
      });
    } else {
      await ctx.db.insert('votes', {
        roomId: args.roomId,
        userId: ctx.userIdentity.userId as string,
        value: args.value,
      });
    }
  },
});

export const deleteVotes = authMutation({
  args: {
    roomId: v.id('rooms'),
  },
  handler: async (ctx, args) => {
    const room = await ctx.db.get(args.roomId);
    if (!room) {
      throw new DomainError({
        code: DOMAIN_ERROR_CODES.ROOM.NOT_FOUND,
        message: 'Room not found',
      });
    }

    const roomSettings = await ctx.runQuery(
      api.roomSettings.getRoomSettingsByRoomId,
      {
        roomId: room._id,
      }
    );

    if (
      !roomSettings.allowOthersToDeleteVotes &&
      room.ownerId !== ctx.userIdentity.userId
    ) {
      throw new DomainError({
        code: DOMAIN_ERROR_CODES.AUTH.FORBIDDEN,
        message: 'You do not have permission to delete votes',
      });
    }

    const votes = await ctx.db
      .query('votes')
      .withIndex('by_room', (q) => q.eq('roomId', args.roomId))
      .collect();

    await Promise.all([
      ctx.db.patch(room._id, {
        votesRevealed: false,
      }),
      ...votes.map((vote) => ctx.db.delete(vote._id)),
    ]);
  },
});
