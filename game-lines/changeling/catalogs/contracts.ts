import type { CatalogGroupModule } from "@/lib/game-line-contracts/catalog-groups";
import type { ContractDefinition } from "@/lib/catalog/catalog-types";

export const CHANGELING_CONTRACT_SHARDS = [
  "h-courts", "ctl-oak-ash-thorn", "ctl-the-hedge", "ctl-dark-eras", "ctl-kith-and-kin", "ctl-core",
] as const;

export const changelingContractsCatalogGroup: CatalogGroupModule = {
  async load(reader): Promise<ContractDefinition[]> {
    return (await Promise.all(CHANGELING_CONTRACT_SHARDS.map((shard) => reader.getCatalog<ContractDefinition[]>(`changeling-contracts-${shard}`)))).flat();
  },
};
