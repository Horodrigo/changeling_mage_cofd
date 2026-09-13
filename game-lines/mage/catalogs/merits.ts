import type { CatalogGroupModule } from "@/lib/game-line-contracts/catalog-groups";
import type { MeritDefinition } from "@/lib/merits";

export const mageMeritsCatalogGroup: CatalogGroupModule = {
  load: (reader) => reader.getCatalog<MeritDefinition[]>("merits-mage"),
};
