import assert from "node:assert/strict";
import test, { after } from "node:test";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { createServer } from "vite";

const root = fileURLToPath(new URL("..", import.meta.url));
const vite = await createServer({ appType: "custom", configFile: false, root, resolve: { alias: { "@": root } }, server: { middlewareMode: true, hmr: false, ws: false }, optimizeDeps: { noDiscovery: true, include: [] } });
after(() => vite.close());
const { meritContextForSheet, meritPrerequisitesMet, meritSelectionProblems } = await vite.ssrLoadModule("/lib/merits.ts");
const { mageMeritContextForSheet, canAdvanceMageGrant, mageMeritPrerequisitesMet } = await vite.ssrLoadModule("/game-lines/mage/merits.ts");
const { changelingMeritContextForSheet, canAdvanceChangelingGrant, changelingExperienceMeritEligible, changelingMeritPrerequisitesMet } = await vite.ssrLoadModule("/game-lines/changeling/merit-context.ts");
const { canAdvanceWerewolfGrant } = await vite.ssrLoadModule("/game-lines/werewolf/experience-rules.ts");
const { vampireMeritContextForSheet } = await vite.ssrLoadModule("/game-lines/vampire/merit-eligibility.ts");
const { mortalMeritContextForSheet } = await vite.ssrLoadModule("/game-lines/mortal/rules.ts");
const { blankPrintCharacter } = await vite.ssrLoadModule("/app/workspace/blank-print-character.ts");
const read = path => JSON.parse(readFileSync(new URL(`../public/${path}`, import.meta.url), "utf8"));
const catalog = [...read("shared/data/merits.json"), ...read("game-lines/changeling/data/merits.json"), ...read("game-lines/mage/data/merits.json"), ...read("game-lines/werewolf/data/merits.json")];

test("Advanced Library requires one canonical Safe Place at least equal to the purchase rating in every line and locale", async () => {
  const { meritPresentation, withMeritPresentation } = await vite.ssrLoadModule("/lib/merit-presentation.ts");
  const definition = catalog.find(item => item.id === "mta-2ed:advanced-library");
  const shown = withMeritPresentation([definition], read("shared/data/merits-pt.json"))[0];
  const safePlace = catalog.find(item => item.id === "core-2ed:safe-place");
  const library = { definitionId: "core-2ed:library", instanceId: "library", name: "Authored library", dots: 3 };
  const place = dots => ({ definitionId: safePlace.id, instanceId: `place-${dots}`, sourceId: safePlace.sourceId, name: "Authored location", dots, creationDots: 1, experienceDots: dots - 1, configuration: { name: "My location" } });
  for (const [line, contextFor] of [["CofD", mortalMeritContextForSheet], ["MtA", mageMeritContextForSheet], ["CtL", changelingMeritContextForSheet], ["VtR", sheet => vampireMeritContextForSheet(sheet, catalog, ["vampire"])], ["WtF", meritContextForSheet]]) {
    const sheet = blankPrintCharacter(line);
    sheet.line_data.test_receipt = { definitionId: definition.id, instanceId: "advanced-library", cost: 6, label: "Original receipt" };
    for (const [places, expected] of [[[], false], [[place(2)], false], [[place(3)], true], [[place(4)], true], [[place(1), place(2)], false], [[{ ...place(3), definitionId: "unavailable:safe-place", name: safePlace.name }], false], [[{ ...place(3), definitionId: "homebrew:safe-place", name: safePlace.name }], false], [[{ ...place(3), definitionId: undefined, name: safePlace.name }], true], [[{ ...place(3), definitionId: undefined, name: "Local Seguro" }], false]]) {
      sheet.merits = [library, ...places];
      const before = JSON.stringify(sheet);
      const context = contextFor(sheet, catalog);
      for (const locale of ["en-US", "pt-BR", "en-US"]) {
        assert.equal(meritPrerequisitesMet(shown, { ...context, selectedDots: 3 }), expected, line);
        assert.equal(meritSelectionProblems(shown, { dots: 3 }, context).length, expected ? 0 : 1);
        assert.match(meritPresentation(shown, locale).description, locale === "pt-BR" ? /uma única instância de Local Seguro/ : /one Safe Place instance/);
      }
      assert.equal(JSON.stringify(sheet), before);
    }
    sheet.merits = [library, place(2)];
    const context = contextFor(sheet, catalog);
    assert.equal(meritPrerequisitesMet(definition, context), true, "picker can offer the first dot");
    assert.equal(meritPrerequisitesMet(definition, { ...context, selectedDots: 2 }), true);
    assert.equal(meritPrerequisitesMet(definition, { ...context, selectedDots: 3 }), false);
    assert.equal(meritPrerequisitesMet(definition, { ...context, merits: [{ ...library, dots: 2 }, place(3)] }), false);
    assert.equal(meritPrerequisitesMet(definition, { ...context, meritCatalog: catalog.filter(item => item.id !== safePlace.id) }), false);
  }
});

