import assert from "node:assert/strict";
import test, { after } from "node:test";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { createServer } from "vite";

const root = fileURLToPath(new URL("..", import.meta.url));
const powers = JSON.parse(readFileSync(new URL("../public/game-lines/vampire/data/powers.json", import.meta.url), "utf8"));
const vite = await createServer({ appType: "custom", configFile: false, root, resolve: { alias: { "@": root } }, server: { middlewareMode: true, hmr: false, ws: false } });
after(() => vite.close());

test("VtR Hidden Devotions link canonical powers, quote 1/2/3 XP and refund dependencies atomically", async () => {
  const { linkedDevotionQuote, linkedDevotionTargets, storedDevotionTarget } = await vite.ssrLoadModule("/game-lines/vampire/linked-devotions.ts");
  const { vampireDevotionPrerequisitesMet: eligible, vampireDevotionExperienceCost: cost } = await vite.ssrLoadModule("/game-lines/vampire/creation-rules.ts");
  const { refundVampireAdvancement: refund } = await vite.ssrLoadModule("/game-lines/vampire/experience-refunds.ts");
  const { vampireRules } = await vite.ssrLoadModule("/game-lines/vampire/rules.ts");
  const { vampireExperienceLabel: label } = await vite.ssrLoadModule("/game-lines/vampire/experience-presentation.ts");
  const { blankPrintCharacter } = await vite.ssrLoadModule("/app/workspace/blank-print-character.ts");
  const sheet = blankPrintCharacter("VtR");
  sheet.line_data.disciplines = Object.fromEntries(powers.disciplines.map(item => [item.name, 5]));
  const targets = Array.from({ length: 6 }, (_, index) => ({ ...powers.devotions.find(item => item.id === "devotion-body-of-will"), id: `test:power-${index + 1}`, name: "Same name", translatedName: "Mesmo nome", experienceCost: index + 1, action: "Instant" }));
  const catalog = { ...powers, devotions: [...powers.devotions, ...targets] };
  sheet.line_data.devotion_ids = targets.map(item => item.id);
  for (const id of ["devotion-rapidity", "devotion-slow-steady"]) {
    const definition = catalog.devotions.find(item => item.id === id);
    assert.equal(cost(definition, sheet, catalog), undefined, "No choice never becomes a one-XP purchase");
    assert.equal(eligible(definition, sheet, catalog), false);
    for (let rank = 1; rank <= 5; rank++) {
      const target = { kind: "devotion", id: targets[rank - 1].id };
      const quote = linkedDevotionQuote(definition, sheet, catalog, target);
      assert.equal(quote.required, rank);
      assert.equal(quote.cost, Math.ceil(rank / 2));
      assert.equal(eligible(definition, sheet, catalog, [], target), true);
      sheet.line_data.disciplines[definition.linkedPower.disciplineId === "celerity" ? "Celerity" : "Resilience"] = rank - 1;
      assert.equal(eligible(definition, sheet, catalog, [], target), false);
      sheet.line_data.disciplines[definition.linkedPower.disciplineId === "celerity" ? "Celerity" : "Resilience"] = 5;
    }
    assert.equal(linkedDevotionQuote(definition, sheet, catalog, { kind: "devotion", id: targets[5].id }), undefined);
    assert.equal(linkedDevotionQuote(definition, sheet, catalog, { kind: "devotion", id: "Same name" }), undefined);
    const hidden = { ...catalog, devotions: catalog.devotions.filter(item => item.id !== targets[0].id) };
    assert.equal(linkedDevotionQuote(definition, sheet, hidden, { kind: "devotion", id: targets[0].id }), undefined);
    const reflexive = { ...catalog, devotions: catalog.devotions.map(item => item.id === targets[0].id ? { ...item, action: "Reflexive" } : item) };
    assert.equal(linkedDevotionQuote(definition, sheet, reflexive, { kind: "devotion", id: targets[0].id }), undefined);
    assert.ok(linkedDevotionTargets(definition, sheet, catalog).every(target => id !== "devotion-rapidity" || target.kind === "devotion"));
  }
  const slow = catalog.devotions.find(item => item.id === "devotion-slow-steady");
  assert.equal(linkedDevotionQuote(slow, sheet, catalog, { kind: "discipline", id: "majesty", rating: 2 }).required, 2);
  assert.equal(linkedDevotionQuote(slow, sheet, catalog, { kind: "discipline", id: "Majesty", rating: 2 }), undefined);
  assert.equal(linkedDevotionQuote(slow, sheet, catalog, { kind: "discipline", id: "majesty", rating: 6 }), undefined);
  const rapid = catalog.devotions.find(item => item.id === "devotion-rapidity");
  const target = { kind: "devotion", id: targets[4].id };
  sheet.line_data.devotion_ids.push(rapid.id);
  sheet.line_data.devotion_targets = { [rapid.id]: target };
  const undo = { kind: "devotion", id: rapid.id, target, cost: 3 };
  const receipt = { id: "linked", label: "Authored receipt stays", cost: 3, undo };
  const original = JSON.stringify(sheet), receiptBefore = JSON.stringify(receipt);
  assert.deepEqual(storedDevotionTarget(sheet.line_data, rapid.id), target);
  assert.equal(cost(rapid, sheet, catalog), 3);
  assert.deepEqual(vampireRules.normalizeCharacter(sheet).line_data.devotion_targets, sheet.line_data.devotion_targets);
  assert.equal(refund(sheet, { kind: "devotion", id: target.id }, catalog), false);
  assert.equal(refund(sheet, { kind: "discipline", name: "Celerity" }, catalog), false);
  assert.equal(refund(sheet, { ...undo, target: { kind: "devotion", id: targets[0].id } }, catalog), false);
  assert.equal(refund(sheet, { kind: "devotion", id: rapid.id }, catalog), false);
  assert.equal(JSON.stringify(sheet), original);
  for (const locale of ["en-US", "pt-BR", "en-US"]) assert.equal(label(receipt, sheet, [], catalog, locale), `${locale === "pt-BR" ? rapid.translatedName : rapid.name}: ${locale === "pt-BR" ? "Mesmo nome" : "Same name"}`);
  assert.equal(JSON.stringify(receipt), receiptBefore);
  assert.equal(refund(sheet, undo, catalog), true);
  assert.equal(refund(sheet, undo, catalog), false);
  assert.ok(sheet.line_data.devotion_ids.includes(target.id));
  assert.deepEqual(sheet.line_data.devotion_targets, {});
  const legacy = blankPrintCharacter("VtR");
  legacy.line_data.devotion_ids = [rapid.id];
  const legacyBefore = JSON.stringify(legacy);
  assert.deepEqual(vampireRules.normalizeCharacter(legacy).line_data.devotion_targets, undefined);
  assert.equal(JSON.stringify(legacy), legacyBefore);
  assert.equal(refund(legacy, { kind: "devotion", id: rapid.id }, catalog), true, "ID-only legacy receipt remains refundable without inventing a target");
});
