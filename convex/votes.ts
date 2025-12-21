import { v } from 'convex/values';

import { DOMAIN_ERROR_CODES, DomainError } from '../shared/domainErrorCodes';
import { api } from './_generated/api';
import { assertRoomExists, authMutation } from './helpers';

export const castVote = authMutation({
  args: {
    roomId: v.id('rooms'),
    value: v.string(),
  },
  handler: async (ctx, args) => {
    const room = await ctx.db.get(args.roomId);
    assertRoomExists(room);

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

    const roomSettings = await ctx.db
      .query('roomSettings')
      .withIndex('by_room', (q) => q.eq('roomId', room._id))
      .unique();

    if (!roomSettings) return;

    if (roomSettings.autoRevealVotes && !room.votesRevealed) {
      const [participants, votes] = await Promise.all([
        ctx.db
          .query('participants')
          .withIndex('by_room', (q) => q.eq('roomId', room._id))
          .collect(),
        ctx.db
          .query('votes')
          .withIndex('by_room', (q) => q.eq('roomId', room._id))
          .collect(),
      ]);

      const votedUserIds = new Set(votes.map((v) => v.userId));
      const votedCount = votedUserIds.size;

      const allVoted =
        votedCount === participants.length &&
        participants.every((p) => votedUserIds.has(p.userId));

      if (allVoted) {
        await ctx.db.patch(room._id, {
          votesRevealed: true,
        });
      }
    }
  },
});

export const deleteVotes = authMutation({
  args: {
    roomId: v.id('rooms'),
  },
  handler: async (ctx, args) => {
    const room = await ctx.db.get(args.roomId);
    assertRoomExists(room);

    const roomSettings = await ctx.runQuery(
      api.roomSettings.getRoomSettingsByRoomId,
      {
        roomId: room._id,
      }
    );

    const participant = await ctx.db
      .query('participants')
      .withIndex('by_room_and_user', (q) =>
        q
          .eq('roomId', args.roomId)
          .eq('userId', ctx.userIdentity.userId as string)
      )
      .unique();

    const isModerator = participant?.role === 'moderator';

    if (
      !roomSettings.allowOthersToDeleteVotes &&
      room.ownerId !== ctx.userIdentity.userId &&
      !isModerator
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
