import { lazy } from "react";

const LoginAdmin = lazy(() => import("../../pages/Admin/LoginAdmin"));
const AdminDashboard = lazy(() => import("../../pages/Admin/AdminDashboard"));

export const adminAuthRoutes = [
  { path: "/admin/login", component: LoginAdmin },
];

export const adminRoutes = [
  { path: "/admin/dashboard", component: AdminDashboard },
];

// sid@gmail.com
// SidBro@99
// kaushik@gmail.com
// kaushik@99

// ilix@gmail.com
// ilix@99
