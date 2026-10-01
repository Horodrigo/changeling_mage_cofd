import assert from "node:assert/strict";
import test, { after } from "node:test";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { createServer } from "vite";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

const root = fileURLToPath(new URL("..", import.meta.url));
const readJson = path => JSON.parse(readFileSync(new URL(`../${path}`, import.meta.url), "utf8"));
const reference = readJson("public/game-lines/werewolf/data/reference.json");
const presentation = readJson("public/game-lines/werewolf/data/reference-pt.json");
const traits = readJson("public/game-lines/werewolf/data/traits.json");
const traitsPresentation = readJson("public/game-lines/werewolf/data/traits-pt.json");
const moonGifts = readJson("public/game-lines/werewolf/data/gifts/wtf-core-moon.json");
const moonPresentation = readJson("public/game-lines/werewolf/data/gifts/wtf-core-moon-pt.json");
const wolfGifts = readJson("public/game-lines/werewolf/data/gifts/wtf-core-wolf.json");
const wolfPresentation = readJson("public/game-lines/werewolf/data/gifts/wtf-core-wolf-pt.json");
const shadowGifts = readJson("public/game-lines/werewolf/data/gifts/wtf-core-shadow.json");
const shadowPresentation = readJson("public/game-lines/werewolf/data/gifts/wtf-core-shadow-pt.json");
const giftCatalog = { gifts: [...moonGifts, ...wolfGifts, ...shadowGifts], presentation: { ...moonPresentation, ...wolfPresentation, ...shadowPresentation } };
const catalog = { ...reference, ...traits, presentation: { ...presentation, ...traitsPresentation } };
const vite = await createServer({ appType: "custom", configFile: false, root,
  resolve: { alias: { "@": root } }, server: { middlewareMode: true, hmr: false, ws: false },
  optimizeDeps: { noDiscovery: true, include: [] } });
after(() => vite.close());
const rules = await vite.ssrLoadModule("/game-lines/werewolf/creation-rules.ts");

test("WtF 2e reference preserves five forms, five Auspices and five Tribes plus Ghost Wolves", () => {
  assert.deepEqual(reference.forms.map(form => form.name), ["Hishu", "Dalu", "Gauru", "Urshul", "Urhan"]);
  assert.equal(reference.auspices.length, 5);
  assert.equal(reference.tribes.length, 6);
  assert.equal(reference.primalUrge.length, 10);
  const records = [...reference.forms, ...reference.auspices, ...reference.tribes, ...reference.primalUrge];
  assert.equal(new Set(records.map(item => item.id)).size, records.length);
  assert.deepEqual(new Set(Object.keys(presentation)), new Set(records.map(item => item.id)));
  for (const item of records) {
    assert.equal(item.sourceId, "wtf-2ed");
    assert.ok(item.page > 0);
  }
  for (const form of reference.forms) {
    assert.equal(presentation[form.id].name, form.name);
    assert.ok(form.description.length > 80);
    assert.ok(presentation[form.id].description.length > 80);
  }
  for (const item of reference.auspices) assert.equal(presentation[item.id].name, item.name);
  assert.equal(reference.experienceCosts.wolfFacet, 1);
  assert.equal(reference.experienceCosts.affinityGift, 3);
  assert.equal(reference.experienceCosts.nonAffinityGift, 5);
  assert.equal(reference.experienceCosts.additionalMoonGift, 5);
  assert.equal(reference.experienceCosts.additionalMoonFacet, 2);
});

const character = {
  attributes: { Strength: 2, Dexterity: 3, Stamina: 2, Manipulation: 2, Wits: 4, Resolve: 2, Composure: 3 },
  skills: { Athletics: 2 }, current_state: { health_damage: Array(10).fill("lethal") },
};

test("Werewolf Portuguese reference uses the same trait and damage terminology as the shared presentation", async () => {
  const { systemTerm } = await vite.ssrLoadModule("/lib/system-terms.ts");
  const { translate } = await vite.ssrLoadModule("/lib/i18n.tsx");
  assert.ok(presentation.dalu.description.includes(`${systemTerm("Composure", "pt-BR")} + ${translate("pt-BR", "werewolf.primalUrge")}`));
  assert.ok(presentation.urhan.description.includes(`${systemTerm("Strength", "pt-BR")} + ${systemTerm("Athletics", "pt-BR")}`));
  assert.match(traitsPresentation.regeneration.fields.bashing.label, /contusivo/);
  assert.match(translate("pt-BR", "werewolf.bashingPerTurn", { amount: 1 }), /contusivo/);
  assert.doesNotMatch(JSON.stringify({ presentation, traitsPresentation }), /Autocontrole|contundente|Esportes|Braço Arruinado|Perna Arruinada/);
});

test("WtF 2e pp. 96–98 and audited choices derive all five forms without rewriting the base or damage", () => {
  const before = JSON.stringify(character);
  const results = reference.forms.map(form => rules.formTraits(character, form));
  assert.deepEqual(results.map(item => item.health), [7, 9, 11, 10, 7]);
  assert.deepEqual(results.map(item => item.speed), [10, 11, 14, 17, 15]);
  assert.deepEqual(results.map(item => item.initiative), [6, 6, 7, 8, 8]);
  assert.deepEqual(results.map(item => item.defense), [5, 5, 6, 6, 6]);
  assert.deepEqual(results.map(item => item.perception), [1, 2, 3, 3, 4]);
  assert.deepEqual(results.map(item => item.attributes.Manipulation), [2, 1, 2, 1, 1]);
  assert.deepEqual(results.map(item => item.firearmsDefense), [false, true, true, true, false]);
  assert.deepEqual([results[2].armorGeneral, results[2].armorBallistic], [1, 1]);
  assert.equal(results[2].willpower, 5);
  assert.equal(JSON.stringify(character), before);
  for (const form of reference.forms) {
    const large = rules.formTraits(character, form, 6);
    assert.equal(large.speed, rules.formTraits(character, form).speed, "Size must not be counted again as Speed species factor");
    assert.equal(large.health, rules.formTraits(character, form).health + 1);
  }
});

test("WtF 2e p. 83 gives Ghost Wolves two Renown dots and other tribes three, capped at two per category", () => {
  const auspice = reference.auspices.find(item => item.id === "irraka");
  const tribe = reference.tribes.find(item => item.id === "iron-masters");
  assert.deepEqual(rules.creationRenown(auspice, tribe, "Glory"), { Cunning: 2, Glory: 1, Honor: 0, Purity: 0, Wisdom: 0 });
  assert.throws(() => rules.creationRenown(auspice, tribe, "Cunning"), /cannot exceed two/);
  assert.throws(() => rules.creationRenown(auspice, tribe, "Lucidez"), /Invalid creation Renown/);
  const ghost = reference.tribes.find(item => item.id === "ghost-wolves");
  assert.deepEqual(rules.creationRenown(auspice, ghost, "Cunning"), { Cunning: 2, Glory: 0, Honor: 0, Purity: 0, Wisdom: 0 });
});

