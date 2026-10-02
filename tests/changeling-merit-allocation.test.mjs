import assert from "node:assert/strict";
import test, { after } from "node:test";
import { fileURLToPath } from "node:url";
import { readFileSync } from "node:fs";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { createServer } from "vite";

const root = fileURLToPath(new URL("..", import.meta.url));
const vite = await createServer({ appType: "custom", configFile: false, root,
  resolve: { alias: { "@": root } }, server: { middlewareMode: true, hmr: false, ws: false },
  optimizeDeps: { noDiscovery: true, include: [] } });
after(() => vite.close());
const { recoverChangelingMeritAllocations } = await vite.ssrLoadModule("/game-lines/changeling/merit-allocation.ts");
const { prepareCharacterForSave } = await vite.ssrLoadModule("/app/workspace/character-lifecycle.ts");
const { creationMerits, mergeCreationMerits } = await vite.ssrLoadModule("/lib/merit-progression.ts");
const { refundMeritDots } = await vite.ssrLoadModule("/lib/experience-refunds.ts");
const { LanguageProvider } = await vite.ssrLoadModule("/lib/i18n.tsx");
const { changelingBuilder } = await vite.ssrLoadModule("/game-lines/changeling/builder.tsx");
const entitlement = JSON.parse(readFileSync(new URL("../public/game-lines/changeling/data/merits.json", import.meta.url), "utf8"))
  .find(item => item.name === "Entitlement");

// The reported schema-2 allocation and matching history, without player identity.
const instanceId = "purchased-entitlement";
const purchase = (name, id, previousDots, amount) => ({ kind: "spend", experience: -amount,
  undo: { kind: "merit", name, instanceId: id, instanceIndex: 1, previousDots } });
const reported = () => ({ id: "test", schema_version: 2, system: "chronicles-of-darkness", game_line: "CtL",
  ruleset: { id: "ctl-2ed-embedded", version: 1 }, character: { name: "Test", player: "Test", concept: "" },
  attributes: { Intelligence: 3, Wits: 2, Resolve: 3, Strength: 2, Dexterity: 2, Stamina: 3, Presence: 3, Manipulation: 2, Composure: 2 },
  skills: { Academics: 1, Computer: 3, Crafts: 3, Investigation: 4, Athletics: 2, Brawl: 2, Drive: 3, "Animal Ken": 4 },
  specializations: [], merits: [{ instanceId, name: "Entitlement", dots: 4, creationDots: 4, experienceDots: 0,
    sourceId: "ctl-oak-ash-thorn", source: "Oak, Ash, and Thorn", configuration: { definitionId: "baron-lesser-ones", roleId: "" } }],
  line_data: { seeming: "Fairest", court: "autumn", wyrd: 3, creation_wyrd: 1,
    entitlement: { definitionId: "baron-lesser-ones", accepted: false } }, derived: {},
  current_state: { experience_available: 0, experience_spent: 14, experience_total: 14,
    experience_history: [purchase("Entitlement", instanceId, null, 4),
      { kind: "spend", experience: -5, undo: { kind: "wyrd", previous: 2 } },
      { kind: "spend", experience: -5, undo: { kind: "wyrd", previous: 1 } }] },
  created_at: "2026-09-13", updated_at: "2026-10-01" });

test("reported Entitlement allocation recovers through the canonical lifecycle without changing XP or configuration", async () => {
  const current = reported(), before = structuredClone(current);
  assert.equal(creationMerits(current.merits).length, 1, "reproduces the incorrect creation classification");
  const normalized = await prepareCharacterForSave(current);
  const merit = normalized.merits.find(item => item.instanceId === instanceId);
  assert.deepEqual(merit, { ...current.merits[0], grantedBy: undefined, creationDots: 0, experienceDots: 4 });
  assert.equal(creationMerits(normalized.merits).length, 0);
  assert.deepEqual(normalized.current_state, before.current_state);
  assert.deepEqual(normalized.line_data.entitlement, before.line_data.entitlement);
  assert.deepEqual(current, before);
  const edited = await prepareCharacterForSave({ ...normalized, merits: mergeCreationMerits(normalized.merits, []) });
  assert.deepEqual(edited.merits.find(item => item.instanceId === instanceId), merit);
  assert.deepEqual(edited.current_state, before.current_state);
  const roundTrip = await prepareCharacterForSave(JSON.parse(JSON.stringify(edited)));
  refundMeritDots(roundTrip, "Entitlement", 4, instanceId);
  assert.equal(roundTrip.merits.some(item => item.name === "Entitlement"), false);
});

test("resuming a draft shows the reported purchase under Experience, not creation Merits", () => {
  const current = reported();
  Object.assign(current.current_state, { creation_draft: true, creation_draft_step: 3 });
  const reference = { conditions: [], presentation: {}, courts: [], entitlements: [], entitlementPresentation: {},
    kiths: [], kithPresentation: {}, contractPresentation: {}, tokenPresentation: [] };
  const groups = { "core-merits": [], "changeling-merits": [entitlement], "changeling-reference": reference,
    "changeling-tokens": [], "changeling-contracts": [] };
  const markup = renderToStaticMarkup(createElement(LanguageProvider, null, createElement(changelingBuilder.Component, {
    initial: current, player: "Test", onCancel() {}, onSave() {}, onSaveDraft() {}, catalogs: { get: id => groups[id] },
  })));
  const experienceHeading = markup.indexOf("<h3>Experience</h3>");
  assert.ok(experienceHeading > 0);
  assert.doesNotMatch(markup.slice(0, experienceHeading), />Entitlement</);
  assert.match(markup.slice(experienceHeading), />Entitlement</);
  assert.match(markup, /0\/10/);
  assert.deepEqual(current.merits[0], reported().merits[0]);
});

test("recovery accepts full XP-only upgrade chains and preserves independent repeatable instances", () => {
  const current = reported();
  current.merits = [{ name: "Allies", instanceId: "xp", dots: 3 },
    { name: "Allies", instanceId: "creation", dots: 2, creationDots: 2, experienceDots: 0 }];
  current.current_state.experience_history = [purchase("Allies", "xp", 1, 2), purchase("Allies", "xp", null, 1)];
  assert.deepEqual(recoverChangelingMeritAllocations(current), [
    { ...current.merits[0], creationDots: 0, experienceDots: 3 }, current.merits[1],
  ]);
});

test("valid allocations, creation upgrades and incomplete or ambiguous histories are not guessed", () => {
  const valid = reported();
  Object.assign(valid.merits[0], { creationDots: 0, experienceDots: 4 });
  assert.deepEqual(recoverChangelingMeritAllocations(valid), valid.merits);
  for (const change of [
    current => { current.current_state.experience_history = []; },
    current => { current.current_state.experience_history[0].undo.instanceId = "another-instance"; },
    current => { current.current_state.experience_history[0].undo.name = "Other Merit"; },
    current => { current.current_state.experience_history[0].undo.previousDots = 2; },
    current => { current.current_state.experience_history[0].experience = -3; },
    current => { current.current_state.experience_history[0].experience = "-4"; },
    current => { current.current_state.experience_history[0].kind = "gain"; },
    current => { delete current.merits[0].instanceId; },
    current => { current.merits[0].grantedBy = "Merit:Other"; },
    current => { current.merits.push({ ...current.merits[0] }); },
  ]) {
    const current = reported(); change(current);
    assert.deepEqual(recoverChangelingMeritAllocations(current), current.merits);
  }
});
