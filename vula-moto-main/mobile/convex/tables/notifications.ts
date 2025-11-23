import { defineTable } from "convex/server";
import { v } from "convex/values";

export const notificationArguments = {
  userId: v.id("users"),
  chatId: v.id("chats"),
  title: v.string(),
  body: v.string(),
  opened: v.boolean(),
};

export const notifications = defineTable(notificationArguments)
  .index("userId", ["userId"])
  .index("chatId", ["chatId"]);

export type TNotification = typeof notifications.validator.type & {
  _creationTime: number;
};
