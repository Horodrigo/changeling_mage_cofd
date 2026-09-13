import { CHANGELING_CONDITIONS, type ChangelingCondition } from "./changeling-conditions";

export type MageCondition = ChangelingCondition;

export const MAGE_CONDITIONS: MageCondition[] = [];

export function replaceMageConditionCatalog(items: MageCondition[]) {
  const common = CHANGELING_CONDITIONS.filter(
    (item) => item.sourceCode === "CofD" || item.sourceCode === "HL",
  );
  const combined = [...common, ...items].filter(
    (item, index, array) => array.findIndex((other) => other.id === item.id) === index,
  );
  MAGE_CONDITIONS.splice(0, MAGE_CONDITIONS.length, ...combined);
}

export const findMageCondition = (id: string) =>
  MAGE_CONDITIONS.find((item) => item.id === id);
