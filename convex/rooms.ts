import { v } from 'convex/values';
import { getAll } from 'convex-helpers/server/relationships';

import { DOMAIN_ERROR_CODES, DomainError } from '../shared/domainErrorCodes';
import { generateRoomCode, isValidRoomCode } from '../shared/generateRoomCode';
import { api, internal } from './_generated/api';
import {
  assertRoomExists,
  authMutation,
  authQuery,
  getUserNameFromIdentity,
} from './helpers';

export const createRoom = authMutation({
  args: {
    roomName: v.string(),
    userDisplayName: v.string(),
  },
  handler: async (ctx, args) => {
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
      ownerId: ctx.userIdentity.userId as string,
      votesRevealed: false,
      code: roomCode,
      locked: false,
    });

    await ctx.db.insert('roomSettings', {
      roomId,
      allowOthersToRevealVotes: true,
      allowOthersToDeleteVotes: true,
      showAverageOfVotes: true,
      showUserPresence: true,
      showVotingIndicator: true,
      highlightConsensusVotes: true,
    });

    await ctx.db.insert('participants', {
      userId: ctx.userIdentity.userId as string,
      userName:
        args.userDisplayName || getUserNameFromIdentity(ctx.userIdentity),
      roomId,
    });

    return {
      roomId,
      roomCode,
    };
  },
});

export const joinRoom = authMutation({
  args: {
    roomCode: v.string(),
    userDisplayName: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    if (!isValidRoomCode(args.roomCode)) {
      throw new DomainError({
        code: DOMAIN_ERROR_CODES.ROOM.INVALID_CODE,
        message: 'Invalid room code',
      });
    }

    const room = await ctx.db
      .query('rooms')
      .withIndex('by_code', (q) => q.eq('code', args.roomCode))
      .unique();

    assertRoomExists(room);

    const bannedUser = await ctx.db
      .query('bannedUsers')
      .withIndex('by_room_and_user', (query) =>
        query
          .eq('roomId', room._id)
          .eq('userId', ctx.userIdentity.userId as string)
      )
      .unique();

    if (bannedUser) {
      throw new DomainError({
        code: DOMAIN_ERROR_CODES.ROOM.BANNED,
        message: `You are banned from this entering this room. Reason: ${bannedUser.reason}`,
      });
    }

    const existingParticipant = await ctx.db
      .query('participants')
      .withIndex('by_room_and_user', (query) =>
        query
          .eq('roomId', room._id)
          .eq('userId', ctx.userIdentity.userId as string)
      )
      .unique();

    if (!existingParticipant) {
      if (room.locked) {
        throw new DomainError({
          code: DOMAIN_ERROR_CODES.ROOM.LOCKED,
          message: 'Room is currently locked. Please try again later.',
        });
      }

      await ctx.db.insert('participants', {
        roomId: room._id,
        userId: ctx.userIdentity.userId as string,
        userName:
          args.userDisplayName || getUserNameFromIdentity(ctx.userIdentity),
      });
    }

    return {
      roomId: room._id,
      roomCode: room.code,
    };
  },
});

export const getRoomWithDetailsByCode = authQuery({
  args: {
    roomCode: v.string(),
  },
  handler: async (ctx, args) => {
    if (!isValidRoomCode(args.roomCode)) {
      throw new DomainError({
        code: DOMAIN_ERROR_CODES.ROOM.INVALID_CODE,
        message: 'Invalid room code',
      });
    }

    const room = await ctx.db
      .query('rooms')
      .withIndex('by_code', (q) => q.eq('code', args.roomCode))
      .unique();

    assertRoomExists(room);

    const isBanned = await ctx.db
      .query('bannedUsers')
      .withIndex('by_room_and_user', (q) =>
        q.eq('roomId', room._id).eq('userId', ctx.userIdentity.userId as string)
      )
      .unique();

    if (isBanned) {
      throw new DomainError({
        code: DOMAIN_ERROR_CODES.ROOM.BANNED,
        message: `You are banned from this entering this room. Reason: ${isBanned.reason}`,
      });
    }

    const isParticipant = await ctx.db
      .query('participants')
      .withIndex('by_room_and_user', (q) =>
        q.eq('roomId', room._id).eq('userId', ctx.userIdentity.userId as string)
      )
      .unique();

    if (!isParticipant) {
      throw new DomainError({
        code: DOMAIN_ERROR_CODES.ROOM.NOT_PARTICIPANT,
        message: 'Must be a room participant to perform this action',
      });
    }

    const [participants, roomSettings, votes] = await Promise.all([
      await ctx.db
        .query('participants')
        .withIndex('by_room', (q) => q.eq('roomId', room._id))
        .collect(),
      await ctx.db
        .query('roomSettings')
        .withIndex('by_room', (q) => q.eq('roomId', room._id))
        .unique(),
      await ctx.db
        .query('votes')
        .withIndex('by_room', (q) => q.eq('roomId', room._id))
        .collect(),
    ]);

    return {
      room: {
        _id: room._id,
        _creationTime: room._creationTime,
        hasPassword: !!room.password,
        name: room.name,
        code: room.code,
        ownerId: room.ownerId,
        votesRevealed: room.votesRevealed,
        locked: room.locked,
      },
      participants: participants.map((participant) => ({
        ...participant,
        isOwner: participant.userId === room.ownerId,
        vote: votes.find((vote) => vote.userId === participant.userId)?.value,
      })),
      roomSettings,
      currentUserVote: votes.find(
        (vote) => vote.userId === ctx.userIdentity.userId
      )?.value,
    };
  },
});

