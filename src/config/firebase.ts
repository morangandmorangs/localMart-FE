import { initializeApp, type FirebaseOptions } from "firebase/app";
import { getAnalytics, isSupported, type Analytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

// Values come from .env.local (see .env.example). Firebase web config is not
// secret — it ships inside the client bundle — but keeping it in env vars lets
// dev/staging/prod point at different Firebase projects.
const firebaseConfig: FirebaseOptions = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

export const app = initializeApp(firebaseConfig);

/** Phone-OTP sign-in — see lib/firebasePhoneAuth.ts for the actual flow. */
export const auth = getAuth(app);

// getAnalytics() throws where the measurement SDK can't run (SSR, some
// browsers, blocked cookies), so gate it behind isSupported() and leave
// analytics null rather than taking the app down with it.
export let analytics: Analytics | null = null;

export const analyticsReady: Promise<Analytics | null> = isSupported()
  .then((supported) => {
    analytics = supported ? getAnalytics(app) : null;
    return analytics;
  })
  .catch(() => null);

export default app;
