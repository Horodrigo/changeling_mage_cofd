import type { Locale } from "@/lib/i18n";
import type { VampireAnchorDefinition, VampireClanDefinition, VampireCovenantDefinition } from "./catalog-types";

export function vampireAnchorPresentation(definition: VampireAnchorDefinition, locale: Locale) {
  return locale === "pt-BR" && definition.presentationPt ? { ...definition, ...definition.presentationPt } : definition;
}

export function vampireClanPresentation(definition: VampireClanDefinition, locale: Locale) {
  return locale === "pt-BR" && definition.presentationPt ? { ...definition, ...definition.presentationPt } : definition;
}

export function vampireCovenantPresentation(definition: VampireCovenantDefinition, locale: Locale) {
  return locale === "pt-BR" && definition.presentationPt ? { ...definition, ...definition.presentationPt } : definition;
}
