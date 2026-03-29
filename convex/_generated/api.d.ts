/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as cleanUp from "../cleanUp.js";
import type * as helpers from "../helpers.js";
import type * as http from "../http.js";
import type * as participants from "../participants.js";
import type * as roomSettings from "../roomSettings.js";
import type * as rooms from "../rooms.js";
import type * as router from "../router.js";
import type * as users from "../users.js";
import type * as votes from "../votes.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  cleanUp: typeof cleanUp;
  helpers: typeof helpers;
  http: typeof http;
  participants: typeof participants;
  roomSettings: typeof roomSettings;
  rooms: typeof rooms;
  router: typeof router;
  users: typeof users;
  votes: typeof votes;
}>;
declare const fullApiWithMounts: typeof fullApi;

export declare const api: FilterApi<
  typeof fullApiWithMounts,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApiWithMounts,
  FunctionReference<any, "internal">
>;

export declare const components: {};
