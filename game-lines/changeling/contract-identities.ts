import { canonicalStoredRegalia } from "@/lib/changeling-regalia";
import type { ContractDefinition } from "./contract-types";
import type { ContractPresentationCatalog } from "./contract-presentation";

/** Production bridge for schema-2 selections and v1 Homebrews; remove when PT enum records are unsupported. */
export function canonicalContractClassification(value: unknown): unknown {
  if (!value || typeof value !== "object" || Array.isArray(value)) return value;
  const item = value as Record<string, unknown>;
  return {
    ...item,
    ...(item.type === "Comum" ? { type: "Common" } : item.type === "Real" ? { type: "Royal" } : {}),
    ...(item.categoryKind === "Corte" ? { categoryKind: "Court" } : item.categoryKind === "Independente" ? { categoryKind: "Independent" } : {}),
    ...(typeof item.regalia === "string" ? { regalia: canonicalStoredRegalia(item.regalia) } : {}),
  };
}

/** Recover only exact published PT presentation fields; preserve all other snapshot text. */
export function canonicalContractSnapshot(value: unknown, catalog: readonly ContractDefinition[], presentations: ContractPresentationCatalog): unknown {
  const classified = canonicalContractClassification(value);
  if (!classified || typeof classified !== "object" || Array.isArray(classified)) return classified;
  const item = classified as Record<string, unknown>;
  if (item.homebrew || typeof item.id !== "string" || typeof item.sourceId !== "string") return classified;
  const official = catalog.find(entry => entry.id === item.id && entry.sourceId === item.sourceId);
  const localized = presentations[item.id];
  if (!official || !localized) return classified;
  const canonical = official as unknown as Record<string, unknown>;
  const next = { ...item };
  for (const [field, translation] of Object.entries(localized)) {
    if (!Object.hasOwn(item, field) || !Object.hasOwn(canonical, field)) continue;
    if (JSON.stringify(item[field]) === JSON.stringify(translation)) next[field] = structuredClone(canonical[field]);
  }
  return next;
}

export function ownedContractDefinition(value: Record<string, unknown>, catalog: readonly ContractDefinition[]): ContractDefinition | undefined {
  const id = typeof value.id === "string" ? value.id : "";
  const sourceId = typeof value.sourceId === "string" ? value.sourceId : "";
  if (id) return catalog.find(item => item.id === id && (!sourceId || item.sourceId === sourceId));
  const name = typeof value.name === "string" ? value.name : "";
  if (!name) return undefined;
  const matches = catalog.filter(item => item.name === name && (!sourceId || item.sourceId === sourceId));
  return matches.length === 1 ? matches[0] : undefined;
}
