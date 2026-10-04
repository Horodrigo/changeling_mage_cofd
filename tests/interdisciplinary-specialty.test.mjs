import assert from "node:assert/strict";
import test, { after } from "node:test";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { createServer } from "vite";

const root = fileURLToPath(new URL("..", import.meta.url));
const vite = await createServer({ appType: "custom", configFile: false, root, resolve: { alias: { "@": root } }, server: { middlewareMode: true, hmr: false, ws: false }, optimizeDeps: { noDiscovery: true, include: [] } });
after(() => vite.close());
const load = path => vite.ssrLoadModule(path);
const read = path => JSON.parse(readFileSync(new URL(`../${path}`, import.meta.url), "utf8"));
const core = read("public/shared/data/merits.json"), pt = read("public/shared/data/merits-pt.json");
const { INTERDISCIPLINARY_SPECIALTY_ID: id, interdisciplinarySpecialties, reconcileSpecialtyMerits, specialtyMeritWasRemoved } = await load("/lib/core/character/specialty-merits.ts");
const { meritPrerequisitesMet, meritSelectionProblems, meritContextForSheet } = await load("/lib/merits.ts");
const { withMeritPresentation, meritPresentation } = await load("/lib/merit-presentation.ts");
const { commonExpandedConfigurationLines } = await load("/app/workspace/merit-configuration-presentation.ts");
const { MeritConfigurationEditor } = await load("/app/builder/merit-configuration-editor.tsx");
const { COMMON_MERIT_CONFIGURATIONS } = await load("/app/builder/common-merit-configurations.ts");
const { LanguageProvider, translate } = await load("/lib/i18n.tsx");
const { blankPrintCharacter } = await load("/app/workspace/blank-print-character.ts");
const { normalizeGameLineCharacter } = await load("/game-lines/registry/game-line-registry.ts");
const { prepareCharacterForSave, prepareCharacterForUpdate } = await load("/app/workspace/character-lifecycle.ts");
const { mergeCreationMerits } = await load("/lib/merit-progression.ts");
const { refundMeritDots } = await load("/lib/experience-refunds.ts");
const { encodeMeritGrantChoice } = await load("/lib/core/character/merit-configuration.ts");
const { loadCatalogGroups } = await load("/game-lines/registry/catalog-group-registry.ts");
const originalFetch = globalThis.fetch;
try {
  globalThis.fetch = async url => new Response(JSON.stringify(read(`public${url}`)));
  await loadCatalogGroups(["core-merits", "werewolf-merits", "werewolf-reference", "werewolf-gifts", "werewolf-totem"]);
} finally { globalThis.fetch = originalFetch; }
const definition = withMeritPresentation(core, pt).find(item => item.id === id);
const specialty = { skill: "Medicine", name: "Authored anatomy" };
const configuration = { specialty_skill: specialty.skill, specialty_name: specialty.name, specialty_grantedBy: "", notes: "Player notes" };
const selection = () => ({ definitionId: id, instanceId: "paid-interdisciplinary", sourceId: "core-2ed", name: "Renamed Merit label", dots: 1, creationDots: 0, experienceDots: 1, configuration: structuredClone(configuration) });

test("Core 2e Interdisciplinary Specialty requires the chosen existing Specialty's Skill at 3, without inheriting Homebrew namesakes", () => {
  const sheet = blankPrintCharacter("CofD");
  sheet.skills = { Medicine: 2, Weaponry: 4 };
  sheet.specializations = [specialty];
  const context = meritContextForSheet(sheet, core);
  assert.equal(meritPrerequisitesMet(definition, context), false, "an unrelated Skill at 4 is insufficient");
  context.skills.Medicine = 3;
  assert.equal(meritPrerequisitesMet(definition, context), true, "catalog browsing permits selecting a Specialty next");
  assert.ok(meritSelectionProblems(definition, { dots: 1 }, context).some(item => item.key === "ui.meritSelectExistingSpecialty"));
  assert.deepEqual(meritSelectionProblems(definition, { dots: 1, configuration }, context), []);
  for (const changed of [{ specialty_name: "Invented specialty" }, { specialty_skill: "Weaponry" }, { specialty_grantedBy: "foreign-grant" }]) {
    assert.ok(meritSelectionProblems(definition, { dots: 1, configuration: { ...configuration, ...changed } }, context).length);
  }
  assert.deepEqual(interdisciplinarySpecialties([specialty, specialty], context.skills), []);
  assert.equal(interdisciplinarySpecialties([specialty, { ...specialty, grantedBy: "Merit:producer" }], context.skills).length, 2);
  const namesake = { ...definition, id: "homebrew:namesake", sourceId: "homebrew:test", prerequisites: undefined };
  assert.equal(meritPrerequisitesMet(namesake, { gameLine: "CofD", specializations: [], skills: {} }), true);
  assert.deepEqual(meritSelectionProblems(namesake, { dots: 1 }, { gameLine: "CofD" }), []);
});

