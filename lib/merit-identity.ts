import type { MeritSelection } from "./core/character/character-types";
import type { MeritDefinition } from "./merits";

type MeritIdentity = Pick<MeritSelection, "name" | "definitionId" | "sourceId">;
export type DefinitionIdentity = Pick<MeritDefinition, "id" | "name" | "sourceId" | "additionalSources">;

/** ID-less schema-2 rows may receive an ID when purchased; explicit IDs must target one row. */
export function meritInstanceIsUnique(selection: Pick<MeritSelection, "instanceId">, owned: readonly Pick<MeritSelection, "instanceId">[]) {
  return !selection.instanceId || owned.filter(item => item.instanceId === selection.instanceId).length === 1;
}

/** New requirement references are IDs. Only unambiguous canonical names bridge old schema-2 Homebrews. */
export function resolveMeritReference<T extends DefinitionIdentity>(reference: string, catalog: readonly T[]) {
  return catalog.find(item => item.id === reference) ?? (reference.includes(":") ? undefined : resolveMeritDefinition({ name: reference }, catalog));
}

/**
 * IDs are authoritative, even when their definition is currently unavailable.
 * The canonical-name/source fallback is only for existing schema-2 selections
 * saved before definitionId. Builder, Sheet and purchase consumers may use it
 * in production; delete it once those ID-less selections are no longer supported.
 * Never match translated names or guess between multiple definitions.
 */
export function resolveMeritDefinition<T extends DefinitionIdentity>(selection: MeritIdentity, catalog: readonly T[]) {
  if (selection.definitionId) return catalog.find(item => item.id === selection.definitionId);
  const candidates = catalog.filter(item => item.name === selection.name && (!selection.sourceId ||
    item.sourceId === selection.sourceId || item.additionalSources?.some(source => source.sourceId === selection.sourceId)));
  return candidates.length === 1 ? candidates[0] : undefined;
}

export function meritMatchesDefinition(selection: MeritIdentity, definition: MeritDefinition, catalog: readonly MeritDefinition[]) {
  return resolveMeritDefinition(selection, catalog)?.id === definition.id;
}