test("WtF 2e Primal Urge limits are informational and creation conversions have exact costs", () => {
  assert.equal(rules.primalUrgeLevel(reference, 6).essenceMaximum, 20);
  assert.equal(rules.primalUrgeLevel(reference, 9).essencePerTurn, 10);
  assert.equal(rules.primalUrgeLevel(reference, 10).regenerationBashing, 6);
  assert.equal(rules.primalUrgeLevel(reference, Number.NaN).rating, 1);
  assert.equal(rules.primalUrgeLevel(reference, 99).rating, 10);
  assert.equal(rules.boundedHarmony(0), 0);
  assert.equal(rules.boundedHarmony(Number.NaN), 7);
  for (const invalid of [null, undefined, "", " ", false, [], {}, Number.POSITIVE_INFINITY]) {
    assert.equal(rules.boundedHarmony(invalid), 7);
    assert.equal(rules.boundedPrimalUrge(invalid), 1);
  }
  assert.equal(rules.creationMeritBudget(1, 0), 10);
  assert.equal(rules.creationMeritBudget(2, 5), 0);
  assert.equal(rules.creationMeritBudget(3, 0), 0);
  assert.throws(() => rules.creationMeritBudget(4), /Invalid/);
  for (const rating of [0, -1, 1.5, Infinity, undefined])
    assert.throws(() => rules.creationMeritBudget(rating), /Invalid/);
  assert.throws(() => rules.creationMeritBudget(3, 1), /exceed/);
  assert.throws(() => rules.creationMeritBudget(1, 6), /Invalid/);
});

test("WtF 2e p. 82 adds the free Auspice Skill dot separately, without exceeding five", () => {
  const rahu = reference.auspices.find(item => item.id === "rahu");
  const base = { Brawl: 4, Survival: 0, Intimidation: 1, Medicine: 2 };
  const before = structuredClone(base);
  assert.deepEqual(rules.creationAuspiceSkill(base, rahu, "Brawl"), { ...base, Brawl: 5 });
  assert.equal(rules.creationAuspiceSkill(base, rahu, "Survival").Survival, 1);
  assert.throws(() => rules.creationAuspiceSkill({ ...base, Brawl: 5 }, rahu, "Brawl"));
  assert.throws(() => rules.creationAuspiceSkill(base, rahu, "Medicine"));
  assert.deepEqual(base, before);
});

test("WtF 2e p. 83 initial Facets follow Auspice Renown and two distinct favored Shadow Gifts", () => {
  const rahu = reference.auspices.find(item => item.id === "rahu");
  const bloodTalons = reference.tribes.find(item => item.id === "blood-talons");
  const ghostWolves = reference.tribes.find(item => item.id === "ghost-wolves");
  const moon = rules.creationGiftAllowance(rahu, bloodTalons, "Purity");
  assert.equal(moon.moonGiftId, "gift-full-moon");
  assert.equal(moon.moonFacetCount, 2);
  assert.equal(moon.wolfFacetCount, 0);
  assert.equal(moon.shadowFacetCount, 2);
  assert.deepEqual(new Set(moon.shadowGiftIds), new Set([...rahu.giftIds, ...bloodTalons.giftIds]));
  const wolf = rules.creationGiftAllowance(rahu, ghostWolves, "Cunning");
  assert.equal(wolf.moonFacetCount, 1);
  assert.equal(wolf.wolfFacetCount, 1);
  assert.deepEqual(wolf.shadowGiftIds, rahu.giftIds);
  assert.equal(Object.values(wolf.renown).reduce((sum, value) => sum + value), 2);
});

test("Werewolf creation template validates canonical selections and exact conversion budgets", async () => {
  const choices = { auspice_id: "rahu", tribe_id: "blood-talons", auspice_skill: "Brawl", renown_choice: "Purity", primal_urge: 1, extra_rite_dots: 0, blood: "blood-soldier", bone: "bone-lone-wolf", physical_touchstone: "My family", spiritual_touchstone: "The mountain", shadow_facets: ["gift-dominance:snarl-of-the-predator", "gift-inspiration:fearless-hunter"], wolf_facets: [] };
  const validate = (value, skills = { Brawl: 2 }) => rules.creationTemplateProblems(value, reference, skills, giftCatalog.gifts);
  assert.deepEqual(validate(choices), []);
  assert.deepEqual(validate({ ...choices, auspice_id: "unknown" }), ["auspice"]);
  assert.deepEqual(validate({ ...choices, primal_urge: 3, extra_rite_dots: 1 }), ["creationBudget"]);
  assert.deepEqual(validate({ ...choices, primal_urge: 1.5 }), ["creationBudget"]);
  assert.deepEqual(validate({ ...choices, auspice_skill: "Brawl" }, { Brawl: 5 }), ["auspiceSkill"]);
  assert.deepEqual(validate({ ...choices, shadow_facets: [] }), ["shadowFacets"]);
  const { WerewolfCreationTemplate } = await vite.ssrLoadModule("/game-lines/werewolf/builder-template.tsx");
  const { LanguageProvider, translate } = await vite.ssrLoadModule("/lib/i18n.tsx");
  const markup = renderToStaticMarkup(createElement(LanguageProvider, null, createElement(WerewolfCreationTemplate, { value: choices, onChange: () => {}, skills: { Brawl: 2 }, reference: catalog, gifts: giftCatalog })));
  assert.match(markup, /Remaining Merit dots: 10/);
  assert.match(markup, /Available Rite dots: 2/);
  assert.match(markup, /Starting Facets: 2/);
  assert.match(markup, /value="My family"/);
  assert.match(markup, /Moon Facets are granted automatically/);
  assert.match(markup, /Selected Facets: 2 \/ 2/);
  assert.doesNotMatch(markup, /missing translation/);
  assert.equal(translate("pt-BR", "werewolf.renownNames.Purity"), "Pureza");
  assert.equal(translate("pt-BR", "werewolf.creationProblem.creationBudget"), "Instinto Primitivo e Ritos extras devem caber nos dez pontos iniciais de Méritos.");
});

test("WtF 2e p. 83 grants ordered Moon Facets and validates starting Shadow/Wolf selections without mutating choices", () => {
  const rahu = reference.auspices.find(item => item.id === "rahu");
  const bloodTalons = reference.tribes.find(item => item.id === "blood-talons");
  const selections = { shadow_facets: ["gift-dominance:snarl-of-the-predator", "gift-inspiration:fearless-hunter"], wolf_facets: [] };
  const before = structuredClone(selections);
  const select = (renown, value, gifts = giftCatalog.gifts) => rules.creationGiftSelection(rahu, bloodTalons, renown, gifts, value);
  const moon = select("Purity", selections);
  const ownMoon = moonGifts.find(gift => gift.id === "gift-full-moon");
  assert.deepEqual(moon.moonFacetIds, ownMoon.facets.slice(0, 2).map(facet => facet.id));
  assert.deepEqual(moon.problems, []);
  assert.deepEqual(select("Cunning", { ...selections, wolf_facets: ["gift-change:skin-thief"] }).problems, []);
  assert.equal(select("Cunning", { ...selections, wolf_facets: ["gift-change:skin-thief"] }).moonFacetIds.length, 1);
  assert.ok(select("Purity", { ...selections, wolf_facets: ["gift-change:skin-thief"] }).problems.includes("wolfFacets"));
  assert.ok(select("Cunning", selections).problems.includes("wolfFacets"));
  const incompleteMoon = giftCatalog.gifts.map(gift => gift.id === ownMoon.id ? { ...gift, facets: gift.facets.filter(facet => facet.level !== 2) } : gift);
  assert.ok(select("Purity", selections, incompleteMoon).problems.includes("moonGiftMissing"));
  assert.deepEqual(selections, before);
});

