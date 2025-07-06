import { v } from 'convex/values';

import { ApplicationError, ERROR_CODES } from '../shared/errorCodes';
import { isValidRoomCode } from '../shared/generateRoomCode';
import { query } from './_generated/server';

export const getParticipantsWithVotes = query({
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
