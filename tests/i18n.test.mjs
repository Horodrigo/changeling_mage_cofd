import assert from "node:assert/strict";
import test, { after } from "node:test";
import { fileURLToPath } from "node:url";
import { readFileSync } from "node:fs";
import { createServer } from "vite";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

const root = fileURLToPath(new URL("..", import.meta.url));
const vite = await createServer({
  appType: "custom",
  configFile: false,
  root,
  resolve: { alias: { "@": root } },
  server: { middlewareMode: true, hmr: false },
  optimizeDeps: { noDiscovery: true, include: [] },
});
after(async () => vite.close());

test("language preference is global and translation lookup is deterministic", async () => {
  const { languageStorageKey, localeFlag, translate } = await vite.ssrLoadModule("/lib/i18n.tsx");

  assert.equal(languageStorageKey, "arquivo-das-trevas:locale:v1");
  assert.equal(localeFlag("pt-BR"), "🇧🇷");
  assert.equal(localeFlag("en-US"), "🇺🇸");
  assert.equal(
    translate("pt-BR", "builder.eligibility.requiredPoints", { required: 5 }),
    "Distribua 5 pontos.",
  );
  assert.equal(
    translate("en-US", "builder.eligibility.requiredPoints", { required: 5 }),
    "Allocate 5 points.",
  );
  assert.equal(translate("en-US", "sheet.clna"), "[missing translation: sheet.clna]");
  assert.equal(translate("pt-BR", "ui.catch"), "Gatilho");
  assert.equal(translate("pt-BR", "ui.loophole"), "Brecha");
});

test("all locales expose exactly the same message keys", async () => {
  const { messages } = await vite.ssrLoadModule("/lib/i18n.tsx");
  const keys = (value, prefix = "") => Object.entries(value).flatMap(([key, child]) =>
    typeof child === "string" ? [`${prefix}${key}`] : keys(child, `${prefix}${key}.`),
  ).sort();

  assert.deepEqual(keys(messages["pt-BR"]), keys(messages["en-US"]));
});

test("translations are split between common and game-line dictionaries", () => {
  const infrastructure = readFileSync(new URL("../lib/i18n.tsx", import.meta.url), "utf8");
  for (const line of ["mortal", "changeling", "mage", "vampire"]) {
    assert.match(infrastructure, new RegExp(`i18n/messages/${line}`));
    const dictionary = readFileSync(new URL(`../lib/i18n/messages/${line}.ts`, import.meta.url), "utf8");
    assert.match(dictionary, new RegExp(`export const ${line}Messages`));
  }
  assert.ok(infrastructure.split("\n").length < 150);
});

test("English is the server/default locale and catalog fallback is explicit", async () => {
  const infrastructure = readFileSync(new URL("../lib/i18n.tsx", import.meta.url), "utf8");
  const catalogs = readFileSync(new URL("../lib/localized-catalog.ts", import.meta.url), "utf8");
  const layout = readFileSync(new URL("../app/layout.tsx", import.meta.url), "utf8");

  assert.match(infrastructure, /const serverLocale = \(\):Locale => "en-US"/);
  assert.match(layout, /<html lang="en-US">/);
  assert.match(catalogs, /fallback: CatalogFallback = "empty"/);
});

test("Mage Order labels follow the active locale", async () => {
  const { mageOrderLabel } = await vite.ssrLoadModule("/game-lines/mage/creation-rules.ts");

  assert.equal(mageOrderLabel("Adamantine Arrow", "en-US"), "Adamantine Arrow");
  assert.equal(mageOrderLabel("Adamantine Arrow", "pt-BR"), "Seta Adamantina");
});

test("Vampire purchase labels use audited dictionary terms in both locales", async () => {
  const { purchaseLabel } = await vite.ssrLoadModule("/game-lines/vampire/experience-panel.tsx");
  assert.equal(purchaseLabel("lash", "pt-BR"), "Açoites do Grilhão de Sangue");
  assert.equal(purchaseLabel("lash", "en-US"), "Lashes of Blood Tether");
  assert.equal(purchaseLabel("invocation", "pt-BR"), "Invocação Dourada");
  assert.equal(purchaseLabel("rite", "en-US"), "Crúac Rite");
});

test("experience rule tables resolve every message and preserve the published cost labels", async () => {
  const { LanguageProvider, translate } = await vite.ssrLoadModule("/lib/i18n.tsx");
  const ctl = await vite.ssrLoadModule("/game-lines/changeling/experience-shared.tsx");
  const mage = await vite.ssrLoadModule("/game-lines/mage/experience-shared.tsx");
  for (const Component of [ctl.ExperienceRules, mage.MageExperienceRules]) {
    const markup = renderToStaticMarkup(createElement(LanguageProvider, null, createElement(Component)));
    assert.doesNotMatch(markup, /missing translation/);
    assert.match(markup, /Attribute/);
  }
  assert.equal(translate("pt-BR", "ui.beatRiskHubris"), "Arriscar um Ato de Húbris");
  assert.equal(translate("pt-BR", "ui.favoredContractCost"), "Comum 2 · Real 3");
  assert.equal(translate("en-US", "ui.mixedExperiencePerDot", { cost: 4 }), "4/dot, regular and/or Arcane");
});

