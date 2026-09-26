import { getDeviceValue, setDeviceValue, stageDeviceValue } from "./device-storage";
import { HOMEBREW_EVENT } from "./homebrew";

export const homebrewRecord = (value: unknown): Record<string, unknown> =>
  value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : {};
export const homebrewText = (value: unknown) => String(value ?? "").trim();
export const homebrewStrings = (value: unknown) => [...new Set((Array.isArray(value) ? value : []).map(homebrewText).filter(Boolean))];

export function readPlayerHomebrews<T>(key: string, normalize: (value: unknown) => T[]) {
  if (typeof localStorage === "undefined") return [];
  try { return normalize(JSON.parse(localStorage.getItem(key) ?? "[]")); }
  catch { return []; }
}

export async function hydratePlayerHomebrews<T>(key: string, normalize: (value: unknown) => T[]) {
  const stored = await getDeviceValue<unknown>(key);
  const items = stored === null ? readPlayerHomebrews(key, normalize) : normalize(stored);
  localStorage.setItem(key, JSON.stringify(items));
  return items;
}

export function savePlayerHomebrews<T>(key: string, value: unknown, normalize: (value: unknown) => T[]) {
  const items = normalize(value);
  stageDeviceValue(key, items);
  void setDeviceValue(key, items);
  window.dispatchEvent(new Event(HOMEBREW_EVENT));
  return items;
}
