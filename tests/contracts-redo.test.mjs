import assert from "node:assert/strict";
import test, { after } from "node:test";
import { fileURLToPath } from "node:url";
import { createServer } from "vite";

const root = fileURLToPath(new URL("..", import.meta.url));
const vite = await createServer({ appType:"custom", configFile:false, root, resolve:{alias:{"@":root}}, server:{middlewareMode:true,hmr:false}, optimizeDeps:{noDiscovery:true,include:[]} });
after(async () => vite.close());

const { CONTRACTS, CONTRACT_NAME_ALIASES } = await vite.ssrLoadModule("/lib/contracts.ts");
const { CONTRACT_TEXT_EN } = await vite.ssrLoadModule("/lib/contracts-en.ts");

test("catálogo legado permanece vazio durante a auditoria English-first", () => {
  assert.deepEqual(CONTRACTS, []);
  assert.deepEqual(CONTRACT_NAME_ALIASES, {});
  assert.deepEqual(CONTRACT_TEXT_EN, {});
});
