import assert from "node:assert/strict";
import test, { after } from "node:test";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { createServer } from "vite";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

const root = fileURLToPath(new URL("..", import.meta.url));
const vite = await createServer({ appType: "custom", configFile: false, root, resolve: { alias: { "@": root } }, server: { middlewareMode: true, hmr: false }, optimizeDeps: { noDiscovery: true, include: [] } });
after(() => vite.close());
const read = async path => JSON.parse(await readFile(new URL(path, new URL("../", import.meta.url)), "utf8"));
const catalog = [...await read("public/shared/data/merits.json"), ...await read("public/game-lines/vampire/data/merits.json")];
const covenants = await read("public/game-lines/vampire/data/covenants.json");
const powers = await read("public/game-lines/vampire/data/powers.json");
const { vampireMeritEligible: eligible, vampireTextPrerequisitesMet: parse, vampireMeritContextForSheet, vampireMeritTraits } = await vite.ssrLoadModule("/game-lines/vampire/merit-eligibility.ts");
const { meritPrerequisitesMet, meritSelectionProblems } = await vite.ssrLoadModule("/lib/merits.ts");
const { canonicalTrait, requirementMet } = await vite.ssrLoadModule("/lib/merit-requirements.ts");
const get = id => { const row = catalog.find(item => item.id === id); assert.ok(row, id); return row; };
const owned = (id, dots = 5, configuration) => ({ definitionId: id, instanceId: id, name: "Rótulo alterado", dots, configuration });
const ctx = { gameLine: "VtR", meritCatalog: catalog, covenants, archetypes: ["vampire", "mekhet", "carthian-movement", "circle-of-the-crone"], clanId: "mekhet", creation: true, attributes: { Presence: 3, Resolve: 3, Composure: 3 }, skills: { Politics: 2, Socialize: 2, Occult: 3, Science: 3, Crafts: 3, AnimalKen: 3 }, traits: { ...vampireMeritTraits({}), Humanity: 5 }, merits: [], specializations: [] };
const buy = (id, changes = {}, zirnitra = 0) => eligible(get(id), { ...ctx, ...changes }, zirnitra);

test("all 264 distributed Vampire homebrew Merits evaluate printed prerequisites", () => {
  const sources = new Set(["h-vtr-agony-ecstasy", "h-vtr-fire-revolution", "h-vtr-sin-again", "h-vtr-wild-hunt", "h-vtr-strange-shades", "h-vtr-better-feared", "h-vtr-false-gods", "vtr-sin-again", "vtr-wild-hunt", "vtr-strange-shades", "vtr-better-feared", "vtr-false-gods"]);
  const rows = catalog.filter(item => sources.has(item.sourceId) && item.homebrew);
  assert.equal(rows.length, 264);
  assert.ok(rows.every(item => !item.descriptivePrerequisites));
  const traits = { ...Object.fromEntries(Object.keys(ctx.attributes).map(name => [name, 10])), ...vampireMeritTraits({}), Humanity: 10, "Blood Potency": 10 };
  const skills = Object.fromEntries(["Academics", "Computer", "Crafts", "Investigation", "Medicine", "Occult", "Politics", "Science", "Athletics", "Brawl", "Drive", "Firearms", "Larceny", "Stealth", "Survival", "Weaponry", "Animal Ken", "Empathy", "Expression", "Intimidation", "Persuasion", "Socialize", "Streetwise", "Subterfuge"].map(name => [name, 10]));
  Object.keys(traits).forEach(name => traits[name] = 10);
  for (const row of rows) {
    for (const clause of (row.prerequisites ?? "").split(";").map(item => item.trim())) {
      const match = clause.match(/^(.+?) (•+|\d+)$/);
      if (!match || ![...Object.keys(traits), ...Object.keys(skills)].some(name => canonicalTrait(name) === canonicalTrait(match[1]))) continue;
      const minimum = match[2].startsWith("•") ? match[2].length : Number(match[2]);
      const high = { ...ctx, traits, skills, attributes: traits };
      assert.equal(parse(clause, high), true, row.id + ": " + clause);
      const low = { ...high, traits: { ...traits, [match[1]]: minimum - 1 }, skills: { ...skills, [match[1]]: minimum - 1 }, attributes: { ...traits, [match[1]]: minimum - 1 } };
      assert.equal(parse(clause, low), false, row.id + ": " + clause);
    }
    for (const reference of row.requirements?.all ?? []) {
      const high = { ...ctx, merits: [owned(reference.merit, reference.minimum)] };
      assert.equal(requirementMet(reference, high), true, row.id);
      assert.equal(requirementMet(reference, { ...high, merits: [owned("homebrew:merit:namesake")] }), false, row.id);
      assert.equal(requirementMet(reference, { ...high, meritCatalog: catalog.filter(item => item.id !== reference.merit) }), false, row.id);
    }
  }
});

