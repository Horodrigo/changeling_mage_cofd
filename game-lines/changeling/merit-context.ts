import type { CharacterSheet } from "@/lib/core/character/character-types";
import { meritContextForSheet, meritPrerequisitesMet, meritTextPrerequisitesMet, type MeritDefinition, type MeritPrerequisiteContext } from "@/lib/merits";
import { resolveMeritDefinition } from "@/lib/merit-identity";
import { canonicalTrait } from "@/lib/merit-requirements";

const courtKey=(value:unknown)=>String(value??"").toLowerCase().replace(/^court[- ]/,"").replace(/[- ]court$/,"").replace(/[^a-z]/g,"");

/** CtL owns Court/Seeming/Kith access; Core evaluates only the remaining shared prerequisites. */
export function changelingMeritPrerequisitesMet(merit: Pick<MeritDefinition, "name" | "prerequisites"> & Partial<MeritDefinition>, context: MeritPrerequisiteContext) {
  if (merit.id === "ctl-2ed:lucid-dreamer" && context.archetypes?.includes("changeling")) return false;
  if (merit.kith && canonicalTrait(context.kith) !== canonicalTrait(merit.kith)) return false;
  let prerequisites = merit.prerequisites;
  if (merit.seeming && courtKey(context.seeming) !== courtKey(merit.seeming)) {
    if (!merit.alternativePrerequisites || !meritTextPrerequisitesMet(merit.alternativePrerequisites, context)) return false;
    prerequisites = undefined;
  }
  if (merit.courtAccess?.length) {
    const catalog = context.meritCatalog ?? [], owned = context.merits ?? [];
    const mantle = Math.max(0, Number(context.mantle ?? owned.find(item => resolveMeritDefinition(item, catalog)?.id === "ctl-2ed:mantle")?.dots ?? 0));
    const goodwill = new Map(owned.filter(item => resolveMeritDefinition(item, catalog)?.id === "ctl-2ed:court-goodwill").map(item => [courtKey(item.configuration?.court), item.dots]));
    if (!merit.courtAccess.some(access =>
      (courtKey(context.court) === courtKey(access.court) && mantle >= access.mantle) ||
      (access.courtGoodwill !== undefined && (goodwill.get(courtKey(access.court)) ?? 0) >= access.courtGoodwill)
    )) return false;
    // The catalog's seasonal prefix summarizes courtAccess; validate only its printed remainder.
    prerequisites = prerequisites?.includes(";") ? prerequisites.split(";").slice(1).join(";").trim() : undefined;
  }
  return meritPrerequisitesMet({ ...merit, prerequisites }, context);
}

export function canAdvanceChangelingGrant(merit: CharacterSheet["merits"][number], catalog: readonly MeritDefinition[]) {
  return merit.grantedBy === "Corte" && resolveMeritDefinition(merit, catalog)?.id === "ctl-2ed:mantle";
}

export function changelingExperienceMeritEligible(definition: MeritDefinition, context: MeritPrerequisiteContext) {
  return (definition.id !== "ctl-2ed:mantle" || (context.merits?.some(merit =>
    resolveMeritDefinition(merit, context.meritCatalog ?? [])?.id === definition.id) ?? false)) && changelingMeritPrerequisitesMet(definition, context);
}

export function changelingMeritContextForSheet(sheet: CharacterSheet, catalog: readonly MeritDefinition[]): MeritPrerequisiteContext {
  const data = sheet.line_data;
  const contracts = [...(Array.isArray(data.contracts) ? data.contracts : []), ...(Array.isArray(data.learned_contracts) ? data.learned_contracts : [])];
  return {
    ...meritContextForSheet(sheet, catalog, ["changeling"], data.merit_granted_skill_bonuses as Record<string, number> | undefined),
    seeming: String(data.seeming ?? ""), kith: String(data.kith ?? ""), court: String(data.court ?? ""),
    wyrd: data.wyrd === undefined ? undefined : Number(data.wyrd),
    mantle: sheet.merits.find(item => resolveMeritDefinition(item, catalog)?.id === "ctl-2ed:mantle")?.dots ?? 0,
    powers: contracts.map(item => String(item.originalName ?? item.name ?? "")),
  };
}
