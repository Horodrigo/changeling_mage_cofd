import assert from "node:assert/strict";
import test, { after } from "node:test";
import { fileURLToPath } from "node:url";
import { createServer } from "vite";

const root = fileURLToPath(new URL("..", import.meta.url));
const vite = await createServer({ appType: "custom", configFile: false, root, resolve: { alias: { "@": root } }, server: { middlewareMode: true, hmr: false } });
after(() => vite.close());

const keys = ["merits", "mageSpells", "mageLegacies", "vampireCatalog", "vampireBloodlines", "changelingCatalog", "changelingContracts", "changelingEntitlements"];
const homebrews = Object.fromEntries(keys.map((key) => [key, []]));

test("homebrew transfer accepts current and previous complete envelopes only", async () => {
  const { parseHomebrewTransferEnvelope } = await vite.ssrLoadModule("/app/homebrew-transfer.tsx");

  assert.equal(parseHomebrewTransferEnvelope({ schemaVersion: 1, homebrews })?.schemaVersion, 1);
  assert.deepEqual(
    parseHomebrewTransferEnvelope({ schemaVersion: 2, homebrews, preferences: { disabledIds: [], enabledIds: [] } })?.preferences,
    { disabledIds: [], enabledIds: [] },
  );
  assert.equal(parseHomebrewTransferEnvelope({ schemaVersion: 2, homebrews }), null);
  assert.equal(parseHomebrewTransferEnvelope({ schemaVersion: 2, homebrews, preferences: { disabledIds: [{}] } }), null);
  assert.equal(parseHomebrewTransferEnvelope({ schemaVersion: 2, homebrews: { ...homebrews, merits: {} }, preferences: { disabledIds: [] } }), null);
});
