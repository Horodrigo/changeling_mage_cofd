import assert from "node:assert/strict";
import test, { after } from "node:test";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { createServer } from "vite";

const root = fileURLToPath(new URL("..", import.meta.url));
const vite = await createServer({ appType: "custom", configFile: false, root, resolve: { alias: { "@": root } }, server: { middlewareMode: true, hmr: false }, optimizeDeps: { noDiscovery: true, include: [] } });
after(() => vite.close());
const read = path => JSON.parse(readFileSync(new URL(`../public/${path}`, import.meta.url), "utf8"));
const { encodeMeritGrantChoice, decodeMeritGrantChoice } = await vite.ssrLoadModule("/lib/core/character/merit-configuration.ts");
const { synchronizeCommonMeritGrants } = await vite.ssrLoadModule("/lib/core/character/synchronize-merit-grants.ts");
const { commonExpandedConfigurationLines } = await vite.ssrLoadModule("/app/workspace/merit-configuration-presentation.ts");
const { withMeritPresentation } = await vite.ssrLoadModule("/lib/merit-presentation.ts");
const { resolveMeritDefinition } = await vite.ssrLoadModule("/lib/merit-identity.ts");
const { normalizeStoredSheet, validateCurrentCharacter } = await vite.ssrLoadModule("/lib/character-persistence.ts");
const { refundMeritDots } = await vite.ssrLoadModule("/lib/experience-refunds.ts");
const { mergeCreationMerits } = await vite.ssrLoadModule("/lib/merit-progression.ts");
const { blankPrintCharacter } = await vite.ssrLoadModule("/app/workspace/blank-print-character.ts");
const { MeritConfigurationEditor } = await vite.ssrLoadModule("/app/builder/merit-configuration-editor.tsx");
const { COMMON_MERIT_CONFIGURATIONS } = await vite.ssrLoadModule("/app/builder/common-merit-configurations.ts");
const { LanguageProvider, translate } = await vite.ssrLoadModule("/lib/i18n.tsx");
const mageGrants = await vite.ssrLoadModule("/game-lines/mage/builder-merit-grants.ts");
const vampireGrants = await vite.ssrLoadModule("/game-lines/vampire/builder-merit-grants.ts");
const { COMMON_MERIT_IDENTITIES } = await vite.ssrLoadModule("/lib/core/character/merit-identities.ts");
const { derivedWithPermanentMerits } = await vite.ssrLoadModule("/lib/core/character/derived-traits.ts");
const { mortalRules, synchronizeMortalMeritGrants } = await vite.ssrLoadModule("/game-lines/mortal/rules.ts");
const catalog = withMeritPresentation(read("shared/data/merits.json"), read("shared/data/merits-pt.json"));
const resources = catalog.find(item => item.id === "core-2ed:resources");
const namesake = { ...resources, id: "homebrew:test:resources", sourceId: "homebrew:test", source: "Player source", translatedName: "Outro recurso", presentationPt: { name: "Outro recurso", description: "Outro efeito" } };
const catalogs = [namesake, ...catalog];

test("pure Core Merit identities reconcile the canonical catalog, not a second editorial dataset", () => {
  assert.equal(COMMON_MERIT_IDENTITIES.length, 8);
  for (const identity of COMMON_MERIT_IDENTITIES) {
    const definition = catalog.find(item => item.id === identity.id);
    assert.ok(definition, identity.id);
    assert.equal(identity.name, definition.name);
    assert.equal(identity.sourceId, definition.sourceId);
  }
});

test("Core grants dispatch by definition ID and derive stable grant identities independently of display names", () => {
  const sheet = blankPrintCharacter("CofD");
  sheet.merits = [{ definitionId: "core-2ed:professional-training", name: "Edited display", instanceId: "profession", dots: 4, creationDots: 1, experienceDots: 3,
    configuration: { contacts: ["Authored group", "Other authored group"], specialty_1_skill: "Crafts", specialty_1_name: "Authored specialty", boosted_skill: "Athletics" } }];
  const ownerBefore = JSON.stringify(sheet.merits[0]);
  assert.deepEqual(synchronizeCommonMeritGrants(sheet), { Athletics: 1 });
  assert.equal(JSON.stringify(sheet.merits[0]), ownerBefore);
  const granted = sheet.merits[1];
  assert.equal(granted.definitionId, "core-2ed:contacts");
  assert.equal(granted.sourceId, "core-2ed");
  assert.equal(granted.grantedBy, "Merit:core-2ed:professional-training:profession");
  assert.deepEqual(granted.configuration.groups, ["Authored group", "Other authored group"]);
  const grantsBefore = JSON.stringify([sheet.merits.slice(1), sheet.specializations]);
  sheet.merits[0].name = "Treinamento Profissional";
  synchronizeCommonMeritGrants(sheet);
  assert.equal(JSON.stringify([sheet.merits.slice(1), sheet.specializations]), grantsBefore);
  sheet.merits = [{ definitionId: "core-2ed:mystery-cult-influence", name: "Renamed", instanceId: "influence", dots: 1,
    configuration: { level_1_type: "merit", level_1_merits: [encodeMeritGrantChoice(resources, 1)] } }];
  synchronizeCommonMeritGrants(sheet);
  assert.equal(sheet.merits[1].definitionId, resources.id);
  assert.equal(sheet.merits[1].grantedBy, "Merit:core-2ed:mystery-cult-influence:influence:1");
});

