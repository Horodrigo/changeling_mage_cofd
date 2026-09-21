import { getDeviceValue, setDeviceValue, stageDeviceValue } from "@/lib/device-storage";
import type { EntitlementBlessing, EntitlementDefinition, EntitlementRole } from "@/lib/entitlements";
import { HOMEBREW_EVENT } from "@/lib/homebrew";

export const ENTITLEMENT_HOMEBREW_SOURCE_ID = "homebrew:changeling-entitlements";
export const ENTITLEMENT_HOMEBREW_SOURCE = "Player-created Entitlements";
export const ENTITLEMENT_HOMEBREW_KEY = "arquivo-das-trevas:changeling-entitlements:v1";

const record = (value: unknown): Record<string, unknown> => value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : {};
const text = (value: unknown) => String(value ?? "");

const blessing = (value: unknown, index: number): EntitlementBlessing | null => {
  const item = record(value), name = text(item.name).trim(), description = text(item.description).trim();
  if (!name || !description) return null;
  return { id: text(item.id).trim() || `blessing-${index + 1}`, name, description, conditional: item.conditional === true, choiceLabel: text(item.choiceLabel).trim() || undefined };
};

const role = (value: unknown, index: number): EntitlementRole | null => {
  const item = record(value), name = text(item.name).trim();
  if (!name) return null;
  return {
    id: text(item.id).trim() || `role-${index + 1}`,
    name,
    prerequisites: text(item.prerequisites).trim(), privilege: text(item.privilege).trim(), duties: text(item.duties).trim(),
    heraldryColor: text(item.heraldryColor).trim() || undefined, tokenBonus: text(item.tokenBonus).trim(), tokenDrawback: text(item.tokenDrawback).trim(),
  };
};

export function normalizeEntitlementHomebrew(value: unknown): EntitlementDefinition | null {
  const item = record(value), token = record(item.token), id = text(item.id), name = text(item.name).trim(), meritName = text(item.meritName).trim();
  if (!id.startsWith("homebrew:entitlement:") || !name || !meritName) return null;
  const blessings = (Array.isArray(item.blessings) ? item.blessings : []).map(blessing).filter((entry): entry is EntitlementBlessing => Boolean(entry));
  if (!blessings.length) return null;
  const roles = (Array.isArray(item.roles) ? item.roles : []).map(role).filter((entry): entry is EntitlementRole => Boolean(entry));
  return {
    id, name, meritName, source: ENTITLEMENT_HOMEBREW_SOURCE, sourceCode: "Homebrew", sourceId: ENTITLEMENT_HOMEBREW_SOURCE_ID, page: 0, homebrew: true,
    prerequisites: text(item.prerequisites).trim(), purpose: text(item.purpose).trim(), privileges: text(item.privileges).trim(), duties: text(item.duties).trim(), maskAndMien: text(item.maskAndMien).trim(),
    heraldry: text(item.heraldry).trim(), token: { name: text(token.name).trim(), description: text(token.description).trim(), effect: text(token.effect).trim(), catch: text(token.catch).trim(), drawback: text(token.drawback).trim() },
    blessings, ...(roles.length ? { roles } : {}), touchstone: text(item.touchstone).trim(), curse: text(item.curse).trim(), beat: text(item.beat).trim(),
    legends: (Array.isArray(item.legends) ? item.legends : []).map(text).map((entry) => entry.trim()).filter(Boolean),
  };
}

export function normalizeEntitlementHomebrews(value: unknown) {
  return (Array.isArray(value) ? value : []).map(normalizeEntitlementHomebrew).filter((item): item is EntitlementDefinition => Boolean(item));
}

export function readEntitlementHomebrews() {
  if (typeof localStorage === "undefined") return [];
  try { return normalizeEntitlementHomebrews(JSON.parse(localStorage.getItem(ENTITLEMENT_HOMEBREW_KEY) ?? "[]")); }
  catch { return []; }
}

export async function hydrateEntitlementHomebrews() {
  const stored = await getDeviceValue<unknown>(ENTITLEMENT_HOMEBREW_KEY);
  const items = stored === null ? readEntitlementHomebrews() : normalizeEntitlementHomebrews(stored);
  localStorage.setItem(ENTITLEMENT_HOMEBREW_KEY, JSON.stringify(items));
  return items;
}

export function saveEntitlementHomebrews(value: readonly EntitlementDefinition[]) {
  const items = normalizeEntitlementHomebrews(value);
  stageDeviceValue(ENTITLEMENT_HOMEBREW_KEY, items);
  void setDeviceValue(ENTITLEMENT_HOMEBREW_KEY, items);
  window.dispatchEvent(new Event(HOMEBREW_EVENT));
  return items;
}

export const entitlementHomebrewId = () => `homebrew:entitlement:${crypto.randomUUID()}`;
