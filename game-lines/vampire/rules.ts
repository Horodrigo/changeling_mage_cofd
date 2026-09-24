import type { CharacterSheet } from "@/lib/core/character/character-types";
import type { GameLineRulesModule } from "@/lib/game-line-contracts/game-line-rules";
import type { GameLineValidationIssue } from "@/lib/game-line-contracts/game-line-rules";
import { boundedRating, hollowKaLimits, hollowKaRank, objectArray, recordRatings, stringArray, VAMPIRE_CREATION_DISCIPLINES, VAMPIRE_DISCIPLINES, vampireCovenantIds, vampireDerived, vampireDisciplineAvailable } from "./creation-rules";
import { synchronizeVampireBuilderMeritGrants } from "./builder-merit-grants";

function normalizeVampire(character: CharacterSheet): CharacterSheet {
  const data = character.line_data;
  const state = character.current_state;
  const humanity = boundedRating(data.humanity, 0, 10, 7);
  const bloodPotency = boundedRating(data.blood_potency, 1, 10, 1);
  const bloodlineId = String(data.bloodline_id ?? "");
  const clanId = String(data.clan_id ?? "");
  const covenantIds = vampireCovenantIds(data);
  const savedPrimaryCovenant = String(data.covenant_id ?? "covenantless");
  const covenantId = covenantIds.includes(savedPrimaryCovenant) ? savedPrimaryCovenant : covenantIds[0] ?? "covenantless";
  const disciplines = recordRatings(data.disciplines, VAMPIRE_DISCIPLINES, 10);
  for (const name of VAMPIRE_DISCIPLINES) if (!vampireDisciplineAvailable(name, bloodlineId, clanId, covenantIds)) disciplines[name] = 0;
  const touchstones = objectArray(data.touchstones).map((item, index) => ({
    id: String(item.id ?? `touchstone-${index + 1}`),
    name: String(item.name ?? ""),
    humanity_slot: boundedRating(item.humanity_slot, 2, 7, index === 0 ? 6 : Math.max(2, 6 - index)),
    notes: String(item.notes ?? ""),
  }));
  const normalizedBanes = objectArray(data.banes).map((bane, index) => ({
    id: String(bane.id ?? `bane-${index + 1}`),
    name: String(bane.name ?? ""),
    breaking_point_id: String(bane.breaking_point_id ?? ""),
    breaking_point_level: boundedRating(bane.breaking_point_level, 0, 10, 0),
    required_by: String(bane.required_by ?? ""),
  }));
  const mekhetBane = normalizedBanes.find((bane) => bane.required_by === "mekhet");
  const banes = clanId === "mekhet"
    ? [{ ...(mekhetBane ?? {}), id: "mekhet-clan-bane", name: mekhetBane?.name ?? "", breaking_point_id: "", breaking_point_level: 0, required_by: "mekhet" }, ...normalizedBanes.filter((bane) => bane.required_by !== "mekhet")].slice(0, 3)
    : normalizedBanes.filter((bane) => bane.required_by !== "mekhet").filter((bane) => bane.name || bane.breaking_point_id).slice(0, 3);
  const undeadCompanions = objectArray(data.undead_companions).map((item, index) => ({
    id: String(item.id ?? `undead-familiar-${index + 1}`),
    animal_id: String(item.animal_id ?? ""),
    name: String(item.name ?? ""),
    health_damage: Array.isArray(item.health_damage) ? item.health_damage.filter((damage) => damage === "bashing" || damage === "lethal" || damage === "aggravated") : [],
    undying: Boolean(item.undying),
  })).filter((item) => item.animal_id);
  const disciplineChoices = data.discipline_choices && typeof data.discipline_choices === "object" && !Array.isArray(data.discipline_choices) ? data.discipline_choices as Record<string, unknown> : {};
  const bloodSorcery = data.blood_sorcery && typeof data.blood_sorcery === "object" && !Array.isArray(data.blood_sorcery) ? data.blood_sorcery as Record<string, unknown> : {};
  const ordo = data.ordo_dracul && typeof data.ordo_dracul === "object" && !Array.isArray(data.ordo_dracul) ? data.ordo_dracul as Record<string, unknown> : {};
  const coilRatings = ordo.coil_ratings && typeof ordo.coil_ratings === "object" && !Array.isArray(ordo.coil_ratings) ? ordo.coil_ratings as Record<string, unknown> : {};
  const rawKa = data.hollow_ka && typeof data.hollow_ka === "object" && !Array.isArray(data.hollow_ka) ? data.hollow_ka as Record<string, unknown> : {};
  const kaRank = hollowKaRank(humanity);
  const kaLimits = hollowKaLimits(kaRank);
  const kaPower = boundedRating(rawKa.power, 1, kaLimits.traitMaximum, Math.max(1, Math.ceil(kaLimits.attributeMinimum / 3)));
  const kaFinesse = boundedRating(rawKa.finesse, 1, kaLimits.traitMaximum, Math.max(1, Math.floor(kaLimits.attributeMinimum / 3)));
  const kaResistance = boundedRating(rawKa.resistance, 1, kaLimits.traitMaximum, Math.max(1, kaLimits.attributeMinimum - kaPower - kaFinesse));
  const persistedState = { ...state };
  for (const retiredKey of ["blush_of_life_active", "blush_of_life_extra_vitae", "frenzy_situational_modifier", "frenzy_held_willpower", "torpor", "vitae_addictions"])
    delete persistedState[retiredKey];

  return {
    ...character,
    line_data: {
      ...data,
      clan_id: clanId,
      bloodline_id: bloodlineId,
      clan_bane_active: data.clan_bane_active !== false,
      favored_attribute: String(data.favored_attribute ?? ""),
      covenant_id: covenantId,
      covenant_ids: covenantIds,
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
      detournement_ids: stringArray(data.detournement_ids),
      banes,
      kindred_status_scope: ["covenant", "clan", "city"].includes(String(data.kindred_status_scope ?? "")) ? String(data.kindred_status_scope) : "covenant",
      kindred_status_city: String(data.kindred_status_city ?? ""),
      kindred_status_group: String(data.kindred_status_group ?? ""),
      blood_sorcery: {
        ...bloodSorcery,
        cruac_rating: boundedRating(bloodSorcery.cruac_rating, 0, 5, 0),
        cruac_rite_ids: stringArray(bloodSorcery.cruac_rite_ids),
        theban_rating: boundedRating(bloodSorcery.theban_rating, 0, 5, 0),
        theban_miracle_ids: stringArray(bloodSorcery.theban_miracle_ids),
        kimiya_rating: boundedRating(bloodSorcery.kimiya_rating, 0, 5, 0),
        kimiya_formula_ids: stringArray(bloodSorcery.kimiya_formula_ids),
        therion_rating: boundedRating(bloodSorcery.therion_rating, 0, 5, 0),
        therion_sacrilege_ids: stringArray(bloodSorcery.therion_sacrilege_ids),
        gilded_cage_rating: boundedRating(bloodSorcery.gilded_cage_rating, 0, 5, 0),
        gilded_invocation_ids: stringArray(bloodSorcery.gilded_invocation_ids),
      },
      ordo_dracul: {
        ...ordo,
        mystery_id: String(ordo.mystery_id ?? ""),
        coil_ratings: Object.fromEntries(Object.entries(coilRatings).map(([key, value]) => [key, boundedRating(value, 0, 5, 0)])),
        scale_ids: stringArray(ordo.scale_ids),
      },
      hollow_ka: clanId === "hollow-mekhet" ? {
        name: String(rawKa.name ?? ""),
        concept: String(rawKa.concept ?? ""),
        simplified: Boolean(rawKa.simplified),
        rank: kaRank,
        power: kaPower,
        finesse: kaFinesse,
        resistance: kaResistance,
        bane: String(rawKa.bane ?? ""),
        anchors: stringArray(rawKa.anchors),
        influences: stringArray(rawKa.influences),
        manifestations: stringArray(rawKa.manifestations),
        numina: stringArray(rawKa.numina),
        derived: { corpus: kaResistance + 5, willpower: kaResistance + kaFinesse, initiative: kaFinesse + kaResistance, defense: kaRank === 1 ? Math.max(kaPower, kaFinesse) : Math.min(kaPower, kaFinesse), speed: kaPower + kaFinesse + 5, essence_maximum: kaLimits.essenceMaximum },
      } : undefined,
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
  synchronizeCharacter(character) {
    return synchronizeVampireBuilderMeritGrants(structuredClone(character));
  },
  validateCreation(character) {
    const issues: GameLineValidationIssue[] = [];
    if (!String(character.line_data.clan_id ?? "")) issues.push({ field: "clan_id", message: "Choose a Clan." });
    if (!String(character.line_data.mask_id ?? "")) issues.push({ field: "mask_id", message: "Choose a Mask." });
    if (!String(character.line_data.dirge_id ?? "")) issues.push({ field: "dirge_id", message: "Choose a Dirge." });
    const disciplines = recordRatings(character.line_data.disciplines, VAMPIRE_CREATION_DISCIPLINES, 10);
    const covenantDot = String(character.line_data.creation_covenant_power_id ?? "") ? 1 : 0;
    if (Object.values(disciplines).reduce((sum, value) => sum + value, 0) + covenantDot < 3) issues.push({ field: "disciplines", message: "Allocate three Discipline dots." });
    return issues;
  },
};
