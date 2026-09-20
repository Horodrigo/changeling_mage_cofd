import assert from "node:assert/strict";
import test, { after } from "node:test";
import { fileURLToPath } from "node:url";
import { createServer } from "vite";

const root = fileURLToPath(new URL("..", import.meta.url));
const vite = await createServer({ appType: "custom", configFile: false, root, server: { middlewareMode: true, hmr: false }, resolve: { alias: { "@": root } } });
after(() => vite.close());

test("Detachment catalog exposes one selectable row per canonical Breaking Point", async () => {
  const { DETACHMENT_BREAKING_POINT_TIERS, DETACHMENT_BREAKING_POINT_OPTIONS } = await vite.ssrLoadModule("/game-lines/vampire/detachment.ts");
  assert.equal(DETACHMENT_BREAKING_POINT_TIERS.length, 10);
  assert.ok(DETACHMENT_BREAKING_POINT_OPTIONS.length > 10);
  assert.equal(new Set(DETACHMENT_BREAKING_POINT_OPTIONS.map((item) => item.id)).size, DETACHMENT_BREAKING_POINT_OPTIONS.length);
  assert.ok(DETACHMENT_BREAKING_POINT_TIERS.every((tier) => tier.breakingPoints.every((point) => point.level === tier.level)));
});

test("Banes reduce Detachment pool by one each, to a maximum of three", async () => {
  const { vampireDetachmentPool } = await vite.ssrLoadModule("/game-lines/vampire/detachment.ts");
  assert.equal(vampireDetachmentPool(5, 1), 5);
  assert.equal(vampireDetachmentPool(5, 1, 0, 1), 4);
  assert.equal(vampireDetachmentPool(5, 1, 0, 3), 2);
  assert.equal(vampireDetachmentPool(5, 1, 0, 99), 2);
});

test("Vampire template grants exactly one free Kindred Status and preserves purchased dots", async () => {
  const { synchronizeVampireBuilderMeritGrants } = await vite.ssrLoadModule("/game-lines/vampire/builder-merit-grants.ts");
  const base = {
    id: "v1", schema_version: 2, system: "chronicles-of-darkness", game_line: "VtR",
    ruleset: { id: "vtr-2ed-embedded", version: 1 }, character: { name: "Mara", concept: "", player: "", chronicle: "" },
    attributes: {}, skills: {}, specializations: [], merits: [], line_data: { kindred_status_group: "Circle of the Crone" }, derived: {}, current_state: {}, created_at: "", updated_at: "",
  };
  const first = synchronizeVampireBuilderMeritGrants(structuredClone(base));
  const granted = first.merits.filter((item) => item.name === "Kindred Status" && item.grantedBy === "Vampire Template");
  assert.equal(granted.length, 1);
  assert.equal(granted[0].dots, 1);
  assert.equal(granted[0].creationDots, 1);
  assert.equal(granted[0].configuration.group, "Circle of the Crone");

  granted[0].dots = 3;
  granted[0].experienceDots = 2;
  first.line_data.kindred_status_group = "Daeva";
  const second = synchronizeVampireBuilderMeritGrants(first);
  const updated = second.merits.find((item) => item.name === "Kindred Status" && item.grantedBy === "Vampire Template");
  assert.equal(updated.dots, 3);
  assert.equal(updated.creationDots, 1);
  assert.equal(updated.experienceDots, 2);
  assert.equal(updated.configuration.group, "Daeva");
});
