import type { CatalogGroupModule } from "@/lib/game-line-contracts/catalog-groups";
import type { MeritDefinition, MeritPresentationCatalog } from "@/lib/merits";
import { withMeritPresentation } from "@/lib/merit-presentation";

export const werewolfMeritsCatalogGroup: CatalogGroupModule = {
  async load(reader) {
    const [catalog, portuguese] = await Promise.all([
      reader.getCatalog<MeritDefinition[]>("merits-werewolf"),
      reader.getCatalog<MeritPresentationCatalog>("merits-werewolf-pt"),
    ]);
    return withMeritPresentation(catalog, portuguese);
  },
};
