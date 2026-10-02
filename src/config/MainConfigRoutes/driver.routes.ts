import { lazy } from "react";

const LoginDriver = lazy(() => import("../../pages/Driver/LoginDriver"));
const SignUpDriver = lazy(() => import("../../pages/Driver/SignUpDriver"));

export const driverAuthRoutes = [
  { path: "/driver/login", component: LoginDriver },
  { path: "/driver/signup", component: SignUpDriver },
];
