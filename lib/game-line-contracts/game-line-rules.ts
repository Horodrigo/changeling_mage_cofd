import type { CharacterSheet } from "@/lib/core/character/character-types";

export type GameLineValidationIssue = {
  field?: string;
  message: string;
};

/**
 * Explicit, pure rule hooks owned by a game line. Hooks receive and return
 * values; they must not mutate their input or perform persistence/network I/O.
 */
export interface GameLineRulesModule {
  normalizeCharacter?: (character: CharacterSheet) => CharacterSheet;
  migrateCharacter?: (value: unknown, player: string) => CharacterSheet;
  deriveCharacterState?: (character: CharacterSheet) => CharacterSheet["derived"];
  validateCreation?: (character: CharacterSheet) => readonly GameLineValidationIssue[];
  synchronizeCharacter?: (character: CharacterSheet) => CharacterSheet;
}
