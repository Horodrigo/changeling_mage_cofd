import assert from "node:assert/strict";
import test, { after, beforeEach } from "node:test";
import { fileURLToPath } from "node:url";
import { createServer } from "vite";

const root = fileURLToPath(new URL("..", import.meta.url));
const vite = await createServer({ appType: "custom", configFile: false, root,
  resolve: { alias: { "@": root } }, server: { middlewareMode: true, hmr: false } });
after(() => vite.close());
const { CharacterCollectionStore } = await vite.ssrLoadModule("/lib/character-collection-store.ts");

const KEY = "arquivo-das-trevas:v2:user";
let local, idb;

function fakeLocalStorage() {
  const values = new Map();
  return { values, writes: [], getItem(k) { return values.has(k) ? values.get(k) : null; },
    setItem(k, v) { this.writes.push(k); values.set(k, String(v)); }, removeItem(k) { values.delete(k); } };
}

/** Minimal IndexedDB: values are cloned on put, commits are asynchronous and can be held or failed. */
function fakeIndexedDB(databases = new Map()) {
  const state = { databases, log: [], hold: false, held: [], failNext: false, failStores: new Set() };
  state.open = (name) => {
    const request = {};
    queueMicrotask(() => {
      let stores = databases.get(name); const created = !stores;
      if (!stores) { stores = new Map(); databases.set(name, stores); }
      request.result = {
        objectStoreNames: { contains: (store) => stores.has(store) },
        createObjectStore: (store) => stores.set(store, new Map()),
        close() {},
        transaction(names, mode) {
          const ops = []; const tx = {};
          tx.objectStore = (store) => ({
            get(key) { return { result: structuredClone(stores.get(store).get(key)) }; },
            put(value, key) { const copy = structuredClone(value); state.log.push(["put", store, key]);
              ops.push(() => stores.get(store).set(key, copy)); return {}; },
            delete(key) { state.log.push(["delete", store, key]); ops.push(() => stores.get(store).delete(key)); return {}; },
          });
          const commit = () => {
            const touched = [names].flat();
            if (mode === "readwrite" && touched.some((name) => state.failStores.has(name))) {
              tx.error = new Error("cleanup"); (tx.onabort ?? tx.onerror)?.(); return; }
            if (mode === "readwrite" && state.failNext) { state.failNext = false; tx.error = new Error("quota");
              (tx.onabort ?? tx.onerror)?.(); return; }
            for (const op of ops) op();
            tx.oncomplete?.();
          };
          setTimeout(() => mode === "readwrite" && state.hold ? state.held.push(commit) : commit(), 0);
          return tx;
        },
      };
      if (created) request.onupgradeneeded?.();
      request.onsuccess();
    });
    return request;
  };
  return state;
}

function install(databases) {
  idb = fakeIndexedDB(databases);
  globalThis.indexedDB = { open: idb.open };
}

beforeEach(() => {
  local = fakeLocalStorage();
  globalThis.localStorage = local;
  install();
});
after(() => { delete globalThis.localStorage; delete globalThis.indexedDB; });

const portrait = { dataUrl: "data:image/png;base64," + "A".repeat(2000), fileName: "p.png", mimeType: "image/png" };
const sheet = (id, name, extra = {}) => ({ id, schema_version: 2, character: { name, concept: "", player: "" }, ...extra });
const tick = () => new Promise((resolve) => setTimeout(resolve, 5));

async function migratedStore(options) {
  const opaque = { schema_version: 1, nome: "antigo" };
  const withPortrait = sheet("a", "Ana");
  withPortrait.character.portrait = portrait;
  local.values.set(KEY, JSON.stringify([withPortrait, sheet("b", "Bia"), opaque]));
  const store = new CharacterCollectionStore(KEY, options);
  const loaded = await store.load();
  return { store, loaded };
}

