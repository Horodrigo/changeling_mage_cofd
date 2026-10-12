import type { CatalogGroupModule } from "@/lib/game-line-contracts/catalog-groups";

export type WerewolfLodgeText = {
  name: string;
  summary: string;
  description: string;
  admission?: string;
  recruitment?: string;
  totem?: string;
  blessing?: string;
  aspiration?: string;
  ban?: string;
  sacredHunt?: string;
  access?: string[];
};

export type WerewolfLodgeDefinition = WerewolfLodgeText & {
  id: string;
  sourceId: string;
  source: string;
  page: number;
  additionalSources?: Array<{ sourceId: string; source: string; page: number }>;
  homebrew?: boolean;
  presentationPt?: Partial<WerewolfLodgeText>;
};

export type WerewolfLodgeCatalog = {
  lodges: WerewolfLodgeDefinition[];
  presentation: Record<string, Partial<WerewolfLodgeText>>;
};

export const werewolfLodgesCatalogGroup: CatalogGroupModule = {
  async load(reader): Promise<WerewolfLodgeCatalog> {
    const [catalog, presentation] = await Promise.all([
      reader.getCatalog<Pick<WerewolfLodgeCatalog, "lodges">>("werewolf-lodges"),
      reader.getCatalog<WerewolfLodgeCatalog["presentation"]>("werewolf-lodges-pt"),
    ]);
    return { ...catalog, presentation };
  },
};

export function werewolfLodgePresentation(
  lodge: WerewolfLodgeDefinition,
  catalog: WerewolfLodgeCatalog,
  locale: "pt-BR" | "en-US",
): WerewolfLodgeDefinition {
  if (locale !== "pt-BR" || lodge.homebrew) return lodge;
  const translated = catalog.presentation[lodge.id] ?? lodge.presentationPt;
  if (!translated) return lodge;
  return {
    ...lodge,
    ...translated,
    access: translated.access ?? lodge.access,
  };
}
