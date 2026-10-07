import type { VampireCondition } from "./catalog-types";

// Presentation only; saved Condition IDs and instances remain unchanged.
export function vampireConditionPresentation(definition: VampireCondition, locale: string): VampireCondition {
  return locale === "pt-BR" && definition.presentationPt ? { ...definition, ...definition.presentationPt } : definition;
}
