import { authTables } from '@convex-dev/auth/server';
import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

const applicationTables = {
  rooms: defineTable({
    name: v.string(),
    createdBy: v.id('users'),
    currentStory: v.optional(v.string()),
    isVotingActive: v.boolean(),
    votesRevealed: v.boolean(),
  }).index('by_created_by', ['createdBy']),
  votes: defineTable({
    roomId: v.id('rooms'),
    userId: v.id('users'),
    userName: v.string(),
    value: v.union(v.string(), v.null()),
    storyTitle: v.optional(v.string()),
  })
    .index('by_room', ['roomId'])
    .index('by_room_and_user', ['roomId', 'userId']),
  participants: defineTable({
    roomId: v.id('rooms'),
    userId: v.id('users'),
    userName: v.string(),
    isActive: v.boolean(),
  })
    .index('by_room', ['roomId'])
    .index('by_room_and_user', ['roomId', 'userId']),
};

export default defineSchema({
  ...authTables,
  ...applicationTables,
});
