import { getCachedCatalog, setCachedCatalog } from "./catalog-cache";
import { replaceContractCatalog } from "./contract-catalog";
import { replaceSpellCatalog } from "./spell-catalog";
import { replaceMeritCatalog, type GameLine, type MeritDefinition } from "../merits";
import {
  replaceChangelingConditionCatalog,
  type ChangelingCondition,
} from "../changeling-conditions";
import { replaceCourtCatalog, type CourtDefinition } from "../changeling-courts";
import { replaceEntitlementCatalog, type EntitlementDefinition } from "../entitlements";
import { replaceKithCatalog, type KithDefinition } from "../changeling-kiths";
import { refreshCreationCourts } from "../creation-rules";
import { replaceMageConditionCatalog, type MageCondition } from "../mage-conditions";
import type {
  CatalogManifest,
  ContractDefinition,
  ContractIndexEntry,
  SpellDefinition,
  SpellIndexEntry,
} from "./catalog-types";

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
      if (
        !cached ||
        cached.version !== manifest.catalogVersion ||
        cached.data.schemaVersion !== manifest.schemaVersion
      ) {
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

async function getCatalog<T>(key: string): Promise<T> {
  const existing = memory.get(key);
  if (existing) return existing as Promise<T>;
  const pending = (async () => {
    const manifest = await getManifest();
    const definition = manifest.catalogs[key];
    if (!definition) throw new Error(`Unknown catalog: ${key}`);
    const cached = await getCachedCatalog<T>(key).catch(() => null);
    if (cached?.version === definition.version) return cached.data;
    try {
      const data = await fetchJson<T>(definition.url);
      await setCachedCatalog(key, {
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
  memory.set(key, pending);
  try {
    return await pending;
  } catch (error) {
    memory.delete(key);
    throw error;
  }
}

async function getSpellIndex() {
  return getCatalog<SpellIndexEntry[]>("mage-spells-index");
}

async function getSpellsByArcana(arcana: string) {
  const normalized = arcana.toLowerCase();
  const index = await getSpellIndex();
  const shards = [
    ...new Set(
      index
        .filter((spell) =>
          Object.keys(spell.requirements).some((name) => name.toLowerCase() === normalized),
        )
        .map((spell) => spell.shard),
    ),
  ];
  const spells = (await Promise.all(
    shards.map((shard) => getCatalog<SpellDefinition[]>(`mage-spells-${shard}`)),
  )).flat();
  return spells.filter((spell) =>
    Object.keys(spell.requirements).some((name) => name.toLowerCase() === normalized),
  );
}

async function getAllSpells() {
  const index = await getSpellIndex();
  const shards = [...new Set(index.map((spell) => spell.shard))];
  return (await Promise.all(
    shards.map((shard) => getCatalog<SpellDefinition[]>(`mage-spells-${shard}`)),
  )).flat();
}

async function hydrateSpells() {
  const spells = await getAllSpells();
  replaceSpellCatalog(spells);
  return spells;
}

async function getContractIndex() {
  return getCatalog<ContractIndexEntry[]>("changeling-contracts-index");
}

async function getContractsBySource(sourceId: string) {
  return getCatalog<ContractDefinition[]>(`changeling-contracts-${sourceId}`);
}

async function getAllContracts() {
  const index = await getContractIndex();
  const shards = [...new Set(index.map((contract) => contract.shard))];
  return (await Promise.all(shards.map(getContractsBySource))).flat();
}

async function hydrateContracts() {
  const contracts = await getAllContracts();
  replaceContractCatalog(contracts);
  return contracts;
}

type MeritIndexEntry = Pick<
  MeritDefinition,
  "id" | "name" | "ratings" | "line" | "sourceId" | "source" | "category" | "priority" | "translatedName" | "page" | "repeatable" | "unbounded"
> & { shard: "core" | "changeling" | "mage" };

async function getMeritIndex() {
  return getCatalog<MeritIndexEntry[]>("merits-index");
}

async function getMeritsForLine(line: GameLine) {
  const suffix = line === "CtL" ? "changeling" : "mage";
  const [core, specific] = await Promise.all([
    getCatalog<MeritDefinition[]>("merits-core"),
    getCatalog<MeritDefinition[]>(`merits-${suffix}`),
  ]);
  return [...core, ...specific];
}

async function getAllMerits() {
  const [core, changeling, mage] = await Promise.all([
    getCatalog<MeritDefinition[]>("merits-core"),
    getCatalog<MeritDefinition[]>("merits-changeling"),
    getCatalog<MeritDefinition[]>("merits-mage"),
  ]);
  return [...core, ...changeling, ...mage];
}

async function hydrateMerits(line: GameLine | "all") {
  const merits = line === "all" ? await getAllMerits() : await getMeritsForLine(line);
  replaceMeritCatalog(merits);
  return merits;
}

async function hydrateChangelingReference() {
  const [coreConditions, corePresentation, conditions, conditionPresentation, courts, entitlements, kiths, kithPresentation] = await Promise.all([
    getCatalog<ChangelingCondition[]>("core-conditions"),
    getCatalog<Record<string, Partial<ChangelingCondition>>>("core-conditions-pt"),
    getCatalog<ChangelingCondition[]>("changeling-conditions"),
    getCatalog<Record<string, Partial<ChangelingCondition>>>("changeling-conditions-pt"),
    getCatalog<CourtDefinition[]>("changeling-courts"),
    getCatalog<EntitlementDefinition[]>("changeling-entitlements"),
    getCatalog<KithDefinition[]>("changeling-kiths"),
    getCatalog<Record<string, Pick<KithDefinition, "description" | "blessing" | "skill"> & { name: string }>>("changeling-kiths-pt"),
  ]);
  replaceChangelingConditionCatalog(
    [...coreConditions, ...conditions],
    { ...corePresentation, ...conditionPresentation },
  );
  replaceCourtCatalog(courts);
  refreshCreationCourts();
  replaceEntitlementCatalog(entitlements);
  replaceKithCatalog(kiths, kithPresentation);
  return { conditions, courts, entitlements, kiths };
}

async function hydrateCoreReference() {
  const [conditions, presentation, mageConditions] = await Promise.all([
    getCatalog<ChangelingCondition[]>("core-conditions"),
    getCatalog<Record<string, Partial<ChangelingCondition>>>("core-conditions-pt"),
    getCatalog<MageCondition[]>("mage-conditions"),
  ]);
  replaceChangelingConditionCatalog(conditions, presentation);
  replaceMageConditionCatalog(mageConditions);
  return { conditions };
}

export const catalogService = {
  getManifest,
  getSpellIndex,
  getSpellsByArcana,
  getAllSpells,
  hydrateSpells,
  getContractIndex,
  getContractsBySource,
  getAllContracts,
  hydrateContracts,
  getMeritIndex,
  getMeritsForLine,
  getAllMerits,
  hydrateMerits,
  hydrateChangelingReference,
  hydrateCoreReference,
};
