import { v } from 'convex/values';
import { query } from './_generated/server';

export const getParticipantsWithVotes = query({
  args: {
    roomId: v.id('rooms'),
  },
  handler: async (ctx, args) => {
    const participants = await ctx.db
      .query('participants')
      .withIndex('by_room', (q) => q.eq('roomId', args.roomId))
      .collect();

    const votes = await ctx.db
      .query('votes')
      .withIndex('by_room', (q) => q.eq('roomId', args.roomId))
      .collect();

    const voteMap = new Map(votes.map((vote) => [vote.userId, vote]));

    const participantsWithVotes = participants.map((participant) => {
      return {
        ...participant,
        vote: voteMap.get(participant.userId) ?? null,
      };
    });

    return participantsWithVotes;
  },
});
