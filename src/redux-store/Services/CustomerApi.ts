import { apiSlice } from "../apiSlice";

interface Envelope<T> {
  success: boolean;
  message?: string;
  data: T;
}

export interface FirebaseLoginResponse {
  id: string;
  name?: string;
  phoneNumber: string;
  area?: string;
  role: "Customer";
  isNew: boolean;
  token: string;
}

export interface CustomerProfile {
  id: string;
  phoneNumber: string;
  name?: string;
  email?: string;
  area?: string;
  isActive: boolean;
}

export interface AddressDto {
  id: string;
  label: string;
  line1: string;
  city: string;
  state: string;
  pincode: string;
}

export type NewAddress = Omit<AddressDto, "id">;

export const customerApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    firebaseLogin: builder.mutation<FirebaseLoginResponse, { idToken: string }>({
      query: (body) => ({ url: "/customers/auth/firebase", method: "POST", body }),
      transformResponse: (res: Envelope<FirebaseLoginResponse>) => res.data,
    }),
    getMe: builder.query<CustomerProfile, void>({
      query: () => "/customers/me",
      transformResponse: (res: Envelope<CustomerProfile>) => res.data,
      providesTags: ["Customer"],
    }),
    updateMe: builder.mutation<
      CustomerProfile,
      Partial<{ name: string; email: string; area: string }>
    >({
      query: (body) => ({ url: "/customers/me", method: "PATCH", body }),
      transformResponse: (res: Envelope<CustomerProfile>) => res.data,
      invalidatesTags: ["Customer"],
    }),
    listAddresses: builder.query<AddressDto[], void>({
      query: () => "/customers/me/addresses",
      transformResponse: (res: Envelope<AddressDto[]>) => res.data,
      providesTags: ["Customer"],
    }),
    addAddress: builder.mutation<AddressDto, NewAddress>({
      query: (body) => ({ url: "/customers/me/addresses", method: "POST", body }),
      transformResponse: (res: Envelope<AddressDto>) => res.data,
      invalidatesTags: ["Customer"],
    }),
  }),
});

export const {
  useFirebaseLoginMutation,
  useGetMeQuery,
  useUpdateMeMutation,
  useListAddressesQuery,
  useAddAddressMutation,
} = customerApi;
