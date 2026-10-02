import CartPage from "../Common/Cart/CartPage";
import CategoryPage from "../Category/CategoryPage";
import CheckoutPage from "../Checkout/CheckoutPage";
import Home from "../Home/Home";

export const immediateRoutes = [
  { path: "/", component: Home },
  // One route for all four aisles; CategoryPage picks the section by slug.
  { path: "/category/:slug", component: CategoryPage },
  { path: "/cart", component: CartPage },
  { path: "/checkout", component: CheckoutPage },
];

export const fallbackRoute = {
  path: "*",
  //   component: NotFoundPage,
};
