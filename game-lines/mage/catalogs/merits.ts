import type { CatalogGroupModule } from "@/lib/game-line-contracts/catalog-groups";
import type { MeritDefinition } from "@/lib/merits";

export const mageMeritsCatalogGroup: CatalogGroupModule = {
  load: async (reader) => (await Promise.all([
    reader.getCatalog<MeritDefinition[]>("merits-mage"),
    reader.getCatalog<MeritDefinition[]>("merits-mage-supplements"),
  ])).flat(),
};
