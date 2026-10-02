import { apiSlice } from "../apiSlice";

interface Envelope<T> {
  success: boolean;
  message?: string;
  data: T;
}

export interface AdminLoginResponse {
  id: string;
  name: string;
  email: string;
  role: "Admin";
  designation: string;
  token: string;
}

export const adminAuthApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    adminLogin: builder.mutation<
      AdminLoginResponse,
      { email: string; password: string }
    >({
      query: (body) => ({ url: "/admin/auth/login", method: "POST", body }),
      transformResponse: (res: Envelope<AdminLoginResponse>) => res.data,
    }),
  }),
});

export const { useAdminLoginMutation } = adminAuthApi;
