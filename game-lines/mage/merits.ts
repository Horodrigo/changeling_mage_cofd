import { meritContextForSheet, meritPrerequisitesMet, meritTextPrerequisitesMet, meritSelectionProblems, type MeritDefinition, type MeritPrerequisiteContext } from "@/lib/merits";
import type { CharacterSheet } from "@/lib/core/character/character-types";
import { canonicalTrait, requirementMet } from "@/lib/merit-requirements";
import { resolveMeritDefinition } from "@/lib/merit-identity";
import type { MageFactionDefinition } from "./factions";
import { findMageFaction, mageFactionAvailable } from "./factions";
import { findMageAffiliation } from "./orders";
import { ARCANA, MTA_PATHS } from "./creation-rules";

export type MageMeritContext = MeritPrerequisiteContext & {
  gnosis?: number; arcana?: Record<string, number>; path?: string; order?: string;
};

export function mageTextPrerequisitesMet(value: string | undefined, context: MageMeritContext): boolean {
  return meritTextPrerequisitesMet(value, context, clause => {
    if (/^non[- ]?(?:Awakened|mage)$/i.test(clause)) return !context.archetypes?.includes("awakened");
    if (/^(?:Awakened|Mage)$/i.test(clause)) return Boolean(context.archetypes?.includes("awakened"));
    if (/^Sleepwalker$/i.test(clause)) return false;
    const name=clause.replace(/\s*(?:•+|\d+\+?).*$/,"").trim();
    if (Object.keys(MTA_PATHS).some(path => canonicalTrait(path) === canonicalTrait(name))) return canonicalTrait(context.path) === canonicalTrait(name);
    return undefined;
  });
}

const EXARCHS = new Set(["Eye", "Father", "General", "Unity", "Chancellor", "Raptor", "Prophet", "Nemesis", "Ruin"]);
const PROFANE_FORMS = new Set(["Scepter", "Robe", "Crown", "Throne", "Ring"]);
const SVIKIRO_TRADITIONS = new Set(["wamasikati", "wedzinza"]);

export const MAGE_STATUS_REQUIREMENTS = {
  statusMeritIds: ["mta-2ed:awakened-status"],
  statusDomainAliases: { Arrow: "Adamantine Arrow", Ladder: "Silver Ladder", Guardian: "Guardians of the Veil", Councillor: "Free Council", Seer: "Seers of the Throne", "Consilium/Order": "any" },
};

export function canAdvanceMageGrant(merit: CharacterSheet["merits"][number], catalog: readonly MeritDefinition[]) {
  const id = resolveMeritDefinition(merit, catalog)?.id;
  return (merit.grantedBy === "Ordem" && id === "mta-2ed:awakened-status") ||
    (merit.grantedBy === "Nameless Order" && id === "core-2ed:mystery-cult-initiation");
}

export function mageMeritContextForSheet(sheet: CharacterSheet, catalog: readonly MeritDefinition[]): MageMeritContext {
  const data = sheet.line_data;
  return {
    ...meritContextForSheet(sheet, catalog, ["awakened"], data.merit_granted_skill_bonuses as Record<string, number> | undefined),
    ...MAGE_STATUS_REQUIREMENTS,
    path: String(data.path ?? ""), order: String(data.order ?? ""),
    gnosis: data.gnosis === undefined ? undefined : Number(data.gnosis),
    arcana: (data.arcana ?? {}) as Record<string, number>,
  };
}

function matchingMerits(context: MeritPrerequisiteContext, ids: readonly string[], minimum: number, instanceId?: string) {
  const owned = context.merits ?? [];
  const candidates = instanceId === undefined ? owned : owned.filter(item => item.instanceId === instanceId);
  if (instanceId !== undefined && (!instanceId || candidates.length !== 1)) return [];
  return candidates.filter(item => item.dots >= minimum && ids.includes(resolveMeritDefinition(item, context.meritCatalog ?? [])?.id ?? ""));
}

