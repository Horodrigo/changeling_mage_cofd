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
const meritCatalog = [...catalogs.get("core-merits"), ...catalogs.get("werewolf-merits")];
const advancementCatalogs = { reference, gifts, rites, merits: meritCatalog };
const { purchaseWerewolfAdvancement: buy, refundWerewolfAdvancement: refund, werewolfPurchaseQuote: quote, werewolfExperienceHistory: history, WerewolfAdvancementError } = await vite.ssrLoadModule("/game-lines/werewolf/experience-rules.ts");
const { WerewolfExperiencePanel, werewolfPurchaseLabel } = await vite.ssrLoadModule("/game-lines/werewolf/experience-panel.tsx");
const { RiteExperienceCatalog } = await vite.ssrLoadModule("/game-lines/werewolf/experience-rites.tsx");
const { CreationRiteCatalog } = await vite.ssrLoadModule("/game-lines/werewolf/creation-rites.tsx");
const { buildWerewolfCharacter, werewolfBuilder, werewolfExperienceSpecialties } = await vite.ssrLoadModule("/game-lines/werewolf/builder.tsx");
const { werewolfRules, werewolfFormTraits, recordedAuspiceSkillGrant } = await vite.ssrLoadModule("/game-lines/werewolf/rules.ts");
const { withoutAuspiceSkillGrant, WEREWOLF_CREATION_GRANT_SOURCES } = await vite.ssrLoadModule("/game-lines/werewolf/creation-grants.ts");
const { useCommonBuilderState, experienceTraitDots } = await vite.ssrLoadModule("/app/character-builder-shell.tsx");
const { LanguageProvider } = await vite.ssrLoadModule("/lib/i18n.tsx");
const { ATTRIBUTES, SKILLS } = await vite.ssrLoadModule("/lib/core/character/creation-rules.ts");
const { WerewolfCharacterPaper } = await vite.ssrLoadModule("/game-lines/werewolf/sheet.tsx");
const { changeWerewolfForm, damageAfterHealthReduction } = await vite.ssrLoadModule("/game-lines/werewolf/form-state.ts");
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
  aspirations: ["", "", ""], merits: [], choices, reference, gifts, rites, meritCatalog };
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
  assert.equal(await registration.loadRules(), werewolfRules);
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
    const character = create({ draft: true, step: 3, fetishes: [catalogFetishSelection(fetishCatalog.items[0]), authored] });
    const before = structuredClone(character);
    const ptRender = element => renderToStaticMarkup(createElement(PtProvider, null, element));
    const markup = ptRender(createElement(PtSheet, { character, catalogs, updateState: () => {}, updateSheet: () => {} }));
    assert.match(markup, /mobile-character-sheet/);
    assert.doesNotMatch(markup, /wtf-form-columns|wtf-mobile-form/);
    for (const phrase of ["Corpo do Lobo", "Caçador Destemido", "Caçada Sagrada"]) assert.ok(markup.includes(phrase), phrase);
    assert.doesNotMatch(markup, /missing translation|<summary>Fearless Hunter/);
    assert.match(markup, /Fetiches e Talens|Boneca de Bruxa/); assert.match(markup, /Quantidade restante/);
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
