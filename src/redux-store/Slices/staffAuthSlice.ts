import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type StaffRole = "Admin" | "Merchant" | "Driver";

export interface StaffProfile {
  id: string;
  name?: string;
  email: string;
  designation?: string;
  profileStatus?: string;
  canOperate?: boolean;
}

export interface StaffAuthState {
  token: string | null;
  role: StaffRole | null;
  profile: StaffProfile | null;
}

const initialState: StaffAuthState = {
  token: null,
  role: null,
  profile: null,
};

const staffAuthSlice = createSlice({
  name: "staffAuth",
  initialState,
  reducers: {
    setStaffCredentials(
      state,
      action: PayloadAction<{
        token: string;
        role: StaffRole;
        profile: StaffProfile;
      }>,
    ) {
      state.token = action.payload.token;
      state.role = action.payload.role;
      state.profile = action.payload.profile;
    },
    staffLogout(state) {
      state.token = null;
      state.role = null;
      state.profile = null;
    },
  },
});

export const { setStaffCredentials, staffLogout } = staffAuthSlice.actions;

interface WithStaffAuth {
  staffAuth: StaffAuthState;
}

export const selectStaffToken = (state: WithStaffAuth) => state.staffAuth.token;
export const selectStaffRole = (state: WithStaffAuth) => state.staffAuth.role;
export const selectCurrentStaff = (state: WithStaffAuth) =>
  state.staffAuth.profile;
export const selectIsStaffAuthenticated = (state: WithStaffAuth) =>
  state.staffAuth.token !== null;

export default staffAuthSlice.reducer;
