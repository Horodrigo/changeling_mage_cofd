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
const fetishCatalog = catalogs.get("werewolf-fetishes");
const totemCatalog = catalogs.get("werewolf-totem");
const { totemSamplePresentation } = await vite.ssrLoadModule("/game-lines/werewolf/catalogs/totem.ts");
const { TotemReference, TotemPowerReference } = await vite.ssrLoadModule("/game-lines/werewolf/totem-reference.tsx");
const { TotemEditor } = await vite.ssrLoadModule("/game-lines/werewolf/totem.tsx");
const { newTotem, personalTotemPoints, totemSelection, totemState, totemTraits, totemCreationProblems, totemPowerProblems, effectiveTotem, recordTotemImprovement, removeTotemImprovement, totemImprovementProblems } = await vite.ssrLoadModule("/game-lines/werewolf/totem-rules.ts");
const { TotemImprovements } = await vite.ssrLoadModule("/game-lines/werewolf/totem-improvements.tsx");
const { totemAdvantage } = await vite.ssrLoadModule("/game-lines/werewolf/totem-rules.ts");
const { resolveTotemAdvantage, totemBenefitCost } = await vite.ssrLoadModule("/game-lines/werewolf/totem-benefits.ts");
const { TotemAdvantageEditor, totemBenefitLabel } = await vite.ssrLoadModule("/game-lines/werewolf/totem-advantage.tsx");
const meritCatalog = [...catalogs.get("core-merits"), ...catalogs.get("werewolf-merits")];
const advancementCatalogs = { reference, gifts, rites, merits: meritCatalog, totem: totemCatalog };
const { purchaseWerewolfAdvancement: buy, refundWerewolfAdvancement: refund, werewolfPurchaseQuote: quote, werewolfExperienceHistory: history, WerewolfAdvancementError } = await vite.ssrLoadModule("/game-lines/werewolf/experience-rules.ts");
const { WerewolfExperiencePanel, werewolfPurchaseLabel } = await vite.ssrLoadModule("/game-lines/werewolf/experience-panel.tsx");
const { RiteExperienceCatalog } = await vite.ssrLoadModule("/game-lines/werewolf/experience-rites.tsx");
const { CreationRiteCatalog } = await vite.ssrLoadModule("/game-lines/werewolf/creation-rites.tsx");
const { buildWerewolfCharacter, werewolfBuilder, werewolfExperienceSpecialties } = await vite.ssrLoadModule("/game-lines/werewolf/builder.tsx");
const { werewolfRules, werewolfFormTraits, werewolfMemberTraits, recordedAuspiceSkillGrant } = await vite.ssrLoadModule("/game-lines/werewolf/rules.ts");
const { withoutAuspiceSkillGrant, WEREWOLF_CREATION_GRANT_SOURCES } = await vite.ssrLoadModule("/game-lines/werewolf/creation-grants.ts");
const { useCommonBuilderState, experienceTraitDots } = await vite.ssrLoadModule("/app/character-builder-shell.tsx");
const { LanguageProvider } = await vite.ssrLoadModule("/lib/i18n.tsx");
const { ATTRIBUTES, SKILLS } = await vite.ssrLoadModule("/lib/core/character/creation-rules.ts");
const { WerewolfCharacterPaper } = await vite.ssrLoadModule("/game-lines/werewolf/sheet.tsx");
const { changeWerewolfForm, changeWerewolfTotem, damageAfterHealthReduction } = await vite.ssrLoadModule("/game-lines/werewolf/form-state.ts");
const { fetishSelections, fetishPresentation, catalogFetishSelection, customFetishSelection } = await vite.ssrLoadModule("/game-lines/werewolf/fetish-rules.ts");
const { FetishInventory, FetishCatalog, FetishItemRules } = await vite.ssrLoadModule("/game-lines/werewolf/fetishes.tsx");
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
  aspirations: ["", "", ""], merits: [], choices, reference, gifts, rites, meritCatalog, totemCatalog };
const create = overrides => buildWerewolfCharacter({ ...parameters, ...overrides });
const funded = () => { const character = create(); character.current_state.experience_available = 100; character.current_state.experience_spent = 0; character.current_state.experience_total = 100; return character; };
const failsWith = problem => error => error instanceof WerewolfAdvancementError && error.problem === problem;
const purchaseMerit = (definitionId, target, configuration = {}, instanceId) => ({ kind: "merit", definitionId, target, configuration, instanceId });
const purchaseFacet = (definitionId, authorization = "", learningSource = "") => ({ kind: "facet", definitionId, authorization, learningSource });
const purchaseRenown = (name, target) => ({ kind: "renown", name, target, deed: "A worthy deed accepted by the Storyteller" });
const { knownWerewolfFacets: knownFacets, renownGrants, giftProgressionProblems } = await vite.ssrLoadModule("/game-lines/werewolf/gift-progression.ts");
const { allocateWerewolfRenownGrant: allocateGrant } = await vite.ssrLoadModule("/game-lines/werewolf/experience-rules.ts");
const { FacetExperienceCatalog, RenownGrantsPanel } = await vite.ssrLoadModule("/game-lines/werewolf/experience-gifts.tsx");
const merit = (name, dots, instanceId, configuration, creationDots = dots, experienceDots = 0) => {
  const definition = meritCatalog.find(item => item.name === name);
  return { name, dots, sourceId: definition.sourceId, source: definition.source, instanceId, configuration, creationDots, experienceDots };
};
const configuredTotem = () => ({ ...newTotem(), instanceId: "individual-totem", name: "Player's Spirit", concept: "Mountain guardian", aspiration: "Protect the valley",
  ban: "Never abandon the mountain", bane: "Salt", externalPoints: 4, attributes: { power: 1, finesse: 2, resistance: 2 },
  influences: [{ instanceId: "mountain-influence", domain: "Mountains", dots: 1 }], numina: ["numen:innocuous", "numen:speed"],
  manifestations: ["manifestation:twilight-form", "manifestation:image"] });

test("Individual Totem allocations use canonical contributions, audited Rank/Defense and separate power exchanges", () => {
  const entity = configuredTotem();
  assert.equal(personalTotemPoints(create().merits, meritCatalog), 1);
  assert.equal(personalTotemPoints([merit("Totem", 4, "mixed", {}, 1, 3)], meritCatalog), 4);
  assert.equal(personalTotemPoints([{ name: "Translated Totem", dots: 99 }], meritCatalog), 0);
  assert.deepEqual(totemCreationProblems(entity, 1, totemCatalog), []);
  const traits = totemTraits(entity, 1, totemCatalog);
  assert.equal(traits.rank.rank, 1); assert.equal(traits.points, 5); assert.equal(traits.defense, 2);
  assert.equal(traits.corpus, 3); assert.equal(traits.willpower, 4); assert.equal(traits.initiative, 4); assert.equal(traits.speed, 3); assert.equal(traits.essenceMaximum, 5);
  assert.equal(totemTraits(entity, 1, totemCatalog, true).defense, 0);
  assert.equal(totemTraits({ ...entity, attributes: { power: 4, finesse: 3, resistance: 5 }, numina: ["numen:stalwart"] }, 1, totemCatalog).defense, 5);
  assert.equal(totemTraits({ ...entity, attributes: { power: 4, finesse: 3, resistance: 5 } }, 1, totemCatalog).defense, 3);
  for (const [total, rank] of [[4, null], [5, 1], [8, 1], [9, 2], [14, 2], [15, 3], [25, 3], [26, 4], [35, 4], [36, 5], [45, 5]]) {
    const allocation = { power: Math.floor(total / 3), finesse: Math.floor(total / 3), resistance: total - 2 * Math.floor(total / 3) };
    assert.equal(totemTraits({ ...entity, attributes: allocation }, 1, totemCatalog).rank?.rank ?? null, rank);
  }
  for (const [points, advantage] of [[1, 1], [8, 1], [9, 3], [14, 3], [15, 5], [19, 5], [20, 10], [45, 10]])
    assert.equal(totemTraits({ ...entity, externalPoints: points - 1 }, 1, totemCatalog).advantage, advantage);
  const exchange = { ...entity, numina: ["numen:innocuous"], influences: [{ ...entity.influences[0], dots: 2 }] };
  assert.equal(totemTraits(exchange, 1, totemCatalog).numinaBudget, 1);
  assert.deepEqual(totemCreationProblems(exchange, 1, totemCatalog), []);
  assert.ok(totemCreationProblems({ ...exchange, numina: entity.numina }, 1, totemCatalog).includes("powerBudget"));
  const manifestationExchange = { ...entity, numina: ["numen:speed"], manifestations: [...entity.manifestations, "manifestation:materialize"] };
  assert.equal(totemTraits(manifestationExchange, 1, totemCatalog).manifestExchanges, 1);
  assert.deepEqual(totemCreationProblems(manifestationExchange, 1, totemCatalog), []);
  const power = id => totemCatalog.powers.find(power => power.id === id);
  assert.deepEqual(totemPowerProblems(power("manifestation:claim"), entity, 1), ["powerPrerequisites"]);
  assert.deepEqual(totemPowerProblems(power("manifestation:claim"), { ...entity, manifestations: [...entity.manifestations, "manifestation:fetter", "manifestation:possess"] }, 1), []);
  assert.deepEqual(totemPowerProblems(power("manifestation:shadow-gateway"), entity, 2), ["powerRank"]);
  assert.deepEqual(totemPowerProblems(power("manifestation:shadow-gateway"), entity, 3), []);
  assert.deepEqual(totemPowerProblems(power("manifestation:materialize"), entity, 1), [], "Open is a use prerequisite, not an acquisition prerequisite");
  assert.ok(totemCreationProblems({ ...entity, attributes: { power: 3, finesse: 1, resistance: 1 } }, 1, totemCatalog).includes("attributeDistribution"));
  assert.ok(totemCreationProblems({ ...entity, externalPoints: 5 }, 1, totemCatalog).includes("attributeBudget"));
  assert.ok(totemCreationProblems({ ...entity, influences: [...entity.influences, { instanceId: "duplicate", domain: " mountains ", dots: 1 }] }, 1, totemCatalog).includes("duplicateInfluence"));
  assert.ok(totemCreationProblems(newTotem(), 1, totemCatalog).includes("rank"));
  assert.ok(totemCreationProblems({ ...entity, numina: [] }, 1, totemCatalog).includes("unallocatedPowers"));
  assert.doesNotThrow(() => create({ totem: newTotem(), specialties: [], choices: { ...choices, physical_touchstone: "", spiritual_touchstone: "" } }));
});

