import assert from "node:assert/strict";
import test, { after } from "node:test";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { createServer } from "vite";

const root = fileURLToPath(new URL("..", import.meta.url));
const vite = await createServer({ appType: "custom", configFile: false, root, server: { middlewareMode: true, hmr: false }, resolve: { alias: { "@": root } } });
after(() => vite.close());
const { updateCharacterNarrative } = await vite.ssrLoadModule("/app/workspace/character-lifecycle.ts");
const sheet = (game_line) => ({ id: "test", game_line, character: { name: "Test", portrait: { dataUrl: "data:image/png;base64,AAAA", fileName: "a.png", mimeType: "image/png" } }, line_data: { choices: ["unchanged"] }, attributes: { Resolve: 3 }, derived: { Health: 7 }, merits: [], current_state: { experience_available: 4 }, updated_at: "old" });

test("narrative commits preserve mechanics, resources and portrait identity in all five lines", () => {
  for (const line of ["CofD", "CtL", "MtA", "VtR", "WtF"]) {
    const before = sheet(line);
    const notes = ["Authored text"];
    const next = updateCharacterNarrative(before, { character: { concept: "Concept" }, line_data: { narrative: notes } });
    assert.equal(next.character.concept, "Concept");
    assert.deepEqual(next.line_data.narrative, notes);
    assert.notEqual(next.line_data.narrative, notes);
    for (const key of ["attributes", "derived", "merits", "current_state"]) assert.equal(next[key], before[key]);
    assert.equal(next.character.portrait, before.character.portrait);
    assert.equal(next.line_data.choices, before.line_data.choices);
    assert.equal(before.character.concept, undefined);
    assert.equal(before.line_data.narrative, undefined);
    assert.notEqual(next.updated_at, before.updated_at);
  }
});

test("narrative commits reject non-text fields instead of bypassing structural rule validation", () => {
  assert.throws(() => updateCharacterNarrative(sheet("CtL"), { line_data: { rating: 3 } }), /Invalid narrative line field/);
  assert.throws(() => updateCharacterNarrative(sheet("CtL"), { character: { portrait: "invalid" } }), /Invalid narrative identity field/);
  assert.throws(() => updateCharacterNarrative(sheet("CtL"), { line_data: { records: [{}] } }), /Invalid narrative line field/);
});

test("buffered text input keeps keystrokes local and commits only on field exit", async () => {
  const buffered = await readFile(new URL("../components/ui/buffered-text.tsx", import.meta.url), "utf8");
  assert.match(buffered, /change: \(next: string\) => \{ latest.current = next; setDraft\(next\); \}/);
  assert.match(buffered, /blur: \(\) => \{ focused.current = false; commit\(\); \}/);
  assert.match(buffered, /if \(latest.current === committed.current\) return/);
  assert.match(buffered, /if \(!focused.current\)/);
  const common = await readFile(new URL("../app/builder/common-controls.tsx", import.meta.url), "utf8");
  assert.match(common, /<BufferedInput value=\{name\} onValueCommit=\{setName\}/);
  assert.match(common, /<BufferedInput value=\{specialty.name\}/);
  const paper = await readFile(new URL("../app/workspace/character-paper-shell.tsx", import.meta.url), "utf8");
  assert.match(paper, /<BufferedInput value=\{value\} placeholder=\{placeholder\} onValueCommit=/);
});
