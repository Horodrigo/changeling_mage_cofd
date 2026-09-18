import type { CharacterSheet } from "@/lib/core/character/character-types";
import type { GameLineRulesModule } from "@/lib/game-line-contracts/game-line-rules";
import { normalizeChangelingFrailties } from "./creation-rules";
import { synchronizeChangelingBuilderMeritGrants } from "./builder-merit-grants";

const numberValue = (value: unknown) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

function changelingDerived(character: CharacterSheet): CharacterSheet["derived"] {
  const attributes = character.attributes;
  const skills = character.skills;
  return {
    ...character.derived,
    Tamanho: 5,
    Vitalidade: 5 + numberValue(attributes.Stamina),
    Deslocamento: 5 + numberValue(attributes.Strength) + numberValue(attributes.Dexterity),
    ForçaDeVontade: numberValue(attributes.Resolve) + numberValue(attributes.Composure),
    Iniciativa: numberValue(attributes.Dexterity) + numberValue(attributes.Composure),
    Defesa:
      Math.min(numberValue(attributes.Dexterity), numberValue(attributes.Wits)) +
      numberValue(skills.Athletics),
    LucidezMaxima: numberValue(attributes.Wits) + numberValue(attributes.Composure),
  };
}

/** Pure Changeling rule hooks. No browser, persistence, or cross-line I/O. */
export const changelingRules: GameLineRulesModule = {
  normalizeCharacter(character) {
    const wyrd = numberValue(character.line_data.wyrd) || 1;
    return {
      ...character,
      line_data: {
        ...character.line_data,
        frailties: normalizeChangelingFrailties(character.line_data.frailties, wyrd),
      },
    };
  },
  synchronizeCharacter(character) {
    return synchronizeChangelingBuilderMeritGrants(structuredClone(character));
  },
  deriveCharacterState(character) {
    return changelingDerived(character);
  },
};
