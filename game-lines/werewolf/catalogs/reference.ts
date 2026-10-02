import type { CatalogGroupModule } from "@/lib/game-line-contracts/catalog-groups";

export type FormId = "hishu" | "dalu" | "gauru" | "urshul" | "urhan";
export type RenownId = "Cunning" | "Glory" | "Honor" | "Purity" | "Wisdom";

export type Source = { sourceId: string; source: string; page: number; additionalPages?: number[] };
export type FormDefinition = Source & {
  id: FormId; name: string; description: string;
  attributes: Partial<Record<string, number>>; size: number; speciesFactor: number;
  perception: number; firearmsDefense: boolean; armorGeneral: number; armorBallistic: number;
  passives: Array<Pick<PassiveDefinition, "id" | "name" | "fields">>;
};
export type FormMechanics = Pick<FormDefinition, "id" | "attributes" | "size" | "speciesFactor" | "perception" | "firearmsDefense" | "armorGeneral" | "armorBallistic">;
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
export type AnchorDefinition = Source & {
  id: string; kind: "blood" | "bone"; name: string; description: string; recoverOne: string; recoverAll: string;
};
export type HarmonyLevel = Source & {
  id: string; rating: number; bans: number; trigger: "passive" | "common" | "specific" | null; control: string;
};
export type BreakingPointDefinition = Source & {
  id: string; direction: "flesh" | "spirit"; description: string; modifier: number; maxHarmony?: number; minHarmony?: number;
};
export type PassiveDefinition = Source & {
  id: string; name: string; fields: Array<{ id: string; label: string; text: string }>;
};
export type WerewolfTraits = {
  anchors: AnchorDefinition[]; harmony: HarmonyLevel[]; breakingPoints: BreakingPointDefinition[]; passives: PassiveDefinition[];
};
export type WerewolfReference = {
  forms: FormDefinition[]; auspices: AuspiceDefinition[]; tribes: TribeDefinition[];
  primalUrge: PrimalUrgeLevel[]; experienceCosts: Record<string, number>;
};
export type WerewolfReferencePresentation = Record<string, {
  name?: string; description?: string; basuImTime?: string; feedingRestriction?: string; huntTime?: string;
  recoverOne?: string; recoverAll?: string; control?: string; fields?: Record<string, { label: string; text: string }>;
}>;
export type WerewolfReferenceCatalog = WerewolfReference & WerewolfTraits & { presentation: WerewolfReferencePresentation };

/** Line-owned English mechanics and ID-keyed localized presentation, never global mutation. */
export const werewolfReferenceCatalogGroup: CatalogGroupModule = {
  async load(reader): Promise<WerewolfReferenceCatalog> {
    const [reference, presentation, traits, traitsPresentation] = await Promise.all([
      reader.getCatalog<WerewolfReference>("werewolf-reference"),
      reader.getCatalog<WerewolfReferencePresentation>("werewolf-reference-pt"),
      reader.getCatalog<WerewolfTraits>("werewolf-traits"),
      reader.getCatalog<WerewolfReferencePresentation>("werewolf-traits-pt"),
    ]);
    return { ...reference, ...traits, presentation: { ...presentation, ...traitsPresentation } };
  },
};
