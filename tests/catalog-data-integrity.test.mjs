import assert from "node:assert/strict";
import test from "node:test";
import { readFile, readdir } from "node:fs/promises";

const json = async (url) => JSON.parse(await readFile(url, "utf8"));

async function jsonFiles(directoryUrl) {
  const names = (await readdir(directoryUrl)).filter(
    (name) => name.endsWith(".json") && name !== "index.json",
  );
  return Promise.all(names.map((name) => json(new URL(name, directoryUrl))));
}

test("static Merit catalogs have stable IDs, valid ratings and known line ownership", async () => {
  const directory = new URL("../public/data/core/merits/", import.meta.url);
  const catalogs = (await jsonFiles(directory)).flat();
  const ids = catalogs.map((item) => item.id);

  assert.equal(new Set(ids).size, ids.length, "Merit IDs must be globally unique");

  for (const merit of catalogs) {
    assert.ok(merit.id, "Merit missing id");
    assert.ok(merit.name, merit.id);
    assert.ok(["Core", "CtL", "MtA"].includes(merit.line), `${merit.id}: unexpected line`);
    assert.ok(Array.isArray(merit.ratings) && merit.ratings.length > 0, `${merit.id}: ratings`);
    assert.ok(merit.ratings.every((rating) => Number.isInteger(rating) && rating > 0), merit.id);
  }
});

test("Changeling static identity catalogs use unique IDs and retain source metadata", async () => {
  const files = [
    "../public/data/changeling/kiths.json",
    "../public/data/changeling/courts.json",
    "../public/data/changeling/entitlements.json",
  ];

  for (const file of files) {
    const items = await json(new URL(file, import.meta.url));
    const ids = items.map((item) => item.id);

    assert.equal(new Set(ids).size, ids.length, `${file}: duplicate IDs`);
    for (const item of items) {
      assert.ok(item.id, `${file}: missing id`);
      assert.ok(item.name || item.originalName, `${file}: ${item.id} missing name`);
      assert.ok(item.sourceId || item.source, `${file}: ${item.id} missing source`);
    }
  }
});

test("Changeling Token catalog contains editable Token, Trifle, and Bauble text", async () => {
  const items = await json(new URL("../public/data/changeling/tokens.json", import.meta.url));
  const counts = Object.groupBy(items, (item) => item.kind);

  assert.deepEqual(
    Object.fromEntries(Object.entries(counts).map(([kind, values]) => [kind, values.length])),
    { token: 16, trifle: 6, bauble: 5 },
  );
  assert.deepEqual(
    Object.fromEntries(Object.entries(Object.groupBy(items, (item) => item.sourceId)).map(([source, values]) => [source, values.length])),
    { "ctl-2ed": 14, de2: 2, "ctl-oak-ash-thorn": 11 },
  );
  assert.equal(new Set(items.map((item) => item.id)).size, items.length);
  assert.equal(items.some((item) => item.name === "Hedgespun Item"), false);
  for (const item of items) {
    assert.ok(item.name && item.sourceId && item.source && item.page > 0, item.id);
    assert.ok(Number.isInteger(item.rating) && item.rating > 0, `${item.id}: rating`);
    if (item.kind === "token") assert.ok(item.effect && item.catch && item.drawback, item.id);
    if (item.kind === "trifle") assert.ok(item.effect, item.id);
    if (item.kind === "bauble") assert.ok(item.description && item.crux && item.catch, item.id);
  }
});

test("Changeling contract shards have globally unique IDs and required structural fields", async () => {
  const directory = new URL("../public/data/changeling/contracts/", import.meta.url);
  const contracts = (await jsonFiles(directory)).flat();
  const ids = contracts.map((item) => item.id);

  assert.equal(new Set(ids).size, ids.length, "Contract IDs must be globally unique");

  for (const contract of contracts) {
    assert.ok(contract.id, "missing contract id");
    assert.ok(contract.originalName || contract.name, contract.id);
    assert.ok(contract.description, `${contract.id}: missing description`);
    assert.ok(contract.sourceId, `${contract.id}: missing sourceId`);
    assert.ok(contract.source, `${contract.id}: missing source`);
    assert.ok(Number.isInteger(contract.page) && contract.page > 0, `${contract.id}: invalid page`);
  }
});

test("Mage spell index entries are unique and point at a stable source shard", async () => {
  const index = await json(new URL("../public/data/mage/spells/index.json", import.meta.url));
  const ids = index.map((item) => item.id);

  assert.equal(new Set(ids).size, ids.length, "Mage spell index IDs must be unique");
  for (const entry of index) {
    assert.ok(entry.id, "spell index entry missing id");
    assert.ok(entry.shard, `${entry.id}: missing shard locator`);
  }
});
