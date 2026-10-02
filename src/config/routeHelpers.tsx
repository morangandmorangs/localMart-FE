import React, { Suspense } from "react";
import { Route } from "react-router-dom";
import {
  PublicRouteWrapper,
  RequireAdmin,
  RequireCustomer,
  RequireSession,
  RouteLoadingFallback,
} from "./RouteChrome";

export const createImmediateRoute = (
  path: string,
  Component: React.ComponentType,
) => <Route key={path} path={path} element={<Component />} />;

export const createPublicRoute = (
  path: string,
  Component: React.ComponentType,
) => (
  <Route
    key={path}
    path={path}
    element={
      <Suspense fallback={<RouteLoadingFallback />}>
        <PublicRouteWrapper>
          <Component />
        </PublicRouteWrapper>
      </Suspense>
    }
  />
);

/** Auth screens render their own full-page layout, so no site header. */
export const createAuthRoute = (
  path: string,
  Component: React.ComponentType,
) => (
  <Route
    key={path}
    path={path}
    element={
      <Suspense fallback={<RouteLoadingFallback />}>
        <Component />
      </Suspense>
    }
  />
);

/** Signed-in customer pages: site header, bounced to /signin otherwise. */
export const createCustomerRoute = (
  path: string,
  Component: React.ComponentType,
) => (
  <Route
    key={path}
    path={path}
    element={
      <Suspense fallback={<RouteLoadingFallback />}>
        <RequireCustomer>
          <PublicRouteWrapper>
            <Component />
          </PublicRouteWrapper>
        </RequireCustomer>
      </Suspense>
    }
  />
);

/** Signed-in admin pages: no site header (the dashboard brings its own). */
export const createAdminRoute = (
  path: string,
  Component: React.ComponentType,
) => (
  <Route
    key={path}
    path={path}
    element={
      <Suspense fallback={<RouteLoadingFallback />}>
        <RequireAdmin>
          <Component />
        </RequireAdmin>
      </Suspense>
    }
  />
);

/** Signed-in pages shared by every role: site header, any session may enter. */
export const createSessionRoute = (
  path: string,
  Component: React.ComponentType,
) => (
  <Route
    key={path}
    path={path}
    element={
      <Suspense fallback={<RouteLoadingFallback />}>
        <RequireSession>
          <PublicRouteWrapper>
            <Component />
          </PublicRouteWrapper>
        </RequireSession>
      </Suspense>
    }
  />
);
