import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { createServer } from "vite";

const root = fileURLToPath(new URL("..", import.meta.url));
const read = path => JSON.parse(readFileSync(new URL(`../${path}`, import.meta.url), "utf8"));
const core = read("public/shared/data/conditions.json");
const presentation = read("public/shared/data/conditions-pt.json");
const escape = value => value.replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#x27;" })[char]);

test("all Core Conditions have complete Portuguese presentation without overriding canonical identity or mechanics", () => {
  assert.deepEqual(Object.keys(presentation).sort(), core.map(item => item.id).sort());
  for (const item of core) {
    const pt = presentation[item.id];
    assert.deepEqual(Object.keys(pt).filter(key => !["name", "category", "description", "penalty", "resolution", "beat"].includes(key)), []);
    for (const field of ["name", "category", "description", "resolution", ...(item.penalty ? ["penalty"] : []), ...(item.beat ? ["beat"] : [])])
      assert.ok(pt[field]?.trim(), `${item.id}.${field}`);
    assert.equal(Boolean(pt.beat), Boolean(item.beat), `${item.id}: no invented Beat`);
    assert.equal(pt.category, { Mental: "Mental", Physical: "Física", Social: "Social", Supernatural: "Sobrenatural" }[item.category]);
  }
  assert.doesNotMatch(JSON.stringify(presentation), /\b(?:Conditions?|Beats?|Breaking Point|Clarity|Trato com Animais|Resolve|Composure|Stamina)\b/);
  assert.match(presentation.bonded.penalty, /Empatia com Animais/);
  assert.match(presentation["reluctant-aggressor"].resolution, /não concede um Ato/);
  const manifest = read("public/shared/data/catalog-manifest.json");
  assert.equal(manifest.catalogs["core-conditions"].version, 1);
  assert.ok(manifest.catalogs["core-conditions-pt"].version >= 3);
});

test("Core snapshot and selected Condition details render every resolution/Beat in EN/PT without mutating saved selections", async () => {
  const selected = core.map(item => ({ id: item.id, persistent: Boolean(item.persistent), instanceId: `owned:${item.id}`, animalName: "Authored name" }));
  const before = JSON.stringify({ core, presentation, selected });
  for (const locale of ["en-US", "pt-BR", "en-US"]) {
    const vite = await createServer({ appType: "custom", configFile: false, root, resolve: { alias: { "@": root } }, server: { middlewareMode: true, hmr: false, ws: false }, optimizeDeps: { noDiscovery: true, include: [] }, plugins: [{ name: "condition-locale", enforce: "pre", transform(code, id) {
      if (locale === "pt-BR" && id.replaceAll("\\", "/").endsWith("/lib/i18n.tsx")) return code.replace('const serverLocale = ():Locale => "en-US";', 'const serverLocale = ():Locale => "pt-BR";');
    } }] });
    try {
      const { coreReferenceCatalogGroup } = await vite.ssrLoadModule("/game-lines/core/catalogs/reference.ts");
      const { freezeCatalogData } = await vite.ssrLoadModule("/lib/catalog/catalog-service.ts");
      const reference = freezeCatalogData(await coreReferenceCatalogGroup.load({ getCatalog: async id => ({ "core-conditions": core, "core-conditions-pt": presentation })[id] }));
      const catalog = reference.conditions.map(item => locale === "pt-BR" ? { ...item, ...reference.presentation[item.id] } : item);
      const { ConditionManager } = await vite.ssrLoadModule("/app/workspace/condition-manager.tsx");
      const { LanguageProvider } = await vite.ssrLoadModule("/lib/i18n.tsx");
      const html = renderToStaticMarkup(createElement(LanguageProvider, null, createElement(ConditionManager, { selected, catalog, onChange: () => { throw new Error("Render changed a saved selection"); } })));
      for (const item of catalog) {
        for (const field of ["name", "description", "resolution", ...(item.penalty ? ["penalty"] : []), ...(item.beat ? ["beat"] : [])])
          assert.ok(html.includes(escape(item[field])), `${locale}: ${item.id}.${field}`);
        assert.equal(item.id, core.find(canonical => canonical.id === item.id).id);
      }
      assert.equal(JSON.stringify({ core, presentation, selected }), before);
      assert.equal(Object.isFrozen(reference.conditions), true);
    } finally { await vite.close(); }
  }
});

test("Mortal, Mage and Vampire sheet composition applies Core presentation to the catalog used by Desktop and Mobile", () => {
  for (const line of ["mortal", "mage", "vampire"]) {
    const source = readFileSync(new URL(`../game-lines/${line}/sheet-view.tsx`, import.meta.url), "utf8");
    assert.match(source, /locale === "pt-BR" \? \{ \.\.\.condition, .*presentation\[condition.id\]/);
    assert.match(source, /catalog=\{conditionCatalog\}/);
  }
});
