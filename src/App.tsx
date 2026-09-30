import { useEffect } from "react";
import { Routes, useLocation } from "react-router-dom";
import { usePageTitle } from "./hooks/usePageTitle";
import { createImmediateRoute } from "./config/routeHelpers";
import { immediateRoutes } from "./config/immediate.routes";
const App = () => {
  const location = useLocation();
  usePageTitle();
  // usePushRegistration();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);
  return (
    <Routes>
      {/* IMMEDIATE — no lazy, no wrapper */}
      {immediateRoutes.map(({ path, component }) =>
        createImmediateRoute(path, component),
      )}
    </Routes>
  );
};

export default App;
