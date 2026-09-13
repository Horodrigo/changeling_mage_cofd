import type { CatalogGroupModule } from "@/lib/game-line-contracts/catalog-groups";
import { replaceMageConditionCatalog, type MageCondition } from "@/lib/mage-conditions";

export const mageReferenceCatalogGroup: CatalogGroupModule = {
  load: (reader) => reader.getCatalog<MageCondition[]>("mage-conditions"),
  applyLegacy(snapshot) {
    const core = snapshot.get<{ conditions: MageCondition[] }>("core-reference");
    const mage = snapshot.get<MageCondition[]>("mage-reference");
    replaceMageConditionCatalog([
      ...core.conditions.filter((condition) => condition.sourceCode === "CofD" || condition.sourceCode === "HL"),
      ...mage,
    ]);
  },
};
