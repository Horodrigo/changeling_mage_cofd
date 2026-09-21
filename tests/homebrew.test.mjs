import assert from "node:assert/strict";
import test, { after } from "node:test";
import { fileURLToPath } from "node:url";
import { createServer } from "vite";

const root = fileURLToPath(new URL("..", import.meta.url));
const vite = await createServer({ appType: "custom", configFile: false, root, resolve: { alias: { "@": root } }, server: { middlewareMode: true, hmr: false } });
after(() => vite.close());

test("Homebrew activation honors both source and individual switches", async () => {
  const { homebrewContentActive, setHomebrewEnabled } = await vite.ssrLoadModule("/lib/homebrew.ts");
  const sourceOff = setHomebrewEnabled({ disabledIds: [] }, "h-courts", false);
  assert.equal(homebrewContentActive(sourceOff, "some-item", "h-courts"), false);
  const itemOff = setHomebrewEnabled({ disabledIds: [] }, "some-item", false);
  assert.equal(homebrewContentActive(itemOff, "some-item", "h-courts"), false);
  assert.equal(homebrewContentActive(itemOff, "official-item", "ctl-2ed"), true);
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
