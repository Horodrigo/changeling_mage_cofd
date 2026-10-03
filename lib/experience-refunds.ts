import type { CharacterSheet } from "./core/character/character-types";
import { experienceMeritDots, removeExperienceMeritDots } from "./merit-progression";
import { meritInstanceIsUnique } from "./merit-identity";

export function subtractDots(value: unknown, amount = 1, minimum = 0) {
  return Math.max(minimum, (Number(value) || 0) - amount);
}

export function refundMeritDots(sheet: CharacterSheet, name: string, amount: number, instanceId?: string, legacyIndex?: number, definitionId?: string) {
  if (instanceId && !meritInstanceIsUnique({ instanceId }, sheet.merits)) return false;
  const candidates = sheet.merits.map((item, index) => ({ item, index })).filter(({ item }) => item.name === name && !item.grantedBy);
  const index = instanceId
    ? sheet.merits.findIndex(item => item.instanceId === instanceId)
    : candidates.length === 1 && (legacyIndex === undefined || legacyIndex === candidates[0].index) ? candidates[0].index : -1;
  if (index < 0 || !Number.isInteger(amount) || amount <= 0 || experienceMeritDots(sheet.merits[index]) < amount) return false;
  // New ID-keyed transactions cannot fall back to a namesake or creation dots.
  if (definitionId && (!instanceId || sheet.merits[index].definitionId !== definitionId)) return false;
  if (removeExperienceMeritDots(sheet.merits[index], amount) === 0) sheet.merits.splice(index, 1);
  return true;
}
