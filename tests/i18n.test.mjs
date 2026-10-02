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
  assert.equal(translate("pt-BR", "ui.numina"), "Numina");
});

test("all locales expose exactly the same message keys", async () => {
  const { messages } = await vite.ssrLoadModule("/lib/i18n.tsx");
  const keys = (value, prefix = "") => Object.entries(value).flatMap(([key, child]) =>
    typeof child === "string" ? [`${prefix}${key}`] : keys(child, `${prefix}${key}.`),
  ).sort();

  assert.deepEqual(keys(messages["pt-BR"]), keys(messages["en-US"]));
});

test("Health exposes localized manual Heal and retains overflow when editing boxes", async () => {
  const { LanguageProvider, translate } = await vite.ssrLoadModule("/lib/i18n.tsx");
  const { HealthTrack } = await vite.ssrLoadModule("/app/workspace/sheet-primitives.tsx");
  const { cycleHealthDamage } = await vite.ssrLoadModule("/lib/resource-rules.ts");
  const damage = ["aggravated", "lethal", "bashing", "bashing"];
  const original = [...damage];
  assert.deepEqual(cycleHealthDamage(damage, 2, 1), ["aggravated", "aggravated", "bashing", "bashing"]);
  assert.deepEqual(cycleHealthDamage([], 2, 0), ["bashing"]);
  assert.deepEqual(cycleHealthDamage(["aggravated"], 2, 0), []);
  assert.deepEqual(cycleHealthDamage(damage, 2, 3), damage);
  assert.deepEqual(damage, original);
  const markup = renderToStaticMarkup(createElement(LanguageProvider, null, createElement(HealthTrack, { health: 2, damage, onChange: () => {} })));
  assert.match(markup, />Heal<\/button>/);
  assert.equal(translate("pt-BR", "ui.heal"), "Curar");
  assert.equal(translate("en-US", "ui.heal"), "Heal");
  assert.equal(translate("pt-BR", "ui.ban"), "Proibição");
  assert.equal(translate("pt-BR", "ui.baneda2072"), "Fraqueza");
  assert.equal(translate("en-US", "ui.baneda2072"), "Bane");
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

test("unexpected character import failures show a localized notice instead of raw diagnostic text", async () => {
  const { translate } = await vite.ssrLoadModule("/lib/i18n.tsx");
  const workspace=readFileSync(new URL("../app/workspace.tsx",import.meta.url),"utf8");
  assert.match(workspace,/const message = t\("workspace\.characterImportFailed"\)/);
  assert.doesNotMatch(workspace,/const message = error instanceof Error \? error\.message/);
  assert.match(translate("pt-BR","workspace.characterImportFailed"),/Não foi possível importar/);
  assert.match(translate("en-US","workspace.characterImportFailed"),/could not be imported/);
});

test("Mage Order labels follow the active locale", async () => {
  const { mageOrderLabel } = await vite.ssrLoadModule("/game-lines/mage/creation-rules.ts");

  assert.equal(mageOrderLabel("Adamantine Arrow", "en-US"), "Adamantine Arrow");
  assert.equal(mageOrderLabel("Adamantine Arrow", "pt-BR"), "Seta Adamantina");
  assert.equal(mageOrderLabel("Nameless", "pt-BR"), "Ordem sem Nome");
  assert.equal(mageOrderLabel("Nameless", "en-US"), "Nameless Order");
  assert.equal(mageOrderLabel("Orderless", "pt-BR"), "Sem Ordem");
  assert.equal(mageOrderLabel("Orderless", "en-US"), "Orderless");
  assert.equal(mageOrderLabel("My authored order", "pt-BR"), "My authored order");
});

test("Contract outcomes and Courtless use dictionary labels without changing mechanics", async () => {
  const { translate } = await vite.ssrLoadModule("/lib/i18n.tsx");
  const { contractOutcomeSections } = await vite.ssrLoadModule("/lib/contract-presentation.ts");
  const { courtDisplayName } = await vite.ssrLoadModule("/lib/changeling-courts.ts");
  const contract={description:"Description",dicePool:"Wits + Wyrd",success:"Success text",exceptionalSuccess:"Exceptional text",failure:"Failure text",dramaticFailure:"Dramatic text"};
  const before=JSON.stringify(contract);
  for(const locale of ["pt-BR","en-US"]){
    assert.deepEqual(contractOutcomeSections(contract,locale),["success","exceptionalSuccess","failure","dramaticFailure"].map((field)=>({label:translate(locale,`ui.${field}`),text:contract[field]})));
    assert.deepEqual(contractOutcomeSections({...contract,hasRoll:false},locale),[{label:translate(locale,"ui.effect"),text:contract.success}]);
    for(const value of ["Courtless","Sem Corte"]) assert.equal(courtDisplayName(value,locale),translate(locale,"ui.courtless"));
    assert.equal(courtDisplayName("My custom court",locale),"My custom court");
  }
  assert.equal(JSON.stringify(contract),before);
  const corePresentation=JSON.parse(readFileSync(new URL("../public/shared/data/conditions-pt.json",import.meta.url),"utf8"));
  assert.match(translate("pt-BR","ui.tasteOfFealtyAutomation",{count:2}),new RegExp(corePresentation.deprived.name));
});

test("Vampire purchase labels use audited dictionary terms in both locales", async () => {
  const { purchaseLabel } = await vite.ssrLoadModule("/game-lines/vampire/experience-panel.tsx");
  assert.equal(purchaseLabel("lash", "pt-BR"), "Açoites do Grilhão de Sangue");
  assert.equal(purchaseLabel("lash", "en-US"), "Lashes of Blood Tether");
  assert.equal(purchaseLabel("invocation", "pt-BR"), "Invocação Dourada");
  assert.equal(purchaseLabel("rite", "en-US"), "Crúac Rite");
});

test("Merit validation returns semantic messages and resolves them in both locales", async () => {
  const { translate } = await vite.ssrLoadModule("/lib/i18n.tsx");
  const { meritSelectionProblems } = await vite.ssrLoadModule("/lib/merits.ts");
  const { mageMeritSelectionProblems } = await vite.ssrLoadModule("/game-lines/mage/merits.ts");
  const context={gameLine:"MtA",order:"Mysterium",attributes:{Strength:1},skills:{},merits:[]};
  const definition=(name)=>({name,line:"MtA",ratings:[1,2,3],prerequisites:"Strength •••"});
  const problems=[
    ...meritSelectionProblems(definition("Sanctum"),{dots:3},context),
    ...meritSelectionProblems(definition("Awakened Status"),{dots:2},context),
    ...meritSelectionProblems(definition("Awakened Status"),{dots:2,configuration:{domain:"Silver Ladder"}},context),
    ...meritSelectionProblems(definition("Adamant Hand"),{dots:1},context),
    ...meritSelectionProblems(definition("Cabal Theme"),{dots:1},context),
    ...["Faction Member","Prelacy","Profane Tool","Svikiro"].flatMap(name=>mageMeritSelectionProblems(definition(name),{dots:3},context,[])),
  ];
  const before=JSON.stringify(problems);
  for(const problem of problems){
    assert.match(problem.key,/^ui\.merit/);
    for(const locale of ["pt-BR","en-US"]) assert.doesNotMatch(translate(locale,problem.key,problem.params),/missing translation|\{\w+\}/);
  }
  const linked=problems.find(problem=>problem.key==="ui.meritSelectLinked");
  assert.deepEqual(linked.params,{merits:"Safe Place",minimum:3});
  assert.match(translate("pt-BR",linked.key,linked.params),/^Selecione/);
  assert.match(translate("en-US",linked.key,linked.params),/^Select/);
  assert.equal(JSON.stringify(problems),before);
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

test("dynamic Health and Arcanum labels follow locale, and Kith choice keys resolve", async () => {
  const { LanguageProvider, translate } = await vite.ssrLoadModule("/lib/i18n.tsx");
  const { HealthTrack } = await vite.ssrLoadModule("/app/workspace/sheet-primitives.tsx");
  const markup = renderToStaticMarkup(createElement(LanguageProvider, null, createElement(HealthTrack, { health: 4, damage: ["bashing", "lethal", "aggravated"], onChange: () => {} })));
  for (const state of ["bashing damage", "lethal damage", "aggravated damage", "empty"]) assert.match(markup, new RegExp(state));
  assert.doesNotMatch(markup, /contusivo|agravado|vazi[ao]/);
  assert.equal(translate("pt-BR", "ui.damageBashing"), "dano contusivo");
  const { formatSpellRequirements } = await vite.ssrLoadModule("/game-lines/mage/experience-shared.tsx");
  const requirements = { Death: 2, Spirit: 1 };
  assert.equal(formatSpellRequirements(requirements, "pt-BR"), "Morte 2 + Espírito 1");
  assert.equal(formatSpellRequirements(requirements, "en-US"), "Death 2 + Spirit 1");
  assert.deepEqual(requirements, { Death: 2, Spirit: 1 });
  const { KITH_CREATION_CHOICES } = await vite.ssrLoadModule("/game-lines/changeling/kith-choices.ts");
  for (const choice of Object.values(KITH_CREATION_CHOICES)) {
    for (const locale of ["pt-BR", "en-US"]) for (const key of [choice.labelKey, choice.placeholderKey].filter(Boolean)) assert.doesNotMatch(translate(locale, key), /missing translation/);
  }
});

test("Fae Mount ability labels and descriptions resolve for every canonical choice", async () => {
  const { translate, LanguageProvider } = await vite.ssrLoadModule("/lib/i18n.tsx");
  for (const id of ["manyleague","chatterbox","actormask","armorshell","burdenback","dreamspun","thornbeast","hedgefoot"]) {
    for (const locale of ["pt-BR","en-US"]) for (const field of ["name","description"]) assert.doesNotMatch(translate(locale, `ui.mountAbilities.${id}.${field}`), /missing translation/);
  }
  assert.equal(translate("pt-BR","ui.mountAbilities.chatterbox.name"),"Tagarela");
  assert.equal(translate("en-US","ui.mountAbilities.chatterbox.name"),"Chatterbox");
  const auditedNames={actormask:"Mascarilhado",armorshell:"Blindagem",burdenback:"Carregador",dreamspun:"Onírico",thornbeast:"Fera dos Espinhos",hedgefoot:"Pé-de-Sebe"};
  for(const [id,name] of Object.entries(auditedNames)) assert.equal(translate("pt-BR",`ui.mountAbilities.${id}.name`),name);
  assert.match(translate("pt-BR","ui.armorshellProvidesArmor32OnlyTheHigher"),/^Blindagem /);
  assert.equal(translate("pt-BR","ui.hedgefootMode"),"Modo de Pé-de-Sebe");
  const { CompanionPage } = await vite.ssrLoadModule("/game-lines/changeling/companion-page.tsx");
  const character={merits:[{name:"Fae Mount",dots:1,configuration:{name:"My mount",abilities:["chatterbox"]}}]};
  const before=JSON.stringify(character);
  const markup=renderToStaticMarkup(createElement(LanguageProvider,null,createElement(CompanionPage,{character,updateSheet:()=>{}})));
  assert.match(markup,/Chatterbox/);
  assert.doesNotMatch(markup,/missing translation/);
  assert.equal(JSON.stringify(character),before);
});

test("Familiar Numina localize labels while preserving canonical selections and authored names", async () => {
  const { translate, messages, LanguageProvider } = await vite.ssrLoadModule("/lib/i18n.tsx");
  const expected=["Awe","Blast","Dement","Drain","Emotional Aura","Entropic Decay","Firestarter","Hallucination","Implant Mission","Left-Handed Spanner","Mortal Mask","Pathfinder","Regenerate","Seek","Speed","Sign","Stalwart","Telekinesis"];
  assert.deepEqual(Object.values(messages["en-US"].ui.familiarNumina),expected);
  for(const key of Object.keys(messages["en-US"].ui.familiarNumina)) assert.doesNotMatch(translate("pt-BR",`ui.familiarNumina.${key}`),/missing translation/);
  assert.equal(translate("pt-BR","ui.familiarNumina.mortalMask"),"Mascarilha Mortal");
  const { CompanionPage } = await vite.ssrLoadModule("/game-lines/mage/companion-page.tsx");
  const character={merits:[{name:"Familiar",dots:2,configuration:{name:"My familiar",entity:"Ghost",numina:["Awe"]}}]};
  const before=JSON.stringify(character);
  const markup=renderToStaticMarkup(createElement(LanguageProvider,null,createElement(CompanionPage,{character,updateSheet:()=>{}})));
  assert.match(markup,/My familiar/);
  assert.match(markup,/Awe/);
  assert.doesNotMatch(markup,/missing translation/);
  assert.equal(JSON.stringify(character),before);
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

test("Changeling structure options localize presentation without altering canonical saved choices", async () => {
  const { translate, LanguageProvider } = await vite.ssrLoadModule("/lib/i18n.tsx");
  const options = JSON.parse(readFileSync(new URL("../game-lines/changeling/catalog-data/merit-options.json", import.meta.url), "utf8"));
  for (const collection of Object.values(options)) {
    for (const item of collection) {
      for (const locale of ["pt-BR", "en-US"]) {
        for (const key of [item.nameKey ?? item.labelKey, item.descriptionKey ?? item.effectKey]) assert.doesNotMatch(translate(locale, key), /missing translation/);
      }
      assert.equal(translate("en-US", item.nameKey ?? item.labelKey), item.name ?? item.label);
      assert.equal(translate("en-US", item.descriptionKey ?? item.effectKey), item.description ?? item.effect);
    }
  }
  const { expandedConfigurationLines } = await vite.ssrLoadModule("/game-lines/changeling/sheet-merit-configurations.ts");
  const value = { name: "Shadow Garden", features: ["Shadow Garden|1", "My garden|1"] };
  const before = JSON.stringify(value);
  const pt = expandedConfigurationLines("Hollow", 2, value, "pt-BR");
  assert.ok(pt.includes("Nome: Shadow Garden"), "Authored names must not be translated");
  assert.ok(pt.some((line) => line.endsWith("Jardim de Sombras, My garden")));
  assert.ok(expandedConfigurationLines("Hollow", 2, value, "en-US").some((line) => line.endsWith("Shadow Garden, My garden")));
  assert.ok(expandedConfigurationLines("Stable Trod", 1, { enhancement: "Hob Alarm" }, "pt-BR").some((line) => line.endsWith("Alarme Hob")));
  assert.equal(JSON.stringify(value), before);
  const { renderChangelingStructuredMeritEditor } = await vite.ssrLoadModule("/game-lines/changeling/builder-merit-editor.tsx");
  for (const name of ["Hollow", "Shared Bastion", "Hedgespun Item", "Stable Trod"]) {
    const editor = renderChangelingStructuredMeritEditor({ merit: { name, dots: 5 }, configuration: {}, onChange: () => {}, compact: false }, [], []);
    const markup = renderToStaticMarkup(createElement(LanguageProvider, null, editor));
    assert.doesNotMatch(markup, /missing translation/, name);
  }
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
