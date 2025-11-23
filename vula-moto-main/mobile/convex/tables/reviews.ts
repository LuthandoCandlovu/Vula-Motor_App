import { defineTable } from "convex/server";
import { v } from "convex/values";
import { Id } from "../_generated/dataModel";

export const reviewsArguments = {
  review: v.string(),
  userId: v.id("users"),
  sellerId: v.id("users"),
};
export const reviews = defineTable(reviewsArguments);

export type TReviews = typeof reviews.validator.type & {
  _creationTime: number;
  _id: Id<"items">;
  userId: Id<"users">;
  sellerId: Id<"users">;
};
