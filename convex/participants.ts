import { v } from 'convex/values';

import { ApplicationError, ERROR_CODES } from '../shared/errorCodes';
import { isValidRoomCode } from '../shared/generateRoomCode';
import { mutation, query } from './_generated/server';
import { ensureUniqueDisplayName } from './helpers';

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
        isOwner: participant.userId === room.ownerId,
      };
    });

    return participantsWithVotes;
  },
});

export const changeDisplayName = mutation({
  args: {
    displayName: v.string(),
    participantId: v.id('participants'),
  },
  handler: async (ctx, args) => {
    const userIdentity = await ctx.auth.getUserIdentity();
    if (!userIdentity) {
      throw new ApplicationError({
        code: ERROR_CODES.UNAUTHORIZED,
        message: 'You must be logged in to change your display name',
      });
    }

    const participant = await ctx.db.get(args.participantId);

    if (!participant) {
      throw new ApplicationError({
        code: ERROR_CODES.NOT_FOUND,
        message: 'Participant not found',
      });
    }

    if (participant.userId !== userIdentity.userId) {
      throw new ApplicationError({
        code: ERROR_CODES.FORBIDDEN,
        message: 'Forbidden',
      });
    }

    if (participant.userName === args.displayName) {
      return;
    }

    await ensureUniqueDisplayName(ctx, args.displayName);

    await ctx.db.patch(args.participantId, {
      userName: args.displayName,
    });

    return args.displayName;
  },
});
