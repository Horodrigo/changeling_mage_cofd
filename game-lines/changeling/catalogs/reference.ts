import type { CatalogGroupModule } from "@/lib/game-line-contracts/catalog-groups";
import { replaceChangelingConditionCatalog, type ChangelingCondition } from "@/lib/changeling-conditions";
import { replaceCourtCatalog, type CourtDefinition } from "@/lib/changeling-courts";
import { replaceEntitlementCatalog, type EntitlementDefinition } from "@/lib/entitlements";
import { replaceKithCatalog, type KithDefinition } from "@/lib/changeling-kiths";

type ChangelingReference = {
  conditions: ChangelingCondition[];
  presentation: Record<string, Partial<ChangelingCondition>>;
  courts: CourtDefinition[];
  entitlements: EntitlementDefinition[];
  kiths: KithDefinition[];
  kithPresentation: Record<string, Pick<KithDefinition, "description" | "blessing" | "skill"> & { name: string }>;
};

export const changelingReferenceCatalogGroup: CatalogGroupModule = {
  async load(reader): Promise<ChangelingReference> {
    const [conditions, presentation, courts, entitlements, kiths, kithPresentation] = await Promise.all([
      reader.getCatalog<ChangelingCondition[]>("changeling-conditions"),
      reader.getCatalog<Record<string, Partial<ChangelingCondition>>>("changeling-conditions-pt"),
      reader.getCatalog<CourtDefinition[]>("changeling-courts"),
      reader.getCatalog<EntitlementDefinition[]>("changeling-entitlements"),
      reader.getCatalog<KithDefinition[]>("changeling-kiths"),
      reader.getCatalog<Record<string, Pick<KithDefinition, "description" | "blessing" | "skill"> & { name: string }>>("changeling-kiths-pt"),
    ]);
    return { conditions, presentation, courts, entitlements, kiths, kithPresentation };
  },
  applyLegacy(snapshot) {
    const core = snapshot.get<{ conditions: ChangelingCondition[]; presentation: Record<string, Partial<ChangelingCondition>> }>("core-reference");
    const current = snapshot.get<ChangelingReference>("changeling-reference");
    replaceChangelingConditionCatalog([...core.conditions, ...current.conditions], { ...core.presentation, ...current.presentation });
    replaceCourtCatalog(current.courts);
    replaceEntitlementCatalog(current.entitlements);
    replaceKithCatalog(current.kiths, current.kithPresentation);
  },
};