test("Homebrew namesakes, unavailable IDs and foreign source names never receive official Core effects", () => {
  for (const identity of COMMON_MERIT_IDENTITIES) for (const extra of [{ definitionId: "homebrew:test:merit" }, { definitionId: "unavailable:id" }, { sourceId: "homebrew:test" }]) {
    const sheet = blankPrintCharacter("CofD");
    sheet.derived = { Tamanho: 5, Vitalidade: 7, Iniciativa: 4, Defesa: 3, Deslocamento: 9 };
    sheet.merits = [{ ...identity, ...extra, name: identity.name, instanceId: "authored", dots: 5, configuration: { contacts: ["Authored"], boosted_skill: "Athletics", level_1_type: "skill", level_1_skill: "Athletics" } }];
    const before = JSON.stringify(sheet);
    assert.deepEqual(synchronizeCommonMeritGrants(sheet), {});
    assert.equal(JSON.stringify(sheet), before);
    assert.deepEqual(derivedWithPermanentMerits(sheet), sheet.derived);
  }
  const sheet = blankPrintCharacter("CofD");
  sheet.derived = { Tamanho: 5, Vitalidade: 7, Iniciativa: 4, Defesa: 3, Deslocamento: 9 };
  sheet.merits = [{ name: "Professional Training", sourceId: "core-2ed", instanceId: "old", dots: 1, configuration: { contacts: ["Old authored group"] } }];
  synchronizeCommonMeritGrants(sheet);
  assert.equal(sheet.merits[1].definitionId, "core-2ed:contacts");
  sheet.merits = [{ definitionId: "core-2ed:fast-reflexes", name: "Renamed", dots: 2 }, { definitionId: "core-2ed:giant", name: "Renamed", dots: 3 }];
  const derived = derivedWithPermanentMerits(sheet);
  assert.equal(derived.Iniciativa, sheet.derived.Iniciativa + 2);
  assert.equal(derived.Tamanho, 6);
  assert.equal(derived.Vitalidade, sheet.derived.Vitalidade + 1);
});

test("Mortal synchronization is pure, preserves paid instances/state and regenerates only unlocked Core grants", () => {
  const sheet = blankPrintCharacter("CofD");
  sheet.merits = [{ definitionId: "core-2ed:professional-training", name: "Edited display", instanceId: "paid-profession", dots: 4, creationDots: 0, experienceDots: 4,
    configuration: { contacts: ["Authored group"], specialty_1_skill: "Crafts", specialty_1_name: "Authored", boosted_skill: "Athletics" } }];
  sheet.specializations = [{ skill: "Crafts", name: "Paid specialty" }];
  sheet.current_state.experience_available = 8;
  sheet.current_state.health_damage = ["lethal"];
  const before = JSON.stringify(sheet);
  const next = mortalRules.synchronizeCharacter(sheet);
  assert.equal(JSON.stringify(sheet), before);
  assert.deepEqual(next.current_state, sheet.current_state);
  assert.deepEqual(next.merits[0], sheet.merits[0]);
  assert.deepEqual(next.line_data.merit_granted_skill_bonuses, { Athletics: 1 });
  assert.deepEqual(mortalRules.synchronizeCharacter(next), next);
  assert.equal(refundMeritDots(next, "Unrelated name", 4, "paid-profession", undefined, "core-2ed:professional-training"), true);
  synchronizeMortalMeritGrants(next);
  assert.deepEqual(next.merits, []);
  assert.deepEqual(next.specializations, sheet.specializations);
  assert.deepEqual(next.line_data.merit_granted_skill_bonuses, {});
  assert.deepEqual(next.current_state, sheet.current_state);
});

