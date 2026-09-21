import { setDeviceValue, stageDeviceValue } from "./device-storage";

export const HOMEBREW_PREFERENCES_KEY = "arquivo-das-trevas:homebrew-preferences:v1";
export const HOMEBREW_EVENT = "arquivo-das-trevas:homebrew-updated";

export type HomebrewPreferences = { disabledIds: string[] };

export const EMPTY_HOMEBREW_PREFERENCES: HomebrewPreferences = { disabledIds: [] };

export function normalizeHomebrewPreferences(value: unknown): HomebrewPreferences {
  const raw = value && typeof value === "object" ? value as Record<string, unknown> : {};
  return { disabledIds: Array.isArray(raw.disabledIds) ? [...new Set(raw.disabledIds.map(String).filter(Boolean))] : [] };
}

export function readHomebrewPreferences(): HomebrewPreferences {
  if (typeof localStorage === "undefined") return EMPTY_HOMEBREW_PREFERENCES;
  try { return normalizeHomebrewPreferences(JSON.parse(localStorage.getItem(HOMEBREW_PREFERENCES_KEY) ?? "{}")); }
  catch { return EMPTY_HOMEBREW_PREFERENCES; }
}

export function saveHomebrewPreferences(value: HomebrewPreferences) {
  const preferences = normalizeHomebrewPreferences(value);
  stageDeviceValue(HOMEBREW_PREFERENCES_KEY, preferences);
  void setDeviceValue(HOMEBREW_PREFERENCES_KEY, preferences);
  window.dispatchEvent(new Event(HOMEBREW_EVENT));
}

export const isHomebrewSource = (sourceId: unknown) => /^(?:h-|homebrew:)/.test(String(sourceId ?? ""));

export function homebrewContentActive(preferences: HomebrewPreferences, id: string, sourceId?: string) {
  return !isHomebrewSource(sourceId) || (!preferences.disabledIds.includes(id) && !preferences.disabledIds.includes(String(sourceId)));
}

export function setHomebrewEnabled(preferences: HomebrewPreferences, id: string, enabled: boolean) {
  return { disabledIds: enabled ? preferences.disabledIds.filter((item) => item !== id) : [...new Set([...preferences.disabledIds, id])] };
}
