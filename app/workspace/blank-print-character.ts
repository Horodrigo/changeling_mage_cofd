import { ATTRIBUTES, SKILLS } from "@/lib/core/character/creation-rules";
import type { CharacterSheet } from "@/lib/core/character/character-types";
import type { PersistedGameLineId } from "@/lib/core/character/game-line-ids";

export function blankPrintCharacter(gameLine: PersistedGameLineId): CharacterSheet {
  const attributes = Object.fromEntries(Object.values(ATTRIBUTES).flat().map((name) => [name, 1]));
  const skills = Object.fromEntries(Object.values(SKILLS).flat().map((name) => [name, 0]));
  return {
    id: `blank-${gameLine}`,
    schema_version: 2,
    system: "chronicles-of-darkness",
    game_line: gameLine,
    ruleset: { id: "cofd-2e", version: 2 },
    character: { name: "", concept: "", player: "", chronicle: "" },
    attributes,
    skills,
    specializations: [],
    merits: [],
    line_data: {},
    derived: {},
    current_state: {},
    created_at: "",
    updated_at: "",
  };
}

export function isBlankPrintCharacter(character: CharacterSheet) {
  return character.id === `blank-${character.game_line}`;
}
