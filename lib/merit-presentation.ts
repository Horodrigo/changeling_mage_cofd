import type { AppLocale } from "./localized-catalog";
import type { MeritDefinition, MeritPresentation, MeritPresentationCatalog } from "./merits";

/** Attach presentation only; canonical prerequisites and level identities stay rule-owned. */
export function withMeritPresentation(catalog: readonly MeritDefinition[], portuguese: MeritPresentationCatalog): MeritDefinition[] {
  return catalog.map((item) => portuguese[item.id]
    ? { ...item, translatedName: portuguese[item.id].name, presentationPt: portuguese[item.id] }
    : item);
}

export function meritPresentation(item: MeritDefinition, locale: AppLocale): MeritPresentation {
  const portuguese = locale === "pt-BR" ? item.presentationPt : undefined;
  return {
    name: portuguese?.name || (locale === "pt-BR" ? item.translatedName : item.name) || item.name,
    description: portuguese?.description || (locale === "en-US" ? item.descriptionEn : item.description) || item.description,
    prerequisites: portuguese?.prerequisites ?? item.prerequisites,
    alternativePrerequisites: portuguese?.alternativePrerequisites ?? item.alternativePrerequisites,
    levels: portuguese?.levels ?? item.levels,
  };
}
