import { initializeApp, type FirebaseOptions } from "firebase/app";
import { getAnalytics, isSupported, type Analytics } from "firebase/analytics";

// Firebase is only used for Analytics. Values come from .env (see
// .env.example); Firebase web config is not secret — it ships inside the
// client bundle.
const firebaseConfig: FirebaseOptions = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Without a measurement ID there is nothing to report to, so Firebase is not
// started at all and a build without the env vars still runs.
const app = firebaseConfig.measurementId ? initializeApp(firebaseConfig) : null;

// getAnalytics() throws where the measurement SDK can't run (SSR, some
// browsers, blocked cookies), so gate it behind isSupported() and leave
// analytics null rather than taking the app down with it.
export let analytics: Analytics | null = null;

export const analyticsReady: Promise<Analytics | null> = app
  ? isSupported()
      .then((supported) => {
        analytics = supported ? getAnalytics(app) : null;
        return analytics;
      })
      .catch(() => null)
  : Promise.resolve(null);
