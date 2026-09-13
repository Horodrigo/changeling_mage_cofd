import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const source = (path) => readFile(`${root}/${path}`, "utf8");

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

test("persistence is independent of app components", async () => {
  const persistence = await source("lib/character-persistence.ts");
  assert.doesNotMatch(persistence, /from\s+["'][^"']*app\//);
});
