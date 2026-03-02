/* eslint-disable */
/**
 * Generated `api` utility types.
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
import type * as functions from "../functions.js";

declare const fullApi: ApiFromModules<{
  functions: typeof functions;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, any, any, any>
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal", any, any>
>;
