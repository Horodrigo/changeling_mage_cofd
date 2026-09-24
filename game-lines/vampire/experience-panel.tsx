"use client";

import { useState } from "react";
import { History, RotateCcw, ShoppingBag } from "lucide-react";
import { MeritConfigurationEditor } from "@/app/builder/merit-configuration-editor";
import { BeatTrack, ExperienceMeritPicker, ExperienceRatingPicker, convertFifthBeat, experiencePurchaseBalances, groupedPurchaseOptions, isRepeatableDefinition, type ExperiencePurchaseGroup } from "@/app/workspace/experience-shared";
import { RuleSelect, type RuleSelectOption } from "@/app/workspace/rule-select";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import type { CharacterSheet } from "@/lib/core/character/character-types";
import { ATTRIBUTES, SKILLS } from "@/lib/core/character/creation-rules";
import { normalizeMeritConfiguration, type MeritConfiguration } from "@/lib/core/character/merit-configuration";
import type { CatalogSnapshot } from "@/lib/game-line-contracts/catalog-groups";
import { useLanguage } from "@/lib/i18n";
import { meritContextForSheet, meritRatingsFor, type MeritDefinition } from "@/lib/merits";
import { createRandomId } from "@/lib/random-id";
import { systemTerm } from "@/lib/system-terms";
import type { VampirePowers, VampireReference, VampirePurchasablePower } from "./catalog-types";
import { recordRatings, VAMPIRE_DISCIPLINES, vampireCovenantAffiliationDots, vampireCovenantIds, vampireCovenantStatus, vampireDerived, vampireDisciplineAvailable, vampireDisciplineDisplayName } from "./creation-rules";
import { refundVampireAdvancement, type VampireAdvancementUndo } from "./experience-refunds";
import { synchronizeVampireBuilderMeritGrants } from "./builder-merit-grants";
import { VAMPIRE_MERIT_CONFIGURATIONS } from "./merit-configurations";
import { vampireMeritEligible } from "./merit-eligibility";
import { useHomebrewPreferences } from "@/app/use-homebrew";
import { useMeritHomebrews } from "@/app/use-merit-homebrews";
import { activeMeritCatalog } from "@/lib/merit-homebrews";

type PurchaseType = "attribute" | "skill" | "specialty" | "merit" | "discipline" | "blood-potency" | "humanity" | "willpower" | "devotion" | "cruac" | "theban" | "kimiya" | "therion" | "gilded" | "rite" | "miracle" | "formula" | "sacrilege" | "invocation" | "detournement" | "coil" | "scale";
type HistoryEntry = { id: string; label: string; cost: number; createdAt: string; before?: CharacterSheet; undo?: VampireAdvancementUndo };

const PURCHASE_GROUPS = [
  { group: "core", purchases: ["attribute", "skill", "specialty", "merit"] },
  { group: "supernatural", purchases: ["blood-potency", "discipline", "cruac", "theban", "kimiya", "therion", "gilded", "coil"] },
  { group: "integrity", purchases: ["humanity", "willpower"] },
  { group: "acquired", purchases: ["devotion", "rite", "miracle", "formula", "sacrilege", "invocation", "detournement", "scale"] },
] as const satisfies readonly ExperiencePurchaseGroup<PurchaseType>[];

export function purchaseLabel(type: PurchaseType, locale: string) {
  const labels: Record<PurchaseType, [string, string]> = {
    attribute: ["Atributo", "Attribute"], skill: ["Perícia", "Skill"], specialty: ["Especialização", "Specialty"], merit: ["Mérito", "Merit"],
    discipline: ["Disciplina", "Discipline"], "blood-potency": ["Potência de Sangue", "Blood Potency"], humanity: ["Humanidade", "Humanity"], willpower: ["Ponto perdido de Força de Vontade", "Lost Willpower dot"],
    devotion: ["Devoção", "Devotion"], cruac: ["Crúac", "Crúac"], theban: ["Feitiçaria Tebana", "Theban Sorcery"], kimiya: ["Kimiya", "Kimiya"], therion: ["Therion", "Therion"], gilded: ["Gilded Cage", "Gilded Cage"], rite: ["Rito Crúac", "Crúac Rite"], miracle: ["Milagre Tebano", "Theban Miracle"], formula: ["Fórmula Kimiya", "Kimiya Formula"], sacrilege: ["Sacrilégio Therion", "Therion Sacrilege"], invocation: ["Invocação Gilded", "Gilded Invocation"], detournement: ["Detournement", "Detournement"], coil: ["Espiral do Dragão", "Coil of the Dragon"], scale: ["Escala do Dragão", "Scale of the Dragon"],
  };
  return labels[type][locale === "pt-BR" ? 0 : 1];
}

function powerName(item: VampirePurchasablePower, locale: string) { return locale === "pt-BR" ? item.translatedName : item.name; }

export function eligibleBloodSorceryPowers(catalog: VampirePurchasablePower[], knownIds: Set<string>, maximumRating: number, maximumHumanity = 10) {
  return catalog
    .filter((item) => !knownIds.has(item.id) && Number(item.rating ?? 0) <= maximumRating && Number(item.rating ?? 0) <= maximumHumanity)
    .sort((left, right) => Number(left.rating ?? 0) - Number(right.rating ?? 0) || left.name.localeCompare(right.name));
}

export function freeBloodSorcerySelections(catalog: VampirePurchasablePower[], knownIds: Set<string>, savedIds: string[], currentRating: number, targetRating: number, maximumHumanity = 10) {
  const selected: string[] = [];
  for (let rating = currentRating + 1; rating <= targetRating; rating += 1) {
    const eligible = eligibleBloodSorceryPowers(catalog, new Set([...knownIds, ...selected]), rating, maximumHumanity);
    const saved = savedIds[selected.length];
    selected.push(eligible.some((item) => item.id === saved) ? saved : eligible[0]?.id ?? "");
  }
  return selected;
}

