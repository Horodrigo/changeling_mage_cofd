import type { CatalogGroupModule } from "@/lib/game-line-contracts/catalog-groups";
import type { VampireCondition } from "../catalog-types";

export const vampireConditionsCatalogGroup: CatalogGroupModule = {
  load: (reader) => reader.getCatalog<VampireCondition[]>("vampire-conditions"),
};
