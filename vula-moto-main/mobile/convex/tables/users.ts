import { defineTable } from "convex/server";
import { v } from "convex/values";
import { Id } from "../_generated/dataModel";

export const userArguments = {
  firstName: v.string(),
  lastName: v.string(),
  id: v.string(),
  email: v.string(),
  image: v.string(),
  idCopy: v.optional(v.id("_storage")),
  license: v.optional(v.id("_storage")),
  location: v.optional(
    v.object({
      lat: v.number(),
      lon: v.number(),
    })
  ),
  verified: v.optional(v.boolean()),
  new: v.optional(v.boolean()),

  phoneNumber: v.optional(v.string()),
  biography: v.optional(v.string()),
  services: v.optional(v.array(v.string())),
  spares: v.optional(v.array(v.string())),

  ratting: v.optional(v.array(v.number())),
  bookmarks: v.optional(v.array(v.id("items"))),
  followers: v.optional(v.array(v.id("users"))),
  following: v.optional(v.array(v.id("users"))),
  blocked: v.optional(v.array(v.id("users"))),
  accountType: v.optional(v.union(v.literal("buyer"), v.literal("seller"))),
};
export const users = defineTable(userArguments);

export type TUser = typeof users.validator.type & {
  _creationTime: number;
  _id: Id<"users">;
};