test("shared Human Merits respect ratings and specialties across every supported line", () => {
  for (const gameLine of ["CofD", "VtR", "CtL", "MtA", "WtF"]) {
    const context = { ...ctx, gameLine, merits: [owned("core-2ed:resources", 1)] };
    assert.equal(meritPrerequisitesMet(get("h-vtr-fire-revolution:electioneer"), context), true);
    assert.equal(meritPrerequisitesMet(get("h-vtr-fire-revolution:electioneer"), { ...context, skills: { Politics: 1 } }), false);
    assert.equal(meritPrerequisitesMet(get("h-vtr-agony-ecstasy:carousing"), context), true);
    assert.equal(meritPrerequisitesMet(get("h-vtr-agony-ecstasy:carousing"), { ...context, attributes: { Presence: 2 } }), false);
    for (const id of ["experimental-mindset", "flexible-loyalties"]) assert.equal(meritPrerequisitesMet(get("h-vtr-fire-revolution:" + id), context), true);
  }
  const myth = get("h-vtr-agony-ecstasy:mythologist");
  assert.equal(meritPrerequisitesMet(myth, ctx), false);
  assert.equal(meritPrerequisitesMet(myth, { ...ctx, specializations: [{ skill: "Occult", name: "Greek myths" }, { skill: "Occult", name: "Religion" }] }), true);
  assert.equal(meritPrerequisitesMet(get("h-vtr-agony-ecstasy:roughing-it"), { ...ctx, attributes: { Stamina: 3 }, skills: { Survival: 2 }, specializations: [{ skill: "Survival", name: "Forest" }] }), true);
});

test("mortal-only access is limited to mortals and Vampire's Zirnitra allowance", () => {
  const rows = catalog.filter(item => item.mortalOnly);
  assert.ok(rows.length > 0);
  for (const row of rows) for (const gameLine of ["VtR", "CtL", "MtA", "WtF"]) assert.equal(meritPrerequisitesMet(row, { ...ctx, gameLine }), false, row.id + gameLine);
  const row = rows.find(item => !item.prerequisites || /Mortal only/i.test(item.prerequisites) && !/•/.test(item.prerequisites));
  assert.ok(row);
  assert.equal(meritPrerequisitesMet(row, { ...ctx, gameLine: "CofD" }), true);
  assert.equal(eligible(row, ctx, 1), true);
  assert.equal(eligible(row, { ...ctx, gameLine: "CtL" }, 5), false);
  assert.equal(eligible(row, { ...ctx, merits: [owned(rows.find(item => item.id !== row.id).id)] }, 1), false);
  assert.equal(eligible(row, { ...ctx, merits: [owned(row.id)] }, 1), true);
});

