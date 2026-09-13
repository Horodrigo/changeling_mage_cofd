const DATABASE_NAME = "arquivo-das-trevas";
const DATABASE_VERSION = 2;
const STORE_NAME = "catalogs";

export interface CachedCatalog<T> {
  version: number;
  data: T;
  cachedAt: string;
}

function openCatalogDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DATABASE_NAME, DATABASE_VERSION);
    request.onupgradeneeded = () => {
      if (!request.result.objectStoreNames.contains("key-value"))
        request.result.createObjectStore("key-value");
      if (!request.result.objectStoreNames.contains(STORE_NAME))
        request.result.createObjectStore(STORE_NAME);
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function getCachedCatalog<T>(key: string): Promise<CachedCatalog<T> | null> {
  if (typeof indexedDB === "undefined") return null;
  const database = await openCatalogDatabase();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(STORE_NAME, "readonly");
    const request = transaction.objectStore(STORE_NAME).get(key);
    request.onerror = () => reject(request.error);
    transaction.oncomplete = () => {
      database.close();
      resolve((request.result as CachedCatalog<T> | undefined) ?? null);
    };
    transaction.onabort = transaction.onerror = () => {
      database.close();
      reject(transaction.error ?? new Error("Failed to read the catalog cache."));
    };
  });
}

export async function setCachedCatalog<T>(key: string, value: CachedCatalog<T>): Promise<void> {
  if (typeof indexedDB === "undefined") return;
  const database = await openCatalogDatabase();
  await new Promise<void>((resolve, reject) => {
    const transaction = database.transaction(STORE_NAME, "readwrite");
    transaction.objectStore(STORE_NAME).put(value, key);
    transaction.oncomplete = () => {
      database.close();
      resolve();
    };
    transaction.onabort = transaction.onerror = () => {
      database.close();
      reject(transaction.error ?? new Error("Failed to write the catalog cache."));
    };
  });
}
