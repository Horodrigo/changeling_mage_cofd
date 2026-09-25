const VERSION = "2026.09.25-0777ae9";
const CACHE = `characters-of-the-darkness-${VERSION}`;

const SHELL = [
  "/",
  "/manifest.webmanifest",
  "/data/manifest.json",
  "/favicon.svg",
  "/app-icon-192.png",
  "/app-icon-512.png",
  "/cod-emblem-256.webp",
  "/paper-texture.webp",

  "/changeling/style/icon.webp",
  "/mage-skull.webp",
  "/vampire-skull.webp",

  "/fonts/changeling/changeling-regular.woff2",
  "/fonts/changeling/changeling-italic.woff2",
  "/fonts/changeling/changeling-small-caps.woff2",

  "/changeling/style/frame-corner.webp",
  "/changeling/style/paper-texture.webp",
  "/changeling/style/frame-center.webp",
  "/changeling/style/frame-side.webp",
  "/changeling/style/title.webp",
  "/changeling/style/tab-texture.webp",
  "/changeling/style/attributes-divider.webp",
  "/changeling/style/attributes-divider-leaf.webp",
  "/changeling/style/section-divider.webp",
  "/changeling/style/column-divider.webp",
  "/changeling/style/skill-highlight-left.webp",
  "/changeling/style/skill-highlight-middle-1.webp",
  "/changeling/style/skill-highlight-middle-2.webp",
  "/changeling/style/skill-highlight-right.webp",
  "/changeling/style/experience-purchase-icon.webp",
  "/changeling/style/background-changeling.webp",

  "/vampire/style/attributes-divider.webp",
  "/vampire/style/attributes-divider-thorns.webp",
  "/vampire/style/background-vampire.webp",
  "/vampire/style/divider-terminal.webp",
  "/vampire/style/frame-blood-center-bottom.webp",
  "/vampire/style/frame-blood-center-top.webp",
  "/vampire/style/selected-tab-texture.webp",
  "/vampire/style/thorns-corner.webp",
  "/vampire/style/vampire-title.webp",

  "/vampire/easter-eggs/nosferatu.webm",

  "/version.json",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(SHELL)),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    Promise.all([
      caches.keys().then((keys) =>
        Promise.all(
          keys
            .filter(
              (key) =>
                (
                  key.startsWith("arquivo-das-trevas-") ||
                  key.startsWith("characters-of-the-darkness-")
                ) &&
                key !== CACHE,
            )
            .map((key) => caches.delete(key)),
        ),
      ),
      self.clients.claim(),
    ]),
  );
});

self.addEventListener("message", (event) => {
  if (event.data?.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

self.addEventListener("fetch", (event) => {
  const request = event.request;

  if (request.method !== "GET") {
    return;
  }

  const url = new URL(request.url);

  const isDevelopmentModule =
    url.pathname.startsWith("/node_modules/") ||
    url.pathname.startsWith("/@") ||
    url.pathname.startsWith("/.vite/") ||
    url.searchParams.has("t") ||
    url.searchParams.has("v");

  if (
    url.origin !== self.location.origin ||
    url.pathname.startsWith("/api/") ||
    isDevelopmentModule
  ) {
    return;
  }

  // Always ask the network for the current application version.
  if (url.pathname === "/version.json") {
    event.respondWith(
      fetch(request, { cache: "no-store" }).catch(() =>
        caches
          .match("/version.json")
          .then((response) => response || Response.error()),
      ),
    );

    return;
  }

  // Navigation must prefer the network so a newly deployed application
  // shell is not hidden behind an old cached document.
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok) {
            const copy = response.clone();

            caches.open(CACHE).then((cache) => {
              cache.put("/", copy);
            });
          }

          return response;
        })
        .catch(() =>
          caches
            .match("/")
            .then((response) => response || Response.error()),
        ),
    );

    return;
  }

  /*
   * Vite/Vinext generated assets normally contain content hashes.
   * Cache-first is safe for those resources because a changed bundle
   * receives a new URL.
   *
   * Static public assets are also isolated by the versioned CACHE name.
   */
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) {
        return cached;
      }

      return fetch(request).then((response) => {
        if (response.ok) {
          const copy = response.clone();

          caches.open(CACHE).then((cache) => {
            cache.put(request, copy);
          });
        }

        return response;
      });
    }),
  );
});
