import assert from "node:assert/strict";
import test, { after } from "node:test";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { createServer } from "vite";

const root = fileURLToPath(new URL("..", import.meta.url));
const vite = await createServer({ appType: "custom", configFile: false, root,
  resolve: { alias: { "@": root } }, server: { middlewareMode: true, hmr: false, ws: false },
  optimizeDeps: { noDiscovery: true, include: [] } });
after(() => vite.close());
const read = path => JSON.parse(readFileSync(new URL(`../${path}`, import.meta.url), "utf8"));
const catalog = [...read("public/shared/data/merits.json"), ...read("public/game-lines/vampire/data/merits.json")];
const { VAMPIRE_MERIT_IDENTITIES, vampireMeritId } = await vite.ssrLoadModule("/game-lines/vampire/merit-identities.ts");
const { vampireCovenantStatus, vampireCovenantAffiliationDots, createBloodTetherPack, leaveBloodTetherPack,
  synchronizeBloodTetherPack, BLOOD_TETHER_PACK_GRANT } = await vite.ssrLoadModule("/game-lines/vampire/creation-rules.ts");
const { zirnitraMortalMeritCount, vampireMeritEligible } = await vite.ssrLoadModule("/game-lines/vampire/merit-eligibility.ts");
const sheet = () => ({ game_line: "VtR", merits: [],
  line_data: { bloodline_id: "adrestoi", disciplines: { "Blood Tether": 5 } },
  derived: { Willpower: 5 }, current_state: { willpower_current: 5, willpower_lost_dots: 0,
    health_damage: ["lethal"], experience_available: 8, experience_spent: 3, experience_history: [{ id: "opaque" }] } });

test("pure Vampire Merit identities agree with static catalogs and explicit IDs always win", () => {
  for (const item of VAMPIRE_MERIT_IDENTITIES) {
    const actual = catalog.find(definition => definition.id === item.id);
    assert.equal(actual.name, item.name);
    assert.equal(actual.sourceId, item.sourceId);
    assert.equal(vampireMeritId({ definitionId: item.id, name: "Renamed" }), item.id);
    assert.equal(vampireMeritId({ name: item.name, sourceId: item.sourceId }), item.id);
    assert.equal(vampireMeritId({ name: item.name, sourceId: "foreign" }), undefined);
    assert.equal(vampireMeritId({ definitionId: "unavailable:id", name: item.name }), "unavailable:id");
  }
});

test("Covenant status and affiliation budgets use exact definitions, not renamed or Homebrew labels", () => {
  const merits = [
    { definitionId: "vtr-kindred-status", name: "Renamed", dots: 2, configuration: { group: "Invictus" } },
    { definitionId: "core-2ed:mystery-cult-initiation", name: "Renamed cult", dots: 3, configuration: { cult: "inconnu" } },
    { definitionId: "homebrew:status", name: "Kindred Status", dots: 5, configuration: { group: "Invictus" } },
    { definitionId: "unavailable:cult", name: "Mystery Cult Initiation", dots: 5, configuration: { cult: "inconnu" } },
  ];
  const covenants = [{ id: "invictus", name: "Invictus", translatedName: "Invictus" },
    { id: "inconnu", name: "Inconnu", translatedName: "Inconnu", group: "shadow-cult" }];
  const before = structuredClone(merits);
  assert.equal(vampireCovenantStatus({ merits }, "Invictus"), 2);
  assert.equal(vampireCovenantAffiliationDots({ merits }, covenants), 5);
  assert.equal(vampireCovenantAffiliationDots({ merits: [{ ...merits[1], configuration: { cult: "Authored title", shadowCultId: "inconnu" } }] }, covenants), 3);
  assert.equal(vampireCovenantAffiliationDots({ merits: [{ ...merits[1], configuration: { cult: "Inconnu", shadowCultId: "Inconnu" } }] }, covenants), 0);
  assert.deepEqual(merits, before);
});

test("Zirnitra counts and upgrades the resolved mortal-only definition, never a namesake", () => {
  const official = { ...catalog.find(item => item.mortalOnly), requirements: undefined, prerequisites: undefined, excludes: undefined };
  const fake = { ...official, id: "homebrew:namesake", mortalOnly: false, sourceId: "homebrew" };
  const context = { gameLine: "VtR", meritCatalog: [official, fake], merits: [
    { definitionId: official.id, name: "Renamed label", dots: 1 },
    { definitionId: fake.id, name: official.name, dots: 1 },
    { definitionId: "unavailable:id", name: official.name, dots: 1 },
  ] };
  assert.equal(zirnitraMortalMeritCount(context), 1);
  assert.equal(vampireMeritEligible(official, context, 1), true);
  const unowned = { ...context, merits: context.merits.slice(1) };
  assert.equal(zirnitraMortalMeritCount(unowned), 0);
  assert.equal(vampireMeritEligible(official, context, 0), false);
});

test("Blood Tether Pack grants a canonical definition and removes only its free dot without losing XP or choices", () => {
  const original = sheet();
  original.merits.push({ definitionId: "homebrew:pack-alpha", instanceId: "authored", name: "Pack Alpha", dots: 1,
    configuration: { subject: "Authored" }, creationDots: 1, experienceDots: 0 });
  const before = structuredClone(original), active = createBloodTetherPack(original);
  const grant = active.merits.find(item => item.grantedBy === BLOOD_TETHER_PACK_GRANT);
  assert.equal(grant.definitionId, "vtr-pack-alpha");
  assert.equal(active.merits.length, 2);
  grant.name = "Renamed"; grant.dots = 3; grant.creationDots = 1; grant.experienceDots = 2;
  grant.configuration = { notes: "Retain me" };
  const paid = structuredClone(active), left = leaveBloodTetherPack(active);
  const retained = left.merits.find(item => item.instanceId === grant.instanceId);
  assert.equal(retained.definitionId, grant.definitionId);
  assert.equal(retained.dots, 2); assert.equal(retained.creationDots, 0); assert.equal(retained.experienceDots, 2);
  assert.equal(retained.grantedBy, undefined); assert.deepEqual(retained.configuration, grant.configuration);
  assert.deepEqual(left.merits.find(item => item.instanceId === "authored"), original.merits[0]);
  for (const key of ["experience_available", "experience_spent", "experience_history", "health_damage"])
    assert.deepEqual(left.current_state[key], active.current_state[key]);
  assert.equal(left.current_state.willpower_lost_dots, 0);
  assert.deepEqual(leaveBloodTetherPack(left), left);
  assert.deepEqual(synchronizeBloodTetherPack(left), left);
  assert.deepEqual(active, paid); assert.deepEqual(original, before);
  const free = leaveBloodTetherPack(createBloodTetherPack(sheet()));
  assert.deepEqual(free.merits, []);
});