test("line parsers compose numeric traits and AND/OR identity clauses without changing saved values", () => {
  const mage = { gameLine: "MtA", archetypes: ["awakened"], gnosis: 2, arcana: { Death: 2 }, path: "Moros" };
  const definition = { name: "Authored", prerequisites: "Awakened; Gnosis ••; Death •• or Mind •••; Moros" };
  const before = structuredClone(mage);
  assert.equal(mageMeritPrerequisitesMet(definition, mage), true);
  for (const change of [{ gnosis: 1 }, { arcana: { Death: 1, Mind: 2 } }, { path: "Acanthus" }, { archetypes: [] }])
    assert.equal(mageMeritPrerequisitesMet(definition, { ...mage, ...change }), false);
  assert.equal(mageMeritPrerequisitesMet(definition, { ...mage, arcana: { Mind: 3 } }), true);
  assert.equal(mageMeritPrerequisitesMet({ name: "Narrative", prerequisites: "Non-Awakened or Sleepwalker" }, mage), false);
  assert.deepEqual(mage, before);

  const changeling = { gameLine: "CtL", archetypes: ["changeling"], wyrd: 3, seeming: "Beast", kith: "Artist", powers: ["Primal Glory"] };
  const required = { name: "Authored", prerequisites: "Wyrd •••; Contract of Primal Glory" };
  assert.equal(changelingMeritPrerequisitesMet(required, changeling), true);
  for (const change of [{ wyrd: 2 }, { powers: [] }])
    assert.equal(changelingMeritPrerequisitesMet(required, { ...changeling, ...change }), false);
  assert.equal(changelingMeritPrerequisitesMet({ name: "Authored", prerequisites: "Beast or Wizened; Wyrd •••" }, changeling), true);
  assert.equal(changelingMeritPrerequisitesMet({ name: "Authored", prerequisites: "Beast or Wizened; Wyrd •••" }, { ...changeling, seeming: "Ogre" }), false);
  assert.equal(changelingMeritPrerequisitesMet({ name: "Authored", prerequisites: "Artist Kith; Wyrd •••" }, changeling), true);
  assert.equal(changelingMeritPrerequisitesMet({ name: "Authored", prerequisites: "Artist Kith; Wyrd •••" }, { ...changeling, kith: "Chatelaine" }), false);
  assert.equal(changelingMeritPrerequisitesMet({ name: "Authored", prerequisites: "Non-changeling; Resolve •••" }, { ...changeling, attributes: { Resolve: 3 } }), false);
});

test("Homebrew numeric requirements use explicit owning traits and remain identical through EN/PT presentation", async () => {
  const { normalizeMeritHomebrew } = await vite.ssrLoadModule("/lib/merit-homebrews.ts");
  const { meritPresentation } = await vite.ssrLoadModule("/lib/merit-presentation.ts");
  for (const [line, eligible, context, trait, change] of [
    ["MtA", mageMeritPrerequisitesMet, { gameLine: "MtA", gnosis: 3, arcana: { Death: 2 } }, "Gnosis", { gnosis: 2 }],
    ["CtL", changelingMeritPrerequisitesMet, { gameLine: "CtL", wyrd: 3 }, "Wyrd", { wyrd: 2 }],
  ]) {
    const item = normalizeMeritHomebrew({ id: "homebrew:merit:authored", name: "Authored", line, category: "Mental", ratings: [1], description: "My rules", requirements: { all: [{ trait, minimum: 3 }, { any: [{ trait: "Wits", minimum: 2 }, { trait: "Resolve", minimum: 3 }] }] } });
    const candidate = { ...context, attributes: { Wits: 2 } };
    const before = JSON.stringify([item, candidate]);
    for (const locale of ["en-US", "pt-BR", "en-US"]) {
      meritPresentation(item, locale, catalog);
      assert.equal(eligible(item, candidate), true);
      assert.equal(eligible(item, { ...candidate, ...change }), false);
      assert.equal(eligible(item, { ...candidate, attributes: {} }), false);
    }
    assert.equal(JSON.stringify([item, candidate]), before);
  }
  assert.equal(mageMeritPrerequisitesMet({ name: "Authored", requirements: { trait: "Death", minimum: 2 } }, { gameLine: "MtA", arcana: { Death: 2 } }), true);
  assert.equal(mageMeritPrerequisitesMet({ name: "Authored", requirements: { trait: "Death", minimum: 2 } }, { gameLine: "MtA" }), false);
});

