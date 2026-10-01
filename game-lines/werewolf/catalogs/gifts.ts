import type { CatalogGroupModule } from "@/lib/game-line-contracts/catalog-groups";
import type { RenownId, Source } from "./reference";

export type FacetText = {
  name: string; description: string; cost?: string; dicePool?: string; action?: string; duration?: string;
  activationRequirement?: string; effect?: string; options?: string;
  dramaticFailure?: string; failure?: string; success?: string; exceptionalSuccess?: string;
};
export type FacetDefinition = Source & FacetText & {
  id: string; renown: RenownId; level?: number; hasRoll: boolean;
};
export type GiftDefinition = Source & {
  id: string; name: string; kind: "moon" | "shadow" | "wolf";
  auspiceId?: string; renown?: RenownId; facets: FacetDefinition[];
};
export type GiftPresentation = Record<string, Partial<FacetText>>;
export type WerewolfGiftCatalog = { gifts: GiftDefinition[]; presentation: GiftPresentation };

/** Gift data is imported in verified source-book batches; no text parser or global catalog. */
export const werewolfGiftsCatalogGroup: CatalogGroupModule = {
  async load(reader): Promise<WerewolfGiftCatalog> {
    const [moon, moonPresentation, wolf, wolfPresentation] = await Promise.all([
      reader.getCatalog<GiftDefinition[]>("werewolf-gifts-core-moon"),
      reader.getCatalog<GiftPresentation>("werewolf-gifts-core-moon-pt"),
      reader.getCatalog<GiftDefinition[]>("werewolf-gifts-core-wolf"),
      reader.getCatalog<GiftPresentation>("werewolf-gifts-core-wolf-pt"),
    ]);
    return { gifts: [...moon, ...wolf], presentation: { ...moonPresentation, ...wolfPresentation } };
  },
};
