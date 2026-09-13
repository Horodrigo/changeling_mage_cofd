import type { CatalogGroupModule } from "@/lib/game-line-contracts/catalog-groups";
import type { ContractDefinition, ContractIndexEntry } from "@/lib/catalog/catalog-types";

export const changelingContractsCatalogGroup: CatalogGroupModule = {
  async load(reader): Promise<ContractDefinition[]> {
    const index = await reader.getCatalog<ContractIndexEntry[]>("changeling-contracts-index");
    const shards = [...new Set(index.map((contract) => contract.shard))];
    return (await Promise.all(shards.map((shard) => reader.getCatalog<ContractDefinition[]>(`changeling-contracts-${shard}`)))).flat();
  },
};
