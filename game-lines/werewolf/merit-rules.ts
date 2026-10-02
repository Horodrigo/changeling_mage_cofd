import { ATTRIBUTES, SKILLS } from "@/lib/core/character/creation-rules";
import type { MeritSelection } from "@/lib/core/character/character-types";
import type { MeritConfiguration } from "@/lib/core/character/merit-configuration";
import type { MeritDefinition, MeritSelectionProblem } from "@/lib/merits";
import { textRequirementMet } from "@/lib/merit-requirements";
import type { AuspiceDefinition, FormDefinition, FormMechanics, RenownId } from "./catalogs/reference";
import type { GiftDefinition } from "./catalogs/gifts";

/** Resolved catalog IDs, not a second persisted Merit model. The caller resolves each instance. */
export type WerewolfMeritChoice = Pick<MeritSelection, "instanceId" | "dots" | "configuration"> & { id: string };
export type WerewolfMeritContext = {
  /** Effective Hishu traits, never the currently selected combat form (WTF2 p. 108). */
  attributes: Record<string, number>; skills: Record<string, number>;
  harmony: number; primalUrge: number; renown: Partial<Record<RenownId, number>>;
  tribeId: string; auspice?: AuspiceDefinition;
  forms: readonly FormDefinition[]; gifts: readonly GiftDefinition[];
  merits: readonly WerewolfMeritChoice[];
};

const attributes: readonly string[] = Object.values(ATTRIBUTES).flat();
const skills: readonly string[] = Object.values(SKILLS).flat();
const penaltyAttributes: readonly string[] = [...ATTRIBUTES.Mental, ...ATTRIBUTES.Physical];
const value = (configuration: MeritConfiguration | undefined, key: string) =>
  typeof configuration?.[key] === "string" ? configuration[key] as string : "";
const id = (slug: string) => `wtf-2ed:${slug}`;
const tribeRequirements: Record<string, string> = {
  [id("hearing-whispers")]: "bone-shadows", [id("nowhere-to-run")]: "hunters-in-darkness",
  [id("sounds-of-the-city")]: "iron-masters", [id("strings-of-the-heart")]: "storm-lords",
  [id("weakest-link")]: "blood-talons",
};
const renownRequirements: Record<string, [RenownId, number]> = {
  [id("creative-tactician")]: ["Purity", 2], [id("fading")]: ["Cunning", 2],
  [id("impartial-mediator")]: ["Honor", 2], [id("resonance-shaper")]: ["Wisdom", 2],
  [id("song-in-your-heart")]: ["Glory", 2], [id("call-out")]: ["Honor", 2],
  [id("efficient-killer")]: ["Purity", 2], [id("flanking")]: ["Cunning", 2],
  [id("spiritual-blockage")]: ["Wisdom", 2], [id("warcry")]: ["Glory", 2],
};

/** Additional Werewolf eligibility. Core still owns mortalOnly, line access and generic exclusions. */
export function werewolfMeritPrerequisitesMet(
  definition: Pick<MeritDefinition, "id" | "prerequisites">,
  choice: WerewolfMeritChoice, context: WerewolfMeritContext,
) {
  if (choice.id !== definition.id) return false;
  // All ordinary Attribute/Skill clauses are canonical English, never localized presentation.
  if (!textRequirementMet(definition.prerequisites ?? "", { gameLine: "WtF", attributes: context.attributes, skills: context.skills }, [])) return false;
  const tribe = tribeRequirements[definition.id];
  if (tribe && context.tribeId !== tribe) return false;
  const renown = renownRequirements[definition.id];
  if (renown && !((context.renown[renown[0]] ?? 0) >= renown[1])) return false;
  switch (definition.id) {
    case "wtf-2ed:blood-or-bone-affinity": return context.harmony >= 3 && context.harmony <= 8;
    case "wtf-2ed:code-of-honor": return context.harmony >= 8 && context.harmony <= 10;
    case "wtf-2ed:embodiment-of-the-firstborn": return ["blood-talons", "bone-shadows", "hunters-in-darkness", "iron-masters", "storm-lords"].includes(context.tribeId);
    case "wtf-2ed:favored-form": return context.primalUrge >= choice.dots + 1;
    case "wtf-2ed:instinctive-defense": return context.primalUrge >= 2;
    case "wtf-2ed:dedicated-locus": return context.merits.some(item => item.id === "core-2ed:safe-place" && item.dots >= choice.dots);
    case "wtf-2ed:moon-kissed": {
      const selected = value(choice.configuration, "skill");
      return (context.auspice?.skills ?? []).some(skill => (!selected || selected === skill) && context.skills[skill] >= 2);
    }
    default: return true;
  }
}

