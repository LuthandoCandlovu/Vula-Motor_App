import { queryGeneric } from "convex/server";
import { v } from "convex/values";
import { mutation } from "../_generated/server";
import { TItem } from "../tables/items";
import { TUser, userArguments } from "../tables/users";

// const asyncFunction = async <
//   T extends Id<"items" | "notifications">,
//   D extends { delete: (id: T) => void },
// >(
//   id: T,
//   db: D
// ): Promise<void> => {
//   return new Promise((resolve) => {
//     db.delete(id);
//     resolve();
//   });
// };
export const deleteUser = mutation({
  args: { id: v.string(), reason: v.string() },
  handler: async ({ db }, { id, reason }) => {
    try {
      const user = await db
        .query("users")
        .filter((q) => q.eq(q.field("id"), id))
        .first();

      if (!!!user) return true;
      // delete related models
      // 1. items, wishlist, notifications

      await db.insert("reasons", { reason });
      // await db.delete(user._id);
      return true;
    } catch (error) {
      return false;
    }
  },
});

export const findUserOrCreateOne = mutation({
  args: userArguments,
  handler: async ({ db }, args) => {
    try {
      const me = await db
        .query("users")
        .filter((q) => q.eq(q.field("id"), args.id))
        .first();
      if (!!me)
        return {
          _id: me._id,
        };
      const _id = await db.insert("users", args);
      return { _id };
    } catch (error) {
      return { _id: null };
    }
  },
});

export const getById = queryGeneric({
  args: { id: v.optional(v.id("users")) },
  handler: async ({ db }, { id }) => {
    return await db
      .query("users")
      .filter((q) => q.eq(q.field("_id"), id))
      .first();
  },
});

export const getLocalSeller = queryGeneric({
  args: { id: v.optional(v.id("users")) },
  handler: async ({ db }, { id }) => {
    try {
      const users: TUser[] = await db
        .query("users")
        .filter((q) => q.neq(q.field("_id"), id))
        .collect();
      // return only required fields

      return users
        .filter((user) => !!user.location)
        .map((user) => ({
          _id: user._id,
          location: user.location,
          fullName: `${user.firstName} ${user.lastName}`,
        }));
    } catch (error) {
      return [];
    }
  },
});

export const get = queryGeneric({
  args: { id: v.string() },
  handler: async ({ db }, { id }) => {
    return await db
      .query("users")
      .filter((q) => q.eq(q.field("id"), id))
      .first();
  },
});

export const getUserAnalytics = queryGeneric({
  args: { id: v.id("users"), includeWishlist: v.boolean() },
  handler: async ({ db }, { id, includeWishlist }) => {
    const COLORS = {
      primary: "#E3F0AF",
      secondary: "#FE4F2D",
      tertiary: "#118B50",
    };
    try {
      const me = await db
        .query("users")
        .filter((q) => q.eq(q.field("_id"), id))
        .first();
      if (!!!me) return [];

      let data: { label: string; value: number; color: string }[] = [];
      if (includeWishlist) {
        data.push({
          color: COLORS.primary,
          label: "wishlist",
          value: !!me?.bookmarks?.length ? me.bookmarks.length : 0,
        });
      }

      const result: TItem[] = await db
        .query("items")
        .filter((q) => q.eq(q.field("userId"), id))
        .collect();

      data.push({
        label: "services",
        color: COLORS.tertiary,
        value: result
          .filter((result) => result.type === "services")
          .reduce((a, b) => a + (!!b.stock ? b.stock : 0) || 0, 0),
      });
      data.push({
        color: COLORS.secondary,
        label: "spares",
        value: result
          .filter((result) => result.type === "spares")
          .reduce((a, b) => a + (!!b.stock ? b.stock : 0) || 0, 0),
      });

      return data;
    } catch (error) {
      return [];
    }
  },
});

export const rateMe = mutation({
  args: {
    id: v.id("users"),
    value: v.number(),
  },
  handler: async ({ db }, args) => {
    try {
      const me = await db
        .query("users")
        .filter((q) => q.eq(q.field("_id"), args.id))
        .first();
      if (!!!me)
        return {
          success: false,
        };
      await db.patch(me._id, {
        ratting: [...(me.ratting || []), args.value],
      });

      return { success: true };
    } catch (error) {
      return { success: true };
    }
  },
});

export const addOrRemoveToMyWishList = mutation({
  args: {
    userId: v.string(),
    itemId: v.id("items"),
  },
  handler: async ({ db }, args) => {
    try {
      const me = await db
        .query("users")
        .filter((q) => q.eq(q.field("id"), args.userId))
        .first();
      if (!!!me)
        return {
          success: false,
        };

      const bookmarks = me.bookmarks || [];
      const found = bookmarks.find((b) => b === args.itemId);
      const wishlist = !!found
        ? bookmarks.filter((b) => b !== args.itemId)
        : [args.itemId, ...bookmarks]; // add it at the at the start
      await db.patch(me._id, {
        bookmarks: wishlist,
      });
      return { success: true };
    } catch (error) {
      return { success: true };
    }
  },
});