export const getUserRooms = authQuery({
  args: {},
  handler: async (ctx) => {
    const participations = await ctx.db
      .query('participants')
      .withIndex('by_userId', (q) =>
        q.eq('userId', ctx.userIdentity.userId as string)
      )
      .collect();

    const roomIds = participations.map((p) => p.roomId);
    if (roomIds.length === 0) {
      return [];
    }

    const rooms = await getAll(ctx.db, roomIds);

    return rooms.filter((room) => room !== null);
  },
});

export const toggleVotesRevealed = authMutation({
  args: {
    roomId: v.id('rooms'),
  },
  handler: async (ctx, args) => {
    const room = await ctx.db.get(args.roomId);
    assertRoomExists(room);

    const roomSettings = await ctx.runQuery(
      api.roomSettings.getRoomSettingsByRoomId,
      {
        roomId: args.roomId,
      }
    );

    if (
      !roomSettings.allowOthersToRevealVotes &&
      room.ownerId !== ctx.userIdentity.userId
    ) {
      throw new DomainError({
        code: DOMAIN_ERROR_CODES.AUTH.FORBIDDEN,
        message: 'Only the room creator can reveal votes',
      });
    }

    await ctx.db.patch(args.roomId, {
      votesRevealed: !room.votesRevealed,
    });
  },
});

