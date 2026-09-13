import type { CatalogGroupModule } from "@/lib/game-line-contracts/catalog-groups";
import { replaceSpellCatalog } from "@/lib/catalog/spell-catalog";
import type { SpellDefinition, SpellIndexEntry } from "@/lib/catalog/catalog-types";

export const mageSpellsCatalogGroup: CatalogGroupModule = {
  async load(reader): Promise<SpellDefinition[]> {
    const index = await reader.getCatalog<SpellIndexEntry[]>("mage-spells-index");
    const shards = [...new Set(index.map((spell) => spell.shard))];
    return (await Promise.all(shards.map((shard) => reader.getCatalog<SpellDefinition[]>(`mage-spells-${shard}`)))).flat();
  },
  applyLegacy(snapshot) {
    replaceSpellCatalog(snapshot.get<SpellDefinition[]>("mage-spells"));
  },
};
