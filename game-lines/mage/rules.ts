import { canonicalTraitHistory } from "@/lib/core/character/trait-identities";
import type { CharacterSheet } from "@/lib/core/character/character-types";
import type { GameLineRulesModule } from "@/lib/game-line-contracts/game-line-rules";
import { synchronizeMageBuilderMeritGrants } from "./builder-merit-grants";
import { commonMeritId } from "@/lib/core/character/merit-identities";
import { removeSpecialtyMeritGrantChoices } from "@/lib/core/character/specialty-merits";
import { resolveMeritDefinition } from "@/lib/merit-identity";

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
  normalizeCharacter(character) {
    return { ...character, current_state: canonicalTraitHistory(character.current_state, "mage_experience_history") };
  },
  onSpecialtyMeritsRemoved(character, removed) {
    return { ...character, merits: removeSpecialtyMeritGrantChoices(character.merits, removed, merit => commonMeritId(merit) ??
      resolveMeritDefinition(merit, [{ id: "mta-2ed:mystery-cult-influence", name: "Mystery Cult Influence", sourceId: "mta-2ed" }])?.id) };
  },
  synchronizeCharacter(character) {
    return synchronizeMageBuilderMeritGrants(structuredClone(character));
  },
  deriveCharacterState(character) {
    return mageDerived(character);
  },
};