test("Core reads only explicit neutral numeric traits, never specialized context fields", () => {
  const context = { gameLine: "CofD", traits: { "Authored Power": 3 } };
  for (const field of ["line_data", "gnosis", "arcana", "path", "order", "wyrd", "court", "mantle", "seeming", "kith", "powers"])
    Object.defineProperty(context, field, { get() { throw new Error(`Core read ${field}`); } });
  assert.equal(meritPrerequisitesMet({ name: "Authored", requirements: { trait: "Authored Power", minimum: 3 }, prerequisites: "Authored Power •••" }, context), true);
  assert.equal(meritPrerequisitesMet({ name: "Authored", requirements: { trait: "Authored Power", minimum: 4 } }, context), false);
});

test("Changeling owns Seeming alternatives, Kith metadata and the Lucid Dreamer exception", () => {
  const context = { gameLine: "CtL", archetypes: ["changeling"], seeming: "Beast", kith: "Artist", attributes: { Wits: 3 } };
  const definition = { id: "homebrew:test", name: "My Merit", seeming: "Darkling", alternativePrerequisites: "Wits •••", prerequisites: "Darkling" };
  assert.equal(changelingMeritPrerequisitesMet(definition, context), true);
  assert.equal(changelingMeritPrerequisitesMet(definition, { ...context, attributes: { Wits: 2 } }), false);
  assert.equal(changelingMeritPrerequisitesMet({ ...definition, alternativePrerequisites: undefined }, context), false);
  assert.equal(changelingMeritPrerequisitesMet({ name: "Kith Merit", kith: "Artist" }, context), true);
  assert.equal(changelingMeritPrerequisitesMet({ name: "Kith Merit", kith: "Artist" }, { ...context, kith: "Chatelaine" }), false);
  const lucid = catalog.find(item => item.id === "ctl-2ed:lucid-dreamer");
  assert.equal(changelingMeritPrerequisitesMet(lucid, context), false);
  assert.equal(changelingMeritPrerequisitesMet({ ...lucid, id: "homebrew:lucid", prerequisites: undefined }, context), true);
});

test("Changeling Court access and printed remainder use the same owning predicate for selection and validation", () => {
  const definition = { id: "homebrew:test", name: "Seasonal Merit", courtAccess: [{ court: "Autumn", mantle: 1, courtGoodwill: 3 }], prerequisites: "Autumn Mantle • or Autumn Court Goodwill •••; Wits •••" };
  const context = { gameLine: "CtL", court: "Autumn Court", mantle: 1, attributes: { Wits: 3 }, meritCatalog: catalog, merits: [] };
  const before = structuredClone(context);
  assert.equal(changelingMeritPrerequisitesMet(definition, context), true);
  assert.equal(changelingExperienceMeritEligible(definition, context), true);
  assert.deepEqual(meritSelectionProblems(definition, { dots: 1 }, context, changelingMeritPrerequisitesMet), []);
  for (const change of [{ mantle: 0 }, { court: "winter" }, { attributes: { Wits: 2 } }]) {
    const candidate = { ...context, ...change };
    assert.equal(changelingMeritPrerequisitesMet(definition, candidate), false);
    assert.equal(changelingExperienceMeritEligible(definition, candidate), false);
    assert.equal(meritSelectionProblems(definition, { dots: 1 }, candidate, changelingMeritPrerequisitesMet)[0].key, "ui.meritPrerequisitesNotMet");
  }
  assert.deepEqual(context, before);
});

