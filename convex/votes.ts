import { getAuthUserId } from '@convex-dev/auth/server';
import { v } from 'convex/values';
import { ApplicationError, ERROR_CODES } from '../shared/errorCodes';
import { mutation, query } from './_generated/server';

export const castVote = mutation({
  args: {
    roomId: v.id('rooms'),
    value: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new ApplicationError({
        code: ERROR_CODES.UNAUTHORIZED,
        message: "'Must be logged in to vote'",
      });
    }

    const user = await ctx.db.get(userId);
    if (!user) {
      throw new ApplicationError({
        code: ERROR_CODES.NOT_FOUND,
        message: 'User not found',
      });
    }

    const room = await ctx.db.get(args.roomId);
    if (!room) {
      throw new ApplicationError({
        code: ERROR_CODES.NOT_FOUND,
        message: 'Room not found',
      });
    }

    if (!room.isVotingActive) {
      throw new ApplicationError({
        code: ERROR_CODES.RESOURCE_INACTIVE,
        message: 'Voting is not active',
      });
    }

    // Check if user is a participant
    const participant = await ctx.db
      .query('participants')
      .withIndex('by_room_and_user', (q) =>
        q.eq('roomId', args.roomId).eq('userId', userId)
      )
      .unique();

    if (!participant) {
      throw new ApplicationError({
        code: ERROR_CODES.UNAUTHORIZED,
        message: 'Must be a room participant to vote',
      });
    }

    // Check if user already voted
    const existingVote = await ctx.db
      .query('votes')
      .withIndex('by_room_and_user', (q) =>
        q.eq('roomId', args.roomId).eq('userId', userId)
      )
      .unique();

    if (existingVote) {
      // Update existing vote
      await ctx.db.patch(existingVote._id, {
        value: args.value,
      });
    } else {
      // Create new vote
      await ctx.db.insert('votes', {
        roomId: args.roomId,
        userId,
        userName: user.name || user.email || 'Anonymous',
        value: args.value,
        storyTitle: room.currentStory,
      });
    }
  },
});

export const getRoomVotes = query({
  args: {
    roomId: v.id('rooms'),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return [];
    }

    // Check if user is a participant
    const participant = await ctx.db
      .query('participants')
      .withIndex('by_room_and_user', (q) =>
        q.eq('roomId', args.roomId).eq('userId', userId)
      )
      .unique();

    if (!participant) {
      return [];
    }

    return await ctx.db
      .query('votes')
      .withIndex('by_room', (q) => q.eq('roomId', args.roomId))
      .collect();
  },
});

export const getUserVote = query({
  args: {
    roomId: v.id('rooms'),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return null;
    }

    return await ctx.db
      .query('votes')
      .withIndex('by_room_and_user', (q) =>
        q.eq('roomId', args.roomId).eq('userId', userId)
      )
      .unique();
  },
});
