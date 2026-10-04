import type { CatalogGroupModule } from "@/lib/game-line-contracts/catalog-groups";
import type { MeritDefinition, MeritPresentationCatalog } from "@/lib/merits";
import { withMeritPresentation } from "@/lib/merit-presentation";

export const vampireMeritsCatalogGroup: CatalogGroupModule = {
  async load(reader) {
    const [catalog, portuguese] = await Promise.all([
      reader.getCatalog<MeritDefinition[]>("merits-vampire"),
      reader.getCatalog<MeritPresentationCatalog>("merits-vampire-pt"),
    ]);
    return withMeritPresentation(catalog, portuguese);
  },
};
