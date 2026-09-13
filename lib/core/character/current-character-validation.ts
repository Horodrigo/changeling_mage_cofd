import type { CharacterSheet } from "./character-types";
import { PERSISTED_GAME_LINE_IDS } from "./game-line-ids";

export function asRecord(value: unknown): Record<string, unknown> {
  return value !== null && typeof value === "object" ? value as Record<string, unknown> : {};
}

/** Validation is separate from current-schema normalization and migration. */
export type CurrentCharacterValidation = "valid" | "unsupported-schema" | "invalid-character";

export function validateCurrentCharacter(value: unknown): CurrentCharacterValidation {
  const record = asRecord(value);
  if (record.schema_version !== 2) return "unsupported-schema";
  if (
    record.system !== "chronicles-of-darkness" ||
    !PERSISTED_GAME_LINE_IDS.includes(record.game_line as CharacterSheet["game_line"])
  ) return "invalid-character";
  if (
    !record.character || typeof record.character !== "object" ||
    !record.attributes || typeof record.attributes !== "object" ||
    !record.skills || typeof record.skills !== "object" ||
    !Array.isArray(record.specializations) || !Array.isArray(record.merits) ||
    !record.line_data || typeof record.line_data !== "object" ||
    !record.derived || typeof record.derived !== "object" ||
    !record.current_state || typeof record.current_state !== "object"
  ) return "invalid-character";
  return "valid";
}
