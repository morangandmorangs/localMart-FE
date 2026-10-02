import React from "react";
import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import { selectIsAuthenticated } from "../redux-store/Slices/authSlice";
import { selectIsStaffAuthenticated, selectStaffRole } from "../redux-store/Slices/staffAuthSlice";
import { Header } from "../Home/components/Header";

export const RouteLoadingFallback: React.FC = () => (
  <div className='min-h-screen flex items-center justify-center'>
    <div className='text-center'>
      <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4'></div>
      <p className='text-gray-600'>Loading...</p>
    </div>
  </div>
);

export const PublicRouteWrapper: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <>
    <Header />
    {children}
  </>
);

/** Sends signed-out shoppers to /signin, remembering where they were headed. */
export const RequireCustomer: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const { pathname, search } = useLocation();
  if (!isAuthenticated) {
    return (
      <Navigate
        to={`/signin?redirect=${encodeURIComponent(pathname + search)}`}
        replace
      />
    );
  }
  return <>{children}</>;
};

/** Pages every role shares (e.g. /account): any shopper or staff session gets
 *  in, everyone else is sent to /signin. */
export const RequireSession: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const isCustomer = useSelector(selectIsAuthenticated);
  const isStaff = useSelector(selectIsStaffAuthenticated);
  const { pathname, search } = useLocation();
  if (!isCustomer && !isStaff) {
    return (
      <Navigate
        to={`/signin?redirect=${encodeURIComponent(pathname + search)}`}
        replace
      />
    );
  }
  return <>{children}</>;
};

/** Admin console pages: bounced to the admin login unless an Admin session exists. */
export const RequireAdmin: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const role = useSelector(selectStaffRole);
  if (role !== "Admin") return <Navigate to='/admin/login' replace />;
  return <>{children}</>;
};
