import type { CharacterSheet } from "./character-types";

/** Permanent common Merit modifiers; no game-line mechanics or UI dependencies. */
export function derivedWithPermanentMerits(character: Pick<CharacterSheet, "derived" | "line_data" | "merits">) {
  const derived = { ...character.derived };
  const grantedSkills = character.line_data.merit_granted_skill_bonuses && typeof character.line_data.merit_granted_skill_bonuses === "object"
    ? character.line_data.merit_granted_skill_bonuses as Record<string, number> : {};
  derived.Defesa = Number(derived.Defesa ?? 0) + (Number(grantedSkills.Athletics) || 0);
  const merit = (name: string) => character.merits.find(item => item.name === name);
  const fastReflexes = merit("Fast Reflexes"), fleetOfFoot = merit("Fleet of Foot");
  if (fastReflexes) derived.Iniciativa = Number(derived.Iniciativa ?? 0) + fastReflexes.dots;
  if (fleetOfFoot) derived.Deslocamento = Number(derived.Deslocamento ?? 0) + fleetOfFoot.dots;
  const currentSize = Number(derived.Tamanho ?? 5);
  const targetSize = merit("Giant") ? 6 : merit("Small-Framed") ? 4 : currentSize;
  if (targetSize !== currentSize) {
    derived.Tamanho = targetSize;
    derived.Vitalidade = Math.max(1, Number(derived.Vitalidade ?? currentSize) + targetSize - currentSize);
  }
  return derived;
}
