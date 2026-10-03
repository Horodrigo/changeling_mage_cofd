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
const xp = await vite.ssrLoadModule("/game-lines/changeling/experience-merits.ts");
const grants = await vite.ssrLoadModule("/game-lines/changeling/builder-merit-grants.ts");
const { withMeritPresentation } = await vite.ssrLoadModule("/lib/merit-presentation.ts");
const { prepareCharacterForSave } = await vite.ssrLoadModule("/app/workspace/character-lifecycle.ts");
const { creationMerits, mergeCreationMerits } = await vite.ssrLoadModule("/lib/merit-progression.ts");
const json = path => JSON.parse(readFileSync(new URL(`../${path}`, import.meta.url), "utf8"));
const catalog = withMeritPresentation([
  ...json("public/shared/data/merits.json"), ...json("public/game-lines/changeling/data/merits.json"),
], { ...json("public/shared/data/merits-pt.json"), ...json("public/game-lines/changeling/data/merits-pt.json") });
const allies = catalog.find(item => item.name === "Allies");
const homebrew = { ...allies, id: "homebrew:allies", sourceId: "homebrew", source: "Homebrew", presentationPt: { name: "Aliados Caseiros" } };
const active = [...catalog, homebrew];
const sheet = () => ({ id: "xp-test", schema_version: 2, system: "chronicles-of-darkness", game_line: "CtL",
  ruleset: { id: "ctl-2ed-embedded", version: 1 }, character: { name: "Test", player: "Test" },
  attributes: { Intelligence: 3, Wits: 3, Resolve: 3, Strength: 3, Dexterity: 3, Stamina: 3, Presence: 3, Manipulation: 3, Composure: 3 },
  skills: { Academics: 3, Crafts: 3 }, specializations: [], merits: [], line_data: { seeming: "Fairest", court: "courtless", wyrd: 3 }, derived: {},
  current_state: { experience_available: 20, experience_spent: 0, experience_total: 20, experience_history: [], health_damage: ["L"], notes: "Authored" },
  created_at: "2026-10-03", updated_at: "2026-10-03" });
function buy(current, id, dots, index = -1) {
  const before = structuredClone(current);
  const quote = xp.quoteChangelingMeritPurchase(current, id, dots, index, active);
  assert.ok(quote);
  assert.deepEqual(current, before);
  const next = structuredClone(current);
  next.merits[quote.index] = quote.selection;
  next.current_state.experience_available -= quote.cost;
  next.current_state.experience_spent += quote.cost;
  next.current_state.experience_history.unshift({ id: `receipt-${next.current_state.experience_spent}`, kind: "spend", experience: -quote.cost,
    createdAt: "2026-10-03T12:00:00Z", undo: quote.undo });
  return next;
}

test("CtL XP quote targets the exact definition and instance, preserving creation dots and authored choices", () => {
  const current = sheet();
  current.merits = [{ definitionId: allies.id, instanceId: "creation", name: "Label changed", sourceId: allies.sourceId,
    dots: 2, creationDots: 2, experienceDots: 0, configuration: { subject: "Authored" } },
  { definitionId: homebrew.id, instanceId: "homebrew", name: "Allies", sourceId: "homebrew", dots: 1, creationDots: 1, experienceDots: 0 }];
  const quoted = xp.quoteChangelingMeritPurchase(current, allies.id, 4, 0, active);
  assert.equal(quoted.cost, 2);
  assert.deepEqual(quoted.undo, { kind: "merit", definitionId: allies.id, instanceId: "creation", name: "Allies", previousDots: 2, targetDots: 4 });
  assert.deepEqual(quoted.selection.configuration, { subject: "Authored" });
  assert.equal(quoted.selection.creationDots, 2);
  assert.equal(quoted.selection.experienceDots, 2);
  for (const index of [1, 9, -2, 0.5]) assert.equal(xp.quoteChangelingMeritPurchase(current, allies.id, 4, index, active), undefined);
  current.merits[0].definitionId = "missing:allies";
  assert.equal(xp.quoteChangelingMeritPurchase(current, allies.id, 4, 0, active), undefined);
  current.merits[0].definitionId = allies.id;
  current.merits.push({ ...current.merits[0] });
  assert.equal(xp.quoteChangelingMeritPurchase(current, allies.id, 4, 0, active), undefined);
});

