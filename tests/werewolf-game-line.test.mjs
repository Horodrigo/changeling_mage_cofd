import assert from "node:assert/strict";
import test, { after } from "node:test";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { createServer } from "vite";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

const root = fileURLToPath(new URL("..", import.meta.url));
const readJson = path => JSON.parse(readFileSync(new URL(`../public${path}`, import.meta.url), "utf8"));
const server = options => createServer({ appType: "custom", configFile: false, root,
  resolve: { alias: { "@": root } }, server: { middlewareMode: true, hmr: false, ws: false },
  optimizeDeps: { noDiscovery: true, include: [] }, ...options });
const vite = await server();
after(() => vite.close());
const { getGameLineRegistration, listGameLineRegistrations } = await vite.ssrLoadModule("/game-lines/registry/game-line-registry.ts");
const registration = getGameLineRegistration("WtF");
const { loadCatalogGroups } = await vite.ssrLoadModule("/game-lines/registry/catalog-group-registry.ts");
const requests = [];
const originalFetch = globalThis.fetch;
let catalogs;
try {
  globalThis.fetch = async url => { requests.push(String(url)); return new Response(JSON.stringify(readJson(url))); };
  catalogs = await loadCatalogGroups(registration.catalogGroups.sheet);
} finally { globalThis.fetch = originalFetch; }
const reference = catalogs.get("werewolf-reference"), gifts = catalogs.get("werewolf-gifts"), rites = catalogs.get("werewolf-rites");
const meritCatalog = [...catalogs.get("core-merits"), ...catalogs.get("werewolf-merits")];
const advancementCatalogs = { reference, gifts, rites, merits: meritCatalog };
const { purchaseWerewolfAdvancement: buy, refundWerewolfAdvancement: refund, werewolfPurchaseQuote: quote, werewolfExperienceHistory: history, WerewolfAdvancementError } = await vite.ssrLoadModule("/game-lines/werewolf/experience-rules.ts");
const { WerewolfExperiencePanel, werewolfPurchaseLabel } = await vite.ssrLoadModule("/game-lines/werewolf/experience-panel.tsx");
const { RiteExperienceCatalog } = await vite.ssrLoadModule("/game-lines/werewolf/experience-rites.tsx");
const { CreationRites } = await vite.ssrLoadModule("/game-lines/werewolf/creation-rites.tsx");
const { buildWerewolfCharacter, werewolfBuilder, werewolfExperienceSpecialties } = await vite.ssrLoadModule("/game-lines/werewolf/builder.tsx");
const { werewolfRules, werewolfFormTraits, recordedAuspiceSkillGrant } = await vite.ssrLoadModule("/game-lines/werewolf/rules.ts");
const { withoutAuspiceSkillGrant, WEREWOLF_CREATION_GRANT_SOURCES } = await vite.ssrLoadModule("/game-lines/werewolf/creation-grants.ts");
const { useCommonBuilderState, experienceTraitDots } = await vite.ssrLoadModule("/app/character-builder-shell.tsx");
const { LanguageProvider } = await vite.ssrLoadModule("/lib/i18n.tsx");
const { ATTRIBUTES, SKILLS } = await vite.ssrLoadModule("/lib/core/character/creation-rules.ts");
const { WerewolfCharacterPaper } = await vite.ssrLoadModule("/game-lines/werewolf/sheet.tsx");
const render = element => renderToStaticMarkup(createElement(LanguageProvider, null, element));
const attributes = Object.fromEntries(Object.values(ATTRIBUTES).flat().map(name => [name, 1]));
Object.assign(attributes, { Intelligence: 3, Wits: 3, Resolve: 2, Strength: 3, Dexterity: 2, Stamina: 2, Presence: 2, Manipulation: 2, Composure: 2 });
const skills = Object.fromEntries(Object.values(SKILLS).flat().map(name => [name, 0]));
Object.assign(skills, { Brawl: 3, Athletics: 3, Survival: 3, Stealth: 2, Occult: 3, Investigation: 2, Academics: 2, Intimidation: 2, Empathy: 2 });
const choices = { auspice_id: "rahu", tribe_id: "blood-talons", auspice_skill: "Brawl", renown_choice: "Purity", primal_urge: 1, extra_rite_dots: 0,
  blood: "blood-soldier", bone: "bone-lone-wolf", physical_touchstone: "Family", spiritual_touchstone: "Mountain",
  shadow_facets: ["gift-dominance:snarl-of-the-predator", "gift-inspiration:fearless-hunter"], wolf_facets: [], rites: ["wtf-core:sacred-hunt"] };
const parameters = { identity: { name: "Uratha", player: "Test", concept: "", chronicle: "" }, attributes, skills,
  specialties: [{ skill: "Brawl", name: "Claws" }, { skill: "Survival", name: "Tracking" }, { skill: "Occult", name: "Spirits" }],
  aspirations: ["", "", ""], merits: [], choices, reference, gifts, rites, meritCatalog };