test("the selector offers existing eligible authored Specialties and presents EN/PT without rewriting their identities", () => {
  const merit = selection(), before = JSON.stringify(merit);
  const context = { skills: { Medicine: 3, Weaponry: 3, Crafts: 2 }, specializations: [specialty, { skill: "Weaponry", name: "Authored blade" }, { skill: "Crafts", name: "Hidden unqualified" }] };
  const markup = renderToStaticMarkup(createElement(LanguageProvider, null, createElement(MeritConfigurationEditor, {
    merit, catalog: [definition], definitions: COMMON_MERIT_CONFIGURATIONS, specialtyContext: context, onChange: () => {},
  })));
  assert.match(markup, /<select/);
  assert.match(markup, /Medicine \(Authored anatomy\)/);
  assert.match(markup, /Weaponry \(Authored blade\)/);
  assert.doesNotMatch(markup, /Hidden unqualified|<input/);
  for (const locale of ["en-US", "pt-BR", "en-US"]) {
    assert.equal(commonExpandedConfigurationLines(id, 1, configuration, locale, core)[0], `${translate(locale, "ui.specialty")}: ${locale === "pt-BR" ? "Medicina" : "Medicine"} (Authored anatomy)`);
    assert.ok(meritPresentation(definition, locale).prerequisites);
    assert.doesNotMatch(translate(locale, "ui.meritSelectExistingSpecialty"), /missing translation/);
  }
  assert.equal(JSON.stringify(merit), before);
});

test("saving Specialty removal or alterations removes exactly the linked paid Merit in all five lines, preserving balances and receipts", async () => {
  for (const line of ["CofD", "MtA", "VtR", "CtL", "WtF"]) {
    const base = blankPrintCharacter(line);
    base.skills.Medicine = 3;
    base.specializations = [structuredClone(specialty)];
    base.merits = [selection(), { definitionId: "unavailable:authored", instanceId: "other-paid", name: "Authored unrelated Merit", dots: 2, creationDots: 0, experienceDots: 2, configuration: { name: "Authored" } }];
    base.current_state.experience_available = 8;
    base.current_state.experience_spent = 3;
    base.current_state.receipt = { definitionId: id, instanceId: "paid-interdisciplinary", cost: 1, label: "Original label" };
    const previous = await normalizeGameLineCharacter(base);
    const before = JSON.stringify(previous);
    for (const specializations of [[], [{ ...specialty, name: "Renamed anatomy" }], [{ ...specialty, skill: "Weaponry" }], [{ ...specialty, grantedBy: "Other origin" }]]) {
      const edited = structuredClone(previous); edited.specializations = specializations;
      for (const prepare of [prepareCharacterForSave, prepareCharacterForUpdate]) {
        const next = await prepare(edited, previous);
        assert.equal(next.merits.some(item => item.instanceId === "paid-interdisciplinary"), false, line);
        assert.deepEqual(JSON.parse(JSON.stringify(next.merits.find(item => item.instanceId === "other-paid"))), JSON.parse(JSON.stringify(previous.merits.find(item => item.instanceId === "other-paid"))));
        assert.deepEqual(next.current_state, previous.current_state);
        const intact = JSON.stringify(next);
        assert.equal(refundMeritDots(next, "Renamed Merit label", 1, "paid-interdisciplinary", undefined, id), false);
        assert.equal(JSON.stringify(next), intact);
        assert.deepEqual((await normalizeGameLineCharacter(next)).merits, next.merits, "normalizing again does not restore the removed Merit");
      }
      assert.equal((await normalizeGameLineCharacter(edited)).merits.some(item => item.instanceId === "paid-interdisciplinary"), true, "opening alone never removes an unresolved old link");
    }
    assert.equal(JSON.stringify(previous), before);
  }
});