test("CtL new receipts round-trip and localize by ID without persisted display descriptions", async () => {
  let current = buy(sheet(), homebrew.id, 2);
  const receipt = current.current_state.experience_history[0], before = structuredClone(current);
  assert.equal(receipt.description, undefined);
  assert.equal(xp.changelingMeritExperienceLabel(receipt, current, active, "en-US"), "Allies 2");
  assert.equal(xp.changelingMeritExperienceLabel(receipt, current, active, "pt-BR"), "Aliados Caseiros 2");
  assert.deepEqual(current, before);
  current = await prepareCharacterForSave(JSON.parse(JSON.stringify(current)));
  assert.equal(current.merits[0].definitionId, homebrew.id);
  assert.deepEqual(current.current_state.experience_history, before.current_state.experience_history);
  assert.equal(creationMerits(current.merits).length, 0);
  assert.equal(mergeCreationMerits(current.merits, [])[0].experienceDots, 2);
  const next = xp.refundChangelingMeritPurchase(current, receipt.id, active);
  assert.equal(next.merits.length, 0);
  assert.equal(next.current_state.experience_available, 20);
  assert.deepEqual(next.current_state.health_damage, before.current_state.health_damage);
});

test("CtL upgrade preserves schema-2 creation dots predating allocation fields and refuses inconsistent allocations", () => {
  const current = sheet();
  current.merits = [{ name: "Allies", sourceId: allies.sourceId, instanceId: "old-creation", dots: 2 }];
  const quoted = xp.quoteChangelingMeritPurchase(current, allies.id, 3, 0, active);
  assert.equal(quoted.selection.creationDots, 2);
  assert.equal(quoted.selection.experienceDots, 1);
  assert.equal(quoted.selection.dots, 3);
  current.merits[0].creationDots = 1;
  current.merits[0].experienceDots = 0;
  assert.equal(xp.quoteChangelingMeritPurchase(current, allies.id, 3, 0, active), undefined);
});

test("CtL refunds preserve other instances, creation allocations, opaque history and resources", () => {
  const current = sheet();
  current.merits = [{ definitionId: allies.id, instanceId: "creation", name: "Allies", sourceId: allies.sourceId,
    dots: 2, creationDots: 2, experienceDots: 0, configuration: { subject: "Authored" } }];
  current.current_state.experience_history = [null, { kind: "opaque", authored: "keep" }];
  const purchased = buy(buy(current, allies.id, 4, 0), homebrew.id, 1);
  const next = xp.refundChangelingMeritPurchase(purchased, "receipt-2", active);
  assert.deepEqual(next.merits[0], current.merits[0]);
  assert.deepEqual(next.merits[1], purchased.merits[1]);
  assert.deepEqual(next.current_state.experience_history.slice(1), current.current_state.experience_history);
  assert.equal(next.current_state.experience_available, 19);
  assert.equal(next.current_state.experience_spent, 1);
  assert.equal(next.current_state.notes, "Authored");
  const builder = xp.refundChangelingMeritPurchase(purchased, "receipt-2", active, true);
  assert.equal(builder.current_state.experience_available, purchased.current_state.experience_available);
});

test("CtL malformed identities, costs and allocations never credit XP or mutate the input", () => {
  const valid = buy(sheet(), allies.id, 3);
  for (const change of [
    s => { s.current_state.experience_history[0].undo.definitionId = homebrew.id; },
    s => { s.current_state.experience_history[0].undo.definitionId = "missing:allies"; },
    s => { s.current_state.experience_history[0].undo.targetDots = 2; },
    s => { s.current_state.experience_history[0].experience = -2; },
    s => { s.current_state.experience_history[0].experience = "-3"; },
    s => { s.current_state.experience_history[0].undo.instanceId = "missing"; },
    s => { delete s.current_state.experience_history[0].undo.instanceId; },
    s => { s.current_state.experience_spent = 1; },
    s => { s.merits[0].experienceDots = 1; },
    s => { s.merits[0].definitionId = "missing:allies"; },
    s => { s.merits.push({ ...s.merits[0] }); },
    s => { s.current_state.experience_history.push(structuredClone(s.current_state.experience_history[0])); },
  ]) {
    const current = structuredClone(valid); change(current); const before = structuredClone(current);
    assert.equal(xp.refundChangelingMeritPurchase(current, "receipt-3", active), undefined);
    assert.deepEqual(current, before);
  }
});

