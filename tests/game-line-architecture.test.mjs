import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { after } from "node:test";
import { createServer } from "vite";

const root = fileURLToPath(new URL("..", import.meta.url));
const source = (path) => readFile(`${root}/${path}`, "utf8");
const vite = await createServer({appType:"custom",configFile:false,root,server:{middlewareMode:true,hmr:false},resolve:{alias:{"@":root}}});
after(() => vite.close());

test("neutral contracts and core catalog infrastructure do not know concrete game lines", async () => {
  const [contracts, service] = await Promise.all([
    source("lib/game-line-contracts/game-line-registration.ts"),
    source("lib/catalog/catalog-service.ts"),
  ]);
  assert.doesNotMatch(contracts, /game-lines\/(mage|changeling)/);
  assert.doesNotMatch(service, /mage|changeling|hydrate(?:Spells|Contracts|Merits)/i);
});

test("catalog group registry retains statically analyzable lazy line loaders", async () => {
  const registry = await source("game-lines/registry/catalog-group-registry.ts");
  assert.match(registry, /\(\) => import\("\.\.\/mage\/catalogs\/spells"\)/);
  assert.match(registry, /\(\) => import\("\.\.\/changeling\/catalogs\/contracts"\)/);
  assert.doesNotMatch(registry, /import\s+.+from\s+["']\.\.\/(mage|changeling)\/catalogs/);
});

test("current game lines do not statically depend on one another", async () => {
  const [mage, changeling] = await Promise.all([
    source("game-lines/mage/registration.ts"),
    source("game-lines/changeling/registration.ts"),
  ]);
  assert.doesNotMatch(mage, /game-lines\/changeling|\.\.\/changeling\//);
  assert.doesNotMatch(changeling, /game-lines\/mage|\.\.\/mage\//);
});

test("Mage conditions do not depend on Changeling catalog state", async () => {
  const mageConditions = await source("lib/mage-conditions.ts");
  assert.doesNotMatch(mageConditions, /changeling-conditions/);
});

test("persistence is independent of app components", async () => {
  const persistence = await source("lib/character-persistence.ts");
  assert.doesNotMatch(persistence, /from\s+["'][^"']*app\//);
});

test("deferred Homebrew management is not part of the main workspace route", async () => {
  const workspace = await source("app/workspace.tsx");
  assert.doesNotMatch(workspace, /HomebrewsScreen|\.\/homebrews/);
});

test("normal game-line surfaces do not load legacy Homebrew storage", async () => {
  const hook = await source("app/use-homebrews.ts");
  assert.doesNotMatch(hook, /device-storage|readHomebrews|localStorage/);
});

test("game-line contracts do not expose a deferred Homebrew surface", async () => {
  const [registration, groups] = await Promise.all([
    source("lib/game-line-contracts/game-line-registration.ts"),
    source("lib/game-line-contracts/catalog-groups.ts"),
  ]);
  assert.doesNotMatch(registration, /loadHomebrew|GameLineHomebrew/);
  assert.doesNotMatch(groups, /homebrew/);
});

test("Workspace routes both existing and new character builders through shells", async () => {
  const workspace = await source("app/workspace.tsx");
  assert.doesNotMatch(workspace, /import\("\.\/character-builder"\)/);
  assert.match(workspace, /import\("\.\/new-character-builder"\)/);
  assert.match(workspace, /import\("\.\/game-line-builder"\)/);
});

test("line builders own independent controllers and consume scoped catalog snapshots", async () => {
  const [mage, mageView, mageGrants, mageEligibility, magePower, mageRules, changeling, changelingView, changelingEditor, changelingGrants, changelingEligibility, changelingPower, changelingRules, shell, commonControls, meritPicker, meritEditor, commonGrants] = await Promise.all([
    source("game-lines/mage/builder.tsx"),
    source("game-lines/mage/builder-view.tsx"),
    source("game-lines/mage/builder-merit-grants.ts"),
    source("game-lines/mage/builder-eligibility.ts"),
    source("game-lines/mage/builder-power-progression.ts"),
    source("game-lines/mage/creation-rules.ts"),
    source("game-lines/changeling/builder.tsx"),
    source("game-lines/changeling/builder-view.tsx"),
    source("game-lines/changeling/builder-merit-editor.tsx"),
    source("game-lines/changeling/builder-merit-grants.ts"),
    source("game-lines/changeling/builder-eligibility.ts"),
    source("game-lines/changeling/builder-power-progression.ts"),
    source("game-lines/changeling/creation-rules.ts"),
    source("app/character-builder-shell.tsx"),
    source("app/builder/common-controls.tsx"),
    source("app/builder/merit-picker.tsx"),
    source("app/builder/merit-configuration-editor.tsx"),
    source("lib/core/character/synchronize-merit-grants.ts"),
  ]);
  const mageClosure = [mage, mageView, mageGrants, mageEligibility, magePower, mageRules].join("\n");
  const changelingClosure = [changeling, changelingView, changelingEditor, changelingGrants, changelingEligibility, changelingPower, changelingRules].join("\n");
  const commonClosure = [shell, commonControls, meritPicker, meritEditor, commonGrants].join("\n");
  assert.doesNotMatch(mage, /Component:\s*CharacterBuilder\b/);
  assert.doesNotMatch(changeling, /Component:\s*CharacterBuilder\b/);
  assert.doesNotMatch(mageClosure, /@\/app\/character-builder["']/);
  assert.doesNotMatch(changelingClosure, /@\/app\/character-builder["']/);
  assert.match(mage, /catalogs\.get<[^>]+>\("mage-spells"\)/);
  assert.match(changeling, /catalogs\.get<[^>]+>\("changeling-contracts"\)/);
  assert.doesNotMatch(mageClosure, /game-lines\/changeling|@\/lib\/changeling|@\/lib\/entitlements/);
  assert.doesNotMatch(changelingClosure, /game-lines\/mage|@\/lib\/mage/);
  assert.doesNotMatch(mageClosure, /@\/lib\/(?:creation-rules|creation-eligibility|power-progression)["']/);
  assert.doesNotMatch(changelingClosure, /@\/lib\/(?:creation-rules|creation-eligibility|power-progression)["']/);
  assert.match(shell, /useCommonBuilderState/);
  assert.doesNotMatch(shell, /MTA_PATHS|CTL_SEEMINGS|spellCatalog|contractCatalog|mage_experience_history|experience_history|Nameless Order|Corte|Ordem/);
  assert.doesNotMatch(commonClosure, /from\s+["'](?:@\/game-lines|@\/lib\/(?:mage|changeling|entitlements))/);
});

test("legacy character endpoint validates persisted IDs through the core contract", async () => {
  const route = await source("app/api/characters/route.ts");
  assert.match(route, /PERSISTED_GAME_LINE_IDS/);
  assert.doesNotMatch(route, /payload\.game_line === ["']MtA|payload\.game_line === ["']CtL/);
});

test("shared creation rules do not read Changeling catalog state", async () => {
  const creationRules = await source("lib/creation-rules.ts");
  assert.doesNotMatch(creationRules, /changeling-courts/);
});

test("catalog snapshots deeply freeze static catalog data", async () => {
  const { freezeCatalogData } = await vite.ssrLoadModule("/lib/catalog/catalog-service.ts");
  const value = freezeCatalogData([{ id: "catalog", nested: { value: 1 } }]);
  assert.ok(Object.isFrozen(value));
  assert.ok(Object.isFrozen(value[0]));
  assert.ok(Object.isFrozen(value[0].nested));
});

test("Mage and Changeling catalog group loaders request only their own catalog IDs", async () => {
  const [mageSpells, mageMerits, changelingContracts, changelingMerits] = await Promise.all([
    vite.ssrLoadModule("/game-lines/mage/catalogs/spells.ts"),
    vite.ssrLoadModule("/game-lines/mage/catalogs/merits.ts"),
    vite.ssrLoadModule("/game-lines/changeling/catalogs/contracts.ts"),
    vite.ssrLoadModule("/game-lines/changeling/catalogs/merits.ts"),
  ]);
  const mageRequests = [];
  const changelingRequests = [];
  const reader = (requests) => ({ getCatalog: async (id) => {
    requests.push(id);
    return id.endsWith("-index") ? [] : [];
  }});

  await Promise.all([
    mageSpells.mageSpellsCatalogGroup.load(reader(mageRequests)),
    mageMerits.mageMeritsCatalogGroup.load(reader(mageRequests)),
    changelingContracts.changelingContractsCatalogGroup.load(reader(changelingRequests)),
    changelingMerits.changelingMeritsCatalogGroup.load(reader(changelingRequests)),
  ]);

  assert.ok(mageRequests.every((id) => !id.includes("changeling")));
  assert.ok(changelingRequests.every((id) => !id.includes("mage")));
  assert.deepEqual(mageRequests.sort(), ["mage-spells-index", "merits-mage"].sort());
  assert.deepEqual(changelingRequests.sort(), ["changeling-contracts-index", "merits-changeling"].sort());
});

test("production manifest keeps lazy builder entry closures free of opposite line entries", async () => {
  const manifest = JSON.parse(await source("dist/client/.vite/manifest.json"));
  const closure = (rootKey) => {
    const keys = new Set();
    const visit = (key) => {
      if (keys.has(key) || !manifest[key]) return;
      keys.add(key);
      for (const imported of manifest[key].imports ?? []) visit(imported);
    };
    visit(rootKey);
    return [...keys];
  };
  const mage = closure("game-lines/mage/builder.tsx");
  const changeling = closure("game-lines/changeling/builder.tsx");
  assert.ok(mage.length > 1 && changeling.length > 1);
  assert.ok(mage.every((key) => !/game-lines\/changeling|character-builder\.tsx/.test(key)));
  assert.ok(changeling.every((key) => !/game-lines\/mage|character-builder\.tsx/.test(key)));
});
