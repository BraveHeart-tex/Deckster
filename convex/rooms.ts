import { getAuthUserId } from '@convex-dev/auth/server';
import { v } from 'convex/values';

import { ApplicationError, ERROR_CODES } from '../shared/errorCodes';
import { generateRoomCode, isValidRoomCode } from '../shared/generateRoomCode';
import { Doc as Document_ } from './_generated/dataModel';
import { mutation, query } from './_generated/server';
import { ensureUniqueDisplayName, getUserNameFromIdentity } from './helpers';

export const createRoom = mutation({
  args: {
    roomName: v.string(),
    userDisplayName: v.string(),
  },
  handler: async (ctx, args) => {
    const userIdentity = await ctx.auth.getUserIdentity();
    if (userIdentity === null) {
      throw new ApplicationError({
        code: ERROR_CODES.UNAUTHORIZED,
        message: "'Must be logged in to create a room'",
      });
    }

    let roomCode: string;
    let exists;

    do {
      roomCode = generateRoomCode();
      exists = await ctx.db
        .query('rooms')
        .withIndex('by_code', (q) => q.eq('code', roomCode))
        .unique();
    } while (exists);

    const roomId = await ctx.db.insert('rooms', {
      name: args.roomName,
      ownerId: userIdentity.userId as string,
      votesRevealed: false,
      code: roomCode,
    });

    await ctx.db.insert('roomSettings', {
      roomId,
      allowOthersToRevealVotes: false,
      allowOthersToDeleteVotes: false,
      showAverageOfVotes: false,
      showUserPresence: false,
    });

    if (args.userDisplayName) {
      await ensureUniqueDisplayName(ctx, args.userDisplayName);
    }

    // add the user as the participant of the room
    await ctx.db.insert('participants', {
      userId: userIdentity.userId as string,
      isActive: true,
      userName: args.userDisplayName || getUserNameFromIdentity(userIdentity),
      roomId,
    });

    return {
      roomId,
      roomCode,
    };
  },
});

export const joinRoom = mutation({
  args: {
    roomCode: v.string(),
    userDisplayName: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userIdentity = await ctx.auth.getUserIdentity();

    if (userIdentity === null) {
      throw new ApplicationError({
        code: ERROR_CODES.UNAUTHORIZED,
        message: 'Must be logged in to join a room',
      });
    }

    if (!isValidRoomCode(args.roomCode)) {
      throw new ApplicationError({
        code: ERROR_CODES.VALIDATION_ERROR,
        message: 'Invalid room code',
      });
    }

    const room = await ctx.db
      .query('rooms')
      .withIndex('by_code', (q) => q.eq('code', args.roomCode))
      .unique();
    if (!room) {
      throw new ApplicationError({
        code: ERROR_CODES.NOT_FOUND,
        message: 'Room not found',
      });
    }

    // Check if the user is already a participant
    const existingParticipant = await ctx.db
      .query('participants')
      .withIndex('by_room_and_user', (query) =>
        query.eq('roomId', room._id).eq('userId', userIdentity.userId as string)
      )
      .unique();

    if (existingParticipant) {
      // reactivate the participant if they were inactive
      await ctx.db.patch(existingParticipant._id, { isActive: true });
    } else {
      // If not, create a new participant entry
      await ctx.db.insert('participants', {
        roomId: room._id,
        userId: userIdentity.userId as string,
        isActive: true,
        userName: args.userDisplayName || getUserNameFromIdentity(userIdentity),
      });
    }

    return {
      roomId: room._id,
      roomCode: room.code,
    };
  },
});

export const getRoomByCode = query({
  args: {
    roomCode: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new ApplicationError({
        code: ERROR_CODES.UNAUTHORIZED,
        message: 'Must be logged in to perform this action',
      });
    }

    if (!isValidRoomCode(args.roomCode)) {
      throw new ApplicationError({
        code: ERROR_CODES.VALIDATION_ERROR,
        message: 'Invalid room code',
      });
    }

    const room = await ctx.db
      .query('rooms')
      .withIndex('by_code', (q) => q.eq('code', args.roomCode))
      .unique();

    if (!room) {
      throw new ApplicationError({
        code: ERROR_CODES.NOT_FOUND,
        message: 'Room not found',
      });
    }

    const isParticipant = await ctx.db
      .query('participants')
      .withIndex('by_room_and_user', (q) =>
        q.eq('roomId', room._id).eq('userId', userId)
      )
      .unique();

    if (!isParticipant) {
      throw new ApplicationError({
        code: ERROR_CODES.UNAUTHORIZED,
        message: 'Room not found',
      });
    }

    return room;
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
  },
  async handler(ctx, args) {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new ApplicationError({
        code: ERROR_CODES.UNAUTHORIZED,
        message: 'Must be logged in to start voting',
      });
    }

    const room = await ctx.db.get(args.roomId);
    if (!room) {
      throw new ApplicationError({
        code: ERROR_CODES.NOT_FOUND,
        message: 'Room not found',
      });
    }

    if (room.ownerId !== userId) {
      throw new ApplicationError({
        code: ERROR_CODES.UNAUTHORIZED,
        message: 'Only room creator can start voting',
      });
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
      throw new ApplicationError({
        code: ERROR_CODES.UNAUTHORIZED,
        message: 'Must be logged in to reveal voting',
      });
    }

    const room = await ctx.db.get(args.roomId);
    if (!room) {
      throw new ApplicationError({
        code: ERROR_CODES.NOT_FOUND,
        message: 'Room not found',
      });
    }

    if (room.ownerId !== userId) {
      throw new ApplicationError({
        code: ERROR_CODES.UNAUTHORIZED,
        message: 'Only room creator can reveal votes',
      });
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
      throw new ApplicationError({
        code: ERROR_CODES.UNAUTHORIZED,
        message: 'Must be logged in',
      });
    }

    const room = await ctx.db.get(args.roomId);
    if (!room) {
      throw new ApplicationError({
        code: ERROR_CODES.NOT_FOUND,
        message: 'Room not found',
      });
    }

    if (room.ownerId !== userId) {
      throw new ApplicationError({
        code: ERROR_CODES.UNAUTHORIZED,
        message: 'Only room creator can reset voting',
      });
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
      votesRevealed: false,
    });
  },
});
