/** Where each Local Mart app lives. The site is a showcase: ordering happens
 *  in the customer app, and partners sign up in their own apps.
 *
 *  Package names come from each Expo app's app.json (android.package). */
const playStore = (pkg: string) =>
  `https://play.google.com/store/apps/details?id=${pkg}`;

export const APP_LINKS = {
  customer: playStore("com.localmart.customer"),
  merchant: playStore("com.localmart.merchant"),
  driver: playStore("com.localmart.driver"),
  /** The farmer app is a website, not a store app. */
  farmer: "https://farmer.localmart.live",
} as const;

/** The in-site page every ordering action leads to. */
export const GET_APP_PATH = "/get-app";
