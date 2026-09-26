import type { SpellDefinition } from "@/lib/catalog/spell-catalog";
import { homebrewContentActive, type HomebrewPreferences } from "@/lib/homebrew";
import { createRandomId } from "@/lib/random-id";
import { homebrewRecord, homebrewStrings, homebrewText, hydratePlayerHomebrews, readPlayerHomebrews, savePlayerHomebrews } from "@/lib/player-homebrew-storage";
import { ARCANA } from "./creation-rules";

export type SpellHomebrew = SpellDefinition & { homebrew: true };
export const SPELL_HOMEBREW_KEY = "arquivo-das-trevas:mage-spells:v1";
export const SPELL_HOMEBREW_SOURCE_ID = "homebrew:mage-spells";
export const SPELL_HOMEBREW_SOURCE = "Player-created Spells";

export function normalizeSpellHomebrew(value: unknown): SpellHomebrew | null {
  const item = homebrewRecord(value), id = homebrewText(item.id), name = homebrewText(item.name);
  const requirements = Object.fromEntries(Object.entries(homebrewRecord(item.requirements))
    .filter(([arcanum, rating]) => ARCANA.includes(arcanum) && Number.isInteger(Number(rating)) && Number(rating) >= 1 && Number(rating) <= 5)
    .map(([arcanum, rating]) => [arcanum, Number(rating)]));
  const roteSkills = homebrewStrings(item.roteSkills);
  const practice = homebrewText(item.practice), primaryFactor = homebrewText(item.primaryFactor), withstand = homebrewText(item.withstand), summary = homebrewText(item.summary);
  if (!id.startsWith("homebrew:spell:") || !name || !Object.keys(requirements).length || !roteSkills.length || !practice || !primaryFactor || !summary) return null;
  return { id, name, originalName: name, requirements, practice, primaryFactor, withstand: withstand || "None", roteSkills, summary, description: homebrewText(item.description) || summary, sourceId: SPELL_HOMEBREW_SOURCE_ID, source: SPELL_HOMEBREW_SOURCE, page: 0, homebrew: true };
}

export function normalizeSpellHomebrews(value: unknown) {
  return (Array.isArray(value) ? value : []).map(normalizeSpellHomebrew).filter((item): item is SpellHomebrew => Boolean(item));
}

export const mergeSpellHomebrews = (catalog: readonly SpellDefinition[], custom: readonly SpellHomebrew[]) => {
  const ids = new Set(catalog.map((item) => item.id));
  return [...catalog, ...custom.filter((item) => !ids.has(item.id))];
};

export const activeSpellCatalog = (catalog: readonly SpellDefinition[], custom: readonly SpellHomebrew[], preferences: HomebrewPreferences) =>
  mergeSpellHomebrews(catalog, custom).filter((item) => !item.id.startsWith("homebrew:spell:") || homebrewContentActive(preferences, item.id, SPELL_HOMEBREW_SOURCE_ID));

export const readSpellHomebrews = () => readPlayerHomebrews(SPELL_HOMEBREW_KEY, normalizeSpellHomebrews);
export const hydrateSpellHomebrews = () => hydratePlayerHomebrews(SPELL_HOMEBREW_KEY, normalizeSpellHomebrews);
export const saveSpellHomebrews = (value: unknown) => savePlayerHomebrews(SPELL_HOMEBREW_KEY, value, normalizeSpellHomebrews);
export const spellHomebrewId = () => `homebrew:spell:${createRandomId()}`;
