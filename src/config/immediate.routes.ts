import CartPage from "../Common/Cart/CartPage";
import CategoryPage from "../Category/CategoryPage";
import CheckoutPage from "../Checkout/CheckoutPage";
import Home from "../Home/Home";
import NotFoundPage from "../pages/NotFound/NotFoundPage";
import InfoPage from "../pages/Info/InfoPage";
import RestaurantPage from "../Category/RestaurantPage";

export const immediateRoutes = [
  { path: "/", component: Home },
  // One route for all four aisles; CategoryPage picks the section by slug.
  { path: "/category/:slug", component: CategoryPage },
  { path: "/restaurant/:id", component: RestaurantPage },
  { path: "/cart", component: CartPage },
  { path: "/checkout", component: CheckoutPage },
  // Footer and support-bot links; InfoPage picks its copy from the pathname.
  { path: "/about", component: InfoPage },
  { path: "/sell", component: InfoPage },
  { path: "/help", component: InfoPage },
  { path: "/terms", component: InfoPage },
  { path: "/support", component: InfoPage },
];

export const fallbackRoute = { path: "*", component: NotFoundPage };
