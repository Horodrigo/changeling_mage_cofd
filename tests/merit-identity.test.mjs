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
const { resolveMeritDefinition, meritMatchesDefinition } = await vite.ssrLoadModule("/lib/merit-identity.ts");
const { normalizeStoredSheet, validateCurrentCharacter } = await vite.ssrLoadModule("/lib/character-persistence.ts");
const { creationMerits, mergeCreationMerits } = await vite.ssrLoadModule("/lib/merit-progression.ts");
const { refundMeritDots } = await vite.ssrLoadModule("/lib/experience-refunds.ts");
const { refundMortalAdvancement } = await vite.ssrLoadModule("/game-lines/mortal/experience-rules.ts");
const { refundMageAdvancement } = await vite.ssrLoadModule("/lib/experience-refunds.ts");
const { refundVampireAdvancement } = await vite.ssrLoadModule("/game-lines/vampire/experience-refunds.ts");
const { mortalExperienceLabel } = await vite.ssrLoadModule("/game-lines/mortal/experience-presentation.ts");
const { blankPrintCharacter } = await vite.ssrLoadModule("/app/workspace/blank-print-character.ts");
const { activeMeritCatalog } = await vite.ssrLoadModule("/lib/merit-homebrews.ts");
const { LanguageProvider } = await vite.ssrLoadModule("/lib/i18n.tsx");
const { MeritPicker } = await vite.ssrLoadModule("/app/builder/merit-picker.tsx");
const { MortalExperiencePanel } = await vite.ssrLoadModule("/game-lines/mortal/experience-panel.tsx");

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
