import { getCachedCatalog, setCachedCatalog } from "./catalog-cache";
import type {
  CatalogGroupModule,
  CatalogReader,
  CatalogSnapshot,
} from "@/lib/game-line-contracts/catalog-groups";
import type { CatalogManifest } from "./catalog-types";

const MANIFEST_URL = "/data/manifest.json";
const MANIFEST_CACHE_KEY = "catalog-manifest";
const memory = new Map<string, Promise<unknown>>();

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Catalog request failed (${response.status}): ${url}`);
  return response.json() as Promise<T>;
}

async function getManifest(): Promise<CatalogManifest> {
  const existing = memory.get(MANIFEST_CACHE_KEY);
  if (existing) return existing as Promise<CatalogManifest>;
  const pending = (async () => {
    const cached = await getCachedCatalog<CatalogManifest>(MANIFEST_CACHE_KEY).catch(() => null);
    try {
      const manifest = await fetchJson<CatalogManifest>(MANIFEST_URL);
      if (!cached || cached.version !== manifest.catalogVersion || cached.data.schemaVersion !== manifest.schemaVersion) {
        await setCachedCatalog(MANIFEST_CACHE_KEY, {
          version: manifest.catalogVersion,
          data: manifest,
          cachedAt: new Date().toISOString(),
        }).catch(() => undefined);
      }
      return manifest;
    } catch (error) {
      if (cached) return cached.data;
      throw error;
    }
  })();
  memory.set(MANIFEST_CACHE_KEY, pending);
  return pending;
}

async function getCatalog<T>(catalogId: string): Promise<T> {
  const existing = memory.get(catalogId);
  if (existing) return existing as Promise<T>;
  const pending = (async () => {
    const manifest = await getManifest();
    const definition = manifest.catalogs[catalogId];
    if (!definition) throw new Error(`Unknown catalog: ${catalogId}`);
    const cached = await getCachedCatalog<T>(catalogId).catch(() => null);
    if (cached?.version === definition.version) return cached.data;
    try {
      const data = await fetchJson<T>(definition.url);
      await setCachedCatalog(catalogId, {
        version: definition.version,
        data,
        cachedAt: new Date().toISOString(),
      }).catch(() => undefined);
      return data;
    } catch (error) {
      if (cached) return cached.data;
      throw error;
    }
  })();
  memory.set(catalogId, pending);
  try {
    return await pending;
  } catch (error) {
    memory.delete(catalogId);
    throw error;
  }
}

class ImmutableCatalogSnapshot implements CatalogSnapshot {
  constructor(private readonly values: ReadonlyMap<string, unknown>) {}
  has(groupId: string) { return this.values.has(groupId); }
  get<T>(groupId: string): T {
    if (!this.values.has(groupId)) throw new Error(`Catalog group is absent from this snapshot: ${groupId}`);
    return this.values.get(groupId) as T;
  }
  entries() { return this.values.entries(); }
}

/** Static JSON is shared safely only when every returned nested value is frozen. */
export function freezeCatalogData<T>(value: T): T {
  if (!value || typeof value !== "object" || Object.isFrozen(value)) return value;
  for (const child of Object.values(value as Record<string, unknown>)) freezeCatalogData(child);
  return Object.freeze(value);
}

/** Loads declared groups without knowing game-line catalog names or data shapes. */
async function loadGroups(
  requested: ReadonlyArray<readonly [string, CatalogGroupModule]>,
): Promise<CatalogSnapshot> {
  const values = await Promise.all(requested.map(async ([id, module]) => [
    id,
    freezeCatalogData(await module.load(catalogService)),
  ] as const));
  return new ImmutableCatalogSnapshot(new Map(values));
}

export const catalogService: CatalogReader & {
  getManifest: () => Promise<CatalogManifest>;
  loadGroups: typeof loadGroups;
} = { getManifest, getCatalog, loadGroups };
