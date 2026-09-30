import { meritSelectionProblems, type MeritDefinition, type MeritPrerequisiteContext } from "@/lib/merits";
import { awakenedStatus } from "@/lib/merit-requirements";
import type { MageFactionDefinition } from "./factions";
import { findMageFaction, mageFactionAvailable } from "./factions";
import { findMageAffiliation } from "./orders";

const EXARCHS = new Set(["Eye", "Father", "General", "Unity", "Chancellor", "Raptor", "Prophet", "Nemesis", "Ruin"]);
const PROFANE_FORMS = new Set(["Scepter", "Robe", "Crown", "Throne", "Ring"]);
const SVIKIRO_TRADITIONS = new Set(["wamasikati", "wedzinza"]);

export function mageMeritSelectionProblems(
  merit: MeritDefinition,
  selection: { dots: number; configuration?: Record<string, string | string[]> },
  context: MeritPrerequisiteContext,
  factions: readonly MageFactionDefinition[],
  affiliationId?:unknown,
) {
  const problems = meritSelectionProblems(merit, selection, context);
  const configuration = selection.configuration ?? {};
  if (merit.name === "Faction Member") {
    const faction = findMageFaction(factions, configuration.factionId);
    if (awakenedStatus(context, String(context.order ?? "")) < 2) problems.push({key:"ui.meritOrderStatusRequired"});
    if (!faction) problems.push({key:"ui.meritSelectFaction"});
    else if (!mageFactionAvailable(faction, context.order)) problems.push({key:"ui.meritFactionUnavailable"});
    else if (selection.dots >= 3 && !faction.roteSkills.includes(String(configuration.roteSkill ?? ""))) problems.push({key:"ui.meritSelectFactionRoteSkill"});
  }
  if (merit.name === "Prelacy") {
    const exarch=String(configuration.exarch??""),affiliation=findMageAffiliation(affiliationId);
    if(!EXARCHS.has(exarch))problems.push({key:"ui.meritSelectPatronExarch"});
    else if(affiliation&&![affiliation.patronExarch,...(affiliation.additionalPatronExarchs??[])].includes(exarch))problems.push({key:"ui.meritPrelacyPatron",params:{affiliation:affiliation.name}});
  }
  if (merit.name === "Profane Tool" && !PROFANE_FORMS.has(String(configuration.form ?? ""))) problems.push({key:"ui.meritSelectProfaneForm"});
  if (merit.name === "Svikiro" && !SVIKIRO_TRADITIONS.has(String(configuration.tradition ?? ""))) problems.push({key:"ui.meritSelectSvikiroTradition"});
  return problems;
}
