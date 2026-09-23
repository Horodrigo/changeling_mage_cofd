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
