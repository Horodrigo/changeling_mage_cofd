import { meritSelectionProblems, type MeritDefinition, type MeritPrerequisiteContext } from "@/lib/merits";
import { awakenedStatus } from "@/lib/merit-requirements";
import type { MageFactionDefinition } from "./factions";
import { findMageFaction, mageFactionAvailable } from "./factions";

const EXARCHS = new Set(["Eye", "Father", "General", "Unity", "Chancellor", "Raptor", "Prophet", "Nemesis", "Ruin"]);
const PROFANE_FORMS = new Set(["Scepter", "Robe", "Crown", "Throne", "Ring"]);
const SVIKIRO_TRADITIONS = new Set(["wamasikati", "wedzinza"]);

export function mageMeritSelectionProblems(
  merit: MeritDefinition,
  selection: { dots: number; configuration?: Record<string, string | string[]> },
  context: MeritPrerequisiteContext,
  factions: readonly MageFactionDefinition[],
) {
  const problems = meritSelectionProblems(merit, selection, context);
  const configuration = selection.configuration ?? {};
  if (merit.name === "Faction Member") {
    const faction = findMageFaction(factions, configuration.factionId);
    if (awakenedStatus(context, String(context.order ?? "")) < 2) problems.push("Order Status 2 is required.");
    if (!faction) problems.push("Select a published faction.");
    else if (!mageFactionAvailable(faction, context.order)) problems.push("The faction is not available to this Order.");
    else if (selection.dots >= 3 && !faction.roteSkills.includes(String(configuration.roteSkill ?? ""))) problems.push("Select the faction's Rote Skill.");
  }
  if (merit.name === "Prelacy" && !EXARCHS.has(String(configuration.exarch ?? ""))) problems.push("Select a patron Exarch.");
  if (merit.name === "Profane Tool" && !PROFANE_FORMS.has(String(configuration.form ?? ""))) problems.push("Select a Profane Form.");
  if (merit.name === "Svikiro" && !SVIKIRO_TRADITIONS.has(String(configuration.tradition ?? ""))) problems.push("Select wamasikati or wedzinza.");
  return problems;
}
