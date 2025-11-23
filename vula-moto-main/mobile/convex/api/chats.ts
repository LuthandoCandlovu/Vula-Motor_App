import { queryGeneric } from "convex/server";
import { v } from "convex/values";
import { mutation } from "../_generated/server";

export const chat = queryGeneric({
  args: {
    id: v.id("chats"),
  },
  handler: async ({ db, ...ctx }, { id }) => {
    try {
      const res = await db
        .query("chats")
        .filter((q) => q.eq(q.field("_id"), id))
        .first();

      if (!!!res) return null;

      const seller = await db
        .query("users")
        .filter((q) => q.eq(q.field("_id"), res.advertiserId))
        .first();
      const buyer = await db
        .query("users")
        .filter((q) => q.eq(q.field("_id"), res.userId))
        .first();
      const item = await db
        .query("items")
        .filter((q) => q.eq(q.field("_id"), res.itemId))
        .first();
      const url = !!item?.image
        ? await ctx.storage.getUrl(item?.image)
        : item?.image;
      return {
        ...res,
        buyer,
        seller,
        item: {
          ...item,
          image: url,
        },
      };
    } catch (error) {
      return null;
    }
  },
});
export const chats = queryGeneric({
  args: {
    userId: v.optional(v.id("users")),
  },
  handler: async ({ db }, { userId }) => {
    try {
      const me = await db
        .query("users")
        .filter((q) => q.eq(q.field("_id"), userId))
        .first();

      if (!!!me) return [];
      const chats = await db
        .query("chats")
        .filter((q) =>
          q.or(
            q.eq(q.field("advertiserId"), me._id),
            q.eq(q.field("userId"), me._id)
          )
        )
        .collect();
      return chats.map((c) => c._id);
    } catch (error) {
      return [];
    }
  },
});
export const createOrOpen = mutation({
  args: {
    myId: v.string(),
    itemId: v.id("items"),
  },
  handler: async ({ db }, { itemId, myId }) => {
    try {
      const me = await db
        .query("users")
        .filter((q) => q.eq(q.field("id"), myId))
        .first();

      const item = await db
        .query("items")
        .filter((q) => q.eq(q.field("_id"), itemId))
        .first();

      if (!!!me || !!!item) return null;
      const chat = await db
        .query("chats")
        .filter((q) =>
          q.and(
            ...[
              q.eq(q.field("itemId"), item._id),
              q.eq(q.field("advertiserId"), item.userId),
              q.eq(q.field("userId"), me._id),
            ]
          )
        )
        .first();
      if (!!chat) return chat._id;
      const _id = await db.insert("chats", {
        advertiserId: item.userId,
        itemName: item.title,
        userId: me._id,
        itemId: item._id,
      });
      return _id;
    } catch (error) {
      return null;
    }
  },
});

export const count = queryGeneric({
  args: { id: v.optional(v.id("chats")), userId: v.optional(v.id("users")) },
  handler: async ({ db }, { id, userId }) => {
    try {
      const chat = await db
        .query("chats")
        .filter((q) => q.eq(q.field("_id"), id))
        .first();

      if (!chat) return undefined;

      const messages = await db
        .query("messages")
        .filter((q) =>
          q.and(
            q.eq(q.field("chatId"), chat._id),
            q.eq(q.field("seen"), false),
            q.neq(q.field("senderId"), userId)
          )
        )
        .collect();

      return messages.length;
    } catch (error) {
      return undefined;
    }
  },
});
