import assert from "node:assert/strict";
import test from "node:test";
import { readFile, stat } from "node:fs/promises";

const root = new URL("../", import.meta.url);
const readJson = async (path) => JSON.parse(await readFile(new URL(path, root), "utf8"));

test("catalog manifest resolves every independently versioned static resource", async () => {
  const manifest = await readJson("public/data/manifest.json");
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
  const index = await readJson("public/data/mage/spells/index.json");
  const shards = [...new Set(index.map((item) => item.shard))];
  const records = (await Promise.all(shards.map((name) => readJson(`public/data/mage/spells/${name}.json`)))).flat();
  assert.equal(index.length, 360);
  assert.deepEqual(new Set(records.map((item) => item.id)), new Set(index.map((item) => item.id)));
});

test("contract index and source shards preserve the same unique IDs", async () => {
  const index = await readJson("public/data/changeling/contracts/index.json");
  const shards = [...new Set(index.map((item) => item.shard))];
  const records = (await Promise.all(shards.map((name) => readJson(`public/data/changeling/contracts/${name}.json`)))).flat();
  assert.equal(records.filter((item) => !item.sourceId.startsWith("h-")).length, 180);
  assert.deepEqual(new Set(records.map((item) => item.id)), new Set(index.map((item) => item.id)));
});

test("merit index and game-line shards preserve all catalog rows", async () => {
  const index = await readJson("public/data/core/merits/index.json");
  const records = (await Promise.all(["core", "changeling", "mage"].map((name) => readJson(`public/data/core/merits/${name}.json`)))).flat();
  assert.equal(records.length, 354);
  assert.deepEqual(new Set(records.map((item) => item.id)), new Set(index.map((item) => item.id)));
});

test("Changeling reference catalogs preserve audited record counts", async () => {
  const [coreConditions, corePresentation, conditions, conditionPresentation, courts, entitlements, kiths] = await Promise.all([
    readJson("public/data/core/conditions.json"),
    readJson("public/data/core/conditions-pt.json"),
    readJson("public/data/changeling/conditions.json"),
    readJson("public/data/changeling/conditions-pt.json"),
    readJson("public/data/changeling/courts.json"),
    readJson("public/data/changeling/entitlements.json"),
    readJson("public/data/changeling/kiths.json"),
  ]);
  assert.equal(coreConditions.length, 34);
  assert.equal(conditions.length, 32);
  assert.equal(Object.keys(corePresentation).length + Object.keys(conditionPresentation).length, 66);
  assert.equal(courts.length, 35);
  assert.equal(entitlements.length, 27);
  assert.equal(kiths.length, 85);
});