test("each line owns canonical grant upgrade eligibility; translated, foreign, unavailable and Homebrew identities cannot impersonate a grant", () => {
  for (const [id, marker, eligible] of [
    ["ctl-2ed:mantle", "Corte", canAdvanceChangelingGrant],
    ["mta-2ed:awakened-status", "Ordem", canAdvanceMageGrant],
    ["core-2ed:mystery-cult-initiation", "Nameless Order", canAdvanceMageGrant],
    ["wtf-2ed:totem", "werewolf:creation-totem", canAdvanceWerewolfGrant],
  ]) {
    const definition = catalog.find(item => item.id === id);
    const selection = { definitionId: id, instanceId: "grant", name: "Changed presentation", dots: 1, creationDots: 1, experienceDots: 0, sourceId: definition.sourceId, grantedBy: marker, configuration: { notes: "Authored" } };
    const before = JSON.stringify(selection);
    assert.equal(eligible(selection, catalog), true, id);
    assert.equal(eligible({ ...selection, definitionId: undefined, name: definition.name }, catalog), true);
    for (const change of [
      { definitionId: "unavailable:id", name: definition.name },
      { definitionId: "homebrew:id", name: definition.name },
      { definitionId: undefined, name: "Translated label" },
      { definitionId: undefined, name: definition.name, sourceId: "foreign" },
      { grantedBy: "Other grant" }, { grantedBy: undefined },
    ]) assert.equal(eligible({ ...selection, ...change }, catalog), false, `${id}: ${JSON.stringify(change)}`);
    const namesake = { ...definition, id: "homebrew:id", sourceId: "homebrew" };
    assert.equal(eligible({ ...selection, definitionId: namesake.id, name: definition.name }, [...catalog, namesake]), false);
    assert.equal(eligible({ ...selection, definitionId: undefined, name: definition.name, sourceId: undefined }, [...catalog, namesake]), false);
    for (const other of [canAdvanceMageGrant, canAdvanceChangelingGrant, canAdvanceWerewolfGrant].filter(item => item !== eligible))
      assert.equal(other(selection, catalog), false);
    assert.equal(JSON.stringify(selection), before);
  }
  for (const [id, marker] of [["mta-2ed:high-speech", "Ordem"], ["core-2ed:language", "werewolf:first-tongue"]]) {
    const definition = catalog.find(item => item.id === id);
    const merit = { definitionId: id, name: definition.name, dots: 1, grantedBy: marker };
    assert.equal(canAdvanceMageGrant(merit, catalog), false);
    assert.equal(canAdvanceWerewolfGrant(merit, catalog), false);
  }
});

test("only Changeling enforces catalog Mantle as an existing allocation; a Homebrew namesake does not inherit that restriction", () => {
  const mantle = catalog.find(item => item.id === "ctl-2ed:mantle");
  const namesake = { ...mantle, id: "homebrew:mantle", sourceId: "homebrew", prerequisites: undefined };
  const context = { gameLine: "CtL", court: "autumn", merits: [], meritCatalog: [...catalog, namesake] };
  assert.equal(changelingExperienceMeritEligible(mantle, context), false);
  assert.equal(changelingExperienceMeritEligible(namesake, context), true);
  context.merits = [{ definitionId: namesake.id, name: "Mantle", dots: 1, grantedBy: "Corte" }];
  assert.equal(changelingExperienceMeritEligible(mantle, context), false);
  context.merits = [{ definitionId: mantle.id, name: "Renamed label", dots: 1, grantedBy: "Corte" }];
  assert.equal(changelingExperienceMeritEligible(mantle, context), true);
});

test("neutral Merit context never reads line_data and applies only explicitly supplied Skill bonuses without mutation", () => {
  const sheet = { game_line: "CofD", attributes: { Wits: 2 }, skills: { Occult: 2 }, merits: [], derived: { Tamanho: 6 } };
  Object.defineProperty(sheet, "line_data", { get() { throw new Error("Core accessed line mechanics"); } });
  const context = meritContextForSheet(sheet, catalog, ["mortal"], { Occult: 1, Medicine: 2 });
  assert.deepEqual(context.skills, { Occult: 3, Medicine: 2 });
  assert.deepEqual(sheet.skills, { Occult: 2 });
  assert.equal(context.size, 6);
  assert.equal(context.merits, sheet.merits);
  assert.equal(context.meritCatalog, catalog);
  assert.deepEqual(Object.keys(context).sort(), ["gameLine", "archetypes", "attributes", "skills", "specializations", "merits", "meritCatalog", "size"].sort());
});

