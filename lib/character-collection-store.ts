import type { StoredCharacter } from "./stored-character";
import { storedCharacterId } from "./stored-character";
import {
  deleteDeviceValue,
  getDeviceValue,
  setDeviceValue,
  stageDeviceValue,
} from "./device-storage";

/**
 * Per-character browser persistence for the stored character collection.
 *
 * Each character is an independent IndexedDB record, portraits live in a
 * separate store, and a small manifest preserves collection order. Edits are
 * coalesced and only changed records are written, so an unrelated edit never
 * rewrites other characters or an unchanged portrait. The record format is
 * storage-internal: loaded values are reassembled into the exact persisted
 * character shape, so import/export remain self-contained.
 *
 * A dedicated database is used so the shared key-value/catalog database
 * version does not change. The previous single-value collection under the
 * same storage key is migrated once; only after the per-record transaction
 * (including the manifest) commits are its IndexedDB value and localStorage
 * copies deleted, so removed characters/portraits do not survive in a backup.
 * Once a manifest exists the old value is never read again; cleanup is
 * retried idempotently on later loads until it succeeds.
 */
const DATABASE_NAME = "arquivo-das-trevas-characters";
const DATABASE_VERSION = 1;
const RECORDS = "records";
const PORTRAITS = "portraits";
const MANIFESTS = "manifests";
const FORMAT = 1;
const DEBOUNCE_MS = 400;
const MAX_WAIT_MS = 2000;

type Manifest = { format: number; slots: string[] };
type StoredRecord = { value: unknown; portrait: boolean };
type Slot = { key: string; value: StoredCharacter };
type JournalPortrait = { kind: "same" } | { kind: "none" } | { kind: "set"; value: unknown };
type Journal = {
  format: number;
  order: string[];
  upserts: Array<[string, unknown, JournalPortrait]>;
  deletes: string[];
};

export type CharacterStoreMode = "indexeddb" | "legacy" | "disabled";

export type CharacterCollectionStoreOptions = {
  /** Called for every failed background write or checkpoint. */
  onError?: (error: unknown) => void;
  /** Called after pending changes were committed. */
  onSaved?: () => void;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function splitPortrait(value: unknown): { record: unknown; portrait: unknown } {
  if (!isRecord(value) || !isRecord(value.character) || value.character.portrait === undefined)
    return { record: value, portrait: undefined };
  const { portrait, ...character } = value.character;
  return { record: { ...value, character }, portrait };
}

export function joinPortrait(record: unknown, portrait: unknown): unknown {
  if (portrait === undefined || !isRecord(record) || !isRecord(record.character)) return record;
  return { ...record, character: { ...record.character, portrait } };
}

function samePortrait(a: unknown, b: unknown) {
  if (a === b) return true;
  if (!isRecord(a) || !isRecord(b)) return false;
  return a.dataUrl === b.dataUrl && a.fileName === b.fileName && a.mimeType === b.mimeType &&
    Object.keys(a).length === Object.keys(b).length;
}

function newSlotKey() {
  const random = typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
    ? crypto.randomUUID()
    : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
  return `item:${random}`;
}

/** Assigns stable slot keys: same reference first, then same character ID. */
export function assignSlots(previous: readonly Slot[], next: readonly StoredCharacter[]): Slot[] {
  const byReference = new Map<unknown, string[]>();
  const byId = new Map<string, string[]>();
  for (const slot of previous) {
    byReference.set(slot.value, [...(byReference.get(slot.value) ?? []), slot.key]);
    const id = storedCharacterId(slot.value);
    if (id) byId.set(id, [...(byId.get(id) ?? []), slot.key]);
  }
  const taken = new Set<string>();
  const reserved = new Set(previous.map((slot) => slot.key));
  const pick = (keys: string[] | undefined) => keys?.find((key) => !taken.has(key));
  const keys: Array<string | undefined> = next.map((value) => {
    const key = pick(byReference.get(value));
    if (key) taken.add(key);
    return key;
  });
  return next.map((value, index) => {
    let key = keys[index];
    if (!key) {
      const id = storedCharacterId(value);
      key = id ? pick(byId.get(id)) : undefined;
      if (!key && id && !reserved.has(`id:${id}`) && !taken.has(`id:${id}`)) key = `id:${id}`;
      if (!key) do key = newSlotKey(); while (taken.has(key) || reserved.has(key));
    }
    taken.add(key);
    return { key, value };
  });
}

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DATABASE_NAME, DATABASE_VERSION);
    request.onupgradeneeded = () => {
      const database = request.result;
      for (const name of [RECORDS, PORTRAITS, MANIFESTS])
        if (!database.objectStoreNames.contains(name)) database.createObjectStore(name);
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error("IndexedDB unavailable."));
  });
}

