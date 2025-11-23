import { defineTable } from "convex/server";
import { v } from "convex/values";
import { Id } from "../_generated/dataModel";

export const messageArguments = {
  senderId: v.id("users"),
  chatId: v.id("chats"),
  text: v.optional(v.string()),
  image: v.optional(v.id("_storage")),
  audio: v.optional(v.id("_storage")),
  document: v.optional(v.id("_storage")),
  seen: v.boolean(),
  liked: v.optional(v.boolean()),
  deletedFor: v.optional(v.array(v.id("users"))),
};

export const messages = defineTable(messageArguments)
  .index("senderId", ["senderId"])
  .index("chatId", ["chatId"]);

export type TMessage = typeof messages.validator.type & {
  _id: Id<"messages">;
  _creationTime: number;
};
