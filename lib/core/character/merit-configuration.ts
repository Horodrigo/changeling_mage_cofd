import type { PersistedGameLineId } from "./game-line-ids";

export type MeritConfigValue = string | string[];
export type MeritConfiguration = Record<string, MeritConfigValue>;
export type MeritConfigField = {
  key: string;
  label: string;
  kind?: "text" | "textarea" | "list" | "court" | "select" | "merit";
  meritIds?: string[];
  minimumDots?: number | "rating";
  rowsPerDot?: number;
  fixedRows?: number;
  placeholder?: string;
  minDots?: number;
  options?: Array<{ value: string; label: string }>;
};
export type MeritConfigDefinition = {
  name: string;
  fields: MeritConfigField[];
  grants?: boolean;
  line?: PersistedGameLineId;
};

export const normalizeMeritConfiguration = (value: unknown): MeritConfiguration =>
  value && typeof value === "object" && !Array.isArray(value)
    ? Object.fromEntries(Object.entries(value as Record<string, unknown>).map(([key, item]) => [key, Array.isArray(item) ? item.map(String) : String(item ?? "")]))
    : {};

export function meritConfigurationTitle(value: unknown) {
  const configuration = normalizeMeritConfiguration(value);
  for (const key of ["subject", "identity", "language", "place", "group", "appearance", "name", "court", "firstManeuver", "cult", "profession", "focus", "heritage", "yantra", "skill"]) {
    const item = configuration[key];
    if (typeof item === "string" && item.trim()) return item.trim();
  }
  return "";
}