test("Merit configuration labels and canonical option presentations resolve in both locales", async () => {
  const { translate } = await vite.ssrLoadModule("/lib/i18n.tsx");
  const catalogs = [
    ["/app/builder/common-merit-configurations.ts", "COMMON_MERIT_CONFIGURATIONS"],
    ["/game-lines/changeling/builder-merit-configurations.ts", "CHANGELING_MERIT_CONFIGURATIONS"],
    ["/game-lines/mage/merit-configurations.ts", "MAGE_MERIT_CONFIGURATIONS"],
    ["/game-lines/vampire/merit-configurations.ts", "VAMPIRE_MERIT_CONFIGURATIONS"],
  ];
  for (const [path, exported] of catalogs) {
    const loaded = await vite.ssrLoadModule(path);
    for (const definition of loaded[exported]) {
      for (const field of definition.fields) {
        assert.match(field.label, /^ui\./, `${definition.name}: ${field.key}`);
        for (const key of [field.label, field.placeholder, ...(field.options ?? []).map((option) => option.label)].filter((key) => key?.startsWith("ui."))) {
          for (const locale of ["pt-BR", "en-US"]) assert.doesNotMatch(translate(locale, key), /missing translation/, key);
        }
        for (const option of field.options ?? []) assert.doesNotMatch(option.value, /^ui\./, "Localized keys must never become persisted choices");
      }
    }
  }
  const { MAGE_MERIT_CONFIGURATIONS } = await vite.ssrLoadModule("/game-lines/mage/merit-configurations.ts");
  const options = (name) => MAGE_MERIT_CONFIGURATIONS.find((item) => item.name === name).fields.find((field) => field.options).options.map((option) => option.value);
  assert.deepEqual(options("Prelacy"), ["Eye", "Father", "General", "Unity", "Chancellor", "Raptor", "Prophet", "Nemesis", "Ruin"]);
  assert.deepEqual(options("Profane Tool"), ["Scepter", "Robe", "Crown", "Throne", "Ring"]);
});

test("expanded Merit configuration translates selected options but preserves authored text and locked fields", async () => {
  const { configuredDefinitionLines } = await vite.ssrLoadModule("/app/workspace/merit-configuration-presentation.ts");
  const { MAGE_MERIT_CONFIGURATIONS } = await vite.ssrLoadModule("/game-lines/mage/merit-configurations.ts");
  const definition = MAGE_MERIT_CONFIGURATIONS.find((item) => item.name === "Familiar");
  const configuration = { name: "Ghost", entity: "Ghost", traits: "Spirit" };
  const before = JSON.stringify(configuration);
  assert.deepEqual(configuredDefinitionLines(definition, 2, configuration, "pt-BR"), [
    "Nome do Familiar: Ghost", "Tipo de entidade: Fantasma", "Características da entidade: Spirit",
  ]);
  assert.deepEqual(configuredDefinitionLines(definition, 2, configuration, "en-US"), [
    "Familiar name: Ghost", "Entity type: Ghost", "Entity traits: Spirit",
  ]);
  assert.equal(JSON.stringify(configuration), before);
  const masque = MAGE_MERIT_CONFIGURATIONS.find((item) => item.name === "Masque (Style)");
  assert.deepEqual(configuredDefinitionLines(masque, 1, { nimbus: "Hidden" }, "pt-BR"), []);
  const { expandedConfigurationLines } = await vite.ssrLoadModule("/game-lines/mage/sheet-merit-configurations.ts");
  assert.deepEqual(expandedConfigurationLines("Artifact", 3, {}, "pt-BR"), ["Capacidade de Mana: 6", "Gnose efetiva: 2"]);
  const changeling = await vite.ssrLoadModule("/game-lines/changeling/sheet-merit-configurations.ts");
  assert.deepEqual(changeling.expandedConfigurationLines("Hedge Duelist", 1, { firstManeuver: "Shadowplay" }, "pt-BR"), [
    "Jogo de Sombras (Trevoso): Ganhe +2 de Defesa enquanto estiver na escuridão ou em sombras profundas.",
  ]);
});

test("legacy tr() UI translation helper is not reintroduced in active app surfaces", async () => {
  const candidates = [
    "../app/workspace.tsx",
    "../app/game-line-builder.tsx",
    "../app/workspace/game-line-sheet.tsx",
    "../game-lines/mage/builder-view.tsx",
    "../game-lines/mage/sheet-view.tsx",
    "../game-lines/changeling/builder-view.tsx",
    "../game-lines/changeling/sheet-view.tsx",
    "../game-lines/vampire/builder.tsx",
    "../game-lines/vampire/sheet-view.tsx",
    "../game-lines/mortal/builder.tsx",
    "../game-lines/mortal/sheet-view.tsx",
  ];

  const violations = [];
  for (const candidate of candidates) {
    const content = readFileSync(new URL(candidate, import.meta.url), "utf8");
    if (/\btr\s*\(/.test(content)) violations.push(candidate);
  }

  assert.deepEqual(violations, []);
});
