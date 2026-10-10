const VERSION = "2026.10.10-c792b38";
const CACHE = `characters-of-the-darkness-${VERSION}`;

const SHELL = [
  "/",
  "/manifest.webmanifest",
  "/shared/data/catalog-manifest.json",
  "/favicon.svg",
  "/app-icon-192.png",
  "/app-icon-512.png",
  "/shared/images/cod-emblem-256.webp",
  "/shared/images/paper-texture.webp",

  "/game-lines/changeling/images/icon.webp",
  "/game-lines/mage/images/icon.webp",
  "/game-lines/vampire/images/icon.webp",

  "/game-lines/changeling/fonts/changeling-regular.woff2",
  "/game-lines/changeling/fonts/changeling-italic.woff2",
  "/game-lines/changeling/fonts/changeling-small-caps.woff2",

  "/game-lines/changeling/images/frame-corner.webp",
  "/game-lines/changeling/images/paper-texture.webp",
  "/game-lines/changeling/images/frame-center.webp",
  "/game-lines/changeling/images/frame-side.webp",
  "/game-lines/changeling/images/title.webp",
  "/game-lines/changeling/images/tab-texture.webp",
  "/game-lines/changeling/images/attributes-divider.webp",
  "/game-lines/changeling/images/attributes-divider-leaf.webp",
  "/game-lines/changeling/images/section-divider.webp",
  "/game-lines/changeling/images/column-divider.webp",
  "/game-lines/changeling/images/skill-highlight-left.webp",
  "/game-lines/changeling/images/skill-highlight-middle-1.webp",
  "/game-lines/changeling/images/skill-highlight-middle-2.webp",
  "/game-lines/changeling/images/skill-highlight-right.webp",
  "/game-lines/changeling/images/experience-purchase-icon.webp",
  "/game-lines/changeling/images/background-changeling.webp",

  "/game-lines/vampire/images/attributes-divider.webp",
  "/game-lines/vampire/images/attributes-divider-thorns.webp",
  "/game-lines/vampire/images/background-vampire.webp",
  "/game-lines/vampire/images/divider-terminal.webp",
  "/game-lines/vampire/images/frame-blood-center-bottom.webp",
  "/game-lines/vampire/images/frame-blood-center-top.webp",
  "/game-lines/vampire/images/selected-tab-texture.webp",
  "/game-lines/vampire/images/thorns-corner.webp",
  "/game-lines/vampire/images/vampire-title.webp",

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
