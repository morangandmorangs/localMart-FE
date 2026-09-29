import Home from "../Home/Home";

export const immediateRoutes = [{ path: "/", component: Home }];

export const fallbackRoute = {
  path: "*",
  //   component: NotFoundPage,
};
