import assert from "node:assert/strict";
import test, { after } from "node:test";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { createServer } from "vite";

const root = fileURLToPath(new URL("..", import.meta.url));
const vite = await createServer({ appType: "custom", configFile: false, root, server: { middlewareMode: true, hmr: false } });
after(async () => vite.close());

const { createRandomId } = await vite.ssrLoadModule("/lib/random-id.ts");

test("random IDs prefer the native UUID implementation", () => {
  assert.equal(createRandomId({ randomUUID: () => "native-id" }), "native-id");
});

test("random IDs retain UUID shape when randomUUID is unavailable on an HTTP LAN origin", () => {
  const id = createRandomId({
    getRandomValues(values) {
      values.fill(0);
      return values;
    },
  });

  assert.equal(id, "00000000-0000-4000-8000-000000000000");
});

test("browser surfaces do not call crypto.randomUUID directly", async () => {
  const paths = [
    "app/builder/merit-picker.tsx",
    "app/workspace/condition-manager.tsx",
    "app/workspace/entitlement-page.tsx",
    "app/workspace/legacy-page.tsx",
    "game-lines/changeling/builder.tsx",
    "game-lines/changeling/builder-merit-editor.tsx",
    "game-lines/changeling/experience-panel.tsx",
    "game-lines/mage/builder.tsx",
    "game-lines/mage/experience-panel.tsx",
    "game-lines/mage/sheet-view.tsx",
  ];
  const sources = await Promise.all(paths.map((path) => readFile(`${root}/${path}`, "utf8")));
  assert.doesNotMatch(sources.join("\n"), /crypto\.randomUUID\(/);
});