test("Totem current-schema configuration rejects malformed inputs but retains authored text, unknown IDs and excess independent resources", async () => {
  const entity = { ...configuredTotem(), notes: "Do not translate this", futureChoice: { authored: true }, numina: ["custom:unavailable"] };
  assert.deepEqual(totemSelection(entity), entity); assert.notEqual(totemSelection(entity), entity);
  assert.ok(totemCreationProblems(entity, 1, totemCatalog).includes("missingPower"));
  assert.equal(totemSelection(undefined), null);
  for (const patch of [{ instanceId: "" }, { name: 3 }, { attributes: { power: -1, finesse: 2, resistance: 2 } }, { externalPoints: 1.5 }, { numina: ["same", "same"] }, { manifestations: [null] }, { influences: [{ instanceId: "bad", domain: "", dots: -1 }] }])
    assert.throws(() => totemSelection({ ...entity, ...patch }), /Invalid Werewolf Totem/);
  const resource = { instanceId: entity.instanceId, essence: 18, willpower: 11, damage: Array(8).fill("aggravated"), dormant: true };
  assert.deepEqual(totemState(resource, entity.instanceId), resource);
  assert.deepEqual(totemState(resource, "new-entity"), { instanceId: "new-entity", essence: 0, willpower: 0, damage: [], dormant: false });
  for (const patch of [{ essence: -1 }, { willpower: 0.5 }, { dormant: "yes" }, { damage: ["invalid"] }])
    assert.throws(() => totemState({ ...resource, ...patch }, entity.instanceId), /Invalid Werewolf Totem/);
  const character = create({ totem: entity }); character.current_state.werewolf_totem = resource;
  const before = structuredClone(character);
  const { prepareCharacterForSave, importCharacterFile } = await vite.ssrLoadModule("/app/workspace/character-lifecycle.ts");
  const saved = await prepareCharacterForSave(character);
  const imported = await importCharacterFile({ text: async () => JSON.stringify(saved) });
  assert.deepEqual(imported.line_data.totem, entity); assert.deepEqual(imported.current_state.werewolf_totem, resource);
  for (const draft of [false, true]) {
    const rebuilt = create({ source: imported, draft });
    assert.deepEqual(rebuilt.line_data.totem, entity); assert.deepEqual(rebuilt.current_state.werewolf_totem, resource);
  }
  const smaller = create({ source: imported, totem: { ...entity, size: 0, attributes: { power: 1, finesse: 1, resistance: 1 } } });
  assert.deepEqual(smaller.current_state, imported.current_state);
  const removed = create({ source: imported, totem: null }); assert.equal(removed.line_data.totem, null);
  assert.deepEqual(removed.current_state.werewolf_totem, resource, "Removing a configuration does not erase its resource record");
  const bad = { ...character, current_state: { ...character.current_state, werewolf_totem: { ...resource, damage: ["bad"] } } };
  assert.throws(() => werewolfRules.normalizeCharacter(bad), /Invalid Werewolf Totem/);
  const financed = { ...character, current_state: { ...character.current_state, experience_available: 100, experience_total: 100, experience_spent: 0 } };
  const advanced = buy(financed, { kind: "trait", group: "attributes", name: "Strength", target: 4 }, advancementCatalogs);
  const refunded = refund(advanced, history(advanced)[0].id, advancementCatalogs);
  for (const sheet of [advanced, refunded]) { assert.deepEqual(sheet.line_data.totem, entity); assert.deepEqual(sheet.current_state.werewolf_totem, resource); }
  assert.deepEqual(character, before);
});

test("Totem editor renders initial selections and separate manual Corpus without wound penalties or render-time mutation", () => {
  const entity = configuredTotem(), before = structuredClone(entity);
  const state = { instanceId: entity.instanceId, essence: 0, willpower: 6, damage: Array(7).fill("lethal"), dormant: false };
  const markup = render(createElement(TotemEditor, { value: entity, personalPoints: 1, catalog: totemCatalog, state, onChange: () => assert.fail("render mutated entity"), onStateChange: () => assert.fail("render mutated resources") }));
  for (const phrase of ["Player&#x27;s Spirit", "Other contributions", "Hursih", "Influence domain", "Numina selected: 2 of 2", "Corpus: 7 marked boxes / 3 maximum", "no wound penalties", "Defense is 0", "stored resources: Essence 0, Willpower 6", "Choose Numina", "Choose Manifestations", "Remove Totem configuration"]) assert.ok(markup.includes(phrase), phrase);
  assert.equal((markup.match(/class="health-box lethal"/g) ?? []).length, 3);
  assert.doesNotMatch(markup, /missing translation|Wound penalty|Spend Experience/);
  assert.deepEqual(entity, before);
});

test("The Pack pp. 63–64 Totem improvements preserve initial allocations, exact costs/origins and bound potential without a Pack XP account", () => {
  const entity = configuredTotem(), before = structuredClone(entity);
  const record = (value, kind, target, domain) => recordTotemImprovement(value, kind, target, "Externally resolved Totem Merit investment", 1, totemCatalog, domain);
  let improved = record(entity, "attribute", "resistance");
  assert.equal(improved.improvements[0].experience, 4); assert.equal(effectiveTotem(improved).attributes.resistance, 3);
  assert.deepEqual(improved.attributes, entity.attributes); assert.deepEqual(totemCreationProblems(improved, 1, totemCatalog), []);
  assert.equal(totemTraits(improved, 1, totemCatalog).corpus, 4);
  improved = record(improved, "influence", "new-rivers", "Rivers");
  assert.equal(improved.improvements[1].experience, 5);
  improved = record(improved, "influence", "new-rivers");
  assert.equal(effectiveTotem(improved).influences.find(item => item.instanceId === "new-rivers").dots, 2);
  assert.deepEqual(improved.influences, entity.influences);
  assert.equal(totemTraits(improved, 1, totemCatalog).influenceExchanges, 0, "XP does not consume initial Numen exchanges");
  improved = record(improved, "numen", "numen:stalwart");
  assert.equal(improved.improvements[3].experience, 4); assert.equal(totemTraits(improved, 1, totemCatalog).defense, 3);
  assert.deepEqual(improved.numina, entity.numina); assert.equal(effectiveTotem(improved).numina.length, 3);
  assert.deepEqual(totemImprovementProblems(improved, 1, totemCatalog), []);
  assert.throws(() => record(improved, "numen", "numen:stalwart"), /duplicate/);
  assert.throws(() => record(improved, "influence", "other-rivers", " rivers "), /duplicate/);
  assert.throws(() => record(improved, "influence", "missing"), /target/);
  assert.throws(() => record(improved, "attribute", "Strength"), /target/);
  assert.throws(() => record(improved, "numen", "manifestation:image"), /target/);
  assert.throws(() => recordTotemImprovement(entity, "attribute", "power", "  ", 1, totemCatalog), /origin/);
  assert.throws(() => record(newTotem(), "attribute", "power"), /initial/);
  let numina = record(record(entity, "numen", "numen:stalwart"), "numen", "numen:awe");
  numina = record(numina, "numen", "numen:seek"); assert.equal(effectiveTotem(numina).numina.length, 5);
  assert.throws(() => record(numina, "numen", "numen:regenerate"), /numinaLimit/);
  let influence = entity;
  for (let index = 0; index < 4; index++) influence = record(influence, "influence", entity.influences[0].instanceId);
  assert.equal(totemTraits(influence, 1, totemCatalog).influenceDots, 5);
  assert.throws(() => record(influence, "influence", entity.influences[0].instanceId), /influenceLimit/);
  let ranked = entity;
  for (let index = 0; index < 5; index++) ranked = record(ranked, "attribute", "power");
  assert.equal(totemTraits(ranked, 1, totemCatalog).rank.rank, 2); assert.equal(effectiveTotem(ranked).attributes.power, 6);
  assert.deepEqual(totemCreationProblems(ranked, 1, totemCatalog), [], "Initial half-allocation restriction does not reclassify later improvements");
  assert.ok(improved.improvements.every(entry => entry.id && entry.origin && Number.isFinite(Date.parse(entry.createdAt))));
  assert.deepEqual(entity, before);
});

test("Totem ledger correction checks exact dependent entries and does not refund, heal or erase authored records", async () => {
  const entity = configuredTotem();
  const first = recordTotemImprovement(entity, "influence", "new-water", "Purchased externally", 1, totemCatalog, "Water");
  const second = recordTotemImprovement(first, "influence", "new-water", "Another external source", 1, totemCatalog);
  assert.throws(() => removeTotemImprovement(second, second.improvements[0].id, 1, totemCatalog), /dependent/);
  const corrected = removeTotemImprovement(second, second.improvements[1].id, 1, totemCatalog);
  assert.equal(effectiveTotem(corrected).influences.find(item => item.instanceId === "new-water").dots, 1);
  assert.throws(() => removeTotemImprovement(corrected, "not-an-id", 1, totemCatalog), /Unknown/);
  const importedIssue = { ...second, improvements: [...second.improvements, { ...second.improvements[1], id: "unrelated-bad-target", target: "unknown-influence" }] };
  assert.throws(() => removeTotemImprovement(importedIssue, second.improvements[0].id, 1, totemCatalog), /dependent/, "Another pre-existing target error cannot conceal a newly invalid exact entry");
  let ranked = entity;
  for (const attribute of [...Array(6).fill("power"), ...Array(3).fill("finesse"), "power"])
    ranked = recordTotemImprovement(ranked, "attribute", attribute, "External funding", 1, totemCatalog);
  assert.equal(totemTraits(ranked, 1, totemCatalog).rank.rank, 3);
  assert.throws(() => removeTotemImprovement(ranked, ranked.improvements[6].id, 1, totemCatalog), /dependent/, "A Rank-enabling Attribute improvement protects later trait caps");
  const character = create({ totem: second });
  character.current_state.werewolf_totem = { instanceId: second.instanceId, essence: 2, willpower: 1, damage: Array(9).fill("lethal"), dormant: false };
  const before = structuredClone(character);
  const { importCharacterFile } = await vite.ssrLoadModule("/app/workspace/character-lifecycle.ts");
  const imported = await importCharacterFile({ text: async () => JSON.stringify(character) });
  const rebuilt = create({ source: imported, draft: true });
  assert.deepEqual(rebuilt.line_data.totem, second); assert.deepEqual(rebuilt.current_state.werewolf_totem, imported.current_state.werewolf_totem);
  assert.equal(rebuilt.current_state.creation_draft, true);
  assert.deepEqual(character, before);
  assert.ok(totemImprovementProblems({ ...second, improvements: second.improvements.map(entry => ({ ...entry, experience: 99 })) }, 1, totemCatalog).includes("cost"));
  for (const patch of [{ kind: "skill" }, { kind: ["numen"] }, { experience: -1 }, { createdAt: "not-a-date" }, { origin: null }, { domain: 8 }, { domain: null }])
    assert.throws(() => totemSelection({ ...entity, improvements: [{ ...first.improvements[0], ...patch }] }), /Invalid Werewolf Totem improvement/);
  assert.throws(() => totemSelection({ ...entity, improvements: [first.improvements[0], first.improvements[0]] }), /Invalid Werewolf Totem improvement/);
  const markup = render(createElement(TotemImprovements, { value: second, personalPoints: 1, catalog: totemCatalog, onChange: () => assert.fail("render mutated ledger") }));
  for (const phrase of ["Totem improvements", "Record improvement", "Recorded improvement cost: 10", "no Pack account", "Water"]) assert.ok(markup.includes(phrase), phrase);
  assert.doesNotMatch(markup, /missing translation|\{p1\}/);
});

