import assert from "node:assert/strict";
import test, { after } from "node:test";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { createServer } from "vite";

const root = fileURLToPath(new URL("..", import.meta.url));
const vite = await createServer({ appType: "custom", configFile: false, root,
  resolve: { alias: { "@": root } }, server: { middlewareMode: true, hmr: false, ws: false },
  optimizeDeps: { noDiscovery: true, include: [] } });
after(() => vite.close());
const read = path => JSON.parse(readFileSync(new URL(`../${path}`, import.meta.url), "utf8"));
const core = read("public/shared/data/merits.json");
const ct = read("public/game-lines/changeling/data/merits.json");
const mt = read("public/game-lines/mage/data/merits.json");
const common = await vite.ssrLoadModule("/app/workspace/merit-configuration-presentation.ts");
const changeling = await vite.ssrLoadModule("/game-lines/changeling/sheet-merit-configurations.ts");
const mage = await vite.ssrLoadModule("/game-lines/mage/sheet-merit-configurations.ts");

test("Core configuration presentation dispatches canonical IDs, never labels", () => {
  const value = { groups: ["Authored contact"] }, before = structuredClone(value);
  for (const locale of ["en-US", "pt-BR"]) {
    assert.ok(common.commonExpandedConfigurationLines("core-2ed:contacts", 1, value, locale)[0].endsWith(": Authored contact"));
    for (const id of ["Contacts", "Contatos", "homebrew:contacts", "unavailable:contacts", undefined])
      assert.equal(common.commonExpandedConfigurationLines(id, 1, value, locale), undefined);
  }
  assert.deepEqual(value, before);
});

test("line configuration summaries and metadata are ID-keyed, including Mage's own Cult adapter", () => {
  for (const locale of ["en-US", "pt-BR"]) {
    assert.equal(mage.expandedConfigurationLines("mta-2ed:artifact", 3, {}, locale).length, 2);
    assert.equal(mage.expandedConfigurationLines("mta-signs:mana-battery", 3, {}, locale).length, 1);
    assert.ok(mage.expandedConfigurationLines("mta-2ed:mystery-cult-influence", 3, { cult: "Authored" }, locale)[0].endsWith(": Authored"));
    assert.ok(changeling.expandedConfigurationLines("ctl-2ed:workshop", 3, { specialties: ["Authored"] }, locale)[0].endsWith(": Authored"));
    for (const id of ["Artifact", "homebrew:artifact", undefined]) assert.deepEqual(mage.expandedConfigurationLines(id, 3, {}, locale), []);
    for (const id of ["Token", "homebrew:token", undefined]) assert.deepEqual(changeling.expandedConfigurationLines(id, 3, { items: ["{}"] }, locale), []);
  }
  assert.equal(changeling.findMeritConfiguration("ctl-2ed:token").id, "ctl-2ed:token");
  assert.equal(changeling.findMeritConfiguration("Token"), undefined);
  assert.equal(mage.findMeritConfiguration("Familiar"), undefined);
});

test("companion surfaces accept renamed canonical selections but reject explicit namesakes and ambiguous legacy choices", async () => {
  const { LanguageProvider } = await vite.ssrLoadModule("/lib/i18n.tsx");
  for (const [line, catalog, id, canonicalName] of [
    ["changeling", [...core, ...ct], "h-seemings:fae-pet", "Fae Pet"],
    ["mage", [...core, ...mt], "mta-2ed:familiar", "Familiar"],
  ]) {
    const { CompanionPage } = await vite.ssrLoadModule(`/game-lines/${line}/companion-page.tsx`);
    const definition = catalog.find(item => item.id === id);
    const custom = { ...definition, id: "homebrew:namesake", sourceId: "homebrew", source: "Authored" };
    const selection = { definitionId: id, instanceId: "official", name: "Renamed label", dots: 2, sourceId: definition.sourceId, configuration: { name: "Canonical companion" } };
    const character = { merits: [selection,
      { ...selection, definitionId: custom.id, instanceId: "custom", name: canonicalName, configuration: { name: "Namesake companion" } },
      { ...selection, definitionId: "unavailable:id", instanceId: "missing", name: canonicalName, configuration: { name: "Missing companion" } },
      { ...selection, definitionId: undefined, instanceId: "ambiguous", name: canonicalName, sourceId: undefined, configuration: { name: "Ambiguous companion" } },
    ] };
    const before = structuredClone(character);
    const html = renderToStaticMarkup(createElement(LanguageProvider, null,
      createElement(CompanionPage, { character, catalog: [...catalog, custom], updateSheet: () => assert.fail("render mutated data") })));
    assert.match(html, /Canonical companion/);
    assert.doesNotMatch(html, /Namesake companion|Missing companion|Ambiguous companion/);
    assert.deepEqual(character, before);
  }
});

test("configuration helpers no longer accept a display name as their dispatch identity", () => {
  for (const path of ["app/workspace/merit-configuration-presentation.ts",
    "game-lines/changeling/sheet-merit-configurations.ts", "game-lines/mage/sheet-merit-configurations.ts"]) {
    const source = readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
    assert.doesNotMatch(source, /if\s*\(name\s*===|item\.name === name/);
  }
  const picker = readFileSync(new URL("../app/builder/merit-picker.tsx", import.meta.url), "utf8");
  assert.match(picker, /needsConfirmation = confirmRemoval\(definition\)/);
  assert.doesNotMatch(picker, /Fae Mount|Fae Pet|Familiar|Entitlement/);
});
