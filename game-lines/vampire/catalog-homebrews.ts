import { homebrewRecord, homebrewStrings, homebrewText, hydratePlayerHomebrews, readPlayerHomebrews, savePlayerHomebrews } from "@/lib/player-homebrew-storage";
import { createRandomId } from "@/lib/random-id";
import type { VampireClanDefinition, VampireCovenantDefinition, VampireDisciplineDefinition, VampireMechanics, VampirePowerLevel, VampirePowers, VampirePurchasablePower, VampireReference } from "./catalog-types";

export const VAMPIRE_CATALOG_HOMEBREW_KEY = "arquivo-das-trevas:vampire-catalog:v1";
export const VAMPIRE_CATALOG_HOMEBREW_SOURCE_ID = "homebrew:vampire-player";
export const VAMPIRE_CATALOG_HOMEBREW_SOURCE = "Player-created Vampire Content";
export type VampireHomebrewEntryType = "clan" | "covenant" | "discipline" | "power";
type Meta<T extends VampireHomebrewEntryType> = { entryType: T; sourceId: string; homebrew: true };
export type VampireClanHomebrew = VampireClanDefinition & Meta<"clan">;
export type VampireCovenantHomebrew = VampireCovenantDefinition & Meta<"covenant">;
export type VampireDisciplineHomebrew = VampireDisciplineDefinition & Meta<"discipline">;
export type VampirePowerHomebrew = VampirePurchasablePower & Meta<"power">;
export type VampireCatalogHomebrew = VampireClanHomebrew | VampireCovenantHomebrew | VampireDisciplineHomebrew | VampirePowerHomebrew;

const powerKinds = new Set<VampirePurchasablePower["kind"]>(["devotion", "cruac-rite", "theban-miracle", "kimiya-formula", "therion-sacrilege", "gilded-invocation", "coil", "scale"]);
const mechanics = (item: Record<string, unknown>): VampireMechanics => Object.fromEntries(["cost", "requirement", "condition", "dicePool", "action", "duration", "contestedBy", "resistedBy", "sacrament", "effect", "procedure", "outcome"].flatMap((key) => homebrewText(item[key]) ? [[key, homebrewText(item[key])]] : []));
const levels = (value: unknown): VampirePowerLevel[] => (Array.isArray(value) ? value : []).flatMap((raw) => {
  const item = homebrewRecord(raw), rating = Number(item.rating), name = homebrewText(item.name), summary = homebrewText(item.summary);
  return Number.isInteger(rating) && rating >= 1 && rating <= 5 && name && summary ? [{ rating, name, translatedName: homebrewText(item.translatedName) || name, summary, ...mechanics(item) }] : [];
}).sort((left, right) => left.rating - right.rating);