test("WTF2 p. 92 Totem Advantage resolves separate traits, exact ratings and equal-value individual replacements without purchased-trait or XP mutation", () => {
  const character = funded(), before = structuredClone(character), entity = { ...configuredTotem(), externalPoints: 19 };
  const context = { ...advancementCatalogs, totem: totemCatalog };
  const benefit = (id, choice, replacement) => ({ id, choice, ...(replacement ? { replacement } : {}) });
  const attribute = target => ({ kind: "attribute", target }), skill = target => ({ kind: "skill", target });
  const special = (skill, name) => ({ kind: "specialty", skill, name });
  const meritChoice = (definitionId, dots, configuration = {}) => ({ kind: "merit", definitionId, dots, configuration });
  const resolve = (selections, source = character, active = true) => resolveTotemAdvantage(source, { ...entity, advantage: { active, selections } }, context);
  const selections = [benefit("stamina", attribute("Stamina")), benefit("athletics", skill("Athletics")), benefit("fleet", meritChoice("core-2ed:fleet-of-foot", 1)),
    benefit("cold", special("Survival", "Cold")), benefit("tracking", special("Survival", "Tracking")), benefit("looks", meritChoice("core-2ed:striking-looks", 1, { appearance: "Wary hunter" }))];
  const result = resolve(selections);
  assert.equal(result.budget, 10); assert.equal(result.spent, 10); assert.equal(result.remaining, 0); assert.deepEqual(result.issues, []);
  assert.equal(result.traits.attributes.Stamina, character.attributes.Stamina + 1);
  assert.equal(result.traits.skills.Athletics, character.skills.Athletics + 1);
  assert.equal(result.traits.specializations.length, character.specializations.length + 1);
  const expertise = result.traits.merits.find(item => item.name === "Area of Expertise");
  assert.equal(expertise.definitionId, "core-2ed:area-of-expertise");
  assert.equal(result.traits.merits.find(item => item.name === "Fleet of Foot").definitionId, "core-2ed:fleet-of-foot");
  assert.deepEqual(expertise.configuration, { skill: "Survival", specialty: "Tracking" });
  assert.equal(expertise.grantedBy, "werewolf:totem-advantage"); assert.equal(expertise.creationDots, 0); assert.equal(expertise.experienceDots, 0);
  assert.equal(expertise.instanceId, `totem:${entity.instanceId}:tracking`);
  const lowResolve = structuredClone(character); lowResolve.attributes.Resolve = 1;
  const explicitGrant = resolve([selections[4]], lowResolve);
  assert.deepEqual(explicitGrant.issues, []); assert.ok(explicitGrant.traits.merits.some(item => item.name === "Area of Expertise"));
  assert.deepEqual(character, before);
  assert.deepEqual(resolve(selections, character, false).traits, { attributes: character.attributes, skills: character.skills, specializations: character.specializations, merits: character.merits });
  assert.deepEqual(resolve([]).traits, resolveTotemAdvantage(character, null, context).traits);
  assert.equal(resolveTotemAdvantage(character, null, context).budget, 0);
  const atCap = structuredClone(character); atCap.attributes.Stamina = 5; atCap.skills.Athletics = 5;
  const over = resolve(selections.slice(0, 2), atCap); assert.equal(over.traits.attributes.Stamina, 6); assert.equal(over.traits.skills.Athletics, 6);
  const ownsLooks = structuredClone(character); ownsLooks.merits.push(merit("Striking Looks", 2, "owned-looks", { appearance: "Authored" }));
  assert.ok(resolve([selections.at(-1)], ownsLooks).issues.some(item => item.problem === "replacementRequired"));
  const replaced = benefit("looks", selections.at(-1).choice, { choice: special("Persuasion", "Shocking Good Looks"), reason: "Already has Striking Looks; agreed related alternative" });
  const resolved = resolve([replaced], ownsLooks);
  // A Specialty still requires an effective Skill dot; the source Merit is not silently overwritten.
  assert.ok(resolved.issues.some(item => item.problem === "prerequisites"));
  ownsLooks.skills.Persuasion = 1;
  const valid = resolve([replaced], ownsLooks); assert.deepEqual(valid.issues, []); assert.equal(valid.spent, 1);
  assert.equal(valid.traits.merits.find(item => item.instanceId === "owned-looks").dots, 2);
  assert.ok(valid.traits.specializations.some(item => item.name === "Shocking Good Looks"));
  assert.ok(resolve([benefit("bad", selections.at(-1).choice, { choice: attribute("Presence"), reason: "Related" })], ownsLooks).issues.some(item => item.problem === "replacementCost"));
  assert.ok(resolve([benefit("bad", selections.at(-1).choice, { choice: special("Survival", "Snow"), reason: " " })], ownsLooks).issues.some(item => item.problem === "replacementReason"));
  assert.ok(resolve([replaced]).issues.some(item => item.problem === "replacementForbidden"));
  assert.ok(resolve([benefit("same", selections.at(-1).choice, { choice: selections.at(-1).choice, reason: "Same" })], ownsLooks).issues.some(item => item.problem === "duplicate"));
  assert.equal(totemBenefitCost(attribute("Resolve"), reference), 4); assert.equal(totemBenefitCost(skill("Brawl"), reference), 2); assert.equal(totemBenefitCost(special("Brawl", "Claws"), reference), 1);
  const saved = create({ totem: { ...entity, advantage: { active: true, selections } } });
  const imported = werewolfRules.normalizeCharacter(JSON.parse(JSON.stringify(saved)));
  const rebuilt = buildWerewolfCharacter({ ...parameters, source: imported, draft: true });
  assert.deepEqual(rebuilt.line_data.totem.advantage, saved.line_data.totem.advantage);
  assert.deepEqual(rebuilt.attributes, saved.attributes); assert.deepEqual(rebuilt.skills, saved.skills); assert.deepEqual(rebuilt.merits, saved.merits);
  assert.deepEqual(rebuilt.current_state.experience_history, saved.current_state.experience_history);
});

test("Totem Advantage current-schema boundary retains unknown IDs and authored choices but rejects malformed values and invalid grants", () => {
  const character = create(), entity = { ...configuredTotem(), externalPoints: 19 }, context = { ...advancementCatalogs, totem: totemCatalog };
  const resolve = selections => resolveTotemAdvantage(character, { ...entity, advantage: { active: true, selections } }, context);
  const benefit = (id, choice) => ({ id, choice });
  const grant = (id, dots, configuration = {}) => ({ kind: "merit", definitionId: id, dots, configuration });
  const duplicate = [benefit("first", { kind: "skill", target: "Brawl" }), benefit("second", { kind: "skill", target: "Brawl" })];
  assert.deepEqual(resolve(duplicate).issues.map(item => item.problem), ["duplicate", "duplicate"]);
  assert.equal(resolve(duplicate).traits.skills.Brawl, character.skills.Brawl);
  assert.ok(resolve([benefit("unknown", grant("future:authored", 1))]).issues.some(item => item.problem === "target"));
  const unreserved = resolve([benefit("budget", grant("future:authored", 1)), benefit("valid", { kind: "skill", target: "Brawl" })]);
  assert.equal(unreserved.traits.skills.Brawl, character.skills.Brawl + 1, "Arbitrary choice IDs cannot collide with the global budget issue");
  assert.ok(resolve([benefit("gap", grant("wtf-2ed:living-weapon", 2))]).issues.some(item => item.problem === "rating"));
  assert.ok(resolve([benefit("form", grant("wtf-2ed:living-weapon", 3))]).issues.some(item => item.problem === "choices"));
  const mortal = meritCatalog.find(item => item.mortalOnly && item.line === "Core");
  assert.ok(resolve([benefit("mortal", grant(mortal.id, mortal.ratings[0]))]).issues.some(item => item.problem === "prerequisites"));
  const budget = resolve([benefit("a", { kind: "attribute", target: "Stamina" }), benefit("b", { kind: "attribute", target: "Strength" }), benefit("c", { kind: "attribute", target: "Wits" })]);
  assert.ok(budget.issues.some(item => item.problem === "budget")); assert.deepEqual(budget.traits.attributes, character.attributes);
  const missingSkill = resolve([benefit("new", { kind: "specialty", skill: "Persuasion", name: "Authored" })]); assert.ok(missingSkill.issues.some(item => item.problem === "prerequisites"));
  const withSkill = resolve([benefit("skill", { kind: "skill", target: "Persuasion" }), benefit("new", { kind: "specialty", skill: "Persuasion", name: "Authored" })]); assert.deepEqual(withSkill.issues, []);
  const unavailable = structuredClone(context); unavailable.merits = [...context.merits, { ...context.merits.find(item => item.id === "core-2ed:fleet-of-foot"), id: "test:dependent", name: "Test Dependent", prerequisites: "Fleet of Foot •", ratings: [1] }];
  const broken = resolveTotemAdvantage(character, { ...entity, advantage: { active: true, selections: [benefit("bad", grant("core-2ed:fleet-of-foot", 1)), benefit("dependent", grant("test:dependent", 1))] } }, { ...unavailable, merits: unavailable.merits.map(item => item.id === "core-2ed:fleet-of-foot" ? { ...item, prerequisites: "Athletics ••••••••••" } : item) });
  assert.ok(broken.issues.some(item => item.id === "bad" && item.problem === "prerequisites")); assert.ok(broken.issues.some(item => item.id === "dependent" && item.problem === "prerequisites"));
  assert.ok(!broken.traits.merits.some(item => item.name === "Fleet of Foot" || item.name === "Test Dependent"));
  const authored = { active: false, selections: [benefit("future", grant("future:custom", 2, { author: "Não traduza", choices: ["One", "Dois"] }))] };
  assert.deepEqual(totemAdvantage(authored), authored); assert.deepEqual(totemSelection({ ...entity, advantage: authored }).advantage, authored);
  for (const bad of [{}, { active: 1, selections: [] }, { active: true, selections: [authored.selections[0], authored.selections[0]] },
    { active: true, selections: [benefit("bad", grant("unknown", 1, { numeric: 1 }))] }, { active: true, selections: [benefit("bad", { kind: ["attribute"], target: "Stamina" })] },
    { active: true, selections: [{ ...authored.selections[0], replacement: null }] }]) assert.throws(() => totemSelection({ ...entity, advantage: bad }), /Totem Advantage/);
  assert.throws(() => resolveTotemAdvantage({ ...character, game_line: "CofD" }, entity, context), /another game line/);
});

