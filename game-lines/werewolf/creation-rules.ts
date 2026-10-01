import type { CharacterSheet } from "@/lib/core/character/character-types";
import type { AuspiceDefinition, FormDefinition, PrimalUrgeLevel, RenownId, TribeDefinition, WerewolfReference } from "./catalogs/reference";

const finite = (value: unknown, fallback = 0) => {
  if (typeof value !== "number" && (typeof value !== "string" || !value.trim())) return fallback;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

export function boundedHarmony(value: unknown) {
  return Math.max(0, Math.min(10, Math.trunc(finite(value, 7))));
}

export function boundedPrimalUrge(value: unknown) {
  return Math.max(1, Math.min(10, Math.trunc(finite(value, 1))));
}

/** WTF2 pp. 96–98; M02/M03/M04/M07 resolve the audited sheet/text conflicts. */
export function formTraits(character: Pick<CharacterSheet, "attributes" | "skills">, form: FormDefinition, baseSize = 5) {
  const attributes = Object.fromEntries(Object.entries(character.attributes).map(([key, value]) => [key, Math.max(0, finite(value))]));
  for (const [key, delta] of Object.entries(form.attributes)) attributes[key] = Math.max(0, finite(attributes[key]) + finite(delta));
  const size = Math.max(1, finite(baseSize, 5) + form.size);
  return {
    attributes,
    size,
    health: Math.max(1, size + finite(attributes.Stamina)),
    defense: Math.min(finite(attributes.Dexterity), finite(attributes.Wits)) + finite(character.skills.Athletics),
    initiative: finite(attributes.Dexterity) + finite(attributes.Composure),
    speed: finite(attributes.Strength) + finite(attributes.Dexterity) + 5 + form.speciesFactor,
    willpower: finite(attributes.Resolve) + finite(attributes.Composure),
    perception: form.perception,
    armorGeneral: form.armorGeneral,
    armorBallistic: form.armorBallistic,
    firearmsDefense: form.firearmsDefense,
  };
}

/** WTF2 p. 83: Auspice + Tribe + one choice; Ghost Wolves receive no Tribe dot. */
export function creationRenown(auspice: AuspiceDefinition, tribe: TribeDefinition, choice: RenownId) {
  const renown: Record<RenownId, number> = { Cunning: 0, Glory: 0, Honor: 0, Purity: 0, Wisdom: 0 };
  if (!Object.hasOwn(renown, choice)) throw new Error("Invalid creation Renown category.");
  renown[auspice.renown] += 1;
  if (tribe.renown) renown[tribe.renown] += 1;
  renown[choice] += 1;
  if (Object.values(renown).some(value => value > 2)) throw new Error("Creation Renown cannot exceed two dots in a category.");
  return renown;
}

/** Informational limits only: this does not spend Essence, heal or advance time. */
export function primalUrgeLevel(reference: WerewolfReference, rating: unknown): PrimalUrgeLevel {
  const selected = reference.primalUrge.find(level => level.rating === boundedPrimalUrge(rating));
  if (!selected) throw new Error("The selected Primal Urge level is absent from the catalog.");
  return selected;
}

export function creationMeritBudget(primalUrge: unknown, extraRiteDots = 0) {
  const rating = finite(primalUrge);
  if (!Number.isInteger(rating) || rating < 1 || rating > 3 || !Number.isInteger(extraRiteDots) || extraRiteDots < 0 || extraRiteDots > 5)
    throw new Error("Invalid Primal Urge or Rite conversion for character creation.");
  const remaining = 10 - (rating - 1) * 5 - extraRiteDots;
  if (remaining < 0) throw new Error("Primal Urge and Rites exceed the ten-dot Merit budget.");
  return remaining;
}

/** WTF2 p. 82: the Auspice dot is separate from the 11/7/4 purchased Skill allocation. */
export function creationAuspiceSkill(skills: Record<string, number>, auspice: AuspiceDefinition, skill: string) {
  const base = finite(skills[skill], 0);
  if (!auspice.skills.includes(skill) || !Number.isInteger(base) || base < 0 || base >= 5)
    throw new Error("Choose an Auspice Skill with fewer than five dots.");
  return { ...skills, [skill]: base + 1 };
}

/** WTF2 p. 83 creation grants, not the separate rules for gaining Renown during play. */
export function creationGiftAllowance(auspice: AuspiceDefinition, tribe: TribeDefinition, choice: RenownId) {
  const renown = creationRenown(auspice, tribe, choice);
  const moonFacetCount = renown[auspice.renown];
  return {
    renown,
    moonGiftId: auspice.moonGiftId,
    moonFacetCount,
    shadowGiftIds: [...new Set([...auspice.giftIds, ...tribe.giftIds])],
    shadowFacetCount: 2,
    wolfFacetCount: moonFacetCount === 1 ? 1 : 0,
  };
}

export type WerewolfCreationChoices = {
  auspice_id: string; tribe_id: string; auspice_skill: string; renown_choice: RenownId | "";
  primal_urge: number; extra_rite_dots: number; blood: string; bone: string;
  physical_touchstone: string; spiritual_touchstone: string;
};

/** Returns semantic problems for the line-owned creation UI; never parses English errors. */
export function creationTemplateProblems(
  choices: WerewolfCreationChoices,
  reference: Pick<WerewolfReference, "auspices" | "tribes">,
  skills: Record<string, number>,
) {
  const problems: Array<"auspice" | "tribe" | "auspiceSkill" | "renownChoice" | "creationBudget"> = [];
  const auspice = reference.auspices.find(item => item.id === choices.auspice_id);
  const tribe = reference.tribes.find(item => item.id === choices.tribe_id);
  if (!auspice) problems.push("auspice");
  if (!tribe) problems.push("tribe");
  if (auspice) {
    try { creationAuspiceSkill(skills, auspice, choices.auspice_skill); }
    catch { problems.push("auspiceSkill"); }
  }
  if (auspice && tribe) {
    try { creationRenown(auspice, tribe, choices.renown_choice as RenownId); }
    catch { problems.push("renownChoice"); }
  }
  if (![1, 2, 3].includes(choices.primal_urge)) problems.push("creationBudget");
  else {
    try { creationMeritBudget(choices.primal_urge, choices.extra_rite_dots); }
    catch { problems.push("creationBudget"); }
  }
  return problems;
}
