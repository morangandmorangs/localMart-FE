import { apiSlice } from "../apiSlice";

export const notificationApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    registerDeviceToken: builder.mutation<void, { token: string }>({
      query: (body) => ({ url: "/notifications/token", method: "POST", body }),
    }),
    removeDeviceToken: builder.mutation<void, { token: string }>({
      query: (body) => ({ url: "/notifications/token", method: "DELETE", body }),
    }),
  }),
});

export const { useRegisterDeviceTokenMutation, useRemoveDeviceTokenMutation } =
  notificationApi;