test("migrates the single-value collection into per-character records and keeps it self-contained", async () => {
  const { loaded } = await migratedStore();
  assert.equal(loaded.length, 3);
  assert.deepEqual(loaded[0].character.portrait, portrait);
  assert.deepEqual(loaded[2], { schema_version: 1, nome: "antigo" });
  assert.equal(local.values.has(KEY), false, "localStorage copy is removed after commit");
  const records = idb.databases.get("arquivo-das-trevas-characters").get("records");
  assert.equal(records.size, 3);
  assert.equal(records.get(`${KEY}\u0001id:a`).value.character.portrait, undefined, "portrait is stored separately");

  const reloaded = await new CharacterCollectionStore(KEY).load();
  assert.deepEqual(reloaded, loaded, "reload reassembles identical values, including opaque ones");
});

test("an unrelated edit writes only that character, never portraits, manifest or localStorage", async () => {
  const { store, loaded } = await migratedStore();
  idb.log.length = 0; local.writes.length = 0;
  const edited = { ...loaded[0], character: { ...loaded[0].character, concept: "x" } };
  store.update([edited, loaded[1], loaded[2]]);
  store.update([{ ...edited, updated_at: "2" }, loaded[1], loaded[2]]);
  await store.flush();
  assert.deepEqual(idb.log, [["put", "records", `${KEY}\u0001id:a`]]);
  assert.deepEqual(local.writes, []);
  const reloaded = await new CharacterCollectionStore(KEY).load();
  assert.equal(reloaded[0].character.concept, "x");
  assert.deepEqual(reloaded[0].character.portrait, portrait);
});

test("portrait changes and removal write the portrait store; deletion removes records", async () => {
  const { store, loaded } = await migratedStore();
  idb.log.length = 0;
  const changed = { ...loaded[0], character: { ...loaded[0].character, portrait: { ...portrait, fileName: "q.png" } } };
  store.update([changed, loaded[1], loaded[2]]);
  await store.flush();
  assert.ok(idb.log.some(([op, s]) => op === "put" && s === "portraits"));
  idb.log.length = 0;
  store.update([loaded[1], loaded[2]]);
  await store.flush();
  assert.deepEqual(idb.log.map(([op, s]) => `${op}:${s}`).sort(), ["delete:portraits", "delete:records", "put:manifests"]);
  const reloaded = await new CharacterCollectionStore(KEY).load();
  assert.deepEqual(reloaded.map((item) => item.id ?? item.nome), ["b", "antigo"]);
});

test("pagehide checkpoint journals only uncommitted characters and recovers after an interrupted commit", async () => {
  const { store, loaded } = await migratedStore();
  const databases = idb.databases;
  idb.hold = true;
  const edited = { ...loaded[1], character: { ...loaded[1].character, name: "Bia 2" } };
  const added = sheet("c", "Cris");
  store.update([added, loaded[0], edited, loaded[2]]);
  store.checkpoint();
  const journal = JSON.parse(local.values.get(`${KEY}:journal`));
  assert.deepEqual(journal.upserts.map(([key]) => key).sort(), ["id:b", "id:c"]);
  assert.equal(local.values.has(KEY), false, "no full collection snapshot");
  await tick();
  assert.equal(idb.held.length, 1, "flush started but the page died before commit");

  install(databases); // new page, the held commit never ran
  const recovered = await new CharacterCollectionStore(KEY).load();
  assert.deepEqual(recovered.map((item) => item.id ?? item.nome), ["c", "a", "b", "antigo"]);
  assert.equal(recovered[2].character.name, "Bia 2");
  assert.deepEqual(recovered[1].character.portrait, portrait);
  assert.equal(local.values.has(`${KEY}:journal`), false, "journal is cleared after recovery commits");
});

test("write failures are explicit and the changes stay pending for retry", async () => {
  const errors = [];
  const { store, loaded } = await migratedStore({ onError: (error) => errors.push(error) });
  idb.failNext = true;
  const edited = { ...loaded[1], character: { ...loaded[1].character, name: "B" } };
  store.update([loaded[0], edited, loaded[2]]);
  await assert.rejects(store.flush(), /quota/);
  assert.equal(errors.length, 1);
  await store.flush();
  const reloaded = await new CharacterCollectionStore(KEY).load();
  assert.equal(reloaded[1].character.name, "B");
});