function disciplinePrerequisitesMet(prerequisites: string | undefined, disciplines: Record<string, number>) {
  if (!prerequisites) return true;
  return prerequisites.split(",").every((clause) => {
    const name = VAMPIRE_DISCIPLINES.find((discipline) => clause.toLocaleLowerCase().includes(discipline.toLocaleLowerCase()));
    if (!name) return true;
    const required = [...clause].filter((character) => character === "•").length;
    return Number(disciplines[name] ?? 0) >= required;
  });
}

function coilPrerequisiteMet(prerequisites: string | undefined, ratings: Record<string, number>) {
  const match = prerequisites?.match(/(coil-[a-z-]+)\s+(\d+)/i);
  return !match || Number(ratings[match[1]] ?? 0) >= Number(match[2]);
}

export function VampireExperiencePanel({ character, updateSheet, catalogs, builderMode = false }: { character: CharacterSheet; updateSheet: (sheet: CharacterSheet) => void; catalogs: CatalogSnapshot; builderMode?: boolean }) {
  const { locale, t } = useLanguage();
  const state = character.current_state;
  const available = Math.max(0, Math.trunc(Number(state.experience_available ?? 0)));
  const spent = Math.max(0, Math.trunc(Number(state.experience_spent ?? 0)));
  const total = Math.max(available + spent, Math.max(0, Math.trunc(Number(state.experience_total ?? 0))));
  const beats = Math.max(0, Math.min(5, Math.trunc(Number(state.beats ?? 0))));
  const history = Array.isArray(state.vampire_experience_history) ? state.vampire_experience_history as HistoryEntry[] : [];
  const reference = catalogs.get<VampireReference>("vampire-reference");
  const powers = catalogs.get<VampirePowers>("vampire-powers");
  const customMerits=useMeritHomebrews("VtR",true),homebrewPreferences=useHomebrewPreferences();
  const meritCatalog = activeMeritCatalog([...catalogs.get<readonly MeritDefinition[]>("core-merits"), ...catalogs.get<readonly MeritDefinition[]>("vampire-merits")],customMerits,homebrewPreferences,character.merits.map((item)=>item.name));
  const [amountDraft, setAmountDraft] = useState<string | null>(null);
  const amount = amountDraft ?? String(available);
  const [purchase, setPurchase] = useState<PurchaseType>("attribute");
  const [target, setTarget] = useState("");
  const [targetRating, setTargetRating] = useState(0);
  const [freePowerIds, setFreePowerIds] = useState<string[]>([]);
  const [specialtyName, setSpecialtyName] = useState("");
  const [meritDots, setMeritDots] = useState(0);
  const [meritInstance, setMeritInstance] = useState(-1);
  const [meritConfiguration, setMeritConfiguration] = useState<MeritConfiguration>({});
  const [feedback, setFeedback] = useState("");
  const clan = reference.clans.find((item) => item.id === character.line_data.clan_id);
  const covenant = String(character.line_data.covenant_id ?? "covenantless");
  const covenantIds = vampireCovenantIds(character.line_data);
  const bloodlineId = String(character.line_data.bloodline_id ?? "");
  const covenantStatusFor = (id: string) => {
    const definition = reference.covenants.find((item) => item.id === id);
    if (!definition) return 0;
    if (definition.group === "shadow-cult") return Math.max(0, ...character.merits.filter((item) => item.name === "Mystery Cult Initiation" && [definition.id, definition.name, definition.translatedName].some((name) => String(item.configuration?.cult ?? "").localeCompare(name, undefined, { sensitivity: "base" }) === 0)).map((item) => Number(item.dots) || 0));
    return vampireCovenantStatus(character, id, definition.name, definition.translatedName);
  };
  const disciplines = recordRatings(character.line_data.disciplines, VAMPIRE_DISCIPLINES, 10);
  const bloodSorcery = character.line_data.blood_sorcery && typeof character.line_data.blood_sorcery === "object" ? character.line_data.blood_sorcery as Record<string, unknown> : {};
  const ordo = character.line_data.ordo_dracul && typeof character.line_data.ordo_dracul === "object" ? character.line_data.ordo_dracul as Record<string, unknown> : {};
  const coilRatings = ordo.coil_ratings && typeof ordo.coil_ratings === "object" ? ordo.coil_ratings as Record<string, number> : {};
  const zirnitraRating = Number(coilRatings["coil-zirnitra"] ?? 0);
  const meritContext = meritContextForSheet(character, meritCatalog, ["vampire", String(character.line_data.clan_id ?? ""), ...covenantIds]);
  const knownDevotions = new Set(Array.isArray(character.line_data.devotion_ids) ? character.line_data.devotion_ids.map(String) : []);
  const knownRites = new Set([...(Array.isArray(bloodSorcery.cruac_rite_ids) ? bloodSorcery.cruac_rite_ids : []), ...(Array.isArray(bloodSorcery.theban_miracle_ids) ? bloodSorcery.theban_miracle_ids : []), ...(Array.isArray(bloodSorcery.kimiya_formula_ids) ? bloodSorcery.kimiya_formula_ids : []), ...(Array.isArray(bloodSorcery.therion_sacrilege_ids) ? bloodSorcery.therion_sacrilege_ids : []), ...(Array.isArray(bloodSorcery.gilded_invocation_ids) ? bloodSorcery.gilded_invocation_ids : [])].map(String));
  const knownScales = new Set(Array.isArray(ordo.scale_ids) ? ordo.scale_ids.map(String) : []);
  const knownDetournements = new Set(Array.isArray(character.line_data.detournement_ids) ? character.line_data.detournement_ids.map(String) : []);
  const cruacRating = Number(bloodSorcery.cruac_rating ?? 0);
  const thebanRating = Number(bloodSorcery.theban_rating ?? 0);
  const kimiyaRating = Number(bloodSorcery.kimiya_rating ?? 0);
  const therionRating = Number(bloodSorcery.therion_rating ?? 0);
  const gildedRating = Number(bloodSorcery.gilded_cage_rating ?? 0);
  const bloodSorceryOptions = (catalog: VampirePurchasablePower[], maximumRating: number, maximumHumanity = 10): RuleSelectOption[] => eligibleBloodSorceryPowers(catalog, knownRites, maximumRating, maximumHumanity).map((item) => ({ value: item.id, label: powerName(item, locale), group: `${t("ui.level")} ${item.rating}` }));
  const options = (() => {
    if (purchase === "attribute") return Object.values(ATTRIBUTES).flat().map((name) => ({ value: name, label: systemTerm(name, locale) }));
    if (purchase === "skill" || purchase === "specialty") return Object.values(SKILLS).flat().map((name) => ({ value: name, label: systemTerm(name, locale) }));
    if (purchase === "merit") return target ? [{ value: target, label: meritCatalog.find((item) => item.id === target)?.name ?? target }] : [];
    if (purchase === "discipline") return VAMPIRE_DISCIPLINES.filter((name) => vampireDisciplineAvailable(name, bloodlineId, String(character.line_data.clan_id ?? ""), covenantIds)).map((name) => ({ value: name, label: vampireDisciplineDisplayName(name, powers.disciplines, locale) }));
    if (purchase === "devotion") return powers.devotions.filter((item) => !knownDevotions.has(item.id) && (!item.bloodlineId || item.bloodlineId === bloodlineId) && (!item.covenantIds || item.covenantIds.some((id) => covenantIds.includes(id))) && Number(item.experienceCost ?? 0) > 0 && disciplinePrerequisitesMet(item.prerequisites, disciplines)).map((item) => ({ value: item.id, label: powerName(item, locale) }));
    const cruacCatalog = powers.cruacRites.filter((item) => !item.covenantIds || item.covenantIds.some((id) => covenantIds.includes(id)));
    if (purchase === "cruac") return covenantIds.some((id) => ["circle-of-the-crone", "followers-of-seth"].includes(id)) ? bloodSorceryOptions(cruacCatalog, cruacRating + 1).map((item) => ({ ...item, label: `${item.label} (${t("ui.freeRite")})` })) : [];
    if (purchase === "theban") return covenantIds.some((id) => ["lancea-et-sanctum", "ahl-al-mumit"].includes(id)) ? bloodSorceryOptions(powers.thebanMiracles, thebanRating + 1, Number(character.line_data.humanity ?? 7)).map((item) => ({ ...item, label: `${item.label} (${t("ui.freeMiracle")})` })) : [];
    if (purchase === "kimiya") return covenantIds.includes("jaliniyya") ? bloodSorceryOptions(powers.kimiyaFormulae, kimiyaRating + 1).map((item) => ({ ...item, label: `${item.label} (${t("ui.freeFormula")})` })) : [];
    if (purchase === "therion") return covenantIds.includes("tenth-choir") ? bloodSorceryOptions(powers.therionSacrileges, therionRating + 1, Math.max(0, Number(character.line_data.humanity ?? 7) - 1)).map((item) => ({ ...item, label: `${item.label} (${t("ui.freeSacrilege")})` })) : [];
    if (purchase === "gilded") return covenantIds.includes("architects-of-the-monolith") ? bloodSorceryOptions(powers.gildedInvocations, gildedRating + 1) : [];
    if (purchase === "rite") return bloodSorceryOptions(cruacCatalog, cruacRating);
    if (purchase === "miracle") return bloodSorceryOptions(powers.thebanMiracles, thebanRating, Number(character.line_data.humanity ?? 7));
    if (purchase === "formula") return covenantIds.includes("jaliniyya") ? bloodSorceryOptions(powers.kimiyaFormulae, kimiyaRating) : [];
    if (purchase === "sacrilege") return covenantIds.includes("tenth-choir") ? bloodSorceryOptions(powers.therionSacrileges, therionRating, Math.max(0, Number(character.line_data.humanity ?? 7) - 1)) : [];
    if (purchase === "invocation") return covenantIds.includes("architects-of-the-monolith") ? bloodSorceryOptions(powers.gildedInvocations, gildedRating) : [];
    if (purchase === "detournement") return covenantIds.includes("moulding-room") ? powers.detournements.filter((item) => !knownDetournements.has(item.id)).map((item) => ({ value: item.id, label: powerName(item, locale) })) : [];
    if (purchase === "coil") return covenantIds.includes("ordo-dracul") ? powers.coils.map((item) => ({ value: item.id, label: powerName(item, locale) })) : [];
    if (purchase === "scale") return covenantIds.includes("ordo-dracul") ? powers.scales.filter((item) => !knownScales.has(item.id)).map((item) => ({ value: item.id, label: powerName(item, locale) })) : [];
    return [{ value: purchase, label: purchaseLabel(purchase, locale) }];
  })();
  const chosenOption = purchase === "merit" ? target : options.some((item) => item.value === target) ? target : options[0]?.value ?? "";
  const selectedMerit = meritCatalog.find((item) => item.id === chosenOption);
  const ownedMerit = meritInstance >= 0 ? character.merits[meritInstance] : undefined;
  const nextMeritRating = selectedMerit ? meritDots : undefined;
  const humanityMaximum = Math.max(0, 10 - Number(bloodSorcery.cruac_rating ?? 0));
  const mysteryId = String(ordo.mystery_id ?? "");
  const limit = Math.max(5, Number(character.derived.LimiteDeCaracteristica ?? 5));
  const permanentWillpowerMaximum = Math.max(1, Number(character.derived.ForçaDeVontade ?? 1));
  const coilInMystery = covenant === "ordo-dracul" && Boolean(mysteryId) && chosenOption === `coil-${mysteryId}`;
  const currentDiscipline = Number(disciplines[chosenOption] ?? 0);
  const ratedCurrent = purchase === "attribute" ? Number(character.attributes[chosenOption] ?? 1)
    : purchase === "skill" ? Number(character.skills[chosenOption] ?? 0)
      : purchase === "discipline" ? currentDiscipline
        : purchase === "blood-potency" ? Number(character.line_data.blood_potency ?? 1)
          : purchase === "humanity" ? Number(character.line_data.humanity ?? 7)
            : purchase === "willpower" ? permanentWillpowerMaximum - Number(state.willpower_lost_dots ?? 0)
              : purchase === "cruac" ? cruacRating
                : purchase === "theban" ? thebanRating
                  : purchase === "kimiya" ? kimiyaRating
                    : purchase === "therion" ? therionRating
                      : purchase === "gilded" ? gildedRating
                  : purchase === "coil" ? Number(coilRatings[chosenOption] ?? 0)
                    : 0;
  const ratedMaximum = purchase === "attribute" || purchase === "skill" || purchase === "discipline" ? limit
    : purchase === "blood-potency" ? 10
      : purchase === "humanity" ? humanityMaximum
        : purchase === "willpower" ? permanentWillpowerMaximum
          : purchase === "cruac" || purchase === "theban" || purchase === "kimiya" || purchase === "therion" || purchase === "gilded" ? 5
            : purchase === "coil" ? 5
              : 0;
  const intendedRating = ratedCurrent < ratedMaximum ? Math.max(ratedCurrent + 1, Math.min(ratedMaximum, targetRating || ratedCurrent + 1)) : ratedCurrent;
  const ratingAmount = Math.max(0, intendedRating - ratedCurrent);
  const ritualPurchase = purchase === "cruac" || purchase === "theban" || purchase === "kimiya" || purchase === "therion" || purchase === "gilded";
  const freePowerCatalog = purchase === "cruac" ? powers.cruacRites.filter((item) => !item.covenantIds || item.covenantIds.some((id) => covenantIds.includes(id))) : purchase === "theban" ? powers.thebanMiracles : purchase === "kimiya" ? powers.kimiyaFormulae : purchase === "therion" ? powers.therionSacrileges : powers.gildedInvocations;
  const freePowerSelections = ritualPurchase ? freeBloodSorcerySelections(freePowerCatalog, knownRites, freePowerIds, ratedCurrent, intendedRating, purchase === "theban" ? Number(character.line_data.humanity ?? 7) : purchase === "therion" ? Math.max(0, Number(character.line_data.humanity ?? 7) - 1) : 10) : [];
  const chosen = ritualPurchase ? freePowerSelections[0] ?? "" : chosenOption;
  const selectedPower = [...powers.devotions, ...powers.cruacRites, ...powers.thebanMiracles, ...powers.kimiyaFormulae, ...powers.therionSacrileges, ...powers.gildedInvocations, ...powers.detournements, ...powers.coils, ...powers.scales].find((item) => item.id === chosen);
  const bloodlineDiscipline = powers.disciplines.find((item) => item.name === chosen)?.bloodlineId === bloodlineId;
  const cost = purchase === "attribute" ? 4 * ratingAmount : purchase === "skill" ? 2 * ratingAmount : purchase === "specialty" ? 1 : purchase === "merit" ? Math.max(0, Number(nextMeritRating ?? 0) - Number(ownedMerit?.dots ?? 0)) : purchase === "discipline" ? (clan?.disciplines.includes(chosen) || bloodlineDiscipline ? 3 : 4) * ratingAmount : purchase === "blood-potency" ? 5 * ratingAmount : purchase === "humanity" ? 2 * ratingAmount : purchase === "willpower" ? ratingAmount : purchase === "devotion" || purchase === "detournement" ? Number(selectedPower?.experienceCost ?? 0) : ritualPurchase ? 4 * ratingAmount : purchase === "rite" || purchase === "miracle" || purchase === "formula" || purchase === "sacrilege" || purchase === "invocation" ? 2 : purchase === "coil" ? (coilInMystery ? 3 : 4) * ratingAmount : purchase === "scale" ? (coilPrerequisiteMet(selectedPower?.prerequisites, coilRatings) ? 1 : 2) : 0;
  const duplicateNonRepeatableMerit = purchase === "merit" && Boolean(
    selectedMerit &&
    meritInstance < 0 &&
    !isRepeatableDefinition(selectedMerit) &&
    character.merits.some((merit) => merit.name === selectedMerit.name),
  );
  const configuredAffiliation = selectedMerit?.name === "Kindred Status" ? String(meritConfiguration.group ?? "") : selectedMerit?.name === "Mystery Cult Initiation" ? String(meritConfiguration.cult ?? "") : "";
  const configuredCovenant = reference.covenants.find((item) => [item.id, item.name, item.translatedName].some((name) => name.localeCompare(configuredAffiliation, undefined, { sensitivity: "base" }) === 0));
  const isAffiliationMerit = selectedMerit?.name === "Kindred Status" ? Boolean(configuredCovenant) : selectedMerit?.name === "Mystery Cult Initiation" ? configuredCovenant?.group === "shadow-cult" : false;
  const affiliationDots = vampireCovenantAffiliationDots(character, reference.covenants);
  const projectedAffiliationDots = affiliationDots - (isAffiliationMerit ? Number(ownedMerit?.dots ?? 0) : 0) + (isAffiliationMerit ? Number(nextMeritRating ?? 0) : 0);
  const meritUnavailable = purchase === "merit" && (
    !selectedMerit ||
    !nextMeritRating ||
    duplicateNonRepeatableMerit ||
    (selectedMerit.name === "Kindred Status" && !String(meritConfiguration.group ?? "").trim()) ||
    projectedAffiliationDots > 5 ||
    !vampireMeritEligible(selectedMerit, { ...meritContext, selectedDots: nextMeritRating, configuration: meritConfiguration }, zirnitraRating)
  );
  const hasStatus = (...ids: string[]) => ids.some((id) => covenantIds.includes(id) && covenantStatusFor(id) >= 1);
  const lacksPowerAccess = (purchase === "cruac" || purchase === "rite") && !hasStatus("circle-of-the-crone", "followers-of-seth")
    || (purchase === "theban" || purchase === "miracle") && !hasStatus("lancea-et-sanctum", "ahl-al-mumit")
    || (purchase === "kimiya" || purchase === "formula") && !hasStatus("jaliniyya")
    || (purchase === "therion" || purchase === "sacrilege") && !hasStatus("tenth-choir")
    || (purchase === "gilded" || purchase === "invocation") && !hasStatus("architects-of-the-monolith")
    || purchase === "detournement" && !hasStatus("moulding-room")
    || (purchase === "coil" || purchase === "scale") && !hasStatus("ordo-dracul");
  const unavailable = !chosen || cost < 1 || meritUnavailable || lacksPowerAccess || (ritualPurchase && freePowerSelections.some((id) => !id)) || (purchase === "attribute" && ratedCurrent >= limit) || (purchase === "skill" && ratedCurrent >= limit) || (purchase === "discipline" && ratedCurrent >= limit) || (purchase === "blood-potency" && ratedCurrent >= 10) || (purchase === "humanity" && ratedCurrent >= humanityMaximum) || (purchase === "willpower" && Number(state.willpower_lost_dots ?? 0) < 1) || (purchase === "specialty" && !specialtyName.trim()) || ((ritualPurchase || purchase === "coil") && ratedCurrent >= 5);
  const saveState = (patch: Record<string, unknown>) => { const next = structuredClone(character); next.current_state = { ...next.current_state, ...patch }; updateSheet(next); };
  const buy = () => {
    if (unavailable || (!builderMode && available < cost)) return setFeedback(t("ui.purchaseUnavailableOrInsufficientExperience"));
    const next = structuredClone(character);
    let purchasedMeritIndex = -1;
    let label = options.find((item) => item.value === chosen)?.label ?? purchaseLabel(purchase, locale);
    if (ratedMaximum) label = `${ritualPurchase ? purchaseLabel(purchase, locale) : options.find((item) => item.value === chosen)?.label ?? purchaseLabel(purchase, locale)} ${intendedRating}`;
    if (purchase === "attribute") next.attributes[chosen] = intendedRating;
    else if (purchase === "skill") next.skills[chosen] = intendedRating;
    else if (purchase === "specialty") { next.specializations.push({ skill: chosen, name: specialtyName.trim() }); label = `${systemTerm(chosen, locale)}: ${specialtyName.trim()}`; }
    else if (purchase === "merit" && selectedMerit && nextMeritRating) {
      if (meritInstance >= 0 && next.merits[meritInstance]?.name === selectedMerit.name) {
        purchasedMeritIndex = meritInstance;
        next.merits[meritInstance] = {
          ...next.merits[meritInstance],
          dots: nextMeritRating,
          experienceDots: Number(next.merits[meritInstance].experienceDots ?? 0) + cost,
          configuration: normalizeMeritConfiguration(meritConfiguration),
        };
      } else {
        next.merits.push({
          instanceId: createRandomId(),
          name: selectedMerit.name,
          dots: nextMeritRating,
          creationDots: 0,
          experienceDots: nextMeritRating,
          sourceId: selectedMerit.sourceId,
          source: selectedMerit.source,
          configuration: normalizeMeritConfiguration(meritConfiguration),
        });
        purchasedMeritIndex = next.merits.length - 1;
      }
    } else if (purchase === "discipline") next.line_data.disciplines = { ...disciplines, [chosen]: intendedRating };
    else if (purchase === "blood-potency") next.line_data.blood_potency = intendedRating;
    else if (purchase === "humanity") next.line_data.humanity = intendedRating;
    else if (purchase === "willpower") next.current_state.willpower_lost_dots = Math.max(0, Number(next.current_state.willpower_lost_dots ?? 0) - ratingAmount);
    else if (purchase === "devotion") next.line_data.devotion_ids = [...knownDevotions, chosen];
    else if (purchase === "cruac") { next.line_data.blood_sorcery = { ...bloodSorcery, cruac_rating: intendedRating, cruac_rite_ids: [...(Array.isArray(bloodSorcery.cruac_rite_ids) ? bloodSorcery.cruac_rite_ids : []), ...freePowerSelections] }; next.line_data.humanity = Math.min(Number(next.line_data.humanity ?? 7), 10 - intendedRating); }
    else if (purchase === "theban") next.line_data.blood_sorcery = { ...bloodSorcery, theban_rating: intendedRating, theban_miracle_ids: [...(Array.isArray(bloodSorcery.theban_miracle_ids) ? bloodSorcery.theban_miracle_ids : []), ...freePowerSelections] };
    else if (purchase === "kimiya") next.line_data.blood_sorcery = { ...bloodSorcery, kimiya_rating: intendedRating, kimiya_formula_ids: [...(Array.isArray(bloodSorcery.kimiya_formula_ids) ? bloodSorcery.kimiya_formula_ids : []), ...freePowerSelections] };
    else if (purchase === "therion") next.line_data.blood_sorcery = { ...bloodSorcery, therion_rating: intendedRating, therion_sacrilege_ids: [...(Array.isArray(bloodSorcery.therion_sacrilege_ids) ? bloodSorcery.therion_sacrilege_ids : []), ...freePowerSelections] };
    else if (purchase === "gilded") next.line_data.blood_sorcery = { ...bloodSorcery, gilded_cage_rating: intendedRating, gilded_invocation_ids: [...(Array.isArray(bloodSorcery.gilded_invocation_ids) ? bloodSorcery.gilded_invocation_ids : []), ...freePowerSelections] };
    else if (purchase === "rite") next.line_data.blood_sorcery = { ...bloodSorcery, cruac_rite_ids: [...(Array.isArray(bloodSorcery.cruac_rite_ids) ? bloodSorcery.cruac_rite_ids : []), chosen] };
    else if (purchase === "miracle") next.line_data.blood_sorcery = { ...bloodSorcery, theban_miracle_ids: [...(Array.isArray(bloodSorcery.theban_miracle_ids) ? bloodSorcery.theban_miracle_ids : []), chosen] };
    else if (purchase === "formula") next.line_data.blood_sorcery = { ...bloodSorcery, kimiya_formula_ids: [...(Array.isArray(bloodSorcery.kimiya_formula_ids) ? bloodSorcery.kimiya_formula_ids : []), chosen] };
    else if (purchase === "sacrilege") next.line_data.blood_sorcery = { ...bloodSorcery, therion_sacrilege_ids: [...(Array.isArray(bloodSorcery.therion_sacrilege_ids) ? bloodSorcery.therion_sacrilege_ids : []), chosen] };
    else if (purchase === "invocation") next.line_data.blood_sorcery = { ...bloodSorcery, gilded_invocation_ids: [...(Array.isArray(bloodSorcery.gilded_invocation_ids) ? bloodSorcery.gilded_invocation_ids : []), chosen] };
    else if (purchase === "detournement") next.line_data.detournement_ids = [...knownDetournements, chosen];
    else if (purchase === "coil") next.line_data.ordo_dracul = { ...ordo, coil_ratings: { ...coilRatings, [chosen]: intendedRating } };
    else if (purchase === "scale") next.line_data.ordo_dracul = { ...ordo, scale_ids: [...knownScales, chosen] };
    const nextDisciplines = recordRatings(next.line_data.disciplines, VAMPIRE_DISCIPLINES, 10);
    next.derived = vampireDerived(next.attributes, next.skills, nextDisciplines, Number(next.line_data.blood_potency ?? 1), reference);
    const purchasedMerit = purchasedMeritIndex >= 0 ? next.merits[purchasedMeritIndex] : undefined;
    const undo: VampireAdvancementUndo = purchase === "attribute" ? { kind: "trait", group: "attributes", name: chosen, amount: ratingAmount }
      : purchase === "skill" ? { kind: "trait", group: "skills", name: chosen, amount: ratingAmount }
      : purchase === "specialty" ? { kind: "specialty", skill: chosen, name: specialtyName.trim() }
      : purchase === "merit" ? { kind: "merit", name: selectedMerit!.name, dots: cost, instanceId: purchasedMerit?.instanceId, index: purchasedMeritIndex }
      : purchase === "discipline" ? { kind: "discipline", name: chosen, amount: ratingAmount }
      : purchase === "blood-potency" ? { kind: "bloodPotency", amount: ratingAmount }
      : purchase === "humanity" ? { kind: "humanity", amount: ratingAmount }
      : purchase === "willpower" ? { kind: "willpower", amount: ratingAmount }
      : purchase === "devotion" ? { kind: "devotion", id: chosen }
      : purchase === "cruac" ? { kind: "cruac", ids: freePowerSelections, amount: ratingAmount, humanityLost: Math.max(0, Number(character.line_data.humanity ?? 7) - Number(next.line_data.humanity ?? 7)) }
      : purchase === "theban" ? { kind: "theban", ids: freePowerSelections, amount: ratingAmount }
      : purchase === "kimiya" || purchase === "therion" || purchase === "gilded" ? { kind: "bloodSorcery", ratingKey: purchase === "kimiya" ? "kimiya_rating" : purchase === "therion" ? "therion_rating" : "gilded_cage_rating", idsKey: purchase === "kimiya" ? "kimiya_formula_ids" : purchase === "therion" ? "therion_sacrilege_ids" : "gilded_invocation_ids", ids: freePowerSelections, amount: ratingAmount }
      : purchase === "rite" || purchase === "miracle" || purchase === "formula" || purchase === "sacrilege" || purchase === "invocation" ? { kind: "ritual", key: ({ rite: "cruac_rite_ids", miracle: "theban_miracle_ids", formula: "kimiya_formula_ids", sacrilege: "therion_sacrilege_ids", invocation: "gilded_invocation_ids" } as const)[purchase], id: chosen }
      : purchase === "detournement" ? { kind: "detournement", id: chosen }
      : purchase === "coil" ? { kind: "coil", id: chosen, amount: ratingAmount }
      : { kind: "scale", id: chosen };
    const entry: HistoryEntry = { id: createRandomId(), label, cost, createdAt: new Date().toISOString(), undo };
    const balance = experiencePurchaseBalances(available, spent, total, cost, builderMode);
    next.current_state = { ...next.current_state, experience_available: balance.available, experience_spent: balance.spent, experience_total: balance.total, vampire_experience_history: [...history, entry] };

    // Preserve the current purchase when it can still be advanced. If the
    // purchased option is exhausted, move the UI away from the now-invalid
    // selection instead of leaving a stale purchase locked in the dialog.
    if (purchase === "merit" && selectedMerit && purchasedMeritIndex >= 0) {
      const purchasedMerit = next.merits[purchasedMeritIndex];
      const nextMeritContext = meritContextForSheet(next, meritCatalog, ["vampire", String(next.line_data.clan_id ?? ""), ...vampireCovenantIds(next.line_data)]);
      const remainingRatings = meritRatingsFor(selectedMerit).filter((dot) =>
        dot > Number(purchasedMerit?.dots ?? 0) &&
        vampireMeritEligible(selectedMerit, {
          ...nextMeritContext,
          selectedDots: dot,
          configuration: purchasedMerit?.configuration,
        }, zirnitraRating),
      );

      if (remainingRatings.length > 0) {
        setMeritInstance(purchasedMeritIndex);
        setMeritDots(remainingRatings[0]);
        setMeritConfiguration(normalizeMeritConfiguration(purchasedMerit?.configuration));
      } else if (isRepeatableDefinition(selectedMerit)) {
        const firstRating = meritRatingsFor(selectedMerit)[0] ?? 0;
        setMeritInstance(-1);
        setMeritDots(firstRating);
        setMeritConfiguration({});
      } else {
        setTarget("");
        setMeritDots(0);
        setMeritInstance(-1);
        setMeritConfiguration({});
      }
    } else if (purchase === "attribute" && Number(next.attributes[chosen] ?? 1) >= limit) {
      setTarget("");
    } else if (purchase === "skill" && Number(next.skills[chosen] ?? 0) >= limit) {
      setTarget("");
    } else if (purchase === "discipline" && Number(nextDisciplines[chosen] ?? 0) >= limit) {
      setTarget("");
    } else if (purchase === "blood-potency" && Number(next.line_data.blood_potency ?? 1) >= 10) {
      setTarget("");
    } else if (purchase === "humanity" && Number(next.line_data.humanity ?? 7) >= humanityMaximum) {
      setTarget("");
    } else if (purchase === "willpower" && Number(next.current_state.willpower_lost_dots ?? 0) < 1) {
      setTarget("");
    } else if (purchase === "devotion" || purchase === "rite" || purchase === "miracle" || purchase === "formula" || purchase === "sacrilege" || purchase === "invocation" || purchase === "detournement" || purchase === "scale") {
      setTarget("");
    } else if (purchase === "cruac" && Number((next.line_data.blood_sorcery as Record<string, unknown> | undefined)?.cruac_rating ?? 0) >= 5) {
      setTarget("");
    } else if (purchase === "theban" && Number((next.line_data.blood_sorcery as Record<string, unknown> | undefined)?.theban_rating ?? 0) >= 5) {
      setTarget("");
    } else if (purchase === "kimiya" && Number((next.line_data.blood_sorcery as Record<string, unknown> | undefined)?.kimiya_rating ?? 0) >= 5) {
      setTarget("");
    } else if (purchase === "therion" && Number((next.line_data.blood_sorcery as Record<string, unknown> | undefined)?.therion_rating ?? 0) >= 5) {
      setTarget("");
    } else if (purchase === "gilded" && Number((next.line_data.blood_sorcery as Record<string, unknown> | undefined)?.gilded_cage_rating ?? 0) >= 5) {
      setTarget("");
    } else if (purchase === "coil") {
      const nextOrdo = next.line_data.ordo_dracul && typeof next.line_data.ordo_dracul === "object" ? next.line_data.ordo_dracul as Record<string, unknown> : {};
      const nextCoilRatings = nextOrdo.coil_ratings && typeof nextOrdo.coil_ratings === "object" ? nextOrdo.coil_ratings as Record<string, number> : {};
      const nextRating = Number(nextCoilRatings[chosen] ?? 0);
      if (nextRating >= 5) setTarget("");
    }

    updateSheet(next);
    setFeedback(t("ui.purchaseRecorded"));
    setSpecialtyName("");
  };
  const revert = (entry: HistoryEntry) => {
    if (!history.some((item) => item.id === entry.id)) return;
    if (!entry.undo) {
      if (!entry.before || history.at(-1)?.id !== entry.id) return setFeedback(t("ui.thisOlderPurchaseDoesNotContainEnoughData"));
      const restored = structuredClone(entry.before);
      restored.current_state = { ...restored.current_state, experience_available: available + entry.cost, experience_spent: Math.max(0, spent - entry.cost), experience_total: total, vampire_experience_history: history.filter((item) => item.id !== entry.id) };
      updateSheet(restored);
      return;
    }
    const next = structuredClone(character);
    refundVampireAdvancement(next, entry.undo);
    next.derived = vampireDerived(next.attributes, next.skills, recordRatings(next.line_data.disciplines, VAMPIRE_DISCIPLINES, 10), Number(next.line_data.blood_potency ?? 1), reference);
    next.current_state = {
      ...next.current_state,
      experience_available: available + entry.cost,
      experience_spent: Math.max(0, spent - entry.cost),
      experience_total: total,
      vampire_experience_history: history.filter((item) => item.id !== entry.id),
    };
    updateSheet(synchronizeVampireBuilderMeritGrants(next));
    setFeedback(t("ui.wasRefundedExperienceRestored", { p1: entry.label, p2: entry.cost }));
  };
  const commitAvailableExperience = () => {
    const nextAvailable = Math.max(0, Math.trunc(Number(amount) || 0));
    setAmountDraft(null);
    saveState({ experience_available: nextAvailable, experience_spent: spent, experience_total: nextAvailable + spent });
  };
  const historyPanel = <details className="experience-history"><summary><History /> {t("ui.experienceExpenses")} ({history.length})</summary><div>{history.length ? [...history].reverse().map((entry) => <p key={entry.id}><span>{entry.label}</span><strong>{entry.cost} {t("ui.xp")}</strong><small>{new Date(entry.createdAt).toLocaleDateString(locale)}</small><Button type="button" size="sm" variant="ghost" disabled={!entry.undo && (!entry.before || history.at(-1)?.id !== entry.id)} onClick={() => revert(entry)}><RotateCcw /> {t("ui.refund")}</Button></p>) : <em>{t("ui.noExpensesRecorded")}</em>}</div></details>;
  return <section className="experience-panel vampire-experience-panel">
    <div className="experience-title"><div><span>{builderMode ? t("ui.creationAdvancement") : t("ui.beatsAndExperience")}</span><small>{builderMode ? t("ui.creationAdvancementDescription") : t("ui.beatsAreTrackedSeparatelyFromExperience")}</small></div></div>
    <div className="experience-totals">
      {!builderMode && <label className="experience-input"><Input type="number" min={0} step={1} inputMode="numeric" value={amount} onChange={(event) => setAmountDraft(event.target.value)} onBlur={commitAvailableExperience} onKeyDown={(event) => { if (event.key === "Enter") event.currentTarget.blur(); }} aria-label={t("ui.availableExperience")} /><span>{t("ui.xpAvailable")}</span></label>}
      <div><strong>{total}</strong><span>{t("ui.totalXP")}</span></div>
      <div><strong>{spent}</strong><span>{t("ui.xpSpent")}</span></div>
    </div>
    {!builderMode && <BeatTrack label={t("ui.beats")} value={beats} onChange={(value) => { const change = convertFifthBeat(value, available, total); saveState({ beats: change.beats, experience_available: change.available, experience_spent: spent, experience_total: change.total }); }} />}
    <div className="experience-actions">
      <Dialog>
        <DialogTrigger asChild><Button type="button" variant="outline" size="sm" className="catalog-selection-action"><ShoppingBag /> {t("ui.spendExperience")}</Button></DialogTrigger>
        <DialogContent className="experience-dialog">
          <DialogHeader><DialogTitle>{t("ui.spendVampireExperience")}</DialogTitle><DialogDescription>{t("ui.chooseATraitAndTheSheetWillRecord")}</DialogDescription></DialogHeader>
          <div className="experience-purchase-form">
            <label>{t("ui.type")}<RuleSelect value={purchase} onChange={(value) => { setPurchase(value as PurchaseType); setTarget(""); setTargetRating(0); setFreePowerIds([]); setMeritDots(0); setMeritInstance(-1); setMeritConfiguration({}); setFeedback(""); }} options={groupedPurchaseOptions(builderMode ? [
              { group: "core", purchases: ["attribute", "skill", "merit"] },
              { group: "supernatural", purchases: ["blood-potency", "discipline"] },
            ] : PURCHASE_GROUPS, (value) => purchaseLabel(value as PurchaseType, locale), locale)} /></label>
            {purchase === "merit" ? <label>{t("ui.merit")}<ExperienceMeritPicker line="VtR" archetypes={["vampire", String(character.line_data.clan_id ?? ""), ...covenantIds]} meritCatalog={meritCatalog} character={character} selectedId={selectedMerit?.id ?? ""} targetDots={nextMeritRating ?? 0} onSelect={(id, dots, instance) => { setTarget(id); setMeritDots(dots); setMeritInstance(instance); setMeritConfiguration(normalizeMeritConfiguration(character.merits[instance]?.configuration)); }} isEligible={(definition, context) => vampireMeritEligible(definition, context, zirnitraRating)} /></label> : !ritualPurchase && (options.length > 1 || options[0]?.value !== purchase) ? <label>{t("ui.trait")}<RuleSelect value={chosen} onChange={(value) => { setTarget(value); setTargetRating(0); }} options={options} /></label> : null}
            {purchase === "merit" && selectedMerit && Number(nextMeritRating) > 0 && <MeritConfigurationEditor merit={{ name: selectedMerit.name, dots: Number(nextMeritRating), configuration: meritConfiguration }} onChange={setMeritConfiguration} catalog={[...meritCatalog]} ownedMerits={character.merits} definitions={VAMPIRE_MERIT_CONFIGURATIONS} />}
            {purchase === "specialty" && <label>{t("ui.specialty")}<Input value={specialtyName} placeholder={t("ui.specialtyName")} onChange={(event) => setSpecialtyName(event.target.value)} maxLength={80} /></label>}
            {ratedMaximum > ratedCurrent && <ExperienceRatingPicker current={ratedCurrent} maximum={ratedMaximum} value={intendedRating} onChange={(value) => { setTargetRating(value); setFreePowerIds([]); }} />}
            {ritualPurchase && freePowerSelections.map((selectedId, index) => {
              const maximumRating = ratedCurrent + index + 1;
              const selectedElsewhere = new Set(freePowerSelections.filter((_, selectedIndex) => selectedIndex !== index));
              const freeOptions = eligibleBloodSorceryPowers(freePowerCatalog, new Set([...knownRites, ...selectedElsewhere]), maximumRating, purchase === "theban" ? Number(character.line_data.humanity ?? 7) : purchase === "therion" ? Math.max(0, Number(character.line_data.humanity ?? 7) - 1) : 10).map((item) => ({ value: item.id, label: powerName(item, locale), group: `${t("ui.level")} ${item.rating}` }));
              const freeLabel = purchase === "cruac" ? t("ui.freeRite") : purchase === "theban" ? t("ui.freeMiracle") : purchase === "kimiya" ? t("ui.freeFormula") : purchase === "gilded" ? t("ui.freeInvocation") : t("ui.freeSacrilege");
              return <label key={`${purchase}-${maximumRating}`}>{freeLabel} · {t("ui.level")} {maximumRating}<RuleSelect value={selectedId} onChange={(id) => setFreePowerIds(() => { const next = [...freePowerSelections]; next[index] = id; return next; })} options={freeOptions} /></label>;
            })}
          </div>
          <div className="purchase-preview"><strong>{ratedMaximum ? `${ritualPurchase ? purchaseLabel(purchase, locale) : options.find((item) => item.value === chosen)?.label ?? purchaseLabel(purchase, locale)} ${intendedRating}` : options.find((item) => item.value === chosen)?.label ?? purchaseLabel(purchase, locale)}</strong><span>{cost} {t("ui.xp")}</span></div>
          {feedback && <p className="experience-feedback">{feedback}</p>}
          {historyPanel}<DialogFooter><DialogClose asChild><Button type="button" variant="outline" size="sm" className="catalog-dialog-done">{t("ui.close")}</Button></DialogClose><Button type="button" size="sm" className="catalog-selection-action" disabled={unavailable || (!builderMode && available < cost)} onClick={buy}>{t("ui.purchaseFor")} {cost} {t("ui.xp")}</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
    {feedback && <p className="experience-feedback compact">{feedback}</p>}
    {historyPanel}
  </section>;
}
