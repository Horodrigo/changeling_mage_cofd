import type { CatalogGroupModule } from "@/lib/game-line-contracts/catalog-groups";

export type FormId = "hishu" | "dalu" | "gauru" | "urshul" | "urhan";
export type RenownId = "Cunning" | "Glory" | "Honor" | "Purity" | "Wisdom";

type Source = { sourceId: string; source: string; page: number; additionalPages?: number[] };
export type FormDefinition = Source & {
  id: FormId; name: string; description: string;
  attributes: Partial<Record<string, number>>; size: number; speciesFactor: number;
  perception: number; firearmsDefense: boolean; armorGeneral: number; armorBallistic: number;
};
export type AuspiceDefinition = Source & {
  id: string; name: string; skills: string[]; renown: RenownId; giftIds: string[]; moonGiftId: string;
};
export type TribeDefinition = Source & {
  id: string; name: string; renown: RenownId | null; giftIds: string[];
};
export type PrimalUrgeLevel = Source & {
  id: string; rating: number; traitMaximum: number; essenceMaximum: number; essencePerTurn: number;
  regenerationBashing: number; basuImTime: string; feedingRestriction: string; huntTime: string;
  lunacyPenalty: number; trackingBonus: number;
};
export type WerewolfReference = {
  forms: FormDefinition[]; auspices: AuspiceDefinition[]; tribes: TribeDefinition[];
  primalUrge: PrimalUrgeLevel[]; experienceCosts: Record<string, number>;
};
export type WerewolfReferencePresentation = Record<string, {
  name?: string; description?: string; basuImTime?: string; feedingRestriction?: string; huntTime?: string;
}>;
export type WerewolfReferenceCatalog = WerewolfReference & { presentation: WerewolfReferencePresentation };

/** Line-owned English mechanics and ID-keyed localized presentation, never global mutation. */
export const werewolfReferenceCatalogGroup: CatalogGroupModule = {
  async load(reader): Promise<WerewolfReferenceCatalog> {
    const [reference, presentation] = await Promise.all([
      reader.getCatalog<WerewolfReference>("werewolf-reference"),
      reader.getCatalog<WerewolfReferencePresentation>("werewolf-reference-pt"),
    ]);
    return { ...reference, presentation };
  },
};
