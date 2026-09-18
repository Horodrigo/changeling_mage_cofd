import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";

test("manifest defines a standalone installable application", async () => {
  const manifest = JSON.parse(
    await readFile(new URL("../public/manifest.webmanifest", import.meta.url), "utf8"),
  );

  assert.equal(manifest.display, "standalone");
  assert.equal(manifest.name, "Characters of the Darkness");
  assert.equal(manifest.short_name, "Characters of the Darkness");
  assert.equal(manifest.start_url, "/");
  assert.ok(manifest.icons.some((icon) => icon.sizes === "192x192"));
  assert.ok(manifest.icons.some((icon) => icon.sizes === "512x512"));
});

test("service worker preserves offline navigation and requires explicit activation", async () => {
  const worker = await readFile(new URL("../public/sw.js", import.meta.url), "utf8");

  assert.match(worker, /caches\.open\(CACHE\)/);
  assert.match(worker, /request\.mode === "navigate"/);
  assert.match(worker, /SKIP_WAITING/);
  assert.doesNotMatch(
    worker,
    /addEventListener\(["']install["'][\s\S]{0,500}?skipWaiting\(/,
    "an update must not force activation during install",
  );
});

test("PWA manager keeps development workers from caching mutable Vite modules", async () => {
  const manager = await readFile(new URL("../app/pwa-manager.tsx", import.meta.url), "utf8");
  const template = await readFile(new URL("../public/sw.template.js", import.meta.url), "utf8");

  assert.match(manager, /process\.env\.NODE_ENV === "development"/);
  assert.match(manager, /serviceWorker/);
  assert.match(template, /isDevelopmentModule/);
  assert.match(template, /url\.searchParams\.has\("t"\)/);
});

test("offline/update notice can be dismissed for the current session", async () => {
  const manager = await readFile(new URL("../app/pwa-manager.tsx", import.meta.url), "utf8");

  assert.match(manager, /sessionStorage\.setItem\(DISMISSED_KEY,\s*"1"\)/);
  assert.match(manager, /pwa-dismiss/);
});
