import type { SpellDefinition } from "./catalog-types";

/**
 * Stable in-memory view used by the existing synchronous rule helpers.
 * Data is populated by catalogService before a Mage screen is rendered.
 */
export const SPELLS: SpellDefinition[] = [];

export function replaceSpellCatalog(spells: SpellDefinition[]) {
  SPELLS.splice(0, SPELLS.length, ...spells);
}

export type { SpellDefinition } from "./catalog-types";
