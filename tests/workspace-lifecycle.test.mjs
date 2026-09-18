import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";

const workspaceUrl = new URL("../app/workspace.tsx", import.meta.url);
const persistenceUrl = new URL("../lib/character-persistence.ts", import.meta.url);
const registryUrl = new URL("../game-lines/registry/game-line-registry.ts", import.meta.url);

function functionBody(source, name, nextName) {
  const start = source.indexOf(`function ${name}`);
  assert.ok(start >= 0, `missing function ${name}`);
  const end = nextName ? source.indexOf(`function ${nextName}`, start + 1) : source.length;
  return source.slice(start, end >= 0 ? end : source.length);
}

test("character import validates schema before applying common and line normalization", async () => {
  const workspace = await readFile(workspaceUrl, "utf8");
  const body = functionBody(workspace, "importCharacter", "Dashboard");

  const validate = body.indexOf("validateCurrentCharacter(parsed)");
  const normalizeExpression = body.search(
    /normalizeGameLineCharacter\(normalizeStoredSheet\(parsed\s+as\s+CharacterSheet\)\)/,
  );

  assert.ok(validate >= 0, "import must validate the parsed character");
  assert.ok(
    normalizeExpression > validate,
    "normalization must happen only after schema validation",
  );
  assert.match(body, /validation === "unsupported-schema"/);
  assert.match(body, /validation !== "valid"/);
});

test("opening a character never bypasses normalization after a failure", async () => {
  const workspace = await readFile(workspaceUrl, "utf8");
  const body = functionBody(workspace, "openCharacter", "saveCharacter");

  assert.match(body, /normalizeStoredSheet\(sheet\)/);
  assert.match(body, /normalizeGameLineCharacter\(/);
  assert.doesNotMatch(
    body,
    /catch\s*\{[\s\S]*?setSelected\(sheet\)/,
    "raw stored characters must not be opened when catalog hydration or normalization fails",
  );
});

test("common persistence normalization stays line-neutral", async () => {
  const persistence = await readFile(persistenceUrl, "utf8");

  assert.doesNotMatch(persistence, /game-lines\//);
  assert.doesNotMatch(persistence, /@\/lib\/(?:mage|changeling|vampire|entitlements)/);
  assert.doesNotMatch(persistence, /synchronizeMeritGrants/);
  assert.match(persistence, /normalizeStoredSheet/);
});

test("registry applies selected line normalize then synchronize hooks", async () => {
  const registry = await readFile(registryUrl, "utf8");

  const normalizeIndex = registry.indexOf("rules.normalizeCharacter");
  const synchronizeIndex = registry.indexOf("rules.synchronizeCharacter");
  assert.ok(normalizeIndex >= 0);
  assert.ok(synchronizeIndex > normalizeIndex);
});

test("workspace contains no dead server-catalog presentation path", async () => {
  const workspace = await readFile(workspaceUrl, "utf8");

  assert.doesNotMatch(
    workspace,
    /\btype CatalogRule\b|\bfunction RulesCatalog\b|\bfunction summarizeRule\b/,
    "server/D1-era rules catalog presentation remains dead inside Workspace",
  );
});
