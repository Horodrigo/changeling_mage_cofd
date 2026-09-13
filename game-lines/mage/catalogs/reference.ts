import type { CatalogGroupModule } from "@/lib/game-line-contracts/catalog-groups";
import { replaceMageConditionCatalog, type MageCondition } from "@/lib/mage-conditions";

export const mageReferenceCatalogGroup: CatalogGroupModule = {
  load: (reader) => reader.getCatalog<MageCondition[]>("mage-conditions"),
  applyLegacy(snapshot) {
    replaceMageConditionCatalog(snapshot.get<MageCondition[]>("mage-reference"));
  },
};
