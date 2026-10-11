import type { CharacterSheet } from "./character-types";

/** Owning lines explicitly supply authored text, never mechanical selections. */
export type CharacterNarrativePatch = {
  character?: Partial<Pick<CharacterSheet["character"], "name" | "concept" | "player" | "chronicle">>;
  line_data?: Record<string, string | string[]>;
};

export function applyNarrativePatch(character: CharacterSheet, patch: CharacterNarrativePatch): CharacterSheet {
  const identity: Record<string, string> = {};
  for (const [key, value] of Object.entries(patch.character ?? {})) {
    if (!["name", "concept", "player", "chronicle"].includes(key) || typeof value !== "string") {
      throw new Error("Invalid narrative identity field.");
    }
    identity[key] = value;
  }
  const lineData: Record<string, string | string[]> = {};
  for (const [key, value] of Object.entries(patch.line_data ?? {})) {
    if (typeof value !== "string" && (!Array.isArray(value) || !value.every(item => typeof item === "string"))) {
      throw new Error("Invalid narrative line field.");
    }
    lineData[key] = Array.isArray(value) ? [...value] : value;
  }
  return {
    ...character,
    character: { ...character.character, ...identity },
    line_data: { ...character.line_data, ...lineData },
    updated_at: new Date().toISOString(),
  };
}