const create = overrides => buildWerewolfCharacter({ ...parameters, ...overrides });
const funded = () => { const character = create(); character.current_state.experience_available = 100; character.current_state.experience_spent = 0; character.current_state.experience_total = 100; return character; };
const failsWith = problem => error => error instanceof WerewolfAdvancementError && error.problem === problem;
const purchaseMerit = (definitionId, target, configuration = {}, instanceId) => ({ kind: "merit", definitionId, target, configuration, instanceId });
const merit = (name, dots, instanceId, configuration, creationDots = dots, experienceDots = 0) => {
  const definition = meritCatalog.find(item => item.name === name);
  return { name, dots, sourceId: definition.sourceId, source: definition.source, instanceId, configuration, creationDots, experienceDots };
};

test("Werewolf registration loads only immutable Core and Werewolf resources with independent surfaces", async () => {
  assert.deepEqual(listGameLineRegistrations().map(item => item.id), ["CofD", "CtL", "MtA", "VtR", "WtF"]);
  assert.equal((await registration.loadBuilder()).Component, werewolfBuilder.Component);
  assert.equal((await registration.loadSheet()).Component, WerewolfCharacterPaper);
  assert.equal(await registration.loadRules(), werewolfRules);
  assert.equal(registration.loadPrintSheet, undefined, "Print must not be advertised before its own implementation exists");
  assert.ok(requests.length > 10);
  for (const url of requests) assert.match(url, /^\/(?:shared\/data|game-lines\/werewolf\/data)\//);
  assert.ok(Object.isFrozen(reference.forms[0].attributes));
  assert.ok(Object.isFrozen(gifts.gifts[0].facets));
  assert.throws(() => gifts.gifts[0].facets.push({}), TypeError);
  assert.throws(() => catalogs.get("changeling-contracts"), /absent/);
});

test("Pure Werewolf mechanical constants reconcile all forms and canonical Merit identities with static catalogs", async () => {
  const { FORM_MECHANICS, PERMANENT_MERIT_IDENTITIES } = await vite.ssrLoadModule("/game-lines/werewolf/mechanics.ts");
  for (const form of reference.forms)
    assert.deepEqual(FORM_MECHANICS[form.id], Object.fromEntries(Object.keys(FORM_MECHANICS[form.id]).map(key => [key, form[key]])));
  for (const identity of PERMANENT_MERIT_IDENTITIES) {
    const definition = meritCatalog.find(item => item.id === identity.id);
    assert.equal(identity.name, definition.name);
    assert.equal(identity.sourceId, definition.sourceId);
  }
});

test("Completed and draft Werewolf characters save through the current-schema lifecycle without catalog I/O", async () => {
  const { validateCurrentCharacter } = await vite.ssrLoadModule("/lib/character-persistence.ts");
  const { prepareCharacterForSave, prepareCharacterForUpdate, importCharacterFile } = await vite.ssrLoadModule("/app/workspace/character-lifecycle.ts");
  const character = create();
  assert.equal(validateCurrentCharacter(character), "valid");
  assert.equal(character.skills.Brawl, skills.Brawl + 1);
  assert.deepEqual(character.line_data.renown, { Cunning: 0, Glory: 1, Honor: 0, Purity: 2, Wisdom: 0 });
  assert.equal(character.line_data.creation_facets.length, 4);
  assert.equal(character.merits.length, 2);
  assert.ok(character.merits.every(item => item.creationDots === 1 && item.experienceDots === 0));
  const before = structuredClone(character);
  globalThis.fetch = () => { throw new Error("save/update must not fetch catalogs"); };
  try {
    assert.deepEqual(JSON.parse(JSON.stringify(await prepareCharacterForSave(character))), character);
    const updated = await prepareCharacterForUpdate(character);
    assert.deepEqual(updated.line_data, character.line_data);
    const imported = await importCharacterFile({ text: async () => JSON.stringify(character) });
    assert.deepEqual(JSON.parse(JSON.stringify(imported)), character);
  } finally { globalThis.fetch = originalFetch; }
  assert.deepEqual(character, before);
  const unfinished = { ...choices, auspice_id: "", tribe_id: "", shadow_facets: ["missing:facet"], rites: ["missing:rite"] };
  assert.throws(() => create({ choices: unfinished }), /Invalid Werewolf creation/);
  const draft = create({ choices: unfinished, draft: true, step: 3 });
  assert.equal(draft.current_state.creation_draft, true);
  assert.equal(draft.line_data.auspice_skill_grant, null);
  assert.equal(draft.skills.Brawl, skills.Brawl);
  assert.deepEqual(draft.line_data.creation_facets, ["missing:facet"]);
  assert.equal(validateCurrentCharacter(draft), "valid");
});

test("Reediting grants, XP-only instances, trait purchases and authored choices preserves exact allocations", () => {
  const source = create();
  const totem = source.merits.find(item => item.name === "Totem");
  Object.assign(totem, { dots: 4, creationDots: 3, experienceDots: 1, configuration: { name: "Mountain", choices: ["authored"] } });
  source.merits.push(merit("Living Weapon", 3, "bite", { form: "gauru", attack: "bite" }, 0, 3), merit("Living Weapon", 4, "claws", { form: "gauru", attack: "claws" }, 0, 4));
  source.skills.Brawl += 1; source.attributes.Strength += 1;
  source.specializations.push({ skill: "Brawl", name: "Fangs" });
  source.line_data.experience_primal_urge = 1; source.line_data.primal_urge = 2;
  source.line_data.experience_renown = { Glory: 1 }; source.line_data.renown.Glory += 1;
  source.line_data.learned_facets = ["gift-change:skin-thief"];
  source.line_data.learned_rites = ["wtf-core:bottle-spirit"];
  source.current_state = { health_damage: Array(13).fill("lethal"), form: "gauru", notes: "Player notes", experience_available: 2, experience_spent: 15, experience_total: 17,
    werewolf_experience_history: [ { undo: { kind: "trait", group: "skills", name: "Brawl", amount: 1 } },
      { undo: { kind: "trait", group: "attributes", name: "Strength", amount: 1 } }, { undo: { kind: "specialty", skill: "Brawl", name: "Fangs" } } ] };
  const before = structuredClone(source);
  let common;
  function StateProbe() { common = useCommonBuilderState(source, "", { experienceHistoryKey: "werewolf_experience_history", purchasedSpecialties: werewolfExperienceSpecialties(source),
    grantedMeritSources: WEREWOLF_CREATION_GRANT_SOURCES, adjustSkills: values => withoutAuspiceSkillGrant(values, recordedAuspiceSkillGrant(source.line_data.auspice_skill_grant)) }); return null; }
  render(createElement(StateProbe));
  assert.equal(common.merits.find(item => item.name === "Totem").dots, 3, "XP is not subtracted again from explicit creationDots");
  assert.deepEqual(common.attributes, attributes); assert.deepEqual(common.skills, skills);
  assert.equal(common.specialties.length, 3);
  assert.ok(!common.merits.some(item => item.name === "Living Weapon"));
  assert.deepEqual(experienceTraitDots(source, "skills", "werewolf_experience_history"), { Brawl: 1 });
  const saved = create({ source, attributes: common.attributes, skills: common.skills, specialties: common.specialties, merits: common.merits });
  assert.deepEqual(saved.skills, source.skills); assert.deepEqual(saved.attributes, source.attributes);
  assert.deepEqual(saved.specializations, source.specializations);
  assert.deepEqual(saved.current_state, source.current_state);
  assert.deepEqual(new Map(saved.merits.map(item => [item.instanceId, item])), new Map(source.merits.map(item => [item.instanceId, item])));
  assert.deepEqual(source, before);
  assert.deepEqual(saved.line_data.renown, source.line_data.renown);
  assert.deepEqual(saved.line_data.learned_facets, source.line_data.learned_facets);
  assert.deepEqual(saved.line_data.learned_rites, source.line_data.learned_rites);
  assert.equal(saved.line_data.primal_urge, 2);
  source.line_data.experience_renown.Purity = 4;
  assert.throws(() => create({ source }), /exceed.*maximum/);
});

test("All forms apply common Merits once and keep independent bite/claws enhancements in the same form", () => {
  const character = create({ merits: [merit("Giant", 3, "giant"), merit("Fleet of Foot", 2, "fleet"), merit("Fast Reflexes", 2, "reflex"),
    merit("Fortified Form", 4, "fortify", { form: "gauru" }), merit("Living Weapon", 3, "bite", { form: "gauru", attack: "bite" }), merit("Living Weapon", 4, "claws", { form: "gauru", attack: "claws" })] });
  const plain = create();
  for (const form of reference.forms) {
    const modified = werewolfFormTraits(character, form.id), base = werewolfFormTraits(plain, form.id);
    assert.equal(modified.health, base.health + 1); assert.equal(modified.size, base.size + 1);
    assert.equal(modified.speed, base.speed + 2); assert.equal(modified.initiative, base.initiative + 2);
  }
  const gauru = werewolfFormTraits(character, "gauru");
  assert.deepEqual([gauru.armorGeneral, gauru.armorBallistic], [1, 1]);
  assert.equal(gauru.weaponBonuses.bite.damage, 0); assert.equal(gauru.weaponBonuses.claws.damage, 1);
  assert.equal(gauru.weaponBonuses.bite.armorPiercing, 2); assert.equal(gauru.weaponBonuses.claws.armorPiercing, 2);
  assert.equal(werewolfFormTraits(character).weaponBonuses.bite.damage, 0);
});

test("Desktop sheet shows current-form Health, manual healing and preserved overflow without mutating stored damage", () => {
  const character = create();
  character.current_state = { form: "hishu", health_damage: Array(13).fill("lethal") };
  const before = structuredClone(character);
  const markup = render(createElement(WerewolfCharacterPaper, { character, catalogs, updateState: () => assert.fail("render mutated state"), updateSheet: () => assert.fail("render mutated structure") }));
  assert.match(markup, /Current form for Health/); assert.match(markup, />Heal</);
  assert.match(markup, /Spend Experience/);
  assert.match(markup, /6 damage marks beyond this form/);
  assert.equal((markup.match(/class="health-box lethal"/g) ?? []).length, 7);
  assert.doesNotMatch(markup, /missing translation/); assert.deepEqual(character, before);
  const expanded = render(createElement(WerewolfCharacterPaper, { character: { ...character, current_state: { ...character.current_state, form: "gauru" } }, catalogs, updateState: () => {}, updateSheet: () => {} }));
  assert.equal((expanded.match(/class="health-box lethal"/g) ?? []).length, 11);
  assert.deepEqual(character.current_state.health_damage, before.current_state.health_damage);
});

test("Werewolf XP costs and eligibility use canonical traits and Hishu, never combat forms or translated names", () => {
  const character = funded();
  assert.equal(quote(character, { kind: "trait", group: "attributes", name: "Strength", target: 5 }, advancementCatalogs), 8);
  assert.equal(quote(character, { kind: "trait", group: "skills", name: "Survival", target: 5 }, advancementCatalogs), 4);
  assert.equal(quote(character, { kind: "specialty", skill: "Survival", name: "Tracks" }, advancementCatalogs), 1);
  assert.equal(quote(character, { kind: "primalUrge", target: 3 }, advancementCatalogs), 10);
  assert.throws(() => quote(character, { kind: "trait", group: "attributes", name: "Força", target: 4 }, advancementCatalogs), failsWith("invalidPurchase"));
  for (const target of [0, 3, 3.5, NaN, Infinity]) assert.throws(() => quote(character, { kind: "trait", group: "attributes", name: "Strength", target }, advancementCatalogs), failsWith("invalidPurchase"));
  assert.throws(() => quote(character, { kind: "trait", group: "attributes", name: "Strength", target: 6 }, advancementCatalogs), failsWith("traitMaximum"));
  assert.throws(() => quote(character, { kind: "specialty", skill: "Computer", name: "Hacking" }, advancementCatalogs), failsWith("specialty"));
  assert.throws(() => quote(character, { kind: "specialty", skill: "Brawl", name: "Claws" }, advancementCatalogs), failsWith("specialty"));
  const mortal = meritCatalog.find(item => item.mortalOnly);
  assert.ok(mortal);
  assert.throws(() => quote(character, purchaseMerit(mortal.id, mortal.ratings[0]), advancementCatalogs), failsWith("meritPrerequisites"));
  character.current_state.form = "gauru";
  assert.throws(() => quote(character, purchaseMerit("wtf-2ed:living-weapon", 3, { form: "gauru", attack: "bite" }), advancementCatalogs), failsWith("meritPrerequisites"));
});

test("Atomic purchases preserve state and balances; builder advancement records cost without inventing refundable cash", () => {
  const character = funded();
  Object.assign(character.current_state, { form: "gauru", health_damage: Array(13).fill("lethal"), essence_current: 3, willpower_current: 1 });
  const before = structuredClone(character);
  const purchase = { kind: "trait", group: "attributes", name: "Strength", target: 4 };
  const next = buy(character, purchase, advancementCatalogs);
  assert.deepEqual(character, before);
  assert.equal(next.attributes.Strength, 4); assert.equal(next.current_state.experience_available, 96);
  assert.equal(next.current_state.experience_spent, 4); assert.equal(next.current_state.experience_total, 100);
  for (const key of ["form", "health_damage", "essence_current", "willpower_current"]) assert.deepEqual(next.current_state[key], before.current_state[key]);
  assert.equal(next.line_data.harmony, before.line_data.harmony);
  const restored = refund(next, history(next)[0].id, advancementCatalogs);
  assert.equal(restored.attributes.Strength, 3); assert.equal(restored.current_state.experience_available, 100);
  assert.equal(restored.current_state.experience_total, 100); assert.equal(history(restored).length, 0);
  const empty = create();
  assert.throws(() => buy(empty, purchase, advancementCatalogs), failsWith("insufficientExperience"));
  const advanced = buy(empty, purchase, advancementCatalogs, true);
  assert.equal(advanced.current_state.experience_available, 0); assert.equal(advanced.current_state.experience_spent, 4); assert.equal(advanced.current_state.experience_total, 4);
  const reverted = refund(advanced, history(advanced)[0].id, advancementCatalogs, true);
  assert.equal(reverted.current_state.experience_available, 0); assert.equal(reverted.current_state.experience_spent, 0); assert.equal(reverted.current_state.experience_total, 0);
});

test("Independent Living Weapon bite/claws instances and upgrades refund exact XP dots without removing creation grants", () => {
  let character = funded(); character.attributes.Stamina = 3;
  character = buy(character, purchaseMerit("wtf-2ed:living-weapon", 3, { form: "gauru", attack: "bite" }), advancementCatalogs);
  const bite = character.merits.find(item => item.name === "Living Weapon");
  character = buy(character, purchaseMerit("wtf-2ed:living-weapon", 4, { form: "gauru", attack: "claws" }), advancementCatalogs);
  const claws = character.merits.find(item => item.configuration?.attack === "claws");
  assert.notEqual(bite.instanceId, claws.instanceId);
  assert.throws(() => buy(character, purchaseMerit("wtf-2ed:living-weapon", 3, { form: "gauru", attack: "bite" }), advancementCatalogs), failsWith("meritChoices"));
  character = buy(character, purchaseMerit("wtf-2ed:living-weapon", 5, { form: "gauru", attack: "bite" }, bite.instanceId), advancementCatalogs);
  assert.equal(character.merits.find(item => item.instanceId === bite.instanceId).experienceDots, 5);
  character = refund(character, history(character).at(-1).id, advancementCatalogs);
  assert.equal(character.merits.find(item => item.instanceId === bite.instanceId).dots, 3);
  character = refund(character, history(character)[0].id, advancementCatalogs);
  assert.ok(!character.merits.some(item => item.instanceId === bite.instanceId));
  assert.equal(character.merits.find(item => item.instanceId === claws.instanceId).dots, 4);
  assert.ok(character.merits.filter(item => item.grantedBy).every(item => item.creationDots === 1));
});

test("Totem upgrades retain free creation origin, First Tongue is fixed, and discontinuous Merit refunds restore choices", () => {
  let character = funded();
  const totem = character.merits.find(item => item.name === "Totem"), tongue = character.merits.find(item => item.grantedBy === "werewolf:first-tongue");
  character = buy(character, purchaseMerit("wtf-2ed:totem", 3, {}, totem.instanceId), advancementCatalogs);
  const selected = character.merits.find(item => item.instanceId === totem.instanceId);
  assert.equal(selected.creationDots, 1); assert.equal(selected.experienceDots, 2); assert.equal(selected.grantedBy, "werewolf:creation-totem");
  const tongueDefinition = meritCatalog.find(item => item.name === tongue.name);
  assert.throws(() => buy(character, purchaseMerit(tongueDefinition.id, 2, {}, tongue.instanceId), advancementCatalogs), failsWith("grant"));
  character = refund(character, history(character)[0].id, advancementCatalogs);
  assert.equal(character.merits.find(item => item.instanceId === totem.instanceId).dots, 1);
  assert.throws(() => buy(character, purchaseMerit("wtf-2ed:blood-or-bone-affinity", 3, { anchor: "blood" }), advancementCatalogs), failsWith("meritChoices"));
  character = buy(character, purchaseMerit("wtf-2ed:blood-or-bone-affinity", 2, { anchor: "blood" }), advancementCatalogs);
  const affinity = character.merits.find(item => item.name === "Blood or Bone Affinity");
  character = buy(character, purchaseMerit("wtf-2ed:blood-or-bone-affinity", 5, {}, affinity.instanceId), advancementCatalogs);
  character = refund(character, history(character).at(-1).id, advancementCatalogs);
  assert.deepEqual(character.merits.find(item => item.instanceId === affinity.instanceId).configuration, { anchor: "blood" });
});

test("Refunds protect later Merit, Specialty and Primal Urge cap dependencies and preserve unrelated later changes", () => {
  let character = buy(funded(), { kind: "primalUrge", target: 2 }, advancementCatalogs);
  const urgeEntry = history(character)[0].id;
  character = buy(character, purchaseMerit("wtf-2ed:instinctive-defense", 2), advancementCatalogs);
  assert.throws(() => refund(character, urgeEntry, advancementCatalogs), failsWith("refundDependent"));
  character = refund(character, history(character).at(-1).id, advancementCatalogs);
  character = refund(character, urgeEntry, advancementCatalogs);
  assert.equal(character.line_data.primal_urge, 1);
  character = buy(character, { kind: "trait", group: "skills", name: "Computer", target: 1 }, advancementCatalogs);
  const skillEntry = history(character).at(-1).id;
  character = buy(character, { kind: "specialty", skill: "Computer", name: "Forensics" }, advancementCatalogs);
  assert.throws(() => refund(character, skillEntry, advancementCatalogs), failsWith("refundDependent"));
  character = refund(character, history(character).at(-1).id, advancementCatalogs);
  character = refund(character, skillEntry, advancementCatalogs);
  character = buy(character, { kind: "primalUrge", target: 6 }, advancementCatalogs);
  const capEntry = history(character).at(-1).id;
  character = buy(character, { kind: "trait", group: "attributes", name: "Strength", target: 6 }, advancementCatalogs);
  assert.throws(() => refund(character, capEntry, advancementCatalogs), failsWith("refundDependent"));
  character = refund(character, history(character).at(-1).id, advancementCatalogs);
  character = refund(character, capEntry, advancementCatalogs);
  assert.equal(character.attributes.Strength, 3);
  character = buy(character, { kind: "trait", group: "skills", name: "Survival", target: 4 }, advancementCatalogs);
  const first = history(character).at(-1).id;
  character = buy(character, { kind: "trait", group: "skills", name: "Survival", target: 5 }, advancementCatalogs);
  character = refund(character, first, advancementCatalogs);
  assert.equal(character.skills.Survival, 4);
});

test("Corrupt or missing XP entries cannot mint experience and opaque history remains untouched", () => {
  let character = funded();
  character.current_state.werewolf_experience_history = [null, { custom: "opaque" }, { id: "broken", cost: 99, createdAt: new Date().toISOString(), purchase: { kind: "trait" }, undo: { kind: "trait" } }];
  character = buy(character, { kind: "specialty", skill: "Survival", name: "Paths" }, advancementCatalogs);
  assert.equal(history(character).length, 1);
  const entry = history(character)[0], before = structuredClone(character);
  for (const change of [value => { value.current_state.experience_spent = 0; }, value => { value.current_state.werewolf_experience_history.at(-1).cost = 20; }, value => { value.current_state.werewolf_experience_history.push(structuredClone(entry)); }, value => { value.current_state.werewolf_experience_history.push({ id: entry.id, custom: "opaque" }); }]) {
    const corrupted = structuredClone(character); change(corrupted);
    assert.throws(() => refund(corrupted, entry.id, advancementCatalogs), failsWith("refundMissing"));
  }
  const next = refund(character, entry.id, advancementCatalogs);
  assert.deepEqual(next.current_state.werewolf_experience_history, before.current_state.werewolf_experience_history.slice(0, 3));
  assert.throws(() => refund(next, entry.id, advancementCatalogs), failsWith("refundMissing"));
  assert.deepEqual(character, before);
});

test("Merit refunds reject missing exact instances and preserve authored configuration and trait dependencies", () => {
  let character = buy(funded(), { kind: "trait", group: "attributes", name: "Stamina", target: 3 }, advancementCatalogs);
  const staminaEntry = history(character)[0].id;
  character = buy(character, purchaseMerit("wtf-2ed:living-weapon", 3, { form: "gauru", attack: "bite" }), advancementCatalogs);
  const weapon = character.merits.find(item => item.name === "Living Weapon"), weaponEntry = history(character).at(-1).id;
  const missing = structuredClone(character); missing.merits = missing.merits.filter(item => item.instanceId !== weapon.instanceId);
  assert.throws(() => refund(missing, weaponEntry, advancementCatalogs), failsWith("refundMissing"));
  assert.throws(() => refund(character, staminaEntry, advancementCatalogs), failsWith("refundDependent"));
  character = buy(character, purchaseMerit("wtf-2ed:living-weapon", 4, { form: "gauru", attack: "bite" }, weapon.instanceId), advancementCatalogs);
  character.merits.find(item => item.instanceId === weapon.instanceId).configuration.notes = "Player's later note";
  const reverted = refund(character, history(character).at(-1).id, advancementCatalogs);
  assert.equal(reverted.merits.find(item => item.instanceId === weapon.instanceId).configuration.notes, "Player's later note");
  assert.equal(reverted.merits.find(item => item.instanceId === weapon.instanceId).experienceDots, 3);
});

test("XP purchases round-trip through lifecycle and creation drafts without reclassifying Merit or trait origins", async () => {
  const { importCharacterFile } = await vite.ssrLoadModule("/app/workspace/character-lifecycle.ts");
  let source = buy(funded(), { kind: "trait", group: "attributes", name: "Strength", target: 4 }, advancementCatalogs);
  source = buy(source, { kind: "specialty", skill: "Survival", name: "Paths" }, advancementCatalogs);
  source = buy(source, purchaseMerit("wtf-2ed:totem", 3, {}, source.merits.find(item => item.name === "Totem").instanceId), advancementCatalogs);
  const imported = await importCharacterFile({ text: async () => JSON.stringify(source) });
  assert.deepEqual(JSON.parse(JSON.stringify(imported.current_state)), source.current_state);
  const resumed = create({ source: imported, draft: true, step: 4, allowAdvancement: true });
  assert.equal(resumed.current_state.creation_advancement_enabled, true); assert.equal(resumed.current_state.creation_draft_step, 4);
  assert.equal(resumed.attributes.Strength, 4); assert.equal(resumed.specializations.length, 4);
  assert.equal(resumed.merits.find(item => item.name === "Totem").creationDots, 1);
  assert.equal(resumed.merits.find(item => item.name === "Totem").experienceDots, 2);
  const markup = render(createElement(werewolfBuilder.Component, { initial: resumed, player: "Test", catalogs, onCancel: () => {}, onSave: () => {}, onSaveDraft: () => {} }));
  assert.match(markup, /Creation advances/); assert.match(markup, /Spend Experience/); assert.doesNotMatch(markup, /missing translation/);
  const panel = render(createElement(WerewolfExperiencePanel, { character: source, catalogs, updateSheet: () => {}, builderMode: true }));
  assert.doesNotMatch(panel, /aria-label="Available Experience"/);
  const entry = history(source).find(item => item.purchase.kind === "trait");
  assert.equal(werewolfPurchaseLabel(entry.purchase, advancementCatalogs, "pt-BR"), "Força 4");
  assert.equal(werewolfPurchaseLabel(entry.purchase, advancementCatalogs, "en-US"), "Strength 4");
  assert.equal(entry.purchase.name, "Strength");
});

test("WtF 2e p. 139 Rite purchases charge one XP per dot and require knowledge, exact identity and allowed Tribe", () => {
  const purchase = id => ({ kind: "rite", definitionId: id, learningSource: "Spiritual record recovered during the Hunt" });
  const base = funded(), before = structuredClone(base);
  const ratings = new Set();
  for (const rite of rites.rites) {
    const candidate = structuredClone(base); candidate.line_data.tribe_id = rite.tribeId ?? base.line_data.tribe_id;
    if (candidate.line_data.creation_rites.includes(rite.id)) { assert.throws(() => quote(candidate, purchase(rite.id), advancementCatalogs), failsWith("riteKnown")); continue; }
    assert.equal(quote(candidate, purchase(rite.id), advancementCatalogs), rite.dots);
    const learned = buy(candidate, purchase(rite.id), advancementCatalogs);
    assert.ok(learned.line_data.learned_rites.includes(rite.id)); assert.deepEqual(learned.line_data.creation_rites, candidate.line_data.creation_rites);
    assert.equal(history(learned)[0].cost, rite.dots); ratings.add(rite.dots);
    assert.throws(() => buy(learned, purchase(rite.id), advancementCatalogs), failsWith("riteKnown"));
    if (rite.tribeId) {
      const wrong = structuredClone(base); wrong.line_data.tribe_id = "ghost-wolves";
      assert.throws(() => quote(wrong, purchase(rite.id), advancementCatalogs), failsWith("riteTribe"));
    }
  }
  assert.deepEqual([...ratings].sort(), [1, 2, 3, 4, 5]);
  for (const learningSource of ["", "   ", null, 4, "x".repeat(241)]) assert.throws(() => quote(base, { ...purchase("wtf-core:chain-rage"), learningSource }, advancementCatalogs), failsWith("riteSource"));
  assert.throws(() => quote(base, purchase("Chain Rage"), advancementCatalogs), failsWith("missingRite"));
  assert.throws(() => quote(base, purchase("Fúria Acorrentada"), advancementCatalogs), failsWith("missingRite"));
  assert.deepEqual(base, before);
});

test("Rite refunds undo only their learned ID and actual cost, preserving creation Rites, later learning and opaque history", () => {
  const source = funded(); source.current_state.werewolf_experience_history = [null, { authored: "opaque" }];
  const first = { kind: "rite", definitionId: "wtf-core:chain-rage", learningSource: "An elder's written ceremony" };
  let learned = buy(source, first, advancementCatalogs), firstId = history(learned)[0].id;
  learned = buy(learned, { kind: "rite", definitionId: "wtf-core:great-hunt", learningSource: "Spirit teaching" }, advancementCatalogs);
  const lastId = history(learned).at(-1).id;
  learned = refund(learned, firstId, advancementCatalogs);
  assert.deepEqual(learned.line_data.learned_rites, ["wtf-core:great-hunt"]);
  assert.deepEqual(learned.line_data.creation_rites, source.line_data.creation_rites);
  assert.equal(learned.current_state.experience_spent, 5); assert.equal(learned.current_state.experience_available, 95);
  assert.deepEqual(learned.current_state.werewolf_experience_history.slice(0, 2), source.current_state.werewolf_experience_history);
  assert.throws(() => refund(learned, firstId, advancementCatalogs), failsWith("refundMissing"));
  const missing = structuredClone(learned); missing.line_data.learned_rites = [];
  assert.throws(() => refund(missing, lastId, advancementCatalogs), failsWith("refundMissing"));
  const overlap = structuredClone(learned); overlap.line_data.creation_rites.push("wtf-core:great-hunt");
  assert.throws(() => refund(overlap, lastId, advancementCatalogs), failsWith("refundMissing"));
  const duplicate = structuredClone(learned); duplicate.line_data.learned_rites.push("wtf-core:great-hunt");
  assert.throws(() => refund(duplicate, lastId, advancementCatalogs), failsWith("refundMissing"));
  const corrupted = structuredClone(learned); corrupted.current_state.werewolf_experience_history.at(-1).cost = 20;
  assert.throws(() => refund(corrupted, lastId, advancementCatalogs), failsWith("refundMissing"));
  learned = refund(learned, lastId, advancementCatalogs);
  assert.equal(learned.current_state.experience_available, 100); assert.equal(learned.current_state.experience_spent, 0);
});

test("Rite learning persists through current-schema import and Builder editing without requiring Pack records or reclassifying origin", async () => {
  const { importCharacterFile } = await vite.ssrLoadModule("/app/workspace/character-lifecycle.ts");
  const authored = "Registro da minha alcateia, sem vincular outras fichas";
  const learned = buy(create(), { kind: "rite", definitionId: "wtf-core:great-hunt", learningSource: authored }, advancementCatalogs, true);
  assert.equal(learned.current_state.experience_available, 0); assert.equal(learned.current_state.experience_total, 5);
  assert.ok(!Object.hasOwn(learned.line_data, "pack"));
  const imported = await importCharacterFile({ text: async () => JSON.stringify(learned) });
  const saved = create({ source: imported });
  assert.deepEqual(saved.line_data.learned_rites, ["wtf-core:great-hunt"]);
  assert.deepEqual(saved.line_data.creation_rites, parameters.choices.rites);
  assert.equal(history(saved)[0].purchase.learningSource, authored);
  assert.equal(werewolfPurchaseLabel(history(saved)[0].purchase, advancementCatalogs, "pt-BR"), rites.presentation.rites["wtf-core:great-hunt"].name);
  assert.equal(werewolfPurchaseLabel(history(saved)[0].purchase, advancementCatalogs, "en-US"), "Great Hunt");
  const overlapped = { ...choices, rites: ["wtf-core:great-hunt"], extra_rite_dots: 3 };
  assert.throws(() => create({ source: saved, choices: overlapped }), /overlap Experience/);
  const reverted = refund(saved, history(saved)[0].id, advancementCatalogs, true);
  assert.equal(reverted.current_state.experience_available, 0); assert.equal(reverted.current_state.experience_spent, 0);
});

test("Rite XP chooser shows complete rules and disabled reasons; creation blocks already purchased Rites but permits removal", () => {
  const knownIds = ["wtf-core:chain-rage", ...choices.rites];
  const markup = render(createElement(RiteExperienceCatalog, { catalog: rites, tribeId: choices.tribe_id, knownIds, selectedId: "", onSelect: () => assert.fail("render selected a Rite") }));
  assert.equal((markup.match(/class="wtf-rite-experience-row"/g) ?? []).length, 23);
  assert.match(markup, /This Rite is already known/); assert.match(markup, /taught only to another Tribe/);
  assert.match(markup, /Sample Rite/); assert.match(markup, /Dramatic Failure/); assert.match(markup, /Exceptional Success/);
  assert.doesNotMatch(markup, /missing translation/);
  assert.ok((markup.match(/disabled=""/g) ?? []).length >= 6);
  const creation = render(createElement(CreationRites, { value: choices, onChange: () => {}, catalog: rites, learnedRiteIds: ["wtf-core:chain-rage"] }));
  const blocked = creation.slice(creation.indexOf('aria-label="Select Chain Rage"') - 30, creation.indexOf('aria-label="Select Chain Rage"') + 150);
  assert.match(blocked, /disabled=""/);
  assert.match(creation, /This Rite is already known/);
  const removable = render(createElement(CreationRites, { value: { ...choices, rites: ["wtf-core:chain-rage"] }, onChange: () => {}, catalog: rites, learnedRiteIds: ["wtf-core:chain-rage"] }));
  const selected = removable.slice(removable.indexOf('aria-label="Select Chain Rage"') - 30, removable.indexOf('aria-label="Select Chain Rage"') + 150);
  assert.doesNotMatch(selected, /disabled=""/);
});

test("Builder and mobile Details render Portuguese catalog presentation without translating stored identities", async () => {
  // Test-only SSR locale/mobile snapshots; production defaults and navigation are unchanged.
  const portuguese = await server({ plugins: [{ name: "werewolf-test-snapshots", enforce: "pre", transform(code, path) {
    const normalized = path.replaceAll("\\", "/");
    if (normalized.endsWith("/lib/i18n.tsx")) return code.replace('const serverLocale = ():Locale => "en-US";', 'const serverLocale = ():Locale => "pt-BR";');
    if (normalized.endsWith("/hooks/use-mobile.ts")) return "export function useIsMobile() { return true; }";
    if (normalized.endsWith("/game-lines/werewolf/sheet.tsx")) return code.replace('mobile: "summary"', 'mobile: "details"');
  } }] });
  try {
    const { LanguageProvider: PtProvider } = await portuguese.ssrLoadModule("/lib/i18n.tsx");
    const { WerewolfCharacterPaper: PtSheet } = await portuguese.ssrLoadModule("/game-lines/werewolf/sheet.tsx");
    const { werewolfBuilder: ptBuilder } = await portuguese.ssrLoadModule("/game-lines/werewolf/builder.tsx");
    const { WerewolfExperiencePanel: PtExperience } = await portuguese.ssrLoadModule("/game-lines/werewolf/experience-panel.tsx");
    const { RiteExperienceCatalog: PtRites } = await portuguese.ssrLoadModule("/game-lines/werewolf/experience-rites.tsx");
    const character = create({ draft: true, step: 3 });
    const before = structuredClone(character);
    const ptRender = element => renderToStaticMarkup(createElement(PtProvider, null, element));
    const markup = ptRender(createElement(PtSheet, { character, catalogs, updateState: () => {}, updateSheet: () => {} }));
    assert.match(markup, /mobile-character-sheet/);
    for (const form of reference.forms) assert.ok(markup.includes(`<th scope="col">${form.name}</th>`));
    for (const phrase of ["Instinto Primitivo", "Caçador Destemido", "Caçada Sagrada"]) assert.ok(markup.includes(phrase), phrase);
    assert.doesNotMatch(markup, /missing translation|<summary>Fearless Hunter/);
    const builderMarkup = ptRender(createElement(ptBuilder.Component, { initial: character, player: "Test", catalogs, onCancel: () => {}, onSave: () => {}, onSaveDraft: () => {} }));
    assert.match(builderMarkup, /Caçador Destemido/); assert.doesNotMatch(builderMarkup, /missing translation/);
    assert.deepEqual(character, before);
    const purchased = buy(funded(), { kind: "trait", group: "attributes", name: "Strength", target: 4 }, advancementCatalogs);
    const experienceMarkup = ptRender(createElement(PtExperience, { character: purchased, catalogs, updateSheet: () => assert.fail("render mutated structure") }));
    assert.match(experienceMarkup, /Força 4/); assert.match(experienceMarkup, /Gastar Experiência/); assert.doesNotMatch(experienceMarkup, /missing translation|Strength 4/);
    const riteMarkup = ptRender(createElement(PtRites, { catalog: rites, tribeId: choices.tribe_id, knownIds: choices.rites, selectedId: "", onSelect: () => {} }));
    assert.match(riteMarkup, /Todos os Ritos/); assert.match(riteMarkup, /Este Rito já é conhecido/); assert.match(riteMarkup, /Sucesso Excepcional/);
    assert.doesNotMatch(riteMarkup, /missing translation/);
  } finally { await portuguese.close(); }
});
