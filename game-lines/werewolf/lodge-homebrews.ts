import { getDeviceValue, setDeviceValue, stageDeviceValue } from "@/lib/device-storage";
import { HOMEBREW_EVENT } from "@/lib/homebrew";
import { createRandomId } from "@/lib/random-id";
import type { WerewolfLodgeDefinition } from "./catalogs/lodges";

export const WEREWOLF_LODGE_HOMEBREW_SOURCE_ID = "homebrew:werewolf-lodges";
export const WEREWOLF_LODGE_HOMEBREW_SOURCE = "Player-created Werewolf Lodges";
export const WEREWOLF_LODGE_HOMEBREW_KEY = "arquivo-das-trevas:werewolf-lodges:v1";

const record = (value: unknown): Record<string, unknown> =>
  value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : {};
const text = (value: unknown) => typeof value === "string" ? value.trim() : "";
const textList = (value: unknown) => Array.isArray(value) ? value.map(text).filter(Boolean) : [];
const presentation = (value: unknown) => {
  const source = record(value), result: Record<string, unknown> = {};
  for (const key of ["name", "summary", "description", "admission", "recruitment", "totem", "blessing", "aspiration", "ban", "sacredHunt"]) {
    if (typeof source[key] === "string" && source[key].trim()) result[key] = source[key].trim();
  }
  const access = textList(source.access);
  if (access.length) result.access = access;
  return result;
};

export function normalizeWerewolfLodgeHomebrew(value: unknown): WerewolfLodgeDefinition | null {
  const item = record(value);
  const id = text(item.id), name = text(item.name), summary = text(item.summary), description = text(item.description);
  if (!id.startsWith("homebrew:werewolf-lodge:") || !name || !summary || !description) return null;
  const page = Number(item.page);
  return {
    id, name, summary, description,
    admission: text(item.admission) || undefined, recruitment: text(item.recruitment) || undefined,
    totem: text(item.totem) || undefined, blessing: text(item.blessing) || undefined,
    aspiration: text(item.aspiration) || undefined, ban: text(item.ban) || undefined,
    sacredHunt: text(item.sacredHunt) || undefined, access: textList(item.access),
    presentationPt: presentation(item.presentationPt),
    sourceId: WEREWOLF_LODGE_HOMEBREW_SOURCE_ID, source: WEREWOLF_LODGE_HOMEBREW_SOURCE,
    page: Number.isInteger(page) && page >= 0 ? page : 0, homebrew: true,
  };
}

export function normalizeWerewolfLodgeHomebrews(value: unknown) {
  return (Array.isArray(value) ? value : [])
    .map(normalizeWerewolfLodgeHomebrew)
    .filter((item): item is WerewolfLodgeDefinition => Boolean(item));
}

export function readWerewolfLodgeHomebrews() {
  if (typeof localStorage === "undefined") return [];
  try { return normalizeWerewolfLodgeHomebrews(JSON.parse(localStorage.getItem(WEREWOLF_LODGE_HOMEBREW_KEY) ?? "[]")); }
  catch { return []; }
}

export async function hydrateWerewolfLodgeHomebrews() {
  const stored = await getDeviceValue<unknown>(WEREWOLF_LODGE_HOMEBREW_KEY);
  const items = stored === null ? readWerewolfLodgeHomebrews() : normalizeWerewolfLodgeHomebrews(stored);
  localStorage.setItem(WEREWOLF_LODGE_HOMEBREW_KEY, JSON.stringify(items));
  return items;
}

export function saveWerewolfLodgeHomebrews(value: readonly WerewolfLodgeDefinition[]) {
  const items = normalizeWerewolfLodgeHomebrews(value);
  stageDeviceValue(WEREWOLF_LODGE_HOMEBREW_KEY, items);
  void setDeviceValue(WEREWOLF_LODGE_HOMEBREW_KEY, items);
  window.dispatchEvent(new Event(HOMEBREW_EVENT));
  return items;
}

export const werewolfLodgeHomebrewId = () => `homebrew:werewolf-lodge:${createRandomId()}`;
