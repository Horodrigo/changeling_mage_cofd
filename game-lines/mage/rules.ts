import type { CharacterSheet } from "@/lib/core/character/character-types";
import type { GameLineRulesModule } from "@/lib/game-line-contracts/game-line-rules";
import { synchronizeMageBuilderMeritGrants } from "./builder-merit-grants";

const numberValue = (value: unknown) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

function mageDerived(character: CharacterSheet): CharacterSheet["derived"] {
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
    Sabedoria: numberValue(character.line_data.wisdom) || 7,
  };
}

/** Mage-owned persistence effects run only after the current schema is valid. */
export const mageRules: GameLineRulesModule = {
  synchronizeCharacter(character) {
    return synchronizeMageBuilderMeritGrants(structuredClone(character));
  },
  deriveCharacterState(character) {
    return mageDerived(character);
  },
};
