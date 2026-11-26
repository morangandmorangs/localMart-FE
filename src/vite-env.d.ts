/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** localMart-BEE base URL, ending in /api. Unset in development: "/api" is proxied. */
  readonly VITE_API_URL?: string;
  /** Firebase Analytics. Leave the measurement ID unset to run without it. */
  readonly VITE_FIREBASE_API_KEY?: string;
  readonly VITE_FIREBASE_AUTH_DOMAIN?: string;
  readonly VITE_FIREBASE_PROJECT_ID?: string;
  readonly VITE_FIREBASE_STORAGE_BUCKET?: string;
  readonly VITE_FIREBASE_MESSAGING_SENDER_ID?: string;
  readonly VITE_FIREBASE_APP_ID?: string;
  readonly VITE_FIREBASE_MEASUREMENT_ID?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
