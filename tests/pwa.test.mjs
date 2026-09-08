import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";

test("declara uma PWA standalone com ícones Android", async () => {
  const manifest=JSON.parse(await readFile(new URL("../public/manifest.webmanifest",import.meta.url),"utf8"));
  assert.equal(manifest.display,"standalone");
  assert.equal(manifest.name,"Characters of the Darkness");
  assert.equal(manifest.short_name,"Characters of the Darkness");
  assert.equal(manifest.background_color,"#1b111f");
  assert.equal(manifest.start_url,"/");
  assert.ok(manifest.icons.some((icon)=>icon.sizes==="192x192"));
  assert.ok(manifest.icons.some((icon)=>icon.sizes==="512x512"));
});

test("apresenta uma abertura de aplicativo alinhada à nova marca", async () => {
  const [layout,css]=await Promise.all([
    readFile(new URL("../app/layout.tsx",import.meta.url),"utf8"),
    readFile(new URL("../app/globals.css",import.meta.url),"utf8"),
  ]);
  assert.match(layout,/Characters of the Darkness/);
  assert.match(layout,/app-launch-splash/);
  assert.match(css,/display-mode:standalone/);
  assert.match(css,/radial-gradient/);
});

test("mantém a ficha móvel compacta e os contratos expansíveis sem botões em todas as telas", async () => {
  const [workspace,css]=await Promise.all([
    readFile(new URL("../app/workspace.tsx",import.meta.url),"utf8"),
    readFile(new URL("../app/globals.css",import.meta.url),"utf8"),
  ]);
  assert.match(workspace,/value: "stats", label: "Stats"/);
  assert.match(workspace,/mobile-attribute-grid/);
  assert.match(workspace,/values=\{mountAttributes\} compactNames=\{isMobile\}/);
  assert.match(workspace,/<details className="contract-power-card"/);
  assert.match(workspace,/<summary className="contract-power-summary">/);
  assert.match(workspace,/systemTerm\(definition\.regalia,locale\).*definition\.source/);
  assert.doesNotMatch(workspace,/if \(!isMobile\).*contract-power/);
  assert.match(css,/\.contract-power-card \{/);
  assert.match(css,/\.contract-power-list \{[^}]*align-items:start/);
});

test("não oferece prévia, impressão ou árvore duplicada para PDF", async () => {
  const [workspace,css]=await Promise.all([
    readFile(new URL("../app/workspace.tsx",import.meta.url),"utf8"),
    readFile(new URL("../app/globals.css",import.meta.url),"utf8"),
  ]);
  assert.doesNotMatch(workspace,/window\.print|printLayout|pdf-preview|pdf-print-source|Preview PDF|Print PDF/);
  assert.doesNotMatch(css,/pdf-preview|pdf-print-source|print-layout|@media print/);
});

test("service worker preserva shell offline e exige confirmação para atualizar", async () => {
  const worker=await readFile(new URL("../public/sw.js",import.meta.url),"utf8");
  assert.match(worker,/caches\.open\(CACHE\)/);
  assert.match(worker,/SKIP_WAITING/);
  assert.match(worker,/request\.mode === "navigate"/);
  assert.doesNotMatch(worker,/addEventListener\("install"[^;]+skipWaiting/);
});

test("aviso offline pode ser fechado durante toda a sessão", async () => {
  const manager=await readFile(new URL("../app/pwa-manager.tsx",import.meta.url),"utf8");
  assert.match(manager,/sessionStorage\.setItem\(DISMISSED_KEY,"1"\)/);
  assert.match(manager,/type="button" className="pwa-dismiss"/);
});