test("rebuilding generated Core grants never deletes recorded XP or reassigns its purchased instance", () => {
  const sheet = blankPrintCharacter("CofD");
  const owner = { definitionId: "core-2ed:professional-training", name: "Professional Training", instanceId: "owner", dots: 1, configuration: { contacts: ["Authored"] } };
  const paid = { definitionId: "core-2ed:contacts", name: "Contacts", instanceId: "grant-core-2ed:professional-training:owner-contacts", dots: 4, creationDots: 2, experienceDots: 2,
    grantedBy: "Merit:core-2ed:professional-training:owner", configuration: { groups: ["Authored"] } };
  sheet.merits = [owner, paid];
  const state = JSON.stringify(sheet.current_state);
  synchronizeCommonMeritGrants(sheet);
  const retained = sheet.merits.find(item => item.instanceId === paid.instanceId);
  assert.equal(retained.dots, 2);
  assert.equal(retained.creationDots, 0);
  assert.equal(retained.experienceDots, 2);
  assert.equal(retained.grantedBy, undefined);
  assert.equal(new Set(sheet.merits.map(item => item.instanceId)).size, sheet.merits.length);
  const once = JSON.stringify(sheet);
  synchronizeCommonMeritGrants(sheet);
  assert.equal(JSON.stringify(sheet), once);
  sheet.merits = sheet.merits.filter(item => item.instanceId !== owner.instanceId);
  synchronizeCommonMeritGrants(sheet);
  assert.deepEqual(sheet.merits, [retained]);
  assert.equal(refundMeritDots(sheet, "Renamed", 2, paid.instanceId, undefined, paid.definitionId), true);
  assert.deepEqual(sheet.merits, []);
  assert.equal(JSON.stringify(sheet.current_state), state);
});

test("Cult choices persist canonical definition/source IDs and preserve exact Homonym choices", () => {
  for (const definition of [resources, namesake]) {
    const row = encodeMeritGrantChoice(definition, 2);
    const choice = decodeMeritGrantChoice(row);
    assert.deepEqual(choice, { definitionId: definition.id, name: definition.name, dots: 2, sourceId: definition.sourceId, source: definition.source });
    assert.equal(resolveMeritDefinition(choice, catalogs), definition);
    assert.equal(resolveMeritDefinition({ ...choice, name: "Altered display", sourceId: "Altered source" }, catalogs), definition);
  }
  const legacy = decodeMeritGrantChoice("Resources|2");
  assert.deepEqual(legacy, { name: "Resources", dots: 2 });
  assert.equal(resolveMeritDefinition(legacy, catalogs), undefined);
  assert.equal(decodeMeritGrantChoice(encodeMeritGrantChoice({ ...resources, id: "unavailable:id" }, 1)).definitionId, "unavailable:id");
});

test("Cult grants preserve ID, stable instance, purchase allocations and schema-2 rows across repeated synchronization", () => {
  const sheet = blankPrintCharacter("CofD");
  const configuration = { cult: "Authored name", level_1_type: "merit", level_1_merits: [encodeMeritGrantChoice(namesake, 1)], level_3_type: "merits", level_3_merits: ["Resources|2"] };
  sheet.merits = [{ definitionId: "core-2ed:mystery-cult-initiation", name: "Mystery Cult Initiation", instanceId: "cult-instance", dots: 3, creationDots: 1, experienceDots: 2, configuration }];
  sheet.current_state.experience_available = 7;
  sheet.current_state.experience_spent = 2;
  sheet.current_state.experience_history = [{ id: "purchase", kind: "spend", experience: -2, description: "Existing history", createdAt: "2026-10-03T00:00:00Z" }];
  const before = JSON.stringify({ owner: sheet.merits[0], state: sheet.current_state });
  synchronizeCommonMeritGrants(sheet);
  const granted = sheet.merits.filter(item => item.grantedBy);
  assert.equal(granted.length, 2);
  assert.equal(granted[0].definitionId, namesake.id);
  assert.equal(granted[0].sourceId, namesake.sourceId);
  assert.equal(granted[0].dots, 1);
  assert.equal(granted[1].definitionId, undefined);
  assert.equal(granted[1].name, "Resources");
  assert.equal(JSON.stringify({ owner: sheet.merits[0], state: sheet.current_state }), before);
  const first = JSON.stringify(sheet);
  synchronizeCommonMeritGrants(sheet);
  assert.equal(JSON.stringify(sheet), first);
  const imported = normalizeStoredSheet(JSON.parse(first));
  assert.equal(validateCurrentCharacter(imported), "valid");
  assert.deepEqual(JSON.parse(JSON.stringify(imported.merits)), sheet.merits);
  assert.deepEqual(imported.current_state.experience_history, sheet.current_state.experience_history);
});

