import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
  rooms: defineTable({
    name: v.string(),
    code: v.string(),
    ownerId: v.string(),
    votesRevealed: v.boolean(),
  })
    .index('by_owner_id', ['ownerId'])
    .index('by_code', ['code']),
  roomSettings: defineTable({
    roomId: v.id('rooms'),
    allowOthersToRevealVotes: v.boolean(),
    allowOthersToDeleteVotes: v.boolean(),
    showUserPresence: v.boolean(),
    showAverageOfVotes: v.boolean(),
  }).index('by_room', ['roomId']),
  votes: defineTable({
    roomId: v.id('rooms'),
    userId: v.string(),
    value: v.union(v.string(), v.null()),
  })
    .index('by_room', ['roomId'])
    .index('by_room_and_user', ['roomId', 'userId']),
  participants: defineTable({
    roomId: v.id('rooms'),
    userId: v.string(),
    userName: v.string(),
    isActive: v.boolean(),
  })
    .index('by_room', ['roomId'])
    .index('by_room_and_user', ['roomId', 'userId'])
    .index('by_userName', ['userName']),
  bannedUsers: defineTable({
    roomId: v.id('rooms'),
    userId: v.string(),
    bannedAt: v.number(),
    bannedBy: v.string(),
    reason: v.optional(v.string()),
  })
    .index('by_room', ['roomId'])
    .index('by_room_and_user', ['roomId', 'userId']),
});