test("a removal after a pending edit is not resurrected by the queued write", async () => {
  const { store, loaded } = await migratedStore();
  store.update([{ ...loaded[0], updated_at: "late" }, loaded[1], loaded[2]]);
  store.update([loaded[1], loaded[2]]);
  await store.flush();
  const reloaded = await new CharacterCollectionStore(KEY).load();
  assert.deepEqual(reloaded.map((item) => item.id ?? item.nome), ["b", "antigo"]);
  assert.equal(idb.databases.get("arquivo-das-trevas-characters").get("records").has(`${KEY}\u0001id:a`), false);
});

test("without IndexedDB the old single-value path is kept, without per-update staging", async () => {
  delete globalThis.indexedDB;
  local.values.set(KEY, JSON.stringify([sheet("a", "Ana")]));
  const store = new CharacterCollectionStore(KEY);
  const loaded = await store.load();
  assert.equal(store.currentMode, "legacy");
  local.writes.length = 0;
  store.update([{ ...loaded[0], updated_at: "1" }]);
  assert.deepEqual(local.writes, [], "update itself does not touch localStorage");
  store.checkpoint();
  assert.ok(local.writes.includes(`${KEY}:pending-write`));
  await store.flush().catch(() => {});
});

test("migration deletes the legacy IndexedDB value so removed portraits are not retained", async () => {
  const withPortrait = sheet("a", "Ana");
  withPortrait.character.portrait = portrait;
  const legacyStore = new Map([[KEY, [withPortrait, sheet("b", "Bia")]]]);
  const databases = new Map([["arquivo-das-trevas", new Map([["key-value", legacyStore], ["catalogs", new Map()]])]]);
  install(databases);
  local.values.set(KEY, JSON.stringify([withPortrait, sheet("b", "Bia")]));
  local.values.set(`${KEY}:pending-write`, JSON.stringify([withPortrait, sheet("b", "Bia")]));
  const store = new CharacterCollectionStore(KEY);
  const loaded = await store.load();
  assert.deepEqual(loaded[0].character.portrait, portrait);
  assert.equal(legacyStore.has(KEY), false, "legacy IndexedDB value deleted after migration commit");
  assert.equal(local.values.has(KEY), false);
  assert.equal(local.values.has(`${KEY}:pending-write`), false);

  const withoutPortrait = { ...loaded[0], character: { ...loaded[0].character } };
  delete withoutPortrait.character.portrait;
  store.update([withoutPortrait, loaded[1]]);
  await store.flush();
  const portraits = databases.get("arquivo-das-trevas-characters").get("portraits");
  assert.equal(portraits.size, 0, "removed portrait is deleted from the local database");
  const serialized = JSON.stringify([...databases].map(([, stores]) => [...stores].map(([, m]) => [...m])));
  assert.equal(serialized.includes(portrait.dataUrl), false, "no copy of the removed portrait remains");
  const reloaded = await new CharacterCollectionStore(KEY).load();
  assert.equal(reloaded[0].character.portrait, undefined);
});

test("failed legacy cleanup is reported, never resurrected, and retried idempotently", async () => {
  const legacyStore = new Map([[KEY, [sheet("a", "Ana"), sheet("b", "Bia")]]]);
  const databases = new Map([["arquivo-das-trevas", new Map([["key-value", legacyStore], ["catalogs", new Map()]])]]);
  install(databases);
  idb.failStores.add("key-value");
  const errors = [];
  const store = new CharacterCollectionStore(KEY, { onError: (error) => errors.push(error) });
  const loaded = await store.load();
  assert.equal(store.currentMode, "indexeddb");
  assert.equal(errors.length, 1, "cleanup failure is surfaced");
  assert.equal(legacyStore.has(KEY), true);
  store.update([loaded[1]]);
  await store.flush();

  install(databases);
  const reloaded = await new CharacterCollectionStore(KEY).load();
  assert.deepEqual(reloaded.map((item) => item.id), ["b"], "the old value does not resurrect a deleted character");
  assert.equal(legacyStore.has(KEY), false, "cleanup retried on the next load");
  install(databases);
  assert.deepEqual((await new CharacterCollectionStore(KEY).load()).map((item) => item.id), ["b"]);
});
