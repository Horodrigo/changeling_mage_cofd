import type { CharacterSheet } from "./character-types";
import { commonMeritId } from "./merit-identities";

/** Permanent common Merit modifiers; no game-line mechanics or UI dependencies. */
export function derivedWithPermanentMerits(character: Pick<CharacterSheet, "derived" | "line_data" | "merits">) {
  const derived = { ...character.derived };
  const grantedSkills = character.line_data.merit_granted_skill_bonuses && typeof character.line_data.merit_granted_skill_bonuses === "object"
    ? character.line_data.merit_granted_skill_bonuses as Record<string, number> : {};
  derived.Defense = Number(derived.Defense ?? 0) + (Number(grantedSkills.Athletics) || 0);
  const merit = (id: string) => character.merits.find(item => commonMeritId(item) === id);
  const fastReflexes = merit("core-2ed:fast-reflexes"), fleetOfFoot = merit("core-2ed:fleet-of-foot");
  if (fastReflexes) derived.Initiative = Number(derived.Initiative ?? 0) + fastReflexes.dots;
  if (fleetOfFoot) derived.Speed = Number(derived.Speed ?? 0) + fleetOfFoot.dots;
  const currentSize = Number(derived.Size ?? 5);
  const targetSize = merit("core-2ed:giant") ? 6 : merit("core-2ed:small-framed") ? 4 : currentSize;
  if (targetSize !== currentSize) {
    derived.Size = targetSize;
    derived.Health = Math.max(1, Number(derived.Health ?? currentSize) + targetSize - currentSize);
  }
  return derived;
}
