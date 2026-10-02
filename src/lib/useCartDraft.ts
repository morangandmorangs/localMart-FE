import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  decrement as decrementAction,
  increment as incrementAction,
  selectCartLines,
  selectTotalItems,
} from "../redux-store/Slices/cartSlice";

/**
 * Cart quantities, backed by the global `cart` redux slice (persisted via
 * IndexedDB) — global and durable across navigation and reloads. Every
 * surface already goes through this API, so nothing above had to change.
 */

const lineKey = (productId: string, variantId?: string) =>
  variantId ? `${productId}::${variantId}` : productId;

export interface CartDraft {
  /** Quantity for one product/variant pair. */
  quantityOf: (productId: string, variantId?: string) => number;
  /** Adds one, capped at the stock on hand. */
  increment: (productId: string, max: number, variantId?: string) => void;
  /** Removes one; drops the line at zero. */
  decrement: (productId: string, variantId?: string) => void;
  /** Total units across every line. */
  totalItems: number;
}

export function useCartDraft(): CartDraft {
  const dispatch = useDispatch();
  const lines = useSelector(selectCartLines);
  const totalItems = useSelector(selectTotalItems);

  const quantityOf = useCallback(
    (productId: string, variantId?: string) =>
      lines[lineKey(productId, variantId)]?.quantity ?? 0,
    [lines],
  );

  const increment = useCallback(
    (productId: string, max: number, variantId?: string) => {
      dispatch(incrementAction({ productId, max, variantId }));
    },
    [dispatch],
  );

  const decrement = useCallback(
    (productId: string, variantId?: string) => {
      dispatch(decrementAction({ productId, variantId }));
    },
    [dispatch],
  );

  return { quantityOf, increment, decrement, totalItems };
}
