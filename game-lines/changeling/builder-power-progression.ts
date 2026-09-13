import type { CharacterSheet } from "@/lib/core/character/character-types";
import { creationPowerProgression } from "@/lib/core/character/creation-power-progression";

export function changelingBuilderPowerProgression(sheet: CharacterSheet | null | undefined) {
  const history = sheet?.current_state?.experience_history;
  const historicalRatings = Array.isArray(history)
    ? history.flatMap((entry) => entry?.undo?.kind === "wyrd" ? [Number(entry.undo.previous)] : [])
    : [];
  return creationPowerProgression(sheet, "wyrd", historicalRatings);
}
