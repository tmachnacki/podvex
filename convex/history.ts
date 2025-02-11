import { ConvexError, v } from "convex/values";
import { internalMutation, mutation, query } from "./_generated/server";
import { userQuery } from "./users";

// update current user's listening history
export const updateHistory = mutation({
  args: { podcastId: v.id("podcasts") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      console.warn("[UPDATE HISTORY] User not authenticated");
      throw new ConvexError("[UPDATE HISTORY] User not authenticated");
    }

    const user = await userQuery(ctx, identity.subject);

    if (!user) {
      console.warn("[UPDATE HISTORY] User not found");
      throw new ConvexError("[UPDATE HISTORY] User not found");
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

// remove podcast entries from history table
export const deletePodcastHistory = internalMutation({
  args: { podcastId: v.id("podcasts") },
  handler: async (ctx, args) => {
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

// used to delete user history upon clerk webhook user.deleted event
export const deleteUserHistory = internalMutation({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    const user = await userQuery(ctx, args.clerkId);

    if (!user) {
      console.warn("[DELETE USER HISTORY] User not found");
      return;
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

export const getSinglePodcastHistory = query({
  args: { userId: v.string(), podcastId: v.id("podcasts") },
  handler: async (ctx, args) => {
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

export const getCurrentUserHistory = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      console.warn("[USER HISTORY] User not authenticated");
      return null;
    }

    const user = await userQuery(ctx, identity.subject);

    if (!user) {
      console.warn("[USER HISTORY] User not found");
      return null;
    }

    return await ctx.db
      .query("history")
      .withIndex("by_user", (q) => q.eq("user", user._id))
      .collect();
  },
});