test("Cult summaries localize the exact chosen definition without changing rows or substituting an unknown ID", () => {
  const configuration = { cult: "Authored name", level_1_type: "merit", level_1_merits: [encodeMeritGrantChoice(namesake, 1)], level_3_type: "merits", level_3_merits: [encodeMeritGrantChoice(resources, 2)] };
  const before = JSON.stringify(configuration);
  assert.deepEqual(commonExpandedConfigurationLines("core-2ed:mystery-cult-initiation", 3, configuration, "en-US", catalogs), ["Cult: Authored name", "Dot 1: Resources •", "Dot 3: Resources ••"]);
  assert.deepEqual(commonExpandedConfigurationLines("core-2ed:mystery-cult-initiation", 3, configuration, "pt-BR", catalogs), [`${translate("pt-BR", "ui.cult")}: Authored name`, `${translate("pt-BR", "ui.dot")} 1: Outro recurso •`, `${translate("pt-BR", "ui.dot")} 3: Recursos ••`]);
  const unavailable = { ...configuration, level_1_merits: [encodeMeritGrantChoice({ ...resources, id: "unavailable:id", name: "Stored canonical fallback" }, 1)] };
  assert.ok(commonExpandedConfigurationLines("core-2ed:mystery-cult-initiation", 1, unavailable, "pt-BR", catalogs).includes(`${translate("pt-BR", "ui.dot")} 1: Stored canonical fallback •`));
  assert.equal(JSON.stringify(configuration), before);
  const markup = renderToStaticMarkup(createElement(LanguageProvider, null, createElement(MeritConfigurationEditor, { merit: { definitionId: "core-2ed:mystery-cult-initiation", name: "Mystery Cult Initiation", dots: 3, configuration }, catalog: catalogs, definitions: COMMON_MERIT_CONFIGURATIONS, onChange: () => {} })));
  assert.match(markup, /Resources ••/);
  assert.doesNotMatch(markup, /definitionId|core-2ed:resources/);
});

test("recomposing Cult grants retains authored configuration only for the same definition, instance and producer", () => {
  const definition = catalog.find(item => item.id === "core-2ed:interdisciplinary-specialty");
  const sameName = { ...definition, id: "homebrew:test:specialty", sourceId: "homebrew:test" };
  const owner = { definitionId: "core-2ed:mystery-cult-initiation", name: "Authored cult", instanceId: "cult", dots: 1, configuration: { level_1_type: "merit", level_1_merits: [encodeMeritGrantChoice(definition, 1)] } };
  const sheet = blankPrintCharacter("CofD");
  sheet.merits = [structuredClone(owner)];
  sheet.current_state.experience_available = 7;
  sheet.current_state.experience_history = [{ id: "receipt", kind: "spend", experience: -2, description: "Authored historical label", createdAt: "2026-10-03T00:00:00Z" }];
  synchronizeCommonMeritGrants(sheet);
  const grant = sheet.merits[1];
  grant.name = "Changed stored display";
  grant.configuration = { specialty_skill: "Weaponry", specialty_name: "Authored specialty", notes: ["Player notes"] };
  const identity = { definitionId: grant.definitionId, instanceId: grant.instanceId, grantedBy: grant.grantedBy };
  const stateBefore = structuredClone(sheet.current_state);
  const choicesBefore = structuredClone(grant.configuration);
  for (const locale of ["en-US", "pt-BR", "en-US"]) {
    synchronizeCommonMeritGrants(sheet);
    const next = sheet.merits[1];
    assert.deepEqual({ definitionId: next.definitionId, instanceId: next.instanceId, grantedBy: next.grantedBy }, identity);
    assert.deepEqual(next.configuration, choicesBefore, locale);
    assert.deepEqual(sheet.current_state, stateBefore);
    assert.deepEqual(sheet.merits[0], owner);
    assert.equal(validateCurrentCharacter(normalizeStoredSheet(sheet)), "valid");
  }
  const stable = JSON.stringify(sheet);
  synchronizeCommonMeritGrants(sheet);
  assert.equal(JSON.stringify(sheet), stable);
  for (const change of [{ definitionId: "unavailable:original" }, { definitionId: sameName.id, name: definition.name }, { grantedBy: "Merit:foreign-producer" }, { instanceId: "foreign-instance" }]) {
    const candidate = structuredClone(sheet);
    Object.assign(candidate.merits[1], change);
    synchronizeCommonMeritGrants(candidate);
    assert.deepEqual(candidate.merits[1].configuration, {}, JSON.stringify(change));
    assert.deepEqual(candidate.current_state, stateBefore);
  }
  const duplicate = structuredClone(sheet);
  duplicate.merits.push(structuredClone(duplicate.merits[1]));
  synchronizeCommonMeritGrants(duplicate);
  assert.deepEqual(duplicate.merits[1].configuration, {});
  const paid = structuredClone(sheet);
  Object.assign(paid.merits[1], { creationDots: 1, experienceDots: 1, dots: 2 });
  synchronizeCommonMeritGrants(paid);
  assert.deepEqual(paid.merits[1].configuration, choicesBefore);
  assert.equal(paid.merits[1].instanceId, identity.instanceId);
  assert.equal(paid.merits[1].experienceDots, 1);
  assert.equal(paid.merits[1].dots, 1);
  assert.equal(paid.merits[1].grantedBy, undefined);
  assert.notEqual(paid.merits[2].instanceId, identity.instanceId);
  assert.deepEqual(paid.merits[2].configuration, {});
  assert.deepEqual(paid.current_state, stateBefore);
});

