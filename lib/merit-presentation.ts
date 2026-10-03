import type { AppLocale } from "./localized-catalog";
import { qualifyCatalogName } from "./localized-catalog";
import type { MeritDefinition, MeritPresentation, MeritPresentationCatalog } from "./merits";
import type { Requirement } from "./merit-requirements";
import { resolveMeritReference } from "./merit-identity";
import { systemTerm } from "./system-terms";

function requirementPresentation(requirement: Requirement, locale: AppLocale, catalog: readonly MeritDefinition[]): string {
  if ("all" in requirement) return requirement.all.map(item => requirementPresentation(item, locale, catalog)).join("; ");
  if ("any" in requirement) return requirement.any.map(item => requirementPresentation(item, locale, catalog)).join(locale === "pt-BR" ? " ou " : " or ");
  if ("trait" in requirement) return `${systemTerm(requirement.trait, locale)} ${requirement.minimum}`;
  if ("merit" in requirement) {
    const definition = resolveMeritReference(requirement.merit, catalog);
    return `${definition ? meritPresentation(definition, locale).name : requirement.name ?? requirement.merit} ${requirement.minimum ?? 1}`;
  }
  return "";
}

/** Attach presentation only; canonical prerequisites and level identities stay rule-owned. */
export function withMeritPresentation(catalog: readonly MeritDefinition[], portuguese: MeritPresentationCatalog): MeritDefinition[] {
  return catalog.map((item) => portuguese[item.id]
    ? { ...item, translatedName: portuguese[item.id].name, presentationPt: portuguese[item.id] }
    : item);
}

export function meritPresentation(item: MeritDefinition, locale: AppLocale, catalog: readonly MeritDefinition[] = []): MeritPresentation {
  const portuguese = locale === "pt-BR" ? item.presentationPt : undefined;
  return {
    name: qualifyCatalogName(portuguese?.name || (locale === "pt-BR" ? item.translatedName : item.name) || item.name, item, locale),
    description: portuguese?.description || (locale === "en-US" ? item.descriptionEn : item.description) || item.description,
    prerequisites: item.descriptivePrerequisites && item.requirements
      ? [requirementPresentation(item.requirements, locale, catalog), item.narrativePrerequisites].filter(Boolean).join("; ")
      : portuguese?.prerequisites ?? item.prerequisites,
    alternativePrerequisites: portuguese?.alternativePrerequisites ?? item.alternativePrerequisites,
    levels: portuguese?.levels ?? item.levels,
  };
}
