import type { CharacterSheet } from "@/lib/core/character/character-types";
import { creationPowerProgression } from "@/lib/core/character/creation-power-progression";

export function changelingBuilderPowerProgression(sheet: CharacterSheet | null | undefined) {
  const history = sheet?.current_state?.experience_history;
  const historicalRatings = Array.isArray(history)
    ? history.flatMap((entry) => entry?.undo?.kind === "wyrd" ? [Number(entry.undo.previous)] : [])
    : [];
  return creationPowerProgression(sheet, "wyrd", historicalRatings);
}

export function withChangelingPowerRating(sheet: CharacterSheet, next: number) {
  return {
    ...sheet.line_data,
    creation_wyrd: changelingBuilderPowerProgression(sheet).creation,
    wyrd: Math.max(1, Math.min(10, Math.trunc(next))),
  };
}

export function refundChangelingPowerRating(sheet: CharacterSheet) {
  const { creation, current } = changelingBuilderPowerProgression(sheet);
  return withChangelingPowerRating(sheet, Math.max(creation, current - 1));
}
