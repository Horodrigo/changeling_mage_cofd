import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";

const workspaceUrl = new URL("../app/workspace.tsx", import.meta.url);
const lifecycleUrl = new URL("../app/workspace/character-lifecycle.ts", import.meta.url);
const repositoryUrl = new URL("../app/workspace/character-repository.ts", import.meta.url);
const persistenceUrl = new URL("../lib/character-persistence.ts", import.meta.url);
const registryUrl = new URL("../game-lines/registry/game-line-registry.ts", import.meta.url);
const builderShellUrl = new URL("../app/character-builder-shell.tsx", import.meta.url);

function functionBody(source, name, nextName) {
  const start = source.indexOf(`function ${name}`);
  assert.ok(start >= 0, `missing function ${name}`);
  const end = nextName ? source.indexOf(`function ${nextName}`, start + 1) : source.length;
  return source.slice(start, end >= 0 ? end : source.length);
}

test("character import validates schema before common and line normalization", async () => {
  const lifecycle = await readFile(lifecycleUrl, "utf8");
  const body = functionBody(lifecycle, "importCharacterFile");

  const validate = body.indexOf("validateCurrentCharacter(parsed)");
  const prepare = body.indexOf("prepareCharacterForOpen(parsed as CharacterSheet)");

  assert.ok(validate >= 0, "import must validate the parsed character");
  assert.ok(prepare > validate, "normalization must happen only after schema validation");
  assert.match(body, /validation === "unsupported-schema"/);
  assert.match(body, /validation !== "valid"/);
});

test("opening a character delegates to lifecycle normalization and never falls back raw", async () => {
  const workspace = await readFile(workspaceUrl, "utf8");
  const body = functionBody(workspace, "openCharacter", "saveCharacter");

  assert.match(body, /setSelected\(await prepareCharacterForOpen\(sheet\)\)/);
  assert.match(body, /catch\s*\{[\s\S]*?setSelected\(null\)/);
  assert.doesNotMatch(body, /setSelected\(sheet\)/);
});

test("common persistence normalization stays line-neutral", async () => {
  const persistence = await readFile(persistenceUrl, "utf8");

  assert.doesNotMatch(persistence, /game-lines\//);
  assert.doesNotMatch(persistence, /@\/lib\/(?:mage|changeling|vampire|entitlements)/);
  assert.doesNotMatch(persistence, /synchronizeMeritGrants/);
  assert.match(persistence, /normalizeStoredSheet/);
});

test("registry applies selected line normalize then synchronize then derive hooks", async () => {
  const registry = await readFile(registryUrl, "utf8");

  const normalizeIndex = registry.indexOf("rules.normalizeCharacter");
  const synchronizeIndex = registry.indexOf("rules.synchronizeCharacter");
  const deriveIndex = registry.indexOf("rules.deriveCharacterState");
  assert.ok(normalizeIndex >= 0);
  assert.ok(synchronizeIndex > normalizeIndex);
  assert.ok(deriveIndex > synchronizeIndex);
});

test("current-state updates are an explicit transient fast path", async () => {
  const lifecycle = await readFile(lifecycleUrl, "utf8");
  const body = functionBody(lifecycle, "updateCharacterState", "importCharacterFile");

  assert.match(body, /current_state:\s*structuredClone\(currentState\)/);
  assert.match(body, /updated_at:\s*new Date\(\)\.toISOString\(\)/);
  assert.doesNotMatch(
    body,
    /normalizeStoredSheet|normalizeGameLineCharacter|hydrateCharacterCatalogs|loadRules/,
    "transient play-state updates must not re-run the structural character pipeline",
  );
});

test("repository owns local persistence and stored-character collection mutation", async () => {
  const [workspace, repository] = await Promise.all([
    readFile(workspaceUrl, "utf8"),
    readFile(repositoryUrl, "utf8"),
  ]);

  assert.match(workspace, /useCharacterRepository\(userKey\)/);
  assert.doesNotMatch(workspace, /@\/lib\/device-storage|getDeviceValue|setDeviceValue|stageDeviceValue/);

  assert.match(repository, /from\s+["']@\/lib\/device-storage["']/);
  assert.match(repository, /getDeviceValue<StoredCharacter\[\]>\(storageKey\)/);
  assert.match(repository, /stageDeviceValue\(storageKey,\s*characters\)/);
  assert.match(repository, /setDeviceValue\(storageKey,\s*characters\)/);
  assert.match(repository, /upsertStoredCharacter/);
  assert.match(repository, /replaceStoredCharacter/);
  assert.match(repository, /removeStoredCharacter/);
});

test("workspace delegates structural character lifecycle instead of implementing it", async () => {
  const workspace = await readFile(workspaceUrl, "utf8");

  assert.match(workspace, /prepareCharacterForOpen/);
  assert.match(workspace, /prepareCharacterForSave/);
  assert.match(workspace, /prepareCharacterForUpdate/);
  assert.match(workspace, /applyCharacterState/);
  assert.match(workspace, /importCharacterFile/);

  assert.doesNotMatch(
    workspace,
    /normalizeStoredSheet|normalizeGameLineCharacter|validateCurrentCharacter|hydrateCharacterCatalogs/,
    "Workspace should orchestrate UI, not implement persistence normalization",
  );
});

test("workspace contains no dead server-catalog presentation path", async () => {
  const workspace = await readFile(workspaceUrl, "utf8");

  for (const legacySymbol of ["CatalogRule", "RulesCatalog", "summarizeRule"]) {
    assert.equal(
      workspace.includes(legacySymbol),
      false,
      `${legacySymbol} from the removed server catalog path remains in Workspace`,
    );
  }

  assert.doesNotMatch(
    workspace,
    /workspace\.(?:sharedLibrary|activeRules|activeRulesDescription|structuredRuleSummary|sharedRuleActive|sourceDetail)/,
    "D1-era catalog presentation copy remains reachable from Workspace",
  );
});

test("character creation drafts survive exit and resume through the Builder", async () => {
  const [workspace, shell, changeling, mage, vampire] = await Promise.all([
    readFile(workspaceUrl, "utf8"), readFile(builderShellUrl, "utf8"),
    readFile(new URL("../game-lines/changeling/builder.tsx", import.meta.url), "utf8"),
    readFile(new URL("../game-lines/mage/builder.tsx", import.meta.url), "utf8"),
    readFile(new URL("../game-lines/vampire/builder.tsx", import.meta.url), "utf8"),
  ]);
  assert.match(shell, /addEventListener\("popstate"/);
  assert.match(shell, /addEventListener\("beforeunload"/);
  assert.match(shell, /creation_draft_step/);
  assert.match(workspace, /function saveCharacterDraft/);
  assert.match(workspace, /isCreationDraft\(sheet\)[\s\S]*?setEditing\(sheet\)/);
  for (const source of [changeling, mage, vampire]) {
    assert.match(source, /builderCurrentState\(source, draft, common\.step, common\.allowAdvancement\)/);
    assert.match(source, /draft \? onSaveDraft : onSave/);
    assert.match(source, /prepareAdvancement=/);
    assert.match(source, /builderMode/);
  }
  assert.match(shell, /creation_advancement_enabled/);
  assert.match(shell, /state\.step === advancementStep - 1 && state\.allowAdvancement/);
});