function transactionDone(transaction: IDBTransaction) {
  return new Promise<void>((resolve, reject) => {
    transaction.oncomplete = () => resolve();
    transaction.onabort = transaction.onerror = () =>
      reject(transaction.error ?? new Error("Character storage transaction failed."));
  });
}


function readJournal(key: string): Journal | null {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return null;
    const parsed = JSON.parse(raw) as Journal;
    return parsed && parsed.format === FORMAT && Array.isArray(parsed.order) ? parsed : null;
  } catch {
    return null;
  }
}

export class CharacterCollectionStore {
  readonly storageKey: string;
  private readonly options: CharacterCollectionStoreOptions;
  private mode: CharacterStoreMode = "disabled";
  private loaded = false;
  private database: Promise<IDBDatabase> | null = null;
  private slots: Slot[] = [];
  /** Portrait value currently committed per slot. */
  private committedPortraits = new Map<string, unknown>();
  private pending = new Map<string, StoredCharacter>();
  private pendingDeletes = new Set<string>();
  private orderDirty = false;
  private inflight: { upserts: Map<string, StoredCharacter>; deletes: Set<string> } | null = null;
  private flushing: Promise<void> | null = null;
  private timer: ReturnType<typeof setTimeout> | null = null;
  private firstPendingAt = 0;
  private hasJournal = false;
  private legacyDirty = false;

  constructor(storageKey: string, options: CharacterCollectionStoreOptions = {}) {
    this.storageKey = storageKey;
    this.options = options;
  }

  get currentMode() { return this.mode; }

  private get journalKey() { return `${this.storageKey}:journal`; }
  private recordKey(slot: string) { return `${this.storageKey}\u0001${slot}`; }

  private db() {
    this.database ??= openDatabase();
    return this.database;
  }

  /** Loads the collection, recovering an interrupted checkpoint or migrating the old single value. */
  async load(): Promise<StoredCharacter[]> {
    if (typeof indexedDB === "undefined") return this.loadLegacy();
    let database: IDBDatabase;
    try {
      database = await this.db();
    } catch {
      this.database = null;
      return this.loadLegacy();
    }
    const manifest = await this.readMany<Manifest>(database, MANIFESTS, [this.storageKey]).then((items) => items[0]);
    if (manifest && Array.isArray(manifest.slots)) {
      const keys = manifest.slots.filter((key): key is string => typeof key === "string");
      const records = await this.readMany<StoredRecord>(database, RECORDS, keys.map((key) => this.recordKey(key)));
      const withPortrait = keys.filter((_, index) => records[index]?.portrait);
      const portraits = await this.readMany<unknown>(database, PORTRAITS, withPortrait.map((key) => this.recordKey(key)));
      withPortrait.forEach((key, index) => {
        if (portraits[index] !== undefined) this.committedPortraits.set(key, portraits[index]);
      });
      this.slots = keys.flatMap((key, index) => {
        const record = records[index];
        return record ? [{ key, value: joinPortrait(record.value, this.committedPortraits.get(key)) }] : [];
      });
      this.mode = "indexeddb";
      this.loaded = true;
      await this.removeLegacyValue();
      this.applyJournal();
      // A failed recovery write is reported through onError; the journal is kept.
      if (this.hasPendingWork()) await this.flush().catch(() => {});
      return this.slots.map((slot) => slot.value);
    }

    const legacy = await getDeviceValue<StoredCharacter[]>(this.storageKey);
    const collection = Array.isArray(legacy) ? legacy : [];
    this.mode = "indexeddb";
    this.loaded = true;
    this.slots = assignSlots([], collection);
    for (const slot of this.slots) this.pending.set(slot.key, slot.value);
    // Always write a manifest so the old value is never read again.
    this.orderDirty = true;
    this.applyJournal();
    if (this.hasPendingWork()) {
      try {
        await this.flush();
        await this.removeLegacyValue();
      } catch {
        // Keep the old copies and continue with the old single-value path.
        this.mode = "legacy";
        this.clearPending();
        this.legacyDirty = this.hasJournal;
      }
    }
    return this.slots.map((slot) => slot.value);
  }

  /** Deletes the migrated single-value collection; failures are reported and retried on the next load. */
  private async removeLegacyValue() {
    try {
      await deleteDeviceValue(this.storageKey);
    } catch (error) {
      this.options.onError?.(error);
    }
  }

