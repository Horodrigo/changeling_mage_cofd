import type { CatalogGroupModule } from "@/lib/game-line-contracts/catalog-groups";
import type { MeritDefinition, MeritPresentationCatalog } from "@/lib/merits";
import { withMeritPresentation } from "@/lib/merit-presentation";

export const coreMeritsCatalogGroup: CatalogGroupModule = {
  async load(reader) {
    const [catalog, portuguese] = await Promise.all([
      reader.getCatalog<MeritDefinition[]>("merits-core"),
      reader.getCatalog<MeritPresentationCatalog>("merits-core-pt"),
    ]);
    return withMeritPresentation(catalog, portuguese);
  },
};
