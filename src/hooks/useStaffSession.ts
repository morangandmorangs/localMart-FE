import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  setStaffCredentials,
  type StaffRole,
} from "../redux-store/Slices/staffAuthSlice";

interface PartnerSession {
  id: string;
  name: string;
  email: string;
  designation?: string;
  profileStatus?: string;
  canOperate?: boolean;
  token: string;
}

/** Stores a freshly issued merchant/driver session and moves on to `redirect`.
 *  Shared by all four login/sign-up pages. */
export const useStaffSession = (role: StaffRole, redirect: string) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return (session: PartnerSession) => {
    const { token, ...profile } = session;
    dispatch(setStaffCredentials({ token, role, profile }));
    navigate(redirect, { replace: true });
  };
};
