import type { CharacterSheet } from "@/lib/core/character/character-types";
import { normalizeDamage, type DamageLevel } from "@/lib/resource-rules";
import { werewolfFormId, werewolfFormTraits } from "./rules";

/** WTF2 p. 172: wounds in lost temporary Health upgrade the least severe remaining wounds, left to right. */
export function damageAfterHealthReduction(value: unknown, health: number): DamageLevel[] {
  if (!Number.isInteger(health) || health < 1) throw new Error("Health must be a positive integer.");
  const damage = normalizeDamage(value, Array.isArray(value) ? value.length : 0);
  const remaining = damage.slice(0, health), excess = damage.slice(health), terminal: DamageLevel[] = [];
  for (const wound of excess) {
    const bashing = remaining.indexOf("bashing"), lethal = remaining.indexOf("lethal");
    const index = bashing >= 0 ? bashing : lethal;
    if (index < 0) {
      // A full aggravated track cannot upgrade further. Retain terminal excess rather than silently discard it.
      terminal.push(wound);
    } else remaining[index] = bashing >= 0 ? "lethal" : "aggravated";
  }
  return normalizeDamage([...remaining, ...terminal], remaining.length + terminal.length);
}

/** Both Sheet selectors use this one transaction; rendering, increasing Health and reselecting a form never heal or replay wounds. */
export function changeWerewolfForm(character: CharacterSheet, value: string): CharacterSheet["current_state"] {
  const form = werewolfFormId(value), current = werewolfFormId(character.current_state.form);
  if (form === current) return character.current_state;
  const health = werewolfFormTraits(character, form).health;
  return { ...character.current_state, form, health_damage: health < werewolfFormTraits(character, current).health
    ? damageAfterHealthReduction(character.current_state.health_damage, health)
    : normalizeDamage(character.current_state.health_damage, Array.isArray(character.current_state.health_damage) ? character.current_state.health_damage.length : 0) };
}
