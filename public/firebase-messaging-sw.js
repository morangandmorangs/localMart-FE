/* Receives order alerts while no dashboard tab is focused.
   A service worker can't read import.meta.env, so lib/firebaseMessaging.ts
   passes the (public) web config in the registration URL's query string. */
importScripts("https://www.gstatic.com/firebasejs/12.19.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/12.19.0/firebase-messaging-compat.js");

const params = new URL(self.location).searchParams;
firebase.initializeApp({
  apiKey: params.get("apiKey"),
  authDomain: params.get("authDomain"),
  projectId: params.get("projectId"),
  messagingSenderId: params.get("messagingSenderId"),
  appId: params.get("appId"),
});

const messaging = firebase.messaging();

// Messages with a `notification` payload are displayed by the SDK itself; this
// only adds the click target.
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(self.clients.openWindow("/"));
});

messaging.onBackgroundMessage(() => {});
