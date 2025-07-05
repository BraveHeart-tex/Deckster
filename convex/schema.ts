import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
  rooms: defineTable({
    name: v.string(),
    createdBy: v.string(),
    isVotingActive: v.boolean(),
    votesRevealed: v.boolean(),
  }).index('by_created_by', ['createdBy']),
  votes: defineTable({
    roomId: v.id('rooms'),
    userId: v.string(),
    userName: v.string(),
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
    .index('by_room_and_user', ['roomId', 'userId']),
});