export function mageMeritPrerequisitesMet(merit: MeritDefinition, context: MageMeritContext) {
  context = { ...context, traits: { ...Object.fromEntries(ARCANA.map(name => [name, 0])), ...context.traits, ...context.arcana, Gnosis: context.gnosis ?? 0, Gnose: context.gnosis ?? 0 } };
  if (!meritPrerequisitesMet(merit, context, mageTextPrerequisitesMet)) return false;
  if (merit.id !== "mta-2ed:infamous-mentor") return true;
  const id = String(context.configuration?.mentorId ?? "");
  return matchingMerits(context, ["core-2ed:mentor"], context.selectedDots ?? 1, id || undefined).length > 0;
}

export function mageMeritSelectionProblems(
  merit: MeritDefinition,
  selection: { dots: number; configuration?: Record<string, string | string[]> },
  context: MageMeritContext,
  factions: readonly MageFactionDefinition[],
  affiliationId?:unknown,
) {
  const problems = meritSelectionProblems(merit, selection, context, mageMeritPrerequisitesMet);
  const configuration = selection.configuration ?? {};
  const linked = (key: string, ids: readonly string[], minimum = 1) => {
    if (!matchingMerits(context, ids, minimum, String(configuration[key] ?? "")).length) {
      problems.push({key:"ui.meritSelectLinked",params:{minimum},meritIds:ids});
    }
  };
  if (merit.id === "mta-2ed:infamous-mentor") linked("mentorId", ["core-2ed:mentor"], selection.dots);
  if (merit.id === "mta-2ed:sanctum") linked("safePlaceId", ["core-2ed:safe-place"], selection.dots);
  if (merit.id === "mta-2ed:demesne") linked("sanctumId", ["mta-2ed:sanctum"]);
  if (merit.id === "mta-signs:imbued-ally") linked("allyId", ["core-2ed:retainer", "mta-2ed:familiar"]);
  if (merit.id === "mta-signs:order-archive") linked("statusId", ["mta-2ed:awakened-status"]);
  if (merit.id === "mta-2ed:awakened-status") {
    const domain = String(configuration.domain ?? "");
    if (!domain) problems.push({key:"ui.meritSelectStatusDomain"});
    if (domain && domain !== "Consilium" && domain !== context.order && selection.dots > 1) problems.push({key:"ui.meritStatusOutsideOrder"});
  }
  if (merit.id === "mta-2ed:adamant-hand" && !requirementMet({trait:String(configuration.skill??""),minimum:3},context)) problems.push({key:"ui.meritAdamantHandSkill"});
  if (merit.id === "mta-2ed:cabal-theme" && (!String(configuration.name??"").trim() || !String(configuration.description??"").trim())) problems.push({key:"ui.meritCabalThemeRequired"});
  if (merit.id === "mta-tome:faction-member") {
    const faction = findMageFaction(factions, configuration.factionId);
    if (!matchingMerits(context, ["mta-2ed:awakened-status"], 2).some(item => item.configuration?.domain === context.order)) problems.push({key:"ui.meritOrderStatusRequired"});
    if (!faction) problems.push({key:"ui.meritSelectFaction"});
    else if (!mageFactionAvailable(faction, context.order)) problems.push({key:"ui.meritFactionUnavailable"});
    else if (selection.dots >= 3 && !faction.roteSkills.includes(String(configuration.roteSkill ?? ""))) problems.push({key:"ui.meritSelectFactionRoteSkill"});
  }
  if (merit.id === "mta-2ed:prelacy") {
    const exarch=String(configuration.exarch??""),affiliation=findMageAffiliation(affiliationId);
    if(!EXARCHS.has(exarch))problems.push({key:"ui.meritSelectPatronExarch"});
    else if(affiliation&&![affiliation.patronExarch,...(affiliation.additionalPatronExarchs??[])].includes(exarch))problems.push({key:"ui.meritPrelacyPatron",params:{affiliation:affiliation.name}});
  }
  if (merit.id === "mta-signs:profane-tool" && !PROFANE_FORMS.has(String(configuration.form ?? ""))) problems.push({key:"ui.meritSelectProfaneForm"});
  if (merit.id === "core-dark-eras-companion:svikiro" && !SVIKIRO_TRADITIONS.has(String(configuration.tradition ?? ""))) problems.push({key:"ui.meritSelectSvikiroTradition"});
  return problems;
}
