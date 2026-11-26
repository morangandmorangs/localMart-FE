import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

/**
 * localMart-BEE. Production builds read VITE_API_URL from .env.production
 * (the Cloud Run URL); in development "/api" goes through the Vite proxy to
 * the local backend, so no CORS setup is needed.
 *
 * The site is a showcase: it only reads public endpoints and sends no token.
 * Ordering happens in the Local Mart app.
 */
export const API_URL = import.meta.env.VITE_API_URL ?? "/api";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: API_URL }),
  tagTypes: ["Product", "Restaurant"],
  endpoints: () => ({}),
});
