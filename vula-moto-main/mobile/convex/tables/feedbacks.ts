import { defineTable } from "convex/server";
import { v } from "convex/values";

export const feedbackArguments = {
  feedback: v.string(),
};
export const feedbacks = defineTable(feedbackArguments);

export type TFeedback = typeof feedbacks.validator.type;
