import { v } from "convex/values";
import { mutation } from "../_generated/server";

export const create = mutation({
  args: { feedback: v.string() },
  handler: async ({ db }, { feedback }) => {
    try {
      await db.insert("feedbacks", { feedback });
      return { success: true };
    } catch (error) {
      return { success: false };
    }
  },
});
