import assert from "node:assert/strict";
import test, { after } from "node:test";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { createServer } from "vite";

const root = fileURLToPath(new URL("..", import.meta.url));
const read = path => JSON.parse(readFileSync(new URL(`../${path}`, import.meta.url), "utf8"));
const options = { appType: "custom", configFile: false, root, resolve: { alias: { "@": root } }, server: { middlewareMode: true, hmr: false, ws: false }, optimizeDeps: { noDiscovery: true, include: [] } };
const vite = await createServer(options);
after(() => vite.close());
const { catalogDisplayName, qualifyCatalogName, localizeCatalogItem } = await vite.ssrLoadModule("/lib/localized-catalog.ts");
const { TILTS } = await vite.ssrLoadModule("/lib/tilts.ts");
const lines = [
  { id: "changeling", en: "Lost", pt: "Perdido" },
  { id: "mage", en: "Awakened", pt: "Desperto" },
  { id: "vampire", en: "Kindred", pt: "Membro" },
];
const core = read("public/shared/data/conditions.json");
const all = [...core, ...lines.flatMap(line => read(`public/game-lines/${line.id}/data/conditions.json`).map(item => ({ ...item, line: line.id })))];

test("exactly six cross-line Condition homonyms have bilingual presentation qualifiers, without changing canonical names", () => {
  const groups = Map.groupBy(all, item => item.originalName);
  const collisions = [...groups].filter(([, items]) => new Set(items.map(item => item.line)).size > 1);
  assert.deepEqual(collisions.map(([name]) => name).sort(), ["Addicted", "Charmed", "Humbled", "Lethargic", "Oathbreaker", "Thrall"]);
  assert.equal(all.filter(item => item.nameQualifier).length, 12);
  for (const item of all) {
    if (new Set(groups.get(item.originalName).map(other => other.line)).size > 1) {
      assert.equal(item.name, item.originalName);
      const line = lines.find(line => line.id === item.line);
      assert.deepEqual(item.nameQualifier, { "en-US": line.en, "pt-BR": line.pt });
      assert.equal(catalogDisplayName(item, "en-US"), `${item.originalName}(${line.en})`);
      assert.equal(catalogDisplayName(item, "pt-BR"), `${item.name}(${line.pt})`);
    } else {
      assert.equal(item.nameQualifier, undefined, item.id);
      assert.equal(qualifyCatalogName(item.name, item, "en-US"), item.name);
    }
  }
});

test("qualifiers localize presentation only and never manufacture a missing English label", () => {
  const item = { id: "charmed", name: "Charmed", originalName: "Charmed", translatedName: "Encantado", description: "Portuguese effect", nameQualifier: { "en-US": "Awakened", "pt-BR": "Desperto" } };
  const before = JSON.stringify(item);
  assert.equal(catalogDisplayName(item, "pt-BR"), "Encantado(Desperto)");
  assert.equal(catalogDisplayName(item, "en-US"), "Charmed(Awakened)");
  assert.equal(localizeCatalogItem(item, "en-US", { fields: ["description"], english: { charmed: { description: "English effect" } } }).name, "Charmed(Awakened)");
  assert.equal(localizeCatalogItem(item, "pt-BR", { fields: ["description"] }).name, "Encantado(Desperto)");
  assert.equal(catalogDisplayName({ id: "authored", name: "Portuguese-only name", nameQualifier: item.nameQualifier }, "en-US"), "");
  assert.equal(JSON.stringify(item), before);
});

test("the complete Tilt catalog currently has no homonyms and receives no indiscriminate line suffixes", () => {
  assert.equal(TILTS.length, 35);
  assert.equal(new Set(TILTS.map(item => item.name)).size, TILTS.length);
  for (const item of TILTS) {
    assert.equal(item.nameQualifier, undefined);
    assert.equal(catalogDisplayName(item, "en-US"), item.name);
    assert.equal(catalogDisplayName(item, "pt-BR"), item.translatedName);
  }
});

test("Condition selection rows and removal labels render the owning qualifier in EN/PT without mutating selections", async () => {
  for (const locale of ["en-US", "pt-BR"]) {
    const server = locale === "en-US" ? vite : await createServer({ ...options, plugins: [{ name: "portuguese-condition-snapshot", enforce: "pre", transform(code, id) {
      if (id.replaceAll("\\", "/").endsWith("/lib/i18n.tsx")) return code.replace('const serverLocale = ():Locale => "en-US";', 'const serverLocale = ():Locale => "pt-BR";');
    } }] });
    try {
      const { ConditionManager } = await server.ssrLoadModule("/app/workspace/condition-manager.tsx");
      const { LanguageProvider } = await server.ssrLoadModule("/lib/i18n.tsx");
      for (const line of lines) {
        const catalog = read(`public/game-lines/${line.id}/data/conditions.json`);
        const presentation = line.id === "changeling" && locale === "pt-BR" ? read("public/game-lines/changeling/data/conditions-pt.json") : {};
        const records = catalog.filter(item => item.nameQualifier || item.name.includes("Errata")).map(item => ({ ...item, ...presentation[item.id] }));
        const selected = records.map((item, index) => ({ id: item.id, persistent: Boolean(item.persistent), instanceId: `${line.id}-${index}` }));
        const before = JSON.stringify({ catalog, records, selected });
        const html = renderToStaticMarkup(createElement(LanguageProvider, null, createElement(ConditionManager, { selected, catalog: records, onChange: () => { throw new Error("Render mutated selection"); } })));
        for (const item of records) {
          const name = qualifyCatalogName(item.name, item, locale);
          assert.ok(html.includes(`<strong>${name}`), `${locale}: ${name}`);
          assert.ok(html.includes(name + '"'), `${locale}: removal label ${name}`);
          const description = item.description.replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#x27;" })[char]);
          assert.ok(html.includes(description), item.id);
        }
        assert.equal(JSON.stringify({ catalog, records, selected }), before);
      }
    } finally {
      if (server !== vite) await server.close();
    }
  }
});
