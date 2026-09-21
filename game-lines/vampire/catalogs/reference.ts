import type { CatalogGroupModule } from "@/lib/game-line-contracts/catalog-groups";
import type { VampireReference } from "../catalog-types";

export const vampireReferenceCatalogGroup: CatalogGroupModule = {
  async load(reader): Promise<VampireReference> {
    const [clans, covenants, anchors, bloodPotency, torpor, bloodlines] = await Promise.all([
      reader.getCatalog<VampireReference["clans"]>("vampire-clans"),
      reader.getCatalog<VampireReference["covenants"]>("vampire-covenants"),
      reader.getCatalog<VampireReference["anchors"]>("vampire-anchors"),
      reader.getCatalog<VampireReference["bloodPotency"]>("vampire-blood-potency"),
      reader.getCatalog<VampireReference["torpor"]>("vampire-torpor"),
      reader.getCatalog<VampireReference["bloodlines"]>("vampire-bloodlines"),
    ]);
    return { clans, covenants, anchors, bloodPotency, torpor, bloodlines };
  },
};
