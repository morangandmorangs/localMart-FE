import { lazy, type ComponentType } from "react";

const SignInPage = lazy(() => import("../../pages/Customer/Auth/SignInPage"));

// SignInPage renders its own Header/Footer, so it uses the bare auth route.
export const customerAuthRoutes = [{ path: "/signin", component: SignInPage }];

// Signed-in pages (orders, profile, ...) go here; createCustomerRoute adds the
// header and the sign-in guard.
export const customerRoutes: { path: string; component: ComponentType }[] = [];
