import type { CourtDefinition } from "@/lib/changeling-courts";
import type { KithDefinition } from "@/lib/changeling-kiths";
import { homebrewRecord, homebrewText, hydratePlayerHomebrews, readPlayerHomebrews, savePlayerHomebrews } from "@/lib/player-homebrew-storage";
import { createRandomId } from "@/lib/random-id";
import { canonicalTraitId } from "@/lib/core/character/trait-identities";
import { systemTerm } from "@/lib/system-terms";
import { CTL_SEEMINGS } from "./creation-rules";

export const CHANGELING_CATALOG_HOMEBREW_KEY = "arquivo-das-trevas:changeling-catalog:v1";
export const CHANGELING_CATALOG_HOMEBREW_SOURCE_ID = "homebrew:changeling-player";
export const CHANGELING_CATALOG_HOMEBREW_SOURCE = "Player-created Changeling Content";

export type SeemingDefinition = (typeof CTL_SEEMINGS)[keyof typeof CTL_SEEMINGS];
export type SeemingHomebrew = SeemingDefinition & { entryType: "seeming"; id: string; name: string; sourceId: string; source: string; page: number; homebrew: true };
export type KithHomebrew = KithDefinition & { entryType: "kith"; sourceId: string; homebrew: true };
export type CourtHomebrew = CourtDefinition & { entryType: "court"; homebrew: true };
export type RegaliaHomebrew = { entryType: "regalia"; id: string; name: string; translatedName?: string; sourceId: string; source: string; page: number; homebrew: true };
export type ChangelingCatalogHomebrew = SeemingHomebrew | KithHomebrew | CourtHomebrew | RegaliaHomebrew;
export function changelingRegaliaName(name: string, locale: "pt-BR" | "en-US", catalog: readonly ChangelingCatalogHomebrew[]) {
  const custom = catalog.find((item): item is RegaliaHomebrew => item.entryType === "regalia" && item.name === name);
  return locale === "pt-BR" ? custom?.translatedName || systemTerm(name, locale) : systemTerm(name, locale);
}

export function normalizeChangelingCatalogHomebrew(value: unknown): ChangelingCatalogHomebrew | null {
  const item = homebrewRecord(value), entryType = homebrewText(item.entryType), id = homebrewText(item.id), name = homebrewText(item.name), translatedName = homebrewText(item.translatedName) || name;
  if (!id.startsWith("homebrew:changeling:") || !name) return null;
  const meta = { id, name, sourceId: CHANGELING_CATALOG_HOMEBREW_SOURCE_ID, source: CHANGELING_CATALOG_HOMEBREW_SOURCE, page: 0, homebrew: true as const };
  if (entryType === "regalia") return { ...meta, entryType, translatedName: homebrewText(item.translatedName) || undefined };
  if (entryType === "seeming") {
    const favored = homebrewText(item.favored), regalia = homebrewText(item.regalia), blessing = homebrewText(item.blessing), curse = homebrewText(item.curse), blessingEn = homebrewText(item.blessingEn), curseEn = homebrewText(item.curseEn);
    return favored && regalia && blessing && curse ? { ...meta, entryType, translated: translatedName, favored, regalia, blessing, curse, blessingEn: blessingEn || blessing, curseEn: curseEn || curse } as SeemingHomebrew : null;
  }
  if (entryType === "kith") {
    const skill = canonicalTraitId("skills", homebrewText(item.skill)), description = homebrewText(item.description), blessing = homebrewText(item.blessing);
    return skill && description && blessing ? { ...meta, entryType, translatedName, skill, description, blessing } : null;
  }
  if (entryType === "court") {
    const emotion = homebrewText(item.emotion), emotionPt = homebrewText(item.emotionPt);
    const mantleBenefits = Array.isArray(item.mantleBenefits) ? item.mantleBenefits.map(homebrewText) : [];
    const mantleBenefitsPt = Array.isArray(item.mantleBenefitsPt) ? item.mantleBenefitsPt.map(homebrewText) : [];
    if (!emotion || mantleBenefits.length !== 5 || mantleBenefits.some((benefit) => !benefit)) return null;
    return { ...meta, entryType, translatedName, emotion, emotionPt: emotionPt || emotion, glamourTrigger: homebrewText(item.glamourTrigger) || undefined, glamourTriggerPt: homebrewText(item.glamourTriggerPt) || homebrewText(item.glamourTrigger) || undefined, mantleBenefits, mantleBenefitsPt: mantleBenefitsPt.length === 5 ? mantleBenefitsPt : mantleBenefits };
  }
  return null;
}

export const normalizeChangelingCatalogHomebrews = (value: unknown) => (Array.isArray(value) ? value : []).map(normalizeChangelingCatalogHomebrew).filter((item): item is ChangelingCatalogHomebrew => Boolean(item));
const append = <T extends { id: string }>(catalog: readonly T[], custom: readonly T[]) => [...catalog, ...custom.filter((entry) => !catalog.some((item) => item.id === entry.id))];
export function mergeChangelingReference<T extends { courts: CourtDefinition[]; kiths: KithDefinition[] }>(reference: T, custom: readonly ChangelingCatalogHomebrew[]): T {
  return { ...reference, courts: append(reference.courts, custom.filter((item): item is CourtHomebrew => item.entryType === "court")), kiths: append(reference.kiths, custom.filter((item): item is KithHomebrew => item.entryType === "kith")) };
}
export function mergeChangelingSeemings(custom: readonly ChangelingCatalogHomebrew[]) {
  return Object.fromEntries([...Object.entries(CTL_SEEMINGS), ...custom.filter((item): item is SeemingHomebrew => item.entryType === "seeming").map((item) => [item.name, item])]) as Record<string, SeemingDefinition | SeemingHomebrew>;
}
export const readChangelingCatalogHomebrews = () => readPlayerHomebrews(CHANGELING_CATALOG_HOMEBREW_KEY, normalizeChangelingCatalogHomebrews);
export const hydrateChangelingCatalogHomebrews = () => hydratePlayerHomebrews(CHANGELING_CATALOG_HOMEBREW_KEY, normalizeChangelingCatalogHomebrews);
export const saveChangelingCatalogHomebrews = (value: unknown) => savePlayerHomebrews(CHANGELING_CATALOG_HOMEBREW_KEY, value, normalizeChangelingCatalogHomebrews);
export const changelingCatalogHomebrewId = (entryType: ChangelingCatalogHomebrew["entryType"]) => `homebrew:changeling:${entryType}:${createRandomId()}`;
