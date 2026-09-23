import assert from "node:assert/strict";
import test, { after } from "node:test";
import { fileURLToPath } from "node:url";
import { createServer } from "vite";

const root = fileURLToPath(new URL("..", import.meta.url));
const vite = await createServer({ appType: "custom", configFile: false, root, resolve: { alias: { "@": root } }, server: { middlewareMode: true, hmr: false } });
after(() => vite.close());

test("Homebrew activation honors both source and individual switches", async () => {
  const { homebrewCategoryKeys, homebrewContentActive, setHomebrewEnabled } = await vite.ssrLoadModule("/lib/homebrew.ts");
  const sourceOff = setHomebrewEnabled({ disabledIds: [] }, "h-courts", false);
  assert.equal(homebrewContentActive(sourceOff, "some-item", "h-courts"), false);
  const itemOff = setHomebrewEnabled({ disabledIds: [] }, "some-item", false);
  assert.equal(homebrewContentActive(itemOff, "some-item", "h-courts"), false);
  assert.equal(homebrewContentActive(itemOff, "official-item", "ctl-2ed"), true);
  assert.deepEqual(homebrewCategoryKeys("Court", "h-courts"), ["Court", "Homebrew"]);
  assert.deepEqual(homebrewCategoryKeys("Court", "ctl-2ed"), ["Court"]);
});

test("player-created Merits preserve exact ratings and enforce only structured prerequisites", async () => {
  const { activeMeritCatalog, normalizeMeritHomebrew, normalizeMeritHomebrews } = await vite.ssrLoadModule("/lib/merit-homebrews.ts");
  const { meritPrerequisitesMet } = await vite.ssrLoadModule("/lib/merits.ts");
  const item = normalizeMeritHomebrew({
    id: "homebrew:merit:test", name: "Impossible Grace", line: "CtL", category: "Social", ratings: [1, 3, 5],
    levels: [{ rating: 1, name: "Poise", description: "First benefit." }, { rating: 3, name: "Bearing", description: "Second benefit." }, { rating: 5, name: "Majesty", description: "Third benefit." }],
    requirements: { all: [{ trait: "Presence", minimum: 2 }, { merit: "Striking Looks", minimum: 1 }] },
    narrativePrerequisites: "Must have danced with the moon.", unbounded: false,
  });
  assert.deepEqual(item.ratings, [1, 3, 5]);
  assert.deepEqual(normalizeMeritHomebrews(JSON.parse(JSON.stringify([item])))[0].levels.map((level) => level.rating), [1, 3, 5]);
  assert.equal(meritPrerequisitesMet(item, { gameLine: "CtL", attributes: { Presence: 2 }, merits: [{ name: "Striking Looks", dots: 1 }], meritCatalog: [item] }), true);
  assert.equal(meritPrerequisitesMet(item, { gameLine: "CtL", attributes: { Presence: 1 }, merits: [{ name: "Striking Looks", dots: 1 }], meritCatalog: [item] }), false);
  assert.equal(activeMeritCatalog([], [item], { disabledIds: [item.id] }).length, 0);
  assert.equal(activeMeritCatalog([], [item], { disabledIds: [item.id] }, [item.name]).length, 1);
});

test("player-created Changeling Contracts are normalized at storage boundary", async () => {
  const { mergeContractHomebrews, normalizeContractHomebrew } = await vite.ssrLoadModule("/game-lines/changeling/contract-homebrews.ts");
  const item = normalizeContractHomebrew({
    id: "homebrew:contract:test", name: "Borrowed Moon", type: "Real", categoryKind: "Corte", regalia: "Moon Court", courtIds: ["moon"],
    description: "Borrow the moonlight.", hasRoll: true, dicePool: "Presence + Occult + Mantle", cost: "●●", action: "Instant", duration: "One scene", loophole: "Sing to the moon.",
    success: "The moon answers.", exceptionalSuccess: "It answers completely.", failure: "Nothing happens.", dramaticFailure: "The moon takes offense.",
    seemingBenefits: { Darkling: "Hide in the borrowed light.", Beast: "" },
  });
  assert.equal(item.sourceId, "homebrew:changeling-contracts");
  assert.equal(item.homebrew, true);
  assert.deepEqual(item.courtIds, ["moon"]);
  assert.deepEqual(item.seemingBenefits, { Darkling: "Hide in the borrowed light." });
  assert.equal(mergeContractHomebrews([{ ...item, id: "official" }], [item]).length, 2);

  const goblin = normalizeContractHomebrew({ ...item, id: "homebrew:contract:goblin", type: "Real", categoryKind: "Independente", regalia: "Goblin", goblin: true, courtIds: [] });
  assert.equal(goblin.type, "Comum");
  assert.equal(normalizeContractHomebrew({ id: "homebrew:contract:bad", name: "Bad" }), null);
});

test("player-created Changeling Entitlements are normalized at storage boundary", async () => {
  const { normalizeEntitlementHomebrew } = await vite.ssrLoadModule("/game-lines/changeling/entitlement-homebrews.ts");
  const item = normalizeEntitlementHomebrew({
    id: "homebrew:entitlement:test", name: "Test Title", meritName: "Test Bond", purpose: "Purpose", privileges: "Privilege", duties: "Duty",
    touchstone: "A mortal", curse: "A curse", beat: "A trigger", token: { name: "Seal", effect: "Effect" }, blessings: [{ id: "gift", name: "Gift", description: "Effect" }],
  });
  assert.equal(item.sourceId, "homebrew:changeling-entitlements");
  assert.equal(item.homebrew, true);
  assert.equal(item.blessings.length, 1);
  assert.equal(normalizeEntitlementHomebrew({ id: "bad", name: "Bad", meritName: "Bad", blessings: [] }), null);
});

test("player-created Vampire Bloodlines are normalized at storage boundary", async () => {
  const { normalizeBloodlineHomebrew } = await vite.ssrLoadModule("/game-lines/vampire/bloodline-homebrews.ts");
  const item = normalizeBloodlineHomebrew({
    id: "homebrew:bloodline:test", name: "Test Line", parentClan: "Mekhet", nicknames: ["Owls"],
    favoredAttributes: ["Intelligence", "Wits"], disciplines: ["Auspex", "Celerity", "Obfuscate", "Test Gift"], exclusiveDiscipline: "Test Gift",
    summary: "A hidden lineage.", baneName: "Moonblind", baneSummary: "The moon reveals their shadow.",
  });
  assert.equal(item.sourceId, "homebrew:vampire-bloodlines");
  assert.equal(item.homebrew, true);
  assert.equal(item.exclusiveDiscipline, "Test Gift");
  assert.equal(normalizeBloodlineHomebrew({ id: "homebrew:bloodline:bad", name: "Bad" }), null);
});
