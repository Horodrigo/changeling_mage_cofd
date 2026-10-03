import assert from "node:assert/strict";
import test, { after } from "node:test";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { createServer } from "vite";

const root = fileURLToPath(new URL("..", import.meta.url));
const vite = await createServer({ appType: "custom", configFile: false, root, resolve: { alias: { "@": root } }, server: { middlewareMode: true, hmr: false, ws: false }, optimizeDeps: { noDiscovery: true, include: [] } });
after(() => vite.close());
const { meritContextForSheet, meritPrerequisitesMet } = await vite.ssrLoadModule("/lib/merits.ts");
const { mageMeritContextForSheet, canAdvanceMageGrant } = await vite.ssrLoadModule("/game-lines/mage/merits.ts");
const { changelingMeritContextForSheet, canAdvanceChangelingGrant, changelingExperienceMeritEligible } = await vite.ssrLoadModule("/game-lines/changeling/merit-context.ts");
const { canAdvanceWerewolfGrant } = await vite.ssrLoadModule("/game-lines/werewolf/experience-rules.ts");
const { vampireMeritContextForSheet } = await vite.ssrLoadModule("/game-lines/vampire/merit-eligibility.ts");
const { mortalMeritContextForSheet } = await vite.ssrLoadModule("/game-lines/mortal/rules.ts");
const { blankPrintCharacter } = await vite.ssrLoadModule("/app/workspace/blank-print-character.ts");
const read = path => JSON.parse(readFileSync(new URL(`../public/${path}`, import.meta.url), "utf8"));
const catalog = [...read("shared/data/merits.json"), ...read("game-lines/changeling/data/merits.json"), ...read("game-lines/mage/data/merits.json"), ...read("game-lines/werewolf/data/merits.json")];

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
  assert.deepEqual(Object.keys(context).sort(), ["gameLine", "archetypes", "attributes", "skills", "merits", "meritCatalog", "size"].sort());
});

test("each line supplies only its own prerequisite fields and preserves purchased instances, effective Skills and authored data", () => {
  for (const [line, factory, data, expected] of [
    ["MtA", mageMeritContextForSheet, { path: "Moros", order: "Free Council", gnosis: 3, arcana: { Death: 2 } }, { path: "Moros", order: "Free Council", gnosis: 3, arcana: { Death: 2 } }],
    ["CtL", changelingMeritContextForSheet, { seeming: "Wizened", kith: "Artist", court: "autumn", wyrd: 3, contracts: [{ originalName: "Contract One", name: "Stored label" }], learned_contracts: [{ name: "Contract Two" }] }, { seeming: "Wizened", kith: "Artist", court: "autumn", wyrd: 3, mantle: 0, powers: ["Contract One", "Contract Two"] }],
    ["CofD", mortalMeritContextForSheet, {}, {}],
    ["VtR", (sheet, catalog) => vampireMeritContextForSheet(sheet, catalog, ["vampire", "mekhet"]), {}, {}],
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
