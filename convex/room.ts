import { getAuthUserId } from '@convex-dev/auth/server';
import { v } from 'convex/values';
import { Doc as Document_ } from './_generated/dataModel';
import { mutation, query } from './_generated/server';

// TODO: Refactor these with relation helpers

export const createRoom = mutation({
  args: {
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error('Must be logged in to create a room');
    }

    const user = await ctx.db.get(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const roomId = await ctx.db.insert('rooms', {
      name: args.name,
      createdBy: userId,
      isVotingActive: false,
      votesRevealed: false,
    });

    // add the user as the participant of the room
    await ctx.db.insert('participants', {
      userId,
      isActive: true,
      userName: user.name || user.email || 'Anonymous',
      roomId,
    });

    return roomId;
  },
});

export const joinRoom = mutation({
  args: {
    roomId: v.id('rooms'),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error('Must be logged in to join a room');
    }

    const user = await ctx.db.get(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const room = await ctx.db.get(args.roomId);
    if (!room) {
      throw new Error('Room not found');
    }

    // Check if the user is already a participant
    const existingParticipant = await ctx.db
      .query('participants')
      .withIndex('by_room_and_user', (query) =>
        query.eq('roomId', args.roomId).eq('userId', userId)
      )
      .unique();

    if (existingParticipant) {
      // reactivate the participant if they were inactive
      await ctx.db.patch(existingParticipant._id, { isActive: true });
    } else {
      // If not, create a new participant entry
      await ctx.db.insert('participants', {
        roomId: args.roomId,
        userId,
        isActive: true,
        userName: user.name || user.email || 'Anonymous',
      });
    }

    return args.roomId;
  },
});

export const getRoom = query({
  args: {
    roomId: v.id('rooms'),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error('Must be logged in to get a room');
    }

    const room = await ctx.db.get(args.roomId);
    if (!room) {
      return null;
    }

    const participant = await ctx.db
      .query('participants')
      .withIndex('by_room_and_user', (q) =>
        q.eq('roomId', args.roomId).eq('userId', userId)
      )
      .unique();

    if (!participant) {
      return null;
    }

    return room;
  },
});

export const getRoomParticipants = query({
  args: {
    roomId: v.id('rooms'),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return [];
    }

    return await ctx.db
      .query('participants')
      .withIndex('by_room', (q) => q.eq('roomId', args.roomId))
      .filter((q) => q.eq(q.field('isActive'), true))
      .collect();
  },
});

export const getUserRooms = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return [];
    }

    const participations = await ctx.db
      .query('participants')
      .filter((q) => q.eq(q.field('userId'), userId))
      .filter((q) => q.eq(q.field('isActive'), true))
      .collect();

    const rooms: Document_<'rooms'>[] = [];
    for (const participation of participations) {
      const room = await ctx.db.get(participation.roomId);
      if (room) {
        rooms.push(room);
      }
    }

    return rooms;
  },
});

export const startVoting = mutation({
  args: {
    roomId: v.id('rooms'),
    storyTitle: v.string(),
  },
  async handler(ctx, args) {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error('Must be logged in');
    }

    const room = await ctx.db.get(args.roomId);
    if (!room) {
      throw new Error('Room not found');
    }

    if (room.createdBy !== userId) {
      throw new Error('Only room creator can start voting');
    }

    // Clear previous votes
    const previousVotes = await ctx.db
      .query('votes')
      .withIndex('by_room', (q) => q.eq('roomId', args.roomId))
      .collect();

    for (const vote of previousVotes) {
      await ctx.db.delete(vote._id);
    }

    await ctx.db.patch(args.roomId, {
      currentStory: args.storyTitle,
      isVotingActive: true,
      votesRevealed: false,
    });
  },
});

export const revealVotes = mutation({
  args: {
    roomId: v.id('rooms'),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error('Must be logged in');
    }

    const room = await ctx.db.get(args.roomId);
    if (!room) {
      throw new Error('Room not found');
    }

    if (room.createdBy !== userId) {
      throw new Error('Only room creator can reveal votes');
    }

    await ctx.db.patch(args.roomId, {
      votesRevealed: true,
    });
  },
});

export const resetVoting = mutation({
  args: {
    roomId: v.id('rooms'),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error('Must be logged in');
    }

    const room = await ctx.db.get(args.roomId);
    if (!room) {
      throw new Error('Room not found');
    }

    if (room.createdBy !== userId) {
      throw new Error('Only room creator can reset voting');
    }

    // Clear votes
    const votes = await ctx.db
      .query('votes')
      .withIndex('by_room', (q) => q.eq('roomId', args.roomId))
      .collect();

    for (const vote of votes) {
      await ctx.db.delete(vote._id);
    }

    await ctx.db.patch(args.roomId, {
      isVotingActive: false,
      votesRevealed: false,
      currentStory: undefined,
    });
  },
});
