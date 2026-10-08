import type { ConditionDefinition } from "@/lib/catalog/catalog-types";

export type MageConditionDefinition = ConditionDefinition & {
  presentationPt?: Partial<Pick<ConditionDefinition, "name" | "category" | "description" | "penalty" | "resolution" | "beat">>;
};

// Presentation only; saved Condition IDs and instances remain unchanged.
export function mageConditionPresentation(definition: MageConditionDefinition, locale: string): MageConditionDefinition {
  return locale === "pt-BR" && definition.presentationPt ? { ...definition, ...definition.presentationPt } : definition;
}
