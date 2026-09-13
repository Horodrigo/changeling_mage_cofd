import type { CatalogGroupId, CatalogGroupLoader } from "@/lib/game-line-contracts/catalog-groups";
import { catalogService } from "@/lib/catalog/catalog-service";

/** Explicit lazy mapping: no group implementation enters the eager registry. */
const groupLoaders: Readonly<Record<CatalogGroupId, CatalogGroupLoader>> = {
  "core-merits": () => import("../core/catalogs/merits").then(({ coreMeritsCatalogGroup }) => coreMeritsCatalogGroup),
  "core-reference": () => import("../core/catalogs/reference").then(({ coreReferenceCatalogGroup }) => coreReferenceCatalogGroup),
  "mage-merits": () => import("../mage/catalogs/merits").then(({ mageMeritsCatalogGroup }) => mageMeritsCatalogGroup),
  "mage-spells": () => import("../mage/catalogs/spells").then(({ mageSpellsCatalogGroup }) => mageSpellsCatalogGroup),
  "mage-reference": () => import("../mage/catalogs/reference").then(({ mageReferenceCatalogGroup }) => mageReferenceCatalogGroup),
  "changeling-merits": () => import("../changeling/catalogs/merits").then(({ changelingMeritsCatalogGroup }) => changelingMeritsCatalogGroup),
  "changeling-contracts": () => import("../changeling/catalogs/contracts").then(({ changelingContractsCatalogGroup }) => changelingContractsCatalogGroup),
  "changeling-reference": () => import("../changeling/catalogs/reference").then(({ changelingReferenceCatalogGroup }) => changelingReferenceCatalogGroup),
};

export async function loadCatalogGroups(groupIds: readonly CatalogGroupId[]) {
  const modules = await Promise.all(groupIds.map(async (id) => {
    const loader = groupLoaders[id];
    if (!loader) throw new Error(`No catalog group is registered for ${id}.`);
    return [id, await loader()] as const;
  }));
  // All active surfaces consume the returned immutable snapshot directly.
  // Legacy adapters remain inert until their inactive callers are deleted.
  return catalogService.loadGroups(modules);
}
