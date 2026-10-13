import type { SpellDefinition } from "@/lib/catalog/catalog-types";

export type MageSpellPresentation = Pick<SpellDefinition, "name" | "practice" | "primaryFactor" | "withstand"> & {
  summary: string;
  description: string;
  reach: string;
};

/** Render-only view: never pass this result to a purchase or character update. */
export function mageSpellPresentation(spell: Partial<SpellDefinition>, locale: string): MageSpellPresentation {
  const description = spell.description?.trim() ?? "";
  const start = description.search(/(?:(?:Add|Substitute) (?:Any Other Arcanum|[A-Za-z]+(?: or [A-Za-z]+)?)\s*[•●\d]+|\+\d+ Reach):/i);
  const canonical = {
    name: spell.originalName || spell.name || "",
    practice: spell.practice ?? "",
    primaryFactor: spell.primaryFactor ?? "",
    withstand: spell.withstand ?? "",
    summary: spell.summary?.trim() || description.match(/^.*?[.!?](?:\s|$)/)?.[0]?.trim() || description,
    description,
    reach: start < 0 ? "" : description.slice(start).replace(/\s+(?=(?:(?:Add|Substitute) (?:Any Other Arcanum|[A-Za-z]+(?: or [A-Za-z]+)?)\s*[•●\d]+|\+\d+ Reach):)/gi, " · "),
  };
  const translated = (spell as Partial<SpellDefinition> & { presentationPt?: Partial<MageSpellPresentation> }).presentationPt;
  return locale === "pt-BR" && translated ? { ...canonical, ...translated } : canonical;
}

export function mageSpellSelection<T extends object>(spell: T): T {
  const result = { ...spell };
  delete (result as T & { presentationPt?: unknown }).presentationPt;
  return result;
}