/** p. 106 explicitly excludes Manipulation in Gauru even though p. 97 specifies no numeric penalty. */
export function favoredFormAttributes(form: FormMechanics) {
  return attributes.filter(attribute => (form.attributes[attribute] ?? 0) >= 0 && !(form.id === "gauru" && attribute === "Manipulation"));
}

export function favoredFormPenalties(configuration?: MeritConfiguration) {
  const rows = configuration?.penalties;
  return (Array.isArray(rows) ? rows : []).map(row => {
    const parts = row.split(":");
    return { formId: parts.length === 2 ? parts[0] : "", attribute: parts.length === 2 ? parts[1] : "" };
  });
}

/** Exact rating, required choices and repeatable-instance validation for Builder and XP alike. */
export function werewolfMeritSelectionProblems(
  definition: Pick<MeritDefinition, "id" | "ratings" | "repeatable">,
  choice: WerewolfMeritChoice, context: WerewolfMeritContext,
): MeritSelectionProblem[] {
  const problems: MeritSelectionProblem[] = [];
  const problem = (name: "rating" | "form" | "attribute" | "touchstone" | "anchor" | "virtue" | "safePlace" | "physicalSkill" | "gift" | "advancedSkill" | "penalties" | "attack" | "moonSkill" | "penaltySkill" | "duplicate") =>
    problems.push({ key: `werewolf.meritProblem.${name}` });
  if (choice.id !== definition.id || !definition.ratings.includes(choice.dots)) problem("rating");
  const config = choice.configuration;
  const form = context.forms.find(item => item.id === value(config, "form"));
  const formMerits = [id("favored-form"), id("fortified-form"), id("living-weapon")];
  if (formMerits.includes(definition.id) && (!form || form.id === "hishu")) problem("form");
  switch (definition.id) {
    case "wtf-2ed:anchored": if (!["physical", "spiritual"].includes(value(config, "touchstone"))) problem("touchstone"); break;
    case "wtf-2ed:blood-or-bone-affinity": if (choice.dots === 2 && !["blood", "bone"].includes(value(config, "anchor"))) problem("anchor"); break;
    case "wtf-2ed:code-of-honor": if (!value(config, "virtue").trim()) problem("virtue"); break;
    case "wtf-2ed:dedicated-locus":
      if (!context.merits.some(item => item.id === "core-2ed:safe-place" && item.instanceId && item.instanceId === value(config, "safePlaceId") && item.dots >= choice.dots)) problem("safePlace");
      break;
    case "wtf-2ed:embodiment-of-the-firstborn": if (!attributes.includes(value(config, "attribute"))) problem("attribute"); break;
    case "wtf-2ed:favored-form": {
      if (!SKILLS.Physical.some(skill => skill === value(config, "physicalSkill"))) problem("physicalSkill");
      const allowed = form ? favoredFormAttributes(form) : [];
      if (choice.dots >= 2 && !allowed.includes(value(config, "attribute"))) problem("attribute");
      if (choice.dots >= 3 && !context.gifts.some(gift => gift.id === value(config, "giftId"))) problem("gift");
      if (choice.dots >= 4 && (!allowed.includes(value(config, "secondAttribute")) || value(config, "attribute") === value(config, "secondAttribute"))) problem("attribute");
      if (choice.dots >= 5 && !skills.includes(value(config, "advancedSkill"))) problem("advancedSkill");
      const penalties = favoredFormPenalties(config);
      if (penalties.length !== choice.dots || penalties.some(row => row.formId === form?.id || !context.forms.some(item => item.id === row.formId) || !penaltyAttributes.includes(row.attribute))) problem("penalties");
      break;
    }
    case "wtf-2ed:living-weapon": if (!["bite", "claws"].includes(value(config, "attack"))) problem("attack"); break;
    case "wtf-2ed:moon-kissed":
      if (!context.auspice?.skills.includes(value(config, "skill")) || !(context.skills[value(config, "skill")] >= 2)) problem("moonSkill");
      if (!skills.includes(value(config, "penaltySkill")) || context.auspice?.skills.includes(value(config, "penaltySkill")) || !(context.skills[value(config, "penaltySkill")] >= 1)) problem("penaltySkill");
      break;
  }
  const others = context.merits.filter(item => item.id === choice.id && item !== choice && !(choice.instanceId && item.instanceId === choice.instanceId));
  if (others.some(item => !definition.repeatable || (
    definition.id === id("moon-kissed") ? value(item.configuration, "skill") === value(config, "skill") :
      value(item.configuration, "form") === value(config, "form") && (definition.id !== id("living-weapon") || value(item.configuration, "attack") === value(config, "attack"))
  ))) problem("duplicate");
  return problems;
}