test("Vampire prerequisites enforce templates, OR branches, maxima, Status domains and section access", () => {
  assert.equal(buy("vtr-false-gods:favored-servant"), false);
  assert.equal(buy("h-vtr-agony-ecstasy:hag-blood"), false);
  assert.equal(buy("vtr-false-gods:born-leader", { skills: { Persuasion: 3 }, traits: { Dominate: 1 } }), true);
  assert.equal(buy("vtr-false-gods:born-leader", { skills: { Persuasion: 2 }, archetypes: ["ventrue"] }), false);
  assert.equal(buy("vtr-better-feared:war-dog", { traits: { Resilience: 1 } }), true);
  assert.equal(buy("vtr-better-feared:war-dog", { traits: { Resilience: 0 } }), false);
  assert.equal(buy("vtr-better-feared:bottom-feeder", { archetypes: ["nosferatu"], traits: { "Blood Potency": 3 } }), false);
  assert.equal(buy("vtr-better-feared:bottom-feeder", { archetypes: ["nosferatu"], traits: { "Blood Potency": 2 } }), true);
  const law = "h-vtr-fire-revolution:birth-control";
  const status = owned("vtr-kindred-status", 3, { group: "carthian-movement" });
  assert.equal(buy(law, { merits: [status], traits: { "Blood Potency": 2 } }), true);
  assert.equal(buy(law, { merits: [{ ...status, configuration: { group: "Mekhet" } }], traits: { "Blood Potency": 2 } }), false);
  assert.equal(buy(law, { merits: [status], traits: { "Blood Potency": 1 } }), false);
  assert.equal(buy(law, { merits: [status], traits: { "Blood Potency": 2 }, archetypes: ["mekhet"] }), false);
  assert.equal(buy("h-vtr-fire-revolution:enforcement", { merits: [status], skills: { Firearms: 2 } }), true);
  assert.equal(buy("h-vtr-fire-revolution:enforcement", { merits: [status], skills: { Firearms: 1 } }), false);
  assert.equal(buy("vtr-better-feared:bleak-annals"), true);
  assert.equal(buy("vtr-wild-hunt:mystery-cult-initiation-council-of-talons"), true);
  assert.equal(buy("vtr-sin-again:guise", { archetypes: ["daeva"], hasTouchstone: true }), true);
});

test("relative ratings, exclusions, Crúac Styles, choices and creation-only restrictions", () => {
  assert.equal(buy("vtr-sin-again:fame-advanced", { merits: [owned("core-2ed:fame", 2)], selectedDots: 3 }), false);
  assert.equal(buy("vtr-sin-again:fame-advanced", { merits: [owned("core-2ed:fame", 3)], selectedDots: 3 }), true);
  assert.equal(buy("vtr-false-gods:good-breeding", { merits: [owned("vtr-false-gods:bad-breeding")] }), false);
  assert.equal(buy("vtr-sin-again:quantity-over-quality", { archetypes: ["daeva"], merits: [owned("vtr-sin-again:quality-over-quantity")] }), false);
  assert.equal(buy("vtr-enticing", { merits: [owned("h-vtr-fire-revolution:punk-rock")] }), false);
  assert.equal(buy("h-vtr-agony-ecstasy:opening-the-void"), true);
  assert.equal(buy("h-vtr-agony-ecstasy:opening-the-void", { merits: [owned("h-vtr-agony-ecstasy:storm-herald")] }), false);
  assert.equal(buy("vtr-strange-shades:twisted-shadow", { creation: false }), false);
  assert.equal(buy("vtr-strange-shades:twisted-shadow"), true);
  assert.equal(buy("vtr-strange-shades:twisted-shadow", { bloodlineId: "hollow-mekhet" }), false);
  assert.equal(buy("vtr-strange-shades:speed-of-thought", { attributes: { Intelligence: 3 }, skills: { Occult: 2 }, configuration: { skill: "Occult" } }), true);
  assert.equal(buy("vtr-strange-shades:speed-of-thought", { attributes: { Intelligence: 3 }, skills: { Occult: 2 }, configuration: { skill: "Science" } }), false);
  assert.equal(buy("vtr-better-feared:ease-the-curse", { archetypes: ["nosferatu"], conditionIds: ["vtr-better-feared:potent-curse"] }), false);
});