test("WtF 2e creation rejects unfavored, unearned, duplicate, unknown and misclassified Facets, including after changing identity", () => {
  const rahu = reference.auspices.find(item => item.id === "rahu");
  const bloodTalons = reference.tribes.find(item => item.id === "blood-talons");
  const ghostWolves = reference.tribes.find(item => item.id === "ghost-wolves");
  const valid = { shadow_facets: ["gift-dominance:snarl-of-the-predator", "gift-inspiration:fearless-hunter"], wolf_facets: [] };
  const problems = value => rules.creationGiftSelection(rahu, bloodTalons, "Purity", giftCatalog.gifts, value).problems;
  assert.ok(problems({ ...valid, shadow_facets: ["gift-dominance:snarl-of-the-predator", "gift-dominance:glorious-lunacy"] }).includes("distinctShadowGifts"));
  assert.ok(problems({ ...valid, shadow_facets: ["gift-dominance:snarl-of-the-predator", "gift-dominance:snarl-of-the-predator"] }).includes("invalidFacet"));
  assert.ok(problems({ ...valid, shadow_facets: ["gift-dominance:snarl-of-the-predator", "gift-inspiration:lunatic-inspiration"] }).includes("facetRenown"));
  assert.ok(problems({ ...valid, shadow_facets: ["gift-dominance:snarl-of-the-predator", "gift-insight:scent-the-unnatural"] }).includes("unfavoredShadowGift"));
  assert.ok(problems({ ...valid, shadow_facets: ["gift-dominance:snarl-of-the-predator", "unknown-facet"] }).includes("invalidFacet"));
  assert.ok(problems({ ...valid, shadow_facets: ["gift-dominance:snarl-of-the-predator", "gift-change:skin-thief"] }).includes("invalidFacet"));
  const changed = rules.creationGiftSelection(rahu, ghostWolves, "Purity", giftCatalog.gifts, valid);
  assert.ok(changed.problems.includes("unfavoredShadowGift"));
  assert.ok(changed.problems.includes("facetRenown"), "Ghost Wolves do not retain a former Tribe's Renown");
  assert.deepEqual(valid.shadow_facets, ["gift-dominance:snarl-of-the-predator", "gift-inspiration:fearless-hunter"]);
});

test("Werewolf creation Facet cards separate all printed rules, explain disabled choices and retain invalid selections for removal", async () => {
  const { CreationGifts, FacetRules } = await vite.ssrLoadModule("/game-lines/werewolf/creation-gifts.tsx");
  const { LanguageProvider, translate } = await vite.ssrLoadModule("/lib/i18n.tsx");
  const rahu = reference.auspices.find(item => item.id === "rahu");
  const tribe = reference.tribes.find(item => item.id === "blood-talons");
  const value = { renown_choice: "Purity", shadow_facets: ["gift-insight:scent-the-unnatural", "missing:facet"], wolf_facets: ["gift-change:skin-thief"] };
  const before = structuredClone(value);
  const render = element => renderToStaticMarkup(createElement(LanguageProvider, null, element));
  const markup = render(createElement(CreationGifts, { value, onChange: () => {}, auspice: rahu, tribe, gifts: giftCatalog }));
  assert.match(markup, /not favored by your current Auspice or Tribe/);
  assert.match(markup, /Requires at least one dot of Cunning/);
  assert.match(markup, /selected Facet is absent from this catalog: missing:facet/);
  const scentControl = markup.match(/<button[^>]*aria-label="Select Scent the Unnatural"[^>]*>/)?.[0] ?? "";
  assert.match(scentControl, /data-state="checked"/);
  assert.match(scentControl, /aria-describedby=/);
  assert.doesNotMatch(scentControl, /disabled=/, "An invalid selection must remain removable");
  assert.match(markup, />Remove<\/button>/);
  assert.doesNotMatch(markup, /<details[^>]* open|missing translation/);
  const fog = shadowGifts.find(gift => gift.id === "gift-evasion").facets.find(facet => facet.id === "gift-evasion:fog-of-war");
  const detail = render(createElement(FacetRules, { facet: fog, gifts: giftCatalog }));
  for (const label of ["Cost", "Dice Pool", "Action", "Activation requirement", "Dramatic Failure", "Failure", "Success"])
    assert.ok(detail.includes(`<strong>${label}:</strong>`), label);
  assert.doesNotMatch(detail, /<strong>Exceptional Success:/);
  for (const locale of ["en-US", "pt-BR"]) {
    for (const problem of ["moonGiftMissing", "shadowFacets", "distinctShadowGifts", "unfavoredShadowGift", "facetRenown", "wolfFacets", "invalidFacet"])
      assert.doesNotMatch(translate(locale, `werewolf.creationProblem.${problem}`), /missing translation/);
    assert.doesNotMatch(translate(locale, "werewolf.needsRenown", { renown: translate(locale, "werewolf.renownNames.Purity") }), /missing translation|\{renown\}/);
  }
  assert.deepEqual(value, before);
  const styles = readFileSync(new URL("../game-lines/werewolf/styles/builder.css", import.meta.url), "utf8");
  assert.match(styles, /grid-template-columns: minmax\(0, 1fr\) 44px/);
});

test("Werewolf creation renders Portuguese catalog text and explicit English fallback without changing canonical selections", async () => {
  // Test-only locale initialization for server rendering; production still defaults to English.
  const portuguese = await createServer({ appType: "custom", configFile: false, root,
    resolve: { alias: { "@": root } }, server: { middlewareMode: true, hmr: false, ws: false },
    optimizeDeps: { noDiscovery: true, include: [] },
    plugins: [{ name: "portuguese-server-snapshot", enforce: "pre", transform(code, id) {
      if (id.replaceAll("\\", "/").endsWith("/lib/i18n.tsx"))
        return code.replace('const serverLocale = ():Locale => "en-US";', 'const serverLocale = ():Locale => "pt-BR";');
    } }],
  });
  try {
    const { LanguageProvider } = await portuguese.ssrLoadModule("/lib/i18n.tsx");
    const { WerewolfCreationTemplate } = await portuguese.ssrLoadModule("/game-lines/werewolf/builder-template.tsx");
    const value = { auspice_id: "rahu", tribe_id: "blood-talons", auspice_skill: "Brawl", renown_choice: "Purity", primal_urge: 1, extra_rite_dots: 0, blood: "blood-soldier", bone: "bone-lone-wolf", physical_touchstone: "Minha família", spiritual_touchstone: "A montanha", shadow_facets: ["gift-dominance:snarl-of-the-predator", "gift-inspiration:fearless-hunter"], wolf_facets: [] };
    const before = structuredClone(value);
    const missingField = structuredClone(giftCatalog);
    delete missingField.presentation["gift-inspiration:fearless-hunter"].effect;
    const markup = renderToStaticMarkup(createElement(LanguageProvider, null, createElement(WerewolfCreationTemplate, { value, onChange: () => {}, skills: { Brawl: 2 }, reference: catalog, gifts: missingField })));
    assert.match(markup, /Facetas selecionadas: 2 \/ 2/);
    assert.match(markup, /Caçador Destemido/);
    assert.match(markup, /<strong>Parada de dados:<\/strong>/);
    assert.match(markup, /<strong>Efeito:<\/strong> Add Glory Renown/);
    assert.doesNotMatch(markup, /missing translation|Select Fearless Hunter|<summary>Fearless Hunter/);
    assert.deepEqual(value, before);
  } finally { await portuguese.close(); }
});

