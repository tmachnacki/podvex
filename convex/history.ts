import { ConvexError, v } from "convex/values";
import { internalMutation, mutation, query } from "./_generated/server";

export const updateHistory = mutation({
  args: { userId: v.string(), podcastId: v.id("podcasts") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new ConvexError("Unauthorized");

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", args.userId))
      .first();

    if (!user) {
      throw new ConvexError("User not found");
    }

    const inHistory = await ctx.db
      .query("history")
      .filter((q) =>
        q.and(
          q.eq(q.field("user"), user._id),
          q.eq(q.field("podcastId"), args.podcastId),
        ),
      )
      .first();

    if (inHistory) {
      await ctx.db.patch(inHistory._id, {
        listenedAt: Date.now(),
      });
    } else {
      await ctx.db.insert("history", {
        user: user._id,
        podcastId: args.podcastId,
        listenedAt: Date.now(),
      });
    }
  },
});

export const deletePodcastHistory = mutation({
  args: { podcastId: v.id("podcasts") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new ConvexError("Unauthorized");
    const historiesWithPodcast = await ctx.db
      .query("history")
      .withIndex("by_podcastId", (q) => q.eq("podcastId", args.podcastId))
      .collect();

    await Promise.all(
      historiesWithPodcast.map(async (h) => {
        await ctx.db.delete(h._id);
      }),
    );
  },
});

export const deleteUserHistory = internalMutation({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", args.userId))
      .first();

    if (!user) {
      throw new ConvexError("User not found");
    }

    const historiesWithUser = await ctx.db
      .query("history")
      .withIndex("by_user", (q) => q.eq("user", user._id))
      .collect();

    await Promise.all(
      historiesWithUser.map(async (h) => {
        await ctx.db.delete(h._id);
      }),
    );
  },
});

export const getSinglePodastHistory = query({
  args: { userId: v.string(), podcastId: v.id("podcasts") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new ConvexError("Unauthorized");
    const podcast = await ctx.db
      .query("history")
      .filter((q) =>
        q.and(
          q.eq(q.field("user"), args.userId),
          q.eq(q.field("podcastId"), args.podcastId),
        ),
      )
      .first();
    return podcast;
  },
});

export const getUserHistory = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new ConvexError("Unauthorized");

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", args.userId))
      .first();

    if (!user) {
      throw new ConvexError("User not found");
    }

    const histories = await ctx.db
      .query("history")
      .withIndex("by_user", (q) => q.eq("user", user?._id))
      .collect();
    return histories;
  },
});
