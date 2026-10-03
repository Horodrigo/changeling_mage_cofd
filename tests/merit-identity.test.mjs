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
const { resolveMeritDefinition, meritMatchesDefinition, meritInstanceIsUnique } = await vite.ssrLoadModule("/lib/merit-identity.ts");
const { normalizeStoredSheet, validateCurrentCharacter } = await vite.ssrLoadModule("/lib/character-persistence.ts");
const { creationMerits, mergeCreationMerits } = await vite.ssrLoadModule("/lib/merit-progression.ts");
const { refundMeritDots } = await vite.ssrLoadModule("/lib/experience-refunds.ts");
const { refundMortalAdvancement } = await vite.ssrLoadModule("/game-lines/mortal/experience-rules.ts");
const { refundMageAdvancement } = await vite.ssrLoadModule("/game-lines/mage/experience-refunds.ts");
const { refundVampireAdvancement } = await vite.ssrLoadModule("/game-lines/vampire/experience-refunds.ts");
const { mortalExperienceLabel } = await vite.ssrLoadModule("/game-lines/mortal/experience-presentation.ts");
const { blankPrintCharacter } = await vite.ssrLoadModule("/app/workspace/blank-print-character.ts");
const { activeMeritCatalog } = await vite.ssrLoadModule("/lib/merit-homebrews.ts");
const { LanguageProvider } = await vite.ssrLoadModule("/lib/i18n.tsx");
const { MeritPicker } = await vite.ssrLoadModule("/app/builder/merit-picker.tsx");
const { MortalExperiencePanel } = await vite.ssrLoadModule("/game-lines/mortal/experience-panel.tsx");
const { vampireExperienceLabel } = await vite.ssrLoadModule("/game-lines/vampire/experience-presentation.ts");
const { mageExperienceLabel } = await vite.ssrLoadModule("/game-lines/mage/experience-presentation.ts");
const { VampireExperiencePanel } = await vite.ssrLoadModule("/game-lines/vampire/experience-panel.tsx");
const { MageExperiencePanel } = await vite.ssrLoadModule("/game-lines/mage/experience-panel.tsx");

const core = JSON.parse(await readFile(new URL("../public/shared/data/merits.json", import.meta.url), "utf8"));
const corePt = JSON.parse(await readFile(new URL("../public/shared/data/merits-pt.json", import.meta.url), "utf8"));
const { withMeritPresentation } = await vite.ssrLoadModule("/lib/merit-presentation.ts");
const catalog = withMeritPresentation(core, corePt);
const resources = catalog.find(item => item.name === "Resources");
const namesake = { ...resources, id: "other:resources", sourceId: "other-source", name: "Resources", line: "VtR" };

test("Merit definition IDs are authoritative across names, sources and locales", () => {
  const owned = { definitionId: resources.id, name: "stale display label", sourceId: "stale source" };
  assert.equal(resolveMeritDefinition(owned, [namesake, resources]), resources);
  assert.equal(meritMatchesDefinition(owned, resources, [namesake, resources]), true);
  assert.equal(meritMatchesDefinition(owned, namesake, [namesake, resources]), false);
  assert.equal(resolveMeritDefinition({ ...owned, definitionId: "unavailable:id", name: "Resources" }, [resources]), undefined);
});

test("ID-less schema-2 selections resolve only an unambiguous canonical name and source", () => {
  assert.equal(resolveMeritDefinition({ name: "Resources" }, [resources]), resources);
  assert.equal(resolveMeritDefinition({ name: "Resources" }, [resources, namesake]), undefined);
  assert.equal(resolveMeritDefinition({ name: "Resources", sourceId: namesake.sourceId }, [resources, namesake]), namesake);
  assert.equal(resolveMeritDefinition({ name: resources.translatedName }, [resources]), undefined);
  assert.equal(resolveMeritDefinition({ name: "Resources", sourceId: "missing-source" }, [resources]), undefined);
  const reprinted = { ...resources, additionalSources: [{ sourceId: "reprint", source: "Reprint", page: 1 }] };
  assert.equal(resolveMeritDefinition({ name: "Resources", sourceId: "reprint" }, [reprinted]), reprinted);
});

