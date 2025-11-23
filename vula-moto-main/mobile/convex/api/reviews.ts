import { v } from "convex/values";
import { mutation } from "../_generated/server";
import { queryGeneric } from "convex/server";

export const create = mutation({
  args: { review: v.string(), userId: v.id("users"), sellerId: v.id("users") },
  handler: async ({ db }, { review, userId, sellerId }) => {
    try {
      const me = await db
        .query("users")
        .filter((q) => q.eq(q.field("_id"), userId))
        .first();
      const seller = await db
        .query("users")
        .filter((q) => q.eq(q.field("_id"), sellerId))
        .first();
      if (!!!me || !!!seller)
        return {
          success: false,
        };
      await db.insert("reviews", {
        review,
        userId: me._id,
        sellerId: seller._id,
      });
      return { success: true };
    } catch (error) {
      return { success: false };
    }
  },
});

export const get = queryGeneric({
  args: { userId: v.optional(v.id("users")) },
  handler: async ({ db }, { userId }) => {
    try {
      const me = await db
        .query("users")
        .filter((q) => q.eq(q.field("_id"), userId))
        .first();
      if (!!!me) return [];
      const reviews = db
        .query("reviews")
        .filter((q) => q.eq(q.field("sellerId"), me._id))
        .order("desc")
        .collect();
      return reviews;
    } catch (error) {
      return [];
    }
  },
});
