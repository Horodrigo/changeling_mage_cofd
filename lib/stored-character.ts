import type { CharacterSheet } from "./core/character/character-types";
import type { PersistedGameLineId } from "./core/character/game-line-ids";
import { asRecord, validateCurrentCharacter } from "./core/character/current-character-validation";
import { PERSISTED_GAME_LINE_IDS } from "./core/character/game-line-ids";

/**
 * Local storage can contain character exports from schemas we no longer
 * support. Keep those values opaque until the user explicitly removes them;
 * loading the character list must never try to migrate or normalize them.
 */
export type StoredCharacter = unknown;

export type StoredCharacterSummary = {
  name: string;
  concept: string;
  gameLine: PersistedGameLineId | null;
  updatedAt: string;
  isCurrent: boolean;
};

export function isCurrentStoredCharacter(value: StoredCharacter): value is CharacterSheet {
  return validateCurrentCharacter(value) === "valid";
}

export function storedCharacterId(value: StoredCharacter): string | null {
  const id = asRecord(value).id;
  return typeof id === "string" && id ? id : null;
}

export function summarizeStoredCharacter(value: StoredCharacter): StoredCharacterSummary {
  const record = asRecord(value);
  const character = asRecord(record.character);
  const gameLine = typeof record.game_line === "string" && PERSISTED_GAME_LINE_IDS.includes(record.game_line as PersistedGameLineId)
    ? record.game_line as PersistedGameLineId
    : null;
  return {
    name: readableText(character.name, "Ficha sem nome"),
    concept: readableText(character.concept, ""),
    gameLine,
    updatedAt: typeof record.updated_at === "string" ? record.updated_at : "",
    isCurrent: isCurrentStoredCharacter(value),
  };
}

function readableText(value: unknown, fallback: string) {
  return typeof value === "string" && value.trim() ? value : fallback;
}
