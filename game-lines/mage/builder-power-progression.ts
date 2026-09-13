import type { CharacterSheet } from "@/lib/core/character/character-types";
import { creationPowerProgression } from "@/lib/core/character/creation-power-progression";

export function mageBuilderPowerProgression(sheet: CharacterSheet | null | undefined) {
  const history = sheet?.current_state?.mage_experience_history;
  const historicalRatings = Array.isArray(history)
    ? history.flatMap((entry) =>
        /^Gnose \d+$/.test(String(entry?.description ?? "")) && entry?.before?.line_data?.gnosis !== undefined
          ? [Number(entry.before.line_data.gnosis)]
          : [],
      )
    : [];
  return creationPowerProgression(sheet, "gnosis", historicalRatings);
}
