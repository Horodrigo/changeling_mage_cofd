import type { AppLocale } from "@/lib/localized-catalog";
import type { TokenDefinition, TokenKind, TokenPresentation } from "./catalogs/tokens";

export type TokenConfigurationItem = { id: string; catalogId?: string; kind: TokenKind; name: string; rating: number; cost: string; effect: string; description: string; crux: string; catch: string; drawback: string };
const TEXT_FIELDS = ["name", "effect", "description", "crux", "catch", "drawback"] as const;

export function withTokenPresentation(catalog: readonly TokenDefinition[], portuguese: readonly TokenPresentation[]) {
  return catalog.map((item) => ({ ...item, presentationPt: portuguese.find((text) => text.id === item.id) }));
}

export function tokenPresentation(item: TokenDefinition, locale: AppLocale) {
  return Object.fromEntries(TEXT_FIELDS.map((field) => [field, (locale === "pt-BR" ? item.presentationPt?.[field] : undefined) ?? item[field] ?? ""])) as Record<typeof TEXT_FIELDS[number], string>;
}

export function configuredTokenPresentation(item: TokenConfigurationItem, catalog: readonly TokenDefinition[], locale: AppLocale): TokenConfigurationItem {
  // Existing schema-2 Token selections copied catalog text without a catalog ID.
  // Sheet/editor/print can identify only exact catalog snapshots (EN or PT), never
  // authored variants. This production bridge can go when ID-less catalog copies
  // are no longer supported; all new selections now retain their catalog ID.
  const definition = item.catalogId
    ? catalog.find((entry) => entry.id === item.catalogId)
    : catalog.find((entry) => entry.kind === item.kind && TEXT_FIELDS.every((field) =>
      (item[field] ?? "") === (entry[field] ?? "") || (item[field] ?? "") === (entry.presentationPt?.[field] ?? entry[field] ?? "")));
  if (!definition || definition.kind !== item.kind) return item;
  const presented = tokenPresentation(definition, locale);
  const result = { ...item, catalogId: definition.id };
  for (const field of TEXT_FIELDS) {
    const stored = item[field] ?? "";
    if (stored === (definition[field] ?? "") || stored === (definition.presentationPt?.[field] ?? definition[field] ?? "")) result[field] = presented[field];
  }
  return result;
}
