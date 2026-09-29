import React, { Suspense } from "react";
import { Route } from "react-router-dom";
import { Header } from "../Home/components/Header";

// ─── Loading Fallback ────────────────────────────────────────────────────────

const RouteLoadingFallback: React.FC = () => (
  <div className='min-h-screen flex items-center justify-center'>
    <div className='text-center'>
      <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4'></div>
      <p className='text-gray-600'>Loading...</p>
    </div>
  </div>
);

const PublicRouteWrapper: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <>
    <Header />
    {children}
  </>
);

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