  /** Issues every get synchronously in one transaction, so it cannot auto-commit early. */
  private readMany<T>(database: IDBDatabase, store: string, keys: string[]): Promise<Array<T | undefined>> {
    if (!keys.length) return Promise.resolve([]);
    const transaction = database.transaction(store, "readonly");
    const objectStore = transaction.objectStore(store);
    const requests = keys.map((key) => objectStore.get(key));
    return transactionDone(transaction).then(() => requests.map((request) => request.result as T | undefined));
  }
  private async loadLegacy(): Promise<StoredCharacter[]> {
    const legacy = await getDeviceValue<StoredCharacter[]>(this.storageKey);
    this.mode = "legacy";
    this.loaded = true;
    this.slots = assignSlots([], Array.isArray(legacy) ? legacy : []);
    return this.slots.map((slot) => slot.value);
  }

  /** Applies a pagehide checkpoint written before the previous page could commit. */
  private applyJournal() {
    const journal = readJournal(this.journalKey);
    if (!journal) return;
    this.hasJournal = true;
    const byKey = new Map(this.slots.map((slot) => [slot.key, slot.value]));
    for (const key of journal.deletes) byKey.delete(key);
    for (const [key, record, portrait] of journal.upserts) {
      const value = portrait.kind === "set"
        ? joinPortrait(record, portrait.value)
        : portrait.kind === "same" ? joinPortrait(record, this.committedPortraits.get(key)) : record;
      byKey.set(key, value);
      this.pending.set(key, value);
    }
    const next: Slot[] = [];
    for (const key of journal.order) if (byKey.has(key)) next.push({ key, value: byKey.get(key) });
    for (const slot of this.slots)
      if (!next.some((item) => item.key === slot.key)) this.pendingDeletes.add(slot.key);
    for (const key of journal.deletes) this.pendingDeletes.add(key);
    for (const slot of next) this.pendingDeletes.delete(slot.key);
    const live = new Set(next.map((slot) => slot.key));
    for (const key of [...this.pending.keys()]) if (!live.has(key)) this.pending.delete(key);
    this.slots = next;
    this.orderDirty = true;
  }

  /** Records the latest collection; only changed characters are queued for writing. */
  update(collection: readonly StoredCharacter[]) {
    if (!this.loaded) return;
    const previous = this.slots;
    const next = assignSlots(previous, collection);
    const before = new Map(previous.map((slot) => [slot.key, slot.value]));
    let changed = previous.length !== next.length || previous.some((slot, index) => slot.key !== next[index].key);
    if (changed) this.orderDirty = true;
    const nextKeys = new Set(next.map((slot) => slot.key));
    for (const slot of previous) if (!nextKeys.has(slot.key)) {
      this.pending.delete(slot.key);
      this.pendingDeletes.add(slot.key);
    }
    for (const slot of next) {
      if (before.has(slot.key) && before.get(slot.key) === slot.value) continue;
      changed = true;
      this.pending.set(slot.key, slot.value);
      this.pendingDeletes.delete(slot.key);
    }
    this.slots = next;
    if (!changed) return;
    if (this.mode === "legacy") this.legacyDirty = true;
    this.schedule();
  }

  private hasPendingWork() {
    return this.pending.size > 0 || this.pendingDeletes.size > 0 || this.orderDirty || this.legacyDirty;
  }

  private clearPending() {
    this.pending.clear();
    this.pendingDeletes.clear();
    this.orderDirty = false;
  }

  private schedule() {
    if (this.mode === "disabled") return;
    const now = Date.now();
    if (!this.timer) this.firstPendingAt = now;
    else clearTimeout(this.timer);
    const wait = Math.max(0, Math.min(DEBOUNCE_MS, this.firstPendingAt + MAX_WAIT_MS - now));
    this.timer = setTimeout(() => {
      this.timer = null;
      this.flush().catch(() => {});
    }, wait);
  }

  /**
   * Commits every pending change. Rejects with the storage error (also passed
   * to `onError`); failed changes remain pending for the next attempt.
   */
  async flush(): Promise<void> {
    if (this.timer) { clearTimeout(this.timer); this.timer = null; }
    while (this.flushing) await this.flushing.catch(() => {});
    if (!this.hasPendingWork()) return;
    if (this.mode === "disabled") throw new Error("Character storage is not loaded.");
    const run = this.mode === "legacy" ? this.writeLegacy() : this.writeChanges();
    this.flushing = run;
    try {
      await run;
      this.options.onSaved?.();
    } catch (error) {
      this.options.onError?.(error);
      throw error;
    } finally {
      if (this.flushing === run) this.flushing = null;
    }
  }

  private async writeLegacy() {
    this.legacyDirty = false;
    this.clearPending();
    try {
      await setDeviceValue(this.storageKey, this.slots.map((slot) => slot.value));
    } catch (error) {
      this.legacyDirty = true;
      throw error;
    }
  }