test("known Devotions, qualified Cult references and narrative prerequisites", () => {
  const id = "h-vtr-fire-revolution:devotion-experimenter-advanced";
  const devotions = powers.devotions.filter(item => /\bDominate\s+[•\d]/.test(item.prerequisites ?? "")).slice(0, 3);
  assert.equal(devotions.length, 3);
  const context = { merits: [owned("vtr-sotc:devotion-experimenter")], devotionCatalog: powers.devotions, devotionIds: devotions.map(item => item.id), configuration: { clan: "ventrue" } };
  assert.equal(buy(id, context), true);
  assert.equal(buy(id, { ...context, devotionIds: context.devotionIds.slice(0, 2) }), false);
  assert.equal(buy(id, { ...context, configuration: { clan: "mekhet" } }), false);
  assert.equal(parse("Mystery Cult Initiation (The Sect) •", { ...ctx, merits: [owned("core-2ed:mystery-cult-initiation", 1, { cult: "Other" })] }), false);
  assert.equal(parse("Mystery Cult Initiation (The Sect) •", { ...ctx, merits: [owned("core-2ed:mystery-cult-initiation", 1, { cult: "The Sect" })] }), true);
  assert.equal(parse("Member of a colony", ctx), true);
  assert.equal(parse("Embraced as a child or teenager", { ...ctx, gameLine: "CtL" }), false);
});

test("False Gods surgeries use mortal access and Zirnitra; doctor traits are table prerequisites", () => {
  const surgeries = catalog.filter(item => item.prerequisites?.includes("Human patient; Typhos doctor"));
  assert.equal(surgeries.length, 6);
  for (const row of surgeries) {
    assert.equal(row.line, "Core");
    assert.equal(row.mortalOnly, true);
    assert.equal(meritPrerequisitesMet(row, { ...ctx, gameLine: "CofD" }), true);
    assert.equal(eligible(row, ctx, 0), false);
    assert.equal(eligible(row, ctx, 1), true);
    for (const gameLine of ["CtL", "MtA", "WtF"]) assert.equal(eligible(row, { ...ctx, gameLine }, 5), false);
  }
  assert.equal(buy("vtr-false-gods:sea-legs", { specializations: [{ skill: "Athletics", name: "Sailing" }] }), true);
  assert.equal(buy("vtr-false-gods:sea-legs"), false);
  assert.equal(buy("vtr-false-gods:rime-salt", { archetypes: ["rotgrafen"], traits: { Protean: 1 } }), false);
  assert.equal(buy("vtr-false-gods:rime-salt", { archetypes: ["rotgrafen"], traits: { Protean: 2 } }), true);
});

test("Carthian and Crone exceptions survive canonical errata and Status restrictions", async () => {
  const { activeMeritCatalog } = await vite.ssrLoadModule("/lib/merit-homebrews.ts");
  const prefs = { disabledIds: [], enabledIds: ["h-vtr-agony-ecstasy:chorister-errata"] };
  const amended = activeMeritCatalog(catalog, [], prefs, []);
  const chorister = amended.find(row => row.id === "vtr-sotc:chorister");
  assert.ok(chorister);
  assert.equal(eligible(chorister, { ...ctx, archetypes: ["mekhet"], meritCatalog: amended }, 0), true);
  assert.equal(eligible(chorister, { ...ctx, meritCatalog: amended }, 0), false);
  const status = owned("vtr-kindred-status", 1, { group: "carthian-movement" });
  assert.equal(buy("h-vtr-fire-revolution:cultural-artifact", { merits: [status] }), false);
  assert.equal(buy("h-vtr-fire-revolution:cultural-artifact", { merits: [status, owned("h-vtr-fire-revolution:sophocrat")], skills: { Academics: 2 } }), true);
  assert.equal(buy("vtr-kindred-status", { merits: [owned("h-vtr-fire-revolution:cultist-of-self")], selectedDots: 4, configuration: { group: "carthian-movement" } }), false);
  assert.equal(buy("core-2ed:status", { merits: [owned("vtr-sin-again:social-butterfly")], selectedDots: 3, configuration: { group: "City" } }), false);
  assert.equal(buy("h-vtr-agony-ecstasy:unmasked-devil", { skills: { Intimidation: 3 }, traits: { Humanity: 5, Celerity: 1, Resilience: 1, Vigor: 0 }, selectedDots: 3 }), false);
  assert.equal(buy("h-vtr-agony-ecstasy:unmasked-devil", { skills: { Intimidation: 3 }, traits: { Humanity: 5, Celerity: 1, Resilience: 1, Vigor: 0 }, selectedDots: 2 }), true);
});

