import type { CatalogGroupModule } from "@/lib/game-line-contracts/catalog-groups";
import type { Source } from "./reference";

export type FetishKind = "fetish" | "talen";
export type FetishText = { name: string; description: string; effect: string };
export type FetishVariant = Pick<FetishText, "name" | "effect"> & { id: string };
export type FetishDefinition = Source & FetishText & { id: string; kind: FetishKind; dots: number; facetId?: string; variants?: FetishVariant[] };
export type FetishRulesText = {
  identification: string; creation: string; fetishActivation: string; talenCreation: string;
  talenActivation: string; talenFacet: string; talenInfluence: string;
};
export type WerewolfFetishCatalog = {
  rules: Source & FetishRulesText & { ratings: Array<{ dots: number; effect: string }> }; items: FetishDefinition[];
  presentation: {
    rules: Partial<FetishRulesText> & { ratings?: Record<string, string> };
    items: Record<string, Partial<FetishText> & { variants?: Record<string, Partial<FetishVariant>> }>;
  };
};

export const werewolfFetishesCatalogGroup: CatalogGroupModule = {
  async load(reader): Promise<WerewolfFetishCatalog> {
    const [core, presentation] = await Promise.all([
      reader.getCatalog<Pick<WerewolfFetishCatalog, "rules" | "items">>("werewolf-fetishes-core"),
      reader.getCatalog<WerewolfFetishCatalog["presentation"]>("werewolf-fetishes-core-pt"),
    ]);
    return { ...core, presentation };
  },
};
