import { paginationOptsValidator, queryGeneric } from "convex/server";
import { v } from "convex/values";
import { Id } from "../_generated/dataModel";
import { mutation } from "../_generated/server";
import { messageArguments } from "../tables/messages";

const asyncFunction = async <
  T extends Id<"messages">,
  D extends {
    patch: (id: T, payload: { seen: boolean }) => void;
  },
>(
  id: T,
  db: D
): Promise<void> => {
  return new Promise((resolve) => {
    db.patch(id, { seen: true });
    resolve();
  });
};

export const getChatCollaborators = queryGeneric({
  args: {
    chatId: v.optional(v.id("chats")),
  },
  handler: async ({ db }, { chatId }) => {
    try {
      const result = await db
        .query("chats")
        .filter((q) => q.eq(q.field("_id"), chatId))
        .order("desc")
        .first();
      if (!!!result) return [];
      return [result.advertiserId, result.advertiserId];
    } catch (error) {
      return [];
    }
  },
});

export const send = mutation({
  args: messageArguments,
  handler: async ({ db }, args) => {
    try {
      const _id = await db.insert("messages", {
        ...args,
      });
      return _id;
    } catch (error) {
      return null;
    }
  },
});

export const react = mutation({
  args: { _id: v.id("messages") },
  handler: async ({ db }, { _id }) => {
    try {
      const msg = await db
        .query("messages")
        .filter((q) => q.eq(q.field("_id"), _id))
        .first();
      if (!!!msg) return null;
      await db.patch(msg._id, { liked: !msg.liked });
      return _id;
    } catch (error) {
      return null;
    }
  },
});

export const deletedForMe = mutation({
  args: { _id: v.id("messages"), id: v.string() },
  handler: async ({ db }, { _id, id }) => {
    try {
      const user = await db
        .query("users")
        .filter((q) => q.eq(q.field("id"), id))
        .first();
      if (!!!user) return null;
      const msg = await db
        .query("messages")
        .filter((q) =>
          q.and(q.eq(q.field("_id"), _id), q.eq(q.field("senderId"), user._id))
        )
        .first();
      if (!!!msg) return null;

      await db.patch(msg._id, {
        deletedFor: [user._id],
      });
      return _id;
    } catch (error) {
      return null;
    }
  },
});

export const deletedForEveryone = mutation({
  args: { _id: v.id("messages"), id: v.string() },
  handler: async ({ db, storage }, { _id, id }) => {
    try {
      const user = await db
        .query("users")
        .filter((q) => q.eq(q.field("id"), id))
        .first();
      if (!!!user) return null;
      const msg = await db
        .query("messages")
        .filter((q) =>
          q.and(q.eq(q.field("_id"), _id), q.eq(q.field("senderId"), user._id))
        )
        .first();
      if (!!!msg) return null;

      if (msg.audio) await storage.delete(msg.audio);
      if (msg.document) await storage.delete(msg.document);
      if (msg.image) await storage.delete(msg.image);

      const chat = await db
        .query("chats")
        .filter((q) => q.eq(q.field("_id"), msg.chatId))
        .first();
      if (!!!chat) return null;
      await db.patch(msg._id, {
        deletedFor: [chat.advertiserId, chat.userId],
      });
      return _id;
    } catch (error) {
      return null;
    }
  },
});

export const chatMessages = queryGeneric({
  args: {
    paginationOpts: paginationOptsValidator,
    chatId: v.optional(v.id("chats")),
  },
  handler: async ({ db, storage }, { paginationOpts, chatId }) => {
    const result = await db
      .query("messages")
      .filter((q) => q.eq(q.field("chatId"), chatId))
      .order("desc")
      .paginate(paginationOpts);

    const pageWithResolvedData = await Promise.all(
      result.page.map(async (msg) => {
        const sender = await db
          .query("users")
          .filter((q) => q.eq(q.field("_id"), msg.senderId))
          .first();

        return {
          ...msg,
          image: msg.image && (await storage.getUrl(msg.image)),
          document: msg.document && (await storage.getUrl(msg.document)),
          audio: msg.audio && (await storage.getUrl(msg.audio)),
          sender,
        };
      })
    );

    return {
      ...result,
      page: pageWithResolvedData,
    };
  },
});

export const readMessages = mutation({
  args: {
    chatId: v.optional(v.id("chats")),
    id: v.string(),
  },
  handler: async ({ db }, { chatId, id }) => {
    try {
      const user = await db
        .query("users")
        .filter((q) => q.eq(q.field("id"), id))
        .first();
      if (!!!user) return { success: false };

      const unread = await db
        .query("messages")
        .filter((q) =>
          q.and(
            ...[
              q.eq(q.field("chatId"), chatId),
              q.neq(q.field("senderId"), user._id),
              q.eq(q.field("seen"), false),
            ]
          )
        )
        .collect();
      const promises = unread.map(async ({ _id }) => {
        return await asyncFunction(_id, db);
      });
      await Promise.all(promises);
      return { success: true };
    } catch (error) {
      return { success: false };
    }
  },
});

export const get = queryGeneric({
  args: { _id: v.id("messages") },
  handler: async ({ db, storage }, { _id }) => {
    try {
      const msg = await db
        .query("messages")
        .filter((q) => q.eq(q.field("_id"), _id))
        .first();

      if (!!!msg) return null;

      const sender = await db
        .query("users")
        .filter((q) => q.eq(q.field("_id"), msg.senderId))
        .first();
      return {
        ...msg,
        image: msg.image && (await storage.getUrl(msg.image)),
        document: msg.document && (await storage.getUrl(msg.document)),
        audio: msg.audio && (await storage.getUrl(msg.audio)),
        sender,
      };
    } catch (error) {
      return null;
    }
  },
});

export const count = queryGeneric({
  args: { id: v.optional(v.id("users")) },
  handler: async ({ db }, { id }) => {
    try {
      const user = await db
        .query("users")
        .filter((q) => q.eq(q.field("_id"), id))
        .first();

      if (!user) return undefined;

      const chats = await db
        .query("chats")
        .filter((q) =>
          q.or(
            q.eq(q.field("userId"), user._id),
            q.eq(q.field("advertiserId"), user._id)
          )
        )
        .collect();

      if (!chats.length) return undefined;

      const unreadMessagesPromises = chats.map((chat) =>
        db
          .query("messages")
          .filter((q) =>
            q.and(
              q.eq(q.field("chatId"), chat._id),
              q.neq(q.field("senderId"), user._id),
              q.eq(q.field("seen"), false)
            )
          )
          .collect()
      );

      const unreadMessagesArrays = await Promise.all(unreadMessagesPromises);
      const unreadMessages = unreadMessagesArrays.flat();
      return unreadMessages.length;
    } catch (error) {
      return undefined;
    }
  },
});
