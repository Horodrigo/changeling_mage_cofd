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
  const choices = { auspice_id: "rahu", tribe_id: "blood-talons", auspice_skill: "Brawl", renown_choice: "Purity", primal_urge: 1, extra_rite_dots: 0, blood: "blood-soldier", bone: "bone-lone-wolf", physical_touchstone: "My family", spiritual_touchstone: "The mountain" };
  assert.deepEqual(rules.creationTemplateProblems(choices, reference, { Brawl: 2 }), []);
  assert.deepEqual(rules.creationTemplateProblems({ ...choices, auspice_id: "unknown" }, reference, { Brawl: 2 }), ["auspice"]);
  assert.deepEqual(rules.creationTemplateProblems({ ...choices, primal_urge: 3, extra_rite_dots: 1 }, reference, { Brawl: 2 }), ["creationBudget"]);
  assert.deepEqual(rules.creationTemplateProblems({ ...choices, primal_urge: 1.5 }, reference, { Brawl: 2 }), ["creationBudget"]);
  assert.deepEqual(rules.creationTemplateProblems({ ...choices, auspice_skill: "Brawl" }, reference, { Brawl: 5 }), ["auspiceSkill"]);
  const { WerewolfCreationTemplate } = await vite.ssrLoadModule("/game-lines/werewolf/builder-template.tsx");
  const { LanguageProvider, translate } = await vite.ssrLoadModule("/lib/i18n.tsx");
  const markup = renderToStaticMarkup(createElement(LanguageProvider, null, createElement(WerewolfCreationTemplate, { value: choices, onChange: () => {}, skills: { Brawl: 2 }, reference: catalog })));
  assert.match(markup, /Remaining Merit dots: 10/);
  assert.match(markup, /Available Rite dots: 2/);
  assert.match(markup, /Starting Facets: 2/);
  assert.match(markup, /value="My family"/);
  assert.doesNotMatch(markup, /missing translation/);
  assert.equal(translate("pt-BR", "werewolf.renownNames.Purity"), "Pureza");
  assert.equal(translate("pt-BR", "werewolf.creationProblem.creationBudget"), "Instinto Primitivo e Ritos extras devem caber nos dez pontos iniciais de Méritos.");
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
  assert.equal(translate("pt-BR", "werewolf.bashingPerTurn", { amount: 6 }), "6 de dano contundente por turno");
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

test("WtF 2e pp. 121–123 preserves the Death, Dominance and Elemental Facets with complete EN/PT text", () => {
  assert.deepEqual(shadowGifts.map(gift => gift.id), ["gift-death", "gift-dominance", "gift-elemental"]);
  const records = shadowGifts.flatMap(gift => [gift, ...gift.facets]);
  assert.equal(records.length, 18);
  assert.equal(new Set(records.map(item => item.id)).size, 18);
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
      assert.ok(results.length === 0 || results.length === 4);
      if (!facet.hasRoll) assert.equal(results.length, 0);
      if (results.length === 0) assert.ok(facet.effect);
    }
  }
  for (const item of records) {
    assert.equal(item.sourceId, "wtf-2ed");
    assert.equal(item.source, "Werewolf: The Forsaken Second Edition");
    assert.ok(item.page >= 121 && item.page <= 123);
    for (const page of item.additionalPages ?? []) assert.ok(page >= 121 && page <= 123);
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
  assert.equal(snapshot.gifts.length, 11);
  assert.equal(snapshot.gifts.flatMap(gift => gift.facets).length, 55);
  assert.deepEqual(snapshot.gifts.map(gift => gift.id), [...moonGifts, ...wolfGifts, ...shadowGifts].map(gift => gift.id));
  assert.equal(new Set(snapshot.gifts.flatMap(gift => [gift.id, ...gift.facets.map(facet => facet.id)])).size, 66);
  assert.ok(Object.isFrozen(snapshot.gifts[0].facets[0]));
  assert.ok(Object.isFrozen(snapshot.presentation[snapshot.gifts[0].facets[0].id]));
  assert.ok(Object.isFrozen(snapshot.gifts[5].facets[0]));
  assert.ok(Object.isFrozen(snapshot.presentation["gift-pack:totems-wrath"]));
  assert.ok(Object.isFrozen(snapshot.gifts[8].facets[0]));
  assert.ok(Object.isFrozen(snapshot.presentation["gift-elemental:catastrophe"]));
});
