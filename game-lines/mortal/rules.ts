import type { CharacterSheet } from "@/lib/core/character/character-types";
import type { GameLineRulesModule } from "@/lib/game-line-contracts/game-line-rules";
import { boundedIntegrity, mortalDerived } from "./creation-rules";
import { synchronizeCommonMeritGrants } from "@/lib/core/character/synchronize-merit-grants";
import { meritContextForSheet, type MeritDefinition } from "@/lib/merits";

export function mortalMeritContextForSheet(sheet: CharacterSheet, catalog: readonly MeritDefinition[]) {
  return meritContextForSheet(sheet, catalog, ["mortal"], sheet.line_data.merit_granted_skill_bonuses as Record<string, number> | undefined);
}

const strings = (value: unknown) => Array.isArray(value) ? value.map(String) : [];

function normalizeMortal(character: CharacterSheet): CharacterSheet {
  const aspirations = strings(character.line_data.aspirations).slice(0, 3);
  while (aspirations.length < 3) aspirations.push("");
  const breakingPoints = strings(character.line_data.breaking_points);
  while (breakingPoints.length < 5) breakingPoints.push("");
  return {
    ...character,
    line_data: {
      ...character.line_data,
      age: String(character.line_data.age ?? ""),
      faction: String(character.line_data.faction ?? ""),
      group_name: String(character.line_data.group_name ?? ""),
      virtue: String(character.line_data.virtue ?? ""),
      vice: String(character.line_data.vice ?? ""),
      aspirations,
      breaking_points: breakingPoints,
      integrity: boundedIntegrity(character.line_data.integrity),
    },
  };
}

/** Mortal Builder/XP composition mutates its working copy; the rules hook below clones its input. */
export function synchronizeMortalMeritGrants(character: CharacterSheet) {
  character.line_data.merit_granted_skill_bonuses = synchronizeCommonMeritGrants(character);
  return character;
}

/** Pure mortal/Core hooks. No browser, persistence, or supernatural-line imports. */
export const mortalRules: GameLineRulesModule = {
  normalizeCharacter: normalizeMortal,
  synchronizeCharacter(character) {
    return synchronizeMortalMeritGrants(structuredClone(character));
  },
  deriveCharacterState: mortalDerived,
};
