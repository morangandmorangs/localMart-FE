import { createApi } from "@reduxjs/toolkit/query/react";

import { baseQueryWithAuthGuard } from "../lib/baseQueryWithAuthGuard";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithAuthGuard,
  tagTypes: ["Product", "Customer", "Order"],
  endpoints: () => ({}),
});