test("Werewolf reference group loads only its four catalogs and is deeply immutable", async () => {
  const { werewolfReferenceCatalogGroup } = await vite.ssrLoadModule("/game-lines/werewolf/catalogs/reference.ts");
  const { freezeCatalogData } = await vite.ssrLoadModule("/lib/catalog/catalog-service.ts");
  const calls = [];
  const snapshot = freezeCatalogData(await werewolfReferenceCatalogGroup.load({
    async getCatalog(id) {
      calls.push(id);
      return structuredClone({ "werewolf-reference": reference, "werewolf-reference-pt": presentation,
        "werewolf-traits": traits, "werewolf-traits-pt": traitsPresentation }[id]);
    },
  }));
  assert.deepEqual(calls, ["werewolf-reference", "werewolf-reference-pt", "werewolf-traits", "werewolf-traits-pt"]);
  assert.ok(Object.isFrozen(snapshot.forms[3].attributes));
  assert.ok(Object.isFrozen(snapshot.presentation.urshul));
  assert.ok(Object.isFrozen(snapshot.passives[0].fields[0]));
  assert.ok(Object.isFrozen(snapshot.presentation.regeneration.fields));
  assert.throws(() => { snapshot.forms[3].attributes.Manipulation = -3; }, TypeError);
});

test("Werewolf forms render five comparison columns with native disclosures and translated labels", async () => {
  const { LanguageProvider, translate } = await vite.ssrLoadModule("/lib/i18n.tsx");
  const { FormsTable } = await vite.ssrLoadModule("/game-lines/werewolf/forms-table.tsx");
  const markup = renderToStaticMarkup(createElement(LanguageProvider, null, createElement(FormsTable, {
    character, reference: catalog,
  })));
  for (const form of reference.forms) assert.match(markup, new RegExp(`<th scope="col">${form.name}</th>`));
  assert.equal((markup.match(/<details/g) ?? []).length, 5);
  assert.doesNotMatch(markup, /missing translation/);
  assert.match(markup, /Manipulation/);
  assert.equal(translate("pt-BR", "werewolf.primalUrge"), "Instinto Primitivo");
  assert.equal(translate("pt-BR", "werewolf.harmony"), "Harmonia");
});

test("WtF 2e pp. 85–105 keeps twelve anchors, eleven Harmony rows and twenty directional breaking points complete in EN/PT", () => {
  assert.equal(traits.anchors.length, 12);
  assert.equal(traits.anchors.filter(anchor => anchor.kind === "blood").length, 6);
  assert.equal(traits.anchors.filter(anchor => anchor.kind === "bone").length, 6);
  assert.deepEqual(traits.harmony.map(level => level.rating), [10,9,8,7,6,5,4,3,2,1,0]);
  assert.deepEqual(traits.harmony.map(level => level.bans), [0,0,0,0,0,0,1,1,2,3,4]);
  assert.deepEqual(traits.harmony.map(level => level.trigger), ["passive","common","common","specific","specific",null,"specific","specific","common","common","passive"]);
  assert.equal(traits.breakingPoints.filter(point => point.direction === "flesh").length, 10);
  assert.equal(traits.breakingPoints.filter(point => point.direction === "spirit").length, 10);
  assert.equal(traits.breakingPoints.filter(point => point.maxHarmony === 3).length, 4);
  assert.equal(traits.breakingPoints.filter(point => point.minHarmony === 8).length, 4);
  const records = [...traits.anchors, ...traits.harmony, ...traits.breakingPoints, ...traits.passives];
  assert.equal(new Set(records.map(item => item.id)).size, records.length);
  assert.deepEqual(new Set(records.map(item => item.id)), new Set(Object.keys(traitsPresentation)));
  for (const item of records) {
    assert.equal(item.sourceId, "wtf-2ed");
    assert.ok(Number.isInteger(item.page) && item.page >= 85 && item.page <= 105);
  }
  for (const anchor of traits.anchors) {
    for (const key of ["name", "description", "recoverOne", "recoverAll"]) {
      assert.ok(anchor[key]?.length, `${anchor.id}.${key}`);
      assert.ok(traitsPresentation[anchor.id][key]?.length, `${anchor.id}.${key}.pt-BR`);
    }
  }
  for (const passive of traits.passives) {
    const translated = traitsPresentation[passive.id];
    assert.ok(translated.name);
    assert.equal(new Set(passive.fields.map(field => field.id)).size, passive.fields.length);
    assert.deepEqual(new Set(passive.fields.map(field => field.id)), new Set(Object.keys(translated.fields)));
    for (const field of passive.fields) {
      assert.ok(field.label && field.text);
      assert.ok(translated.fields[field.id].label && translated.fields[field.id].text);
    }
  }
});

test("Werewolf Harmony renders descending manual selections including zero and preserves Touchstone notes", async () => {
  const { LanguageProvider } = await vite.ssrLoadModule("/lib/i18n.tsx");
  const { HarmonyTrack, BreakingPointReference } = await vite.ssrLoadModule("/game-lines/werewolf/harmony.tsx");
  const touchstones = { physical: "My family", spiritual: "The mountain" };
  const before = JSON.stringify(catalog);
  const render = component => renderToStaticMarkup(createElement(LanguageProvider, null, component));
  const markup = render(createElement(HarmonyTrack, { value: 0, onChange: () => assert.fail("Rendering must not move Harmony"),
    onTouchstoneChange: () => assert.fail("Rendering must not edit notes"), touchstones, reference: catalog }));
  const ratings = [...markup.matchAll(/aria-pressed="(?:true|false)" aria-label="Harmony (\d+)"/g)].map(match => Number(match[1]));
  assert.deepEqual(ratings, [10,9,8,7,6,5,4,3,2,1,0]);
  assert.equal((markup.match(/aria-pressed="true"/g) ?? []).length, 1);
  assert.match(markup, /aria-pressed="true" aria-label="Harmony 0"/);
  assert.match(markup, /value="My family"/);
  assert.match(markup, /value="The mountain"/);
  assert.match(markup, /Unavailable at the current Harmony/);
  const points = render(createElement(BreakingPointReference, { harmony: 7, reference: catalog }));
  assert.match(points, /Toward Flesh — increases Harmony/);
  assert.match(points, /Toward Spirit — decreases Harmony/);
  assert.equal((points.match(/<li[ >]/g) ?? []).length, 20);
  assert.equal((points.match(/class="wtf-inactive-rule"/g) ?? []).length, 8);
  assert.equal(JSON.stringify(catalog), before);
});

test("Werewolf passives and anchor recovery are native disclosures with distinct labeled fields, not automatic actions", async () => {
  const { LanguageProvider, translate } = await vite.ssrLoadModule("/lib/i18n.tsx");
  const { WerewolfPassives, PrimalUrgeLimits } = await vite.ssrLoadModule("/game-lines/werewolf/passives.tsx");
  const { AnchorDetails } = await vite.ssrLoadModule("/game-lines/werewolf/anchors.tsx");
  const render = component => renderToStaticMarkup(createElement(LanguageProvider, null, component));
  const markup = render(createElement(WerewolfPassives, { reference: catalog }));
  assert.equal((markup.match(/<details/g) ?? []).length, 16);
  assert.doesNotMatch(markup, /<button|<input|missing translation/);
  assert.match(markup, /<strong>Aggravated damage:<\/strong>/);
  const anchor = render(createElement(AnchorDetails, { anchor: traits.anchors[0], reference: catalog }));
  assert.match(anchor, /Recover one spent Willpower/);
  assert.match(anchor, /Recover all spent Willpower/);
  assert.doesNotMatch(anchor, /<button/);
  const limits = render(createElement(PrimalUrgeLimits, { reference: catalog, rating: 10 }));
  assert.match(limits, /6 bashing per turn/);
  assert.match(limits, /12 hours/);
  assert.equal(translate("pt-BR", "werewolf.bans"), "Proibições");
  assert.equal(translate("pt-BR", "werewolf.bashingPerTurn", { amount: 6 }), "6 de dano contusivo por turno");
  assert.equal(traitsPresentation["flesh-oath"].description, "Violar o Juramento da Lua (apenas Destituídos).");
});

