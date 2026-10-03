import data from "./catalog-data/tilts.json";
import type { CatalogNameQualifier } from "./localized-catalog";

export type TiltDefinition = {
  id: string; name: string; translatedName: string; category: "Personal" | "Environmental";
  description: string; effect: string; causing: string; ending: string;
  source: string; sourceCode: string; page: number;
  nameQualifier?: CatalogNameQualifier;
  presentationPt?: Pick<TiltDefinition, "description" | "effect" | "causing" | "ending">;
};

export const TILTS = data as TiltDefinition[];
export const findTilt = (id:string) => TILTS.find((tilt) => tilt.id === id);
export const tiltPresentation = (tilt:TiltDefinition,locale:"pt-BR"|"en-US"):TiltDefinition =>
  locale === "pt-BR" && tilt.presentationPt ? { ...tilt, ...tilt.presentationPt } : tilt;
