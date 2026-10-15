import assert from "node:assert/strict";
import test, { after } from "node:test";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { createServer } from "vite";

const root = fileURLToPath(new URL("..", import.meta.url));
const vite = await createServer({ appType: "custom", configFile: false, root, server: { middlewareMode: true, hmr: false, ws: false }, resolve: { alias: { "@": root } }, optimizeDeps: { noDiscovery: true, include: [] } });
after(() => vite.close());
const powers = JSON.parse(readFileSync(new URL("../public/game-lines/vampire/data/powers.json", import.meta.url), "utf8"));
const lithopedia = await vite.ssrLoadModule("/game-lines/vampire/lithopedia.ts");
const { refundVampireAdvancement } = await vite.ssrLoadModule("/game-lines/vampire/experience-refunds.ts");

test("Strange Shades p. 28 Lithopedia grants the first rite, then rites only with Család Status", () => {
  const rites = lithopedia.lithopediaRites(powers.devotions);
  assert.equal(rites.length, 10);
  assert.deepEqual(lithopedia.freeLithopediaRatings(0, 3, false), [1]);
  assert.deepEqual(lithopedia.freeLithopediaRatings(0, 3, true), [1, 2, 3]);
  assert.equal(lithopedia.hasCsaladStatus([{ definitionId: "vtr-kindred-status", dots: 1, configuration: { group: "Család" } }]), true);
  assert.equal(lithopedia.hasCsaladStatus([{ definitionId: "vtr-kindred-status", dots: 1, configuration: { group: "Mekhet" } }]), false);
  const choices = lithopedia.freeLithopediaSelections(rites, new Set(), [], [1, 2]);
  assert.equal(new Set(choices).size, 2);
  assert.deepEqual(choices.map(id => rites.find(rite => rite.id === id)?.rating), [1, 2]);
});

test("Lithopedia refund removes only recorded free rites and rejects a later rating", () => {
  const rite = lithopedia.lithopediaRites(powers.devotions)[0];
  const sheet = { line_data: { disciplines: { Lithopedia: 2 }, blood_sorcery: { lithopedia_rite_ids: [rite.id, "other"] } }, current_state: {}, attributes: {}, skills: {}, specializations: [], merits: [] };
  const undo = { kind: "discipline", name: "Lithopedia", amount: 1, lithopedia: { ids: [rite.id], rating: 1 } };
  assert.equal(refundVampireAdvancement(sheet, undo, powers), false);
  assert.equal(sheet.line_data.disciplines.Lithopedia, 2);
  assert.equal(refundVampireAdvancement(sheet, { ...undo, lithopedia: { ...undo.lithopedia, rating: 2 } }, powers), true);
  assert.equal(sheet.line_data.disciplines.Lithopedia, 1);
  assert.deepEqual(sheet.line_data.blood_sorcery.lithopedia_rite_ids, ["other"]);
});