test("active errata retains the purchased canonical definition ID", () => {
  const errata = { ...resources, id: "errata:resources", errataFor: resources.id, description: "Replacement effect" };
  const active = activeMeritCatalog([resources, errata], [], { disabledIds: [] });
  assert.equal(active.length, 1);
  assert.equal(resolveMeritDefinition({ definitionId: resources.id, name: "Resources" }, active).description, "Replacement effect");
});

test("disabled Merit catalogs preserve the owned ID, never every namesake or an unavailable ID fallback", () => {
  const disabledBase = { ...resources, sourceId: "homebrew:base-merits" };
  const disabledNamesake = { ...namesake, sourceId: "homebrew:other-merits" };
  const definitions = [disabledBase, disabledNamesake];
  const preferences = { disabledIds: definitions.map(item => item.id) };
  const owned = { definitionId: resources.id, instanceId: "xp", name: "Stale translated name", sourceId: "stale", dots: 2, creationDots: 0, experienceDots: 2 };
  const before = structuredClone(owned);
  assert.deepEqual(activeMeritCatalog(definitions, [], preferences, [owned]).map(item => item.id), [resources.id]);
  assert.deepEqual(owned, before);
  assert.deepEqual(activeMeritCatalog(definitions, [], preferences, [{ ...owned, definitionId: "unavailable", name: "Resources" }]), []);
  assert.deepEqual(activeMeritCatalog(definitions, [], preferences, [{ name: "Resources" }]), []);
  assert.deepEqual(activeMeritCatalog(definitions, [], preferences, [{ name: "Resources", sourceId: disabledNamesake.sourceId }]).map(item => item.id), [namesake.id]);
  assert.deepEqual(activeMeritCatalog([disabledBase], [], preferences, [{ name: "Resources" }]).map(item => item.id), [resources.id]);
  assert.deepEqual(activeMeritCatalog([disabledBase], [], preferences, [{ name: resources.translatedName }]), []);
});

test("owned definition retention and active errata preserve canonical IDs and presentation without mutating catalogs", () => {
  const errata = { ...resources, id: "homebrew:errata:resources", errataFor: resources.id, name: "Resources", description: "Replacement mechanics" };
  const definitions = [{ ...resources, sourceId: "homebrew:base-merits" }, { ...namesake, sourceId: "homebrew:other-merits" }, errata];
  const before = structuredClone(definitions);
  const preferences = { disabledIds: [resources.id, namesake.id] };
  const owned = [{ definitionId: resources.id, name: "Stale name" }];
  const active = activeMeritCatalog(definitions, [], preferences, owned);
  assert.equal(active.length, 1);
  assert.equal(active[0].id, resources.id);
  assert.equal(active[0].description, errata.description);
  assert.equal(active[0].name, resources.name);
  assert.deepEqual(definitions, before);
});

test("definition and instance IDs survive schema-2 import/export and creation reediting", () => {
  const sheet = blankPrintCharacter("CofD");
  sheet.merits = [{ definitionId: resources.id, instanceId: "owned", name: resources.name, sourceId: resources.sourceId, dots: 4, creationDots: 2, experienceDots: 2, configuration: { custom: "Authored text" } }];
  sheet.current_state = { experience_available: 1, experience_spent: 2, mortal_experience_history: [{ id: "purchase", undo: { kind: "merit", definitionId: resources.id, instanceId: "owned", name: resources.name, dots: 2 } }] };
  const decoded = JSON.parse(JSON.stringify(normalizeStoredSheet(sheet)));
  assert.equal(validateCurrentCharacter(decoded), "valid");
  assert.equal(decoded.merits[0].definitionId, resources.id);
  assert.equal(decoded.merits[0].instanceId, "owned");
  assert.deepEqual(decoded.current_state, sheet.current_state);
  const choices = creationMerits(decoded.merits);
  choices[0].dots = 1;
  const edited = mergeCreationMerits(decoded.merits, choices)[0];
  assert.deepEqual([edited.definitionId, edited.instanceId, edited.creationDots, edited.experienceDots, edited.dots], [resources.id, "owned", 1, 2, 3]);
  assert.equal(edited.configuration.custom, "Authored text");
});

