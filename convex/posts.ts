import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const createPost = mutation({
  args: {
    userId: v.id("users"),
    content: v.string(),
    imageStorageId: v.optional(v.id("_storage")),
  },
  handler: async (ctx, args) => {
    let imageUrl = undefined;

    if (args.imageStorageId) {
      imageUrl = (await ctx.storage.getUrl(args.imageStorageId)) ?? undefined;
    }

    const postId = await ctx.db.insert("posts", {
      userId: args.userId,
      content: args.content,
      imageStorageId: args.imageStorageId,
      imageUrl,
      createdAt: Date.now(),
    });

    return postId;
  },
});

export const getAllPosts = query({
  handler: async (ctx) => {
    const posts = await ctx.db
      .query("posts")
      .withIndex("by_created_at")
      .order("desc")
      .collect();

    const postsWithUsers = await Promise.all(
      posts.map(async (post) => {
        const user = await ctx.db.get(post.userId);
        let avatarUrl = user?.avatar;

        // If user has avatarStorageId but no avatar URL, generate it
        if (user?.avatarStorageId && !avatarUrl) {
          avatarUrl = (await ctx.storage.getUrl(user.avatarStorageId)) ?? undefined;
        }

        return {
          ...post,
          user: user ? {
            name: user.name,
            avatar: avatarUrl,
          } : null,
        };
      })
    );

    return postsWithUsers;
  },
});

export const getUserPosts = query({
  args: { userId: v.optional(v.id("users")) },
  handler: async (ctx, args) => {
    if (!args.userId) {
      return [];
    }

    const userId = args.userId;

    const posts = await ctx.db
      .query("posts")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();

    return posts;
  },
});

export const generateUploadUrl = mutation({
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});
