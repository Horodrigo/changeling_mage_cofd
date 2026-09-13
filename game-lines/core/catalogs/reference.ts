import type { CatalogGroupModule } from "@/lib/game-line-contracts/catalog-groups";
import { replaceChangelingConditionCatalog, type ChangelingCondition } from "@/lib/changeling-conditions";

type CoreReference = {
  conditions: ChangelingCondition[];
  presentation: Record<string, Partial<ChangelingCondition>>;
};

export const coreReferenceCatalogGroup: CatalogGroupModule = {
  async load(reader): Promise<CoreReference> {
    const [conditions, presentation] = await Promise.all([
      reader.getCatalog<ChangelingCondition[]>("core-conditions"),
      reader.getCatalog<Record<string, Partial<ChangelingCondition>>>("core-conditions-pt"),
    ]);
    return { conditions, presentation };
  },
  applyLegacy(snapshot) {
    const { conditions, presentation } = snapshot.get<CoreReference>("core-reference");
    replaceChangelingConditionCatalog(conditions, presentation);
  },
};
