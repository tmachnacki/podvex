import { ConvexError, v } from "convex/values";

import {
  ActionCtx,
  internalMutation,
  internalQuery,
  mutation,
  MutationCtx,
  query,
  QueryCtx,
} from "./_generated/server";
import { Doc } from "./_generated/dataModel";

/**
 * Whether the current user is fully logged in, including having their information
 * synced from Clerk via webhook.
 *
 * Like all Convex queries, errors on expired Clerk token.
 */
export const userLoginStatus = query(
  async (
    ctx,
  ): Promise<
    | ["No JWT Token", null]
    | ["No Clerk User", null]
    | ["Logged In", Doc<"users">]
  > => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      // no JWT token, user hasn't completed login flow yet
      return ["No JWT Token", null];
    }
    const user = await userQuery(ctx, identity.subject);
    if (user === null) {
      // If Clerk has not told us about this user we're still waiting for the
      // webhook notification.
      return ["No Clerk User", null];
    }
    return ["Logged In", user];
  },
);

export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      console.warn("[GET CURRENT USER] User not authenticated");

      return null;
    }
    const user = userQuery(ctx, identity.subject);
    if (!user) {
      console.warn("[GET CURRENT USER] User not found");
      return null;
    }
    return user;
  },
});

export const getUserById = query({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    const user = await userQuery(ctx, args.clerkId);
    if (!user) {
      console.warn("[GET USER BY ID] User not found");
      return null;
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
    name: v.string(),
  },
  async handler(ctx, args) {
    const user = await userQuery(ctx, args.clerkId);

    if (!user) {
      console.warn("[UPDATE USER] User not found");
      return;
    }

    await ctx.db.patch(user._id, {
      imageUrl: args.imageUrl,
      email: args.email,
      name: args.name,
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
    const user = await userQuery(ctx, args.clerkId);

    if (!user) {
      console.warn("[DELETE USER] User not found");
      return;
    }

    await ctx.db.delete(user._id);
  },
});

export const savePodcast = mutation({
  args: { podcastId: v.id("podcasts") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      console.warn("[SAVE PODCAST] User not authenticated");
      throw new ConvexError("[SAVE PODCAST] User not authenticated");
    }

    const user = await userQuery(ctx, identity.subject);

    if (!user) {
      console.warn("[SAVE PODCAST] User not found");
      throw new ConvexError("[SAVE PODCAST] User not found");
    }

    const alreadySaved = user.savedPodcasts.includes(args.podcastId);

    if (alreadySaved) {
      console.warn("[SAVE PODCAST] Podcast already saved");
      throw new ConvexError("[SAVE PODCAST] Podcast already saved");
    }

    await ctx.db.patch(user._id, {
      savedPodcasts: [...user.savedPodcasts, args.podcastId],
    });
  },
});

export const unsavePodcast = mutation({
  args: { podcastId: v.id("podcasts") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      console.warn("[UNSAVE PODCAST] User not authenticated");
      throw new ConvexError("[UNSAVE PODCAST] User not authenticated");
    }

    const user = await userQuery(ctx, identity.subject);

    if (!user) {
      console.warn("[UNSAVE PODCAST] User not found");
      throw new ConvexError("[UNSAVE PODCAST] User not found");
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
    const user = await userQuery(ctx, args.authorId);

    if (!user) {
      console.warn("[UPDATE LISTENERS] User not found");
      throw new ConvexError("[UPDATE LISTENERS] User not found");
    }

    if (!user.listeners.includes(args.listenerId)) {
      await ctx.db.patch(user._id, {
        listeners: [...user.listeners, args.listenerId],
      });
    }
  },
});

// stripe webhook
export const updateSubscription = internalMutation({
  args: {
    priceId: v.string(),
    clerkId: v.string(),
    stripeCustomerId: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await userQuery(ctx, args.clerkId);

    if (!user) {
      console.warn("[UPDATE SUBSCRIPTION] User not found");
      throw new ConvexError("[UPDATE SUBSCRIPTION] User not found");
    }

    await ctx.db.patch(user._id, {
      priceId: args.priceId,
      isVerified: true,
      stripeCustomerId: args.stripeCustomerId,
    });
  },
});

// stripe webhook
export const updateSubscriptionByPriceId = internalMutation({
  args: { priceId: v.string(), clerkId: v.string() },
  handler: async (ctx, args) => {
    const user = await userQuery(ctx, args.clerkId);

    if (!user) {
      console.warn("[UPDATE SUBSCRIPTION BY PRICE ID] User not found");
      throw new ConvexError("[UPDATE SUBSCRIPTION BY PRICE ID] User not found");
    }

    await ctx.db.patch(user._id, {
      isVerified: true,
    });
  },
});

// stripe webhook
export const cancelSubscription = internalMutation({
  args: { priceId: v.string(), clerkId: v.string() },
  handler: async (ctx, args) => {
    const user = await userQuery(ctx, args.clerkId);

    if (!user) {
      console.warn("[CANCEL SUBSCRIPTION] User not found");
      throw new ConvexError("[CANCEL SUBSCRIPTION] User not found");
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
      console.warn(
        `[GET USER BY CUSTOMER ID] User not found with customer id: ${args.stripeCustomerId}`,
      );
      return null;
    }

    return user;
  },
});

export const getUserCustomer = internalQuery({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    const user = await userQuery(ctx, args.clerkId);

    if (!user) {
      console.warn("[GET USER CUSTOMER] User not found");
      return null;
    }

    if (!user.stripeCustomerId) {
      console.warn("[GET USER CUSTOMER] User has no stripe customer id");
      return null;
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

// helper
export async function userQuery(
  ctx: QueryCtx | MutationCtx,
  clerkId: string,
): Promise<Doc<"users"> | null> {
  return await ctx.db
    .query("users")
    .withIndex("by_clerkId", (q) => q.eq("clerkId", clerkId))
    .unique();
}
