export type VampireDetachmentBreakingPoint = {
  level: number;
  dice: number;
  examples: string[];
};

export const DETACHMENT_BREAKING_POINTS: VampireDetachmentBreakingPoint[] = [
  { level: 10, dice: 5, examples: ["One night without human contact", "Lying in defense of the Masquerade", "Spending more than one Vitae in a night"] },
  { level: 9, dice: 5, examples: ["Watching humans eat a meal", "Committing a superhuman physical feat", "Feeding from the unwilling or unknowing", "Urging behavior with a Discipline", "Spending an hour in the sun"] },
  { level: 8, dice: 4, examples: ["Creating a ghoul", "Rejected by a human", "Riding the wave of frenzy", "Depriving consent with a Discipline", "Spending most of a day in the sun"] },
  { level: 7, dice: 4, examples: ["One week active without human contact", "Surviving something that would hospitalize a human", "Injuring someone over blood"] },
  { level: 6, dice: 3, examples: ["Falling into torpor", "Feeding from a child", "Reading your own obituary", "Experiencing immense physical trauma"] },
  { level: 5, dice: 3, examples: ["Two weeks active without human contact", "Reaching Blood Potency 3", "Death of a mortal family member", "Joining a covenant deeply enough to gain Status"] },
  { level: 4, dice: 2, examples: ["Learning a dot of Crúac", "Impassioned violence", "Spending a year or more in torpor", "Surviving a century", "Accidentally killing"] },
  { level: 3, dice: 2, examples: ["One month active without human contact", "Reaching Blood Potency 6", "Death of a mortal spouse or child", "Impassioned killing"] },
  { level: 2, dice: 1, examples: ["One year active without human contact", "Premeditated killing", "Seeing a culture that did not exist when you were alive", "Surviving 500 years", "Creating a revenant"] },
  { level: 1, dice: 0, examples: ["One decade active without human contact", "Heinous, spree, or mass murder", "Killing your Touchstone"] },
];

export function vampireDetachmentBaseDice(level: number) {
  const normalized = Math.max(1, Math.min(10, Math.trunc(Number(level) || 1)));
  return DETACHMENT_BREAKING_POINTS.find((item) => item.level === normalized)?.dice ?? 0;
}

export function vampireDetachmentTouchstoneModifier(attachedTouchstones: number) {
  const count = Math.max(0, Math.trunc(Number(attachedTouchstones) || 0));
  if (count === 0) return -2;
  if (count === 1) return 2;
  return 3;
}

export function vampireDetachmentPool(level: number, attachedTouchstones: number, otherModifier = 0) {
  return vampireDetachmentBaseDice(level)
    + vampireDetachmentTouchstoneModifier(attachedTouchstones)
    + Math.trunc(Number(otherModifier) || 0);
}
