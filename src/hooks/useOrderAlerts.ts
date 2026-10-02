import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";

import {
  onForegroundMessage,
  pushSupported,
  requestPushToken,
} from "../lib/firebaseMessaging";
import { useRegisterDeviceTokenMutation } from "../redux-store/Services/NotificationApi";
import { apiSlice } from "../redux-store/apiSlice";

/** Order alerts for the admin / merchant dashboard.
 *
 *  Mount once in the dashboard layout. While mounted, a new order shows a toast
 *  and refreshes the order list; `enable()` (call it from a button click, as
 *  browsers require) asks permission and registers this device so alerts also
 *  arrive when the tab is in the background. */
export const useOrderAlerts = () => {
  const dispatch = useDispatch();
  const [register] = useRegisterDeviceTokenMutation();
  const [supported, setSupported] = useState(false);
  const [enabled, setEnabled] = useState(
    typeof Notification !== "undefined" && Notification.permission === "granted",
  );

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    let cancelled = false;
    pushSupported().then((ok) => {
      if (cancelled) return;
      setSupported(ok);
      if (!ok) return;
      unsubscribe = onForegroundMessage((payload) => {
        toast(
          `${payload.notification?.title ?? "New order"} — ${payload.notification?.body ?? ""}`,
        );
        dispatch(apiSlice.util.invalidateTags(["Order"]));
      });
    });
    return () => {
      cancelled = true;
      unsubscribe?.();
    };
  }, [dispatch]);

  const enable = async () => {
    try {
      const token = await requestPushToken();
      if (!token) {
        toast.error("Notifications are blocked or unsupported in this browser");
        return;
      }
      await register({ token }).unwrap();
      setEnabled(true);
      toast.success("Order alerts enabled");
    } catch {
      toast.error("Could not enable order alerts");
    }
  };

  return { supported, enabled, enable };
};
