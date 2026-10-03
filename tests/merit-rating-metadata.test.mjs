import assert from "node:assert/strict";
import test, { after } from "node:test";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { createServer } from "vite";

const root = fileURLToPath(new URL("..", import.meta.url));
const vite = await createServer({ appType: "custom", configFile: false, root,
  resolve: { alias: { "@": root } }, server: { middlewareMode: true, hmr: false, ws: false },
  optimizeDeps: { noDiscovery: true, include: [] } });
after(() => vite.close());
const { meritRatingsFor } = await vite.ssrLoadModule("/lib/merits.ts");
const { normalizeMeritHomebrew } = await vite.ssrLoadModule("/lib/merit-homebrews.ts");
const read = path => JSON.parse(readFileSync(new URL(`../${path}`, import.meta.url), "utf8"));
const core = read("public/shared/data/merits.json");
const changeling = read("public/game-lines/changeling/data/merits.json");

test("canonical repeatability and aggregate ratings are explicit catalog metadata", () => {
  for (const id of ["allies", "alternate-identity", "language", "library", "mentor", "retainer", "safe-place", "status", "striking-looks"])
    assert.equal(core.find(item => item.id === `core-2ed:${id}`).repeatable, true, id);
  for (const id of ["ctl-2ed:court-goodwill", "ctl-2ed:fae-mount", "ctl-2ed:hedgespun-item", "h-courts:acquired-taste",
    "ctl-2ed:hollow", "ctl-2ed:stable-trod", "ctl-hedge:shared-bastion", "ctl-2ed:hedge-duelist"])
    assert.equal(changeling.find(item => item.id === id).repeatable, true, id);
  for (const id of ["contacts", "staff"]) {
    const definition = core.find(item => item.id === `core-2ed:${id}`);
    assert.equal(definition.unbounded, true);
    assert.notEqual(definition.repeatable, true);
  }
  assert.notEqual(changeling.find(item => item.id === "ctl-2ed:token").repeatable, true);
});

test("unbounded ratings survive renamed labels but namesakes do not inherit them", () => {
  const contacts = core.find(item => item.id === "core-2ed:contacts");
  assert.deepEqual(meritRatingsFor({ ...contacts, name: "Contatos" }, 7), [1, 2, 3, 4, 5, 6, 7]);
  assert.deepEqual(meritRatingsFor({ name: "Contacts", ratings: [1, 3, 5] }, 7), [1, 3, 5]);
  assert.deepEqual(meritRatingsFor({ name: "Artifact", ratings: [3], unbounded: true }, 6), [3, 4, 5, 6]);
});

test("player-defined repeatability round-trips explicitly rather than being inferred from a name", () => {
  const base = { id: "homebrew:merit:test", name: "Allies", line: "Core", category: "Social", ratings: [1, 3, 5], description: "Authored." };
  const explicit = normalizeMeritHomebrew({ ...base, repeatable: true, unbounded: true });
  assert.equal(normalizeMeritHomebrew(JSON.parse(JSON.stringify(explicit))).repeatable, true);
  assert.equal(explicit.unbounded, true);
  assert.equal(normalizeMeritHomebrew(base).repeatable, undefined);
  assert.equal(normalizeMeritHomebrew({ ...base, name: "Contacts" }).unbounded, undefined);
});

test("purchase controls do not dispatch repeatability or ratings from display-name sets", () => {
  for (const path of ["lib/merits.ts", "app/builder/merit-picker.tsx", "app/workspace/experience-shared.tsx",
    "game-lines/changeling/experience-merits.ts", "game-lines/werewolf/experience-rules.ts", "game-lines/werewolf/totem-benefits.ts"]) {
    assert.doesNotMatch(readFileSync(new URL(`../${path}`, import.meta.url), "utf8"),
      /REPEATABLE_MERITS|UNBOUNDED_MERITS|EXTENDED_DOT_MERITS/, path);
  }
});
