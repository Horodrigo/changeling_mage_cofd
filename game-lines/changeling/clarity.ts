export const CLARITY_BREAKING_POINT_TIERS = [
  { dice: 1, examples: ["clarityBp1Unreal", "clarityBp1DreamInfiltrator", "clarityBp1NoGlamour", "clarityBp1NoContact", "clarityBp1Promise", "clarityBp1Fetch"] },
  { dice: 2, examples: ["clarityBp2Unreal", "clarityBp2DreamIntruder", "clarityBp2GoblinFruit", "clarityBp2PromiseBroken", "clarityBp2MinorLie", "clarityBp2DuranceMemories", "clarityBp2Drugs", "clarityBp2Condition", "clarityBp2DreamTampering", "clarityBp2NoContact"] },
  { dice: 3, examples: ["clarityBp3Unreal", "clarityBp3SupernaturalPower", "clarityBp3NoContact", "clarityBp3Fetch", "clarityBp3Wyrd", "clarityBp3OathBroken", "clarityBp3MortalShuns", "clarityBp3Touchstone"] },
  { dice: 4, examples: ["clarityBp4Evidence", "clarityBp4AccidentalKilling", "clarityBp4Oath", "clarityBp4DreamAssailant", "clarityBp4ImportantLie", "clarityBp4FamilyDeath", "clarityBp4Changeling", "clarityBp4OwnFetch", "clarityBp4NoContact", "clarityBp4Captive", "clarityBp4Durance", "clarityBp4Wyrd"] },
  { dice: 5, examples: ["clarityBp5Deprogramming", "clarityBp5PremeditatedKilling", "clarityBp5NoContact", "clarityBp5Torture", "clarityBp5ForcedBehavior", "clarityBp5DreamBrainwashing", "clarityBp5Arcadia", "clarityBp5TrueFae", "clarityBp5Touchstone", "clarityBp5Reaping", "clarityBp5Wyrd"] },
] as const;

export const CLARITY_ATTACK_MODIFIERS = [
  ["clarityModDurance", 3], ["clarityModForced", 3], ["clarityModStrongEmotion", 2], ["clarityModLovedOne", 2], ["clarityModCoerced", 1], ["clarityModEmotion", 1],
  ["clarityModAbsent", -1], ["clarityModAnchor", -1], ["clarityModWillpower", -1], ["clarityModNoEmotion", -1], ["clarityModAccidental", -2], ["clarityModStranger", -2], ["clarityModTriumph", -3],
] as const;

/** Changeling: The Lost 2e, pp. 104-106. */
export function clarityAttackPool(severity: unknown, modifiers: readonly number[] = []) {
  const base = Math.max(1, Math.min(5, Math.trunc(Number(severity) || 1)));
  return base + modifiers.reduce((sum, value) => sum + Math.trunc(Number(value) || 0), 0);
}
