import type { StaffRole } from "../../redux-store/Slices/staffAuthSlice";

export type AccountRole = "Customer" | StaffRole;

/** One shape for every role's session, so the mini components never have to
 *  know which slice of the store the data came from. */
export interface AccountView {
  role: AccountRole;
  name: string;
  /** Phone number for customers, email for staff. */
  identifier: string;
  identifierLabel: "Phone" | "Email";
  /** Customers only. */
  area?: string;
  /** Merchants and drivers only. */
  designation?: string;
  profileStatus?: string;
  canOperate?: boolean;
  signOut: () => void;
}
