import type { CatalogGroupModule } from "@/lib/game-line-contracts/catalog-groups";

export type TokenKind = "token" | "trifle" | "bauble";

export type TokenDefinition = {
  id: string;
  kind: TokenKind;
  name: string;
  rating: number;
  effect?: string;
  description?: string;
  crux?: string;
  catch?: string;
  drawback?: string;
  sourceId: string;
  source: string;
  page: number;
  presentationPt?: TokenPresentation;
};

export type TokenPresentation = Pick<TokenDefinition, "id"> & Partial<Omit<TokenDefinition, "id" | "presentationPt">>;

export const changelingTokensCatalogGroup: CatalogGroupModule = {
  load: (reader) => reader.getCatalog<TokenDefinition[]>("changeling-tokens"),
};
