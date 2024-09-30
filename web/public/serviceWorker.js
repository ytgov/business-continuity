/* eslint-disable no-undef, no-restricted-globals */

console.log("Loading serviceWorker.js...");

import { precacheAndRoute, createHandlerBoundToURL } from "workbox-precaching";
import { registerRoute, NavigationRoute } from "workbox-routing";
import { CacheFirst, NetworkFirst } from "workbox-strategies";
import { ExpirationPlugin } from "workbox-expiration";

self.skipWaiting();
// workbox.core.clientsClaim();

/*
 * vite-plugin-pwa provides us with paths to all the files to precache via __WB_MANIFEST.
 * Do not precahce any where else.
 * Additional files needed to be precache should be configured in vite config
 */
precacheAndRoute(self.__WB_MANIFEST);

// Works if app is a single page app
registerRoute(
  new NavigationRoute(createHandlerBoundToURL("/index.html"), {
    denylist: [new RegExp(/^\/api/), new RegExp(/^\/migrate/)],
  })
);

// Cache fonts
registerRoute(
  ({ request }) => {
    return request.destination === "font";
  },
  new CacheFirst({
    cacheName: "font-cache",
    plugins: [
      new ExpirationPlugin({
        maxEntries: 64,
        maxAgeSeconds: 60 * 24 * 60, // 60 days
      }),
    ],
  })
);

// Cache reports
registerRoute(
  ({ url }) => {
    return url.pathname.startsWith("/api/documents");
  },6
  new NetworkFirst({
    cacheName: "api-documents",
    /* plugins: [
      new ExpirationPlugin({
        maxEntries: 16,
        maxAgeSeconds: 60 * 24 * 60, // 60 days
      }),
    ], */
  })
);
