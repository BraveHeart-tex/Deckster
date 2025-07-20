import { v } from 'convex/values';

import { internalMutation } from './_generated/server';

export const deleteRoomEntities = internalMutation({
  args: {
    roomId: v.id('rooms'),
  },
  handler: async (ctx, args) => {
    // Since record count will be low, we can just delete everything at once
    const [roomSetting, participants, votes, bannedUsers] = await Promise.all([
      ctx.db
        .query('roomSettings')
        .withIndex('by_room', (q) => q.eq('roomId', args.roomId))
        .unique(),

      ctx.db
        .query('participants')
        .withIndex('by_room', (q) => q.eq('roomId', args.roomId))
        .collect(),

      ctx.db
        .query('votes')
        .withIndex('by_room', (q) => q.eq('roomId', args.roomId))
        .collect(),

      ctx.db
        .query('bannedUsers')
        .withIndex('by_room', (q) => q.eq('roomId', args.roomId))
        .collect(),
    ]);

    const deletions = [];

    if (roomSetting) {
      deletions.push(ctx.db.delete(roomSetting._id));
    }

    for (const p of participants) {
      deletions.push(ctx.db.delete(p._id));
    }

    for (const v of votes) {
      deletions.push(ctx.db.delete(v._id));
    }

    for (const b of bannedUsers) {
      deletions.push(ctx.db.delete(b._id));
    }

    await Promise.all(deletions);
  },
});

export const deleteParticipantEntities = internalMutation({
  args: {
    participantId: v.id('participants'),
    roomId: v.id('rooms'),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const vote = await ctx.db
      .query('votes')
      .withIndex('by_room_and_user', (q) =>
        q.eq('roomId', args.roomId).eq('userId', args.userId)
      )
      .unique();

    if (vote) {
      await ctx.db.delete(vote._id);
    }
  },
});