test("Totem Advantage reaches every Werewolf form, the canonical rules loader and Hishu prerequisites without changing creation or XP origins", async () => {
  const character = funded(), plain = structuredClone(character);
  character.line_data.totem = { ...configuredTotem(), externalPoints: 19, advantage: { active: true, selections: [
    { id: "stamina", choice: { kind: "attribute", target: "Stamina" } }, { id: "athletics", choice: { kind: "skill", target: "Athletics" } },
    { id: "fleet", choice: { kind: "merit", definitionId: "core-2ed:fleet-of-foot", dots: 1, configuration: {} } },
    { id: "cold", choice: { kind: "specialty", skill: "Survival", name: "Authored cold Specialty" } },
  ] } };
  const before = structuredClone(character), member = werewolfMemberTraits(character, advancementCatalogs);
  assert.equal(member.skills.Athletics, character.skills.Athletics + 1); assert.equal(member.attributes.Stamina, character.attributes.Stamina + 1);
  assert.throws(() => werewolfFormTraits(character), /explicit Werewolf catalogs/);
  for (const form of reference.forms) {
    const actual = werewolfFormTraits(character, form.id, advancementCatalogs), base = werewolfFormTraits(plain, form.id, advancementCatalogs);
    assert.equal(actual.health, base.health + 1, form.id); assert.equal(actual.defense, base.defense + 1, form.id); assert.equal(actual.speed, base.speed + 1, form.id);
    assert.equal(actual.attributes.Stamina, base.attributes.Stamina + 1, form.id);
  }
  const loaded = await registration.loadRules(), derived = loaded.deriveCharacterState(character);
  assert.equal(derived.Vitalidade, plain.derived.Vitalidade + 1); assert.equal(derived.Deslocamento, plain.derived.Deslocamento + 1);
  const { prepareCharacterForUpdate } = await vite.ssrLoadModule("/app/workspace/character-lifecycle.ts");
  const updated = await prepareCharacterForUpdate(character);
  assert.deepEqual(updated.derived, derived); assert.deepEqual(updated.attributes, character.attributes); assert.deepEqual(updated.skills, character.skills); assert.deepEqual(updated.merits, character.merits);
  const rebuilt = buildWerewolfCharacter({ ...parameters, source: updated, draft: true });
  assert.deepEqual(rebuilt.derived, derived); assert.deepEqual(rebuilt.line_data.totem, updated.line_data.totem); assert.deepEqual(rebuilt.merits, character.merits);
  assert.equal(rebuilt.current_state.experience_available, character.current_state.experience_available);
  const { werewolfAdvancementContexts } = await vite.ssrLoadModule("/game-lines/werewolf/experience-rules.ts");
  const contexts = werewolfAdvancementContexts(character, advancementCatalogs);
  assert.equal(contexts.core.skills.Athletics, member.skills.Athletics); assert.equal(contexts.own.attributes.Stamina, member.attributes.Stamina);
  assert.deepEqual(character, before);
  const markup = render(createElement(TotemAdvantageEditor, { character, value: character.line_data.totem, catalogs: advancementCatalogs, onChange: () => assert.fail("render mutated") }));
  for (const phrase of ["Totem Advantage", "Allocated: 8/10", "Stamina +1", "Athletics +1", "Fleet of Foot", "Authored cold Specialty", "Patronage (manual)", "Benefits active", "Chronicles of Darkness"]) assert.ok(markup.includes(phrase), phrase);
  assert.equal(totemBenefitLabel({ kind: "attribute", target: "Stamina" }, advancementCatalogs, "pt-BR"), "Vigor +1");
});

test("Manual Totem patronage and removal upgrade lost Health damage once, preserve entity resources and never heal or debit XP", () => {
  const character = funded(); character.current_state.form = "gauru";
  const entity = { ...configuredTotem(), externalPoints: 14, advantage: { active: true, selections: [{ id: "stamina", choice: { kind: "attribute", target: "Stamina" } }] } };
  character.line_data.totem = entity;
  const health = werewolfFormTraits(character, "gauru", advancementCatalogs).health;
  character.current_state.health_damage = [...Array(5).fill("lethal"), ...Array(health - 5).fill("bashing")];
  character.current_state.werewolf_totem = { instanceId: entity.instanceId, essence: 2, willpower: 1, damage: Array(9).fill("lethal"), dormant: false };
  const before = structuredClone(character), inactive = { ...entity, advantage: { ...entity.advantage, active: false } };
  const suspended = changeWerewolfTotem(character, inactive, advancementCatalogs);
  assert.equal(werewolfFormTraits(suspended, "gauru", advancementCatalogs).health, health - 1);
  assert.deepEqual(suspended.current_state.health_damage, damageAfterHealthReduction(before.current_state.health_damage, health - 1));
  assert.equal(suspended.current_state.health_damage.filter(level => level === "lethal").length, 6);
  for (const key of ["willpower_current", "essence_current", "experience_available", "experience_spent", "werewolf_totem"]) assert.deepEqual(suspended.current_state[key], before.current_state[key], key);
  assert.deepEqual(changeWerewolfTotem(suspended, inactive, advancementCatalogs).current_state, suspended.current_state);
  const restored = changeWerewolfTotem(suspended, entity, advancementCatalogs); assert.deepEqual(restored.current_state.health_damage, suspended.current_state.health_damage);
  const reduced = changeWerewolfForm(restored, "hishu", advancementCatalogs); assert.deepEqual(reduced.health_damage, damageAfterHealthReduction(restored.current_state.health_damage, werewolfFormTraits(restored, "hishu", advancementCatalogs).health));
  const removed = changeWerewolfTotem(character, null, advancementCatalogs); assert.deepEqual(removed.current_state.health_damage, suspended.current_state.health_damage);
  assert.deepEqual(character, before);
});

test("Werewolf XP quotes use effective Totem Skill dots but refunds and purchases preserve exact benefits and dependencies", () => {
  let character = funded(); character.skills.Athletics = 0;
  character.line_data.totem = { ...configuredTotem(), externalPoints: 8, advantage: { active: true, selections: [{ id: "athletics", choice: { kind: "skill", target: "Athletics" } }] } };
  assert.equal(quote(character, { kind: "specialty", skill: "Athletics", name: "Running" }, advancementCatalogs), 1);
  character = buy(character, { kind: "specialty", skill: "Athletics", name: "Running" }, advancementCatalogs);
  character = buy(character, { kind: "trait", group: "skills", name: "Athletics", target: 1 }, advancementCatalogs);
  const skillId = history(character).at(-1).id;
  character = buy(character, purchaseMerit("core-2ed:fleet-of-foot", 1), advancementCatalogs);
  const meritId = history(character).at(-1).id;
  assert.equal(character.skills.Athletics, 1); assert.equal(werewolfMemberTraits(character, advancementCatalogs).skills.Athletics, 2);
  assert.throws(() => refund(character, skillId, advancementCatalogs), failsWith("refundDependent"));
  character = refund(character, meritId, advancementCatalogs); character = refund(character, skillId, advancementCatalogs);
  assert.equal(character.skills.Athletics, 0); assert.ok(character.specializations.some(item => item.name === "Running"));
  const supplied = funded(); supplied.line_data.totem = { ...configuredTotem(), advantage: { active: true, selections: [{ id: "fleet", choice: { kind: "merit", definitionId: "core-2ed:fleet-of-foot", dots: 1, configuration: {} } }] } };
  const before = structuredClone(supplied);
  assert.throws(() => quote(supplied, purchaseMerit("core-2ed:fleet-of-foot", 1), advancementCatalogs), failsWith("purchaseDependent"));
  assert.throws(() => buy(supplied, purchaseMerit("core-2ed:fleet-of-foot", 1), advancementCatalogs), failsWith("purchaseDependent"));
  assert.deepEqual(supplied, before);
  let totemOwner = funded(); const totemId = totemOwner.merits.find(item => item.name === "Totem").instanceId;
  totemOwner = buy(totemOwner, purchaseMerit("wtf-2ed:totem", 3, {}, totemId), advancementCatalogs); const purchaseId = history(totemOwner).at(-1).id;
  totemOwner.line_data.totem = { ...configuredTotem(), externalPoints: 7, advantage: { active: true, selections: [{ id: "athletics", choice: { kind: "skill", target: "Athletics" } }] } };
  assert.throws(() => refund(totemOwner, purchaseId, advancementCatalogs), failsWith("refundDependent"));
  totemOwner.line_data.totem.advantage.active = false;
  assert.equal(refund(totemOwner, purchaseId, advancementCatalogs).merits.find(item => item.instanceId === totemId).dots, 1);
});

