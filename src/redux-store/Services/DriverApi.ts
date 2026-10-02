import { apiSlice } from "../apiSlice";

interface Envelope<T> {
  success: boolean;
  message?: string;
  data: T;
}

export interface DriverLoginResponse {
  id: string;
  name: string;
  email: string;
  role: "Driver";
  profileStatus: string;
  canOperate: boolean;
  token: string;
}

export const driverAuthApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    driverLogin: builder.mutation<
      DriverLoginResponse,
      { email: string; password: string }
    >({
      query: (body) => ({ url: "/drivers/login", method: "POST", body }),
      transformResponse: (res: Envelope<DriverLoginResponse>) => res.data,
    }),
    driverRegister: builder.mutation<
      DriverLoginResponse,
      { name: string; email: string; password: string; phoneNumber?: string }
    >({
      query: (body) => ({ url: "/drivers/register", method: "POST", body }),
      transformResponse: (res: Envelope<DriverLoginResponse>) => res.data,
    }),
    driverGoogleAuth: builder.mutation<DriverLoginResponse, { idToken: string }>({
      query: (body) => ({ url: "/drivers/auth/google", method: "POST", body }),
      transformResponse: (res: Envelope<DriverLoginResponse>) => res.data,
    }),
  }),
});

export const {
  useDriverLoginMutation,
  useDriverRegisterMutation, useDriverGoogleAuthMutation } =
  driverAuthApi;