test("each line supplies only its own prerequisite fields and preserves purchased instances, effective Skills and authored data", () => {
  for (const [line, factory, data, expected] of [
    ["MtA", mageMeritContextForSheet, { path: "Moros", order: "Free Council", gnosis: 3, arcana: { Death: 2 } }, { path: "Moros", order: "Free Council", gnosis: 3, arcana: { Death: 2 } }],
    ["CtL", changelingMeritContextForSheet, { seeming: "Wizened", kith: "Artist", court: "autumn", wyrd: 3, contracts: [{ originalName: "Contract One", name: "Stored label" }], learned_contracts: [{ name: "Contract Two" }] }, { seeming: "Wizened", kith: "Artist", court: "autumn", wyrd: 3, mantle: 0, powers: ["Contract One", "Contract Two"] }],
    ["CofD", mortalMeritContextForSheet, {}, {}],
    ["VtR", (sheet, catalog) => vampireMeritContextForSheet(sheet, catalog, ["vampire", "mekhet"]), { clan_id: "mekhet", bloodline_id: "", blood_potency: 2, humanity: 7, disciplines: { Auspex: 2 }, blood_sorcery: { cruac_rating: 1 }, touchstones: [], devotion_ids: [] }, { clanId: "mekhet", bloodlineId: "", hasTouchstone: false, creation: false, devotionIds: [] }],
  ]) {
    const sheet = blankPrintCharacter(line);
    sheet.skills.Occult = 2;
    sheet.merits = [{ definitionId: "unavailable:authored", instanceId: "paid", name: "My Merit", dots: 2, creationDots: 0, experienceDots: 2, configuration: { name: "My notes" } }];
    const allowed = { ...data, merit_granted_skill_bonuses: { Occult: 1 } };
    sheet.line_data = new Proxy(allowed, { get(target, key) {
      if (key === "toJSON") return undefined;
      if (!(key in target)) throw new Error(`${line} accessed foreign field ${String(key)}`);
      return target[key];
    } });
    const before = JSON.stringify(sheet);
    const context = factory(sheet, catalog);
    assert.equal(context.skills.Occult, 3);
    assert.equal(context.gameLine, line);
    for (const [key, value] of Object.entries(expected)) assert.deepEqual(context[key], value);
    for (const foreign of ["path", "order", "gnosis", "arcana", "seeming", "kith", "court", "wyrd", "mantle", "powers"]) {
      if (!(foreign in expected)) assert.equal(foreign in context, false, `${line}: ${foreign}`);
    }
    assert.deepEqual(context.merits, sheet.merits);
    assert.equal(JSON.stringify(sheet), before);
    assert.equal(meritPrerequisitesMet({ name: "Synthetic requirement", prerequisites: "Occult •••" }, context), true);
    assert.equal(meritPrerequisitesMet({ name: "Synthetic requirement", prerequisites: "Occult ••••" }, context), false);
  }
});

test("Changeling Mantle context resolves exact canonical IDs and the documented schema-2 bridge, never translated or Homebrew namesakes", () => {
  const mantle = catalog.find(item => item.id === "ctl-2ed:mantle");
  const sheet = blankPrintCharacter("CtL");
  const owned = { definitionId: mantle.id, instanceId: "paid", name: "Changed display", dots: 3, creationDots: 1, experienceDots: 2, sourceId: mantle.sourceId };
  for (const [override, expected] of [
    [{}, 3], [{ definitionId: "homebrew:mantle", name: "Mantle" }, 0],
    [{ definitionId: "unavailable:mantle", name: "Mantle" }, 0],
    [{ definitionId: undefined, name: "Mantle" }, 3],
    [{ definitionId: undefined, name: "Manto" }, 0],
    [{ definitionId: undefined, name: "Mantle", sourceId: "foreign" }, 0],
  ]) {
    sheet.merits = [{ ...owned, ...override }];
    const before = JSON.stringify(sheet);
    assert.equal(changelingMeritContextForSheet(sheet, catalog).mantle, expected);
    assert.equal(JSON.stringify(sheet), before);
  }
  sheet.merits = [{ ...owned, definitionId: undefined, name: "Mantle", sourceId: undefined }];
  assert.equal(changelingMeritContextForSheet(sheet, [mantle, { ...mantle, id: "homebrew:mantle", sourceId: "homebrew" }]).mantle, 0);
});


