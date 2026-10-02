import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  logout,
  selectCurrentCustomer,
} from "../../redux-store/Slices/authSlice";
import {
  selectCurrentStaff,
  selectStaffRole,
  staffLogout,
} from "../../redux-store/Slices/staffAuthSlice";
import type { AccountView } from "./accountTypes";

const STAFF_LOGIN = {
  Admin: "/admin/login",
  Merchant: "/merchant/login",
  Driver: "/driver/login",
} as const;

/** Normalises whichever session is active into an AccountView, or null when
 *  signed out. A shopper session wins if both exist, since /account is the
 *  shopper-facing link in the site header. */
export const useAccountView = (): AccountView | null => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const customer = useSelector(selectCurrentCustomer);
  const staff = useSelector(selectCurrentStaff);
  const staffRole = useSelector(selectStaffRole);

  if (customer) {
    return {
      role: "Customer",
      name: customer.name?.trim() || "Local Mart shopper",
      identifier: customer.phoneNumber,
      identifierLabel: "Phone",
      area: customer.area,
      signOut: () => {
        dispatch(logout());
        navigate("/", { replace: true });
      },
    };
  }

  if (staff && staffRole) {
    return {
      role: staffRole,
      name: staff.name?.trim() || staffRole,
      identifier: staff.email,
      identifierLabel: "Email",
      designation: staff.designation,
      profileStatus: staff.profileStatus,
      canOperate: staff.canOperate,
      signOut: () => {
        dispatch(staffLogout());
        navigate(STAFF_LOGIN[staffRole], { replace: true });
      },
    };
  }

  return null;
};
