import type { CatalogGroupModule } from "@/lib/game-line-contracts/catalog-groups";
import type { Source } from "./reference";

export type RiteText = {
  name: string; description: string; symbols: string; sampleRite: string; sampleDicePool: string;
  action: string; success: string; cost?: string; duration?: string; prerequisites?: string;
};
export type RiteDefinition = Source & RiteText & { id: string; kind: "wolf" | "pack"; dots: number; tribeId?: string };
export type RiteRulesText = {
  dicePool: string; participants: string; symbolism: string; interruption: string; learning: string;
  modifiers: string; dramaticFailure: string; failure: string; success: string; exceptionalSuccess: string;
};
export type WerewolfRiteCatalog = {
  rules: Source & RiteRulesText; rites: RiteDefinition[];
  presentation: { rules: Partial<RiteRulesText>; rites: Record<string, Partial<RiteText>> };
};

export const werewolfRitesCatalogGroup: CatalogGroupModule = {
  async load(reader): Promise<WerewolfRiteCatalog> {
    const [core, presentation] = await Promise.all([
      reader.getCatalog<Pick<WerewolfRiteCatalog, "rules" | "rites">>("werewolf-rites-core"),
      reader.getCatalog<WerewolfRiteCatalog["presentation"]>("werewolf-rites-core-pt"),
    ]);
    return { ...core, presentation };
  },
};
