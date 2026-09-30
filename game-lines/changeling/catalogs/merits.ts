import type { CatalogGroupModule } from "@/lib/game-line-contracts/catalog-groups";
import type { MeritDefinition, MeritPresentationCatalog } from "@/lib/merits";
import { withMeritPresentation } from "@/lib/merit-presentation";

export const changelingMeritsCatalogGroup: CatalogGroupModule = {
  async load(reader) {
    const [catalog, portuguese] = await Promise.all([
      reader.getCatalog<MeritDefinition[]>("merits-changeling"),
      reader.getCatalog<MeritPresentationCatalog>("merits-changeling-pt"),
    ]);
    return withMeritPresentation(catalog, portuguese);
  },
};
