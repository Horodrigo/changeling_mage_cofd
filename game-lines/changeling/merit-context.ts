import type { CharacterSheet } from "@/lib/core/character/character-types";
import { meritContextForSheet, meritPrerequisitesMet, meritGroupedPrerequisitesMet, type MeritDefinition, type MeritPrerequisiteContext } from "@/lib/merits";
import { resolveMeritDefinition } from "@/lib/merit-identity";
import { canonicalTrait, textRequirementMet } from "@/lib/merit-requirements";

export type ChangelingMeritDefinition = MeritDefinition & {
  courtAccess?: Array<{ court: "Spring" | "Summer" | "Autumn" | "Winter"; mantle: number; courtGoodwill?: number }>;
  seeming?: "Beast" | "Darkling" | "Elemental" | "Fairest" | "Ogre" | "Wizened";
  kith?: string;
};
export type ChangelingMeritContext = MeritPrerequisiteContext & {
  seeming?: string; kith?: string; wyrd?: number; powers?: string[]; court?: string; mantle?: number;
};

const courtKey=(value:unknown)=>String(value??"").toLowerCase().replace(/^court[- ]/,"").replace(/[- ]court$/,"").replace(/[^a-z]/g,"");
const SEEMING_NAMES=["Beast","Darkling","Elemental","Fairest","Ogre","Wizened"];

export function changelingTextPrerequisitesMet(value: string | undefined, context: ChangelingMeritContext): boolean {
  if (!value) return true;
  if (!/one (?:Mental|Physical|Social) Attribute|any Social Skill|Contract of|≤|maximum|or lower/i.test(value)) {
    return textRequirementMet(value, context, context.meritCatalog ?? [], clause => {
      if (/^non[- ]?changeling$/i.test(clause)) return !context.archetypes?.includes("changeling");
      if (/^Changeling$/i.test(clause)) return Boolean(context.archetypes?.includes("changeling"));
      const name=clause.replace(/\s*(?:•+|\d+\+?).*$/,"").trim();
      if (/\bkith\b/i.test(name)) return canonicalTrait(context.kith) === canonicalTrait(name.replace(/\bkith\b/ig, "").trim());
      if (SEEMING_NAMES.some(item => canonicalTrait(item) === canonicalTrait(name))) return canonicalTrait(context.seeming) === canonicalTrait(name);
      return undefined;
    });
  }
  const text=value.replace(/≤/g," maximum ");
  if (/Non-changeling/i.test(text) && context.archetypes?.includes("changeling")) return false;
  return text.split(";").every(rawGroup => {
    const group=rawGroup.trim();
    if (!group) return true;
    const currentSeeming=SEEMING_NAMES.find(name => courtKey(name) === courtKey(context.seeming));
    if (currentSeeming && new RegExp(`\\b${currentSeeming}\\b`).test(group) && !/\bor\b/i.test(group)) {
      const rest=group.replace(new RegExp(`\\b${currentSeeming}\\b[,]?`,"i"),"").trim();
      return changelingTextPrerequisitesMet(rest, context);
    }
    if (/^Contract of /i.test(group)) return (context.powers ?? []).some(power =>
      courtKey(power) === courtKey(group.replace(/^Contract of /i,"").replace(/•/g,"").trim()) || courtKey(power) === courtKey(group.replace(/•/g,"").trim()));
    const alternatives=SEEMING_NAMES.filter(name => new RegExp(`\\b${name}\\b`,"i").test(group));
    if (alternatives.length && /\bor\b/i.test(group) && alternatives.some(name => courtKey(name) === courtKey(context.seeming))) return true;
    return meritGroupedPrerequisitesMet(group, context);
  });
}

/** CtL owns Court/Seeming/Kith access; Core evaluates only the remaining shared prerequisites. */
export function changelingMeritPrerequisitesMet(merit: Pick<MeritDefinition, "name" | "prerequisites"> & Partial<ChangelingMeritDefinition>, context: ChangelingMeritContext) {
  context = { ...context, traits: { ...context.traits, Wyrd: context.wyrd ?? 0, Fado: context.wyrd ?? 0 } };
  if (merit.id === "ctl-2ed:lucid-dreamer" && context.archetypes?.includes("changeling")) return false;
  if (merit.kith && canonicalTrait(context.kith) !== canonicalTrait(merit.kith)) return false;
  let prerequisites = merit.prerequisites;
  if (merit.seeming && courtKey(context.seeming) !== courtKey(merit.seeming)) {
    if (!merit.alternativePrerequisites || !changelingTextPrerequisitesMet(merit.alternativePrerequisites, context)) return false;
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
  return meritPrerequisitesMet({ ...merit, prerequisites }, context, changelingTextPrerequisitesMet);
}

export function canAdvanceChangelingGrant(merit: CharacterSheet["merits"][number], catalog: readonly MeritDefinition[]) {
  return merit.grantedBy === "Corte" && resolveMeritDefinition(merit, catalog)?.id === "ctl-2ed:mantle";
}

export function changelingExperienceMeritEligible(definition: MeritDefinition, context: ChangelingMeritContext) {
  return (definition.id !== "ctl-2ed:mantle" || (context.merits?.some(merit =>
    resolveMeritDefinition(merit, context.meritCatalog ?? [])?.id === definition.id) ?? false)) && changelingMeritPrerequisitesMet(definition, context);
}

export function changelingMeritContextForSheet(sheet: CharacterSheet, catalog: readonly MeritDefinition[]): ChangelingMeritContext {
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