  private async writeChanges() {
    const upserts = new Map(this.pending);
    const deletes = new Set(this.pendingDeletes);
    const writeOrder = this.orderDirty;
    const order = this.slots.map((slot) => slot.key);
    this.clearPending();
    this.inflight = { upserts, deletes };
    const portraitWrites = new Map<string, unknown>();
    try {
      const database = await this.db();
      const transaction = database.transaction([RECORDS, PORTRAITS, MANIFESTS], "readwrite");
      const done = transactionDone(transaction);
      const records = transaction.objectStore(RECORDS);
      const portraits = transaction.objectStore(PORTRAITS);
      for (const key of deletes) {
        records.delete(this.recordKey(key));
        portraits.delete(this.recordKey(key));
        portraitWrites.set(key, undefined);
      }
      for (const [key, value] of upserts) {
        const { record, portrait } = splitPortrait(value);
        records.put({ value: record, portrait: portrait !== undefined } satisfies StoredRecord, this.recordKey(key));
        const committed = this.committedPortraits.get(key);
        if (portrait === undefined) {
          if (committed !== undefined) portraits.delete(this.recordKey(key));
        } else if (!samePortrait(portrait, committed)) {
          portraits.put(portrait, this.recordKey(key));
        }
        portraitWrites.set(key, portrait);
      }
      if (writeOrder)
        transaction.objectStore(MANIFESTS).put({ format: FORMAT, slots: order } satisfies Manifest, this.storageKey);
      await done;
    } catch (error) {
      if (this.database) this.database = null;
      this.requeue(upserts, deletes, writeOrder);
      throw error;
    } finally {
      this.inflight = null;
    }
    for (const [key, portrait] of portraitWrites) {
      if (portrait === undefined) this.committedPortraits.delete(key);
      else this.committedPortraits.set(key, portrait);
    }
    if (this.hasJournal) this.rewriteJournal();
  }

  private requeue(upserts: Map<string, StoredCharacter>, deletes: Set<string>, writeOrder: boolean) {
    const present = new Map(this.slots.map((slot) => [slot.key, slot.value]));
    for (const [key] of upserts)
      if (!this.pending.has(key) && !this.pendingDeletes.has(key) && present.has(key))
        this.pending.set(key, present.get(key));
    for (const key of deletes) if (!present.has(key)) this.pendingDeletes.add(key);
    if (writeOrder) this.orderDirty = true;
  }

  /**
   * Synchronous best-effort checkpoint for pagehide/hidden/unmount. Only
   * uncommitted characters are journaled (portraits only when changed); the
   * IndexedDB flush is then started but may not finish before the page dies.
   */
  checkpoint() {
    if (this.mode === "disabled") return;
    if (this.mode === "legacy") {
      if (this.legacyDirty) stageDeviceValue(this.storageKey, this.slots.map((slot) => slot.value));
    } else if (this.inflight || this.hasPendingWork()) {
      try {
        this.rewriteJournal();
      } catch (error) {
        this.options.onError?.(error);
      }
    }
    if (this.hasPendingWork()) this.flush().catch(() => {});
  }

  private rewriteJournal() {
    const upserts = new Map<string, StoredCharacter>(this.inflight?.upserts ?? []);
    const deletes = new Set<string>(this.inflight?.deletes ?? []);
    for (const [key, value] of this.pending) { upserts.set(key, value); deletes.delete(key); }
    for (const key of this.pendingDeletes) { deletes.add(key); upserts.delete(key); }
    const live = new Set(this.slots.map((slot) => slot.key));
    for (const key of upserts.keys()) if (!live.has(key)) upserts.delete(key);
    if (!upserts.size && !deletes.size && !this.orderDirty && !this.inflight) {
      localStorage.removeItem(this.journalKey);
      this.hasJournal = false;
      return;
    }
    const journal: Journal = {
      format: FORMAT,
      order: this.slots.map((slot) => slot.key),
      deletes: [...deletes],
      upserts: [...upserts].map(([key, value]) => {
        const { record, portrait } = splitPortrait(value);
        const committed = this.committedPortraits.get(key);
        const entry: JournalPortrait = portrait === undefined
          ? { kind: "none" }
          : samePortrait(portrait, committed) ? { kind: "same" } : { kind: "set", value: portrait };
        return [key, record, entry];
      }),
    };
    localStorage.setItem(this.journalKey, JSON.stringify(journal));
    this.hasJournal = true;
  }

  /** Stops scheduling and starts a final flush; callers must handle the returned promise. */
  close(): Promise<void> {
    this.checkpoint();
    const result = this.flush();
    this.loaded = false;
    return result;
  }
}
