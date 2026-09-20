import type { VampirePowers, VampireRuleEffect } from "./catalog-types";

export type ActiveVampireRuleEffect = VampireRuleEffect & {
  sourceId: string;
  sourceName: string;
  sourceLevel: number;
};

/**
 * Returns machine-readable rule effects granted by the character's purchased
 * Coil levels. This deliberately contains no Coil-specific conditionals:
 * consumers decide when an effect's `condition` applies.
 */
export function vampireOwnedCoilRuleEffects(
  powers: Pick<VampirePowers, "coils">,
  coilRatings: Record<string, number>,
): ActiveVampireRuleEffect[] {
  return powers.coils.flatMap((coil) => {
    const ownedRating = Math.max(0, Math.trunc(Number(coilRatings[coil.id] ?? 0)));
    return (coil.levels ?? [])
      .filter((level) => level.rating <= ownedRating)
      .flatMap((level) => (level.ruleEffects ?? []).map((effect) => ({
        ...effect,
        sourceId: coil.id,
        sourceName: level.name,
        sourceLevel: level.rating,
      })));
  });
}

export function vampireRuleEffectsFor(
  effects: readonly ActiveVampireRuleEffect[],
  rule: VampireRuleEffect["rule"],
) {
  return effects.filter((effect) => effect.rule === rule);
}
