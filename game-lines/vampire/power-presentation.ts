import type { VampireMechanics } from "./catalog-types";

// Render-only text: rule checks continue to receive the canonical definition.
export function vampirePowerPresentation<T extends VampireMechanics>(definition: T, locale: string): T {
  return locale === "pt-BR" && definition.presentationPt ? { ...definition, ...definition.presentationPt } : definition;
}
