import type { CharacterSheet } from "@/lib/core/character/character-types";
import { meritContextForSheet, meritPrerequisitesMet, type MeritDefinition, type MeritPrerequisiteContext } from "@/lib/merits";
import { resolveMeritDefinition } from "@/lib/merit-identity";

export function canAdvanceChangelingGrant(merit: CharacterSheet["merits"][number], catalog: readonly MeritDefinition[]) {
  return merit.grantedBy === "Corte" && resolveMeritDefinition(merit, catalog)?.id === "ctl-2ed:mantle";
}

export function changelingExperienceMeritEligible(definition: MeritDefinition, context: MeritPrerequisiteContext) {
  return (definition.id !== "ctl-2ed:mantle" || (context.merits?.some(merit =>
    resolveMeritDefinition(merit, context.meritCatalog ?? [])?.id === definition.id) ?? false)) && meritPrerequisitesMet(definition, context);
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
