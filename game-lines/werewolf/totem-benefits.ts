import type { CharacterSheet, MeritSelection } from "@/lib/core/character/character-types";
import { ATTRIBUTES, SKILLS } from "@/lib/core/character/creation-rules";
import { meritPrerequisitesMet, meritRatingsFor, meritSelectionProblems, type MeritDefinition } from "@/lib/merits";
import type { WerewolfReferenceCatalog } from "./catalogs/reference";
import type { WerewolfGiftCatalog } from "./catalogs/gifts";
import type { WerewolfTotemCatalog } from "./catalogs/totem";
import { boundedPrimalUrge, formTraits } from "./creation-rules";
import { resolveWerewolfMerits, werewolfMeritDefinition } from "./creation-grants";
import { werewolfMeritPrerequisitesMet, werewolfMeritSelectionProblems } from "./merit-rules";
import { personalTotemPoints, totemAdvantage, type TotemBenefitChoice, type TotemSelection } from "./totem-rules";

export type TotemBenefitProblem = "budget" | "target" | "rating" | "duplicate" | "replacementRequired" | "replacementForbidden" | "replacementCost" | "replacementReason" | "prerequisites" | "choices";
export type TotemBenefitCatalogs = { reference: WerewolfReferenceCatalog; gifts: WerewolfGiftCatalog; totem: WerewolfTotemCatalog; merits: readonly MeritDefinition[] };
type Traits = Pick<CharacterSheet, "attributes" | "skills" | "specializations" | "merits">;
const names = { attribute: Object.values(ATTRIBUTES).flat() as readonly string[], skill: Object.values(SKILLS).flat() as readonly string[] };
const sameSpecialty = (skill: string, name: string, item: { skill: string; name: string }) => item.skill === skill && item.name.trim() === name.trim();
const area = "core-2ed:area-of-expertise";

/** WTF2 pp. 84, 92: one Attribute/Skill dot, one Specialty, or an exact Merit rating. */
export function totemBenefitCost(choice: TotemBenefitChoice, reference: WerewolfReferenceCatalog) {
  return choice.kind === "specialty" ? 1 : choice.kind === "merit" ? choice.dots * reference.experienceCosts.merit : reference.experienceCosts[choice.kind];
}

