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
const { withMeritPresentation, meritPresentation } = await vite.ssrLoadModule("/lib/merit-presentation.ts");
const { resolveMeritDefinition } = await vite.ssrLoadModule("/lib/merit-identity.ts");
const lines = [
  { id: "changeling", en: "Lost", pt: "Perdido" },
  { id: "mage", en: "Awakened", pt: "Desperto" },
  { id: "vampire", en: "Kindred", pt: "Membro" },
];
const core = read("public/shared/data/conditions.json");
const all = [...core, ...lines.flatMap(line => read(`public/game-lines/${line.id}/data/conditions.json`).map(item => ({ ...item, line: line.id })))];
const merits = [
  ...withMeritPresentation(read("public/shared/data/merits.json"), read("public/shared/data/merits-pt.json")),
  ...withMeritPresentation(read("public/game-lines/changeling/data/merits.json"), read("public/game-lines/changeling/data/merits-pt.json")),
  ...read("public/game-lines/mage/data/merits.json"),
  ...read("public/game-lines/mage/data/merits-supplements.json"),
  ...read("public/game-lines/vampire/data/merits.json"),
  ...read("public/game-lines/werewolf/data/merits.json"),
];

test("only the five mechanically different Merit homonyms receive bilingual qualifiers; equivalent Cult benefits stay unqualified", () => {
  const expected = [
    "ctl-2ed:acute-senses", "vtr-acute-senses",
    "ctl-2ed:noblesse-oblige", "vtr-sotc:noblesse-oblige",
    "ctl-2ed:touchstone", "vtr-touchstone",
    "h-courts:friends-in-low-places", "vtr-gttn:friends-in-low-places",
    "mta-2ed:occultation", "vtr-strange-shades:occultation",
  ];
  assert.deepEqual(merits.filter(item => item.nameQualifier).map(item => item.id).sort(), expected.sort());
  const groups = Map.groupBy(merits, item => item.name);
  for (const name of ["Acute Senses", "Noblesse Oblige", "Touchstone", "Friends in Low Places", "Occultation"]) {
    const records = groups.get(name);
    assert.equal(records.length, 2);
    assert.equal(new Set(records.map(item => item.line)).size, 2);
    for (const item of records) {
      const before = JSON.stringify(item);
      const [en, pt] = item.line === "CtL" ? ["Lost", "Perdido"] : item.line === "MtA" ? ["Awakened", "Desperto"] : ["Kindred", "Membro"];
      assert.deepEqual(item.nameQualifier, { "en-US": en, "pt-BR": pt });
      for (const locale of ["en-US", "pt-BR"]) {
        const presented = meritPresentation(item, locale);
        assert.equal(presented.name, `${locale === "pt-BR" ? item.presentationPt?.name || item.translatedName || item.name : item.name}(${locale === "pt-BR" ? pt : en})`);
        assert.equal(presented.description, locale === "pt-BR" ? item.presentationPt?.description || item.description : item.descriptionEn || item.description);
        assert.deepEqual(presented.levels, locale === "pt-BR" ? item.presentationPt?.levels ?? item.levels : item.levels);
        assert.equal(resolveMeritDefinition({ definitionId: item.id, name: presented.name }, [...records].reverse()), item);
        assert.equal(resolveMeritDefinition({ definitionId: "unavailable:id", name: presented.name }, records), undefined);
      }
      assert.equal(JSON.stringify(item), before);
    }
  }
  const influence = groups.get("Mystery Cult Influence");
  assert.equal(influence.length, 2);
  assert.deepEqual(influence[0].ratings, influence[1].ratings);
  for (const item of influence) {
    assert.equal(item.nameQualifier, undefined);
    assert.equal(meritPresentation(item, "en-US").name, "Mystery Cult Influence");
  }
  assert.equal(merits.find(item => item.id === "h-courts:friends-in-low-places").sourceId, "h-courts");
  assert.equal(merits.find(item => item.id === "vtr-strange-shades:occultation").homebrew, true);
  const manifest = read("public/shared/data/catalog-manifest.json");
  assert.ok(manifest.catalogs["merits-changeling"].version >= 3);
  assert.ok(manifest.catalogs["merits-mage"].version >= 3);
  assert.ok(manifest.catalogs["merits-vampire"].version >= 12);
});

