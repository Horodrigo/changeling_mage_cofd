import { getDeviceValue, setDeviceValue, stageDeviceValue } from "@/lib/device-storage";
import { HOMEBREW_EVENT } from "@/lib/homebrew";
import { createRandomId } from "@/lib/random-id";
import type { VampireBloodlineDefinition } from "./catalog-types";

export const BLOODLINE_HOMEBREW_SOURCE_ID = "homebrew:vampire-bloodlines";
export const BLOODLINE_HOMEBREW_SOURCE = "Player-created Bloodlines";
export const BLOODLINE_HOMEBREW_KEY = "arquivo-das-trevas:vampire-bloodlines:v1";

const record = (value: unknown): Record<string, unknown> => value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : {};
const text = (value: unknown) => String(value ?? "").trim();
const textList = (value: unknown) => (Array.isArray(value) ? value : []).map(text).filter(Boolean);

export function normalizeBloodlineHomebrew(value: unknown): VampireBloodlineDefinition | null {
  const item = record(value), id = text(item.id), name = text(item.name), parentClan = text(item.parentClan);
  const favoredAttributes = textList(item.favoredAttributes), disciplines = textList(item.disciplines);
  const summary = text(item.summary), baneName = text(item.baneName), baneSummary = text(item.baneSummary);
  if (!id.startsWith("homebrew:bloodline:") || !name || !parentClan || favoredAttributes.length !== 2 || new Set(favoredAttributes).size !== 2 || disciplines.length !== 4 || new Set(disciplines).size !== 4 || !summary || !baneName || !baneSummary) return null;
  const exclusiveDiscipline = text(item.exclusiveDiscipline);
  return {
    id, name, translatedName: name, parentClan, requirements: text(item.requirements) || undefined,
    nicknames: textList(item.nicknames), favoredAttributes: favoredAttributes as [string, string], disciplines: disciplines as [string, string, string, string],
    exclusiveDiscipline: exclusiveDiscipline && disciplines.includes(exclusiveDiscipline) ? exclusiveDiscipline : undefined,
    summary, baneName, baneSummary, sourceId: BLOODLINE_HOMEBREW_SOURCE_ID, source: BLOODLINE_HOMEBREW_SOURCE, page: 0, homebrew: true,
  };
}

export function normalizeBloodlineHomebrews(value: unknown) {
  return (Array.isArray(value) ? value : []).map(normalizeBloodlineHomebrew).filter((item): item is VampireBloodlineDefinition => Boolean(item));
}

export function readBloodlineHomebrews() {
  if (typeof localStorage === "undefined") return [];
  try { return normalizeBloodlineHomebrews(JSON.parse(localStorage.getItem(BLOODLINE_HOMEBREW_KEY) ?? "[]")); }
  catch { return []; }
}

export async function hydrateBloodlineHomebrews() {
  const stored = await getDeviceValue<unknown>(BLOODLINE_HOMEBREW_KEY);
  const items = stored === null ? readBloodlineHomebrews() : normalizeBloodlineHomebrews(stored);
  localStorage.setItem(BLOODLINE_HOMEBREW_KEY, JSON.stringify(items));
  return items;
}

export function saveBloodlineHomebrews(value: readonly VampireBloodlineDefinition[]) {
  const items = normalizeBloodlineHomebrews(value);
  stageDeviceValue(BLOODLINE_HOMEBREW_KEY, items);
  void setDeviceValue(BLOODLINE_HOMEBREW_KEY, items);
  window.dispatchEvent(new Event(HOMEBREW_EVENT));
  return items;
}

export const bloodlineHomebrewId = () => `homebrew:bloodline:${createRandomId()}`;
