const DATABASE_NAME = "arquivo-das-trevas";
const DATABASE_VERSION = 2;
const STORE_NAME = "key-value";
const pendingWrites = new Map<string, Promise<void>>();

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DATABASE_NAME, DATABASE_VERSION);
    request.onupgradeneeded = () => {
      if (!request.result.objectStoreNames.contains(STORE_NAME))
        request.result.createObjectStore(STORE_NAME);
      if (!request.result.objectStoreNames.contains("catalogs"))
        request.result.createObjectStore("catalogs");
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function requestValue<T>(mode: IDBTransactionMode, key: string, value?: T) {
  const database = await openDatabase();
  return new Promise<T | undefined>((resolve, reject) => {
    const transaction = database.transaction(STORE_NAME, mode);
    const store = transaction.objectStore(STORE_NAME);
    const request = mode === "readonly" ? store.get(key) : store.put(value, key);
    // A successful request is not a committed transaction yet.
    request.onerror = () => reject(request.error);
    transaction.oncomplete = () => {
      database.close();
      resolve(request.result as T | undefined);
    };
    transaction.onabort = transaction.onerror = () => {
      database.close();
      reject(transaction.error ?? new Error("Falha ao salvar no dispositivo."));
    };
  });
}

export async function getDeviceValue<T>(key: string): Promise<T | null> {
  await pendingWrites.get(key)?.catch(() => {});
  // Recover the latest synchronous snapshot after a page closed before commit.
  const pending = readLegacy<T>(`${key}:pending-write`);
  if (pending !== null) {
    await setDeviceValue(key, pending);
    return pending;
  }
  if (typeof indexedDB === "undefined") return readLegacy<T>(key);
  try {
    const stored = await requestValue<T>("readonly", key);
    if (stored !== undefined) return stored;
    const legacy = readLegacy<T>(key);
    if (legacy !== null) await setDeviceValue(key, legacy);
    return legacy;
  } catch { return readLegacy<T>(key); }
}

export async function setDeviceValue<T>(key: string, value: T) {
  const snapshot = structuredClone(value);
  // Synchronous backup survives closing the page while IndexedDB is committing.
  // Quota errors here must not prevent IndexedDB from saving.
  let backedUp = false;
  try {
    localStorage.setItem(`${key}:pending-write`, JSON.stringify(snapshot));
    backedUp = true;
    localStorage.setItem(key, JSON.stringify(snapshot));
  } catch {}
  const previous = pendingWrites.get(key) ?? Promise.resolve();
  const write = previous.catch(() => {}).then(async () => {
    try {
      if (typeof indexedDB === "undefined") throw new Error("IndexedDB indisponível.");
      await requestValue("readwrite", key, snapshot);
      if (pendingWrites.get(key) === write) {
        try { localStorage.removeItem(`${key}:pending-write`); } catch {}
      }
    } catch (error) { if (!backedUp) throw error; }
  });
  pendingWrites.set(key, write);
  try { await write; } finally {
    if (pendingWrites.get(key) === write) pendingWrites.delete(key);
  }
}

/** Stage the latest value synchronously so a debounced IndexedDB write is crash-safe. */
export function stageDeviceValue<T>(key: string, value: T) {
  const snapshot = structuredClone(value);
  try {
    localStorage.setItem(`${key}:pending-write`, JSON.stringify(snapshot));
    localStorage.setItem(key, JSON.stringify(snapshot));
  } catch {}
}

function readLegacy<T>(key: string): T | null {
  try {
    const value = localStorage.getItem(key);
    return value === null ? null : JSON.parse(value) as T;
  } catch {
    return null;
  }
}