test("malformed grants fail without being interpreted as a canonical name or manufacturing ratings", () => {
  for (const row of [null, [], {}, "Resources", "Resources|", "Resources|0", "Resources|-1", "Resources|1.5", "Resources|Infinity", "Resources|1|2", "{broken", '{"name":"Resources","dots":1}', '{"definitionId":"id","name":"Resources","dots":"1"}', '{"definitionId":"id","name":"Resources","dots":1,"sourceId":[]}', '{"definitionId":"","name":"Resources","dots":1}']) assert.equal(decodeMeritGrantChoice(row), undefined, String(row));
});

const templateCatalog = [...catalog, ...read("game-lines/mage/data/merits.json"), ...read("game-lines/mage/data/merits-supplements.json"), ...read("game-lines/vampire/data/merits.json")];
const selection = (id, grantedBy, dots = 1, extra = {}) => {
  const definition = templateCatalog.find(item => item.id === id);
  return { definitionId: id, name: definition.name, sourceId: definition.sourceId, source: definition.source, dots, grantedBy, ...extra };
};

test("all automatic Nameless Order and bundled Shadow Cult benefits reconcile canonical IDs, sources and unchanged ratings", () => {
  const rows = [mageGrants.NAMELESS_HIGH_SPEECH_BENEFIT];
  const shadowCults = JSON.parse(readFileSync(new URL("../game-lines/vampire/catalog-data/shadow-cults.json", import.meta.url), "utf8"));
  for (const cult of Object.values(shadowCults)) for (const [key, value] of Object.entries(cult.configuration)) if (/^level_\d_merits$/.test(key)) rows.push(...value);
  assert.equal(rows.length, 11);
  for (const row of rows) {
    const choice = decodeMeritGrantChoice(row);
    assert.ok(choice.definitionId);
    const definition = resolveMeritDefinition(choice, templateCatalog);
    assert.ok(definition, choice.definitionId);
    assert.equal(choice.name, definition.name);
    assert.equal(choice.sourceId, definition.sourceId);
    assert.equal(choice.source, definition.source);
    assert.ok(definition.ratings.includes(choice.dots));
  }
});

