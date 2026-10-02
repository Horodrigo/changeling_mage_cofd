import type { CharacterSheet } from "@/lib/core/character/character-types";
import { normalizeDamage, type DamageLevel } from "@/lib/resource-rules";
import { werewolfFormId, werewolfFormTraits } from "./rules";
import type { TotemBenefitCatalogs } from "./totem-benefits";
import type { TotemSelection } from "./totem-rules";

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
export function changeWerewolfForm(character: CharacterSheet, value: string, catalogs?: TotemBenefitCatalogs): CharacterSheet["current_state"] {
  const form = werewolfFormId(value), current = werewolfFormId(character.current_state.form);
  if (form === current) return character.current_state;
  const health = werewolfFormTraits(character, form, catalogs).health;
  return { ...character.current_state, form, health_damage: health < werewolfFormTraits(character, current, catalogs).health
    ? damageAfterHealthReduction(character.current_state.health_damage, health)
    : normalizeDamage(character.current_state.health_damage, Array.isArray(character.current_state.health_damage) ? character.current_state.health_damage.length : 0) };
}

/** Losing a Totem Health benefit obeys the same lost-box rule; no resource refill or XP transaction. */
export function changeWerewolfTotem(character: CharacterSheet, totem: TotemSelection | null, catalogs: TotemBenefitCatalogs): CharacterSheet {
  const next = { ...character, line_data: { ...character.line_data, totem } };
  const form = werewolfFormId(character.current_state.form), health = werewolfFormTraits(next, form, catalogs).health;
  return health < werewolfFormTraits(character, form, catalogs).health
    ? { ...next, current_state: { ...character.current_state, health_damage: damageAfterHealthReduction(character.current_state.health_damage, health) } } : next;
}
