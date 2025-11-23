import { defineSchema } from "convex/server";
import { chats } from "./tables/chats";
import { feedbacks } from "./tables/feedbacks";
import { items } from "./tables/items";
import { messages } from "./tables/messages";
import { notifications } from "./tables/notifications";
import { reasons } from "./tables/reasons";
import { users } from "./tables/users";
import { reviews } from "./tables/reviews";

export default defineSchema(
  { users, items, chats, messages, feedbacks, reasons, notifications, reviews },
  { schemaValidation: true, strictTableNameTypes: true }
);
