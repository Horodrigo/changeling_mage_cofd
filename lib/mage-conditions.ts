import type { ConditionDefinition } from "./catalog/catalog-types";

export type MageCondition = ConditionDefinition;

export const MAGE_CONDITIONS: MageCondition[] = [];

export function replaceMageConditionCatalog(items: MageCondition[]) {
  const unique = items.filter(
    (item, index, array) => array.findIndex((other) => other.id === item.id) === index,
  );
  MAGE_CONDITIONS.splice(0, MAGE_CONDITIONS.length, ...unique);
}

export const findMageCondition = (id: string) =>
  MAGE_CONDITIONS.find((item) => item.id === id);
