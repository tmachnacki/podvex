import { ConvexError, v } from "convex/values";

import { internalMutation, mutation, query } from "./_generated/server";

export const getUserById = query({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("clerkId"), args.clerkId))
      .unique();

    if (!user) {
      throw new ConvexError("User not found");
    }

    return user;
  },
});

// get the top user by podcast count
export const getTopUserByPodcastCount = query({
  args: {},
  handler: async (ctx, args) => {
    const user = await ctx.db.query("users").collect();

    const userData = await Promise.all(
      user.map(async (u) => {
        const podcasts = await ctx.db
          .query("podcasts")
          .filter((q) => q.eq(q.field("authorId"), u.clerkId))
          .collect();

        const sortedPodcasts = podcasts.sort((a, b) => b.views - a.views);

        return {
          ...u,
          totalPodcasts: podcasts.length,
          podcast: sortedPodcasts.map((p) => ({
            podcastTitle: p.podcastTitle,
            podcastId: p._id,
          })),
        };
      }),
    );

    return userData.sort((a, b) => b.totalPodcasts - a.totalPodcasts);
  },
});

export const createUser = internalMutation({
  args: {
    clerkId: v.string(),
    email: v.string(),
    imageUrl: v.string(),
    name: v.string(),
    favorites: v.optional(v.array(v.id("podcasts"))),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("users", {
      clerkId: args.clerkId,
      email: args.email,
      imageUrl: args.imageUrl,
      name: args.name,
      savedPodcasts: [],
    });
  },
});

export const updateUser = internalMutation({
  args: {
    clerkId: v.string(),
    imageUrl: v.string(),
    email: v.string(),
  },
  async handler(ctx, args) {
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("clerkId"), args.clerkId))
      .unique();

    if (!user) {
      throw new ConvexError("User not found");
    }

    await ctx.db.patch(user._id, {
      imageUrl: args.imageUrl,
      email: args.email,
    });

    const podcast = await ctx.db
      .query("podcasts")
      .filter((q) => q.eq(q.field("authorId"), args.clerkId))
      .collect();

    await Promise.all(
      podcast.map(async (p) => {
        await ctx.db.patch(p._id, {
          authorImageUrl: args.imageUrl,
        });
      }),
    );
  },
});

export const deleteUser = internalMutation({
  args: { clerkId: v.string() },
  async handler(ctx, args) {
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("clerkId"), args.clerkId))
      .unique();

    if (!user) {
      throw new ConvexError("User not found");
    }

    await ctx.db.delete(user._id);
  },
});

export const savePodast = mutation({
  args: { podcastId: v.id("podcasts"), clerkId: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new ConvexError("Unauthorized");

    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("clerkId"), args.clerkId))
      .unique();

    if (!user) {
      throw new ConvexError("User not found");
    }

    await ctx.db.patch(user._id, {
      savedPodcasts: [...user.savedPodcasts!, args.podcastId],
    });
  },
});

export const unsavePodast = mutation({
  args: { podcastId: v.id("podcasts"), clerkId: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new ConvexError("Unauthorized");

    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("clerkId"), args.clerkId))
      .unique();

    if (!user) {
      throw new ConvexError("User not found");
    }

    const updatedSavedPodcasts = user.savedPodcasts.filter(
      (pId) => args.podcastId !== pId,
    );

    await ctx.db.patch(user._id, {
      savedPodcasts: updatedSavedPodcasts,
    });
  },
});
