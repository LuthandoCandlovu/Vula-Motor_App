import { defineTable } from "convex/server";
import { v } from "convex/values";
import { Id } from "../_generated/dataModel";

export const chatArguments = {
  userId: v.id("users"),
  itemId: v.id("items"),
  advertiserId: v.id("users"),
  itemName: v.string(),
};

export const chats = defineTable(chatArguments)
  .index("userId", ["userId"])
  .index("itemId", ["itemId"])
  .index("advertiserId", ["advertiserId"]);

export type TChat = typeof chats.validator.type & {
  _id: Id<"chats">;
  _creationTime: number;
};
