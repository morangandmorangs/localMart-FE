import { apiSlice } from "../apiSlice";

interface Envelope<T> {
  success: boolean;
  message?: string;
  data: T;
}

export interface MerchantLoginResponse {
  id: string;
  name: string;
  email: string;
  role: "Merchant";
  profileStatus: string;
  canOperate: boolean;
  token: string;
}

export const merchantAuthApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    merchantLogin: builder.mutation<
      MerchantLoginResponse,
      { email: string; password: string }
    >({
      query: (body) => ({ url: "/merchants/login", method: "POST", body }),
      transformResponse: (res: Envelope<MerchantLoginResponse>) => res.data,
    }),
    merchantRegister: builder.mutation<
      MerchantLoginResponse,
      { name: string; email: string; password: string; phoneNumber?: string }
    >({
      query: (body) => ({ url: "/merchants/register", method: "POST", body }),
      transformResponse: (res: Envelope<MerchantLoginResponse>) => res.data,
    }),
    merchantGoogleAuth: builder.mutation<MerchantLoginResponse, { idToken: string }>({
      query: (body) => ({ url: "/merchants/auth/google", method: "POST", body }),
      transformResponse: (res: Envelope<MerchantLoginResponse>) => res.data,
    }),
  }),
});

export const {
  useMerchantLoginMutation,
  useMerchantRegisterMutation, useMerchantGoogleAuthMutation } =
  merchantAuthApi;
