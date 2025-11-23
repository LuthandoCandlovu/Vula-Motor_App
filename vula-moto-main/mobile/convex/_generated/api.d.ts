/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as api_chats from "../api/chats.js";
import type * as api_feedbacks from "../api/feedbacks.js";
import type * as api_items from "../api/items.js";
import type * as api_messages from "../api/messages.js";
import type * as api_notifications from "../api/notifications.js";
import type * as api_reviews from "../api/reviews.js";
import type * as api_users from "../api/users.js";
import type * as http from "../http.js";
import type * as tables_chats from "../tables/chats.js";
import type * as tables_feedbacks from "../tables/feedbacks.js";
import type * as tables_items from "../tables/items.js";
import type * as tables_messages from "../tables/messages.js";
import type * as tables_notifications from "../tables/notifications.js";
import type * as tables_reasons from "../tables/reasons.js";
import type * as tables_reviews from "../tables/reviews.js";
import type * as tables_users from "../tables/users.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  "api/chats": typeof api_chats;
  "api/feedbacks": typeof api_feedbacks;
  "api/items": typeof api_items;
  "api/messages": typeof api_messages;
  "api/notifications": typeof api_notifications;
  "api/reviews": typeof api_reviews;
  "api/users": typeof api_users;
  http: typeof http;
  "tables/chats": typeof tables_chats;
  "tables/feedbacks": typeof tables_feedbacks;
  "tables/items": typeof tables_items;
  "tables/messages": typeof tables_messages;
  "tables/notifications": typeof tables_notifications;
  "tables/reasons": typeof tables_reasons;
  "tables/reviews": typeof tables_reviews;
  "tables/users": typeof tables_users;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
