import type { Product } from "../../lib/catalog/types";
import { apiSlice } from "../apiSlice";

/** Wire shape from GET /api/products — a superset of the client's Product type. */
export interface ProductDto extends Product {
  category: string;
  totalStock: number;
  isSoldOut: boolean;
  isLowStock: boolean;
}

interface ProductsEnvelope {
  success: boolean;
  count: number;
  data: ProductDto[];
}

export const productApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query<
      ProductDto[],
      { category?: string; subCategory?: string } | void
    >({
      query: (params) => ({ url: "/products", params: params ?? undefined }),
      transformResponse: (res: ProductsEnvelope) => res.data,
      providesTags: ["Product"],
    }),
  }),
});

export const { useGetProductsQuery } = productApi;
