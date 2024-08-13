import { ConvexError, v } from "convex/values";

import { action, mutation, query } from "./_generated/server";
import { api, internal } from "./_generated/api";
import { getUserById } from "./users";

export const createPodcast = mutation({
  args: {
    audioStorageId: v.id("_storage"),
    podcastTitle: v.string(),
    podcastDescription: v.string(),
    audioUrl: v.string(),
    imageUrl: v.string(),
    imageStorageId: v.id("_storage"),
    voicePrompt: v.string(),
    imagePrompt: v.string(),
    voiceType: v.optional(v.string()),
    views: v.number(),
    audioDuration: v.number(),
    favorites: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new ConvexError("User not authenticated");
    }

    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), identity.email))
      .collect();

    if (user.length === 0) {
      throw new ConvexError("User not found");
    }

    return await ctx.db.insert("podcasts", {
      audioStorageId: args.audioStorageId,
      user: user[0]._id,
      podcastTitle: args.podcastTitle,
      podcastDescription: args.podcastDescription,
      audioUrl: args.audioUrl,
      imageUrl: args.imageUrl,
      imageStorageId: args.imageStorageId,
      author: user[0].name,
      authorId: user[0].clerkId,
      voicePrompt: args.voicePrompt,
      imagePrompt: args.imagePrompt,
      voiceType: args.voiceType,
      views: args.views,
      authorImageUrl: user[0].imageUrl,
      audioDuration: args.audioDuration,
    });
  },
});

// update podcast details
export const updatePodcast = mutation({
  args: {
    podcastId: v.id("podcasts"),
    podcastTitle: v.string(),
    podcastDescription: v.string(),
    clerkId: v.string(),
    authorId: v.string(),
  },
  handler: async (ctx, args) => {
    if (args.clerkId !== args.authorId) throw new ConvexError("Unauthorized");

    const identity = ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError("User not authenticated");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
      .first();

    if (!user) throw new ConvexError("User not found");

    return await ctx.db.patch(args.podcastId, {
      podcastTitle: args.podcastTitle,
      podcastDescription: args.podcastDescription,
    });
  },
});

// return file storage url
export const getUrl = mutation({
  args: {
    storageId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    const identity = ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError("User not authenticated");
    }

    return await ctx.storage.getUrl(args.storageId);
  },
});

export const getPodcastByVoiceType = query({
  args: {
    podcastId: v.id("podcasts"),
  },
  handler: async (ctx, args) => {
    const podcast = await ctx.db.get(args.podcastId);

    return await ctx.db
      .query("podcasts")
      .filter((q) =>
        q.and(
          q.eq(q.field("voiceType"), podcast?.voiceType),
          q.neq(q.field("_id"), args.podcastId),
        ),
      )
      .collect();
  },
});

export const getMoreFromAuthor = query({
  args: { podcastId: v.id("podcasts") },
  handler: async (ctx, args) => {
    const podcast = await ctx.db.get(args.podcastId);
    if (!podcast) return undefined;

    const podcasts = await ctx.db
      .query("podcasts")
      .filter((q) =>
        q.and(
          q.eq(q.field("authorId"), podcast.authorId),
          q.neq(q.field("_id"), args.podcastId),
        ),
      )
      .collect();

    return podcasts;
  },
});

export const getAllPodcasts = query({
  handler: async (ctx) => {
    return await ctx.db.query("podcasts").order("desc").collect();
  },
});

export const getPodcastById = query({
  args: {
    podcastId: v.id("podcasts"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.podcastId);
  },
});

// podcasts by views
export const getTrendingPodcasts = query({
  handler: async (ctx) => {
    const podcast = await ctx.db.query("podcasts").collect();

    return podcast.sort((a, b) => b.views - a.views).slice(0, 12);
  },
});

// podcasts in array of saved podcast ids
export const getSavedPodcasts = query({
  args: {
    clerkId: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
      .first();

    if (!user) throw new ConvexError("User not found");

    return Promise.all(
      user.savedPodcasts.map(async (pId) => await ctx.db.get(pId)),
    );
  },
});

export const getPodcastByAuthorId = query({
  args: {
    authorId: v.string(),
  },
  handler: async (ctx, args) => {
    const podcasts = await ctx.db
      .query("podcasts")
      .filter((q) => q.eq(q.field("authorId"), args.authorId))
      .collect();

    const totalViews = podcasts.reduce(
      (sum, podcast) => sum + podcast.views,
      0,
    );

    return { podcasts, totalViews };
  },
});

export const getPodcastBySearch = query({
  args: {
    search: v.string(),
  },
  handler: async (ctx, args) => {
    if (args.search === "") {
      return await ctx.db.query("podcasts").order("desc").collect();
    }

    const authorSearch = await ctx.db
      .query("podcasts")
      .withSearchIndex("search_author", (q) => q.search("author", args.search))
      .take(12);

    if (authorSearch.length > 0) {
      return authorSearch;
    }

    const titleSearch = await ctx.db
      .query("podcasts")
      .withSearchIndex("search_title", (q) =>
        q.search("podcastTitle", args.search),
      )
      .take(12);

    if (titleSearch.length > 0) {
      return titleSearch;
    }

    return await ctx.db
      .query("podcasts")
      .withSearchIndex("search_body", (q) =>
        q.search("podcastDescription" || "podcastTitle", args.search),
      )
      .take(12);
  },
});

export const updatePodcastViews = mutation({
  args: {
    podcastId: v.id("podcasts"),
  },
  handler: async (ctx, args) => {
    const podcast = await ctx.db.get(args.podcastId);

    if (!podcast) {
      throw new ConvexError("Podcast not found");
    }

    return await ctx.db.patch(args.podcastId, {
      views: podcast.views + 1,
    });
  },
});

export const deletePodcast = mutation({
  args: {
    podcastId: v.id("podcasts"),
    imageStorageId: v.id("_storage"),
    audioStorageId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    const podcast = await ctx.db.get(args.podcastId);

    if (!podcast) {
      throw new ConvexError("Podcast not found");
    }

    // remove podcast from saves
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

    await ctx.storage.delete(args.imageStorageId);
    await ctx.storage.delete(args.audioStorageId);
    return await ctx.db.delete(args.podcastId);
  },
});

export const deletePodcastThumbnail = mutation({
  args: {
    imageStorageId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    await ctx.storage.delete(args.imageStorageId);
  },
});

export const deletePodcastAudio = mutation({
  args: {
    audioStorageId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    await ctx.storage.delete(args.audioStorageId);
  },
});

export const getPodcastHistory = query({
  args: { userId: v.optional(v.string()), limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    if (!args.userId) return undefined;
    const identity = ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError("User not authenticated");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", args.userId!))
      .first();

    if (!user) {
      throw new ConvexError("User not found");
    }

    const userhistory = await ctx.db
      .query("history")
      .withIndex("by_user", (q) => q.eq("user", user._id))
      .filter((q) => q.eq(q.field("user"), user._id))
      .collect();

    const limit = args.limit ?? 12;
    return Promise.all(
      userhistory
        .sort((a, b) => b.listenedAt - a.listenedAt)
        .slice(0, limit)
        .map(async (p) => await ctx.db.get(p.podcastId)),
    );
  },
});
