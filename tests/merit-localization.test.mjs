import assert from "node:assert/strict";
import test, { after } from "node:test";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { createServer } from "vite";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

const root = fileURLToPath(new URL("..", import.meta.url));
const json = async (path) => JSON.parse(await readFile(new URL(`../${path}`, import.meta.url), "utf8"));
const vite = await createServer({ appType: "custom", configFile: false, root, resolve: { alias: { "@": root } }, server: { middlewareMode: true, hmr: false }, optimizeDeps: { noDiscovery: true, include: [] } });
after(async () => vite.close());
const { meritPresentation, withMeritPresentation } = await vite.ssrLoadModule("/lib/merit-presentation.ts");
const { meritPrerequisitesMet } = await vite.ssrLoadModule("/lib/merits.ts");
const core = await json("public/shared/data/merits.json");
const changeling = await json("public/game-lines/changeling/data/merits.json");
const corePt = await json("public/shared/data/merits-pt.json");
const changelingPt = await json("public/game-lines/changeling/data/merits-pt.json");

test("mortal-only Merits are blocked in supernatural builders and experience, independently of locale", async () => {
  const { meritSelectionProblems, meritContextForSheet } = await vite.ssrLoadModule("/lib/merits.ts");
  const { meritProblemMessage } = await vite.ssrLoadModule("/lib/merit-ui.ts");
  const catalog = withMeritPresentation(core, corePt);
  const restricted = catalog.filter((item) => item.mortalOnly);
  assert.equal(restricted.length, 48);
  for (const definition of restricted) {
    assert.match(meritPresentation(definition, "pt-BR").prerequisites, /^Somente mortais\b/);
    for (const gameLine of ["CtL", "MtA", "VtR"]) {
      const context = meritContextForSheet({ game_line: gameLine, attributes: {}, skills: {}, merits: [], line_data: {} }, catalog);
      assert.equal(meritPrerequisitesMet(definition, context), false, definition.id);
      assert.ok(meritSelectionProblems(definition, { dots: definition.ratings[0] }, context).length, definition.id);
    }
  }
  const automaticWriting = catalog.find((item) => item.id === "core-2ed:automatic-writing");
  assert.equal(meritPrerequisitesMet(automaticWriting, { gameLine: "CofD" }), true);
  assert.equal(meritPrerequisitesMet({ ...automaticWriting, descriptivePrerequisites: true }, { gameLine: "CtL" }), false);
  const [problem] = meritSelectionProblems(automaticWriting, { dots: 2 }, { gameLine: "CtL" });
  assert.equal(meritProblemMessage(problem, automaticWriting, "pt-BR"), "Pré-requisitos não atendidos: Somente mortais");
  assert.equal(meritProblemMessage(problem, automaticWriting, "en-US"), "Prerequisites not met: Mortal only");
  assert.equal(meritPrerequisitesMet(catalog.find((item) => item.id === "core-2ed:esoteric-armory"), { gameLine: "CtL" }), true);
});

test("pt-BR Merit records reference canonical IDs and cover every translated field and level", () => {
  assert.equal(Object.keys(corePt).length, 202);
  assert.deepEqual(Object.keys(corePt).sort(), core.map((item) => item.id).sort());
  assert.equal(Object.keys(changelingPt).length, 154);
  assert.deepEqual(Object.keys(changelingPt).sort(), changeling.map((item) => item.id).sort());
  for (const [catalog, portuguese] of [[core, corePt], [changeling, changelingPt]]) {
    for (const [id, presented] of Object.entries(portuguese)) {
      const canonical = catalog.find((item) => item.id === id);
      assert.ok(canonical, id);
      assert.ok(presented.name.trim() && presented.description.trim(), id);
      for (const field of ["prerequisites", "alternativePrerequisites"].filter((key) => canonical[key])) {
        assert.ok(presented[field]?.trim(), `${id}.${field}`);
      }
      assert.deepEqual(presented.levels?.map((level) => level.rating), canonical.levels?.map((level) => level.rating), id);
      for (const level of presented.levels ?? []) assert.ok(level.name.trim() && level.description.trim(), id);
      assert.deepEqual(Object.keys(presented).filter((key) => !["name", "description", "prerequisites", "alternativePrerequisites", "levels"].includes(key)), [], id);
    }
  }
  assert.doesNotMatch(JSON.stringify(changelingPt), /\b(?:Wyrd|Clarity|Hedge|Kith|Huntsman|Huntsmen|Motley|Autocontrole)\b/);
  assert.doesNotMatch(JSON.stringify(corePt), /\b(?:Willpower|Resolve|Composure|Stamina|Wits|Weaponry|Brawl|Streetwise|Firearms|Wyrd|Clarity|Huntsman|Huntsmen)\b/);
  assert.match(changelingPt["ctl-2ed:brownie-s-boon"].description, /um oitavo/);
  assert.match(changelingPt["ctl-2ed:court-goodwill"].description, /ambas diminuem em um ponto/);
});

