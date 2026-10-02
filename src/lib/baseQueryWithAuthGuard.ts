import { fetchBaseQuery, type BaseQueryFn } from "@reduxjs/toolkit/query/react";

import { logout, selectToken } from "../redux-store/Slices/authSlice";
import { selectStaffToken, staffLogout } from "../redux-store/Slices/staffAuthSlice";

// Set VITE_API_URL in .env.production; dev falls back to the local backend.
export const API_URL =
  import.meta.env.VITE_API_URL ?? "http://localhost:8080/api";

/** Error codes errorMiddleware.ts uses for an expired/invalid/missing token. */
const AUTH_ERROR_CODES = new Set([
  "UNAUTHENTICATED",
  "TOKEN_EXPIRED",
  "TOKEN_INVALID",
]);

type AuthState = Parameters<typeof selectToken>[0] & Parameters<typeof selectStaffToken>[0];

const rawBaseQuery = fetchBaseQuery({
  baseUrl: API_URL,
  prepareHeaders: (headers, { getState }) => {
    const state = getState() as AuthState;
    // A tab is practically one persona at a time — shopper or staff, never
    // both — so whichever slot is populated is the one to send.
    const token = selectToken(state) ?? selectStaffToken(state);
    if (token) headers.set("Authorization", `Bearer ${token}`);
    return headers;
  },
});

/**
 * Wraps fetchBaseQuery so every endpoint on apiSlice gets the bearer token
 * and the same session-expiry handling, rather than each endpoint re-reading
 * the store and re-checking error codes itself.
 */
export const baseQueryWithAuthGuard: BaseQueryFn = async (
  args,
  api,
  extraOptions,
) => {
  const result = await rawBaseQuery(args, api, extraOptions);

  const code = (result.error?.data as { code?: string } | undefined)?.code;
  if (code && AUTH_ERROR_CODES.has(code)) {
    // Whichever slot had nothing to clear is a no-op.
    api.dispatch(logout());
    api.dispatch(staffLogout());
  }

  return result;
};
