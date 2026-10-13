import { mageSpellSelection } from "./spell-presentation";
import { canonicalTraitHistory, canonicalTraitId } from "@/lib/core/character/trait-identities";
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
  const derived = { ...character.derived };
  delete derived.Sabedoria;
  return {
    ...derived,
    Size: 5,
    Health: 5 + numberValue(attributes.Stamina),
    Speed: 5 + numberValue(attributes.Strength) + numberValue(attributes.Dexterity),
    Willpower: numberValue(attributes.Resolve) + numberValue(attributes.Composure),
    Initiative: numberValue(attributes.Dexterity) + numberValue(attributes.Composure),
    Defense:
      Math.min(numberValue(attributes.Dexterity), numberValue(attributes.Wits)) +
      numberValue(skills.Athletics),
    Wisdom: numberValue(character.line_data.wisdom) || 7,
  };
}

/** Mage-owned persistence effects run only after the current schema is valid. */
export const mageRules: GameLineRulesModule = {
  normalizeCharacter(character) {
    const line_data = { ...character.line_data };
    const canonicalSkill = (value: unknown) => typeof value === "string" ? canonicalTraitId("skills", value) : value;
    if (typeof line_data.resistance_bonus === "string") line_data.resistance_bonus = canonicalTraitId("attributes", line_data.resistance_bonus);
    if (Array.isArray(line_data.rote_skills)) line_data.rote_skills = line_data.rote_skills.map(canonicalSkill);
    if (line_data.custom_order && typeof line_data.custom_order === "object" && !Array.isArray(line_data.custom_order)) {
      const custom = line_data.custom_order as Record<string, unknown>;
      if (Array.isArray(custom.roteSkills)) line_data.custom_order = { ...custom, roteSkills: custom.roteSkills.map(canonicalSkill) };
    }
    for (const key of ["rotes", "praxes", "learned_rotes", "learned_praxes", "inured_spells"]) {
      const values = line_data[key];
      if (Array.isArray(values)) line_data[key] = values.map(value => {
        if (!value || typeof value !== "object" || Array.isArray(value)) return value;
        const selected = mageSpellSelection(value as Record<string, unknown>);
        return { ...selected,
          ...(typeof selected.roteSkill === "string" ? { roteSkill: canonicalSkill(selected.roteSkill) } : {}),
          ...(Array.isArray(selected.roteSkills) ? { roteSkills: selected.roteSkills.map(canonicalSkill) } : {}),
        };
      });
    }
    const merits = character.merits?.map(merit => {
      const nameless = merit.grantedBy === "Nameless Order" && resolveMeritDefinition(merit, [{ id: "core-2ed:mystery-cult-initiation", name: "Mystery Cult Initiation", sourceId: "core-2ed" }])?.id === "core-2ed:mystery-cult-initiation";
      const faction = resolveMeritDefinition(merit, [{ id: "mta-tome:faction-member", name: "Faction Member", sourceId: "mta-tome" }])?.id === "mta-tome:faction-member";
      if (!merit.configuration || (!nameless && !faction)) return merit;
      const configuration = { ...merit.configuration };
      if (nameless && Array.isArray(configuration.level_2_rote_skills)) configuration.level_2_rote_skills = configuration.level_2_rote_skills.map(canonicalSkill) as string[];
      if (faction && typeof configuration.roteSkill === "string") configuration.roteSkill = canonicalSkill(configuration.roteSkill) as string;
      return { ...merit, configuration };
    });
    return { ...character, ...(merits ? { merits } : {}), line_data, current_state: canonicalTraitHistory(character.current_state, "mage_experience_history") };
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
