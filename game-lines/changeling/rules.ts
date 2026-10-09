import { canonicalTraitHistory } from "@/lib/core/character/trait-identities";
import type { CharacterSheet } from "@/lib/core/character/character-types";
import type { GameLineRulesModule } from "@/lib/game-line-contracts/game-line-rules";
import { normalizeChangelingFrailties } from "./creation-rules";
import { synchronizeChangelingBuilderMeritGrants } from "./builder-merit-grants";
import { recoverChangelingMeritAllocations } from "./merit-allocation";
import { INTERDISCIPLINARY_SPECIALTY_ID } from "@/lib/core/character/specialty-merits";
import { commonMeritId } from "@/lib/core/character/merit-identities";

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
  onSpecialtyMeritsRemoved(character, removed) {
    const state = character.line_data.entitlement as { definitionId?: string; suspendedBenefitIds?: string[] } | undefined;
    if (!state || !removed.some(item => commonMeritId(item) === INTERDISCIPLINARY_SPECIALTY_ID && item.grantedBy === `Entitlement:${state.definitionId}`)) return character;
    return { ...character, line_data: { ...character.line_data, entitlement: { ...state, suspendedBenefitIds: [...new Set([...(state.suspendedBenefitIds ?? []), "hedge-interdisciplinary"])] } } };
  },
  normalizeCharacter(character) {
    const wyrd = numberValue(character.line_data.wyrd) || 1;
    character = { ...character, current_state: canonicalTraitHistory(character.current_state, "experience_history") };
    return {
      ...character,
      // Production schema-2 recovery for the former distributed Book of Seemings label.
      // Only this owning normalization may attach its known ID; never rename authored
      // labels or replace explicit IDs. Delete when these ID-less rows are unsupported.
      merits: recoverChangelingMeritAllocations(character).map(item =>
        !item.definitionId && item.name === "Throne" && item.sourceId === "h-seemings"
          ? { ...item, definitionId: "h-seemings:power-behind-the-throne" } : item),
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
