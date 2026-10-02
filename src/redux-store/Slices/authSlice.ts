import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface AuthCustomer {
  id: string;
  name?: string;
  phoneNumber: string;
  area?: string;
}

export interface AuthState {
  token: string | null;
  customer: AuthCustomer | null;
}

const initialState: AuthState = {
  token: null,
  customer: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials(
      state,
      action: PayloadAction<{ token: string; customer: AuthCustomer }>,
    ) {
      state.token = action.payload.token;
      state.customer = action.payload.customer;
    },
    updateCustomer(state, action: PayloadAction<Partial<AuthCustomer>>) {
      if (!state.customer) return;
      Object.assign(state.customer, action.payload);
    },
    logout(state) {
      state.token = null;
      state.customer = null;
    },
  },
});

export const { setCredentials, updateCustomer, logout } = authSlice.actions;

/** Shape of the slice of RootState this file owns — avoids importing RootState and creating a cycle. */
interface WithAuth {
  auth: AuthState;
}

export const selectToken = (state: WithAuth) => state.auth.token;
export const selectCurrentCustomer = (state: WithAuth) => state.auth.customer;
export const selectIsAuthenticated = (state: WithAuth) =>
  state.auth.token !== null;

export default authSlice.reducer;
