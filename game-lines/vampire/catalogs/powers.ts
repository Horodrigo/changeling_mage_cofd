import type { CatalogGroupModule } from "@/lib/game-line-contracts/catalog-groups";
import type { VampirePowers } from "../catalog-types";

export const vampirePowersCatalogGroup: CatalogGroupModule = {
  load: (reader) => reader.getCatalog<VampirePowers>("vampire-powers"),
};
