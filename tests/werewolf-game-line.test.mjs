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
  assert.match(markup, /6 damage marks beyond this form/);
  assert.equal((markup.match(/class="health-box lethal"/g) ?? []).length, 7);
  assert.doesNotMatch(markup, /missing translation/); assert.deepEqual(character, before);
  const expanded = render(createElement(WerewolfCharacterPaper, { character: { ...character, current_state: { ...character.current_state, form: "gauru" } }, catalogs, updateState: () => {}, updateSheet: () => {} }));
  assert.equal((expanded.match(/class="health-box lethal"/g) ?? []).length, 11);
  assert.deepEqual(character.current_state.health_damage, before.current_state.health_damage);
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
  } finally { await portuguese.close(); }
});
