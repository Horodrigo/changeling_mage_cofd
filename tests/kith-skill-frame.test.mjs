import assert from "node:assert/strict";
import test, { after } from "node:test";
import { fileURLToPath } from "node:url";
import { createServer } from "vite";

const root = fileURLToPath(new URL("..", import.meta.url));
const vite = await createServer({
  appType: "custom",
  configFile: false,
  root,
  resolve: { alias: { "@": root } },
  server: { middlewareMode: true, hmr: false },
});
after(async () => vite.close());

const { kithSkillMiddlePieceCount } = await vite.ssrLoadModule("/app/workspace/sheet-primitives.tsx");

test("nomes curtos de Kith Skill usam apenas as peças left e right", () => {
  assert.equal(kithSkillMiddlePieceCount(35), 0);
  assert.equal(kithSkillMiddlePieceCount(50), 0);
  assert.equal(kithSkillMiddlePieceCount(64), 0);
});

test("peças middle são adicionadas somente quando o texto excede as peças fixas", () => {
  assert.equal(kithSkillMiddlePieceCount(65), 1);
  assert.equal(kithSkillMiddlePieceCount(82), 1);
  assert.equal(kithSkillMiddlePieceCount(83), 2);
});
