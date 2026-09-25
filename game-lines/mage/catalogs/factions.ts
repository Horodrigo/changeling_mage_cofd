import type { CatalogGroupModule } from "@/lib/game-line-contracts/catalog-groups";
import type { MageFactionDefinition } from "../factions";

export const mageFactionsCatalogGroup: CatalogGroupModule = {
  load: (reader) => reader.getCatalog<MageFactionDefinition[]>("mage-factions"),
};