export function normalizeVampireCatalogHomebrew(value: unknown): VampireCatalogHomebrew | null {
  const item = homebrewRecord(value), entryType = homebrewText(item.entryType) as VampireHomebrewEntryType, id = homebrewText(item.id), name = homebrewText(item.name), translatedName = homebrewText(item.translatedName) || name;
  if (!id.startsWith("homebrew:vampire:") || !name || !["clan", "covenant", "discipline", "power"].includes(entryType)) return null;
  const meta = { sourceId: VAMPIRE_CATALOG_HOMEBREW_SOURCE_ID, homebrew: true as const, source: VAMPIRE_CATALOG_HOMEBREW_SOURCE, page: 0 };
  if (entryType === "clan") {
    const favored = homebrewStrings(item.favoredAttributes).slice(0, 2), disciplines = homebrewStrings(item.disciplines).slice(0, 3), baneName = homebrewText(item.baneName), baneSummary = homebrewText(item.baneSummary);
    if (favored.length !== 2 || disciplines.length !== 3 || !baneName || !baneSummary) return null;
    return { ...meta, entryType: "clan", id, name, translatedName, favoredAttributes: favored as [string, string], disciplines: disciplines as [string, string, string], baneName, baneSummary, group: ["core", "historical", "uncommon"].includes(homebrewText(item.group)) ? homebrewText(item.group) as VampireClanDefinition["group"] : "uncommon" };
  }
  if (entryType === "covenant") {
    const advantage = homebrewText(item.advantage), description = homebrewText(item.description);
    if (!advantage || !description) return null;
    const group = ["core", "historical", "uncommon", "shadow-cult"].includes(homebrewText(item.group)) ? homebrewText(item.group) as VampireCovenantDefinition["group"] : "uncommon";
    return { ...meta, entryType: "covenant", id, name, translatedName, advantage, description, group };
  }
  if (entryType === "discipline") {
    const summary = homebrewText(item.summary), parsedLevels = levels(item.levels);
    if (!summary || !parsedLevels.length) return null;
    return { ...meta, entryType: "discipline", id, name, translatedName, summary, levels: parsedLevels, physical: item.physical === true, clanIds: homebrewStrings(item.clanIds), covenantIds: homebrewStrings(item.covenantIds), ...mechanics(item) };
  }
  const kind = homebrewText(item.kind) as VampirePurchasablePower["kind"], summary = homebrewText(item.summary), parsedLevels = levels(item.levels);
  if (!powerKinds.has(kind) || !summary || kind === "coil" && !parsedLevels.length) return null;
  const rating = Number(item.rating), experienceCost = Number(item.experienceCost);
  return { ...meta, entryType: "power", id, kind, name, translatedName, summary, ...(Number.isInteger(rating) && rating >= 1 && rating <= 5 ? { rating } : {}), ...(Number.isFinite(experienceCost) && experienceCost >= 0 ? { experienceCost } : {}), prerequisites: homebrewText(item.prerequisites) || undefined, covenantIds: homebrewStrings(item.covenantIds), levels: parsedLevels.length ? parsedLevels : undefined, manualOnly: true, ...mechanics(item) };
}

export function normalizeVampireCatalogHomebrews(value: unknown) {
  return (Array.isArray(value) ? value : []).map(normalizeVampireCatalogHomebrew).filter((item): item is VampireCatalogHomebrew => Boolean(item));
}

const append = <T extends { id: string }>(catalog: readonly T[], custom: readonly T[]) => [...catalog, ...custom.filter((entry) => !catalog.some((item) => item.id === entry.id))];
export function mergeVampireReference(reference: VampireReference, custom: readonly VampireCatalogHomebrew[]): VampireReference {
  return { ...reference, clans: append(reference.clans, custom.filter((item): item is VampireClanHomebrew => item.entryType === "clan")), covenants: append(reference.covenants, custom.filter((item): item is VampireCovenantHomebrew => item.entryType === "covenant")) };
}
export function mergeVampirePowers(powers: VampirePowers, custom: readonly VampireCatalogHomebrew[]): VampirePowers {
  const disciplines = custom.filter((item): item is VampireDisciplineHomebrew => item.entryType === "discipline"), entries = custom.filter((item): item is VampirePowerHomebrew => item.entryType === "power");
  const by = (kind: VampirePurchasablePower["kind"]) => entries.filter((item) => item.kind === kind);
  return { ...powers, disciplines: append(powers.disciplines, disciplines), devotions: append(powers.devotions, by("devotion")), cruacRites: append(powers.cruacRites, by("cruac-rite")), thebanMiracles: append(powers.thebanMiracles, by("theban-miracle")), kimiyaFormulae: append(powers.kimiyaFormulae, by("kimiya-formula")), therionSacrileges: append(powers.therionSacrileges, by("therion-sacrilege")), gildedInvocations: append(powers.gildedInvocations, by("gilded-invocation")), coils: append(powers.coils, by("coil")), scales: append(powers.scales, by("scale")) };
}

export const readVampireCatalogHomebrews = () => readPlayerHomebrews(VAMPIRE_CATALOG_HOMEBREW_KEY, normalizeVampireCatalogHomebrews);
export const hydrateVampireCatalogHomebrews = () => hydratePlayerHomebrews(VAMPIRE_CATALOG_HOMEBREW_KEY, normalizeVampireCatalogHomebrews);
export const saveVampireCatalogHomebrews = (value: unknown) => savePlayerHomebrews(VAMPIRE_CATALOG_HOMEBREW_KEY, value, normalizeVampireCatalogHomebrews);
export const vampireCatalogHomebrewId = (entryType: VampireHomebrewEntryType) => `homebrew:vampire:${entryType}:${createRandomId()}`;
