import type { CatalogGroupModule } from "@/lib/game-line-contracts/catalog-groups";
import type { ConditionDefinition } from "@/lib/catalog/catalog-types";

type CoreReference = {
  conditions: ConditionDefinition[];
  presentation: Record<string, Partial<ConditionDefinition>>;
};

export const coreReferenceCatalogGroup: CatalogGroupModule = {
  async load(reader): Promise<CoreReference> {
    const [conditions, presentation] = await Promise.all([
      reader.getCatalog<ConditionDefinition[]>("core-conditions"),
      reader.getCatalog<Record<string, Partial<ConditionDefinition>>>("core-conditions-pt"),
    ]);
    return { conditions, presentation };
  },
};