test("shared creation picker resolves persisted selections by ID, not a stale name", () => {
  const selection = { definitionId: resources.id, instanceId: "owned", name: "Old Name", dots: 1 };
  const markup = renderToStaticMarkup(createElement(LanguageProvider, null, createElement(MeritPicker, {
    merits: [selection], setMerits: () => {}, catalog: [namesake, resources], context: { gameLine: "CofD", merits: [selection] },
    spent: 1, budget: 7, renderConfiguration: () => null, isInlineConfiguration: () => false,
  })));
  assert.match(markup, /Resources/);
  assert.doesNotMatch(markup, />Old Name</);
  assert.equal(selection.name, "Old Name", "presentation must not rewrite the selection");
});

test("ID-keyed Merit refunds target the exact instance after reordering or renaming", () => {
  const sheet = blankPrintCharacter("CofD");
  sheet.merits = [
    { definitionId: namesake.id, instanceId: "other", name: "Resources", dots: 3, creationDots: 1, experienceDots: 2 },
    { definitionId: resources.id, instanceId: "owned", name: "Renamed", dots: 4, creationDots: 2, experienceDots: 2 },
  ];
  assert.equal(refundMortalAdvancement(sheet, { kind: "merit", definitionId: resources.id, instanceId: "owned", name: "Resources", dots: 2, index: 0 }), true);
  assert.deepEqual(sheet.merits.map(item => item.dots), [3, 2]);
  assert.deepEqual([sheet.merits[1].creationDots, sheet.merits[1].experienceDots], [2, 0]);
});

test("missing, ambiguous, mismatched and over-refunded Merit purchases leave the sheet unchanged", () => {
  const sheet = blankPrintCharacter("CofD");
  sheet.merits = [
    { definitionId: namesake.id, instanceId: "other", name: "Resources", dots: 3, creationDots: 1, experienceDots: 2 },
    { definitionId: resources.id, instanceId: "owned", name: "Resources", dots: 4, creationDots: 2, experienceDots: 2 },
  ];
  const before = structuredClone(sheet);
  for (const [instanceId, definitionId, amount] of [["missing", resources.id, 1], ["other", resources.id, 1], ["owned", resources.id, 3], [undefined, resources.id, 1], ["owned", resources.id, 0]]) {
    assert.equal(refundMeritDots(sheet, "Resources", amount, instanceId, undefined, definitionId), false);
    assert.deepEqual(sheet, before);
  }
  assert.equal(refundMeritDots(sheet, "Resources", 1), false, "ID-less ambiguous history must not choose the first namesake");
  assert.deepEqual(sheet, before);
  for (const refund of [refundMortalAdvancement, refundMageAdvancement, refundVampireAdvancement]) {
    assert.equal(refund(sheet, { kind: "merit", name: "Resources", dots: 1, instanceId: "missing" }), false);
    assert.deepEqual(sheet, before);
    assert.equal(refund(sheet, { kind: "unknown", amount: 1 }), false);
    assert.deepEqual(sheet, before);
    assert.equal(refund(sheet, { kind: "merit", name: "Resources", dots: 3, instanceId: "owned" }), false);
    assert.deepEqual(sheet, before);
  }
});

test("duplicate Merit instance IDs refuse exact purchases/refunds; an old index never disambiguates namesakes", async () => {
  const sheet = blankPrintCharacter("CofD");
  sheet.merits = [
    { definitionId: resources.id, instanceId: "duplicate", name: "Resources", dots: 3, creationDots: 1, experienceDots: 2 },
    { definitionId: namesake.id, instanceId: "duplicate", name: "Resources", dots: 4, creationDots: 2, experienceDots: 2 },
  ];
  const before = structuredClone(sheet);
  assert.equal(meritInstanceIsUnique(sheet.merits[0], sheet.merits), false);
  assert.equal(meritInstanceIsUnique({ instanceId: "missing" }, sheet.merits), false);
  assert.equal(meritInstanceIsUnique({}, sheet.merits), true, "ID-less selected rows receive a fresh ID on purchase");
  for (const refund of [refundMortalAdvancement, refundMageAdvancement, refundVampireAdvancement]) {
    assert.equal(refund(sheet, { kind: "merit", definitionId: resources.id, instanceId: "duplicate", name: "Resources", dots: 1, index: 0 }), false);
    assert.equal(refund(sheet, { kind: "merit", name: "Resources", dots: 1, index: 0 }), false);
    assert.deepEqual(sheet, before);
  }
  sheet.merits[1].instanceId = "unique";
  assert.equal(meritInstanceIsUnique(sheet.merits[0], sheet.merits), true);
  assert.equal(refundMortalAdvancement(sheet, { kind: "merit", definitionId: resources.id, instanceId: "duplicate", name: "Renamed", dots: 1 }), true);
  assert.deepEqual(sheet.merits.map(item => item.experienceDots), [1, 2]);
  for (const line of ["mortal", "mage", "vampire"]) {
    const source = await readFile(new URL(`../game-lines/${line}/experience-panel.tsx`, import.meta.url), "utf8");
    assert.match(source, /meritInstanceIsUnique\(character\.merits\[(?:meritInstance|mageMeritInstance)\], character\.merits\)/, line);
  }
});

