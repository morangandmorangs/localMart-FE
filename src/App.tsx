import { useEffect } from "react";
import { Routes, useLocation } from "react-router-dom";
import { usePageTitle } from "./hooks/usePageTitle";
import {
  createAdminRoute,
  createAuthRoute,
  createCustomerRoute,
  createImmediateRoute,
  createSessionRoute,
} from "./config/routeHelpers";
import { accountRoutes } from "./config/MainConfigRoutes/account.routes";
import { merchantAuthRoutes } from "./config/MainConfigRoutes/merchant.routes";
import { adminAuthRoutes, adminRoutes } from "./config/MainConfigRoutes/admin.routes";
import {
  customerAuthRoutes,
  customerRoutes,
} from "./config/MainConfigRoutes/customer.routes";
import { driverAuthRoutes } from "./config/MainConfigRoutes/driver.routes";
import { fallbackRoute, immediateRoutes } from "./config/immediate.routes";
import { Toaster } from "react-hot-toast";
const App = () => {
  const location = useLocation();
  usePageTitle();
  // usePushRegistration();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);
  return (
    <>
      <Toaster
        position='top-right'
        reverseOrder={false}
        gutter={8}
        containerStyle={{ top: 20, left: 20, bottom: 20, right: 20 }}
        toastOptions={{
          duration: 3000,
          style: {
            background: "#fff",
            color: "#363636",
            border: "1px solid #e5e7eb",
            borderRadius: "8px",
            boxShadow:
              "0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)",
            fontSize: "14px",
            maxWidth: "420px",
            padding: "12px 16px",
            fontFamily: "system-ui, -apple-system, sans-serif",
          },
          success: {
            duration: 4000,
            iconTheme: { primary: "#10b981", secondary: "#fff" },
            style: {
              border: "1px solid #10b981",
              background: "#f0fdf4",
              color: "#065f46",
            },
          },
          error: {
            duration: 5000,
            iconTheme: { primary: "#ef4444", secondary: "#fff" },
            style: {
              border: "1px solid #ef4444",
              background: "#fef2f2",
              color: "#991b1b",
            },
          },
          loading: {
            duration: Infinity,
            style: {
              border: "1px solid #3b82f6",
              background: "#eff6ff",
              color: "#1e40af",
            },
          },
        }}
      />
      <Routes>
        {/* IMMEDIATE — no lazy, no wrapper */}
        {immediateRoutes.map(({ path, component }) =>
          createImmediateRoute(path, component),
        )}
        {/* CUSTOMER — signed-in pages, header + guard */}
        {customerRoutes.map(({ path, component }) =>
          createCustomerRoute(path, component),
        )}
        {/* ACCOUNT — shared by every role */}
        {accountRoutes.map(({ path, component }) =>
          createSessionRoute(path, component),
        )}
        {/* ADMIN — signed-in console, guarded by role */}
        {adminRoutes.map(({ path, component }) =>
          createAdminRoute(path, component),
        )}
        {/* AUTH SCREENS — full-page, no wrapper header */}
        {[
          ...customerAuthRoutes,
          ...merchantAuthRoutes,
          ...driverAuthRoutes,
          ...adminAuthRoutes,
        ].map(({ path, component }) => createAuthRoute(path, component))}
        {/* 404 — must stay last */}
        {createImmediateRoute(fallbackRoute.path, fallbackRoute.component)}
      </Routes>
    </>
  );
};

export default App;
