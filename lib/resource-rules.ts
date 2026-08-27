export type DamageLevel = "bashing" | "lethal" | "aggravated";

const POWER_LIMITS: Record<number, { maximum: number; perTurn: number }> = {
  1: { maximum: 10, perTurn: 1 },
  2: { maximum: 11, perTurn: 2 },
  3: { maximum: 12, perTurn: 3 },
  4: { maximum: 13, perTurn: 4 },
  5: { maximum: 15, perTurn: 5 },
  6: { maximum: 20, perTurn: 6 },
  7: { maximum: 25, perTurn: 7 },
  8: { maximum: 30, perTurn: 8 },
  9: { maximum: 50, perTurn: 10 },
  10: { maximum: 75, perTurn: 15 },
};

export function powerResourceLimits(rating: number) {
  return POWER_LIMITS[Math.max(1, Math.min(10, Math.trunc(rating)))] ?? POWER_LIMITS[1];
}

export function normalizeDamage(value: unknown, health: number): DamageLevel[] {
  if (!Array.isArray(value)) return [];
  const severity: Record<DamageLevel, number> = { aggravated: 0, lethal: 1, bashing: 2 };
  return value
    .filter((item): item is DamageLevel => item === "bashing" || item === "lethal" || item === "aggravated")
    .slice(0, health)
    .sort((left, right) => severity[left] - severity[right]);
}

export function woundPenalty(damage: DamageLevel[], health: number) {
  const filled = Math.min(damage.length, health);
  if (filled >= health) return -3;
  if (filled === health - 1) return -2;
  if (filled === health - 2) return -1;
  return 0;
}
