import type { MeritSelection } from "@/lib/core/character/character-types";
import { SKILLS } from "@/lib/core/character/creation-rules";
import type { MeritDefinition } from "@/lib/merits";
import { mergeCreationMerits } from "@/lib/merit-progression";
import { createRandomId } from "@/lib/random-id";
import type { WerewolfMeritChoice } from "./merit-rules";
import type { WerewolfReferenceCatalog, RenownId } from "./catalogs/reference";
import type { GiftDefinition } from "./catalogs/gifts";
import type { RiteDefinition } from "./catalogs/rites";
import { creationAuspiceSkill, creationGiftSelection, creationTemplateProblems, type WerewolfCreationChoices } from "./creation-rules";

/** Canonical schema-2 name/source resolution only; mechanics dispatch on the resulting ID. */
export function werewolfMeritDefinition<T extends Pick<MeritDefinition, "id" | "name" | "sourceId">>(selection: MeritSelection, catalog: readonly T[]) {
  const matches = catalog.filter(item => item.name === selection.name && (!selection.sourceId || item.sourceId === selection.sourceId));
  return matches.length === 1 ? matches[0] : undefined;
}

export function resolveWerewolfMerits(selections: readonly MeritSelection[], catalog: readonly Pick<MeritDefinition, "id" | "name" | "sourceId">[]): WerewolfMeritChoice[] {
  return selections.flatMap(selection => {
    const definition = werewolfMeritDefinition(selection, catalog);
    return definition ? [{ id: definition.id, instanceId: selection.instanceId, dots: selection.dots, configuration: selection.configuration }] : [];
  });
}

/** WTF2 p. 83: both grants are additional to the ten purchased Merit dots. */
const grants = [
  { id: "wtf-2ed:totem", origin: "werewolf:creation-totem" },
  { id: "core-2ed:language", origin: "werewolf:first-tongue", language: "First Tongue" },
] as const;
export const WEREWOLF_CREATION_GRANT_SOURCES = grants.map(grant => grant.origin);

/** Creation-only selections for the Picker; XP allocations are merged separately at save. */
export function withWerewolfCreationGrants(
  selected: readonly MeritSelection[], existing: readonly MeritSelection[], catalog: readonly MeritDefinition[],
): MeritSelection[] {
  const result: MeritSelection[] = selected.map(item => ({ ...item, configuration: item.configuration ? { ...item.configuration } : undefined }));
  for (const grant of grants) {
    const definition = catalog.find(item => item.id === grant.id);
    if (!definition) throw new Error(`Missing required Werewolf creation Merit: ${grant.id}.`);
    const language = "language" in grant ? grant.language : undefined;
    const matches = (item: MeritSelection) => werewolfMeritDefinition(item, catalog)?.id === grant.id &&
      (!language || item.configuration?.language === language || item.grantedBy === grant.origin);
    const index = result.findIndex(matches);
    const previous = existing.find(item => matches(item) && item.grantedBy === grant.origin) ?? existing.find(matches);
    const selection = index >= 0 ? result[index] : undefined;
    const next: MeritSelection = {
      ...selection,
      instanceId: previous?.instanceId ?? selection?.instanceId ?? createRandomId(),
      name: definition.name, sourceId: definition.sourceId, source: definition.source,
      dots: Math.max(1, selection?.dots ?? 1),
      configuration: { ...(selection?.configuration ?? previous?.configuration ?? {}), ...(language ? { language } : {}) },
      grantedBy: grant.origin,
    };
    if (index >= 0) result[index] = next;
    else result.push(next);
  }
  return result;
}

export function werewolfCreationMeritCost(selected: readonly MeritSelection[], catalog: readonly MeritDefinition[]) {
  const counted = new Set<string>();
  return selected.reduce((sum, item) => {
    if (!Number.isInteger(item.dots) || item.dots < 1) throw new Error("Invalid creation Merit dots.");
    const definition = werewolfMeritDefinition(item, catalog);
    const grant = grants.find(grant => grant.id === definition?.id && item.grantedBy === grant.origin &&
      (!("language" in grant) || item.configuration?.language === grant.language));
    const freeDot = grant && !counted.has(grant.id) ? 1 : 0;
    if (grant) counted.add(grant.id);
    return sum + Math.max(0, item.dots - freeDot);
  }, 0);
}

/** Shared exact-instance progression keeps creation grants and XP purchases independent. */
export function mergeWerewolfCreationMerits(existing: MeritSelection[], selected: MeritSelection[], catalog: readonly MeritDefinition[]) {
  return mergeCreationMerits(existing, withWerewolfCreationGrants(selected, existing, catalog));
}

export type AuspiceSkillGrant = { skill: string; dots: 1 };

/** Undo only the explicitly recorded free dot when reopening a Builder, never a guessed bonus. */
export function withoutAuspiceSkillGrant(skills: Record<string, number>, grant: AuspiceSkillGrant | null) {
  if (!grant) return { ...skills };
  if (grant.dots !== 1 || !Object.values(SKILLS).flat().some(skill => skill === grant.skill) || !Number.isInteger(skills[grant.skill]) || skills[grant.skill] < 1)
    throw new Error("Invalid recorded Auspice Skill grant.");
  return { ...skills, [grant.skill]: skills[grant.skill] - 1 };
}

/** Validated creation allocations, not a second character schema or an XP transaction. */
export function werewolfCreationAllocation(
  choices: WerewolfCreationChoices, skills: Record<string, number>, reference: WerewolfReferenceCatalog,
  gifts: readonly GiftDefinition[], rites: readonly RiteDefinition[],
) {
  const problems = creationTemplateProblems(choices, reference, skills, gifts, rites);
  if (problems.length) throw new Error(`Invalid Werewolf creation allocation: ${problems.join(", ")}.`);
  const auspice = reference.auspices.find(item => item.id === choices.auspice_id)!;
  const tribe = reference.tribes.find(item => item.id === choices.tribe_id)!;
  const selected = creationGiftSelection(auspice, tribe, choices.renown_choice as RenownId, gifts, choices);
  return {
    choices: structuredClone(choices),
    skills: creationAuspiceSkill(skills, auspice, choices.auspice_skill),
    auspiceSkillGrant: { skill: choices.auspice_skill, dots: 1 } satisfies AuspiceSkillGrant,
    renown: selected.renown,
    facetIds: [...selected.moonFacetIds, ...choices.shadow_facets, ...choices.wolf_facets],
    riteIds: [...choices.rites],
  };
}
