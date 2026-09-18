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
