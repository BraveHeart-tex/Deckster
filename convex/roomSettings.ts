import { v } from 'convex/values';

import { ApplicationError, ERROR_CODES } from '../shared/errorCodes';
import { isValidRoomCode } from '../shared/generateRoomCode';
import { mutation, query } from './_generated/server';

export const getRoomSettings = query({
  args: {
    roomCode: v.string(),
  },
  handler: async (ctx, args) => {
    if (!isValidRoomCode(args.roomCode)) {
      throw new ApplicationError({
        code: ERROR_CODES.VALIDATION_ERROR,
        message: 'Invalid room code',
      });
    }

    const userIdentity = await ctx.auth.getUserIdentity();
    if (userIdentity === null) {
      throw new ApplicationError({
        code: ERROR_CODES.UNAUTHORIZED,
        message: 'You must be logged in to perform this action',
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

    const existingParticipant = await ctx.db
      .query('participants')
      .withIndex('by_room_and_user', (query) =>
        query.eq('roomId', room._id).eq('userId', userIdentity.userId as string)
      )
      .unique();

    if (!existingParticipant) {
      throw new ApplicationError({
        code: ERROR_CODES.NOT_FOUND,
        message: 'Room not found',
      });
    }

    return await ctx.db
      .query('roomSettings')
      .withIndex('by_room', (q) => q.eq('roomId', room._id))
      .unique();
  },
});

export const updateRoomSettings = mutation({
  args: {
    roomSettingId: v.id('roomSettings'),
    allowOthersToRevealVotes: v.optional(v.boolean()),
    allowOthersToDeleteVotes: v.optional(v.boolean()),
    showUserPresence: v.optional(v.boolean()),
    showAverageOfVotes: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const userIdentity = await ctx.auth.getUserIdentity();
    if (userIdentity === null) {
      throw new ApplicationError({
        code: ERROR_CODES.UNAUTHORIZED,
        message: 'You must be logged in to perform this action',
      });
    }

    const roomSetting = await ctx.db.get(args.roomSettingId);
    if (!roomSetting) {
      throw new ApplicationError({
        code: ERROR_CODES.NOT_FOUND,
        message: 'Room settings not found',
      });
    }

    const room = await ctx.db.get(roomSetting.roomId);
    if (!room) {
      throw new ApplicationError({
        code: ERROR_CODES.NOT_FOUND,
        message: 'Room not found',
      });
    }

    if (room.ownerId !== userIdentity.userId) {
      throw new ApplicationError({
        code: ERROR_CODES.FORBIDDEN,
        message: 'You do not have permission to update the room settings',
      });
    }

    const { roomSettingId: id, ...fieldsToUpdate } = args;
    await ctx.db.patch(id, fieldsToUpdate);
  },
});
