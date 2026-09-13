import type { ConditionDefinition } from "./catalog/catalog-types";

export type ChangelingCondition = ConditionDefinition;

type PortugueseConditionPresentation = Partial<Pick<ChangelingCondition, "name" | "category" | "description" | "penalty" | "resolution" | "beat">>;

// Canonical rules data is English-first. Portuguese copy is presentation-only
// and remains untouched pending its own editorial pass.
export const CHANGELING_CONDITIONS: ChangelingCondition[] = [];
let CONDITION_PRESENTATION_PT: Record<string, PortugueseConditionPresentation> = {};

export function replaceChangelingConditionCatalog(
  items: ChangelingCondition[],
  presentation: Record<string, PortugueseConditionPresentation> = {},
) {
  CHANGELING_CONDITIONS.splice(0, CHANGELING_CONDITIONS.length, ...items);
  CONDITION_PRESENTATION_PT = presentation;
}

export function findChangelingCondition(id: string) {
  return CHANGELING_CONDITIONS.find((condition) => condition.id === id);
}

export function changelingConditionPresentation(condition: ChangelingCondition, locale: "pt-BR" | "en-US"): ChangelingCondition {
  if (locale === "en-US") return condition;
  return { ...condition, ...CONDITION_PRESENTATION_PT[condition.id] };
}
