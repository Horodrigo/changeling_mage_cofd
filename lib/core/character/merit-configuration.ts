import type { PersistedGameLineId } from "./game-line-ids";
import type { MeritSelection } from "./character-types";
import type { MeritDefinition } from "@/lib/merits";

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
  id: string;
  name: string;
  fields: MeritConfigField[];
  grants?: boolean;
  line?: PersistedGameLineId;
};

export const normalizeMeritConfiguration = (value: unknown): MeritConfiguration =>
  value && typeof value === "object" && !Array.isArray(value)
    ? Object.fromEntries(Object.entries(value as Record<string, unknown>).map(([key, item]) => [key, Array.isArray(item) ? item.map(String) : String(item ?? "")]))
    : {};

type MeritGrantChoice = Pick<MeritSelection, "definitionId" | "name" | "dots" | "sourceId" | "source">;

/** Catalog choices keep canonical identity; the name is only an unavailable-catalog display fallback. */
export function encodeMeritGrantChoice(definition: MeritDefinition, dots: number) {
  return JSON.stringify({ definitionId: definition.id, name: definition.name, dots, sourceId: definition.sourceId, source: definition.source });
}

/**
 * Core grants, their editor and summaries consume these rows in production.
 * The name|dots branch preserves existing schema-2 choices without inventing IDs.
 * Delete it once those name-only configuration rows are no longer supported.
 */
export function decodeMeritGrantChoice(value: unknown): MeritGrantChoice | undefined {
  if (typeof value !== "string") return undefined;
  if (value.trimStart().startsWith("{")) {
    try {
      const item = JSON.parse(value);
      if (!item || typeof item !== "object" || typeof item.definitionId !== "string" || !item.definitionId.trim() ||
          typeof item.name !== "string" || !item.name.trim() || !Number.isSafeInteger(item.dots) || item.dots < 1 ||
          (item.sourceId !== undefined && typeof item.sourceId !== "string") || (item.source !== undefined && typeof item.source !== "string")) return undefined;
      return { definitionId: item.definitionId, name: item.name, dots: item.dots, ...(item.sourceId === undefined ? {} : { sourceId: item.sourceId }), ...(item.source === undefined ? {} : { source: item.source }) };
    } catch {
      return undefined;
    }
  }
  const parts = value.split("|");
  const dots = Number(parts[1]);
  return parts.length === 2 && parts[0].trim() && Number.isSafeInteger(dots) && dots > 0 ? { name: parts[0], dots } : undefined;
}

export function meritConfigurationTitle(value: unknown) {
  const configuration = normalizeMeritConfiguration(value);
  for (const key of ["subject", "specialty_name", "identity", "language", "place", "group", "appearance", "name", "court", "firstManeuver", "cult", "profession", "focus", "heritage", "yantra", "skill"]) {
    const item = configuration[key];
    if (typeof item === "string" && item.trim()) return item.trim();
  }
  return "";
}
