import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  podcasts: defineTable({
    user: v.id("users"),
    podcastTitle: v.string(),
    podcastDescription: v.string(),
    audioUrl: v.string(),
    audioStorageId: v.id("_storage"),
    imageUrl: v.string(),
    imageStorageId: v.id("_storage"),
    author: v.string(),
    authorId: v.string(),
    authorImageUrl: v.string(),
    voicePrompt: v.string(),
    imagePrompt: v.string(),
    voiceType: v.optional(v.string()),
    audioDuration: v.number(),
    views: v.number(),
    usersSaved: v.optional(v.array(v.id("users"))),
  })
    .searchIndex("search_author", { searchField: "author" })
    .searchIndex("search_title", { searchField: "podcastTitle" })
    .searchIndex("search_body", { searchField: "podcastDescription" }),
  users: defineTable({
    email: v.string(),
    imageUrl: v.string(),
    clerkId: v.string(),
    name: v.string(),
    savedPodcasts: v.array(v.id("podcasts")),
    listeners: v.array(v.string()),
    priceId: v.optional(v.string()),
    stripeCustomerId: v.optional(v.string()),
    isVerified: v.boolean(),
  })
    .index("by_clerkId", ["clerkId"])
    .index("by_priceId", ["priceId"])
    .index("by_stripeCustomerId", ["stripeCustomerId"]),
});
