import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  skills: defineTable({
    name: v.string(),
    slug: v.string(),
    description: v.string(),
    author: v.string(),
    stars: v.number(),
    downloads: v.number(),
    versions: v.number(),
    url: v.string(),
    createdAt: v.number(),
  }).index("by_stars", ["stars"]),

  votes: defineTable({
    skillId: v.id("skills"),
    userId: v.string(), // user ID or anonymous ID
    createdAt: v.number(),
  }).index("by_skill", ["skillId"]).index("by_user_skill", ["userId", "skillId"]),

  users: defineTable({
    username: v.optional(v.string()),
    anonymousId: v.string(),
    createdAt: v.number(),
  }).index("by_anonymous", ["anonymousId"]),
});