test("switching Merit locale changes presentation, never eligibility or canonical identities", () => {
  const before = structuredClone(changeling);
  const catalog = withMeritPresentation(changeling, changelingPt);
  const acute = catalog.find((item) => item.id === "ctl-2ed:acute-senses");
  assert.equal(meritPresentation(acute, "pt-BR").name, "Sentidos Aguçados(Perdido)");
  assert.equal(meritPresentation(acute, "en-US").name, "Acute Senses(Lost)");
  assert.equal(meritPresentation(acute, "en-US").description, acute.descriptionEn);
  assert.equal(acute.prerequisites, "Wits or Composure •••");
  assert.equal(meritPrerequisitesMet(acute, { gameLine: "CtL", attributes: { Wits: 3 } }), true);
  assert.equal(meritPrerequisitesMet(acute, { gameLine: "CtL", attributes: { Wits: 2, Composure: 2 } }), false);
  for (const [definitions, portuguese] of [[core, corePt], [changeling, changelingPt]]) {
    const localized = withMeritPresentation(definitions, portuguese);
    for (let index = 0; index < localized.length; index++) {
      const canonical = Object.fromEntries(Object.entries(localized[index]).filter(([key]) => !["presentationPt", "translatedName"].includes(key)));
      const original = Object.fromEntries(Object.entries(definitions[index]).filter(([key]) => key !== "translatedName"));
      assert.deepEqual(canonical, original);
    }
  }
  assert.deepEqual(changeling, before);
  const defense = withMeritPresentation(core, corePt).find((item) => item.id === "core-2ed:armed-defense");
  assert.equal(meritPresentation(defense, "pt-BR").levels[0].name, "Cobrir os Ângulos");
  assert.equal(meritPresentation(defense, "en-US").levels[0].name, "Cover the Angles");
  assert.equal(defense.levels[0].name, "Cover the Angles");
});

test("missing pt-BR Merit entries explicitly retain English and user-authored text", async () => {
  const untranslated = withMeritPresentation([{ ...core[0], id: "test:untranslated-merit", translatedName: undefined }], corePt)[0];
  assert.deepEqual(meritPresentation(untranslated, "pt-BR"), meritPresentation(untranslated, "en-US"));
  const { normalizeMeritHomebrew, activeMeritCatalog } = await vite.ssrLoadModule("/lib/merit-homebrews.ts");
  const custom = normalizeMeritHomebrew({ id: "homebrew:merit:test", name: "Meu Mérito", line: "Core", category: "Mental", ratings: [1], description: "Texto escrito pelo jogador." });
  assert.deepEqual(meritPresentation(custom, "pt-BR"), meritPresentation(custom, "en-US"));
  const base = withMeritPresentation(core, corePt).find((item) => item.name === "Area of Expertise");
  const errata = { ...custom, id: "homebrew:merit:errata", errataFor: base.id };
  const replaced = activeMeritCatalog([base], [errata], { disabledIds: [] })[0];
  assert.equal(meritPresentation(replaced, "pt-BR").description, custom.description);
  assert.equal(replaced.presentationPt, undefined);
});

test("Changeling-accessible Mage and Vampire merits are translated as shared Core content", () => {
  const shared = core.filter((item) => item.sourceId === "mta-2ed" || item.sourceId.startsWith("h-vtr-"));
  assert.equal(shared.length, 16);
  for (const item of shared) {
    assert.equal(item.line, "Core");
    assert.ok(corePt[item.id], item.id);
  }
  assert.equal(corePt["mta-2ed:advanced-library"].name, "Biblioteca Avançada");
  assert.equal(corePt["h-vtr-fire-revolution:rules-lawyer"].name, "Advogado de Regras");
  assert.match(corePt["mta-2ed:advanced-library"].description, /Condição Informado/);
});

