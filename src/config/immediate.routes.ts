import CategoryPage from "../Category/CategoryPage";
import AiDietPlannerPage from "../Plan-features/AiDietPlannerPage";
import Home from "../Home/Home";
import NotFoundPage from "../pages/NotFound/NotFoundPage";
import InfoPage from "../pages/Info/InfoPage";
import GetAppPage from "../pages/GetApp/GetAppPage";
import SearchPage from "../pages/Search/SearchPage";
import RestaurantPage from "../Category/RestaurantPage";
import { GET_APP_PATH } from "./apps";

export const immediateRoutes = [
  { path: "/", component: Home },
  // One route for all four aisles; CategoryPage picks the section by slug.
  { path: "/category/:slug", component: CategoryPage },
  { path: "/restaurant/:id", component: RestaurantPage },
  { path: "/search", component: SearchPage },
  { path: "/ai-diet-planner", component: AiDietPlannerPage },
  // Every ordering action lands here: orders are placed in the app.
  { path: GET_APP_PATH, component: GetAppPage },
  // Footer links; InfoPage picks its copy from the pathname.
  { path: "/about", component: InfoPage },
  { path: "/sell", component: InfoPage },
  { path: "/help", component: InfoPage },
  { path: "/terms", component: InfoPage },
  { path: "/support", component: InfoPage },
];

export const fallbackRoute = { path: "*", component: NotFoundPage };