test("Mage's ID-keyed Cult Influence preserves configured grants without Core learning a Mage identity", () => {
  const merit = selection("mta-2ed:mystery-cult-influence", undefined, 3, { instanceId: "mage-cult", creationDots: 0, experienceDots: 3,
    configuration: { level_1_type: "merit", level_1_merits: [encodeMeritGrantChoice(resources, 1)], level_3_type: "skill", level_3_skill: "Athletics" } });
  const sheet = { merits: [{ ...merit, name: "Renamed" }], specializations: [], line_data: { order: "Orderless" }, current_state: { experience_available: 4, experience_spent: 3 } };
  const state = JSON.stringify(sheet.current_state), owner = JSON.stringify(sheet.merits[0]);
  mageGrants.synchronizeMageBuilderMeritGrants(sheet);
  assert.equal(JSON.stringify(sheet.merits[0]), owner);
  assert.equal(sheet.merits[1].definitionId, resources.id);
  assert.match(sheet.merits[1].grantedBy, /^Merit:mta-2ed:mystery-cult-influence:mage-cult:/);
  assert.deepEqual(sheet.line_data.merit_granted_skill_bonuses, { Athletics: 1 });
  const once = JSON.stringify(sheet);
  mageGrants.synchronizeMageBuilderMeritGrants(sheet);
  assert.equal(JSON.stringify(sheet), once);
  assert.equal(JSON.stringify(sheet.current_state), state);
  for (const override of [{ definitionId: "homebrew:influence" }, { definitionId: "unavailable:id" }, { definitionId: undefined, sourceId: "homebrew:test" }]) {
    sheet.merits = [{ ...merit, ...override }];
    mageGrants.synchronizeMageBuilderMeritGrants(sheet);
    assert.equal(sheet.merits.length, 1);
    assert.deepEqual(sheet.line_data.merit_granted_skill_bonuses, {});
  }
  const legacy = { ...merit }; delete legacy.definitionId;
  sheet.merits = [legacy];
  mageGrants.synchronizeMageBuilderMeritGrants(sheet);
  assert.equal(sheet.merits[1].definitionId, resources.id);
});

test("Mage Faction Member Rote Skills follow canonical identity without reclassifying purchases or accepting namesakes", () => {
  const definition = read("game-lines/mage/data/merits-supplements.json").find(item => item.id === "mta-tome:faction-member");
  assert.equal(definition.name, "Faction Member");
  assert.equal(definition.sourceId, "mta-tome");
  const merit = { definitionId: definition.id, name: "Renamed label", sourceId: definition.sourceId, instanceId: "paid-faction", dots: 3, creationDots: 0, experienceDots: 3, configuration: { roteSkill: "Medicine" } };
  const sheet = { merits: [merit], specializations: [], line_data: { order: "Orderless" }, current_state: { experience_available: 4, experience_spent: 3, experience_history: [{ id: "purchase", undo: { kind: "merit", definitionId: merit.definitionId, instanceId: merit.instanceId } }] } };
  const state = JSON.stringify(sheet.current_state), allocation = JSON.stringify(merit);
  mageGrants.synchronizeMageBuilderMeritGrants(sheet);
  assert.deepEqual(sheet.line_data.rote_skills, ["Medicine"]);
  assert.equal(JSON.stringify(sheet.merits[0]), allocation);
  const once = JSON.stringify(sheet);
  mageGrants.synchronizeMageBuilderMeritGrants(sheet);
  assert.equal(JSON.stringify(sheet), once);
  for (const override of [
    { definitionId: "homebrew:faction", name: definition.name },
    { definitionId: "unavailable:faction", name: definition.name },
    { definitionId: undefined, name: definition.name, sourceId: "homebrew:test" },
    { definitionId: undefined, name: "Membro de Facção" },
    { dots: 2 },
  ]) {
    sheet.merits = [{ ...merit, ...override }];
    mageGrants.synchronizeMageBuilderMeritGrants(sheet);
    assert.deepEqual(sheet.line_data.rote_skills, []);
    assert.deepEqual(sheet.merits, [{ ...merit, ...override }]);
  }
  sheet.merits = [{ ...merit, definitionId: undefined, name: definition.name }];
  mageGrants.synchronizeMageBuilderMeritGrants(sheet);
  assert.deepEqual(sheet.line_data.rote_skills, ["Medicine"]);
  assert.equal(sheet.merits[0].definitionId, undefined);
  assert.equal(JSON.stringify(sheet.current_state), state);
});

