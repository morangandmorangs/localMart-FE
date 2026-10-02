import { lazy } from "react";

const AccountPage = lazy(() => import("../../pages/Account/AccountPage"));

// One page for every role; AccountPage picks the mini components by role.
export const accountRoutes = [{ path: "/account", component: AccountPage }];
