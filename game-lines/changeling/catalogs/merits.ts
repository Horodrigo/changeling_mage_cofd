import type { CatalogGroupModule } from "@/lib/game-line-contracts/catalog-groups";
import { replaceMeritCatalog, type MeritDefinition } from "@/lib/merits";

export const changelingMeritsCatalogGroup: CatalogGroupModule = {
  load: (reader) => reader.getCatalog<MeritDefinition[]>("merits-changeling"),
  applyLegacy(snapshot) {
    replaceMeritCatalog([
      ...snapshot.get<MeritDefinition[]>("core-merits"),
      ...snapshot.get<MeritDefinition[]>("changeling-merits"),
    ]);
  },
};
