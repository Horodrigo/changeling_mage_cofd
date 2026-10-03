import type { CatalogGroupModule } from "@/lib/game-line-contracts/catalog-groups";
import type { ConditionDefinition } from "@/lib/catalog/catalog-types";
import type { CourtDefinition } from "@/lib/changeling-courts";
import type { EntitlementDefinition, EntitlementPresentationCatalog } from "@/lib/entitlements";
import type { KithDefinition } from "@/lib/changeling-kiths";
import type { ContractPresentationCatalog } from "../contract-presentation";
import type { TokenPresentation } from "./tokens";
import { CHANGELING_CONTRACT_SHARDS } from "./contracts";

export type ChangelingReference = {
  conditions: ConditionDefinition[];
  presentation: Record<string, Partial<ConditionDefinition>>;
  courts: CourtDefinition[];
  entitlements: EntitlementDefinition[];
  entitlementPresentation: EntitlementPresentationCatalog;
  kiths: KithDefinition[];
  kithPresentation: Record<string, Pick<KithDefinition, "description" | "blessing" | "skill"> & { name: string }>;
  contractPresentation: ContractPresentationCatalog;
  tokenPresentation: TokenPresentation[];
};

export const changelingReferenceCatalogGroup: CatalogGroupModule = {
  async load(reader): Promise<ChangelingReference> {
    const [conditions, presentation, courts, entitlements, entitlementPresentation, kiths, kithPresentation, contractPresentationShards, tokenPresentation] = await Promise.all([
      reader.getCatalog<ConditionDefinition[]>("changeling-conditions"),
      reader.getCatalog<Record<string, Partial<ConditionDefinition>>>("changeling-conditions-pt"),
      reader.getCatalog<CourtDefinition[]>("changeling-courts"),
      reader.getCatalog<EntitlementDefinition[]>("changeling-entitlements"),
      reader.getCatalog<EntitlementPresentationCatalog>("changeling-entitlements-pt"),
      reader.getCatalog<KithDefinition[]>("changeling-kiths"),
      reader.getCatalog<Record<string, Pick<KithDefinition, "description" | "blessing" | "skill"> & { name: string }>>("changeling-kiths-pt"),
      Promise.all(CHANGELING_CONTRACT_SHARDS.map((shard) => reader.getCatalog<ContractPresentationCatalog>(`changeling-contracts-${shard}-pt`))),
      reader.getCatalog<TokenPresentation[]>("changeling-tokens-pt"),
    ]);
    const contractPresentation = Object.assign({}, ...contractPresentationShards);
    return { conditions, presentation, courts, entitlements, entitlementPresentation, kiths, kithPresentation, contractPresentation, tokenPresentation };
  },
};