test("CtL legacy canonical receipts need a complete exact-instance chain, never translated names or indices", () => {
  const current = buy(buy(sheet(), allies.id, 1), allies.id, 3, 0);
  for (const entry of current.current_state.experience_history) { delete entry.undo.definitionId; delete entry.undo.targetDots; }
  const latest = current.current_state.experience_history[0];
  assert.equal(xp.refundChangelingMeritPurchase(current, latest.id, active).merits[0].dots, 1);
  assert.equal(xp.changelingMeritExperienceLabel(latest, current, active, "pt-BR"), "Aliados 3");
  for (const change of [
    s => { s.current_state.experience_history.pop(); },
    s => { s.current_state.experience_history[0].undo.name = "Aliados"; },
    s => { delete s.current_state.experience_history[0].undo.instanceId; s.current_state.experience_history[0].undo.instanceIndex = 0; },
    s => { s.current_state.experience_history[0].undo.previousDots = 2; },
    s => { s.merits[0].sourceId = "foreign"; },
  ]) {
    const invalid = structuredClone(current); change(invalid); const before = structuredClone(invalid);
    assert.equal(xp.refundChangelingMeritPurchase(invalid, latest.id, active), undefined);
    assert.deepEqual(invalid, before);
  }
});

test("CtL Court identity index agrees with the canonical catalog, and removing its free dot retains all paid dots", () => {
  for (const identity of grants.CHANGELING_COURT_MERIT_IDENTITIES) {
    const item = catalog.find(item => item.id === identity.id);
    assert.deepEqual({ id: item.id, name: item.name, sourceId: item.sourceId }, identity);
  }
  const current = sheet();
  current.line_data.court = "autumn";
  grants.synchronizeChangelingBuilderMeritGrants(current);
  Object.assign(current.merits[0], { name: "Manto", dots: 4, creationDots: 1, experienceDots: 3, configuration: { court: "autumn", subject: "Authored" } });
  const instance = current.merits[0].instanceId;
  current.merits.push({ ...current.merits[0], definitionId: "homebrew:mantle", instanceId: "hb" });
  current.line_data.court = "courtless";
  grants.synchronizeChangelingBuilderMeritGrants(current);
  const retained = current.merits.find(item => item.instanceId === instance);
  assert.equal(retained.dots, 3);
  assert.equal(retained.experienceDots, 3);
  assert.equal(retained.creationDots, 0);
  assert.equal(retained.grantedBy, undefined);
  assert.equal(retained.configuration.subject, "Authored");
  assert.equal(current.merits.find(item => item.instanceId === "hb").dots, 4);
  const before = structuredClone(current);
  grants.synchronizeChangelingBuilderMeritGrants(current);
  assert.deepEqual(current, before);
});

test("CtL Court Goodwill benefits reject explicit Homebrew/unavailable namesakes and foreign sources", () => {
  const current = sheet();
  current.merits = [
    { definitionId: "ctl-2ed:court-goodwill", name: "Changed", instanceId: "official", dots: 4, configuration: { court: "autumn" } },
    { definitionId: "homebrew:court-goodwill", name: "Court Goodwill", instanceId: "hb", dots: 5, configuration: { court: "winter" } },
    { definitionId: "missing", name: "Court Goodwill", instanceId: "missing", dots: 5, configuration: { court: "spring" } },
    { sourceId: "foreign", name: "Court Goodwill", instanceId: "foreign", dots: 5, configuration: { court: "summer" } },
  ];
  grants.synchronizeChangelingBuilderMeritGrants(current);
  assert.deepEqual(current.line_data.court_goodwill_benefits, [{ court: "autumn", dots: 4, mantleDots: 2 }]);
});
