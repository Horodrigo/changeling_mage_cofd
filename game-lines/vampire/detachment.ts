export type VampireDetachmentBreakingPoint = {
  id: string;
  level: number;
  label: string;
};

export type VampireDetachmentTier = {
  level: number;
  dice: number;
  breakingPoints: VampireDetachmentBreakingPoint[];
};

const tier = (level: number, dice: number, labels: string[]): VampireDetachmentTier => ({
  level,
  dice,
  breakingPoints: labels.map((label, index) => ({ id: `humanity-${level}-${index + 1}`, level, label })),
});

export const DETACHMENT_BREAKING_POINT_TIERS: VampireDetachmentTier[] = [
  tier(10, 5, ["One night without human contact", "Lying in defense of the Masquerade", "Spending more than one Vitae in a night"]),
  tier(9, 5, ["Watching humans eat a meal", "Committing a superhuman feat of physical prowess", "Feeding from the unwilling or unknowing", "Urging another's behavior with a Discipline", "Spending an hour in the sun"]),
  tier(8, 4, ["Creating a ghoul", "Rejected by a human", "Riding the wave of frenzy", "Depriving another of consent with a Discipline", "Spending most of a day in the sun"]),
  tier(7, 4, ["One week active without human contact", "Surviving something that would hospitalize a human", "Injuring someone over blood"]),
  tier(6, 3, ["Falling into torpor", "Feeding from a child", "Reading your own obituary", "Experiencing a car crash or other immense physical trauma"]),
  tier(5, 3, ["Two weeks active without human contact", "Reaching Blood Potency 3", "Death of a mortal family member", "Joining a covenant to the point of gaining Status for it"]),
  tier(4, 2, ["Learning a dot of Crúac", "Impassioned violence", "Spending a year or more in torpor", "Surviving a century", "Accidentally killing"]),
  tier(3, 2, ["One month active without human contact", "Reaching Blood Potency 6", "Death of a mortal spouse or child", "Impassioned killing"]),
  tier(2, 1, ["One year active without human contact", "Premeditated killing", "Seeing a culture that did not exist when you were alive", "Surviving 500 years", "Creating a revenant"]),
  tier(1, 0, ["One decade active without human contact", "Heinous, spree, or mass murder", "Killing your Touchstone"]),
];


export const VAST_DYNASTY_EMBRACE_BREAKING_POINT: VampireDetachmentBreakingPoint = {
  id: "voivode-vast-dynasty-embrace",
  level: 3,
  label: "Embrace (The Vast Dynasty)",
};

/** Backward-compatible tier export used by older UI/tests. */
export const DETACHMENT_BREAKING_POINTS = DETACHMENT_BREAKING_POINT_TIERS.map((item) => ({
  level: item.level,
  dice: item.dice,
  examples: item.breakingPoints.map((point) => point.label),
}));

export const DETACHMENT_BREAKING_POINT_OPTIONS = DETACHMENT_BREAKING_POINT_TIERS.flatMap((item) => item.breakingPoints);

export function vampireDetachmentBaseDice(level: number) {
  const normalized = Math.max(1, Math.min(10, Math.trunc(Number(level) || 1)));
  return DETACHMENT_BREAKING_POINT_TIERS.find((item) => item.level === normalized)?.dice ?? 0;
}

export function vampireDetachmentTouchstoneModifier(attachedTouchstones: number) {
  const count = Math.max(0, Math.trunc(Number(attachedTouchstones) || 0));
  if (count === 0) return -2;
  if (count === 1) return 2;
  return 3;
}

export function vampireDetachmentPool(level: number, attachedTouchstones: number, otherModifier = 0, baneCount = 0) {
  return vampireDetachmentBaseDice(level)
    + vampireDetachmentTouchstoneModifier(attachedTouchstones)
    + Math.trunc(Number(otherModifier) || 0)
    - Math.max(0, Math.min(3, Math.trunc(Number(baneCount) || 0)));
}