test("WTF2 Totem reference preserves Rank limits, adopted source conflicts, improvement costs and all three Pack examples", () => {
  assert.deepEqual(totemCatalog.ranks.map(item => [item.rank, item.title, item.traitMaximum, item.attributeMinimum, item.attributeMaximum, item.essenceMaximum, item.numinaMinimum, item.numinaMaximum]), [
    [1, "Hursih", 5, 5, 8, 10, 1, 3], [2, "Hursah", 7, 9, 14, 15, 3, 5], [3, "Ensih", 9, 15, 25, 20, 5, 7],
    [4, "Ensah", 12, 26, 35, 25, 7, 9], [5, "Dihir", 15, 36, 45, 50, 9, 11],
  ]);
  assert.deepEqual(totemCatalog.advantageBands.map(item => [item.minimum, item.maximum, item.experience]), [[1, 8, 1], [9, 14, 3], [15, 19, 5], [20, null, 10]]);
  assert.deepEqual(totemCatalog.improvementCosts, { attribute: 4, influence: 5, numen: 4 });
  const rules = Object.fromEntries(totemCatalog.rules.map(rule => [rule.id, Object.fromEntries(rule.fields.map(field => [field.id, field.text]))]));
  assert.match(rules["totem-creation"].points, /at least one.*no more than half/);
  assert.match(rules["totem-creation"].numina, /one Numen.*every four/);
  assert.match(rules["totem-traits"].defense, /lower of Power and Finesse.*higher at Rank 1.*not a claimed official erratum/);
  assert.match(rules["totem-traits"].corpus, /no wound penalties/);
  assert.match(rules["totem-pack-bond"].limits, /exceed normal Rank limits.*total contributed Totem dots/);
  assert.match(rules["totem-improvements"].gifts, /cannot grant Gifts to its own pack/);
  for (const rule of totemCatalog.rules) {
    assert.ok(rule.sourceId && rule.source && rule.page);
    assert.equal(new Set(rule.fields.map(field => field.id)).size, rule.fields.length);
    const presentation = totemCatalog.presentation.rules[rule.id];
    assert.ok(presentation.name);
    for (const field of rule.fields) assert.ok(presentation.fields[field.id]?.label && presentation.fields[field.id]?.text);
  }
  assert.deepEqual(totemCatalog.samples.map(sample => sample.name), ["Szigblal", "Glabna", "Ushugudh"]);
  const glabna = totemCatalog.samples[1], ushugudh = totemCatalog.samples[2];
  assert.equal(glabna.resistance, 9); assert.equal(glabna.points, 15); assert.match(glabna.editorialNote, /exceeds half/);
  assert.equal(ushugudh.defense, 7); assert.equal(ushugudh.points, 20);
  for (const sample of totemCatalog.samples) {
    assert.ok(sample.editorialNote); assert.equal(sample.source, "The Pack");
    for (const field of ["epithet", "concept", "aspiration", "description", "speed", "influences", "manifestations", "numina", "ban", "bane", "advantage", "editorialNote"]) assert.ok(totemCatalog.presentation.samples[sample.id][field]);
    const pt = totemSamplePresentation(sample, totemCatalog, "pt-BR");
    for (const field of ["id", "name", "points", "rank", "power", "finesse", "resistance", "defense", "source", "page"]) assert.equal(pt[field], sample[field]);
  }
  assert.ok(Object.isFrozen(totemCatalog) && Object.isFrozen(totemCatalog.samples[0]));
  const invalidPresentation = structuredClone(totemCatalog);
  Object.assign(invalidPresentation.presentation.samples[ushugudh.id], { id: "localized-id", name: "Translated Uratha", points: 1, rank: 1, defense: 1 });
  const protectedSample = totemSamplePresentation(ushugudh, invalidPresentation, "pt-BR");
  for (const field of ["id", "name", "points", "rank", "defense"]) assert.equal(protectedSample[field], ushugudh[field]);
  assert.deepEqual(totemSamplePresentation(ushugudh, { ...totemCatalog, presentation: { ...totemCatalog.presentation, samples: {} } }, "pt-BR"), ushugudh);
  assert.ok(requests.includes("/game-lines/werewolf/data/totem.json") && requests.includes("/game-lines/werewolf/data/totem-pt.json"));
});

