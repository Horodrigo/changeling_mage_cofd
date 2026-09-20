import assert from "node:assert/strict";
import test, { after } from "node:test";
import { fileURLToPath } from "node:url";
import { createServer } from "vite";

const root = fileURLToPath(new URL("..", import.meta.url));
const vite = await createServer({ appType: "custom", configFile: false, root, resolve: { alias: { "@": root } }, server: { middlewareMode: true, hmr: false }, optimizeDeps: { noDiscovery: true, include: [] } });
after(async () => vite.close());
const { blankPrintCharacter } = await vite.ssrLoadModule("/app/workspace/blank-print-character.ts");

test("blank print sheets contain only baseline Chronicles traits", () => {
  for (const line of ["CtL", "MtA", "VtR"]) {
    const character = blankPrintCharacter(line);
    assert.equal(character.game_line, line);
    assert.deepEqual(new Set(Object.values(character.attributes)), new Set([1]));
    assert.deepEqual(new Set(Object.values(character.skills)), new Set([0]));
    assert.deepEqual(character.line_data, {});
    assert.deepEqual(character.current_state, {});
    assert.deepEqual(character.merits, []);
  }
});
