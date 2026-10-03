import type { CharacterSheet } from "@/lib/core/character/character-types";
import { creationPowerProgression } from "@/lib/core/character/creation-power-progression";

export function mageBuilderPowerProgression(sheet: CharacterSheet | null | undefined) {
  const history = sheet?.current_state?.mage_experience_history;
  const historicalRatings = Array.isArray(history)
    ? history.flatMap((entry) => {
        if (entry?.undo?.kind !== "gnosis") return [];
        const amount = entry.undo.amount ?? 1;
        if (!Number.isInteger(amount) || amount < 1 || amount > 9) return [];
        const previous = entry.rating !== undefined ? Number(entry.rating) - Number(amount) : Number(entry.before?.line_data?.gnosis);
        return Number.isInteger(previous) && previous >= 1 && previous <= 10 ? [previous] : [];
      })
    : [];
  return creationPowerProgression(sheet, "gnosis", historicalRatings);
}

export function withMagePowerRating(sheet: CharacterSheet, next: number) {
  return {
    ...sheet.line_data,
    creation_gnosis: mageBuilderPowerProgression(sheet).creation,
    gnosis: Math.max(1, Math.min(10, Math.trunc(next))),
  };
}

export function refundMagePowerRating(sheet: CharacterSheet) {
  const { creation, current } = mageBuilderPowerProgression(sheet);
  return withMagePowerRating(sheet, Math.max(creation, current - 1));
}
