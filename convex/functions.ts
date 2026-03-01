import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Get all skills with vote counts
export const getSkills = query({
  args: {},
  handler: async (ctx) => {
    const skills = await ctx.db.query("skills").collect();
    const votes = await ctx.db.query("votes").collect();

    // Count votes per skill
    const voteCounts: Record<string, number> = {};
    for (const vote of votes) {
      voteCounts[vote.skillId] = (voteCounts[vote.skillId] || 0) + 1;
    }

    // Add vote counts to skills
    return skills.map((skill) => ({
      ...skill,
      voteCount: voteCounts[skill._id] || 0,
    }));
  },
});

// Get leaderboard (skills sorted by votes)
export const getLeaderboard = query({
  args: {},
  handler: async (ctx) => {
    const skills = await ctx.db.query("skills").collect();
    const votes = await ctx.db.query("votes").collect();

    // Count votes per skill
    const voteCounts: Record<string, number> = {};
    for (const vote of votes) {
      voteCounts[vote.skillId] = (voteCounts[vote.skillId] || 0) + 1;
    }

    // Sort by votes descending
    const sorted = skills
      .map((skill) => ({
        ...skill,
        voteCount: voteCounts[skill._id] || 0,
      }))
      .sort((a, b) => b.voteCount - a.voteCount);

    return sorted;
  },
});

// Vote for a skill
export const vote = mutation({
  args: {
    skillId: v.id("skills"),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    // Check if user already voted for this skill
    const existingVote = await ctx.db
      .query("votes")
      .filter((q) =>
        q.and(
          q.eq(q.field("userId"), args.userId),
          q.eq(q.field("skillId"), args.skillId)
        )
      )
      .first();

    if (existingVote) {
      // Already voted, remove the vote (toggle)
      await ctx.db.delete(existingVote._id);
      return { success: false, message: "Vote removed" };
    }

    // Add vote
    await ctx.db.insert("votes", {
      skillId: args.skillId,
      userId: args.userId,
      createdAt: Date.now(),
    });

    return { success: true, message: "Voted" };
  },
});

// Check if user voted for a skill
export const getUserVotes = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const votes = await ctx.db
      .query("votes")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .collect();

    return votes.map((v) => v.skillId);
  },
});

// Add or update user
export const upsertUser = mutation({
  args: {
    anonymousId: v.string(),
    username: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("anonymousId"), args.anonymousId))
      .first();

    if (existing) {
      if (args.username) {
        await ctx.db.patch(existing._id, { username: args.username });
      }
      return existing._id;
    }

    const id = await ctx.db.insert("users", {
      anonymousId: args.anonymousId,
      username: args.username,
      createdAt: Date.now(),
    });

    return id;
  },
});

// Seed initial skills (for testing)
export const seedSkills = mutation({
  args: {},
  handler: async (ctx) => {
    // Check if skills already exist
    const existing = await ctx.db.query("skills").first();
    if (existing) return { message: "Skills already exist" };

    // Top skills from ClawHub
    const topSkills = [
      { name: "Ontology", slug: "ontology", description: "Typed knowledge graph for structured agent memory", author: "@oswalpalash", stars: 89700, downloads: 212, versions: 3, url: "https://clawhub.com/oswalpalash/ontology" },
      { name: "Self Improving Agent", slug: "self-improving-agent", description: "Captures learnings and errors for continuous improvement", author: "@pskoett", stars: 79900, downloads: 950, versions: 12, url: "https://clawhub.com/pskoett/self-improving-agent" },
      { name: "Gog", slug: "gog", description: "Google Workspace CLI for Gmail, Calendar, Drive", author: "@steipete", stars: 75000, downloads: 590, versions: 1, url: "https://clawhub.com/steipete/gog" },
      { name: "Tavily Search", slug: "tavily-search", description: "AI-optimized web search via Tavily API", author: "@arun-8687", stars: 70800, downloads: 316, versions: 1, url: "https://clawhub.com/arun-8687/tavily-search" },
      { name: "Find Skills", slug: "find-skills", description: "Discover and install agent skills", author: "@JimLiuxinghai", stars: 65400, downloads: 275, versions: 1, url: "https://clawhub.com/JimLiuxinghai/find-skills" },
      { name: "Summarize", slug: "summarize", description: "Summarize URLs, files, PDFs, images, audio, YouTube", author: "@steipete", stars: 62000, downloads: 293, versions: 1, url: "https://clawhub.com/steipete/summarize" },
      { name: "Agent Browser", slug: "agent-browser", description: "Rust-based headless browser automation", author: "@TheSethRose", stars: 58100, downloads: 301, versions: 2, url: "https://clawhub.com/TheSethRose/agent-browser" },
      { name: "GitHub", slug: "github", description: "Interact with GitHub using gh CLI", author: "@steipete", stars: 58100, downloads: 197, versions: 1, url: "https://clawhub.com/steipete/github" },
      { name: "Weather", slug: "weather", description: "Get current weather and forecasts", author: "@steipete", stars: 49100, downloads: 169, versions: 1, url: "https://clawhub.com/steipete/weather" },
      { name: "Sonos CLI", slug: "sonoscli", description: "Control Sonos speakers", author: "@steipete", stars: 43500, downloads: 29, versions: 1, url: "https://clawhub.com/steipete/sonoscli" },
    ];

    for (const skill of topSkills) {
      await ctx.db.insert("skills", {
        ...skill,
        createdAt: Date.now(),
      });
    }

    return { message: `Seeded ${topSkills.length} skills` };
  },
});
