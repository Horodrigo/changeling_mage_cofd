import type { CharacterSheet } from "@/lib/core/character/character-types";

export function werewolfLodgeId(value: unknown): string {
  return typeof value === "string" ? value : "";
}

export function joinWerewolfLodge(character: CharacterSheet, definitionId: string): CharacterSheet {
  if (!definitionId.trim()) throw new Error("A Lodge definition ID is required.");
  const currentId = werewolfLodgeId(character.line_data.lodge_id);
  if (currentId && currentId !== definitionId) throw new Error("Leave the current Lodge before joining another.");
  if (currentId === definitionId) return character;
  return {
    ...character,
    line_data: { ...character.line_data, lodge_id: definitionId, lodge_notes: "" },
  };
}

export function leaveWerewolfLodge(character: CharacterSheet, definitionId: string): CharacterSheet {
  if (werewolfLodgeId(character.line_data.lodge_id) !== definitionId) return character;
  return {
    ...character,
    line_data: { ...character.line_data, lodge_id: "", lodge_notes: "" },
  };
}