test("sheet contexts supply Disciplines, Blood Sorcery and maximum Willpower; validation uses target rating", () => {
  const sheet = { game_line: "VtR", attributes: { Resolve: 3, Composure: 2 }, skills: {}, specializations: [], merits: [], derived: {}, current_state: { willpower_current: 0 }, line_data: { clan_id: "mekhet", blood_potency: 2, humanity: 4, disciplines: { Animalism: 2 }, blood_sorcery: { cruac_rating: 3 }, touchstones: [{ name: "A" }] } };
  const context = vampireMeritContextForSheet(sheet, catalog, ["mekhet"]);
  assert.equal(context.traits.Animalism, 2);
  assert.equal(context.traits["Crúac"], 3);
  assert.equal(context.traits.Humanity, 4);
  assert.equal(context.hasTouchstone, true);
  assert.equal(parse("Willpower •••••", context), true);
  const merit = get("vtr-sin-again:fame-advanced");
  assert.ok(meritSelectionProblems(merit, { dots: 3 }, { ...ctx, merits: [owned("core-2ed:fame", 2)] }, (definition, current) => eligible(definition, current, 0)).length);
});

test("Vampire creation validation recomposes clan bonuses and purchased traits when reopening a sheet", async () => {
  const { vampireBuilder } = await vite.ssrLoadModule("/game-lines/vampire/builder.tsx");
  const { LanguageProvider } = await vite.ssrLoadModule("/lib/i18n.tsx");
  const { blankPrintCharacter } = await vite.ssrLoadModule("/app/workspace/blank-print-character.ts");
  const reference = Object.fromEntries(await Promise.all(["clans", "covenants", "anchors", "blood-potency", "torpor", "bloodlines"].map(async name => [name === "blood-potency" ? "bloodPotency" : name, await read(`public/game-lines/vampire/data/${name}.json`)])));
  const catalogs = { get: id => ({ "core-merits": catalog.filter(row => row.line === "Core"), "vampire-merits": catalog.filter(row => row.line === "VtR"), "vampire-reference": reference, "vampire-powers": powers, "vampire-conditions": [] })[id] };
  const pending = sheet => {
    const before = structuredClone(sheet);
    const markup = renderToStaticMarkup(createElement(LanguageProvider, null, createElement(vampireBuilder.Component, { initial: sheet, player: "Test", catalogs, onCancel() {}, onSave() {}, onSaveDraft() {} })));
    assert.deepEqual(sheet, before);
    return Number(markup.match(/class="builder-pending"><strong>(\d+)/)?.[1] ?? 0);
  };
  for (const [id, changes, lower] of [
    ["h-vtr-agony-ecstasy:carousing", sheet => {
      Object.assign(sheet.line_data, { clan_id: "daeva", favored_attribute: "Presence" });
      sheet.attributes.Presence = 3;
      sheet.skills.Socialize = 2;
      sheet.current_state.vampire_experience_history = [{ undo: { kind: "trait", group: "skills", name: "Socialize", amount: 1 } }];
    }, sheet => { sheet.skills.Socialize = 1; }],
    ["vtr-false-gods:rime-salt", sheet => {
      Object.assign(sheet.line_data, { clan_id: "ventrue", bloodline_id: "rotgrafen", creation_disciplines: { Protean: 1 }, disciplines: { Protean: 2 } });
    }, sheet => { sheet.line_data.disciplines.Protean = 1; }],
    ["h-vtr-fire-revolution:birth-control", sheet => {
      Object.assign(sheet.line_data, { clan_id: "mekhet", covenant_id: "carthian-movement", covenant_ids: ["carthian-movement"], creation_blood_potency: 1, blood_potency: 2 });
      sheet.merits = [owned("vtr-kindred-status", 3, { group: "carthian-movement" })];
    }, sheet => { sheet.line_data.blood_potency = 1; }],
  ]) {
    const sheet = blankPrintCharacter("VtR");
    changes(sheet);
    const baseline = pending(sheet);
    sheet.merits.push({ ...owned(id, get(id).ratings[0]), creationDots: get(id).ratings[0], experienceDots: 0 });
    assert.equal(pending(sheet), baseline, id);
    lower(sheet);
    const without = { ...sheet, merits: sheet.merits.filter(row => row.definitionId !== id) };
    assert.equal(pending(sheet), pending(without) + 1, `${id}: unmet prerequisite`);
  }
});