test("Mortal semantic experience history localizes every purchase without mutating persisted records", () => {
  const sheet = blankPrintCharacter("CofD");
  const purchases = [
    [{ kind: "trait", group: "attributes", name: "Strength", rating: 3 }, "Strength 3", "Força 3"],
    [{ kind: "specialty", skill: "Athletics", name: "Running / texto autoral" }, "Athletics: Running / texto autoral", "Atletismo: Running / texto autoral"],
    [{ kind: "merit", definitionId: resources.id, instanceId: "owned", name: "Old Name", rating: 2 }, "Resources 2", "Recursos 2"],
    [{ kind: "integrity", rating: 8 }, "Integrity 8", "Integridade 8"],
  ];
  for (const [purchase, en, pt] of purchases) {
    const entry = { id: "entry", cost: 2, createdAt: "2026-10-02", purchase, undo: { kind: "integrity", amount: 1 } };
    const before = structuredClone(entry);
    assert.equal(mortalExperienceLabel(entry, sheet, catalog, "en-US"), en);
    assert.equal(mortalExperienceLabel(entry, sheet, catalog, "pt-BR"), pt);
    assert.deepEqual(entry, before);
    assert.equal(entry.label, undefined);
  }
});

test("existing Mortal experience history renders semantic deltas without parsing localized labels", () => {
  const sheet = blankPrintCharacter("CofD");
  sheet.merits = [{ definitionId: resources.id, instanceId: "owned", name: "Changed name", dots: 2 }];
  for (const [undo, en, pt] of [
    [{ kind: "trait", group: "skills", name: "Athletics", amount: 2 }, "Athletics +2", "Atletismo +2"],
    [{ kind: "integrity", amount: 1 }, "Integrity +1", "Integridade +1"],
    [{ kind: "merit", name: "Old name", instanceId: "owned", dots: 2 }, "Resources +2", "Recursos +2"],
  ]) {
    const entry = { id: "entry", label: "Arbitrary old localized display text", cost: 2, undo };
    const before = structuredClone(entry);
    assert.equal(mortalExperienceLabel(entry, sheet, catalog, "en-US"), en);
    assert.equal(mortalExperienceLabel(entry, sheet, catalog, "pt-BR"), pt);
    assert.deepEqual(entry, before);
  }
  sheet.merits = [{ name: "Allies", dots: 1 }];
  const entry = { undo: { kind: "merit", name: "Resources", dots: 2 }, label: "Localized old label" };
  assert.equal(mortalExperienceLabel(entry, sheet, catalog, "pt-BR"), "Recursos +2", "missing instance IDs must not match another ID-less selection");
  const opaque = { id: "opaque", label: "Authored or unrecognized history" };
  const before = structuredClone(opaque);
  assert.equal(mortalExperienceLabel(opaque, sheet, catalog, "pt-BR"), opaque.label);
  assert.equal(mortalExperienceLabel({ ...opaque, undo: { kind: "unknown" } }, sheet, catalog, "en-US"), opaque.label);
  assert.deepEqual(opaque, before);
});

