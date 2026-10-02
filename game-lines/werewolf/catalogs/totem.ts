import type { CatalogGroupModule } from "@/lib/game-line-contracts/catalog-groups";
import type { PassiveDefinition, Source, WerewolfReferencePresentation } from "./reference";

export type TotemRank = { rank: number; title: string; traitMaximum: number; attributeMinimum: number; attributeMaximum: number; essenceMaximum: number; numinaMinimum: number; numinaMaximum: number };
export type TotemSample = Source & {
  id: string; name: string; epithet: string; concept: string; aspiration: string; description: string;
  points: number; rank: number; power: number; finesse: number; resistance: number; willpower: number; essence: number;
  initiative: number; defense: number; speed: string; size: number; corpus: number;
  influences: string; manifestations: string; numina: string; ban: string; bane: string; advantage: string; editorialNote?: string;
};
export type TotemSampleText = Pick<TotemSample, "epithet" | "concept" | "aspiration" | "description" | "speed" | "influences" | "manifestations" | "numina" | "ban" | "bane" | "advantage" | "editorialNote">;
export type WerewolfTotemCatalog = {
  rules: PassiveDefinition[]; ranks: TotemRank[];
  advantageBands: Array<{ minimum: number; maximum: number | null; experience: number }>;
  improvementCosts: { attribute: number; influence: number; numen: number };
  samples: TotemSample[];
  presentation: { rules: WerewolfReferencePresentation; samples: Record<string, Partial<TotemSampleText>> };
};

/** Line-owned reference: adopted source-conflict decisions remain explicit in the audit. */
export const werewolfTotemCatalogGroup: CatalogGroupModule = {
  async load(reader): Promise<WerewolfTotemCatalog> {
    const [core, presentation] = await Promise.all([
      reader.getCatalog<Omit<WerewolfTotemCatalog, "presentation">>("werewolf-totem"),
      reader.getCatalog<WerewolfTotemCatalog["presentation"]>("werewolf-totem-pt"),
    ]);
    return { ...core, presentation };
  },
};

export function totemSamplePresentation(item: TotemSample, catalog: WerewolfTotemCatalog, locale: "pt-BR" | "en-US"): TotemSample {
  const text = locale === "pt-BR" ? catalog.presentation.samples[item.id] : undefined;
  return { ...item, epithet: text?.epithet ?? item.epithet, concept: text?.concept ?? item.concept,
    aspiration: text?.aspiration ?? item.aspiration, description: text?.description ?? item.description,
    speed: text?.speed ?? item.speed, influences: text?.influences ?? item.influences, manifestations: text?.manifestations ?? item.manifestations,
    numina: text?.numina ?? item.numina, ban: text?.ban ?? item.ban, bane: text?.bane ?? item.bane,
    advantage: text?.advantage ?? item.advantage, editorialNote: text?.editorialNote ?? item.editorialNote };
}
