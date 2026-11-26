import React from "react";
import { Route } from "react-router-dom";

export const createImmediateRoute = (
  path: string,
  Component: React.ComponentType,
) => <Route key={path} path={path} element={<Component />} />;
