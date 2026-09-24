import { homebrewContentActive, type HomebrewPreferences } from "@/lib/homebrew";

export const VAMPIRE_HOMEBREW_SOURCES = {
  "Sin Again: Daeva": "h-vtr-sin-again",
  "Wild Hunt: Gangrel": "h-vtr-wild-hunt",
  "False Gods: Ventrue": "h-vtr-false-gods",
  "Strange Shades: Mekhet": "h-vtr-strange-shades",
  "Better Feared: Nosferatu": "h-vtr-better-feared",
} as const;

export const SIMPLIFIED_HOLLOW_ID = "vtr-strange-shades:simplified-hollow";

type VampireCatalogItem = { id: string; source: string; sourceId?: string };

export function vampireHomebrewSourceId(item: Pick<VampireCatalogItem, "source" | "sourceId">) {
  return VAMPIRE_HOMEBREW_SOURCES[item.source as keyof typeof VAMPIRE_HOMEBREW_SOURCES] ?? item.sourceId;
}

export function vampireHomebrewContentActive(preferences: HomebrewPreferences, item: VampireCatalogItem) {
  return homebrewContentActive(preferences, item.id, vampireHomebrewSourceId(item));
}