export const resetVoting = authMutation({
  args: {
    roomId: v.id('rooms'),
  },
  handler: async (ctx, args) => {
    const room = await ctx.db.get(args.roomId);
    assertRoomExists(room);

    if (room.ownerId !== ctx.userIdentity.userId) {
      throw new DomainError({
        code: DOMAIN_ERROR_CODES.AUTH.UNAUTHORIZED,
        message: 'Only room creator can reset voting',
      });
    }

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

export const deleteRoom = authMutation({
  args: {
    roomId: v.id('rooms'),
  },
  handler: async (ctx, args) => {
    const room = await ctx.db.get(args.roomId);
    assertRoomExists(room);

    if (room.ownerId !== ctx.userIdentity.userId) {
      throw new DomainError({
        code: DOMAIN_ERROR_CODES.AUTH.FORBIDDEN,
        message: 'Only room creator can delete room',
      });
    }

    await ctx.db.delete(args.roomId);
    await ctx.scheduler.runAfter(0, internal.cleanUp.deleteRoomEntities, {
      roomId: args.roomId,
    });
  },
});

export const transferRoomOwnership = authMutation({
  args: {
    roomId: v.id('rooms'),
    newOwnerId: v.string(),
  },
  handler: async (ctx, args) => {
    const room = await ctx.db.get(args.roomId);
    assertRoomExists(room);

    if (room.ownerId !== ctx.userIdentity.userId) {
      throw new DomainError({
        code: DOMAIN_ERROR_CODES.AUTH.FORBIDDEN,
        message: 'Only the room creator can transfer ownership',
      });
    }

    const isNewOwnerParticipant = await ctx.db
      .query('participants')
      .withIndex('by_room_and_user', (q) =>
        q.eq('roomId', args.roomId).eq('userId', args.newOwnerId)
      )
      .unique();

    if (!isNewOwnerParticipant) {
      throw new DomainError({
        code: DOMAIN_ERROR_CODES.PARTICIPANT.NOT_FOUND,
        message: 'New owner must be a room participant',
      });
    }

    await ctx.db.patch(args.roomId, {
      ownerId: args.newOwnerId,
    });
  },
});

export const banUser = authMutation({
  args: {
    roomId: v.id('rooms'),
    userId: v.string(),
    reason: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const room = await ctx.db.get(args.roomId);
    assertRoomExists(room);

    if (room.ownerId !== ctx.userIdentity.userId) {
      throw new DomainError({
        code: DOMAIN_ERROR_CODES.AUTH.FORBIDDEN,
        message: 'Only the room creator can ban users',
      });
    }

    const participant = await ctx.db
      .query('participants')
      .withIndex('by_room_and_user', (q) =>
        q.eq('roomId', args.roomId).eq('userId', args.userId)
      )
      .unique();

    if (!participant) {
      throw new DomainError({
        code: DOMAIN_ERROR_CODES.PARTICIPANT.NOT_FOUND,
        message: 'User not found in room',
      });
    }

    await Promise.all([
      ctx.db.insert('bannedUsers', {
        roomId: args.roomId,
        userId: args.userId,
        reason: args.reason,
        bannedAt: Date.now(),
        bannedBy: ctx.userIdentity.userId,
      }),
      ctx.db.delete(participant._id),
    ]);
    await ctx.scheduler.runAfter(
      0,
      internal.cleanUp.deleteParticipantEntities,
      {
        participantId: participant._id,
        roomId: args.roomId,
        userId: args.userId,
      }
    );
  },
});

export const toggleRoomLock = authMutation({
  args: {
    roomId: v.id('rooms'),
  },
  handler: async (ctx, args) => {
    const room = await ctx.db.get(args.roomId);
    assertRoomExists(room);

    if (room.ownerId !== ctx.userIdentity.userId) {
      throw new DomainError({
        code: DOMAIN_ERROR_CODES.AUTH.FORBIDDEN,
        message: 'Only the room owner can toggle the room lock',
      });
    }

    await ctx.db.patch(args.roomId, {
      locked: !room.locked,
    });
  },
});

export const getBannedUsers = authQuery({
  args: {
    roomId: v.id('rooms'),
  },
  handler: async (ctx, args) => {
    const bannedUsers = await ctx.db
      .query('bannedUsers')
      .withIndex('by_room', (q) => q.eq('roomId', args.roomId))
      .collect();

    const userInfos = await Promise.all(
      bannedUsers.map((bannedUser) =>
        ctx.db
          .query('users')
          .withIndex('byExternalId', (q) =>
            q.eq('externalId', bannedUser.userId)
          )
          .unique()
      )
    );

    const userInfoMap = userInfos.reduce((map, user) => {
      if (user !== null) {
        map.set(user.externalId, user);
      }
      return map;
    }, new Map<string, (typeof userInfos)[number]>());

    return bannedUsers.reduce(
      (accumulator, bannedUser) => {
        const userInfo = userInfoMap.get(bannedUser.userId);
        if (!userInfo) {
          return accumulator;
        }
        accumulator.push({
          ...bannedUser,
          email: userInfo.email,
          name: userInfo.name,
        });
        return accumulator;
      },
      [] as Array<
        (typeof bannedUsers)[number] & { email?: string; name: string }
      >
    );
  },
});

export const revokeBan = authMutation({
  args: {
    roomId: v.id('rooms'),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const room = await ctx.db.get(args.roomId);
    assertRoomExists(room);

    if (room.ownerId !== ctx.userIdentity.userId) {
      throw new DomainError({
        code: DOMAIN_ERROR_CODES.AUTH.FORBIDDEN,
        message: 'Only the room owner can revoke bans',
      });
    }

    const bannedUser = await ctx.db
      .query('bannedUsers')
      .withIndex('by_room_and_user', (q) =>
        q.eq('roomId', args.roomId).eq('userId', args.userId)
      )
      .unique();

    if (!bannedUser) {
      throw new DomainError({
        code: DOMAIN_ERROR_CODES.BANNED_USER.NOT_FOUND,
        message: 'Ban not found',
      });
    }

    await ctx.db.delete(bannedUser._id);
  },
});

export const setRoomPassword = authMutation({
  args: {
    roomId: v.id('rooms'),
    passwordHash: v.string(),
  },
  handler: async (ctx, args) => {
    const room = await ctx.db.get(args.roomId);
    assertRoomExists(room);

    if (room.ownerId !== ctx.userIdentity.userId) {
      throw new DomainError({
        code: DOMAIN_ERROR_CODES.AUTH.FORBIDDEN,
        message: 'Only the room owner can set a password',
      });
    }

    await ctx.db.patch(args.roomId, {
      password: args.passwordHash,
    });
  },
});
