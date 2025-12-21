/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as cleanUp from '../cleanUp.js';
import type * as helpers from '../helpers.js';
import type * as http from '../http.js';
import type * as participants from '../participants.js';
import type * as presence from '../presence.js';
import type * as roomSettings from '../roomSettings.js';
import type * as rooms from '../rooms.js';
import type * as router from '../router.js';
import type * as users from '../users.js';
import type * as votes from '../votes.js';

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from 'convex/server';

declare const fullApi: ApiFromModules<{
  cleanUp: typeof cleanUp;
  helpers: typeof helpers;
  http: typeof http;
  participants: typeof participants;
  presence: typeof presence;
  roomSettings: typeof roomSettings;
  rooms: typeof rooms;
  router: typeof router;
  users: typeof users;
  votes: typeof votes;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, 'public'>
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, 'internal'>
>;

export declare const components: {
  presence: {
    public: {
      disconnect: FunctionReference<
        'mutation',
        'internal',
        { sessionToken: string },
        null
      >;
      heartbeat: FunctionReference<
        'mutation',
        'internal',
        {
          interval?: number;
          roomId: string;
          sessionId: string;
          userId: string;
        },
        { roomToken: string; sessionToken: string }
      >;
      list: FunctionReference<
        'query',
        'internal',
        { limit?: number; roomToken: string },
        Array<{ lastDisconnected: number; online: boolean; userId: string }>
      >;
      listRoom: FunctionReference<
        'query',
        'internal',
        { limit?: number; onlineOnly?: boolean; roomId: string },
        Array<{ lastDisconnected: number; online: boolean; userId: string }>
      >;
      listUser: FunctionReference<
        'query',
        'internal',
        { limit?: number; onlineOnly?: boolean; userId: string },
        Array<{ lastDisconnected: number; online: boolean; roomId: string }>
      >;
      removeRoom: FunctionReference<
        'mutation',
        'internal',
        { roomId: string },
        null
      >;
      removeRoomUser: FunctionReference<
        'mutation',
        'internal',
        { roomId: string; userId: string },
        null
      >;
    };
  };
};