test("Fighting Finesse requires a real combat Specialty by canonical ID in all shared and line contexts without changing receipts or authored names", async () => {
  const definition = catalog.find(item => item.id === "core-2ed:fighting-finesse");
  const { meritPresentation, withMeritPresentation } = await vite.ssrLoadModule("/lib/merit-presentation.ts");
  const pt = read("shared/data/merits-pt.json");
  const presented = withMeritPresentation([definition], pt)[0];
  for (const [line, contextFor] of [["CofD", mortalMeritContextForSheet], ["MtA", mageMeritContextForSheet], ["CtL", changelingMeritContextForSheet], ["VtR", sheet => vampireMeritContextForSheet(sheet, catalog, ["vampire"])], ["WtF", meritContextForSheet]]) {
    const sheet = blankPrintCharacter(line);
    sheet.attributes.Dexterity = 3;
    sheet.skills.Brawl = 2;
    sheet.skills.Weaponry = 2;
    sheet.line_data.test_receipt = { definitionId: definition.id, instanceId: "paid-finesse", cost: 2, label: "Original receipt" };
    for (const [specializations, expected] of [[[], false], [[{ skill: "Brawl", name: " " }], false], [[{ skill: "Medicine", name: "Authored specialty" }], false], [[{ skill: "Brawl", name: "Authored specialty" }], true], [[{ skill: "Weaponry", name: "Authored specialty" }], true]]) {
      sheet.specializations = specializations;
      const before = JSON.stringify(sheet);
      const context = contextFor(sheet, catalog);
      assert.equal(context.specializations, sheet.specializations);
      for (const locale of ["en-US", "pt-BR", "en-US"]) {
        assert.match(meritPresentation(presented, locale).prerequisites, locale === "pt-BR" ? /Especialização.*Briga.*Armas Brancas/ : /Specialty.*Brawl.*Weaponry/);
        assert.equal(meritPrerequisitesMet(definition, context), expected, line);
        assert.equal(meritSelectionProblems(definition, { dots: 2 }, context).length, expected ? 0 : 1);
      }
      assert.equal(JSON.stringify(sheet), before);
    }
    const context = contextFor(sheet, catalog);
    assert.equal(meritPrerequisitesMet(definition, { ...context, attributes: { Dexterity: 2 } }), false);
    const namesake = { ...definition, id: "homebrew:test:finesse", name: definition.name, sourceId: "homebrew:test", prerequisites: "Dexterity •••" };
    assert.equal(meritPrerequisitesMet(namesake, { ...context, specializations: [] }), true);
    assert.equal(meritPrerequisitesMet({ ...definition, name: "Renamed catalog label" }, context), true);
  }
});

test("creation Specialty previews recompose current Core grants and retain manual/XP Specialties without rewriting purchased instances", async () => {
  const { commonMeritSpecializations } = await vite.ssrLoadModule("/lib/core/character/synchronize-merit-grants.ts");
  const specializations = [{ skill: "Medicine", name: "Authored creation Specialty" }, { skill: "Weaponry", name: "Purchased Specialty" }, { skill: "Brawl", name: "Obsolete generated Specialty", grantedBy: "Merit:old" }];
  const merits = [{ definitionId: "core-2ed:professional-training", instanceId: "paid-profession", name: "Edited label", dots: 3, creationDots: 1, experienceDots: 2, configuration: { specialty_1_skill: "Brawl", specialty_1_name: "Authored granted Specialty" } }];
  const before = JSON.stringify([specializations, merits]);
  assert.deepEqual(commonMeritSpecializations(specializations, merits).map(item => item.name), ["Authored creation Specialty", "Purchased Specialty", "Authored granted Specialty"]);
  assert.deepEqual(commonMeritSpecializations(specializations, [{ ...merits[0], dots: 2 }]).map(item => item.name), ["Authored creation Specialty", "Purchased Specialty"]);
  const mageCult = { definitionId: "mta-2ed:mystery-cult-influence", name: "Renamed", dots: 3, configuration: { level_1_type: "specialty", level_1_specialty_skill: "Brawl", level_1_specialty_name: "Cult Specialty" } };
  assert.equal(commonMeritSpecializations([], [mageCult]).length, 0);
  assert.equal(commonMeritSpecializations([], [mageCult], () => false, item => item.definitionId === mageCult.definitionId ? mageCult.definitionId : undefined)[0].name, "Cult Specialty");
  assert.equal(JSON.stringify([specializations, merits]), before);
});
