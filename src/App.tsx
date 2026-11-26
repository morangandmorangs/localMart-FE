import { useEffect } from "react";
import { Routes, useLocation } from "react-router-dom";
import { usePageTitle } from "./hooks/usePageTitle";
import { createImmediateRoute } from "./config/routeHelpers";
import { fallbackRoute, immediateRoutes } from "./config/immediate.routes";
const App = () => {
  const location = useLocation();
  usePageTitle();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);
  return (
    <>
      <Routes>
        {/* Every page is public; there is no sign-in on the site. */}
        {immediateRoutes.map(({ path, component }) =>
          createImmediateRoute(path, component),
        )}
        {/* 404 — must stay last */}
        {createImmediateRoute(fallbackRoute.path, fallbackRoute.component)}
      </Routes>
    </>
  );
};

export default App;
