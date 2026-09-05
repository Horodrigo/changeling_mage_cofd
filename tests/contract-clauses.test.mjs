import assert from "node:assert/strict";
import test, { after } from "node:test";
import { fileURLToPath } from "node:url";
import { createServer } from "vite";

const root = fileURLToPath(new URL("..", import.meta.url));
const vite = await createServer({ appType:"custom", configFile:false, root, resolve:{alias:{"@":root}}, server:{middlewareMode:true,hmr:false}, optimizeDeps:{noDiscovery:true,include:[]} });
after(async () => vite.close());
const clauses = await vite.ssrLoadModule("/lib/contract-clauses.ts");

const common = { id:"common", type:"Comum", courtClauses:{sun:"S",moon:"M"} };
const royal = { id:"royal", type:"Real", courtClauses:{sun:"S",moon:"M"} };

test("Court Goodwill 1 libera Clause Common estrangeira, mas não Royal", () => {
  const goodwill = new Map([["moon", 1]]);
  assert.deepEqual(clauses.availableForeignClauseCourtIds(common, "Corte do Sol", goodwill, new Set()), ["moon"]);
  assert.deepEqual(clauses.availableForeignClauseCourtIds(royal, "Corte do Sol", goodwill, new Set()), []);
});

test("Court Goodwill 3 libera Clause Royal e compras existentes não se repetem", () => {
  const goodwill = new Map([["moon", 3]]);
  assert.deepEqual(clauses.availableForeignClauseCourtIds(royal, "sun", goodwill, new Set()), ["moon"]);
  assert.deepEqual(clauses.availableForeignClauseCourtIds(royal, "sun", goodwill, new Set(["royal::moon"])), []);
});
