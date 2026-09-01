import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";

test("declara uma PWA standalone com ícones Android", async () => {
  const manifest=JSON.parse(await readFile(new URL("../public/manifest.webmanifest",import.meta.url),"utf8"));
  assert.equal(manifest.display,"standalone");
  assert.equal(manifest.start_url,"/");
  assert.ok(manifest.icons.some((icon)=>icon.sizes==="192x192"));
  assert.ok(manifest.icons.some((icon)=>icon.sizes==="512x512"));
});

test("service worker preserva shell offline e exige confirmação para atualizar", async () => {
  const worker=await readFile(new URL("../public/sw.js",import.meta.url),"utf8");
  assert.match(worker,/caches\.open\(CACHE\)/);
  assert.match(worker,/SKIP_WAITING/);
  assert.match(worker,/request\.mode === "navigate"/);
  assert.doesNotMatch(worker,/addEventListener\("install"[^;]+skipWaiting/);
});
