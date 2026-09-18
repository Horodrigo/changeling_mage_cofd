import type { CatalogGroupModule } from "@/lib/game-line-contracts/catalog-groups";
import type { ConditionDefinition } from "@/lib/catalog/catalog-types";
import type { CourtDefinition } from "@/lib/changeling-courts";
import type { EntitlementDefinition } from "@/lib/entitlements";
import type { KithDefinition } from "@/lib/changeling-kiths";

type ChangelingReference = {
  conditions: ConditionDefinition[];
  presentation: Record<string, Partial<ConditionDefinition>>;
  courts: CourtDefinition[];
  entitlements: EntitlementDefinition[];
  kiths: KithDefinition[];
  kithPresentation: Record<string, Pick<KithDefinition, "description" | "blessing" | "skill"> & { name: string }>;
};

export const changelingReferenceCatalogGroup: CatalogGroupModule = {
  async load(reader): Promise<ChangelingReference> {
    const [conditions, presentation, courts, entitlements, kiths, kithPresentation] = await Promise.all([
      reader.getCatalog<ConditionDefinition[]>("changeling-conditions"),
      reader.getCatalog<Record<string, Partial<ConditionDefinition>>>("changeling-conditions-pt"),
      reader.getCatalog<CourtDefinition[]>("changeling-courts"),
      reader.getCatalog<EntitlementDefinition[]>("changeling-entitlements"),
      reader.getCatalog<KithDefinition[]>("changeling-kiths"),
      reader.getCatalog<Record<string, Pick<KithDefinition, "description" | "blessing" | "skill"> & { name: string }>>("changeling-kiths-pt"),
    ]);
    return { conditions, presentation, courts, entitlements, kiths, kithPresentation };
  },
};
