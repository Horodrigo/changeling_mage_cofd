import type { CatalogGroupModule } from "@/lib/game-line-contracts/catalog-groups";
import { replaceMeritCatalog, type MeritDefinition } from "@/lib/merits";

export const mageMeritsCatalogGroup: CatalogGroupModule = {
  load: (reader) => reader.getCatalog<MeritDefinition[]>("merits-mage"),
  applyLegacy(snapshot) {
    replaceMeritCatalog([
      ...snapshot.get<MeritDefinition[]>("core-merits"),
      ...snapshot.get<MeritDefinition[]>("mage-merits"),
    ]);
  },
};
