import { PaginationResult, queryGeneric } from "convex/server";
import { v } from "convex/values";
import { Id } from "../_generated/dataModel";
import { mutation } from "../_generated/server";
import { itemArguments } from "../tables/items";

export const publish = mutation({
  args: itemArguments,
  handler: async ({ db }, args) => {
    try {
      const _id = await db.insert("items", {
        ...args,
      });
      return _id;
    } catch (error) {
      return null;
    }
  },
});

export const update = mutation({
  args: {
    id: v.id("items"),
    values: v.object({ ...itemArguments, image: v.optional(v.id("_storage")) }),
  },
  handler: async (ctx, { id, values }) => {
    try {
      const item = await ctx.db
        .query("items")
        .filter((q) => q.eq(q.field("_id"), id))
        .unique();
      if (!!!item) return null;
      await ctx.db.patch(item._id, {
        ...values,
        image: typeof values.image === "undefined" ? item.image : values.image,
      });
      return item._id;
    } catch (error) {
      return null;
    }
  },
});

export const get = queryGeneric({
  args: {},
  handler: async (ctx, {}) => {
    const result = await ctx.db.query("items");
    return result;
  },
});

export const getItemById = queryGeneric({
  args: { id: v.id("items") },
  handler: async (ctx, { id }) => {
    const item = await ctx.db
      .query("items")
      .filter((q) => q.eq(q.field("_id"), id))
      .unique();
    if (!!item) {
      const url = await ctx.storage.getUrl(item.image);
      return {
        ...item,
        image: url,
      };
    }
    return item;
  },
});

export const remove = mutation({
  args: { id: v.id("items") },
  handler: async (ctx, { id }) => {
    try {
      const item = await ctx.db
        .query("items")
        .filter((q) => q.eq(q.field("_id"), id))
        .unique();
      if (!!!item) return false;
      await ctx.storage.delete(item.image);
      await ctx.db.delete(item._id);
      return true;
    } catch (error) {
      return false;
    }
  },
});

export const getByCategory = queryGeneric({
  args: {
    category: v.string(),
    limit: v.number(),
    order: v.union(v.literal("desc"), v.literal("asc")),
    cursor: v.optional(v.union(v.null(), v.string())),
  },
  handler: async (ctx, { category, limit, order, cursor = null }) => {
    try {
      if (category === "all") {
        const result = await ctx.db
          .query("items")
          .order(order)
          .paginate({ cursor, numItems: limit });
        return {
          ...result,
          page: result.page.map((res) => res._id),
        };
      }
      const result = await ctx.db
        .query("items")
        .filter((q) => q.eq(q.field("category"), category))
        .order(order)
        .paginate({ cursor: null, numItems: limit });

      return {
        ...result,
        page: result.page.map((res) => res._id),
      } satisfies PaginationResult<Id<"items">>;
    } catch (error) {
      return {
        page: [],
        isDone: false,
        splitCursor: undefined,
        pageStatus: undefined,
        continueCursor: "",
      } satisfies PaginationResult<Id<"items">>;
    }
  },
});

export const getByCategoryWithoutPagination = queryGeneric({
  args: {
    category: v.string(),
    order: v.union(v.literal("desc"), v.literal("asc")),
  },
  handler: async (ctx, { category, order }) => {
    try {
      if (category === "all") {
        const result = await ctx.db.query("items").order(order).collect();
        return result.map((res) => res._id);
      }
      const result = await ctx.db
        .query("items")
        .filter((q) => q.eq(q.field("type"), category))
        .order(order)
        .collect();

      return result.map((res) => res._id);
    } catch (error) {
      return [];
    }
  },
});
