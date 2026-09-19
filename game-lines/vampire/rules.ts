import type { CharacterSheet } from "@/lib/core/character/character-types";
import type { GameLineRulesModule } from "@/lib/game-line-contracts/game-line-rules";
import type { GameLineValidationIssue } from "@/lib/game-line-contracts/game-line-rules";
import { boundedRating, objectArray, recordRatings, stringArray, VAMPIRE_DISCIPLINES, vampireDerived } from "./creation-rules";

function normalizeVampire(character: CharacterSheet): CharacterSheet {
  const data = character.line_data;
  const state = character.current_state;
  const humanity = boundedRating(data.humanity, 0, 10, 7);
  const bloodPotency = boundedRating(data.blood_potency, 1, 10, 1);
  const disciplines = recordRatings(data.disciplines, VAMPIRE_DISCIPLINES, 10);
  const touchstones = objectArray(data.touchstones).map((item, index) => ({
    id: String(item.id ?? `touchstone-${index + 1}`),
    name: String(item.name ?? ""),
    humanity_slot: boundedRating(item.humanity_slot, 2, 7, index === 0 ? 6 : Math.max(2, 6 - index)),
    notes: String(item.notes ?? ""),
  }));
  const undeadCompanions = objectArray(data.undead_companions).map((item, index) => ({
    id: String(item.id ?? `undead-familiar-${index + 1}`),
    animal_id: String(item.animal_id ?? ""),
    name: String(item.name ?? ""),
    remaining_nights: Math.max(0, Math.trunc(Number(item.remaining_nights) || 0)),
  })).filter((item) => item.animal_id);
  const disciplineChoices = data.discipline_choices && typeof data.discipline_choices === "object" && !Array.isArray(data.discipline_choices) ? data.discipline_choices as Record<string, unknown> : {};
  const bloodSorcery = data.blood_sorcery && typeof data.blood_sorcery === "object" && !Array.isArray(data.blood_sorcery) ? data.blood_sorcery as Record<string, unknown> : {};
  const ordo = data.ordo_dracul && typeof data.ordo_dracul === "object" && !Array.isArray(data.ordo_dracul) ? data.ordo_dracul as Record<string, unknown> : {};
  const coilRatings = ordo.coil_ratings && typeof ordo.coil_ratings === "object" && !Array.isArray(ordo.coil_ratings) ? ordo.coil_ratings as Record<string, unknown> : {};
  const {
    torpor: _torpor,
    vitae_addictions: _vitaeAddictions,
    blush_of_life_active: _blushOfLifeActive,
    blush_of_life_extra_vitae: _blushOfLifeExtraVitae,
    frenzy_situational_modifier: _frenzySituationalModifier,
    frenzy_held_willpower: _frenzyHeldWillpower,
    ...persistedState
  } = state;

  return {
    ...character,
    line_data: {
      ...data,
      clan_id: String(data.clan_id ?? ""),
      favored_attribute: String(data.favored_attribute ?? ""),
      covenant_id: String(data.covenant_id ?? "covenantless"),
      humanity,
      blood_potency: bloodPotency,
      disciplines,
      discipline_choices: {
        ...disciplineChoices,
        protean_aspects: stringArray(disciplineChoices.protean_aspects),
        protean_forms: stringArray(disciplineChoices.protean_forms),
        protean_unnatural_aspect: stringArray(disciplineChoices.protean_unnatural_aspect),
      },
      aspirations: Array.isArray(data.aspirations) ? data.aspirations.map(String).slice(0, 3) : ["", "", ""],
      touchstones,
      undead_companions: undeadCompanions,
      devotion_ids: stringArray(data.devotion_ids),
      banes: objectArray(data.banes),
      blood_sorcery: {
        ...bloodSorcery,
        cruac_rating: boundedRating(bloodSorcery.cruac_rating, 0, 5, 0),
        cruac_rite_ids: stringArray(bloodSorcery.cruac_rite_ids),
        theban_rating: boundedRating(bloodSorcery.theban_rating, 0, 5, 0),
        theban_miracle_ids: stringArray(bloodSorcery.theban_miracle_ids),
      },
      ordo_dracul: {
        ...ordo,
        mystery_id: String(ordo.mystery_id ?? ""),
        coil_ratings: Object.fromEntries(Object.entries(coilRatings).map(([key, value]) => [key, boundedRating(value, 0, 5, 0)])),
        scale_ids: stringArray(ordo.scale_ids),
      },
    },
    current_state: {
      ...persistedState,
      vitae_current: Math.max(0, Math.trunc(Number(state.vitae_current) || 0)),
      blood_bonds: objectArray(state.blood_bonds),
    },
    derived: vampireDerived(character.attributes, character.skills, disciplines, bloodPotency),
  };
}

export const vampireRules: GameLineRulesModule = {
  normalizeCharacter: normalizeVampire,
  deriveCharacterState(character) {
    return vampireDerived(
      character.attributes,
      character.skills,
      recordRatings(character.line_data.disciplines, VAMPIRE_DISCIPLINES, 10),
      boundedRating(character.line_data.blood_potency, 1, 10, 1),
    );
  },
  validateCreation(character) {
    const issues: GameLineValidationIssue[] = [];
    if (!String(character.line_data.clan_id ?? "")) issues.push({ field: "clan_id", message: "Choose a Clan." });
    if (!String(character.line_data.mask_id ?? "")) issues.push({ field: "mask_id", message: "Choose a Mask." });
    if (!String(character.line_data.dirge_id ?? "")) issues.push({ field: "dirge_id", message: "Choose a Dirge." });
    if (!objectArray(character.line_data.touchstones).some((item) => String(item.name ?? "").trim())) issues.push({ field: "touchstones", message: "Name the first Touchstone." });
    const disciplines = recordRatings(character.line_data.disciplines, VAMPIRE_DISCIPLINES, 10);
    if (Object.values(disciplines).reduce((sum, value) => sum + value, 0) < 3) issues.push({ field: "disciplines", message: "Allocate three Discipline dots." });
    return issues;
  },
};
