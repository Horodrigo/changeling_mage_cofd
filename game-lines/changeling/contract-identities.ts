/** Production bridge for schema-2 selections and v1 Homebrews; remove when PT enum records are unsupported. */
export function canonicalContractClassification(value: unknown): unknown {
  if (!value || typeof value !== "object" || Array.isArray(value)) return value;
  const item = value as Record<string, unknown>;
  return {
    ...item,
    ...(item.type === "Comum" ? { type: "Common" } : item.type === "Real" ? { type: "Royal" } : {}),
    ...(item.categoryKind === "Corte" ? { categoryKind: "Court" } : item.categoryKind === "Independente" ? { categoryKind: "Independent" } : {}),
  };
}