test("creation recomposition cannot restore an explicitly removed XP-only instance, including an unambiguous schema-2 selection", () => {
  for (const merit of [selection(), { ...selection(), instanceId: undefined, definitionId: undefined, name: "Interdisciplinary Specialty" }]) {
    const current = [merit];
    const changed = reconcileSpecialtyMerits(current, [specialty], current, []);
    assert.equal(changed.removed.length, 1);
    const omit = item => specialtyMeritWasRemoved(item, changed.removed);
    assert.deepEqual(mergeCreationMerits(current, [], omit), []);
    assert.equal(mergeCreationMerits(current, []).length, 1, "ordinary creation omission continues preserving XP");
    const replacement = { ...selection(), instanceId: "new-purchase", experienceDots: 0, creationDots: 1 };
    assert.equal(mergeCreationMerits(current, [replacement], omit)[0].instanceId, replacement.instanceId);
  }
  for (const override of [{ definitionId: "unavailable:identity" }, { definitionId: "homebrew:namesake" }, { configuration: { subject: "Legacy opaque choice" } }]) {
    const merit = { ...selection(), ...override };
    assert.deepEqual(reconcileSpecialtyMerits([merit], [specialty], [merit], []).merits, [merit]);
  }
  const duplicate = [selection(), { ...selection(), definitionId: "unavailable:different-definition" }];
  assert.deepEqual(reconcileSpecialtyMerits(duplicate, [specialty], duplicate, []).merits, duplicate, "duplicate instance IDs fail closed even across definitions");
});

test("Changeling XP quotes require an exact existing Specialty choice before committing the linked Merit", async () => {
  const { quoteChangelingMeritPurchase } = await load("/game-lines/changeling/experience-merits.ts");
  const sheet = blankPrintCharacter("CtL"); sheet.skills.Medicine = 3; sheet.specializations = [specialty];
  const before = JSON.stringify(sheet);
  assert.equal(quoteChangelingMeritPurchase(sheet, id, 1, -1, core), undefined);
  assert.equal(quoteChangelingMeritPurchase(sheet, id, 1, -1, core, { ...configuration, specialty_name: "Invented" }), undefined);
  const quote = quoteChangelingMeritPurchase(sheet, id, 1, -1, core, configuration);
  assert.ok(quote); assert.equal(quote.cost, 1);
  assert.equal(quote.selection.definitionId, id); assert.ok(quote.selection.instanceId);
  assert.deepEqual(quote.selection.configuration, configuration);
  assert.equal(JSON.stringify(sheet), before);
});

test("Cult grant links survive creation merges and removing their Specialty clears only the exact producer row without shifting siblings", async () => {
  const base = blankPrintCharacter("CofD"); base.skills.Medicine = 3;
  const sibling = core.find(item => item.id === "core-2ed:safe-place");
  base.merits = [{ definitionId: "core-2ed:mystery-cult-initiation", instanceId: "cult", name: "Authored cult", dots: 3, creationDots: 1, experienceDots: 2,
    configuration: { level_1_type: "specialty", level_1_specialty_skill: "Medicine", level_1_specialty_name: specialty.name, level_3_type: "merits", level_3_merits: [encodeMeritGrantChoice(definition, 1), encodeMeritGrantChoice(sibling, 1)] } }];
  let previous = await normalizeGameLineCharacter(base);
  const granted = previous.specializations[0];
  previous.merits.find(item => item.definitionId === id).configuration = { ...configuration, specialty_grantedBy: granted.grantedBy };
  previous.merits.find(item => item.definitionId === sibling.id).configuration = { name: "Authored location" };
  previous = await normalizeGameLineCharacter(previous);
  const child = previous.merits.find(item => item.definitionId === id), other = previous.merits.find(item => item.definitionId === sibling.id);
  const paidPrevious = structuredClone(previous);
  Object.assign(paidPrevious.merits.find(item => item.instanceId === child.instanceId), { dots: 1, creationDots: 0, experienceDots: 1 });
  paidPrevious.current_state.receipt = { definitionId: id, instanceId: child.instanceId, cost: 1 };
  const paidChanged = structuredClone(paidPrevious); paidChanged.merits[0].configuration.level_1_specialty_name = "Changed paid grant link";
  const paidNext = await prepareCharacterForUpdate(paidChanged, paidPrevious);
  assert.equal(paidNext.merits.some(item => item.definitionId === id), false, "neither the paid instance nor a new free grant survives the removed link");
  assert.deepEqual(paidNext.current_state, paidPrevious.current_state);
  assert.equal(paidNext.merits[0].configuration.level_3_merits[0], "");
  const creation = structuredClone(previous); creation.merits = mergeCreationMerits(previous.merits, [{ ...previous.merits[0], dots: 1 }]);
  const saved = await prepareCharacterForSave(creation, previous);
  assert.deepEqual(saved.merits.find(item => item.instanceId === child.instanceId).configuration, child.configuration);
  assert.deepEqual(saved.merits.find(item => item.instanceId === other.instanceId).configuration, other.configuration);
  const changed = structuredClone(saved); changed.merits[0].configuration.level_1_specialty_name = "Altered granted Specialty";
  const next = await prepareCharacterForUpdate(changed, saved);
  assert.equal(next.merits.some(item => item.instanceId === child.instanceId), false);
  assert.equal(next.merits[0].configuration.level_3_merits[0], "");
  assert.equal(next.merits[0].configuration.level_3_merits[1], saved.merits[0].configuration.level_3_merits[1]);
  assert.deepEqual(next.merits.find(item => item.instanceId === other.instanceId), other);
  assert.deepEqual(next.current_state, saved.current_state);
  assert.equal((await normalizeGameLineCharacter(next)).merits.some(item => item.definitionId === id), false);
});