test("Merit groups load only their own canonical and presentation catalogs into frozen snapshots", async () => {
  const manifest = await json("public/shared/data/catalog-manifest.json");
  const requests = [];
  const reader = { getCatalog: async (id) => { requests.push(id); return json(`public${manifest.catalogs[id].url}`); } };
  const { coreMeritsCatalogGroup } = await vite.ssrLoadModule("/game-lines/core/catalogs/merits.ts");
  const { changelingMeritsCatalogGroup } = await vite.ssrLoadModule("/game-lines/changeling/catalogs/merits.ts");
  const { freezeCatalogData } = await vite.ssrLoadModule("/lib/catalog/catalog-service.ts");
  const snapshot = freezeCatalogData([await coreMeritsCatalogGroup.load(reader), await changelingMeritsCatalogGroup.load(reader)]);
  assert.deepEqual(requests.sort(), ["merits-changeling", "merits-changeling-pt", "merits-core", "merits-core-pt"]);
  assert.ok(Object.isFrozen(snapshot[0][0].presentationPt));
  assert.ok(Object.isFrozen(snapshot[0].find((item) => item.name === "Armed Defense").presentationPt.levels));
});

test("Core and Changeling Merit categories use dictionaries without translating custom categories", async () => {
  const { meritCategoryLabel } = await vite.ssrLoadModule("/lib/merit-ui.ts");
  const { messages } = await vite.ssrLoadModule("/lib/i18n.tsx");
  for (const category of new Set([...core, ...changeling].map((item) => item.category))) {
    for (const locale of ["pt-BR", "en-US"]) {
      assert.equal(meritCategoryLabel(category, locale), messages[locale].meritCategories[category]);
    }
  }
  assert.equal(meritCategoryLabel("Fighting Styles", "pt-BR"), "Estilos de Combate");
  assert.equal(meritCategoryLabel("Changeling Seemings", "pt-BR"), "Feições Changeling");
  for (const locale of ["pt-BR", "en-US"]) assert.equal(meritCategoryLabel("Minha categoria", locale), "Minha categoria");
  for (const path of ["app/builder/merit-picker.tsx", "app/workspace/experience-shared.tsx", "app/merit-homebrew-panel.tsx"]) {
    assert.match(await readFile(new URL(`../${path}`, import.meta.url), "utf8"), /meritCategoryLabel\(/, path);
  }
});

test("Builder and Experience selected Merit names retain canonical identity and locale presentation", async () => {
  const { LanguageProvider } = await vite.ssrLoadModule("/lib/i18n.tsx");
  const { MeritPicker } = await vite.ssrLoadModule("/app/builder/merit-picker.tsx");
  const { ExperienceMeritPicker } = await vite.ssrLoadModule("/app/workspace/experience-shared.tsx");
  const { blankPrintCharacter } = await vite.ssrLoadModule("/app/workspace/blank-print-character.ts");
  const catalog = withMeritPresentation(changeling, changelingPt);
  const definition = catalog.find((item) => item.id === "h-seemings:meat-shield");
  const character = { ...blankPrintCharacter("CtL"), merits: [{ name: definition.name, dots: 2, sourceId: definition.sourceId, source: definition.source, configuration: {} }] };
  const before = structuredClone(character);
  const picker = createElement(MeritPicker, { merits: character.merits, setMerits: () => {}, catalog, context: { gameLine: "CtL", merits: [] }, spent: 2, budget: 10, renderConfiguration: () => null, isInlineConfiguration: () => false });
  const experience = createElement(ExperienceMeritPicker, { line: "CtL", context: { gameLine: "CtL", attributes: character.attributes, skills: character.skills, merits: character.merits, meritCatalog: catalog }, meritCatalog: catalog, character, selectedId: definition.id, targetDots: 3, onSelect: () => {} });
  for (const element of [picker, experience]) {
    const markup = renderToStaticMarkup(createElement(LanguageProvider, null, element));
    assert.match(markup, /Meat Shield/);
    assert.doesNotMatch(markup, /Escudo de Carne|undefined|missing translation/);
  }
  assert.deepEqual(character, before);
  for (const locale of ["pt-BR", "en-US"]) {
    assert.equal(meritPresentation(definition, locale).name, locale === "pt-BR" ? "Escudo de Carne" : "Meat Shield");
  }
});
