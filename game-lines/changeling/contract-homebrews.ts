import type { ContractDefinition, SeemingKey } from "@/lib/catalog/catalog-types";
import { getDeviceValue, setDeviceValue, stageDeviceValue } from "@/lib/device-storage";
import { HOMEBREW_EVENT } from "@/lib/homebrew";
import { createRandomId } from "@/lib/random-id";

export const CONTRACT_HOMEBREW_SOURCE_ID = "homebrew:changeling-contracts";
export const CONTRACT_HOMEBREW_SOURCE = "Player-created Contracts";
export const CONTRACT_HOMEBREW_KEY = "arquivo-das-trevas:changeling-contracts:v1";

const SEEMINGS: SeemingKey[] = ["Beast", "Darkling", "Elemental", "Fairest", "Grimm", "Ogre", "Wizened"];
const record = (value: unknown): Record<string, unknown> => value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : {};
const text = (value: unknown) => String(value ?? "").trim();
const optional = (value: unknown) => text(value) || undefined;

export function normalizeContractHomebrew(value: unknown): ContractDefinition | null {
  const item = record(value), id = text(item.id), name = text(item.name), description = text(item.description);
  const rawType = text(item.type), rawKind = text(item.categoryKind), rawRegalia = text(item.regalia);
  if (!id.startsWith("homebrew:contract:") || !name || !description || !["Comum", "Real"].includes(rawType)) return null;

  const goblin = item.goblin === true || rawRegalia === "Goblin";
  const categoryKind: ContractDefinition["categoryKind"] = goblin ? "Independente" : ["Corte", "Independente", "Regalia"].includes(rawKind) ? rawKind as ContractDefinition["categoryKind"] : undefined;
  const courtIds = [...new Set((Array.isArray(item.courtIds) ? item.courtIds : []).map(text).filter(Boolean))];
  if (!categoryKind) return null;
  if (categoryKind === "Corte" && !courtIds.length) return null;
  if (categoryKind === "Regalia" && !rawRegalia) return null;

  const hasRoll = item.hasRoll === true;
  const dicePool = hasRoll ? text(item.dicePool) : "None";
  if (hasRoll && !dicePool) return null;
  const cost = text(item.cost), action = text(item.action), duration = text(item.duration), loophole = text(item.loophole);
  const effect = optional(item.effect), success = optional(item.success), exceptionalSuccess = optional(item.exceptionalSuccess);
  const failure = optional(item.failure), dramaticFailure = optional(item.dramaticFailure);
  if (!cost || !action || !duration || !loophole) return null;
  if (hasRoll ? !success || !exceptionalSuccess || !failure || !dramaticFailure : !effect) return null;

  const seemingInput = record(item.seemingBenefits);
  const seemingBenefits = Object.fromEntries(SEEMINGS.map((key) => [key, text(seemingInput[key])]).filter(([, entry]) => entry)) as Partial<Record<SeemingKey, string>>;
  const regalia = goblin ? "Goblin" : categoryKind === "Independente" ? "Independent" : rawRegalia;
  return {
    id, name, originalName: name, type: goblin ? "Comum" : rawType as "Comum" | "Real", categoryKind, regalia,
    description, summary: optional(item.summary), effect, hasRoll, dicePool,
    cost, action, duration, loophole, success, exceptionalSuccess, failure, dramaticFailure, goblinDebt: optional(item.goblinDebt),
    ...(courtIds.length ? { courtIds } : {}), ...(Object.keys(seemingBenefits).length ? { seemingBenefits } : {}),
    ...(goblin ? { goblin: true as const } : {}), sourceId: CONTRACT_HOMEBREW_SOURCE_ID, source: CONTRACT_HOMEBREW_SOURCE, page: 0, homebrew: true,
  };
}

export function normalizeContractHomebrews(value: unknown) {
  return (Array.isArray(value) ? value : []).map(normalizeContractHomebrew).filter((item): item is ContractDefinition => Boolean(item));
}

export function mergeContractHomebrews(catalog: readonly ContractDefinition[], custom: readonly ContractDefinition[]) {
  const ids = new Set(catalog.map((item) => item.id));
  return [...catalog, ...custom.filter((item) => !ids.has(item.id))];
}

export function readContractHomebrews() {
  if (typeof localStorage === "undefined") return [];
  try { return normalizeContractHomebrews(JSON.parse(localStorage.getItem(CONTRACT_HOMEBREW_KEY) ?? "[]")); }
  catch { return []; }
}

export async function hydrateContractHomebrews() {
  const stored = await getDeviceValue<unknown>(CONTRACT_HOMEBREW_KEY);
  const items = stored === null ? readContractHomebrews() : normalizeContractHomebrews(stored);
  localStorage.setItem(CONTRACT_HOMEBREW_KEY, JSON.stringify(items));
  return items;
}

export function saveContractHomebrews(value: readonly ContractDefinition[]) {
  const items = normalizeContractHomebrews(value);
  stageDeviceValue(CONTRACT_HOMEBREW_KEY, items);
  void setDeviceValue(CONTRACT_HOMEBREW_KEY, items);
  window.dispatchEvent(new Event(HOMEBREW_EVENT));
  return items;
}

export const contractHomebrewId = () => `homebrew:contract:${createRandomId()}`;
