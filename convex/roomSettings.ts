import { v } from 'convex/values';

import { areArraysEqualUnordered } from '../shared/areArraysEqualUnordered';
import { DOMAIN_ERROR_CODES, DomainError } from '../shared/domainErrorCodes';
import { authMutation, authQuery } from './helpers';

export const updateRoomSettings = authMutation({
  args: {
    roomSettingId: v.id('roomSettings'),
    allowOthersToRevealVotes: v.optional(v.boolean()),
    allowOthersToDeleteVotes: v.optional(v.boolean()),
    showUserPresence: v.optional(v.boolean()),
    showAverageOfVotes: v.optional(v.boolean()),
    showVotingIndicator: v.optional(v.boolean()),
    highlightConsensusVotes: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const roomSetting = await ctx.db.get(args.roomSettingId);
    if (!roomSetting) {
      throw new DomainError({
        code: DOMAIN_ERROR_CODES.ROOM_SETTINGS.NOT_FOUND,
        message: 'Room settings not found',
      });
    }

    const room = await ctx.db.get(roomSetting.roomId);
    if (!room) {
      throw new DomainError({
        code: DOMAIN_ERROR_CODES.ROOM.NOT_FOUND,
        message: 'Room not found',
      });
    }

    if (room.ownerId !== ctx.userIdentity.userId) {
      throw new DomainError({
        code: DOMAIN_ERROR_CODES.AUTH.FORBIDDEN,
        message: 'You do not have permission to update the room settings',
      });
    }

    const { roomSettingId: id, ...fieldsToUpdate } = args;
    await ctx.db.patch(id, fieldsToUpdate);
  },
});

export const getRoomSettingsByRoomId = authQuery({
  args: {
    roomId: v.id('rooms'),
  },
  handler: async (ctx, args) => {
    const setting = await ctx.db
      .query('roomSettings')
      .withIndex('by_room', (q) => q.eq('roomId', args.roomId))
      .unique();

    if (!setting) {
      throw new DomainError({
        code: DOMAIN_ERROR_CODES.ROOM_SETTINGS.NOT_FOUND,
        message: 'Room settings not found',
      });
    }

    return setting;
  },
});

export const updateRoomDeck = authMutation({
  args: {
    roomId: v.id('rooms'),
    roomSettingId: v.id('roomSettings'),
    newDeck: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const room = await ctx.db.get(args.roomId);
    if (!room) {
      throw new DomainError({
        code: DOMAIN_ERROR_CODES.ROOM.NOT_FOUND,
        message: 'Room not found',
      });
    }

    if (room.ownerId !== ctx.userIdentity.userId) {
      throw new DomainError({
        code: DOMAIN_ERROR_CODES.AUTH.FORBIDDEN,
        message: 'You do not have permission to update the room settings',
      });
    }

    const roomSetting = await ctx.db.get(args.roomSettingId);
    if (!roomSetting) {
      throw new DomainError({
        code: DOMAIN_ERROR_CODES.ROOM_SETTINGS.NOT_FOUND,
        message: 'Room settings not found',
      });
    }

    if (
      roomSetting.deck &&
      areArraysEqualUnordered(roomSetting.deck, args.newDeck)
    ) {
      return;
    }

    const votes = await ctx.db
      .query('votes')
      .withIndex('by_room', (q) => q.eq('roomId', args.roomId))
      .collect();

    await Promise.all([
      ...votes.map((vote) => ctx.db.delete(vote._id)),
      ctx.db.patch(roomSetting._id, {
        deck: args.newDeck,
      }),
    ]);
  },
});