test("Merit Builder, XP selections, purchase previews and semantic histories show EN/PT qualifiers without persisting them", async () => {
  for (const locale of ["en-US", "pt-BR"]) {
    const server = locale === "en-US" ? vite : await createServer({ ...options, plugins: [{ name: "portuguese-merit-snapshot", enforce: "pre", transform(code, id) {
      if (id.replaceAll("\\", "/").endsWith("/lib/i18n.tsx")) return code.replace('const serverLocale = ():Locale => "en-US";', 'const serverLocale = ():Locale => "pt-BR";');
    } }] });
    try {
      const { MeritPicker } = await server.ssrLoadModule("/app/builder/merit-picker.tsx");
      const { ExperienceMeritPicker } = await server.ssrLoadModule("/app/workspace/experience-shared.tsx");
      const { purchasePreview } = await server.ssrLoadModule("/game-lines/changeling/experience-shared.tsx");
      const { mageExperienceLabel } = await server.ssrLoadModule("/game-lines/mage/experience-presentation.ts");
      const { vampireExperienceLabel } = await server.ssrLoadModule("/game-lines/vampire/experience-presentation.ts");
      const { blankPrintCharacter } = await server.ssrLoadModule("/app/workspace/blank-print-character.ts");
      const { LanguageProvider } = await server.ssrLoadModule("/lib/i18n.tsx");
      for (const definition of merits.filter(item => item.nameQualifier)) {
        const catalog = [definition];
        const selected = { definitionId: definition.id, instanceId: "purchased", name: "Old label", dots: 1, creationDots: 0, experienceDots: 1, configuration: {} };
        const character = { ...blankPrintCharacter(definition.line), merits: [selected] };
        const receipt = { id: "transaction", rating: 1, regular: 1, arcane: 0, cost: 1, createdAt: "2026-10-03", undo: { kind: "merit", definitionId: definition.id, instanceId: selected.instanceId, name: definition.name, dots: 1 } };
        const before = JSON.stringify({ character, receipt, catalog });
        const name = meritPresentation(definition, locale).name;
        const elements = [
          createElement(MeritPicker, { merits: [selected], setMerits: () => { throw new Error("Render mutated Merit"); }, catalog, context: { gameLine: definition.line, merits: [selected] }, spent: 0, budget: 10, renderConfiguration: () => null, isInlineConfiguration: () => false }),
          createElement(ExperienceMeritPicker, { line: definition.line, context: { gameLine: definition.line, attributes: character.attributes, skills: character.skills, merits: character.merits, meritCatalog: catalog }, meritCatalog: catalog, character, selectedId: definition.id, targetDots: 1, onSelect: () => { throw new Error("Render purchased Merit"); } }),
        ];
        for (const element of elements) {
          const html = renderToStaticMarkup(createElement(LanguageProvider, null, element));
          assert.ok(html.includes(name), `${locale}: ${definition.id}`);
          assert.ok(!html.includes("Old label"));
        }
        if (definition.line === "CtL") assert.equal(purchasePreview({ locale, purchaseType: "merit", character, selectedMerit: definition, nextMeritRating: 2, ownedMerit: selected }).label, `${name} 2`);
        if (definition.line === "MtA") assert.equal(mageExperienceLabel(receipt, character, catalog, [], locale), `${name} 1`);
        if (definition.line === "VtR") assert.equal(vampireExperienceLabel(receipt, character, catalog, {}, locale), `${name} 1`);
        assert.equal(JSON.stringify({ character, receipt, catalog }), before);
      }
    } finally {
      if (server !== vite) await server.close();
    }
  }
});

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
