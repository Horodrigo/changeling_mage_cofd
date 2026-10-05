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
  const paths = ["shared/data/merits.json", "game-lines/changeling/data/merits.json", "game-lines/mage/data/merits.json"];
  const catalogs = (await Promise.all(paths.map(path => json(new URL(`../public/${path}`, import.meta.url))))).flat();
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

test("Changeling Merit descriptions retain the audited mechanical details", async () => {
  const merits = await json(new URL("../public/game-lines/changeling/data/merits.json", import.meta.url));
  const requiredDetails = {
    "ctl-2ed:acute-senses": /total darkness/,
    "ctl-2ed:arcadian-metabolism": /Aggravated damage healing is unchanged/,
    "ctl-2ed:brownie-s-boon": /one-eighth/,
    "ctl-2ed:cloak-of-leaves": /physical Tilts/,
    "ctl-2ed:cold-hearted": /Once per scene/,
    "ctl-2ed:court-goodwill": /both ratings fall by one until reparations/,
    "ctl-2ed:diviner": /Gate of Ivory or Horn/,
    "ctl-2ed:dream-warrior": /directly affect the fight/,
    "ctl-2ed:faerie-favor": /Sanctity of Merits/,
    "ctl-2ed:gentrified-bearing": /maximum of \+5 dice/,
    "ctl-2ed:goblin-bounty": /safely stored/,
    "ctl-2ed:hedge-brawler": /cannot turn a normal success into an exceptional success/,
    "ctl-2ed:hedge-sense": /Icons, food, shelter, or goblin fruit/,
    "ctl-2ed:hob-kin": /Hob Alarm/,
    "ctl-2ed:lethal-mien": /activate or suppress/,
    "ctl-2ed:manymask": /height and build remain fixed/,
    "ctl-2ed:noblesse-oblige": /Spring adds Initiative/,
    "ctl-2ed:parallel-lives": /Gain a Beat/,
    "ctl-2ed:token": /oath-forged token/,
    "ctl-2ed:touchstone": /final box/,
    "ctl-the-hedge:frightful-incantation": /cannot replace a hecatomb that consists of an action/,
    "ctl-the-hedge:hedge-sorcerer": /Unopened Doors impose Frailties/,
    "ctl-the-hedge:magic-dreams": /dreamer remains asleep/,
    "ctl-hedge:motley-awareness": /only another three-dot owner can reply/,
    "de2:librarian": /who possesses it/,
    "de2:oath-blood-liege": /Oathbreaker/,
    "h-courts:improvised-ritual": /cannot create missing ingredients/,
    "h-courts:ice-water-veins": /unless the harvested emotion is sorrow/,
  };

  const byId = new Map(merits.map((merit) => [merit.id, merit]));
  for (const [id, pattern] of Object.entries(requiredDetails)) {
    const merit = byId.get(id);
    assert.ok(merit, id);
    assert.match(merit.description, pattern, id);
    assert.equal(merit.descriptionEn, merit.description, `${id}: English canonical text drifted`);
  }
});

test("Changeling static identity catalogs use unique IDs and retain source metadata", async () => {
  const files = [
    "../public/game-lines/changeling/data/kiths.json",
    "../public/game-lines/changeling/data/courts.json",
    "../public/game-lines/changeling/data/entitlements.json",
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
  const items = await json(new URL("../public/game-lines/changeling/data/tokens.json", import.meta.url));
  const presentation = await json(new URL("../public/game-lines/changeling/data/tokens-pt.json", import.meta.url));
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
  assert.deepEqual(presentation.map((item) => item.id).sort(), items.map((item) => item.id).sort());
  for (const canonical of items) {
    const localized = presentation.find((item) => item.id === canonical.id);
    for (const field of ["name", "effect", "description", "crux", "catch", "drawback"].filter((field) => canonical[field])) {
      assert.ok(localized?.[field]?.trim(), `${canonical.id}.${field}`);
    }
  }
  assert.doesNotMatch(JSON.stringify(presentation), /\b(?:Wyrd|Huntsm(?:an|en)|Berserk|Swooned|Spooked|Gentry|Darklings|Beasts|Ogres|Wizened|Elementals|Fairest|trifles?)\b/i);
  assert.doesNotMatch(JSON.stringify(presentation), /\bBeats?\b/);
  assert.doesNotMatch(JSON.stringify(presentation), /\bAutocontrole\b|Semblante Fae/);
  assert.equal(presentation.find((item) => item.id === "ctl-2ed:golden-hairnettle")?.name, "Erva de Cachinhos Dourados");
  assert.equal(presentation.find((item) => item.id === "ctl-2ed:iou")?.name, "Nota Promissória");
  assert.equal(presentation.find((item) => item.id === "ctl-oak-ash-thorn:seeming-song")?.name, "Canção da Feição");
});

test("apresentações pt-BR de Changeling respeitam o léxico definido", async () => {
  const files = [
    "../public/game-lines/changeling/data/conditions-pt.json",
    "../public/game-lines/changeling/data/kiths-pt.json",
    "../public/game-lines/changeling/data/tokens-pt.json",
  ];
  const contracts = (await jsonFiles(new URL("../public/game-lines/changeling/data/contracts/", import.meta.url)))
    .filter((catalog) => !Array.isArray(catalog));
  const courts = await json(new URL("../public/game-lines/changeling/data/courts.json", import.meta.url));
  const localizedCourts = courts.flatMap((court) => [court.translatedName, court.emotionPt, ...(court.mantleBenefitsPt ?? [])]);
  const text = JSON.stringify([...(await Promise.all(files.map((file) => json(new URL(file, import.meta.url))))), ...contracts, localizedCourts]);

  assert.doesNotMatch(text, /\b(?:Wyrd|Bedlam|Kenning|Hedgespinning|Token|Clarity|Mask|Seeming|Kith|Faerie|Goblin Debt)\b/);
  assert.doesNotMatch(text, /\b(?:Clareza|Fratria|Recanto)\b|Dívida Goblin|Feudos? Livres?|Semblante Fae/);
  assert.deepEqual(courts.slice(0,4).map((court) => court.translatedName), ["Corte da Primavera","Corte do Verão","Corte do Outono","Corte do Inverno"]);
});

test("Changeling contract shards have globally unique IDs and required structural fields", async () => {
  const directory = new URL("../public/game-lines/changeling/data/contracts/", import.meta.url);
  const contracts = (await jsonFiles(directory)).filter(Array.isArray).flat();
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

test("approved Agony & Ecstasy prerequisites match the visually reviewed source pages", async () => {
  const merits = await json(new URL("../public/game-lines/vampire/data/merits.json", import.meta.url));
  for (const [slug, skill, page] of [["uncaged-indulgence", "Expression", 72], ["unconscious-alignment", "Academics", 74]]) {
    const merit = merits.find(item => item.id === `h-vtr-agony-ecstasy:${slug}`);
    assert.equal(merit.sourceId, "h-vtr-agony-ecstasy");
    assert.equal(merit.prerequisites, `Circle of the Crone Status ••; ${skill} ••`);
    assert.equal(merit.page, page);
    assert.equal(merit.descriptivePrerequisites, undefined);
  }
});

test("Mage spell index entries are unique and point at a stable source shard", async () => {
  const index = await json(new URL("../public/game-lines/mage/data/spells/index.json", import.meta.url));
  const ids = index.map((item) => item.id);

  assert.equal(new Set(ids).size, ids.length, "Mage spell index IDs must be unique");
  for (const entry of index) {
    assert.ok(entry.id, "spell index entry missing id");
    assert.ok(entry.shard, `${entry.id}: missing shard locator`);
  }
});