test("Mage creation grants identify official choices by ID, preserve Homebrew namesakes and keep existing XP instances", () => {
  const fake = { ...selection("mta-2ed:awakened-status", undefined), definitionId: "homebrew:status", instanceId: "authored", configuration: { domain: "Authored", name: "Authored" } };
  const paid = selection("mta-2ed:awakened-status", "Ordem", 3, { instanceId: "order-status", creationDots: 1, experienceDots: 2, name: "Changed display", configuration: { domain: "Free Council" } });
  const wanted = [selection("mta-2ed:awakened-status", "Ordem", 1, { configuration: { domain: "Free Council" } }), selection("mta-2ed:high-speech", "Ordem")];
  const current = [fake, { ...paid, dots: paid.creationDots }], before = JSON.stringify(current);
  const next = mageGrants.reconcileMageCreationMeritGrants(current, wanted, templateCatalog);
  assert.deepEqual(next.find(item => item.instanceId === "authored"), fake);
  assert.equal(next.find(item => item.definitionId === "mta-2ed:awakened-status").instanceId, paid.instanceId);
  assert.equal(next.find(item => item.instanceId === paid.instanceId).experienceDots, 2);
  assert.equal(next.find(item => item.instanceId === paid.instanceId).dots, 1);
  assert.equal(mergeCreationMerits([fake, paid], next).find(item => item.instanceId === paid.instanceId).dots, 3);
  assert.ok(next.some(item => item.definitionId === "mta-2ed:high-speech" && item.instanceId));
  assert.equal(JSON.stringify(current), before);
  assert.deepEqual(mageGrants.reconcileMageCreationMeritGrants(next, wanted, templateCatalog), next);
  const unavailable = { ...fake, definitionId: "unavailable:id", grantedBy: "Ordem" };
  assert.deepEqual(mageGrants.reconcileMageCreationMeritGrants([unavailable], wanted, templateCatalog).find(item => item.instanceId === "authored"), unavailable);
});

test("Mage template changes retain purchased dots and their instance, while ID-less automatic grants receive canonical IDs", () => {
  const paid = selection("core-2ed:mystery-cult-initiation", "Nameless Order", 4, { instanceId: "paid-cult", creationDots: 1, experienceDots: 3, configuration: { cult: "Authored" } });
  const wanted = [selection("mta-2ed:awakened-status", "Ordem"), selection("mta-2ed:high-speech", "Ordem")];
  const creation = mageGrants.reconcileMageCreationMeritGrants([{ ...paid, dots: paid.creationDots }], wanted, templateCatalog);
  assert.equal(creation.some(item => item.instanceId === paid.instanceId), false);
  const next = mergeCreationMerits([paid], creation);
  const expectedPaid = { ...paid, dots: 3, creationDots: 0 };
  delete expectedPaid.grantedBy;
  assert.deepEqual(next.find(item => item.instanceId === "paid-cult"), expectedPaid);
  const sheet = { merits: [paid], specializations: [], line_data: { order: "Free Council" }, current_state: { experience_available: 5, experience_spent: 3, experience_history: [{ id: "paid" }] } };
  const state = JSON.stringify(sheet.current_state);
  mageGrants.synchronizeMageBuilderMeritGrants(sheet);
  const retained = sheet.merits.find(item => item.instanceId === "paid-cult");
  assert.equal(retained.dots, 3);
  assert.equal(retained.experienceDots, 3);
  assert.equal(retained.grantedBy, undefined);
  assert.equal(JSON.stringify(sheet.current_state), state);
  assert.equal(refundMeritDots(sheet, "Unrelated display label", 3, "paid-cult", undefined, "core-2ed:mystery-cult-initiation"), true);
  assert.equal(sheet.merits.some(item => item.instanceId === "paid-cult"), false);
  const allocated = { ...paid, dots: 5, creationDots: 3, experienceDots: 2 };
  const retainedCreation = mageGrants.reconcileMageCreationMeritGrants([{ ...allocated, dots: allocated.creationDots }], [], templateCatalog);
  assert.equal(retainedCreation[0].dots, 2);
  const retainedAllocation = mergeCreationMerits([allocated], retainedCreation)[0];
  assert.equal(retainedAllocation.dots, 4);
  assert.equal(retainedAllocation.creationDots, 2);
  assert.equal(retainedAllocation.experienceDots, 2);
  assert.equal(retainedAllocation.instanceId, allocated.instanceId);
  const legacy = selection("mta-2ed:awakened-status", "Ordem", 2, { instanceId: "legacy", creationDots: 1, experienceDots: 1 });
  delete legacy.definitionId;
  sheet.merits = [legacy];
  mageGrants.synchronizeMageBuilderMeritGrants(sheet);
  assert.equal(sheet.merits.find(item => item.instanceId === "legacy").definitionId, "mta-2ed:awakened-status");
  const markedNamesake = { ...legacy, definitionId: "homebrew:status" };
  sheet.merits = [markedNamesake];
  mageGrants.synchronizeMageBuilderMeritGrants(sheet);
  assert.deepEqual(sheet.merits.find(item => item.instanceId === "legacy"), markedNamesake);
});

