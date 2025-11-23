import { queryGeneric } from "convex/server";
import { v } from "convex/values";
import { mutation } from "../_generated/server";
import { notificationArguments } from "../tables/notifications";

export const one = queryGeneric({
  args: {
    id: v.optional(v.id("users")),
  },
  handler: async ({ db }, { id }) => {
    try {
      const res = await db
        .query("notifications")
        .filter((q) => q.eq(q.field("userId"), id))
        .order("desc")
        .first();
      if (!!!res || res.opened) return null;
      return res;
    } catch (error) {
      return null;
    }
  },
});

export const add = mutation({
  args: notificationArguments,
  handler: async ({ db }, args) => {
    try {
      const _id = await db.insert("notifications", {
        ...args,
      });
      return _id;
    } catch (error) {
      return null;
    }
  },
});

export const open = mutation({
  args: {
    id: v.id("notifications"),
  },
  handler: async (ctx, { id }) => {
    try {
      const item = await ctx.db
        .query("notifications")
        .filter((q) => q.eq(q.field("_id"), id))
        .unique();
      if (!!!item) return false;
      await ctx.db.patch(item._id, {
        opened: true,
      });
      return item._id;
    } catch (error) {
      return true;
    }
  },
});