test("WtF 2e pp. 115–121 preserves all twenty-five Moon Facets with complete EN/PT mechanics", () => {
  assert.equal(moonGifts.length, 5);
  assert.equal(moonGifts.flatMap(gift => gift.facets).length, 25);
  for (const id of reference.auspices.map(auspice => auspice.moonGiftId)) {
    const gift = moonGifts.find(item => item.id === id);
    assert.ok(gift, id);
    assert.equal(gift.kind, "moon");
    assert.deepEqual(gift.facets.map(facet => facet.level), [1, 2, 3, 4, 5]);
    assert.equal(reference.auspices.find(item => item.id === gift.auspiceId).moonGiftId, id);
    for (const facet of gift.facets) {
      assert.equal(facet.renown, gift.renown);
      assert.equal(facet.sourceId, "wtf-2ed");
      for (const [field, text] of Object.entries(facet).filter(([key, value]) => typeof value === "string" && !["id", "renown", "source", "sourceId"].includes(key))) {
        assert.ok(text.length, `${facet.id}: ${field}`);
        assert.ok(moonPresentation[facet.id][field]?.length, `${facet.id}: pt-BR ${field}`);
      }
      for (const field of ["dramaticFailure", "failure", "success", "exceptionalSuccess"])
        assert.equal(Boolean(facet[field]), facet.hasRoll, `${facet.id}: ${field}`);
    }
  }
  assert.equal(new Set(moonGifts.flatMap(gift => gift.facets.map(facet => facet.id))).size, moonGifts.flatMap(gift => gift.facets).length);
  const full = moonGifts.find(item => item.id === "gift-full-moon");
  const hunter = full.facets.find(item => item.level === 3);
  assert.match(hunter.activationRequirement, /Siskur-Dah/);
  assert.match(hunter.effect, /Do not apply this bonus against the Hunt's prey itself/);
  assert.equal(full.facets[1].cost, undefined, "Warrior's Hide must not invent a cost");
  assert.match(moonPresentation[full.facets[0].id].effect, /8-novamente/);
  const half = moonGifts.find(item => item.id === "gift-half-moon");
  assert.equal(half.facets[4].dicePool, "Stamina + Empathy + Honor vs Stamina + Primal Urge");
  assert.match(half.facets[4].activationRequirement, /resist with Stamina \+ Primal Urge/);
  assert.equal(half.facets[3].options, "Allies; Alternate Identity; Contacts; Resources; Status.");
  assert.equal(moonPresentation["gift-new-moon:divide-and-conquer"].dramaticFailure.includes(readJson("public/shared/data/conditions-pt.json").spooked.name), true);
});

test("WtF 2e pp. 136–138 preserves all fifteen Wolf Facets and their EN/PT exceptions without invented roll outcomes", () => {
  assert.deepEqual(wolfGifts.map(gift => gift.id), ["gift-change", "gift-hunting", "gift-pack"]);
  const records = wolfGifts.flatMap(gift => [gift, ...gift.facets]);
  assert.equal(records.length, 18);
  assert.equal(new Set(records.map(item => item.id)).size, 18);
  assert.deepEqual(new Set(Object.keys(wolfPresentation)), new Set(records.map(item => item.id)));
  for (const gift of wolfGifts) {
    assert.equal(gift.kind, "wolf");
    assert.equal(gift.facets.length, 5);
    assert.deepEqual(new Set(gift.facets.map(facet => facet.renown)), new Set(["Cunning", "Glory", "Honor", "Purity", "Wisdom"]));
    for (const facet of gift.facets) {
      assert.ok(facet.id.startsWith(`${gift.id}:`));
      assert.equal(facet.level, undefined, "Wolf Facets have no ordered Moon Gift levels");
      assert.ok(facet.description && facet.effect);
      assert.equal(Boolean(facet.dicePool), facet.hasRoll);
      for (const field of ["dramaticFailure", "failure", "success", "exceptionalSuccess"])
        assert.equal(facet[field], undefined, "These Wolf Facets print effects, not separate outcomes");
    }
  }
  for (const item of records) {
    assert.equal(item.sourceId, "wtf-2ed");
    assert.equal(item.source, "Werewolf: The Forsaken Second Edition");
    assert.ok(item.page >= 136 && item.page <= 138);
    for (const page of item.additionalPages ?? []) assert.ok(page >= 136 && page <= 138);
    const textFields = Object.entries(item).filter(([key, value]) => typeof value === "string" && !["id", "renown", "kind", "source", "sourceId"].includes(key));
    assert.deepEqual(new Set(Object.keys(wolfPresentation[item.id])), new Set(textFields.map(([key]) => key)));
    for (const [field, text] of textFields) {
      assert.ok(text.length && wolfPresentation[item.id][field]?.length, `${item.id}.${field}`);
    }
  }
  const facet = id => wolfGifts.flatMap(gift => gift.facets).find(item => item.id === id);
  assert.match(facet("gift-change:skin-thief").effect, /without otherwise changing its traits/);
  assert.match(facet("gift-change:skin-thief").effect, /Spend 1 Willpower/);
  assert.match(facet("gift-change:the-fathers-form").effect, /more than Purity Renown/);
  assert.match(facet("gift-change:the-fathers-form").effect, /breaking point toward Flesh/);
  assert.equal(facet("gift-change:the-fathers-form").action, undefined);
  assert.equal(facet("gift-change:quicksilver-flesh").options.split("\n").length, 5);
  assert.match(facet("gift-change:quicksilver-flesh").options, /lose any bite attack \(Urshul, Urhan\)/);
  assert.match(facet("gift-hunting:impossible-spoor").effect, /each successful Tracking roll .*but none to a failed roll/);
  assert.match(facet("gift-hunting:tireless-hunter").effect, /only when the action advances the hunt/);
  assert.equal(facet("gift-pack:totems-wrath").dicePool, "Presence + Occult + Honor vs Power + Finesse + Resistance");
  assert.match(facet("gift-pack:totems-wrath").effect, /never attacks a packmate with the Totem Merit/);
  assert.match(facet("gift-pack:totems-wrath").effect, /one day per turn/);
  assert.equal(facet("gift-pack:down-the-prey").options.split("\n").length, 3);
  assert.match(facet("gift-pack:down-the-prey").options, /Defense against the attack was 0/);
});

test("WtF 2e pp. 121–136 preserves all fifteen Core Shadow Gifts with complete EN/PT text", () => {
  assert.deepEqual(shadowGifts.map(gift => gift.id), ["gift-death", "gift-dominance", "gift-elemental", "gift-evasion", "gift-insight", "gift-inspiration", "gift-knowledge", "gift-nature", "gift-rage", "gift-shaping", "gift-stealth", "gift-strength", "gift-technology", "gift-warding", "gift-weather"]);
  const records = shadowGifts.flatMap(gift => [gift, ...gift.facets]);
  assert.equal(records.length, 90);
  assert.equal(new Set(records.map(item => item.id)).size, 90);
  assert.deepEqual(new Set(Object.keys(shadowPresentation)), new Set(records.map(item => item.id)));
  for (const gift of shadowGifts) {
    assert.equal(gift.kind, "shadow");
    assert.ok(reference.auspices.some(item => item.giftIds.includes(gift.id)) || reference.tribes.some(item => item.giftIds.includes(gift.id)));
    assert.equal(gift.facets.length, 5);
    assert.deepEqual(new Set(gift.facets.map(facet => facet.renown)), new Set(["Cunning", "Glory", "Honor", "Purity", "Wisdom"]));
    for (const facet of gift.facets) {
      assert.ok(facet.id.startsWith(`${gift.id}:`));
      assert.equal(facet.level, undefined, "Shadow Facets are chosen by Renown, not ordered Moon levels");
      assert.equal(Boolean(facet.dicePool), facet.hasRoll);
      const results = ["dramaticFailure", "failure", "success", "exceptionalSuccess"].filter(key => facet[key]);
      if (["gift-evasion:fog-of-war", "gift-knowledge:this-story-is-true"].includes(facet.id)) {
        assert.deepEqual(results, ["dramaticFailure", "failure", "success"]);
      } else assert.ok(results.length === 0 || results.length === 4);
      if (!facet.hasRoll) assert.equal(results.length, 0);
      if (results.length === 0) assert.ok(facet.effect);
    }
  }
  for (const item of records) {
    assert.equal(item.sourceId, "wtf-2ed");
    assert.equal(item.source, "Werewolf: The Forsaken Second Edition");
    assert.ok(item.page >= 121 && item.page <= 136);
    for (const page of item.additionalPages ?? []) assert.ok(page >= 121 && page <= 136);
    const fields = Object.entries(item).filter(([key, value]) => typeof value === "string" && !["id", "renown", "kind", "source", "sourceId"].includes(key));
    assert.deepEqual(new Set(Object.keys(shadowPresentation[item.id])), new Set(fields.map(([key]) => key)));
    for (const [field, text] of fields) assert.ok(text.length && shadowPresentation[item.id][field]?.length, `${item.id}.${field}`);
  }
  const facet = id => shadowGifts.flatMap(gift => gift.facets).find(item => item.id === id);
  const cold = facet("gift-death:cold-embrace");
  assert.match(cold.success, /natural regeneration stops/);
  assert.match(cold.success, /5 − Cunning Renown/);
  assert.match(cold.exceptionalSuccess, /all damage/);
  const bone = facet("gift-death:bone-gnaw");
  assert.equal(bone.options.split("\n").length, 4);
  assert.match(bone.effect, /Only seeking a particular important secret/);
  assert.match(bone.activationRequirement, /older than six months/);
  assert.equal(bone.success, undefined, "Bone Gnaw does not print separate outcomes");
  assert.match(facet("gift-death:barghest").effect, /Gauru, Urshul, or Urhan/);
  assert.match(facet("gift-death:barghest").effect, /no Willpower remaining.*two additional lethal/);
  assert.match(facet("gift-dominance:primal-allure").success, /only for social goals requiring immediate action/);
  assert.match(facet("gift-dominance:primal-allure").success, /breaking point immediately ends/);
  assert.match(facet("gift-dominance:primal-allure").exceptionalSuccess, /ends after that action/);
  assert.equal(facet("gift-dominance:lay-low-the-challenger").dicePool, "Presence + Intimidation + Honor vs Composure + Primal Urge");
  assert.match(facet("gift-dominance:lead-the-lesser-pack").effect, /at most Wisdom Renown temporary pack members/);
  const elemental = shadowGifts.find(gift => gift.id === "gift-elemental");
  for (const influence of elemental.facets.filter(facet => facet.cost === "Varies")) {
    assert.equal(influence.action, undefined);
    assert.equal(influence.duration, undefined);
    assert.equal(influence.success, undefined);
    assert.match(influence.effect, /Use it as a spirit uses Influence/);
  }
  assert.match(facet("gift-elemental:catastrophe").success, /radius of twice Glory Renown in miles/);
  assert.match(facet("gift-elemental:catastrophe").exceptionalSuccess, /Further uses of Catastrophe still cost Essence/);
});

test("WtF 2e pp. 123–127 retains Evasion, Insight and Inspiration's conditional effects and exact resistance", () => {
  const facet = id => shadowGifts.flatMap(gift => gift.facets).find(item => item.id === id);
  const feet = facet("gift-evasion:feet-of-mist");
  assert.match(feet.effect, /rote quality/);
  assert.match(feet.effect, /not make her invisible/);
  const fog = facet("gift-evasion:fog-of-war");
  assert.equal(fog.exceptionalSuccess, undefined, "No exceptional result is printed for Fog of War");
  assert.match(fog.activationRequirement, /deliverer|delivers|delivering/i);
  assert.match(fog.success, /1 additional Essence/);
  const hit = facet("gift-evasion:hit-and-run");
  assert.match(hit.effect, /immediately disengage/i);
  assert.match(hit.effect, /highest Composure/);
  assert.equal(hit.failure, "No further effect occurs.");
  const exit = facet("gift-evasion:exit-strategy");
  assert.match(exit.effect, /immediately reveals all usable escape routes/);
  assert.match(exit.effect, /Alternatively/);
  assert.equal(exit.options.split("\n").length, 4);
  assert.match(exit.exceptionalSuccess, /except attack rolls/);
  const loom = facet("gift-insight:read-the-worlds-loom");
  assert.equal(loom.cost, "5 Essence; 3 Essence in the pack's territory");
  assert.equal(loom.options.split("\n").length, 7);
  assert.match(loom.success, /beyond 24 hours/);
  assert.match(facet("gift-insight:echo-dream").exceptionalSuccess, /characters perceived in the vision/);
  const scent = facet("gift-insight:scent-the-unnatural");
  assert.match(scent.effect, /10 yards per Purity/);
  assert.match(scent.effect, /excludes Uratha and Gifts/);
  assert.match(scent.success, /neither the type of Host nor the claiming spirit/);
  const lunatic = facet("gift-inspiration:lunatic-inspiration");
  assert.equal(lunatic.dicePool, "Manipulation + Empathy + Cunning vs Composure");
  assert.match(lunatic.activationRequirement, /human or Wolf-Blooded/);
  assert.match(lunatic.success, /After the prey next sleeps/);
  assert.match(lunatic.success, /completing it resolves Madness/);
  assert.match(shadowPresentation[lunatic.id].exceptionalSuccess, /Enamorado/);
  assert.match(facet("gift-inspiration:fearless-hunter").effect, /can see the Uratha.*same effect/);
  const triumph = facet("gift-inspiration:pack-triumphs-together");
  assert.match(triumph.cost, /minimum 1 Essence/);
  assert.match(triumph.effect, /After every Initiative roll/);
  assert.match(triumph.effect, /8-again on teamwork rolls/);
  assert.match(facet("gift-inspiration:unity").effect, /only once against that particular maneuver/);
  const voice = facet("gift-inspiration:still-small-voice");
  assert.equal(voice.dicePool, "Presence + Persuasion + Wisdom vs Resolve + Primal Urge");
  assert.match(voice.activationRequirement, /cannot choose not to resist/);
  assert.match(voice.exceptionalSuccess, /All Uratha present who can hear/);
});

test("WtF 2e pp. 127–131 retains Knowledge Nature and Rage exceptions and the adopted Lore of the Land pool", async () => {
  const facet = id => shadowGifts.flatMap(gift => gift.facets).find(item => item.id === id);
  const needle = facet("gift-knowledge:needle");
  assert.equal(needle.dicePool, "Manipulation + Subterfuge + Cunning vs Composure + Primal Urge");
  assert.match(needle.success, /research times are doubled/);
  assert.equal(shadowPresentation[needle.id].name, "Agulha");
  const story = facet("gift-knowledge:this-story-is-true");
  assert.match(story.success, /two or fewer.*above five/);
  assert.match(story.success, /another immediately removes the previous/);
  assert.equal(story.exceptionalSuccess, undefined, "The source has no separate exceptional outcome");
  const know = facet("gift-knowledge:know-thy-prey");
  assert.match(know.activationRequirement, /Anonymity penalizes.*otherwise has no resistance/);
  assert.match(know.failure, /same target this scene/);
  assert.match(know.success, /Alternate Identity or Fame/);
  assert.match(know.success, /dots do not exceed successes/);
  const lore = facet("gift-knowledge:lore-of-the-land");
  assert.equal(lore.dicePool, "Intelligence + Survival + Purity", "Explicit user decision fills the source omission");
  assert.equal(shadowPresentation[lore.id].dicePool, "Inteligência + Sobrevivência + Pureza");
  assert.match(lore.success, /In the pack's territory/);
  assert.match(lore.success, /Purity Renown × 100 yards/);
  assert.match(lore.success, /Twilight are not detected/);
  const sift = facet("gift-knowledge:sift-the-sands");
  assert.equal(sift.action, "Extended (10 successes; 1 roll per minute)");
  assert.match(sift.success, /Within one hour.*spend 1 Essence/);
  assert.match(sift.exceptionalSuccess, /one month.*double speed/);
  const lure = facet("gift-nature:natures-lure");
  assert.match(lure.activationRequirement, /Cannot affect Uratha.*larger group/);
  assert.match(lure.success, /Initiative penalty/);
  assert.match(lure.exceptionalSuccess, /Perception penalty/);
  assert.match(shadowPresentation[lure.id].dramaticFailure, /Assombrado/);
  const earth = facet("gift-nature:black-earth-red-hunger");
  assert.match(earth.effect, /Over one minute.*Glory Renown × 10 yards/);
  assert.match(earth.effect, /dead bodies present at activation/);
  assert.match(earth.effect, /next sunrise/);
  assert.match(earth.effect, /another creature is injured.*without paying Essence/);
  const paths = facet("gift-nature:knotted-paths");
  assert.match(paths.exceptionalSuccess, /group.*separated.*Lone prey gain Shadow Paranoia/);
  const kin = facet("gift-nature:pack-kin");
  assert.equal(kin.action, "Extended (5 successes; 1 roll per 30 minutes)");
  assert.match(kin.success, /not obviously self-destructive/);
  assert.match(kin.success, /each Uratha.*their own group/);
  assert.match(kin.exceptionalSuccess, /animal for free.*Open.*only for the pack's totem/);
  assert.match(shadowPresentation[kin.id].activationRequirement, /Interlocutor das Feras/);
  const ride = facet("gift-nature:beast-ride");
  assert.equal(ride.dicePool, "Wits + Animal Ken + Wisdom − animal's Resolve");
  assert.match(ride.success, /animal dies.*breaking point towards Spirit/);
  assert.match(ride.success, /body dies.*unique Claimed/);
  const fury = facet("gift-rage:incite-fury");
  assert.match(fury.success, /Uratha prey enter Wasu-Im.*other supernatural beings gain Berserk/);
  assert.match(fury.success, /only once per scene/);
  const might = facet("gift-rage:berserkers-might");
  assert.match(might.activationRequirement, /once per turn.*Dalu or Gauru/);
  assert.match(might.effect, /one source.*one physical-injury Tilt/);
  assert.match(might.effect, /Basu-Im.*instinctively.*no Essence/);
  const slaughter = facet("gift-rage:slaughterer");
  assert.match(slaughter.activationRequirement, /Gauru.*Brawl attack hits/);
  assert.match(slaughter.effect, /Purity Renown.*Basu-Im/);
  assert.match(facet("gift-rage:perfected-rage").effect, /Honor Renown.*turns/);
  assert.match(facet("gift-rage:raging-lunacy").effect, /Berserk.*instead of another Lunacy Condition/);
  const { creationGiftSelection } = await vite.ssrLoadModule("/game-lines/werewolf/creation-rules.ts");
  const grants = creationGiftSelection(reference.auspices.find(item => item.id === "rahu"), reference.tribes.find(item => item.id === "blood-talons"), "Purity", giftCatalog.gifts,
    { shadow_facets: [slaughter.id, "gift-inspiration:fearless-hunter"], wolf_facets: [] });
  assert.deepEqual(grants.problems, [], "New Gift families are usable by creation's canonical validator");
});

test("WtF 2e pp. 131–136 preserves Shaping Stealth Strength Technology Warding and Weather exceptions", () => {
  const facet = id => shadowGifts.flatMap(gift => gift.facets).find(item => item.id === id);
  const mold = facet("gift-shaping:moldywarp");
  assert.equal(mold.activationRequirement, "Use only in Dalu.");
  assert.match(mold.effect, /Strength \+ Cunning Renown/);
  assert.match(facet("gift-shaping:shield-breaker").activationRequirement, /Brawl or Weaponry/);
  assert.match(facet("gift-shaping:entropys-toll").success, /two Structure damage per success.*all Durability/);
  const tool = facet("gift-shaping:perfection-of-form");
  assert.equal(tool.dicePool, "Wits + Crafts + Purity", "Printed Craft uses the canonical Crafts Skill identity");
  assert.match(tool.success, /next use.*Structure equal/);
  assert.match(tool.exceptionalSuccess, /9-again.*8-again/);
  const sculpt = facet("gift-shaping:sculpt");
  assert.match(sculpt.activationRequirement, /Size no greater than Wisdom Renown/);
  assert.match(sculpt.success, /another 30 minutes, indefinitely/);
  assert.match(sculpt.success, /unlikely to function/);
  assert.match(facet("gift-stealth:shadow-pelt").effect, /number of Stealth rolls equal to Cunning Renown.*Rote Actions/);
  assert.match(facet("gift-stealth:pack-stalks-the-prey").activationRequirement, /Uratha succeeds.*packmate fails/);
  assert.match(facet("gift-stealth:the-hunter-waits").effect, /Perception and supernatural power rolls/);
  const silent = facet("gift-stealth:running-silent");
  assert.match(silent.effect, /falling damage.*terrain-imposed.*Wisdom Renown/);
  assert.match(silent.effect, /full speed/);
  const unchained = facet("gift-strength:unchained");
  assert.match(unchained.effect, /rote quality on the Clash of Wills/);
  assert.match(unchained.effect, /Cunning Renown to grappling/);
  assert.match(unchained.effect, /Basu-Im.*without spending Essence/);
  const pursuit = facet("gift-strength:predators-unmatched-pursuit");
  assert.match(pursuit.effect, /1 \+ Glory Renown/);
  assert.match(pursuit.effect, /Urhan and Urshul.*1 Essence.*any form for one turn/);
  const blow = facet("gift-strength:crushing-blow");
  assert.match(blow.activationRequirement, /even if it inflicts no damage/);
  assert.match(blow.effect, /next attack.*packmate only.*Hishu.*lethal rather than bashing/);
  assert.match(facet("gift-strength:primal-strength").effect, /Purity Renown to Strength.*Basu-Im/);
  const claws = facet("gift-strength:rending-claws");
  assert.equal(claws.duration, "Permanent");
  assert.equal(claws.cost, undefined, "Do not invent a Cost for a permanent Facet");
  assert.match(claws.activationRequirement, /Gauru or Urshul/);
  assert.match(claws.effect, /Durability.*additional Structure/);
  assert.equal(facet("gift-technology:garble").dicePool, "Intelligence + Science + Cunning − Composure");
  const unmake = facet("gift-technology:unmake");
  assert.match(unmake.dicePool, /contested only if the item is being used/);
  assert.match(unmake.activationRequirement, /Glory Renown × 5.*unattended item does not/);
  assert.match(unmake.exceptionalSuccess, /one month.*dramatic failure/);
  assert.match(facet("gift-technology:command-artifice").success, /one-sentence.*Honor Renown hours/);
  const shutdown = facet("gift-technology:shutdown");
  assert.equal(shutdown.dicePool, "Presence + Intimidation + Purity", "Printed Intimidate uses the canonical Intimidation Skill identity");
  assert.match(shutdown.success, /whichever is larger/);
  assert.match(shutdown.exceptionalSuccess, /Siskur-Dah.*Shadow Paranoia/);
  assert.match(facet("gift-technology:iron-slave").success, /breaking point towards Spirit.*may create a unique Claimed/);
  assert.match(facet("gift-warding:maze-ward").effect, /other than a packmate.*failing|other than a packmate.*Failing/);
  const den = facet("gift-warding:ward-the-wolfs-den");
  assert.match(den.effect, /Cunning Renown × 10 yards/, "Keep the printed Cunning-based radius of this Glory Facet");
  assert.match(den.effect, /Glory Renown.*1 Essence.*Clash of Wills.*Glory Renown hours/);
  assert.match(facet("gift-warding:predators-claim").effect, /above five.*still does not.*six or greater/);
  const boundary = facet("gift-warding:boundary-ward");
  assert.match(boundary.effect, /pack's territory.*Wisdom Renown miles/);
  assert.match(boundary.effect, /do not track them after entry/);
  const mist = facet("gift-weather:cloak-of-mist-and-haze");
  assert.equal(mist.action, "Extended (5 successes; 1 roll per minute)");
  assert.match(mist.success, /auditory and visual Perception.*ranged attack.*Cunning Renown/);
  assert.match(mist.exceptionalSuccess, /Wits \+ Survival − Cunning Renown/);
  const heavens = facet("gift-weather:heavens-unleashed");
  assert.equal(heavens.action, "Extended (10 successes; 1 roll per minute)");
  assert.match(heavens.success, /Speed and Initiative penalties equal to Glory Renown/);
  assert.match(heavens.exceptionalSuccess, /Allies, Contacts, Retainer, Staff, and Status/);
  assert.match(heavens.exceptionalSuccess, /does not specify this penalty's value/, "Do not invent a value absent from the book and user replies");
  for (const item of [mist, heavens]) {
    assert.match(item.success, /does not specify the affected area's extent/);
    assert.match(shadowPresentation[item.id].success, /não especifica a extensão/);
  }
  const ironSky = facet("gift-weather:hunt-under-iron-skies");
  assert.match(ironSky.effect, /Honor Renown.*own Weather Facets.*1 Essence per packmate/);
  const wind = facet("gift-weather:grasp-of-howling-winds");
  assert.equal(wind.dicePool, "Manipulation + Survival + Purity − Stamina");
  assert.match(wind.success, /all Physical pools.*escapes the Uratha's view/);
  assert.match(wind.exceptionalSuccess, /twice Purity Renown in yards/);
  assert.match(facet("gift-weather:hunt-of-fire-and-ice").success, /Extreme Cold or Extreme Heat.*Wisdom Renown miles/);
});

test("WtF 2e complete Core Gifts support every valid Auspice Tribe and creation Renown choice", async () => {
  const { creationGiftAllowance, creationGiftSelection } = await vite.ssrLoadModule("/game-lines/werewolf/creation-rules.ts");
  const renowns = ["Cunning", "Glory", "Honor", "Purity", "Wisdom"];
  for (const auspice of reference.auspices) for (const tribe of reference.tribes) {
    assert.ok([...auspice.giftIds, ...tribe.giftIds].every(id => shadowGifts.some(gift => gift.id === id)));
    for (const choice of renowns) {
      if (auspice.renown === tribe.renown && choice === auspice.renown) continue; // Printed creation cap: never grant three dots.
      const allowance = creationGiftAllowance(auspice, tribe, choice);
      const parents = shadowGifts.filter(gift => allowance.shadowGiftIds.includes(gift.id) && gift.facets.some(facet => allowance.renown[facet.renown] > 0));
      assert.ok(parents.length >= 2, `${auspice.id}/${tribe.id}/${choice} needs two distinct favored Shadow Gifts`);
      const selections = {
        shadow_facets: parents.slice(0, 2).map(gift => gift.facets.find(facet => allowance.renown[facet.renown] > 0).id),
        wolf_facets: allowance.wolfFacetCount ? [wolfGifts.flatMap(gift => gift.facets).find(facet => allowance.renown[facet.renown] > 0).id] : [],
      };
      assert.deepEqual(creationGiftSelection(auspice, tribe, choice, giftCatalog.gifts, selections).problems, [], `${auspice.id}/${tribe.id}/${choice}`);
    }
  }
});

test("Werewolf Gifts load only their canonical and Portuguese shards into an immutable snapshot", async () => {
  const { werewolfGiftsCatalogGroup } = await vite.ssrLoadModule("/game-lines/werewolf/catalogs/gifts.ts");
  const { freezeCatalogData } = await vite.ssrLoadModule("/lib/catalog/catalog-service.ts");
  const calls = [];
  const snapshot = freezeCatalogData(await werewolfGiftsCatalogGroup.load({ getCatalog: async id => {
    calls.push(id);
    const fixtures = { "werewolf-gifts-core-moon": moonGifts, "werewolf-gifts-core-moon-pt": moonPresentation,
      "werewolf-gifts-core-wolf": wolfGifts, "werewolf-gifts-core-wolf-pt": wolfPresentation,
      "werewolf-gifts-core-shadow": shadowGifts, "werewolf-gifts-core-shadow-pt": shadowPresentation };
    assert.ok(Object.hasOwn(fixtures, id), `Unexpected catalog request: ${id}`);
    return structuredClone(fixtures[id]);
  } }));
  assert.deepEqual(calls, ["werewolf-gifts-core-moon", "werewolf-gifts-core-moon-pt", "werewolf-gifts-core-wolf", "werewolf-gifts-core-wolf-pt", "werewolf-gifts-core-shadow", "werewolf-gifts-core-shadow-pt"]);
  assert.equal(snapshot.gifts.length, 23);
  assert.equal(snapshot.gifts.flatMap(gift => gift.facets).length, 115);
  assert.deepEqual(snapshot.gifts.map(gift => gift.id), [...moonGifts, ...wolfGifts, ...shadowGifts].map(gift => gift.id));
  assert.equal(new Set(snapshot.gifts.flatMap(gift => [gift.id, ...gift.facets.map(facet => facet.id)])).size, 138);
  assert.ok(Object.isFrozen(snapshot.gifts[0].facets[0]));
  assert.ok(Object.isFrozen(snapshot.presentation[snapshot.gifts[0].facets[0].id]));
  assert.ok(Object.isFrozen(snapshot.gifts[5].facets[0]));
  assert.ok(Object.isFrozen(snapshot.presentation["gift-pack:totems-wrath"]));
  assert.ok(Object.isFrozen(snapshot.gifts[8].facets[0]));
  assert.ok(Object.isFrozen(snapshot.presentation["gift-elemental:catastrophe"]));
  assert.ok(Object.isFrozen(snapshot.gifts.at(-1).facets[0]));
  assert.ok(Object.isFrozen(snapshot.presentation["gift-inspiration:still-small-voice"]));
  assert.ok(Object.isFrozen(snapshot.presentation["gift-rage:raging-lunacy"]));
  assert.ok(Object.isFrozen(snapshot.presentation["gift-weather:hunt-of-fire-and-ice"]));
});