export const clearMyWishList = mutation({
  args: { id: v.string() },
  handler: async ({ db }, { id }) => {
    try {
      const me = await db
        .query("users")
        .filter((q) => q.eq(q.field("id"), id))
        .first();
      if (!!!me)
        return {
          success: false,
        };
      await db.patch(me._id, {
        bookmarks: [],
      });
      return {
        success: true,
      };
    } catch (error) {
      return {
        success: false,
      };
    }
  },
});

export const getMyWishList = queryGeneric({
  args: { id: v.string() },
  handler: async ({ db }, { id }) => {
    const me = await db
      .query("users")
      .filter((q) => q.eq(q.field("id"), id))
      .first();
    if (!!!me) return [];
    return me.bookmarks || [];
  },
});

export const getMyWishListByCategory = queryGeneric({
  args: {
    id: v.optional(v.id("users")),
    category: v.union(
      v.literal("spares"),
      v.literal("services"),
      v.literal("wishlist")
    ),
  },
  handler: async ({ db }, { id, category }) => {
    try {
      const me = await db
        .query("users")
        .filter((q) => q.eq(q.field("_id"), id))
        .first();

      if (!!!me) return [];

      const items = await db
        .query("items")
        .filter((q) =>
          q.and(
            ...[
              q.eq(q.field("type"), category),
              q.or(...me.bookmarks!.map((id: any) => q.eq(q.field("_id"), id))),
            ]
          )
        )
        .collect();

      return items.map((item) => item._id);
    } catch (error) {
      return [];
    }
  },
});

export const updateBio = mutation({
  args: { id: v.optional(v.id("users")), biography: v.optional(v.string()) },
  handler: async ({ db }, { id, biography }) => {
    try {
      const me = await db
        .query("users")
        .filter((q) => q.eq(q.field("_id"), id))
        .first();
      if (!!!me) return null;
      await db.patch(me._id, {
        biography: biography
          ? biography.trim()
          : "Hey there I am a Vula Moto user.",
      });
      return me._id;
    } catch (error) {
      return null;
    }
  },
});

export const updateProfile = mutation({
  args: {
    id: v.optional(v.id("users")),
    biography: v.optional(v.string()),
    phoneNumber: v.optional(v.string()),
    verified: v.optional(v.boolean()),
    accountType: v.optional(v.union(v.literal("buyer"), v.literal("seller"))),
  },
  handler: async (
    { db },
    { id, biography, phoneNumber, verified, accountType }
  ) => {
    try {
      const me = await db
        .query("users")
        .filter((q) => q.eq(q.field("_id"), id))
        .first();
      if (!!!me) return null;
      await db.patch(me._id, {
        biography: biography
          ? biography.trim()
          : "Hey there I am a Vula Moto user.",
        phoneNumber,
        verified,
        accountType,
        new: false,
      });
      return me._id;
    } catch (error) {
      return null;
    }
  },
});

export const updateLocation = mutation({
  args: {
    id: v.optional(v.id("users")),
    location: v.object({
      lat: v.number(),
      lon: v.number(),
    }),
  },
  handler: async ({ db }, { id, location }) => {
    try {
      const me = await db
        .query("users")
        .filter((q) => q.eq(q.field("_id"), id))
        .first();
      if (!!!me) return null;
      await db.patch(me._id, {
        location,
      });
      return me._id;
    } catch (error) {
      return null;
    }
  },
});

const userUpdatableValues = {
  firstName: v.string(),
  lastName: v.string(),
  email: v.string(),
};
export const update = mutation({
  args: {
    id: v.optional(v.id("users")),
    values: v.object(userUpdatableValues),
  },
  handler: async ({ db }, { id, values }) => {
    try {
      const me = await db
        .query("users")
        .filter((q) => q.eq(q.field("_id"), id))
        .first();

      if (!!!me) return false;
      await db.patch(me._id, { ...values });
      return true;
    } catch (error) {
      return false;
    }
  },
});

export const getUserItems = queryGeneric({
  args: {
    id: v.optional(v.id("users")),
    category: v.union(
      v.literal("services"),
      v.literal("spares"),
      v.literal("wishlist")
    ),
  },
  handler: async ({ db }, { id, category }) => {
    try {
      const me = await db
        .query("users")
        .filter((q) => q.eq(q.field("_id"), id))
        .first();

      if (!!!me) return [];
      if (category === "wishlist") {
        return me.bookmarks || [];
      }
      const items = await db
        .query("items")
        .filter((q) =>
          q.and(
            ...[
              q.eq(q.field("type"), category),
              q.eq(q.field("userId"), me._id),
            ]
          )
        )
        .collect();
      return items.map((item) => item._id);
    } catch (error) {
      return [];
    }
  },
});
