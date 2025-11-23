import { defineTable } from "convex/server";
import { v } from "convex/values";
import { Id } from "../_generated/dataModel";

export const itemArguments = {
  type: v.union(v.literal("services"), v.literal("spares")),
  title: v.string(),
  description: v.string(),
  stock: v.optional(v.number()),
  price: v.number(),
  previousPrice: v.number(),
  category: v.string(),
  image: v.id("_storage"),
  delivery: v.optional(
    v.union(v.literal("delivery"), v.literal("pickup"), v.literal("collect"))
  ),
  location: v.object({
    lat: v.number(),
    lon: v.number(),
    address: v.object({
      city: v.union(v.string(), v.null()),
      country: v.union(v.null(), v.string()),
      district: v.union(v.null(), v.string()),
      isoCountryCode: v.union(v.null(), v.string()),
      name: v.union(v.null(), v.string()),
      postalCode: v.union(v.null(), v.string()),
      region: v.union(v.null(), v.string()),
      street: v.union(v.null(), v.string()),
      streetNumber: v.union(v.null(), v.string()),
    }),
  }),
  userId: v.id("users"),
};
export const items = defineTable(itemArguments).index("userId", ["userId"]);
export type TItem = typeof items.validator.type & {
  _creationTime: number;
  _id: Id<"items">;
  userId: Id<"users">;
};
