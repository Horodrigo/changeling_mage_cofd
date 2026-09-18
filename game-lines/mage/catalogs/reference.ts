import type { CatalogGroupModule } from "@/lib/game-line-contracts/catalog-groups";
import type { ConditionDefinition } from "@/lib/catalog/catalog-types";

export const mageReferenceCatalogGroup: CatalogGroupModule = {
  load: (reader) => reader.getCatalog<ConditionDefinition[]>("mage-conditions"),
};
