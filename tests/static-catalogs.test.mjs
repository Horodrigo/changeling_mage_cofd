import assert from "node:assert/strict";
import test from "node:test";
import { readFile, stat } from "node:fs/promises";

const root = new URL("../", import.meta.url);
const readJson = async (path) => JSON.parse(await readFile(new URL(path, root), "utf8"));

test("catalog manifest resolves every independently versioned static resource", async () => {
  const manifest = await readJson("public/shared/data/catalog-manifest.json");
  assert.equal(manifest.schemaVersion, 1);
  assert.ok(manifest.catalogVersion > 0);
  for (const [key, entry] of Object.entries(manifest.catalogs)) {
    assert.ok(entry.version > 0, key);
    const file = new URL(`public${entry.url}`, root);
    assert.ok((await stat(file)).size > 0, key);
    JSON.parse(await readFile(file, "utf8"));
  }
});

test("spell index and Arcana shards preserve the same unique IDs", async () => {
  const index = await readJson("public/game-lines/mage/data/spells/index.json");
  const shards = [...new Set(index.map((item) => item.shard))];
  const records = (await Promise.all(shards.map((name) => readJson(`public/game-lines/mage/data/spells/${name}.json`)))).flat();
  assert.equal(index.length, 360);
  assert.deepEqual(new Set(records.map((item) => item.id)), new Set(index.map((item) => item.id)));
});

test("contract source shards preserve unique IDs", async () => {
  const shards = ["h-courts", "ctl-oak-ash-thorn", "ctl-the-hedge", "ctl-dark-eras", "ctl-kith-and-kin", "ctl-core"];
  const records = (await Promise.all(shards.map((name) => readJson(`public/game-lines/changeling/data/contracts/${name}.json`)))).flat();
  assert.equal(records.filter((item) => !item.sourceId.startsWith("h-")).length, 180);
  assert.equal(new Set(records.map((item) => item.id)).size, records.length);
});

test("merit index and game-line shards preserve all catalog rows", async () => {
  const index = await readJson("public/shared/data/merits-index.json");
  const paths = ["shared/data/merits.json", "game-lines/changeling/data/merits.json", "game-lines/mage/data/merits.json"];
  const records = (await Promise.all(paths.map(path => readJson(`public/${path}`)))).flat();
  assert.equal(records.length, 423);
  assert.deepEqual(new Set(records.map((item) => item.id)), new Set(index.map((item) => item.id)));
});

test("Changeling reference catalogs preserve audited record counts", async () => {
  const [coreConditions, corePresentation, conditions, conditionPresentation, courts, entitlements, kiths] = await Promise.all([
    readJson("public/shared/data/conditions.json"),
    readJson("public/shared/data/conditions-pt.json"),
    readJson("public/game-lines/changeling/data/conditions.json"),
    readJson("public/game-lines/changeling/data/conditions-pt.json"),
    readJson("public/game-lines/changeling/data/courts.json"),
    readJson("public/game-lines/changeling/data/entitlements.json"),
    readJson("public/game-lines/changeling/data/kiths.json"),
  ]);
  assert.equal(coreConditions.length, 34);
  assert.equal(conditions.length, 32);
  assert.equal(Object.keys(corePresentation).length + Object.keys(conditionPresentation).length, 66);
  assert.equal(courts.length, 35);
  assert.equal(entitlements.length, 27);
  assert.equal(kiths.length, 85);
});
