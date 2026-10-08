import type { CatalogGroupModule } from "@/lib/game-line-contracts/catalog-groups";
import type { MageConditionDefinition } from "../condition-presentation";

export const mageReferenceCatalogGroup: CatalogGroupModule = {
  load: (reader) => reader.getCatalog<MageConditionDefinition[]>("mage-conditions"),
};
