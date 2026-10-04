import type { Locale } from "@/lib/i18n";
import type { VampireAnchorDefinition } from "./catalog-types";

export function vampireAnchorPresentation(definition: VampireAnchorDefinition, locale: Locale) {
  return locale === "pt-BR" && definition.presentationPt ? { ...definition, ...definition.presentationPt } : definition;
}