test("Totem reference exposes complete, separately labeled rules and samples without purchases or character mutation", () => {
  const before = structuredClone(totemCatalog);
  const markup = render(createElement(TotemReference, { catalog: totemCatalog }));
  for (const phrase of ["Totem rules and examples", "Corpus:", "Ban:", "Bane:", "Numina:", "Szigblal", "Glabna", "Ushugudh", "15–19", "20+", "Source audit", "Rank limits"]) assert.ok(markup.includes(phrase), phrase);
  assert.match(markup, /<input[^>]*aria-label="Search Totems/);
  assert.doesNotMatch(markup, /missing translation|type="checkbox"|Spend Experience|awaiting audit/);
  assert.deepEqual(totemCatalog, before);
});

test("WTF2 pp. 186–193 Totem powers preserve all 24 Numina, 11 Manifestations, five Influence levels and localized fields", () => {
  assert.equal(totemCatalog.powers.length, 40);
  const numina = totemCatalog.powers.filter(power => power.kind === "numen"), manifestations = totemCatalog.powers.filter(power => power.kind === "manifestation");
  assert.equal(numina.length, 24); assert.equal(manifestations.length, 11);
  assert.deepEqual(totemCatalog.powers.filter(power => power.kind === "influence").map(power => power.influenceLevel), [1, 2, 3, 4, 5]);
  assert.deepEqual(numina.filter(power => power.reaching).map(power => power.id), ["numen:dement", "numen:emotional-aura", "numen:entropic-decay", "numen:firestarter", "numen:implant-mission", "numen:pathfinder", "numen:rapture", "numen:seek", "numen:telekinesis"]);
  const entries = [...totemCatalog.powerRules, ...totemCatalog.powers];
  assert.equal(new Set(entries.map(power => power.id)).size, 43);
  assert.deepEqual(new Set(Object.keys(totemCatalog.presentation.powers)), new Set(entries.map(power => power.id)));
  for (const power of entries) {
    assert.equal(power.sourceId, "wtf-2ed"); assert.ok(power.page >= 186 && power.page <= 193);
    assert.ok(Object.isFrozen(power)); assert.equal(new Set(power.fields.map(field => field.id)).size, power.fields.length);
    const pt = totemCatalog.presentation.powers[power.id]; assert.ok(pt.name);
    assert.deepEqual(new Set(Object.keys(pt.fields)), new Set(power.fields.map(field => field.id)));
    for (const field of power.fields) assert.ok(pt.fields[field.id].label && pt.fields[field.id].text, `${power.id}:${field.id}`);
  }
  const power = id => totemCatalog.powers.find(power => power.id === id);
  const field = (id, key) => power(id).fields.find(field => field.id === key)?.text;
  assert.deepEqual(power("manifestation:claim").requiredManifestationIds, ["manifestation:fetter", "manifestation:possess"]);
  assert.equal(power("manifestation:claim").requiredConditionId, "controlled"); assert.equal(power("manifestation:shadow-gateway").minimumRank, 3);
  assert.equal(field("numen:seek", "roll"), "Finesse.");
  assert.match(field("numen:awe", "roll"), /Presence \+ Composure/);
  assert.match(field("numen:drain", "effect"), /Whichever party.*backfire/);
  assert.match(field("numen:entropic-decay", "roll"), /resisted.*Stamina.*Resistance.*Durability/);
  assert.match(field("numen:rapture", "effect"), /Werewolves omit Primal Urge.*Lune.*not a named Madness/);
  assert.match(field("numen:regenerate", "activation"), /No roll/);
  assert.match(field("numen:regenerate", "effect"), /bashing first.*does not heal aggravated/);
  assert.match(field("numen:stalwart", "effect"), /Resistance as Defense.*does not grant an Armor/);
  assert.match(field("manifestation:possess", "effect"), /cannot use Numina or Influences/);
  assert.match(field("manifestation:fetter", "effect"), /neither Influences nor Numina may target anyone else/);
  assert.match(field("manifestation:possess", "traits"), /Physical Skills at −3 and Mental\/Social Skills at −4/);
  assert.match(field("manifestation:unfetter", "effect"), /five yards.*dormancy/);
  assert.match(field("influence:strengthen", "effect"), /Resonant.*Open/);
  assert.match(field("influence:control", "effect"), /Open.*Controlled/);
  const durations = totemCatalog.powerRules.find(rule => rule.id === "spirit-influence").fields.filter(field => field.id.startsWith("duration-"));
  assert.equal(durations.length, 5); assert.match(durations.at(-1).text, /Permanent.*2 Essence/);
  const before = structuredClone(totemCatalog), markup = render(createElement(TotemPowerReference, { catalog: totemCatalog }));
  for (const phrase of ["Totem powers", "Powers: 40", "Using Influence", "Using Manifestations", "Using Numina", "<summary>Seek", "<summary>Claim", "Source discrepancy"]) assert.ok(markup.includes(phrase), phrase);
  assert.doesNotMatch(markup, /missing translation|type="checkbox"|Spend Experience/);
  assert.deepEqual(totemCatalog, before);
  for (const path of ["totem-powers.json", "totem-powers-pt.json"]) assert.ok(requests.includes(`/game-lines/werewolf/data/${path}`));
});

test("Creation accepts unfilled Specialties and Touchstones and preserves authored notes on editing", () => {
  const character = create({ specialties: [], choices: { ...choices, physical_touchstone: "", spiritual_touchstone: "" } });
  assert.deepEqual(character.specializations, []);
  assert.equal(character.line_data.physical_touchstone, "");
  assert.equal(character.line_data.spiritual_touchstone, "");
  const initial = create({ source: character, specialties: [], choices: character.line_data.creation_choices, draft: true, step: 3 });
  const markup = render(createElement(werewolfBuilder.Component, { initial, player: "Test", catalogs, onCancel() {}, onSave() {}, onSaveDraft() {} }));
  assert.doesNotMatch(markup, /Choose three named Specialties|Describe the physical Touchstone|Describe the spiritual Touchstone/);
  assert.match(markup, /Flesh Touchstone.*Optional/);
  const edited = create({ source: character, specialties: [], choices: { ...choices, physical_touchstone: "My authored friend", spiritual_touchstone: "" } });
  assert.equal(edited.line_data.physical_touchstone, "My authored friend");
  assert.equal(edited.line_data.spiritual_touchstone, "");
});

test("WTF2 pp. 146–149 Fetishes and Talens retain all 18 canonical samples, ratings, variants and full Portuguese presentation", () => {
  assert.equal(fetishCatalog.items.length, 18);
  assert.equal(fetishCatalog.items.filter(item => item.kind === "fetish").length, 13);
  assert.equal(fetishCatalog.items.filter(item => item.kind === "talen").length, 5);
  assert.equal(new Set(fetishCatalog.items.map(item => item.id)).size, 18);
  assert.deepEqual(new Set(Object.keys(fetishCatalog.presentation.items)), new Set(fetishCatalog.items.map(item => item.id)));
  assert.deepEqual(fetishCatalog.rules.ratings.map(level => level.dots), [1, 2, 3, 4, 5]);
  assert.match(fetishCatalog.rules.fetishActivation, /Resolve \+ Composure.*dot rating.*1 Essence/);
  assert.match(fetishCatalog.rules.talenActivation, /no roll.*one use/);
  assert.match(fetishCatalog.rules.talenFacet, /rating for Renown.*permanent Facet.*one scene.*does not teach/);
  assert.match(fetishCatalog.rules.talenInfluence, /Presence \+ Wits.*Power \+ Finesse/);
  for (const field of ["identification", "creation", "fetishActivation", "talenCreation", "talenActivation", "talenFacet", "talenInfluence"])
    assert.ok(fetishCatalog.presentation.rules[field]);
  for (const item of fetishCatalog.items) {
    assert.equal(item.sourceId, "wtf-2ed"); assert.ok(item.page >= 147 && item.page <= 149);
    assert.ok(item.name && item.description && item.effect); assert.ok(item.dots >= 1 && item.dots <= 5);
    const pt = fetishPresentation(item, fetishCatalog, "pt-BR");
    assert.ok(pt.name && pt.description && pt.effect);
    assert.deepEqual([pt.id, pt.kind, pt.dots, pt.source, pt.page, pt.facetId], [item.id, item.kind, item.dots, item.source, item.page, item.facetId]);
    if (item.facetId) assert.ok(gifts.gifts.some(gift => gift.facets.some(facet => facet.id === item.facetId)));
    for (const variant of item.variants ?? []) assert.ok(fetishCatalog.presentation.items[item.id].variants[variant.id].name && fetishCatalog.presentation.items[item.id].variants[variant.id].effect);
  }
  assert.deepEqual(fetishCatalog.items.find(item => item.id === "wtf-core:steel-wolf").variants.map(item => item.id), ["road-shadow", "ironhide"]);
  assert.match(fetishCatalog.items.find(item => item.id === "wtf-core:rust-talon-bindings").effect, /1 lethal.*pool of 5.*Unchained Strength.*Structure.*ignoring Durability/);
  assert.match(fetishCatalog.items.find(item => item.id === "wtf-core:crimson-falx").effect, /first enemy.*permanently.*Arm Wrack or Leg Wrack/);
  assert.match(fetishCatalog.presentation.items["wtf-core:shadow-thunderhead-mask"].effect, /Numina/);
  assert.ok(Object.isFrozen(fetishCatalog.items));
  assert.ok(requests.includes("/game-lines/werewolf/data/fetishes/wtf-core.json"));
  assert.ok(requests.includes("/game-lines/werewolf/data/fetishes/wtf-core-pt.json"));
});

test("Werewolf fetish inventory validates current-schema identities and ratings without guessing or dropping unavailable selections", () => {
  assert.deepEqual(fetishSelections(undefined), []);
  const item = fetishCatalog.items[0];
  const first = catalogFetishSelection(item), second = catalogFetishSelection(item);
  assert.notEqual(first.instanceId, second.instanceId); assert.equal(first.catalogId, item.id);
  assert.equal(first.custom, undefined); assert.equal(first.quantity, 1);
  const unknown = { instanceId: "future-item", catalogId: "future:unknown", variantId: "future-variant", quantity: 0, spirit: "Authored spirit", notes: "Do not translate" };
  assert.deepEqual(fetishSelections([unknown]), [unknown]);
  const custom = customFetishSelection(); custom.custom.name = "My item";
  const before = structuredClone(custom); assert.deepEqual(fetishSelections([custom]), [custom]); assert.deepEqual(custom, before);
  for (const invalid of ["not-an-array", [first, first], [{ ...first, quantity: -1 }], [{ ...first, quantity: 1.2 }], [{ ...first, quantity: "2" }], [{ ...first, notes: 9 }],
    [{ ...first, catalogId: "" }], [{ ...custom, catalogId: item.id }], [{ ...custom, custom: { ...custom.custom, dots: 6 } }], [{ ...custom, custom: { ...custom.custom, dots: "1" } }],
    [{ ...custom, custom: { ...custom.custom, kind: "token" } }]]) assert.throws(() => fetishSelections(invalid), /Werewolf fetish|custom Werewolf fetish/);
});

test("Werewolf inventory survives creation, draft resume, reediting and schema-2 round-trip without spending XP or granting powers", () => {
  const selection = catalogFetishSelection(fetishCatalog.items.find(item => item.id === "wtf-core:cuneiform-cylinder"));
  selection.quantity = 3; selection.spirit = "My original spirit"; selection.notes = "Player-authored description";
  const custom = customFetishSelection(); custom.custom = { kind: "talen", dots: 4, name: "Authored item", description: "Never translate me", effect: "A table-approved effect" };
  const fetishes = [selection, custom];
  const baseline = funded(); const before = structuredClone(baseline);
  const created = create({ source: baseline, fetishes });
  assert.deepEqual(created.line_data.fetishes, fetishes);
  assert.deepEqual(created.current_state, baseline.current_state);
  assert.deepEqual(created.line_data.learned_facets, baseline.line_data.learned_facets);
  assert.deepEqual(created.line_data.creation_facets, baseline.line_data.creation_facets);
  const decoded = JSON.parse(JSON.stringify(created));
  const normalized = werewolfRules.normalizeCharacter(decoded);
  assert.deepEqual(normalized.line_data.fetishes, fetishes);
  const draft = create({ source: normalized, draft: true, step: 3 });
  const resumed = create({ source: draft });
  assert.deepEqual(resumed.line_data.fetishes, fetishes);
  assert.deepEqual(baseline, before);
  const markup = render(createElement(FetishInventory, { value: fetishes, catalog: fetishCatalog, gifts, onChange: () => assert.fail("render changed inventory") }));
  assert.match(markup, /Cuneiform Cylinder|Authored item/); assert.match(markup, /My original spirit|Never translate me|Remaining quantity/);
  assert.doesNotMatch(markup, /missing translation|>Activate<|>Consume<|>Spend Experience</);
});

test("Fetish cards separate activation, effects, exact variants and linked Facet rules without changing character powers", () => {
  const steel = fetishCatalog.items.find(item => item.id === "wtf-core:steel-wolf");
  const markup = render(createElement(FetishItemRules, { item: steel, catalog: fetishCatalog, gifts, variantId: "ironhide" }));
  assert.match(markup, /<strong>Activation:<\/strong>/); assert.match(markup, /<strong>Effect:<\/strong>/);
  assert.match(markup, /Ironhide.*Durability increases by \+3/); assert.doesNotMatch(markup, /Road Shadow/);
  const talen = render(createElement(FetishItemRules, { item: fetishCatalog.items[0], catalog: fetishCatalog, gifts }));
  assert.match(talen, /Related Facet: Knotted Paths|Knotted Paths/); assert.match(talen, /substituting.*rating for Renown/);
  const picker = render(createElement(FetishCatalog, { catalog: fetishCatalog, gifts, onAdd: () => assert.fail("render added an item") }));
  assert.match(picker, /Search items by name, effect or source/); assert.equal((picker.match(/aria-label="Add /g) ?? []).length, 18);
  const css = readFileSync(new URL("../game-lines/werewolf/styles/fetishes.css", import.meta.url), "utf8");
  assert.match(css, /@media[\s\S]*\.wtf-fetish-inventory > \.panel-heading \{ flex-direction: column/);
  assert.match(css, /\.wtf-fetish-inventory > \.panel-heading > button \{ width: 100%/);
});

test("WTF2 p. 172 loss of temporary Health upgrades least severe remaining wounds exactly once", () => {
  assert.deepEqual(damageAfterHealthReduction(Array(9).fill("lethal"), 8), ["aggravated", ...Array(7).fill("lethal")]);
  assert.deepEqual(damageAfterHealthReduction(Array(10).fill("bashing"), 8), ["lethal", "lethal", ...Array(6).fill("bashing")]);
  assert.deepEqual(damageAfterHealthReduction(["aggravated", "lethal", "lethal", "bashing", "bashing", "bashing"], 4), ["aggravated", "aggravated", "lethal", "lethal"]);
  assert.deepEqual(damageAfterHealthReduction(Array(10).fill("aggravated"), 8), Array(10).fill("aggravated"));
  assert.throws(() => damageAfterHealthReduction([], 0), /positive integer/);
  const character = create();
  character.current_state = { ...character.current_state, form: "gauru", health_damage: Array(10).fill("lethal"), notes: "Do not replace", essence_current: 2 };
  const before = structuredClone(character);
  const reduced = changeWerewolfForm(character, "hishu");
  const health = werewolfFormTraits(character, "hishu").health;
  assert.equal(reduced.health_damage.length, health);
  assert.equal(reduced.health_damage.filter(wound => wound === "aggravated").length, 10 - health);
  assert.equal(reduced.notes, "Do not replace"); assert.equal(reduced.essence_current, 2);
  const small = { ...character, current_state: reduced };
  assert.deepEqual(changeWerewolfForm(small, "hishu"), reduced);
  const expanded = changeWerewolfForm(small, "gauru");
  assert.deepEqual(expanded.health_damage, reduced.health_damage);
  assert.deepEqual(changeWerewolfForm({ ...character, current_state: expanded }, "hishu").health_damage, reduced.health_damage);
  assert.deepEqual(character, before);
});

test("Mobile form reference renders only the selected form and never includes the desktop background", async () => {
  const { MobileForm } = await vite.ssrLoadModule("/game-lines/werewolf/forms-table.tsx");
  const markup = render(createElement(MobileForm, { character: create(), reference, value: "urshul", onChange: () => assert.fail("render changed form") }));
  assert.equal((markup.match(/data-form=/g) ?? []).length, 1);
  assert.match(markup, /data-form="urshul"/);
  assert.match(markup, /<dt>Manipulation<\/dt><dd>1<\/dd>/);
  assert.doesNotMatch(markup, /wtf-form-columns|forms.webp|<h4>Gauru|<summary>Attributes/);
});

test("Werewolf registration loads only immutable Core and Werewolf resources with independent surfaces", async () => {
  assert.deepEqual(listGameLineRegistrations().map(item => item.id), ["CofD", "CtL", "MtA", "VtR", "WtF"]);
  assert.equal((await registration.loadBuilder()).Component, werewolfBuilder.Component);
  assert.equal((await registration.loadSheet()).Component, WerewolfCharacterPaper);
  const loadedRules = await registration.loadRules();
  assert.equal(loadedRules.normalizeCharacter, werewolfRules.normalizeCharacter);
  assert.deepEqual(loadedRules.deriveCharacterState(create()), werewolfRules.deriveCharacterState(create()));
  assert.equal(registration.loadPrintSheet, undefined, "Print must not be advertised before its own implementation exists");
  assert.ok(requests.length > 10);
  for (const url of requests) assert.match(url, /^\/(?:shared\/data|game-lines\/werewolf\/data)\//);
  assert.ok(Object.isFrozen(reference.forms[0].attributes));
  assert.ok(Object.isFrozen(gifts.gifts[0].facets));
  assert.throws(() => gifts.gifts[0].facets.push({}), TypeError);
  assert.throws(() => catalogs.get("changeling-contracts"), /absent/);
});

test("WTF2 pp. 99 and 114–115 Renown costs three XP per deed and grants ordered Auspice Moon Facets without charging twice", () => {
  const original = funded(), before = structuredClone(original);
  const next = buy(original, purchaseRenown("Purity", 3), advancementCatalogs);
  assert.equal(next.line_data.renown.Purity, 3); assert.equal(next.line_data.experience_renown.Purity, 1);
  assert.equal(next.current_state.experience_available, 97); assert.equal(next.current_state.experience_spent, 3);
  const fullMoon = gifts.gifts.find(gift => gift.id === "gift-full-moon"), third = fullMoon.facets.find(facet => facet.level === 3);
  assert.deepEqual(next.line_data.renown_facets, [third.id]); assert.ok(knownFacets(next).includes(third.id));
  assert.equal(renownGrants(next).length, 0); assert.equal(history(next).length, 1);
  assert.throws(() => quote(next, purchaseFacet(third.id), advancementCatalogs), failsWith("facetKnown"));
  assert.throws(() => quote(original, { ...purchaseRenown("Cunning", 1), deed: " " }, advancementCatalogs), failsWith("renownDeed"));
  assert.throws(() => quote(original, purchaseRenown("Purity", 4), advancementCatalogs), failsWith("invalidPurchase"));
  let maximum = next;
  for (const rating of [4, 5]) maximum = buy(maximum, purchaseRenown("Purity", rating), advancementCatalogs);
  assert.throws(() => quote(maximum, purchaseRenown("Purity", 6), advancementCatalogs), failsWith("invalidPurchase"));
  const returned = refund(next, history(next)[0].id, advancementCatalogs);
  assert.equal(returned.line_data.renown.Purity, 2); assert.deepEqual(returned.line_data.renown_facets, []);
  assert.deepEqual(returned.line_data.creation_facets, original.line_data.creation_facets);
  assert.deepEqual(original, before);
});

test("Shadow unlock includes one Facet at affinity cost; subsequent Facets cost two and Wolf Facets require no unlock", () => {
  const original = funded(), favored = gifts.gifts.find(gift => gift.id === "gift-rage"), other = gifts.gifts.find(gift => gift.id === "gift-weather");
  const first = favored.facets.find(facet => facet.renown === "Purity"), second = favored.facets.find(facet => facet.renown === "Glory"), nonAffinity = other.facets.find(facet => facet.renown === "Glory");
  assert.equal(quote(original, purchaseFacet(first.id, "", "A spirit from the Sacred Hunt"), advancementCatalogs), 3);
  assert.equal(quote(original, purchaseFacet(nonAffinity.id, "", "A storm spirit"), advancementCatalogs), 5);
  assert.throws(() => quote(original, purchaseFacet(first.id), advancementCatalogs), failsWith("giftSource"));
  const unlocked = buy(original, purchaseFacet(first.id, "", "A spirit from the Sacred Hunt"), advancementCatalogs);
  assert.equal(quote(unlocked, purchaseFacet(second.id), advancementCatalogs), 2);
  const advanced = buy(unlocked, purchaseFacet(second.id), advancementCatalogs), unlockId = history(advanced)[0].id;
  assert.equal(advanced.current_state.experience_spent, 5); assert.equal(advanced.line_data.gift_unlocks.length, 1);
  assert.throws(() => refund(advanced, unlockId, advancementCatalogs), failsWith("refundDependent"));
  const revertedFacet = refund(advanced, history(advanced)[1].id, advancementCatalogs);
  const revertedUnlock = refund(revertedFacet, unlockId, advancementCatalogs);
  assert.deepEqual(revertedUnlock.line_data.gift_unlocks, []); assert.deepEqual(revertedUnlock.line_data.learned_facets, []);
  assert.equal(revertedUnlock.current_state.experience_available, 100);
  const wolf = purchaseFacet("gift-change:the-fathers-form");
  assert.equal(quote(original, wolf, advancementCatalogs), 1);
  const learned = buy(original, wolf, advancementCatalogs);
  assert.equal(learned.line_data.gift_unlocks, undefined);
  assert.throws(() => quote(learned, wolf, advancementCatalogs), failsWith("facetKnown"));
  assert.throws(() => quote(original, purchaseFacet("gift-change:skin-thief"), advancementCatalogs), failsWith("facetRenown"));
});

test("Free Renown credits require the matching category and cannot unlock a Shadow Gift or mint XP on release", () => {
  let next = buy(funded(), purchaseRenown("Cunning", 1), advancementCatalogs);
  const entryId = history(next)[0].id, credit = renownGrants(next)[0];
  assert.equal(credit.id, entryId); assert.equal(credit.facetId, null);
  assert.throws(() => allocateGrant(next, entryId, "gift-death:cold-embrace", advancementCatalogs), failsWith("giftAllocation"));
  assert.throws(() => allocateGrant(next, entryId, "gift-change:the-fathers-form", advancementCatalogs), failsWith("facetRenown"));
  const states = structuredClone(next.current_state);
  next = allocateGrant(next, entryId, "gift-change:skin-thief", advancementCatalogs);
  assert.deepEqual(next.current_state, states); assert.ok(knownFacets(next).includes("gift-change:skin-thief"));
  assert.deepEqual(next.line_data.learned_facets, []);
  assert.throws(() => allocateGrant(next, entryId, "gift-hunting:honed-senses", advancementCatalogs), failsWith("giftAllocation"));
  assert.throws(() => refund(next, entryId, advancementCatalogs), failsWith("refundDependent"));
  next = allocateGrant(next, entryId, null, advancementCatalogs);
  assert.deepEqual(next.current_state, states); assert.ok(!knownFacets(next).includes("gift-change:skin-thief"));
  // Purchasing an appropriate family later makes a saved credit usable, without giving a free family unlock.
  next = buy(next, purchaseFacet("gift-death:barghest", "", "Spirit of a graveyard"), advancementCatalogs);
  const unlockId = history(next).at(-1).id;
  next = allocateGrant(next, entryId, "gift-death:cold-embrace", advancementCatalogs);
  assert.throws(() => refund(next, unlockId, advancementCatalogs), failsWith("refundDependent"));
  next = allocateGrant(next, entryId, null, advancementCatalogs);
  next = refund(next, unlockId, advancementCatalogs); next = refund(next, entryId, advancementCatalogs);
  assert.equal(next.current_state.experience_available, 100); assert.deepEqual(renownGrants(next), []);
});

test("Authorized additional Moon Gifts cost five then two and retain ascending-order, Renown and exact refund dependencies", () => {
  let next = buy(funded(), purchaseRenown("Wisdom", 1), advancementCatalogs);
  next = buy(next, purchaseRenown("Wisdom", 2), advancementCatalogs);
  const gift = gifts.gifts.find(item => item.id === "gift-crescent-moon"), first = gift.facets[0], second = gift.facets[1], third = gift.facets[2];
  assert.throws(() => quote(next, purchaseFacet(first.id), advancementCatalogs), failsWith("moonAuthorization"));
  assert.throws(() => quote(next, purchaseFacet(second.id, "ST approved exception"), advancementCatalogs), failsWith("moonOrder"));
  assert.throws(() => quote(next, purchaseFacet(third.id, "ST approved exception"), advancementCatalogs), failsWith("facetRenown"));
  assert.equal(quote(next, purchaseFacet(first.id, "ST approved exception"), advancementCatalogs), 5);
  next = buy(next, purchaseFacet(first.id, "ST approved exception"), advancementCatalogs);
  const unlockId = history(next).at(-1).id;
  assert.equal(quote(next, purchaseFacet(second.id, "ST approved exception"), advancementCatalogs), 2);
  next = buy(next, purchaseFacet(second.id, "ST approved exception"), advancementCatalogs);
  assert.throws(() => refund(next, unlockId, advancementCatalogs), failsWith("refundDependent"));
  assert.throws(() => refund(next, history(next)[1].id, advancementCatalogs), failsWith("refundDependent"));
  next = refund(next, history(next).at(-1).id, advancementCatalogs); next = refund(next, unlockId, advancementCatalogs);
  assert.deepEqual(next.line_data.learned_facets, []);
});

test("Gift grants and purchases round-trip through lifecycle and creation editing without changing origins or balances", async () => {
  const { prepareCharacterForSave, importCharacterFile } = await vite.ssrLoadModule("/app/workspace/character-lifecycle.ts");
  let source = buy(funded(), purchaseRenown("Purity", 3), advancementCatalogs);
  source = buy(source, purchaseRenown("Cunning", 1), advancementCatalogs);
  source = allocateGrant(source, history(source).at(-1).id, "gift-change:skin-thief", advancementCatalogs);
  source = buy(source, purchaseFacet("gift-hunting:cow-the-prey"), advancementCatalogs);
  const saved = await prepareCharacterForSave(source), imported = await importCharacterFile({ text: async () => JSON.stringify(saved) });
  assert.deepEqual(imported.line_data, source.line_data); assert.deepEqual(imported.current_state, source.current_state);
  const edited = create({ source: imported }), draft = create({ source: imported, draft: true, step: 4, allowAdvancement: true });
  for (const character of [edited, draft]) {
    assert.deepEqual(knownFacets(character), knownFacets(source)); assert.deepEqual(history(character), history(source));
    assert.deepEqual(character.line_data.creation_facets, source.line_data.creation_facets);
    assert.deepEqual(giftProgressionProblems(character, reference, gifts), []);
  }
  const differentAuspice = { ...choices, auspice_id: "cahalith", auspice_skill: "Expression", shadow_facets: ["gift-inspiration:fearless-hunter", gifts.gifts.find(gift => gift.id === "gift-rage").facets.find(facet => facet.renown === "Glory").id] };
  assert.throws(() => create({ source, choices: differentAuspice }), /Gift progression|changing Auspice/);
});

test("Gift transactions preserve damage and resources, reject corrupted origins and protect dependencies per Facet rather than per error category", () => {
  let source = funded();
  source.current_state.health_damage = Array(14).fill("lethal"); source.current_state.essence_current = 2; source.current_state.willpower_current = 1;
  source.current_state.experience_available = 0; source.current_state.experience_total = 0;
  const planned = buy(source, purchaseRenown("Cunning", 1), advancementCatalogs, true);
  const creditId = history(planned)[0].id;
  assert.equal(planned.current_state.experience_available, 0); assert.equal(planned.current_state.experience_total, 3);
  assert.deepEqual(planned.current_state.health_damage, source.current_state.health_damage);
  assert.equal(planned.current_state.essence_current, 2); assert.equal(planned.current_state.willpower_current, 1);
  const returned = refund(planned, creditId, advancementCatalogs, true);
  assert.equal(returned.current_state.experience_available, 0); assert.equal(returned.current_state.experience_total, 0);
  const corrupt = structuredClone(planned); corrupt.line_data.renown_grants.push({ unknown: "opaque data" });
  const before = structuredClone(corrupt);
  assert.throws(() => allocateGrant(corrupt, creditId, "gift-change:skin-thief", advancementCatalogs), failsWith("giftAllocation"));
  assert.throws(() => refund(corrupt, creditId, advancementCatalogs, true), failsWith("giftAllocation"));
  assert.deepEqual(corrupt, before);
  // A pre-existing unrelated invalid Renown must not hide a NEW invalid dependency after this refund.
  source = buy(funded(), purchaseRenown("Cunning", 1), advancementCatalogs);
  const id = history(source)[0].id;
  source = buy(source, purchaseFacet("gift-change:skin-thief"), advancementCatalogs);
  source.line_data.learned_facets.push("gift-change:quicksilver-flesh");
  assert.throws(() => refund(source, id, advancementCatalogs), failsWith("refundDependent"));
  const missing = structuredClone(source); missing.line_data.experience_renown.Cunning = 0;
  assert.throws(() => refund(missing, id, advancementCatalogs), failsWith("refundMissing"));
});

test("Gift chooser exposes every canonical Facet with complete mechanics and disabled reasons, while credits remain visibly separate", () => {
  const character = buy(funded(), purchaseRenown("Cunning", 1), advancementCatalogs);
  const html = render(createElement(FacetExperienceCatalog, { character, catalogs: advancementCatalogs, selectedId: "", onSelect() {} }));
  assert.equal((html.match(/class="wtf-rite-experience-row"/g) ?? []).length, 115);
  assert.match(html, /Skin Thief/); assert.match(html, /Dice Pool/); assert.match(html, /Exceptional Success/); assert.match(html, /disabled=""/);
  assert.match(html, /Unlock includes the first Facet/);
  const credits = render(createElement(RenownGrantsPanel, { character, catalogs: advancementCatalogs, updateSheet() {} }));
  assert.match(credits, /1 pending/); assert.match(credits, /Free Renown Facets/);
  const facet = purchaseFacet("gift-change:skin-thief");
  assert.notEqual(werewolfPurchaseLabel(facet, advancementCatalogs, "pt-BR"), werewolfPurchaseLabel(facet, advancementCatalogs, "en-US"));
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
  source.line_data.learned_facets = [gifts.gifts.find(gift => gift.kind === "wolf").facets.find(facet => facet.renown === "Purity").id];
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

test("Werewolf creation, XP upgrades and refunds retain definition IDs independently of stored display names", () => {
  let character = funded();
  assert.deepEqual(character.merits.filter(item => item.grantedBy).map(item => item.definitionId).sort(), ["core-2ed:language", "wtf-2ed:totem"]);
  character = buy(character, purchaseMerit("wtf-2ed:blood-or-bone-affinity", 2, { anchor: "blood" }), advancementCatalogs);
  const purchased = character.merits.find(item => item.definitionId === "wtf-2ed:blood-or-bone-affinity");
  assert.ok(purchased.instanceId); assert.equal(purchased.creationDots, 0); assert.equal(purchased.experienceDots, 2);
  const first = history(character).at(-1);
  assert.equal(first.purchase.definitionId, purchased.definitionId); assert.equal(first.undo.definitionId, purchased.definitionId);
  purchased.name = "Afinidade escolhida pelo jogador";
  const before = structuredClone(character);
  character = buy(character, purchaseMerit(purchased.definitionId, 5, {}, purchased.instanceId), advancementCatalogs);
  assert.deepEqual(before.merits.find(item => item.instanceId === purchased.instanceId), purchased);
  assert.equal(character.merits.filter(item => item.instanceId === purchased.instanceId).length, 1);
  assert.equal(character.merits.find(item => item.instanceId === purchased.instanceId).name, purchased.name);
  const latest = history(character).at(-1);
  character = refund(character, latest.id, advancementCatalogs);
  assert.equal(character.merits.find(item => item.instanceId === purchased.instanceId).experienceDots, 2);
  for (const mutate of [
    sheet => { sheet.merits.find(item => item.instanceId === purchased.instanceId).definitionId = "unavailable:affinity"; },
    sheet => { sheet.merits.find(item => item.instanceId === purchased.instanceId).definitionId = "homebrew:affinity"; },
    sheet => { sheet.merits.push(structuredClone(sheet.merits.find(item => item.instanceId === purchased.instanceId))); },
  ]) {
    const invalid = structuredClone(character); mutate(invalid);
    const original = structuredClone(invalid);
    assert.throws(() => quote(invalid, purchaseMerit(purchased.definitionId, 5, {}, purchased.instanceId), advancementCatalogs), failsWith("meritInstance"));
    assert.throws(() => refund(invalid, first.id, advancementCatalogs), failsWith("refundMissing"));
    assert.deepEqual(invalid, original, "Failed identity checks never alter balances, history or choices");
  }
  const restored = refund(character, first.id, advancementCatalogs);
  assert.equal(restored.current_state.experience_available, 100);
  assert.ok(!restored.merits.some(item => item.instanceId === purchased.instanceId));
  assert.ok(restored.merits.filter(item => item.grantedBy).every(item => item.definitionId && item.creationDots === 1));
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
  const creation = render(createElement(CreationRiteCatalog, { value: choices, onChange: () => {}, catalog: rites, learnedRiteIds: ["wtf-core:chain-rage"] }));
  const blocked = creation.slice(creation.indexOf('aria-label="Select Chain Rage"') - 30, creation.indexOf('aria-label="Select Chain Rage"') + 150);
  assert.match(blocked, /disabled=""/);
  assert.match(creation, /This Rite is already known/);
  const removable = render(createElement(CreationRiteCatalog, { value: { ...choices, rites: ["wtf-core:chain-rage"] }, onChange: () => {}, catalog: rites, learnedRiteIds: ["wtf-core:chain-rage"] }));
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
    const { FacetExperienceCatalog: PtFacets, RenownGrantsPanel: PtGrants } = await portuguese.ssrLoadModule("/game-lines/werewolf/experience-gifts.tsx");
    const authored = customFetishSelection(); authored.custom.name = "Player's untranslated item";
    const character = create({ draft: true, step: 3, fetishes: [catalogFetishSelection(fetishCatalog.items[0]), authored], totem: configuredTotem() });
    character.line_data.totem = recordTotemImprovement(character.line_data.totem, "numen", "numen:stalwart", "Author's funding", 1, totemCatalog);
    character.current_state.werewolf_totem = { instanceId: character.line_data.totem.instanceId, essence: 0, willpower: 1, damage: ["bashing"], dormant: false };
    const before = structuredClone(character);
    const ptRender = element => renderToStaticMarkup(createElement(PtProvider, null, element));
    const markup = ptRender(createElement(PtSheet, { character, catalogs, updateState: () => {}, updateSheet: () => {} }));
    assert.match(markup, /mobile-character-sheet/);
    assert.doesNotMatch(markup, /wtf-form-columns|wtf-mobile-form/);
    for (const phrase of ["Corpo do Lobo", "Caçador Destemido", "Caçada Sagrada"]) assert.ok(markup.includes(phrase), phrase);
    assert.doesNotMatch(markup, /missing translation|<summary>Fearless Hunter/);
    assert.match(markup, /Fetiches e Talens|Boneca de Bruxa/); assert.match(markup, /Quantidade restante/);
    for (const phrase of ["Regras e exemplos de Totem", "O Ninho Vigilante", "Pedra Inabalável", "Espreitador da Morte", "Proibição:", "Fraqueza:", "Numina:"]) assert.ok(markup.includes(phrase), phrase);
    assert.doesNotMatch(markup, /The Wary Nest|<dt>Bane:|awaiting audit/);
    for (const phrase of ["Poderes do Totem", "Poderes: 40", "Uso de Numina", "<summary>Buscar", "Parada de Dados", "Divergência na fonte"]) assert.ok(markup.includes(phrase), phrase);
    assert.doesNotMatch(markup, /<summary>Seek|<summary>Using Numina/);
    for (const phrase of ["Outras contribuições (manual)", "Recursos do Totem", "Corpus não impõe penalidades", "Player&#x27;s Spirit", "Escolher Numina", "Escolher Manifestações"]) assert.ok(markup.includes(phrase), phrase);
    for (const phrase of ["Melhorias do Totem", "Registrar melhoria", "Inabalável", "Author&#x27;s funding"]) assert.ok(markup.includes(phrase), phrase);
    assert.doesNotMatch(markup, /\{p1\}|Other contributions|Choose Numina/);
    assert.match(markup, /Player&#x27;s untranslated item/); assert.doesNotMatch(markup, /<summary>Witch-Poppet/);
    const builderMarkup = ptRender(createElement(ptBuilder.Component, { initial: character, player: "Test", catalogs, onCancel: () => {}, onSave: () => {}, onSaveDraft: () => {} }));
    assert.match(builderMarkup, /Caçador Destemido/); assert.doesNotMatch(builderMarkup, /missing translation/);
    assert.deepEqual(character, before);
    const purchased = buy(funded(), { kind: "trait", group: "attributes", name: "Strength", target: 4 }, advancementCatalogs);
    const experienceMarkup = ptRender(createElement(PtExperience, { character: purchased, catalogs, updateSheet: () => assert.fail("render mutated structure") }));
    assert.match(experienceMarkup, /Força 4/); assert.match(experienceMarkup, /Gastar Experiência/); assert.doesNotMatch(experienceMarkup, /missing translation|Strength 4/);
    const riteMarkup = ptRender(createElement(PtRites, { catalog: rites, tribeId: choices.tribe_id, knownIds: choices.rites, selectedId: "", onSelect: () => {} }));
    assert.match(riteMarkup, /Todos os Ritos/); assert.match(riteMarkup, /Este Rito já é conhecido/); assert.match(riteMarkup, /Sucesso Excepcional/);
    assert.doesNotMatch(riteMarkup, /missing translation/);
    const advanced = buy(funded(), purchaseRenown("Cunning", 1), advancementCatalogs);
    const giftMarkup = ptRender(createElement(PtFacets, { character: advanced, catalogs: advancementCatalogs, selectedId: "", onSelect() {} }));
    assert.match(giftMarkup, /Todas as afinidades/); assert.match(giftMarkup, /Sucesso Excepcional/); assert.doesNotMatch(giftMarkup, /missing translation/);
    const grantsMarkup = ptRender(createElement(PtGrants, { character: advanced, catalogs: advancementCatalogs, updateSheet() {} }));
    assert.match(grantsMarkup, /1 pendentes/); assert.match(grantsMarkup, /Facetas gratuitas de Renome/);
  } finally { await portuguese.close(); }
});
