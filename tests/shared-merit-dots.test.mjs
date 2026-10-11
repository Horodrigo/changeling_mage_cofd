import assert from "node:assert/strict";
import test, { after } from "node:test";
import { fileURLToPath } from "node:url";
import { createServer } from "vite";

const root = fileURLToPath(new URL("..", import.meta.url));
const vite = await createServer({ appType: "custom", configFile: false, root,
  resolve: { alias: { "@": root } }, server: { middlewareMode: true, hmr: false },
  optimizeDeps: { noDiscovery: true, include: [] } });
after(() => vite.close());
const { effectiveMeritDots, sharedMeritDots, SHARED_DOT_MERIT_IDS } = await vite.ssrLoadModule("/lib/shared-merit-dots.ts");
const { meritSelectionProblems } = await vite.ssrLoadModule("/lib/merits.ts");
const { requirementMet } = await vite.ssrLoadModule("/lib/merit-requirements.ts");

test("shared dots apply only to the eight named place Merits and never change purchased dots", () => {
  assert.equal(SHARED_DOT_MERIT_IDS.size, 8);
  for (const id of SHARED_DOT_MERIT_IDS) {
    const owned = { definitionId: id, name: id, dots: 2, configuration: { sharedDots: "3" } };
    assert.equal(sharedMeritDots(owned), 3);
    assert.equal(effectiveMeritDots(owned), 5);
    assert.equal(owned.dots, 2);
  }
  assert.equal(effectiveMeritDots({ definitionId: "core-2ed:allies", dots: 2, configuration: { sharedDots: "3" } }), 2);
  assert.equal(sharedMeritDots({ definitionId: "core-2ed:safe-place", configuration: { sharedDots: "-2" } }), 0);
});

test("shared Safe Place dots satisfy a linked Merit requirement and totals cannot exceed five", () => {
  const safe = { id: "core-2ed:safe-place", name: "Safe Place", sourceId: "core-2ed", ratings: [1, 2, 3, 4, 5] };
  const context = { gameLine: "MtA", meritCatalog: [safe], merits: [{ definitionId: safe.id, name: safe.name, dots: 2, configuration: { sharedDots: "2" } }] };
  assert.equal(requirementMet({ merit: safe.id, minimum: 4 }, context), true);
  assert.equal(requirementMet({ merit: safe.id, minimum: 5 }, context), false);
  assert.ok(meritSelectionProblems(safe, { dots: 4, configuration: { sharedDots: "2" } }, context).some(item => item.key === "ui.meritsExceedTheLimit"));
});
