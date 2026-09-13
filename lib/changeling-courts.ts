import type { Locale } from "./i18n";

export type CourtDefinition = {
  id: string;
  name: string;
  translatedName: string;
  emotion: string;
  emotionPt: string;
  glamourTrigger?: string;
  glamourTriggerPt?: string;
  mantleBenefits: string[];
  mantleBenefitsPt: string[];
  sourceId: "ctl-2ed" | "de2" | "h-courts";
  source: string;
  page: number;
  additionalPages?: number[];
};

export function courtPageCitation(court: Pick<CourtDefinition, "page" | "additionalPages">) {
  return [court.page, ...(court.additionalPages ?? [])].join(", ");
}

/**
 * Test-only catalog replacement retained for legacy catalog-audit fixtures.
 * Production builders and sheets receive courts through CatalogSnapshot.
 */
export const CTL_COURT_DEFINITIONS: CourtDefinition[] = [];

/** @test-only; never import or call this from app/, game-lines/, or worker/. */
export function replaceCourtCatalog(items: CourtDefinition[]) {
  CTL_COURT_DEFINITIONS.splice(0, CTL_COURT_DEFINITIONS.length, ...items);
}

export function courtPresentation(value: unknown, locale: Locale = "pt-BR") {
  const raw = String(value ?? "");
  const normalized = raw.toLocaleLowerCase();
  const definition = CTL_COURT_DEFINITIONS.find((item) =>
    [item.id, item.name, item.translatedName, item.name.replace(/ Court$/, "")].some((candidate) => candidate.toLocaleLowerCase() === normalized),
  );
  if (!definition) return undefined;
  return {
    ...definition,
    name: locale === "en-US" ? definition.name : definition.translatedName,
    emotion: locale === "en-US" ? definition.emotion : definition.emotionPt,
    mantleBenefits: locale === "en-US" ? definition.mantleBenefits : definition.mantleBenefitsPt,
  };
}

export function courtDisplayName(value: unknown, locale: Locale = "pt-BR") {
  const raw=String(value ?? "");
  if (["sem corte","courtless"].includes(raw.trim().toLocaleLowerCase()))
    return locale === "en-US" ? "Courtless" : "Sem Corte";
  return courtPresentation(value, locale)?.name ?? raw;
}

export function courtCanonicalId(value: unknown) {
  return courtPresentation(value, "en-US")?.id ?? String(value ?? "").trim();
}