/** Permanent, form-specific benefits only. No maneuver activation, rolls, timers or resource mutation. */
export function werewolfFormMeritEffects(merits: readonly WerewolfMeritChoice[], form: FormMechanics) {
  const deltas: Record<string, number> = {};
  const add = (attribute: string, amount: number) => { if (attributes.includes(attribute)) deltas[attribute] = (deltas[attribute] ?? 0) + amount; };
  let armorGeneral = 0, armorBallistic = 0, instinctiveDefense = false;
  const weaponBonuses = {
    bite: { damage: 0, armorPiercing: 0, ignoresNonMagicalArmor: false },
    claws: { damage: 0, armorPiercing: 0, ignoresNonMagicalArmor: false },
  };
  const applied = new Set<string>();
  for (const merit of merits) {
    if ([id("embodiment-of-the-firstborn"), id("favored-form")].includes(merit.id)) {
      if (applied.has(merit.id)) continue;
      applied.add(merit.id);
    }
    const config = merit.configuration;
    if (merit.id === id("embodiment-of-the-firstborn") && merit.dots === 5) add(value(config, "attribute"), 1);
    if (merit.id === id("instinctive-defense") && merit.dots === 2 && ["urhan", "urshul"].includes(form.id)) instinctiveDefense = true;
    if (merit.id === id("favored-form") && Number.isInteger(merit.dots) && merit.dots >= 1 && merit.dots <= 5) {
      const favored = value(config, "form");
      if (!["dalu", "gauru", "urshul", "urhan"].includes(favored)) continue;
      if (favored === form.id) {
        const allowed = favoredFormAttributes(form);
        const first = value(config, "attribute"), second = value(config, "secondAttribute");
        if (merit.dots >= 2 && allowed.includes(first)) add(first, 1);
        if (merit.dots >= 4 && allowed.includes(second) && second !== first) add(second, 1);
      } else {
        for (const penalty of favoredFormPenalties(config).slice(0, merit.dots))
          if (penalty.formId === form.id && penaltyAttributes.includes(penalty.attribute)) add(penalty.attribute, -1);
      }
    }
    if (form.id !== "hishu" && value(config, "form") === form.id && [3, 4, 5].includes(merit.dots)) {
      if (merit.id === id("fortified-form")) {
        // Gauru has no innate armor in 2e (M04); duplicate invalid instances never stack.
        armorGeneral = Math.max(armorGeneral, merit.dots === 5 ? 2 : 1);
        armorBallistic = Math.max(armorBallistic, merit.dots === 5 ? 2 : merit.dots === 4 ? 1 : 0);
      }
      const attack = value(config, "attack");
      if (merit.id === id("living-weapon") && (attack === "bite" || attack === "claws")) {
        weaponBonuses[attack].armorPiercing = 2;
        weaponBonuses[attack].damage = Math.max(weaponBonuses[attack].damage, merit.dots >= 4 ? 1 : 0);
        weaponBonuses[attack].ignoresNonMagicalArmor ||= merit.dots === 5;
      }
    }
  }
  return { attributes: deltas, armorGeneral, armorBallistic, instinctiveDefense, weaponBonuses };
}

export const WEREWOLF_MERIT_CONFIGURATION_IDS = new Set([
  "anchored", "blood-or-bone-affinity", "code-of-honor", "dedicated-locus", "embodiment-of-the-firstborn",
  "favored-form", "fortified-form", "living-weapon", "moon-kissed",
].map(id));
