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
const mage = read("public/game-lines/mage/data/conditions.json");
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
  assert.ok(manifest.catalogs["core-conditions"].version >= 3);
  assert.ok(manifest.catalogs["core-conditions-pt"].version >= 3);
});

test("Soulless retains verified neutral rules while Mage owns its Wisdom exception", () => {
  const shared = core.find(item => item.id === "soulless");
  const awakened = mage.find(item => item.id === "soulless");
  assert.equal(shared.sourceCode, "MTA 2e");
  assert.equal(shared.page, 318);
  assert.equal(shared.persistent, true);
  assert.match(shared.description, /surrender or rest.*Virtue and Vice.*1 Willpower per scene.*once per session.*Integrity breaking point with −5.*Integrity is already 1/);
  assert.match(shared.penalty, /−2.*possession/);
  assert.doesNotMatch(JSON.stringify({ ...shared, pt: presentation.soulless }), /Wisdom|Humanity|Gnosis|Clarity|Sabedoria|Humanidade|Lucidez/);
  assert.match(awakened.description, /Act of Hubris rolled with 1 die unless Wisdom is already 1/);
  assert.match(awakened.presentationPt.description, /Ato de Húbris.*1 dado.*Sabedoria.*1/);
  assert.deepEqual(awakened.nameQualifier, { "en-US": "Awakened", "pt-BR": "Desperto" });
});

test("Core snapshot and selected Condition details render every resolution/Beat in EN/PT without mutating saved selections", async () => {
  const selected = core.map(item => ({ id: item.id, persistent: Boolean(item.persistent), instanceId: `owned:${item.id}`, animalName: "Authored name" }));
  const before = JSON.stringify({ core, presentation, selected });
  for (const locale of ["en-US", "pt-BR", "en-US"]) {
    const vite = await createServer({ appType: "custom", configFile: false, root, resolve: { alias: { "@": root } }, server: { middlewareMode: true, hmr: false, ws: false }, optimizeDeps: { noDiscovery: true, include: [] }, plugins: [{ name: "condition-locale", enforce: "pre", transform(code, id) {
      const path = id.replaceAll("\\", "/");
      if (path.endsWith("/hooks/use-mobile.ts")) return "export let mobile = false; export const setTestMobile = value => { mobile = value; }; export const useIsMobile = () => mobile;";
      if (path.endsWith("/components/ui/tabs.tsx")) return code.replace("<TabsPrimitive.Content", "<TabsPrimitive.Content forceMount");
      if (locale === "pt-BR" && path.endsWith("/lib/i18n.tsx")) return code.replace('const serverLocale = ():Locale => "en-US";', 'const serverLocale = ():Locale => "pt-BR";');
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
      const { mageReferenceCatalogGroup } = await vite.ssrLoadModule("/game-lines/mage/catalogs/reference.ts");
      const mageCatalog = freezeCatalogData(await mageReferenceCatalogGroup.load({ getCatalog: async id => {
        assert.equal(id, "mage-conditions");
        return mage;
      } }));
      const { mageConditionPresentation } = await vite.ssrLoadModule("/game-lines/mage/condition-presentation.ts");
      const soulless = mageConditionPresentation(mageCatalog.find(item => item.id === "soulless"), locale);
      const { blankPrintCharacter } = await vite.ssrLoadModule("/app/workspace/blank-print-character.ts");
      const { MageCharacterPaper } = await vite.ssrLoadModule("/game-lines/mage/sheet-view.tsx");
      const { setTestMobile } = await vite.ssrLoadModule("/hooks/use-mobile.ts");
      const character = blankPrintCharacter("MtA");
      character.current_state.conditions = [{ id: "soulless", instanceId: "saved:soulless", persistent: true, notes: "Authored note" }];
      const saved = JSON.stringify({ character, mage });
      const catalogs = { get: id => ({ "core-reference": reference, "mage-reference": mageCatalog, "mage-spells": [], "mage-factions": [], "core-merits": [], "mage-merits": [] })[id] };
      const noMutation = () => { throw new Error("Render changed a saved character"); };
      for (const mobile of [false, true]) {
        setTestMobile(mobile);
        const sheet = renderToStaticMarkup(createElement(LanguageProvider, null, createElement(MageCharacterPaper, { character, catalogs, updateState: noMutation, updateSheet: noMutation })));
        for (const field of ["name", "description", "penalty", "resolution", "beat"])
          assert.ok(sheet.includes(escape(soulless[field])), `${locale}/${mobile ? "mobile" : "desktop"}: Mage Soulless ${field}`);
        assert.ok(sheet.includes(escape(`${soulless.name}(${soulless.nameQualifier[locale]})`)));
        assert.equal(JSON.stringify({ character, mage }), saved);
      }
      assert.equal(Object.isFrozen(mageCatalog.find(item => item.id === "soulless").presentationPt), true);
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
