import assert from "node:assert/strict";
import test, { after } from "node:test";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { createServer } from "vite";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

const root = fileURLToPath(new URL("..", import.meta.url));
const readJson = path => JSON.parse(readFileSync(new URL(`../${path}`, import.meta.url), "utf8"));
const reference = readJson("public/data/werewolf/reference.json");
const presentation = readJson("public/data/werewolf/reference-pt.json");
const vite = await createServer({ appType: "custom", configFile: false, root,
  resolve: { alias: { "@": root } }, server: { middlewareMode: true, hmr: false },
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
  assert.equal(rules.creationMeritBudget(1, 0), 10);
  assert.equal(rules.creationMeritBudget(2, 5), 0);
  assert.equal(rules.creationMeritBudget(3, 0), 0);
  assert.throws(() => rules.creationMeritBudget(4), /Invalid/);
  assert.throws(() => rules.creationMeritBudget(3, 1), /exceed/);
  assert.throws(() => rules.creationMeritBudget(1, 6), /Invalid/);
});

test("Werewolf reference group loads only its two catalogs and is deeply immutable", async () => {
  const { werewolfReferenceCatalogGroup } = await vite.ssrLoadModule("/game-lines/werewolf/catalogs/reference.ts");
  const { freezeCatalogData } = await vite.ssrLoadModule("/lib/catalog/catalog-service.ts");
  const calls = [];
  const snapshot = freezeCatalogData(await werewolfReferenceCatalogGroup.load({
    async getCatalog(id) { calls.push(id); return structuredClone(id.endsWith("-pt") ? presentation : reference); },
  }));
  assert.deepEqual(calls, ["werewolf-reference", "werewolf-reference-pt"]);
  assert.ok(Object.isFrozen(snapshot.forms[3].attributes));
  assert.ok(Object.isFrozen(snapshot.presentation.urshul));
  assert.throws(() => { snapshot.forms[3].attributes.Manipulation = -3; }, TypeError);
});

test("Werewolf forms render five comparison columns with native disclosures and translated labels", async () => {
  const { LanguageProvider, translate } = await vite.ssrLoadModule("/lib/i18n.tsx");
  const { FormsTable } = await vite.ssrLoadModule("/game-lines/werewolf/forms-table.tsx");
  const markup = renderToStaticMarkup(createElement(LanguageProvider, null, createElement(FormsTable, {
    character, reference: { ...reference, presentation },
  })));
  for (const form of reference.forms) assert.match(markup, new RegExp(`<th scope="col">${form.name}</th>`));
  assert.equal((markup.match(/<details/g) ?? []).length, 5);
  assert.doesNotMatch(markup, /missing translation/);
  assert.match(markup, /Manipulation/);
  assert.equal(translate("pt-BR", "werewolf.primalUrge"), "Instinto Primitivo");
  assert.equal(translate("pt-BR", "werewolf.harmony"), "Harmonia");
});
