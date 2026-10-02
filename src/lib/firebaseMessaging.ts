import {
  getMessaging,
  getToken,
  isSupported,
  onMessage,
  type MessagePayload,
} from "firebase/messaging";

import app from "../config/firebase";

const SW_PATH = "/firebase-messaging-sw.js";

const swUrl = () => {
  const q = new URLSearchParams({
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY ?? "",
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ?? "",
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID ?? "",
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID ?? "",
    appId: import.meta.env.VITE_FIREBASE_APP_ID ?? "",
  });
  return `${SW_PATH}?${q}`;
};

export const pushSupported = () =>
  isSupported().catch(() => false) as Promise<boolean>;

/** Asks for permission (call from a click) and returns this browser's FCM
 *  token, or null if push is unsupported or the user said no. */
export const requestPushToken = async (): Promise<string | null> => {
  if (!(await pushSupported())) return null;
  if ((await Notification.requestPermission()) !== "granted") return null;

  const registration = await navigator.serviceWorker.register(swUrl());
  return getToken(getMessaging(app), {
    vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
    serviceWorkerRegistration: registration,
  });
};

/** Foreground messages (dashboard tab open and focused). Returns unsubscribe. */
export const onForegroundMessage = (
  handler: (payload: MessagePayload) => void,
) => onMessage(getMessaging(app), handler);
