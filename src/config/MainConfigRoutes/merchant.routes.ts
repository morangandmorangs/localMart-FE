import { lazy } from "react";

const LoginMerchant = lazy(() => import("../../pages/Merchant/LoginMerchant"));
const SignUpMerchant = lazy(
  () => import("../../pages/Merchant/SignUpMerchant"),
);

export const merchantAuthRoutes = [
  { path: "/merchant/login", component: LoginMerchant },
  { path: "/merchant/signup", component: SignUpMerchant },
];