/** Runtime-only overlay. Never persist its traits as purchased/base traits or pass it back into this resolver. */
export function resolveTotemAdvantage(character: CharacterSheet, totem: TotemSelection | null, catalogs: TotemBenefitCatalogs) {
  if (character.game_line !== "WtF") throw new Error("Totem Advantage received another game line.");
  const base = (): Traits => ({ attributes: { ...character.attributes }, skills: { ...character.skills }, specializations: structuredClone(character.specializations), merits: structuredClone(character.merits) });
  const points = totem ? personalTotemPoints(character.merits, catalogs.merits) + totem.externalPoints : 0;
  const budget = catalogs.totem.advantageBands.find(band => points >= band.minimum && (band.maximum == null || points <= band.maximum))?.experience ?? 0;
  const selections = totemAdvantage(totem?.advantage), issues: Array<{ id: string | null; problem: TotemBenefitProblem }> = [];
  const resolved: Array<{ id: string; choice: TotemBenefitChoice; automaticExpertise: boolean }> = [];
  const add = (id: string | null, problem: TotemBenefitProblem) => { if (!issues.some(item => item.id === id && item.problem === problem)) issues.push({ id, problem }); };
  const definition = (choice: TotemBenefitChoice) => choice.kind === "merit" ? catalogs.merits.find(item => item.id === choice.definitionId) : undefined;
  const owned = (id: string) => character.merits.some(item => item.dots > 0 && werewolfMeritDefinition(item, catalogs.merits)?.id === id);
  const hasSpecialty = (choice: TotemBenefitChoice) => choice.kind === "specialty" && character.specializations.some(item => sameSpecialty(choice.skill, choice.name, item));
  const valid = (id: string, choice: TotemBenefitChoice) => {
    if (choice.kind === "attribute" || choice.kind === "skill") { if (!names[choice.kind].includes(choice.target)) add(id, "target"); }
    else if (choice.kind === "specialty") { if (!names.skill.includes(choice.skill) || !choice.name.trim()) add(id, "target"); }
    else {
      const merit = definition(choice);
      if (!merit) add(id, "target");
      else if (!meritRatingsFor(merit, choice.dots).includes(choice.dots)) add(id, "rating");
    }
  };
  let spent = 0;
  for (const entry of selections.selections) {
    valid(entry.id, entry.choice);
    const cost = totemBenefitCost(entry.choice, catalogs.reference);
    spent += cost;
    let choice = entry.choice, automaticExpertise = false;
    const specialtyOwned = hasSpecialty(choice);
    const needsReplacement = choice.kind === "merit" && owned(choice.definitionId) || specialtyOwned && owned(area);
    if (entry.replacement) {
      if (!needsReplacement) add(entry.id, "replacementForbidden");
      if (!entry.replacement.reason.trim()) add(entry.id, "replacementReason");
      choice = entry.replacement.choice;
      valid(entry.id, choice);
      if (totemBenefitCost(choice, catalogs.reference) !== cost) add(entry.id, "replacementCost");
      if (choice.kind === "merit" && owned(choice.definitionId) || hasSpecialty(choice)) add(entry.id, "duplicate");
    } else if (needsReplacement) add(entry.id, "replacementRequired");
    else if (specialtyOwned && choice.kind === "specialty") {
      // WTF2 p. 92 explicitly grants this Merit for the already-owned Specialty.
      choice = { kind: "merit", definitionId: area, dots: 1, configuration: { skill: choice.skill, specialty: choice.name.trim() } };
      automaticExpertise = true;
      valid(entry.id, choice);
    }
    resolved.push({ id: entry.id, choice, automaticExpertise });
  }
  if (!Number.isSafeInteger(spent) || spent > budget) add(null, "budget");
  const key = (choice: TotemBenefitChoice) => choice.kind === "merit" ? `${choice.kind}:${choice.definitionId}` : choice.kind === "specialty" ? `${choice.kind}:${choice.skill}:${choice.name.trim()}` : `${choice.kind}:${choice.target}`;
  for (const entry of resolved) {
    const others = resolved.filter(item => item.id !== entry.id && key(item.choice) === key(entry.choice));
    const merit = definition(entry.choice);
    if (others.length && (!merit || !merit.repeatable)) {
      // Separate already-owned Specialties may each receive their explicitly granted Area of Expertise.
      if (!(entry.automaticExpertise && others.every(item => item.automaticExpertise && item.choice.kind === "merit" && entry.choice.kind === "merit" && (item.choice.configuration.specialty !== entry.choice.configuration.specialty || item.choice.configuration.skill !== entry.choice.configuration.skill)))) add(entry.id, "duplicate");
    }
  }
  const grantedMerit = (entry: typeof resolved[number]): MeritSelection | null => {
    const merit = definition(entry.choice);
    return merit && entry.choice.kind === "merit" ? { instanceId: `totem:${totem!.instanceId}:${entry.id}`, name: merit.name, sourceId: merit.sourceId, source: merit.source,
      dots: entry.choice.dots, configuration: structuredClone(entry.choice.configuration), grantedBy: "werewolf:totem-advantage", creationDots: 0, experienceDots: 0 } : null;
  };
  const compose = (entries: typeof resolved): Traits => {
    const traits = base();
    for (const entry of entries) {
      const choice = entry.choice;
      if (choice.kind === "attribute" || choice.kind === "skill") { const values = choice.kind === "attribute" ? traits.attributes : traits.skills; values[choice.target] = Number(values[choice.target] ?? 0) + 1; }
      if (choice.kind === "specialty") traits.specializations.push({ skill: choice.skill, name: choice.name.trim(), grantedBy: "werewolf:totem-advantage" });
      const merit = grantedMerit(entry);
      if (merit) traits.merits.push(merit);
    }
    return traits;
  };
  let applicable = resolved.filter(entry => !issues.some(issue => issue.id === entry.id));
  // ponytail: at most ten one-Experience benefits; recompute to propagate invalid dependencies instead of a graph engine.
  for (let remaining = applicable.length; remaining >= 0; remaining--) {
    let changed = false;
    for (const entry of applicable) {
      const traits = compose(applicable.filter(item => item.id !== entry.id));
      if (entry.choice.kind === "specialty" && !(traits.skills[entry.choice.skill] >= 1)) { add(entry.id, "prerequisites"); changed = true; }
      const merit = definition(entry.choice), grant = grantedMerit(entry);
      if (!merit || !grant) continue;
      const hishu = formTraits(traits, catalogs.reference.forms.find(form => form.id === "hishu")!, 5, resolveWerewolfMerits(traits.merits, catalogs.merits), traits.merits);
      const core = { gameLine: "WtF" as const, archetypes: ["werewolf"], attributes: hishu.attributes, skills: traits.skills, size: hishu.size, merits: traits.merits, meritCatalog: catalogs.merits, selectedDots: grant.dots, configuration: grant.configuration };
      const own = { attributes: hishu.attributes, skills: traits.skills, harmony: Number(character.line_data.harmony ?? 7), primalUrge: boundedPrimalUrge(character.line_data.primal_urge),
        renown: character.line_data.renown as Record<string, number> ?? {}, tribeId: String(character.line_data.tribe_id ?? ""), auspice: catalogs.reference.auspices.find(item => item.id === character.line_data.auspice_id),
        forms: catalogs.reference.forms, gifts: catalogs.gifts.gifts, merits: resolveWerewolfMerits(traits.merits, catalogs.merits) };
      const choice = { id: merit.id, instanceId: grant.instanceId, dots: grant.dots, configuration: grant.configuration };
      if (!entry.automaticExpertise && (!meritPrerequisitesMet(merit, core) || !werewolfMeritPrerequisitesMet(merit, choice, own))) { add(entry.id, "prerequisites"); changed = true; }
      const selectionProblems = meritSelectionProblems(merit, choice, core).filter(problem => !entry.automaticExpertise || problem.key !== "ui.meritPrerequisitesNotMet");
      if (selectionProblems.length || merit.line === "WtF" && werewolfMeritSelectionProblems(merit, choice, own).length) { add(entry.id, "choices"); changed = true; }
    }
    if (!changed) break;
    applicable = applicable.filter(entry => !issues.some(issue => issue.id === entry.id));
  }
  return { budget, spent, remaining: budget - spent, active: selections.active, issues, resolved, traits: selections.active && !issues.some(issue => issue.problem === "budget") ? compose(applicable) : base() };
}
