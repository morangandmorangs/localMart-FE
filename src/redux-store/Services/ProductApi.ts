import type { Product, Restaurant } from "../../lib/catalog/types";
import { apiSlice } from "../apiSlice";

/** Wire shape from GET /api/products — a superset of the client's Product type. */
export interface ProductDto extends Product {
  category: string;
  totalStock: number;
  isSoldOut: boolean;
  isLowStock: boolean;
}

export interface ProductList {
  products: ProductDto[];
  /**
   * False while the catalogue is in preview mode (no stock connected yet):
   * every product is listed with a stock of 0, which means "unknown", not
   * "sold out", so cards hide stock and keep the order button.
   */
  showStock: boolean;
}

interface Envelope<T> {
  success: boolean;
  count?: number;
  data: T;
}

interface ProductsEnvelope extends Envelope<ProductDto[]> {
  meta?: { showStock?: boolean };
}

export const productApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query<
      ProductList,
      { category?: string; subCategory?: string; search?: string } | void
    >({
      query: (params) => ({ url: "/products", params: params ?? undefined }),
      transformResponse: (res: ProductsEnvelope) => ({
        products: res.data,
        showStock: res.meta?.showStock ?? true,
      }),
      providesTags: ["Product"],
    }),
    getRestaurants: builder.query<Restaurant[], void>({
      query: () => "/restaurants",
      transformResponse: (res: Envelope<Restaurant[]>) => res.data,
      providesTags: ["Restaurant"],
    }),
    getRestaurant: builder.query<Restaurant, string>({
      query: (id) => `/restaurants/${encodeURIComponent(id)}`,
      transformResponse: (res: Envelope<Restaurant>) => res.data,
      providesTags: ["Restaurant"],
    }),
  }),
});

export const { useGetProductsQuery, useGetRestaurantsQuery, useGetRestaurantQuery } =
  productApi;
