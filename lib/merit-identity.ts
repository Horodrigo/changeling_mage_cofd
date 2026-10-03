import type { MeritSelection } from "./core/character/character-types";
import type { MeritDefinition } from "./merits";

type MeritIdentity = Pick<MeritSelection, "name" | "definitionId" | "sourceId">;

/**
 * IDs are authoritative, even when their definition is currently unavailable.
 * The canonical-name/source fallback is only for existing schema-2 selections
 * saved before definitionId. Builder, Sheet and purchase consumers may use it
 * in production; delete it once those ID-less selections are no longer supported.
 * Never match translated names or guess between multiple definitions.
 */
export function resolveMeritDefinition(selection: MeritIdentity, catalog: readonly MeritDefinition[]) {
  if (selection.definitionId) return catalog.find(item => item.id === selection.definitionId);
  const candidates = catalog.filter(item => item.name === selection.name && (!selection.sourceId ||
    item.sourceId === selection.sourceId || item.additionalSources?.some(source => source.sourceId === selection.sourceId)));
  return candidates.length === 1 ? candidates[0] : undefined;
}

export function meritMatchesDefinition(selection: MeritIdentity, definition: MeritDefinition, catalog: readonly MeritDefinition[]) {
  return resolveMeritDefinition(selection, catalog)?.id === definition.id;
}
