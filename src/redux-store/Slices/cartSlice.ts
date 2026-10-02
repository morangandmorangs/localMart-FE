import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

/** A product plus the chosen variant, if it has sizes. Mirrors useCartDraft's lineKey. */
const lineKey = (productId: string, variantId?: string) =>
  variantId ? `${productId}::${variantId}` : productId;

export interface CartLine {
  productId: string;
  variantId?: string;
  quantity: number;
}

export interface CartState {
  lines: Record<string, CartLine>;
}

const initialState: CartState = { lines: {} };

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    increment(
      state,
      action: PayloadAction<{
        productId: string;
        max: number;
        variantId?: string;
      }>,
    ) {
      const { productId, max, variantId } = action.payload;
      const key = lineKey(productId, variantId);
      const next = (state.lines[key]?.quantity ?? 0) + 1;
      // Never let the cart promise more than the shop has.
      if (next > max) return;
      state.lines[key] = { productId, variantId, quantity: next };
    },
    decrement(
      state,
      action: PayloadAction<{ productId: string; variantId?: string }>,
    ) {
      const { productId, variantId } = action.payload;
      const key = lineKey(productId, variantId);
      const next = (state.lines[key]?.quantity ?? 0) - 1;
      if (next <= 0) {
        // Drop the key rather than keeping a zero, so totals stay honest.
        delete state.lines[key];
        return;
      }
      state.lines[key] = { productId, variantId, quantity: next };
    },
    clearCart(state) {
      state.lines = {};
    },
  },
});

export const { increment, decrement, clearCart } = cartSlice.actions;

interface WithCart {
  cart: CartState;
}

export const selectCartLines = (state: WithCart) => state.cart.lines;
export const selectTotalItems = (state: WithCart) =>
  Object.values(state.cart.lines).reduce((sum, l) => sum + l.quantity, 0);

export default cartSlice.reducer;
