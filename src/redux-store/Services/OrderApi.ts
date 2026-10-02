import { apiSlice } from "../apiSlice";

interface Envelope<T> {
  success: boolean;
  count?: number;
  data: T;
}

export interface OrderItemDto {
  productId: string;
  variantId?: string;
  name: string;
  price: number;
  quantity: number;
}

export interface OrderAddressDto {
  label: string;
  line1: string;
  city: string;
  state: string;
  pincode: string;
}

export interface OrderDto {
  id: string;
  customer: { id: string; name?: string; phoneNumber?: string };
  items: OrderItemDto[];
  address: OrderAddressDto;
  paymentMethod: "gpay" | "phonepe";
  total: number;
  status: "placed";
  createdAt: string;
}

export interface NewOrder {
  addressId: string;
  paymentMethod: "gpay" | "phonepe";
  items: { productId: string; variantId?: string; quantity: number }[];
}

export const orderApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createOrder: builder.mutation<OrderDto, NewOrder>({
      query: (body) => ({ url: "/orders", method: "POST", body }),
      transformResponse: (res: Envelope<OrderDto>) => res.data,
      invalidatesTags: ["Order"],
    }),
    // No pollingInterval here — passed at the call site, so only the admin
    // dashboard that actually needs "live" polls.
    getOrders: builder.query<OrderDto[], void>({
      query: () => "/orders",
      transformResponse: (res: Envelope<OrderDto[]>) => res.data,
      providesTags: ["Order"],
    }),
  }),
});

export const { useCreateOrderMutation, useGetOrdersQuery } = orderApi;
