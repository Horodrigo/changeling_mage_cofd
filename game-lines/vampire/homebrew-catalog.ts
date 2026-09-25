import { homebrewContentActive, type HomebrewPreferences } from "@/lib/homebrew";
import type { VampirePowers } from "./catalog-types";

export const VAMPIRE_HOMEBREW_SOURCES = {
  "Sin Again: Daeva": "h-vtr-sin-again",
  "Wild Hunt: Gangrel": "h-vtr-wild-hunt",
  "False Gods: Ventrue": "h-vtr-false-gods",
  "Strange Shades: Mekhet": "h-vtr-strange-shades",
  "Better Feared: Nosferatu": "h-vtr-better-feared",
  "Agony & Ecstasy: Circle of the Crone": "h-vtr-agony-ecstasy",
  "Fire & Revolution: Carthians": "h-vtr-fire-revolution",
} as const;

export const SIMPLIFIED_HOLLOW_ID = "vtr-strange-shades:simplified-hollow";

type VampireCatalogItem = { id: string; source: string; sourceId?: string; defaultDisabled?: boolean; errataFor?: string };

export function vampireHomebrewSourceId(item: Pick<VampireCatalogItem, "source" | "sourceId">) {
  return VAMPIRE_HOMEBREW_SOURCES[item.source as keyof typeof VAMPIRE_HOMEBREW_SOURCES] ?? item.sourceId;
}

export function vampireHomebrewContentActive(preferences: HomebrewPreferences, item: VampireCatalogItem) {
  return homebrewContentActive(preferences, item.id, vampireHomebrewSourceId(item), item.defaultDisabled);
}

export function activeVampireItems<T extends VampireCatalogItem>(items: readonly T[], preferences: HomebrewPreferences): T[] {
  const errata = new Map(items.filter((item) => item.errataFor && vampireHomebrewContentActive(preferences, item)).map((item) => [item.errataFor!, item]));
  const normal = items
    .filter((item) => !item.errataFor && vampireHomebrewContentActive(preferences, item))
    .map((item) => {
      const replacement = errata.get(item.id), identity = item as T & { name?: string; translatedName?: string; originalName?: string };
      return replacement ? { ...item, ...replacement, id: item.id, ...(identity.name ? { name: identity.name } : {}), ...(identity.translatedName ? { translatedName: identity.translatedName } : {}), ...(identity.originalName ? { originalName: identity.originalName } : {}) } : item;
    });
  const existing = new Set(normal.map((item) => item.id));
  return [...normal, ...[...errata.entries()].flatMap(([id, item]) => {
    if (existing.has(id)) return [];
    const errataItem = item as T & { name?: string; translatedName?: string; originalName?: string; errataForName?: string };
    const name = errataItem.errataForName ?? errataItem.name;
    return [{ ...item, id, ...(name ? { name, translatedName: name, originalName: name } : {}) } as T];
  })];
}

export function activeVampirePowers(powers: VampirePowers, preferences: HomebrewPreferences): VampirePowers {
  return {
    ...powers,
    devotions: activeVampireItems(powers.devotions, preferences),
    cruacRites: activeVampireItems(powers.cruacRites, preferences),
    thebanMiracles: activeVampireItems(powers.thebanMiracles, preferences),
    kimiyaFormulae: activeVampireItems(powers.kimiyaFormulae, preferences),
    therionSacrileges: activeVampireItems(powers.therionSacrileges, preferences),
    gildedInvocations: activeVampireItems(powers.gildedInvocations, preferences),
    coils: activeVampireItems(powers.coils, preferences),
    scales: activeVampireItems(powers.scales, preferences),
    detournements: activeVampireItems(powers.detournements, preferences),
  };
}