test("Mortal XP surface renders semantic history in EN without exposing old PT labels or changing the character", () => {
  const sheet = blankPrintCharacter("CofD");
  sheet.current_state = { experience_available: 2, experience_spent: 2, experience_total: 4, mortal_experience_history: [{
    id: "purchase", cost: 2, createdAt: "2026-10-02T00:00:00Z", label: "Rótulo antigo em português",
    purchase: { kind: "merit", definitionId: resources.id, instanceId: "owned", name: "Resources", rating: 2 },
    undo: { kind: "merit", definitionId: resources.id, instanceId: "owned", name: "Resources", dots: 2 },
  }] };
  const before = structuredClone(sheet);
  const catalogs = { get(group) { assert.equal(group, "core-merits"); return catalog; } };
  const markup = renderToStaticMarkup(createElement(LanguageProvider, null, createElement(MortalExperiencePanel, { character: sheet, catalogs, updateSheet() { assert.fail("render must not update the sheet"); } })));
  assert.match(markup, /Resources 2/);
  assert.doesNotMatch(markup, /Rótulo antigo|missing translation|undefined/);
  assert.deepEqual(sheet, before);
});

const power = id => ({ id, name: `English ${id}`, translatedName: `Português ${id}`, levels: [] });
const powers = {
  disciplines: [power("Vigor")], ritualDisciplines: [power("kimiya"), power("therion"), power("gilded-cage")],
  devotions: [power("devotion")], lashes: [power("lash")], cruacRites: [power("rite")], thebanMiracles: [power("miracle")],
  kimiyaFormulae: [power("formula")], therionSacrileges: [power("sacrilege")], gildedInvocations: [power("invocation")],
  coils: [power("coil")], scales: [power("scale")], detournements: [power("detournement")],
};
const spell = { id: "spell", name: "Feitiço", originalName: "Spell", requirements: {}, roteSkills: [] };

test("Vampire history resolves every purchase through canonical undo and current-locale presentation", () => {
  const sheet = blankPrintCharacter("VtR");
  const examples = [
    [{ kind: "trait", group: "attributes", name: "Strength", amount: 2 }, "Strength 4", "Força 4", 4],
    [{ kind: "specialty", skill: "Athletics", name: "Authored" }, "Athletics: Authored", "Atletismo: Authored"],
    [{ kind: "merit", definitionId: resources.id, instanceId: "owned", name: "Old Name", dots: 2 }, "Resources 3", "Recursos 3", 3],
    [{ kind: "discipline", name: "English Vigor", amount: 2 }, "English Vigor +2", "Português Vigor +2"],
    [{ kind: "bloodPotency" }, "Blood Potency +1", "Potência de Sangue +1"],
    [{ kind: "humanity" }, "Humanity +1", "Humanidade +1"],
    [{ kind: "humanityLoss", amount: 1 }, "Humanity −1", "Humanidade −1"],
    [{ kind: "willpower" }, "Willpower +1", "Força de Vontade +1"],
    [{ kind: "cruac" }, "Crúac +1", "Crúac +1"],
    [{ kind: "theban" }, "Theban Sorcery +1", "Feitiçaria Tebana +1"],
    ...[["kimiya_rating", "kimiya"], ["therion_rating", "therion"], ["gilded_cage_rating", "gilded-cage"]].map(([ratingKey, id]) => [{ kind: "bloodSorcery", ratingKey }, `English ${id} +1`, `Português ${id} +1`]),
    ...["devotion", "lash", "scale", "detournement"].map(kind => [{ kind, id: kind }, `English ${kind}`, `Português ${kind}`]),
    [{ kind: "coil", id: "coil", amount: 2 }, "English coil +2", "Português coil +2"],
    ...[["cruac_rite_ids", "rite"], ["theban_miracle_ids", "miracle"], ["kimiya_formula_ids", "formula"], ["therion_sacrilege_ids", "sacrilege"], ["gilded_invocation_ids", "invocation"]].map(([key, id]) => [{ kind: "ritual", key, id }, `English ${id}`, `Português ${id}`]),
  ];
  for (const [undo, en, pt, rating] of examples) {
    const entry = { undo, rating, label: "Stale translated label" };
    const before = structuredClone(entry);
    assert.equal(vampireExperienceLabel(entry, sheet, catalog, powers, "en-US"), en);
    assert.equal(vampireExperienceLabel(entry, sheet, catalog, powers, "pt-BR"), pt);
    assert.deepEqual(entry, before);
  }
});