test("Changeling owns suspension of its linked Entitlement benefit; the Specialty Merit does not regenerate", async () => {
  const { synchronizeEntitlement } = await load("/game-lines/changeling/entitlements.ts");
  const catalog = read("public/game-lines/changeling/data/entitlements.json");
  const entitlement = catalog.find(item => item.blessings.some(blessing => blessing.id === "hedge-interdisciplinary"));
  const base = blankPrintCharacter("CtL"); base.skills.Medicine = 3; base.skills.Weaponry = 3; base.skills.Survival = 2; base.line_data.wyrd = 3;
  base.specializations = [structuredClone(specialty)];
  base.merits = [{ definitionId: "oak-ash-thorn:entitlement", instanceId: "title", name: "Authored Title", dots: 4, configuration: { definitionId: entitlement.id } }];
  base.line_data.entitlement = { definitionId: entitlement.id, accepted: true, touchstone: { name: "Authored person", status: "active" }, allocations: [{ id: "a", sequence: 0, target: "blessing", blessingId: "hedge-interdisciplinary" }], choices: {}, suspendedBenefitIds: [] };
  synchronizeEntitlement(base, catalog);
  const granted = base.merits.find(item => item.definitionId === id);
  assert.ok(granted);
  granted.configuration = { ...granted.configuration, ...configuration };
  const recomposed = structuredClone(base);
  recomposed.merits.find(item => item.instanceId === granted.instanceId).configuration = { subject: "Hedge" };
  const saved = await prepareCharacterForSave(recomposed, base);
  assert.equal(saved.merits.find(item => item.instanceId === granted.instanceId).configuration.specialty_name, specialty.name);
  const changed = structuredClone(base); changed.specializations = [];
  const next = await prepareCharacterForUpdate(changed, base);
  assert.ok(next.line_data.entitlement.suspendedBenefitIds.includes("hedge-interdisciplinary"));
  synchronizeEntitlement(next, catalog);
  assert.equal(next.merits.some(item => item.definitionId === id), false);
  assert.deepEqual(next.current_state, base.current_state);
});

test("Mage owns its schema-2 ID-less Cult producer when clearing the exact linked benefit", async () => {
  const base = blankPrintCharacter("MtA"); base.skills.Medicine = 3;
  base.merits = [{ instanceId: "legacy-cult", name: "Mystery Cult Influence", sourceId: "mta-2ed", dots: 3,
    configuration: { level_1_type: "specialty", level_1_specialty_skill: "Medicine", level_1_specialty_name: specialty.name,
      level_3_type: "merit", level_3_merits: [encodeMeritGrantChoice(definition, 1)] } }];
  let previous = await normalizeGameLineCharacter(base);
  const granted = previous.specializations.find(item => item.name === specialty.name);
  previous.merits.find(item => item.definitionId === id).configuration = { ...configuration, specialty_grantedBy: granted.grantedBy };
  previous = await normalizeGameLineCharacter(previous);
  const changed = structuredClone(previous); changed.merits.find(item => item.instanceId === "legacy-cult").configuration.level_1_specialty_name = "Changed";
  const next = await prepareCharacterForUpdate(changed, previous);
  const parent = next.merits.find(item => item.instanceId === "legacy-cult");
  assert.equal(parent.definitionId, undefined, "the production bridge does not rewrite legacy identity");
  assert.deepEqual(parent.configuration.level_3_merits, [""]);
  assert.equal(next.merits.some(item => item.definitionId === id), false);
  assert.equal((await normalizeGameLineCharacter(next)).merits.some(item => item.definitionId === id), false);
  assert.deepEqual(next.current_state, previous.current_state);
});
