import { v } from 'convex/values';

import { ApplicationError, ERROR_CODES } from '../shared/errorCodes';
import { mutation, query } from './_generated/server';

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

export const getRoomSettingsByRoomId = query({
  args: {
    roomId: v.id('rooms'),
  },
  handler: async (ctx, args) => {
    const userIdentity = await ctx.auth.getUserIdentity();
    if (userIdentity === null) {
      throw new ApplicationError({
        code: ERROR_CODES.UNAUTHORIZED,
        message: 'You must be logged in to perform this action',
      });
    }

    const setting = await ctx.db
      .query('roomSettings')
      .withIndex('by_room', (q) => q.eq('roomId', args.roomId))
      .unique();

    if (!setting) {
      throw new ApplicationError({
        code: ERROR_CODES.NOT_FOUND,
        message: 'Room settings not found',
      });
    }

    return setting;
  },
});
