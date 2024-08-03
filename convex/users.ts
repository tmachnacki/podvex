import { ConvexError, v } from "convex/values";

import {
  internalMutation,
  internalQuery,
  mutation,
  query,
} from "./_generated/server";

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
      listeners: [],
      isVerified: false,
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

export const updateListeners = mutation({
  args: {
    listenerId: v.string(),
    authorId: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new ConvexError("Unauthorized");

    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("clerkId"), args.authorId))
      .unique();

    if (!user) {
      throw new ConvexError("User not found");
    }

    if (!user.listeners.includes(args.listenerId)) {
      await ctx.db.patch(user._id, {
        listeners: [...user.listeners, args.listenerId],
      });
    }
  },
});

export const updateSubscription = internalMutation({
  args: {
    priceId: v.string(),
    userId: v.string(),
    stripeCustomerId: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", args.userId))
      .first();

    if (!user) {
      throw new ConvexError("User not found");
    }

    await ctx.db.patch(user._id, {
      priceId: args.priceId,
      isVerified: true,
      stripeCustomerId: args.stripeCustomerId,
    });
  },
});

export const updateSubscriptionByPriceId = internalMutation({
  args: { priceId: v.string(), userId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", args.userId))
      .first();

    if (!user) {
      throw new ConvexError("User matching stripe customer id not found");
    }

    await ctx.db.patch(user._id, {
      isVerified: true,
    });
  },
});

export const cancelSubscription = internalMutation({
  args: { priceId: v.string(), userId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", args.userId))
      .first();

    if (!user) {
      throw new ConvexError("User not found");
    }

    await ctx.db.patch(user._id, {
      priceId: args.priceId,
      isVerified: false,
    });
  },
});

export const getUserByCustomerId = query({
  args: { stripeCustomerId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_stripeCustomerId", (q) =>
        q.eq("stripeCustomerId", args.stripeCustomerId),
      )
      .first();

    if (!user) {
      throw new ConvexError("No user found with stripe customer id");
    }

    return user;
  },
});

export const getUserCustomer = internalQuery({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", args.userId))
      .first();

    if (!user) {
      throw new ConvexError("User not found");
    }
    if (!user.stripeCustomerId) {
      throw new ConvexError("User has no stripe customer id");
    }

    return user;
  },
});

export const removePodcastFromUsersSaves = mutation({
  args: { podcastId: v.id("podcasts") },
  handler: async (ctx, args) => {
    const users = await ctx.db.query("users").collect();

    const usersWithPodcastSaved = users.filter((u) =>
      u.savedPodcasts.includes(args.podcastId),
    );

    await Promise.all(
      usersWithPodcastSaved.map(async (u) => {
        await ctx.db.patch(u._id, {
          savedPodcasts: u.savedPodcasts.filter(
            (pId) => pId !== args.podcastId,
          ),
        });
      }),
    );
  },
});