test("Mage history localizes traits, Merits and spell identities while preserving authored text", () => {
  const sheet = blankPrintCharacter("MtA");
  const examples = [
    [{ kind: "trait", group: "skills", name: "Athletics", amount: 2 }, "Athletics +2", "Atletismo +2"],
    [{ kind: "merit", definitionId: resources.id, instanceId: "owned", name: "Old Name", dots: 2 }, "Resources 3", "Recursos 3", 3],
    [{ kind: "arcana", name: "Fate", amount: 2 }, "Fate +2", "Destino +2"],
    [{ kind: "gnosis" }, "Gnosis +1", "Gnose +1"],
    [{ kind: "wisdom" }, "Wisdom +1", "Sabedoria +1"],
    [{ kind: "wisdomLoss" }, "Wisdom −1", "Sabedoria −1"],
    [{ kind: "willpower" }, "Willpower +1", "Força de Vontade +1"],
    [{ kind: "spell", key: "learned_rotes", id: "spell" }, "Rote: Spell", "Rota: Feitiço"],
    [{ kind: "spell", key: "learned_praxes", id: "spell" }, "Praxis: Spell", "Práxis: Feitiço"],
    [{ kind: "specialty", skill: "Athletics", name: "Authored" }, "Athletics: Authored", "Atletismo: Authored"],
  ];
  for (const [undo, en, pt, rating] of examples) {
    const entry = { undo, rating, description: "Stale translated label" };
    const before = structuredClone(entry);
    assert.equal(mageExperienceLabel(entry, sheet, catalog, [spell], "en-US"), en);
    assert.equal(mageExperienceLabel(entry, sheet, catalog, [spell], "pt-BR"), pt);
    assert.deepEqual(entry, before);
  }
  const act = { undo: { kind: "wisdomLoss" }, act: "Texto autoral" };
  assert.equal(mageExperienceLabel(act, sheet, catalog, [], "pt-BR"), "Ato de Húbris: Texto autoral");
});

test("opaque or unavailable historical identities never get reparsed or replaced by namesakes", () => {
  const sheet = blankPrintCharacter("VtR");
  for (const render of [entry => vampireExperienceLabel(entry, sheet, catalog, powers, "pt-BR"), entry => mageExperienceLabel(entry, sheet, catalog, [], "pt-BR")]) {
    assert.equal(render({ label: "Resources", description: "Resources" }), "Resources");
    assert.equal(render({ label: "Unknown", description: "Unknown", undo: { kind: "unknown" } }), "Unknown");
    assert.equal(render({ undo: { kind: "merit", definitionId: "unavailable", instanceId: "owned", name: "Resources", dots: 2 } }), "Resources +2");
  }
});

test("Vampire and Mage XP surfaces render semantic history without mutation or cross-line catalogs", () => {
  for (const [line, Component, historyKey] of [["VtR", VampireExperiencePanel, "vampire_experience_history"], ["MtA", MageExperiencePanel, "mage_experience_history"]]) {
    const sheet = blankPrintCharacter(line);
    sheet.current_state[historyKey] = [{ id: "purchase", cost: 2, regular: 2, arcane: 0, rating: 3, createdAt: "2026-10-02T00:00:00Z", label: "Rótulo antigo", description: "Rótulo antigo", undo: { kind: "merit", definitionId: resources.id, instanceId: "owned", name: "Old Name", dots: 2 } }];
    const before = structuredClone(sheet);
    const groups = [];
    const catalogs = { get(group) {
      groups.push(group);
      if (group === "core-merits") return catalog;
      if (group === "vampire-reference") return { clans: [], covenants: [], bloodlines: [] };
      if (group === "vampire-powers") return powers;
      return [];
    } };
    const markup = renderToStaticMarkup(createElement(LanguageProvider, null, createElement(Component, { character: sheet, catalogs, builderMode: true, updateSheet() { assert.fail("render must not update the sheet"); } })));
    assert.match(markup, /Resources 3/);
    assert.doesNotMatch(markup, /Rótulo antigo|missing translation|undefined/);
    assert.ok(groups.every(group => group === "core-merits" || group.startsWith(line === "VtR" ? "vampire-" : "mage-")));
    assert.deepEqual(sheet, before);
  }
});
