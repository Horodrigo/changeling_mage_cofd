const DATABASE_NAME = "arquivo-das-trevas";
const DATABASE_VERSION = 1;
const STORE_NAME = "key-value";

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DATABASE_NAME, DATABASE_VERSION);
    request.onupgradeneeded = () => {
      if (!request.result.objectStoreNames.contains(STORE_NAME))
        request.result.createObjectStore(STORE_NAME);
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
    request.onsuccess = () => resolve(request.result as T | undefined);
    request.onerror = () => reject(request.error);
    transaction.oncomplete = () => database.close();
  });
}

export async function getDeviceValue<T>(key: string): Promise<T | null> {
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
  if (typeof indexedDB !== "undefined") try { await requestValue("readwrite", key, value); } catch {}
  // Mantido durante a migração para versões antigas ainda abertas em outra aba.
  localStorage.setItem(key, JSON.stringify(value));
}

function readLegacy<T>(key: string): T | null {
  try {
    const value = localStorage.getItem(key);
    return value === null ? null : JSON.parse(value) as T;
  } catch {
    return null;
  }
}