test("Vampire creation and synchronization use the same ID-based template reconciliation without subtracting XP twice", () => {
  const paid = selection("vtr-kindred-status", "Vampire Template", 5, { instanceId: "paid-status", creationDots: 3, experienceDots: 2, name: "Changed display", configuration: { group: "Daeva" } });
  const fake = { ...selection("vtr-kindred-status", undefined), instanceId: "authored", definitionId: "homebrew:kindred-status", configuration: { group: "Authored" } };
  const wanted = selection("vtr-kindred-status", "Vampire Template", 1, { instanceId: "vampire-template-kindred-status", configuration: { group: "Daeva" } });
  const current = [fake, paid], before = JSON.stringify(current);
  const next = vampireGrants.reconcileVampireTemplateMerits(current, wanted);
  assert.deepEqual(next.find(item => item.instanceId === "authored"), fake);
  assert.equal(next.find(item => item.instanceId === "paid-status").dots, 5);
  assert.equal(next.find(item => item.instanceId === "paid-status").creationDots, 3);
  assert.equal(next.find(item => item.instanceId === "paid-status").experienceDots, 2);
  assert.equal(JSON.stringify(current), before);
  assert.deepEqual(vampireGrants.reconcileVampireTemplateMerits(next, wanted), next);
  const creation = vampireGrants.reconcileVampireCreationMeritGrants([{ ...paid, dots: paid.creationDots }], wanted);
  assert.equal(creation[0].dots, 3);
  assert.equal(mergeCreationMerits([paid], creation)[0].dots, 5);
  const reduced = vampireGrants.reconcileVampireCreationMeritGrants([{ ...paid, dots: paid.creationDots }]);
  assert.equal(reduced[0].dots, 2);
  assert.equal(mergeCreationMerits([paid], reduced)[0].dots, 4);
  const sheet = { merits: current, specializations: [], line_data: { covenant_id: "invictus", kindred_status_group: "Daeva" }, current_state: { experience_available: 5, experience_spent: 2 } };
  const state = JSON.stringify(sheet.current_state);
  vampireGrants.synchronizeVampireBuilderMeritGrants(sheet);
  assert.equal(sheet.merits.find(item => item.instanceId === "paid-status").dots, 5);
  assert.equal(JSON.stringify(sheet.current_state), state);
});

test("Vampire leaving a template retains purchased dots, unknown identities and ID-bearing Shadow Cult benefits", () => {
  const paid = selection("vtr-kindred-status", "Vampire Template", 3, { instanceId: "paid-status", creationDots: 1, experienceDots: 2, configuration: { group: "Daeva" } });
  const unknown = { ...paid, definitionId: "unavailable:id", instanceId: "unknown" };
  const removed = vampireGrants.reconcileVampireTemplateMerits([unknown, paid]);
  assert.deepEqual(removed[0], unknown);
  assert.equal(removed[1].dots, 2);
  assert.equal(removed[1].creationDots, 0);
  assert.equal(removed[1].experienceDots, 2);
  assert.equal(removed[1].grantedBy, undefined);
  const creation = vampireGrants.reconcileVampireCreationMeritGrants([{ ...paid, dots: paid.creationDots }]);
  assert.deepEqual(creation, []);
  assert.deepEqual(mergeCreationMerits([paid], creation), [removed[1]]);
  assert.deepEqual(mergeCreationMerits([{ ...paid, dots: 1, experienceDots: 0 }], []), []);
  const allocated = vampireGrants.reconcileVampireTemplateMerits([{ ...paid, dots: 5, creationDots: 3 }])[0];
  assert.equal(allocated.dots, 4);
  assert.equal(allocated.creationDots, 2);
  assert.equal(allocated.experienceDots, 2);
  const sheet = { merits: [paid], specializations: [], line_data: { covenant_id: "followers-of-seth", kindred_status_group: "Followers of Seth" }, current_state: { experience_available: 5, experience_spent: 2 } };
  vampireGrants.synchronizeVampireBuilderMeritGrants(sheet);
  const owner = sheet.merits.find(item => item.grantedBy === "Vampire Shadow Cult");
  assert.equal(owner.definitionId, "core-2ed:mystery-cult-initiation");
  owner.dots = 2;
  owner.creationDots = 2;
  vampireGrants.synchronizeVampireBuilderMeritGrants(sheet);
  assert.equal(sheet.merits.find(item => item.name === "Demolisher").definitionId, "core-2ed:demolisher");
  assert.equal(sheet.merits.find(item => item.instanceId === "paid-status").experienceDots, 2);
  assert.equal(refundMeritDots(sheet, "Unrelated display label", 2, "paid-status", undefined, "vtr-kindred-status"), true);
  assert.ok(sheet.merits.some(item => item.definitionId === "core-2ed:mystery-cult-initiation" && item.grantedBy));
});
