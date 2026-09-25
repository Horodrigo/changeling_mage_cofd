import { getDeviceValue, setDeviceValue, stageDeviceValue } from "./device-storage";
import { HOMEBREW_EVENT, homebrewContentActive, type HomebrewPreferences } from "./homebrew";
import type { Requirement } from "./merit-requirements";
import type { GameLine, MeritDefinition, MeritLevel } from "./merits";
import { createRandomId } from "./random-id";

export type MeritHomebrewLine = "Core" | GameLine;

export const MERIT_HOMEBREW_KEY = "arquivo-das-trevas:merits:v1";
export const MERIT_HOMEBREW_SOURCES: Record<MeritHomebrewLine, { id: string; name: string }> = {
  Core: { id: "homebrew:core-merits", name: "Player-created Core Merits" },
  CofD: { id: "homebrew:mortal-merits", name: "Player-created Mortal Merits" },
  CtL: { id: "homebrew:changeling-merits", name: "Player-created Changeling Merits" },
  MtA: { id: "homebrew:mage-merits", name: "Player-created Mage Merits" },
  VtR: { id: "homebrew:vampire-merits", name: "Player-created Vampire Merits" },
};

const lines = new Set<MeritHomebrewLine>(["Core", "CofD", "CtL", "MtA", "VtR"]);
const record = (value: unknown): Record<string, unknown> => value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : {};
const text = (value: unknown) => String(value ?? "").trim();

function normalizeRequirement(value: unknown): Requirement | undefined {
  const item = record(value);
  if (Array.isArray(item.all)) { const all = item.all.map(normalizeRequirement).filter((entry): entry is Requirement => Boolean(entry)); return all.length ? { all } : undefined; }
  if (Array.isArray(item.any)) { const any = item.any.map(normalizeRequirement).filter((entry): entry is Requirement => Boolean(entry)); return any.length ? { any } : undefined; }
  const trait = text(item.trait), merit = text(item.merit), minimum = Math.max(1, Math.min(10, Number(item.minimum) || 1));
  if (trait) return { trait, minimum };
  if (merit) return { merit, minimum };
  return undefined;
}

function requirementText(requirement: Requirement | undefined): string {
  if (!requirement) return "";
  if ("all" in requirement) return requirement.all.map(requirementText).filter(Boolean).join("; ");
  if ("any" in requirement) return requirement.any.map(requirementText).filter(Boolean).join(" or ");
  if ("trait" in requirement) return `${requirement.trait} ${requirement.minimum}`;
  if ("merit" in requirement) return `${requirement.merit} ${requirement.minimum ?? 1}`;
  return "";
}

export function normalizeMeritHomebrew(value: unknown): MeritDefinition | null {
  const item = record(value), id = text(item.id), name = text(item.name), category = text(item.category), description = text(item.description);
  const line = text(item.line) as MeritHomebrewLine;
  const ratings = [...new Set((Array.isArray(item.ratings) ? item.ratings : []).map(Number).filter((rating) => Number.isInteger(rating) && rating >= 1 && rating <= 10))].sort((a, b) => a - b);
  if (!id.startsWith("homebrew:merit:") || !lines.has(line) || !name || !category || !ratings.length) return null;
  const rawLevels = Array.isArray(item.levels) ? item.levels : [];
  const normalizedLevels: MeritLevel[] = rawLevels.flatMap((value) => {
    const level = record(value), rating = Number(level.rating), levelDescription = text(level.description);
    return ratings.includes(rating) && levelDescription ? [{ rating, name: text(level.name) || name, description: levelDescription }] : [];
  });
  const levels = ratings.flatMap((rating) => normalizedLevels.find((level) => level.rating === rating) ?? []);
  if (levels.length ? levels.length !== ratings.length : !description) return null;
  const requirements = normalizeRequirement(item.requirements), source = MERIT_HOMEBREW_SOURCES[line], narrativePrerequisites = text(item.narrativePrerequisites);
  const prerequisites = [requirementText(requirements), narrativePrerequisites].filter(Boolean).join("; ") || undefined;
  return {
    id, name, ratings, line, sourceId: source.id, source: source.name, category, priority: 999,
    translatedName: name, description: description || levels[0]?.description || "", descriptionEn: description || levels[0]?.description || "",
    prerequisites, narrativePrerequisites: narrativePrerequisites || undefined, page: 0, ...(levels.length ? { levels } : {}),
    ...(requirements ? { requirements } : {}), ...(item.unbounded === true ? { unbounded: true as const } : {}),
    homebrew: true, descriptivePrerequisites: true,
  };
}

export function normalizeMeritHomebrews(value: unknown) {
  return (Array.isArray(value) ? value : []).map(normalizeMeritHomebrew).filter((item): item is MeritDefinition => Boolean(item));
}

export function mergeMeritHomebrews(catalog: readonly MeritDefinition[], custom: readonly MeritDefinition[]) {
  const ids = new Set(catalog.map((item) => item.id));
  return [...catalog, ...custom.filter((item) => !ids.has(item.id))];
}

export function activeMeritCatalog(catalog: readonly MeritDefinition[], custom: readonly MeritDefinition[], preferences: HomebrewPreferences, ownedNames: readonly string[] = []) {
  const owned = new Set(ownedNames);
  const merged = mergeMeritHomebrews(catalog, custom);
  const errata = new Map(merged.filter((item) => item.errataFor && homebrewContentActive(preferences, item.id, item.sourceId, item.defaultDisabled)).map((item) => [item.errataFor!, item]));
  const normal = merged
    .filter((item) => !item.catalogOnly && !item.errataFor && (owned.has(item.name) || homebrewContentActive(preferences, item.id, item.sourceId, item.defaultDisabled)))
    .map((item) => {
      const replacement = errata.get(item.id);
      return replacement ? { ...item, ...replacement, id: item.id, name: item.name, translatedName: item.translatedName, category: replacement.replacementCategory ?? item.category } : item;
    });
  const existing = new Set(normal.map((item) => item.id));
  return [...normal, ...[...errata.entries()].flatMap(([id, item]) => existing.has(id) ? [] : [{ ...item, id, name: item.errataForName ?? item.name, translatedName: item.errataForName ?? item.translatedName, category: item.replacementCategory ?? item.category }])];
}

export function readMeritHomebrews() {
  if (typeof localStorage === "undefined") return [];
  try { return normalizeMeritHomebrews(JSON.parse(localStorage.getItem(MERIT_HOMEBREW_KEY) ?? "[]")); }
  catch { return []; }
}

export async function hydrateMeritHomebrews() {
  const stored = await getDeviceValue<unknown>(MERIT_HOMEBREW_KEY);
  const items = stored === null ? readMeritHomebrews() : normalizeMeritHomebrews(stored);
  localStorage.setItem(MERIT_HOMEBREW_KEY, JSON.stringify(items));
  return items;
}

export function saveMeritHomebrews(value: readonly MeritDefinition[]) {
  const items = normalizeMeritHomebrews(value);
  stageDeviceValue(MERIT_HOMEBREW_KEY, items);
  void setDeviceValue(MERIT_HOMEBREW_KEY, items);
  window.dispatchEvent(new Event(HOMEBREW_EVENT));
  return items;
}

export const meritHomebrewId = () => `homebrew:merit:${createRandomId()}`;
