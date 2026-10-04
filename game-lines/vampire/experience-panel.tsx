"use client";

import { useEffect, useState } from "react";
import { History, RotateCcw, ShoppingBag } from "lucide-react";
import { MeritConfigurationEditor } from "@/app/builder/merit-configuration-editor";
import { BeatTrack, ExperienceMeritPicker, ExperiencePowerPicker, ExperienceRatingPicker, convertFifthBeat, experiencePurchaseBalances, groupedPurchaseOptions, isRepeatableDefinition, type ExperiencePurchaseGroup } from "@/app/workspace/experience-shared";
import { RuleSelect, type RuleSelectOption } from "@/app/workspace/rule-select";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import type { CharacterSheet } from "@/lib/core/character/character-types";
import { ATTRIBUTES, SKILLS } from "@/lib/core/character/creation-rules";
import { normalizeMeritConfiguration, type MeritConfiguration } from "@/lib/core/character/merit-configuration";
import type { CatalogSnapshot } from "@/lib/game-line-contracts/catalog-groups";
import { translate, useLanguage, type Locale, type MessageKey } from "@/lib/i18n";
import { meritRatingsFor, meritSelectionProblems, type MeritDefinition } from "@/lib/merits";
import { createRandomId } from "@/lib/random-id";
import { systemTerm } from "@/lib/system-terms";
import type { VampireMechanics, VampirePowers, VampireReference, VampirePurchasablePower } from "./catalog-types";
import { recordRatings, synchronizeAutomaticBloodlineDevotions, synchronizeBloodTetherPack, vampireBloodTetherLashes, vampireCovenantAffiliationDots, vampireCovenantIds, vampireCovenantStatus, vampireDerived, vampireDisciplineAvailable, vampireDisciplineDisplayName, vampireDisciplinePrerequisitesMet } from "./creation-rules";
import { refundVampireAdvancement, type VampireAdvancementUndo } from "./experience-refunds";
import { synchronizeVampireBuilderMeritGrants } from "./builder-merit-grants";
import { VAMPIRE_MERIT_CONFIGURATIONS } from "./merit-configurations";
import { vampireMeritContextForSheet, vampireMeritEligible, vampireMeritFilterCategory } from "./merit-eligibility";
import { useHomebrewPreferences } from "@/app/use-homebrew";
import { useMeritHomebrews } from "@/app/use-merit-homebrews";
import { activeMeritCatalog } from "@/lib/merit-homebrews";
import { meritMatchesDefinition, meritInstanceIsUnique, resolveMeritDefinition } from "@/lib/merit-identity";
import { meritPresentation } from "@/lib/merit-presentation";
import { addExperienceMeritDots } from "@/lib/merit-progression";
import { vampireExperienceLabel, type VampireExperienceEntry } from "./experience-presentation";
import { activeVampirePowers, vampireHomebrewContentActive } from "./homebrew-catalog";
import { mergeVampirePowers, mergeVampireReference } from "./catalog-homebrews";
import { useVampireCatalogHomebrews } from "./use-catalog-homebrews";
import { vampirePowerPresentation } from "./power-presentation";

type PurchaseType = "attribute" | "skill" | "specialty" | "merit" | "discipline" | "blood-potency" | "humanity" | "willpower" | "devotion" | "lash" | "cruac" | "theban" | "kimiya" | "therion" | "gilded" | "rite" | "miracle" | "formula" | "sacrilege" | "invocation" | "detournement" | "coil" | "scale";
type HistoryEntry = VampireExperienceEntry;

const PURCHASE_GROUPS = [
  { group: "core", purchases: ["attribute", "skill", "specialty", "merit"] },
  { group: "supernatural", purchases: ["blood-potency", "discipline"] },
  { group: "integrity", purchases: ["humanity", "willpower"] },
  { group: "acquired", purchases: ["devotion", "lash", "rite", "miracle", "formula", "sacrilege", "invocation", "detournement", "scale"] },
] as const satisfies readonly ExperiencePurchaseGroup<PurchaseType>[];

export function purchaseLabel(type: PurchaseType, locale: Locale) {
  const labels: Record<PurchaseType, MessageKey> = {
    attribute: "ui.attribute", skill: "ui.skill", specialty: "ui.specialty", merit: "ui.merit",
    discipline: "ui.discipline", "blood-potency": "ui.bloodPotency", humanity: "ui.humanity", willpower: "ui.lostWillpowerDot",
    devotion: "ui.devotion", lash: "ui.lashesOfBloodTether", cruac: "ui.cruac", theban: "ui.thebanSorcery", kimiya: "ui.kimiya", therion: "ui.therion", gilded: "ui.gildedCage", rite: "ui.cruacRite", miracle: "ui.thebanMiracle", formula: "ui.kimiyaFormula", sacrilege: "ui.therionSacrilege", invocation: "ui.gildedInvocation", detournement: "ui.detournement", coil: "ui.coilOfTheDragon", scale: "ui.scaleOfTheDragon",
  };
  return translate(locale, labels[type]);
}

function powerName(item: Pick<VampirePurchasablePower, "name" | "translatedName">, locale: string) { return locale === "pt-BR" ? item.translatedName : item.name; }

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
  const customMerits=useMeritHomebrews("VtR",true),homebrewPreferences=useHomebrewPreferences();
  const customCatalog = useVampireCatalogHomebrews();
  const reference = mergeVampireReference(catalogs.get<VampireReference>("vampire-reference"), customCatalog);
  const powers = activeVampirePowers(mergeVampirePowers(catalogs.get<VampirePowers>("vampire-powers"), customCatalog), homebrewPreferences);
  const disciplineNames = powers.disciplines.map((item) => item.name);
  const meritCatalog = activeMeritCatalog([...catalogs.get<readonly MeritDefinition[]>("core-merits"), ...catalogs.get<readonly MeritDefinition[]>("vampire-merits")],customMerits,homebrewPreferences,character.merits);
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
  const covenantIds = vampireCovenantIds(character.line_data);
  const bloodlineId = String(character.line_data.bloodline_id ?? "");
  const covenantStatusFor = (id: string) => {
    const definition = reference.covenants.find((item) => item.id === id);
    if (!definition) return 0;
    if (definition.group === "shadow-cult") return Math.max(0, ...character.merits.filter((item) => resolveMeritDefinition(item, meritCatalog)?.id === "core-2ed:mystery-cult-initiation" && [definition.id, definition.name, definition.translatedName].some((name) => String(item.configuration?.cult ?? "").localeCompare(name, undefined, { sensitivity: "base" }) === 0)).map((item) => Number(item.dots) || 0));
    return vampireCovenantStatus(character, id, definition.name, definition.translatedName);
  };
  const disciplines = recordRatings(character.line_data.disciplines, disciplineNames, 10);
  const bloodTetherRating = Number(disciplines["Blood Tether"] ?? 0);
  const bloodTetherLashes = vampireBloodTetherLashes(powers);
  const bloodSorcery = character.line_data.blood_sorcery && typeof character.line_data.blood_sorcery === "object" ? character.line_data.blood_sorcery as Record<string, unknown> : {};
  const ordo = character.line_data.ordo_dracul && typeof character.line_data.ordo_dracul === "object" ? character.line_data.ordo_dracul as Record<string, unknown> : {};
  const coilRatings = ordo.coil_ratings && typeof ordo.coil_ratings === "object" ? ordo.coil_ratings as Record<string, number> : {};
  const zirnitraRating = Number(coilRatings["coil-zirnitra"] ?? 0);
  const meritContext = vampireMeritContextForSheet(character, meritCatalog, ["vampire", String(character.line_data.clan_id ?? ""), bloodlineId, ...covenantIds]);
  const knownDevotions = new Set(Array.isArray(character.line_data.devotion_ids) ? character.line_data.devotion_ids.map(String) : []);
  const synchronizedCharacter = synchronizeBloodTetherPack(synchronizeAutomaticBloodlineDevotions(character, powers));
  useEffect(() => {
    if (synchronizedCharacter !== character) updateSheet(synchronizedCharacter);
  }, [character, synchronizedCharacter, updateSheet]);
  const knownRites = new Set([...(Array.isArray(bloodSorcery.cruac_rite_ids) ? bloodSorcery.cruac_rite_ids : []), ...(Array.isArray(bloodSorcery.theban_miracle_ids) ? bloodSorcery.theban_miracle_ids : []), ...(Array.isArray(bloodSorcery.kimiya_formula_ids) ? bloodSorcery.kimiya_formula_ids : []), ...(Array.isArray(bloodSorcery.therion_sacrilege_ids) ? bloodSorcery.therion_sacrilege_ids : []), ...(Array.isArray(bloodSorcery.gilded_invocation_ids) ? bloodSorcery.gilded_invocation_ids : [])].map(String));
  const knownScales = new Set(Array.isArray(ordo.scale_ids) ? ordo.scale_ids.map(String) : []);
  const knownLashes = new Set(Array.isArray(character.line_data.lash_ids) ? character.line_data.lash_ids.map(String) : []);
  const knownDetournements = new Set(Array.isArray(character.line_data.detournement_ids) ? character.line_data.detournement_ids.map(String) : []);
  const activePower = (item: { id: string; source: string; sourceId?: string }) => vampireHomebrewContentActive(homebrewPreferences, item);
  const gildedCageAvailable = powers.ritualDisciplines.some((item) => item.id === "gilded-cage" && activePower(item));
  const hasStatus = (...ids: string[]) => ids.some((id) => covenantIds.includes(id) && covenantStatusFor(id) >= 1);
  const ritualDisciplineAvailable = (id: string) => id === "cruac" ? hasStatus("circle-of-the-crone", "followers-of-seth")
    : id === "theban" ? hasStatus("lancea-et-sanctum", "ahl-al-mumit")
      : id === "kimiya" ? hasStatus("jaliniyya")
        : id === "therion" ? hasStatus("tenth-choir")
          : id === "gilded-cage" ? gildedCageAvailable && hasStatus("architects-of-the-monolith")
            : false;
  const cruacRating = Number(bloodSorcery.cruac_rating ?? 0);
  const thebanRating = Number(bloodSorcery.theban_rating ?? 0);
  const kimiyaRating = Number(bloodSorcery.kimiya_rating ?? 0);
  const therionRating = Number(bloodSorcery.therion_rating ?? 0);
  const gildedRating = Number(bloodSorcery.gilded_cage_rating ?? 0);
  const availablePurchaseGroups = PURCHASE_GROUPS.map((group) => group.group !== "acquired" ? group : { ...group, purchases: group.purchases.filter((value) => value === "devotion"
    || value === "lash" && bloodlineId === "adrestoi" && bloodTetherRating >= 1
    || value === "rite" && cruacRating >= 1
    || value === "miracle" && thebanRating >= 1
    || value === "formula" && kimiyaRating >= 1
    || value === "sacrilege" && therionRating >= 1
    || value === "invocation" && gildedRating >= 1
    || value === "detournement" && hasStatus("moulding-room")
    || value === "scale" && Math.max(0, ...Object.values(coilRatings)) >= 1) });
  const bloodSorceryOptions = (catalog: VampirePurchasablePower[], maximumRating: number, maximumHumanity = 10): RuleSelectOption[] => eligibleBloodSorceryPowers(catalog, knownRites, maximumRating, maximumHumanity).map((item) => ({ value: item.id, label: powerName(item, locale), group: `${t("ui.level")} ${item.rating}` }));
  const options = (() => {
    if (purchase === "attribute") return Object.values(ATTRIBUTES).flat().map((name) => ({ value: name, label: systemTerm(name, locale) }));
    if (purchase === "skill" || purchase === "specialty") return Object.values(SKILLS).flat().map((name) => ({ value: name, label: systemTerm(name, locale) }));
    if (purchase === "merit") {
      const definition = meritCatalog.find((item) => item.id === target);
      return target ? [{ value: target, label: definition ? meritPresentation(definition, locale).name : target }] : [];
    }
    if (purchase === "discipline") return [
      ...disciplineNames.filter((name) => { const discipline = powers.disciplines.find((item) => item.name === name); return vampireDisciplineAvailable(name, bloodlineId, String(character.line_data.clan_id ?? ""), covenantIds) && (!discipline?.clanIds?.length || discipline.clanIds.includes(String(character.line_data.clan_id ?? ""))) && (!discipline?.covenantIds?.length || discipline.covenantIds.some((id) => covenantIds.includes(id))) && activePower(discipline ?? { id: name, source: "Vampire: The Requiem Second Edition" }); }).map((name) => ({ value: name, label: vampireDisciplineDisplayName(name, powers.disciplines, locale), localized: true })),
      ...powers.ritualDisciplines.filter((item) => activePower(item) && ritualDisciplineAvailable(item.id)).map((item) => ({ value: item.id, label: powerName(item, locale), localized: true })),
      ...(hasStatus("ordo-dracul") ? powers.coils.filter(activePower).map((item) => ({ value: item.id, label: powerName(item, locale), localized: true })) : []),
    ];
    if (purchase === "devotion") return powers.devotions.filter((item) => activePower(item) && !knownDevotions.has(item.id) && (!item.bloodlineId || item.bloodlineId === bloodlineId) && (!item.covenantIds || item.covenantIds.some((id) => covenantIds.includes(id))) && Number(item.experienceCost ?? 0) > 0 && (item.bloodlineId || Boolean(item.prerequisites) && vampireDisciplinePrerequisitesMet(item.prerequisites, disciplines, disciplineNames))).map((item) => ({ value: item.id, label: powerName(item, locale), localized: true }));
    if (purchase === "lash") return bloodlineId === "adrestoi" && bloodTetherRating >= 1 ? bloodTetherLashes.filter((item) => activePower(item) && !knownLashes.has(item.id) && !knownScales.has(item.id)).map((item) => ({ value: item.id, label: powerName(item, locale), localized: true })) : [];
    const cruacCatalog = powers.cruacRites.filter((item) => activePower(item) && (!item.bloodlineId || item.bloodlineId === bloodlineId) && (!item.covenantIds || item.covenantIds.some((id) => covenantIds.includes(id))));
    if (purchase === "cruac") return covenantIds.some((id) => ["circle-of-the-crone", "followers-of-seth"].includes(id)) ? bloodSorceryOptions(cruacCatalog, cruacRating + 1).map((item) => ({ ...item, label: `${item.label} (${t("ui.freeRite")})` })) : [];
    if (purchase === "theban") return covenantIds.some((id) => ["lancea-et-sanctum", "ahl-al-mumit"].includes(id)) ? bloodSorceryOptions(powers.thebanMiracles.filter((item) => activePower(item) && (!item.bloodlineId || item.bloodlineId === bloodlineId)), thebanRating + 1, Number(character.line_data.humanity ?? 7)).map((item) => ({ ...item, label: `${item.label} (${t("ui.freeMiracle")})` })) : [];
    if (purchase === "kimiya") return covenantIds.includes("jaliniyya") ? bloodSorceryOptions(powers.kimiyaFormulae, kimiyaRating + 1).map((item) => ({ ...item, label: `${item.label} (${t("ui.freeFormula")})` })) : [];
    if (purchase === "therion") return covenantIds.includes("tenth-choir") ? bloodSorceryOptions(powers.therionSacrileges, therionRating + 1, Math.max(0, Number(character.line_data.humanity ?? 7) - 1)).map((item) => ({ ...item, label: `${item.label} (${t("ui.freeSacrilege")})` })) : [];
    if (purchase === "gilded") return gildedCageAvailable && covenantIds.includes("architects-of-the-monolith") ? bloodSorceryOptions(powers.gildedInvocations.filter(activePower), gildedRating + 1) : [];
    if (purchase === "rite") return cruacRating >= 1 ? bloodSorceryOptions(cruacCatalog, cruacRating) : [];
    if (purchase === "miracle") return thebanRating >= 1 ? bloodSorceryOptions(powers.thebanMiracles.filter((item) => activePower(item) && (!item.bloodlineId || item.bloodlineId === bloodlineId)), thebanRating, Number(character.line_data.humanity ?? 7)) : [];
    if (purchase === "formula") return kimiyaRating >= 1 ? bloodSorceryOptions(powers.kimiyaFormulae, kimiyaRating) : [];
    if (purchase === "sacrilege") return therionRating >= 1 ? bloodSorceryOptions(powers.therionSacrileges, therionRating, Math.max(0, Number(character.line_data.humanity ?? 7) - 1)) : [];
    if (purchase === "invocation") return gildedRating >= 1 ? bloodSorceryOptions(powers.gildedInvocations.filter(activePower), gildedRating) : [];
    if (purchase === "detournement") return hasStatus("moulding-room") ? powers.detournements.filter((item) => activePower(item) && !knownDetournements.has(item.id)).map((item) => ({ value: item.id, label: powerName(item, locale) })) : [];
    if (purchase === "scale") return Math.max(0, ...Object.values(coilRatings)) >= 1 ? powers.scales.filter((item) => !knownScales.has(item.id) && !knownLashes.has(item.id)).map((item) => ({ value: item.id, label: powerName(item, locale) })) : [];
    return [{ value: purchase, label: purchaseLabel(purchase, locale) }];
  })();
  const chosenOption = purchase === "merit" ? target : options.some((item) => item.value === target) ? target : options[0]?.value ?? "";
  const selectedRitualDiscipline = purchase === "discipline" ? powers.ritualDisciplines.find((item) => item.id === chosenOption) : undefined;
  const selectedCoil = purchase === "discipline" ? powers.coils.find((item) => item.id === chosenOption) : undefined;
  const selectedMerit = meritCatalog.find((item) => item.id === chosenOption);
  const ownedMerit = meritInstance >= 0 && selectedMerit && character.merits[meritInstance] && meritMatchesDefinition(character.merits[meritInstance], selectedMerit, meritCatalog) && meritInstanceIsUnique(character.merits[meritInstance], character.merits) ? character.merits[meritInstance] : undefined;
  const nextMeritRating = selectedMerit ? meritDots : undefined;
  const humanityMaximum = Math.max(0, 10 - Number(bloodSorcery.cruac_rating ?? 0));
  const mysteryId = String(ordo.mystery_id ?? "");
  const limit = Math.max(5, Number(character.derived.LimiteDeCaracteristica ?? 5));
  const permanentWillpowerMaximum = Math.max(1, Number(character.derived.ForçaDeVontade ?? 1));
  const packWillpowerInvestment = character.line_data.blood_tether_pack_active === true ? 1 : 0;
  const coilInMystery = covenantIds.includes("ordo-dracul") && Boolean(mysteryId) && chosenOption === `coil-${mysteryId}`;
  const currentDiscipline = Number(disciplines[chosenOption] ?? 0);
  const ratedCurrent = purchase === "attribute" ? Number(character.attributes[chosenOption] ?? 1)
    : purchase === "skill" ? Number(character.skills[chosenOption] ?? 0)
      : purchase === "discipline" ? selectedRitualDiscipline?.id === "cruac" ? cruacRating
        : selectedRitualDiscipline?.id === "theban" ? thebanRating
          : selectedRitualDiscipline?.id === "kimiya" ? kimiyaRating
            : selectedRitualDiscipline?.id === "therion" ? therionRating
              : selectedRitualDiscipline?.id === "gilded-cage" ? gildedRating
                : selectedCoil ? Number(coilRatings[selectedCoil.id] ?? 0)
                  : currentDiscipline
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
  const ratedMaximum = purchase === "attribute" || purchase === "skill" ? limit
    : purchase === "discipline" ? selectedRitualDiscipline || selectedCoil ? 5 : limit
    : purchase === "blood-potency" ? 10
      : purchase === "humanity" ? humanityMaximum
        : purchase === "willpower" ? permanentWillpowerMaximum - packWillpowerInvestment
          : purchase === "cruac" || purchase === "theban" || purchase === "kimiya" || purchase === "therion" || purchase === "gilded" ? 5
            : purchase === "coil" ? 5
              : 0;
  const intendedRating = ratedCurrent < ratedMaximum ? Math.max(ratedCurrent + 1, Math.min(ratedMaximum, targetRating || ratedCurrent + 1)) : ratedCurrent;
  const ratingAmount = Math.max(0, intendedRating - ratedCurrent);
  const ritualPurchase = purchase === "discipline" && Boolean(selectedRitualDiscipline);
  const freePowerCatalog = selectedRitualDiscipline?.id === "cruac" ? powers.cruacRites.filter((item) => activePower(item) && (!item.bloodlineId || item.bloodlineId === bloodlineId) && (!item.covenantIds || item.covenantIds.some((id) => covenantIds.includes(id)))) : selectedRitualDiscipline?.id === "theban" ? powers.thebanMiracles.filter((item) => activePower(item) && (!item.bloodlineId || item.bloodlineId === bloodlineId)) : selectedRitualDiscipline?.id === "kimiya" ? powers.kimiyaFormulae : selectedRitualDiscipline?.id === "therion" ? powers.therionSacrileges : selectedRitualDiscipline?.id === "gilded-cage" ? powers.gildedInvocations.filter(activePower) : [];
  const freePowerSelections = ritualPurchase ? freeBloodSorcerySelections(freePowerCatalog, knownRites, freePowerIds, ratedCurrent, intendedRating, selectedRitualDiscipline?.id === "theban" ? Number(character.line_data.humanity ?? 7) : selectedRitualDiscipline?.id === "therion" ? Math.max(0, Number(character.line_data.humanity ?? 7) - 1) : 10) : [];
  const chosen = chosenOption;
  const selectedPower = [...powers.devotions, ...bloodTetherLashes, ...powers.cruacRites, ...powers.thebanMiracles, ...powers.kimiyaFormulae, ...powers.therionSacrileges, ...powers.gildedInvocations, ...powers.detournements, ...powers.coils, ...powers.scales].find((item) => item.id === chosen);
  const mechanicsDetails = (definition: VampireMechanics & { prerequisites?: string; experienceCost?: number }, prerequisitesMet = true) => {
    const item = vampirePowerPresentation(definition, locale);
    const rows: Array<{ label: string; value: string; warning?: boolean }> = [];
    const add = (label: string, value: unknown, warning = false) => { if (value !== undefined && value !== "") rows.push({ label, value: String(value), warning }); };
    add(t("ui.prerequisites"), item.prerequisites, !prerequisitesMet);
    if (item.experienceCost !== undefined) add(t("ui.experienceCost"), `${item.experienceCost} ${t("ui.xp")}`);
    add(t("ui.cost"), item.cost); add(t("ui.requirement"), item.requirement); add(t("ui.condition"), item.condition);
    add(t("ui.dicePool"), item.dicePool); add(t("ui.action"), item.action); add(t("ui.duration"), item.duration);
    add(t("ui.contestedBy"), item.contestedBy); add(t("ui.resistedBy"), item.resistedBy); add(t("ui.effect"), item.effect);
    add(t("ui.procedure"), item.procedure); add(t("ui.outcome"), item.outcome);
    if (item.rollResults?.dramaticFailure) add(t("ui.dramaticFailure"), item.rollResults.dramaticFailure);
    if (item.rollResults?.failure) add(t("ui.failure"), item.rollResults.failure);
    if (item.rollResults?.success) add(t("ui.success"), item.rollResults.success);
    if (item.rollResults?.exceptionalSuccess) add(t("ui.exceptionalSuccess"), item.rollResults.exceptionalSuccess);
    return rows;
  };
  const disciplinePickerItems = purchase === "discipline" ? options.flatMap((option) => {
    const item = powers.disciplines.find((definition) => definition.name === option.value);
    const ritual = powers.ritualDisciplines.find((definition) => definition.id === option.value);
    const coil = powers.coils.find((definition) => definition.id === option.value);
    const canonical = item ?? ritual ?? coil;
    if (!canonical) return [];
    const definition = vampirePowerPresentation(canonical, locale);
    const category = item?.bloodlineId ? t("sheet.bloodline") : item?.covenantIds?.length || ritual || coil ? t("sheet.covenant") : clan?.disciplines.includes(item!.name) ? t("ui.clan") : t("ui.otherDisciplines");
    const levels = "levels" in definition && definition.levels ? definition.levels.map((level) => vampirePowerPresentation(level, locale)).map((level) => ({ label: `${"•".repeat(level.rating)} ${locale === "pt-BR" ? level.translatedName : level.name}`, value: [level.summary, ...mechanicsDetails(level).map(({ label, value }) => `${label}: ${value}`)].join(" · ") })) : [];
    return [{ id: option.value, name: option.label, category, description: definition.summary, meta: `${definition.source} · p. ${definition.page || "—"}`, details: mechanicsDetails(definition), levels }];
  }) : [];
  const devotionPickerItems = purchase === "devotion" ? options.flatMap((option) => {
    const item = powers.devotions.find((definition) => definition.id === option.value);
    if (!item) return [];
    const prerequisitesMet = vampireDisciplinePrerequisitesMet(item.prerequisites, disciplines, disciplineNames);
    const details: Array<{ label: string; value: string; warning?: boolean }> = [];
    const add = (label: string, value: unknown, warning = false) => { if (value !== undefined && value !== "" && String(value).trim().toLocaleLowerCase() !== "none") details.push({ label, value: String(value), warning }); };
    add(t("ui.prerequisites"), item.prerequisites, !prerequisitesMet);
    add(t("ui.dicePool"), item.dicePool);
    add(t("ui.cost"), item.cost); add(t("ui.requirement"), item.requirement); add(t("ui.condition"), item.condition);
    add(t("ui.action"), item.action); add(t("ui.duration"), item.duration); add(t("ui.contestedBy"), item.contestedBy); add(t("ui.resistedBy"), item.resistedBy);
    const footerDetails = mechanicsDetails(item).filter(({ label }) => [t("ui.dramaticFailure"), t("ui.failure"), t("ui.success"), t("ui.exceptionalSuccess")].includes(label));
    if (item.experienceCost !== undefined) footerDetails.push({ label: t("ui.experienceCost"), value: `${item.experienceCost} ${t("ui.xp")}` });
    return [{ id: item.id, name: option.label, category: item.bloodlineId ? t("sheet.bloodline") : t("ui.generalDevotions"), description: item.effect ?? item.summary, descriptionAfterDetails: true, meta: `${item.source} · p. ${item.page || "—"}`, disabled: !prerequisitesMet, details, footerDetails }];
  }) : [];
  const lashPickerItems = purchase === "lash" ? options.flatMap((option) => {
    const item = bloodTetherLashes.find((definition) => definition.id === option.value);
    if (!item) return [];
    const prerequisiteMet = bloodTetherRating >= Number(item.rating ?? 0);
    const details = mechanicsDetails(item, prerequisiteMet).filter(({ label }) => label !== t("ui.experienceCost"));
    details.push({ label: t("ui.experienceCost"), value: `${prerequisiteMet ? 1 : 2} ${t("ui.xp")}` });
    return [{ id: item.id, name: option.label, category: t("ui.lashesOfBloodTether"), description: item.summary, meta: `${item.source} · p. ${item.page || "—"}`, details }];
  }) : [];
  const bloodlineDiscipline = powers.disciplines.find((item) => item.name === chosen)?.bloodlineId === bloodlineId;
  const cost = purchase === "attribute" ? 4 * ratingAmount : purchase === "skill" ? 2 * ratingAmount : purchase === "specialty" ? 1 : purchase === "merit" ? Math.max(0, Number(nextMeritRating ?? 0) - Number(ownedMerit?.dots ?? 0)) : purchase === "discipline" ? (selectedRitualDiscipline ? 4 : selectedCoil ? coilInMystery ? 3 : 4 : clan?.disciplines.includes(chosen) || bloodlineDiscipline ? 3 : 4) * ratingAmount : purchase === "blood-potency" ? 5 * ratingAmount : purchase === "humanity" ? 2 * ratingAmount : purchase === "willpower" ? ratingAmount : purchase === "devotion" || purchase === "detournement" ? Number(selectedPower?.experienceCost ?? 0) : purchase === "lash" ? bloodTetherRating >= Number(selectedPower?.rating ?? 0) ? 1 : 2 : purchase === "rite" || purchase === "miracle" || purchase === "formula" || purchase === "sacrilege" || purchase === "invocation" ? 2 : purchase === "scale" ? (coilPrerequisiteMet(selectedPower?.prerequisites, coilRatings) ? 1 : 2) : 0;
  const duplicateNonRepeatableMerit = purchase === "merit" && Boolean(
    selectedMerit &&
    meritInstance < 0 &&
    !isRepeatableDefinition(selectedMerit) &&
    character.merits.some((merit) => meritMatchesDefinition(merit, selectedMerit, meritCatalog)),
  );
  const configuredAffiliation = selectedMerit?.id === "vtr-kindred-status" ? String(meritConfiguration.group ?? "") : selectedMerit?.id === "core-2ed:mystery-cult-initiation" ? String(meritConfiguration.cult ?? "") : "";
  const configuredCovenant = reference.covenants.find((item) => [item.id, item.name, item.translatedName].some((name) => name.localeCompare(configuredAffiliation, undefined, { sensitivity: "base" }) === 0));
  const isAffiliationMerit = selectedMerit?.id === "vtr-kindred-status" ? Boolean(configuredCovenant) : selectedMerit?.id === "core-2ed:mystery-cult-initiation" ? configuredCovenant?.group === "shadow-cult" : false;
  const affiliationDots = vampireCovenantAffiliationDots(character, reference.covenants);
  const projectedAffiliationDots = affiliationDots - (isAffiliationMerit ? Number(ownedMerit?.dots ?? 0) : 0) + (isAffiliationMerit ? Number(nextMeritRating ?? 0) : 0);
  const meritUnavailable = purchase === "merit" && (
    !selectedMerit ||
    !nextMeritRating ||
    (meritInstance >= 0 && (!ownedMerit || Boolean(ownedMerit.grantedBy))) ||
    duplicateNonRepeatableMerit ||
    (selectedMerit.id === "vtr-kindred-status" && !String(meritConfiguration.group ?? "").trim()) ||
    projectedAffiliationDots > 5 ||
    meritSelectionProblems(selectedMerit, { dots: nextMeritRating, configuration: meritConfiguration }, meritContext,
      (definition, context) => vampireMeritEligible(definition, context, zirnitraRating)).length > 0
  );
  const lacksPowerAccess = purchase === "rite" && (!hasStatus("circle-of-the-crone", "followers-of-seth") || cruacRating < 1)
    || purchase === "lash" && (bloodlineId !== "adrestoi" || bloodTetherRating < 1)
    || purchase === "miracle" && (!hasStatus("lancea-et-sanctum", "ahl-al-mumit") || thebanRating < 1)
    || purchase === "formula" && (!hasStatus("jaliniyya") || kimiyaRating < 1)
    || purchase === "sacrilege" && (!hasStatus("tenth-choir") || therionRating < 1)
    || purchase === "invocation" && (!gildedCageAvailable || !hasStatus("architects-of-the-monolith") || gildedRating < 1)
    || purchase === "detournement" && !hasStatus("moulding-room")
    || purchase === "scale" && (!hasStatus("ordo-dracul") || Math.max(0, ...Object.values(coilRatings)) < 1);
  const unavailable = !chosen || cost < 1 || meritUnavailable || lacksPowerAccess || (purchase === "devotion" && !vampireDisciplinePrerequisitesMet(selectedPower?.prerequisites, disciplines, disciplineNames)) || (ritualPurchase && freePowerSelections.some((id) => !id)) || (purchase === "attribute" && ratedCurrent >= limit) || (purchase === "skill" && ratedCurrent >= limit) || (purchase === "discipline" && ratedCurrent >= ratedMaximum) || (purchase === "blood-potency" && ratedCurrent >= 10) || (purchase === "humanity" && ratedCurrent >= humanityMaximum) || (purchase === "willpower" && Number(state.willpower_lost_dots ?? 0) <= packWillpowerInvestment) || (purchase === "specialty" && !specialtyName.trim());
  const saveState = (patch: Record<string, unknown>) => { const next = structuredClone(character); next.current_state = { ...next.current_state, ...patch }; updateSheet(next); };
  const buy = () => {
    if (unavailable || (!builderMode && available < cost)) return setFeedback(t("ui.purchaseUnavailableOrInsufficientExperience"));
    const next = structuredClone(character);
    let purchasedMeritIndex = -1;
    if (purchase === "attribute") next.attributes[chosen] = intendedRating;
    else if (purchase === "skill") next.skills[chosen] = intendedRating;
    else if (purchase === "specialty") next.specializations.push({ skill: chosen, name: specialtyName.trim() });
    else if (purchase === "merit" && selectedMerit && nextMeritRating) {
      if (meritInstance >= 0 && meritMatchesDefinition(next.merits[meritInstance], selectedMerit, meritCatalog)) {
        purchasedMeritIndex = meritInstance;
        addExperienceMeritDots(next.merits[meritInstance], cost);
        next.merits[meritInstance].configuration = normalizeMeritConfiguration(meritConfiguration);
      } else {
        next.merits.push({
          definitionId: selectedMerit.id,
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
    } else if (purchase === "discipline" && selectedRitualDiscipline?.id === "cruac") { next.line_data.blood_sorcery = { ...bloodSorcery, cruac_rating: intendedRating, cruac_rite_ids: [...(Array.isArray(bloodSorcery.cruac_rite_ids) ? bloodSorcery.cruac_rite_ids : []), ...freePowerSelections] }; next.line_data.humanity = Math.min(Number(next.line_data.humanity ?? 7), 10 - intendedRating); }
    else if (purchase === "discipline" && selectedRitualDiscipline?.id === "theban") next.line_data.blood_sorcery = { ...bloodSorcery, theban_rating: intendedRating, theban_miracle_ids: [...(Array.isArray(bloodSorcery.theban_miracle_ids) ? bloodSorcery.theban_miracle_ids : []), ...freePowerSelections] };
    else if (purchase === "discipline" && selectedRitualDiscipline?.id === "kimiya") next.line_data.blood_sorcery = { ...bloodSorcery, kimiya_rating: intendedRating, kimiya_formula_ids: [...(Array.isArray(bloodSorcery.kimiya_formula_ids) ? bloodSorcery.kimiya_formula_ids : []), ...freePowerSelections] };
    else if (purchase === "discipline" && selectedRitualDiscipline?.id === "therion") next.line_data.blood_sorcery = { ...bloodSorcery, therion_rating: intendedRating, therion_sacrilege_ids: [...(Array.isArray(bloodSorcery.therion_sacrilege_ids) ? bloodSorcery.therion_sacrilege_ids : []), ...freePowerSelections] };
    else if (purchase === "discipline" && selectedRitualDiscipline?.id === "gilded-cage") next.line_data.blood_sorcery = { ...bloodSorcery, gilded_cage_rating: intendedRating, gilded_invocation_ids: [...(Array.isArray(bloodSorcery.gilded_invocation_ids) ? bloodSorcery.gilded_invocation_ids : []), ...freePowerSelections] };
    else if (purchase === "discipline" && selectedCoil) next.line_data.ordo_dracul = { ...ordo, coil_ratings: { ...coilRatings, [selectedCoil.id]: intendedRating } };
    else if (purchase === "discipline") next.line_data.disciplines = { ...disciplines, [chosen]: intendedRating };
    else if (purchase === "blood-potency") next.line_data.blood_potency = intendedRating;
    else if (purchase === "humanity") next.line_data.humanity = intendedRating;
    else if (purchase === "willpower") next.current_state.willpower_lost_dots = Math.max(0, Number(next.current_state.willpower_lost_dots ?? 0) - ratingAmount);
    else if (purchase === "devotion") next.line_data.devotion_ids = [...knownDevotions, chosen];
    else if (purchase === "lash") next.line_data.lash_ids = [...knownLashes, chosen];
    else if (purchase === "rite") next.line_data.blood_sorcery = { ...bloodSorcery, cruac_rite_ids: [...(Array.isArray(bloodSorcery.cruac_rite_ids) ? bloodSorcery.cruac_rite_ids : []), chosen] };
    else if (purchase === "miracle") next.line_data.blood_sorcery = { ...bloodSorcery, theban_miracle_ids: [...(Array.isArray(bloodSorcery.theban_miracle_ids) ? bloodSorcery.theban_miracle_ids : []), chosen] };
    else if (purchase === "formula") next.line_data.blood_sorcery = { ...bloodSorcery, kimiya_formula_ids: [...(Array.isArray(bloodSorcery.kimiya_formula_ids) ? bloodSorcery.kimiya_formula_ids : []), chosen] };
    else if (purchase === "sacrilege") next.line_data.blood_sorcery = { ...bloodSorcery, therion_sacrilege_ids: [...(Array.isArray(bloodSorcery.therion_sacrilege_ids) ? bloodSorcery.therion_sacrilege_ids : []), chosen] };
    else if (purchase === "invocation") next.line_data.blood_sorcery = { ...bloodSorcery, gilded_invocation_ids: [...(Array.isArray(bloodSorcery.gilded_invocation_ids) ? bloodSorcery.gilded_invocation_ids : []), chosen] };
    else if (purchase === "detournement") next.line_data.detournement_ids = [...knownDetournements, chosen];
    else if (purchase === "scale") next.line_data.ordo_dracul = { ...ordo, scale_ids: [...knownScales, chosen] };
    const nextDisciplines = recordRatings(next.line_data.disciplines, disciplineNames, 10);
    next.derived = vampireDerived(next.attributes, next.skills, nextDisciplines, Number(next.line_data.blood_potency ?? 1), reference);
    const purchasedMerit = purchasedMeritIndex >= 0 ? next.merits[purchasedMeritIndex] : undefined;
    if (purchasedMerit && selectedMerit) {
      purchasedMerit.definitionId = selectedMerit.id;
      purchasedMerit.instanceId ??= createRandomId();
    }
    const undo: VampireAdvancementUndo = purchase === "attribute" ? { kind: "trait", group: "attributes", name: chosen, amount: ratingAmount }
      : purchase === "skill" ? { kind: "trait", group: "skills", name: chosen, amount: ratingAmount }
      : purchase === "specialty" ? { kind: "specialty", skill: chosen, name: specialtyName.trim() }
      : purchase === "merit" ? { kind: "merit", definitionId: selectedMerit!.id, name: selectedMerit!.name, dots: cost, instanceId: purchasedMerit?.instanceId }
      : purchase === "discipline" && selectedRitualDiscipline?.id === "cruac" ? { kind: "cruac", ids: freePowerSelections, amount: ratingAmount, humanityLost: Math.max(0, Number(character.line_data.humanity ?? 7) - Number(next.line_data.humanity ?? 7)) }
      : purchase === "discipline" && selectedRitualDiscipline?.id === "theban" ? { kind: "theban", ids: freePowerSelections, amount: ratingAmount }
      : purchase === "discipline" && selectedRitualDiscipline && ["kimiya", "therion", "gilded-cage"].includes(selectedRitualDiscipline.id) ? { kind: "bloodSorcery", ratingKey: selectedRitualDiscipline.id === "kimiya" ? "kimiya_rating" : selectedRitualDiscipline.id === "therion" ? "therion_rating" : "gilded_cage_rating", idsKey: selectedRitualDiscipline.id === "kimiya" ? "kimiya_formula_ids" : selectedRitualDiscipline.id === "therion" ? "therion_sacrilege_ids" : "gilded_invocation_ids", ids: freePowerSelections, amount: ratingAmount }
      : purchase === "discipline" && selectedCoil ? { kind: "coil", id: selectedCoil.id, amount: ratingAmount }
      : purchase === "discipline" ? { kind: "discipline", name: chosen, amount: ratingAmount }
      : purchase === "blood-potency" ? { kind: "bloodPotency", amount: ratingAmount }
      : purchase === "humanity" ? { kind: "humanity", amount: ratingAmount }
      : purchase === "willpower" ? { kind: "willpower", amount: ratingAmount }
      : purchase === "devotion" ? { kind: "devotion", id: chosen }
      : purchase === "lash" ? { kind: "lash", id: chosen }
      : purchase === "rite" || purchase === "miracle" || purchase === "formula" || purchase === "sacrilege" || purchase === "invocation" ? { kind: "ritual", key: ({ rite: "cruac_rite_ids", miracle: "theban_miracle_ids", formula: "kimiya_formula_ids", sacrilege: "therion_sacrilege_ids", invocation: "gilded_invocation_ids" } as const)[purchase], id: chosen }
      : purchase === "detournement" ? { kind: "detournement", id: chosen }
      : { kind: "scale", id: chosen };
    const entry: HistoryEntry = { id: createRandomId(), ...(ratedMaximum ? { rating: intendedRating } : purchasedMerit ? { rating: purchasedMerit.dots } : {}), cost, createdAt: new Date().toISOString(), undo };
    const balance = experiencePurchaseBalances(available, spent, total, cost, builderMode);
    next.current_state = { ...next.current_state, experience_available: balance.available, experience_spent: balance.spent, experience_total: balance.total, vampire_experience_history: [...history, entry] };

    // Preserve the current purchase when it can still be advanced. If the
    // purchased option is exhausted, move the UI away from the now-invalid
    // selection instead of leaving a stale purchase locked in the dialog.
    if (purchase === "merit" && selectedMerit && purchasedMeritIndex >= 0) {
      const purchasedMerit = next.merits[purchasedMeritIndex];
      const nextMeritContext = vampireMeritContextForSheet(next, meritCatalog, ["vampire", String(next.line_data.clan_id ?? ""), ...vampireCovenantIds(next.line_data)]);
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
    } else if (purchase === "discipline" && intendedRating >= ratedMaximum) {
      setTarget("");
    } else if (purchase === "blood-potency" && Number(next.line_data.blood_potency ?? 1) >= 10) {
      setTarget("");
    } else if (purchase === "humanity" && Number(next.line_data.humanity ?? 7) >= humanityMaximum) {
      setTarget("");
    } else if (purchase === "willpower" && Number(next.current_state.willpower_lost_dots ?? 0) <= packWillpowerInvestment) {
      setTarget("");
    } else if (purchase === "devotion" || purchase === "lash" || purchase === "rite" || purchase === "miracle" || purchase === "formula" || purchase === "sacrilege" || purchase === "invocation" || purchase === "detournement" || purchase === "scale") {
      setTarget("");
    }

    updateSheet(synchronizeBloodTetherPack(synchronizeAutomaticBloodlineDevotions(next, powers)));
    setFeedback(t("ui.purchaseRecorded"));
    setSpecialtyName("");
  };
  const revert = (entry: HistoryEntry) => {
    if (!history.some((item) => item.id === entry.id)) return;
    if (!entry.undo || !Number.isInteger(entry.cost) || entry.cost < 0 || (entry.undo.kind === "merit" && entry.cost !== entry.undo.dots)) return setFeedback(t("ui.thisOlderPurchaseDoesNotContainEnoughData"));
    const next = structuredClone(character);
    if (!refundVampireAdvancement(next, entry.undo)) return setFeedback(t("ui.thisOlderPurchaseDoesNotContainEnoughData"));
    next.derived = vampireDerived(next.attributes, next.skills, recordRatings(next.line_data.disciplines, disciplineNames, 10), Number(next.line_data.blood_potency ?? 1), reference);
    next.current_state = {
      ...next.current_state,
      experience_available: available + entry.cost,
      experience_spent: Math.max(0, spent - entry.cost),
      experience_total: total,
      vampire_experience_history: history.filter((item) => item.id !== entry.id),
    };
    updateSheet(synchronizeBloodTetherPack(synchronizeAutomaticBloodlineDevotions(synchronizeVampireBuilderMeritGrants(next), powers)));
    setFeedback(t("ui.wasRefundedExperienceRestored", { p1: vampireExperienceLabel(entry, character, meritCatalog, powers, locale), p2: entry.cost }));
  };
  const commitAvailableExperience = () => {
    const nextAvailable = Math.max(0, Math.trunc(Number(amount) || 0));
    setAmountDraft(null);
    saveState({ experience_available: nextAvailable, experience_spent: spent, experience_total: nextAvailable + spent });
  };
  const historyPanel = <details className="experience-history"><summary><History /> {t("ui.experienceExpenses")} ({history.length})</summary><div>{history.length ? [...history].reverse().map((entry) => <p key={entry.id}><span>{vampireExperienceLabel(entry, character, meritCatalog, powers, locale)}</span><strong>{entry.cost} {t("ui.xp")}</strong><small>{new Date(entry.createdAt).toLocaleDateString(locale)}</small><Button type="button" size="sm" variant="ghost" disabled={!entry.undo} onClick={() => revert(entry)}><RotateCcw /> {t("ui.refund")}</Button></p>) : <em>{t("ui.noExpensesRecorded")}</em>}</div></details>;
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
            ] : availablePurchaseGroups, (value) => purchaseLabel(value as PurchaseType, locale), locale)} /></label>
            {purchase === "merit" ? <label>{t("ui.merit")}<ExperienceMeritPicker line="VtR" context={meritContext} meritCatalog={meritCatalog} character={character} selectedId={selectedMerit?.id ?? ""} targetDots={nextMeritRating ?? 0} onSelect={(id, dots, instance) => { setTarget(id); setMeritDots(dots); setMeritInstance(instance); setMeritConfiguration(normalizeMeritConfiguration(character.merits[instance]?.configuration)); }} isEligible={(definition, context) => vampireMeritEligible(definition, context, zirnitraRating)} categoryFor={vampireMeritFilterCategory} /></label> : purchase === "discipline" ? <label>{purchaseLabel(purchase, locale)}<ExperiencePowerPicker kind="Disciplina" line="VtR" items={disciplinePickerItems} selectedId={chosen} onSelect={(value) => { setTarget(value); setTargetRating(0); }} triggerLabel={t("ui.selectDiscipline")} dialogTitle={t("ui.purchaseDiscipline")} /></label> : purchase === "devotion" ? <label>{purchaseLabel(purchase, locale)}<ExperiencePowerPicker kind="Devoção" line="VtR" items={devotionPickerItems} categoryOptions={[t("ui.generalDevotions"), t("sheet.bloodline")]} selectedId={chosen} onSelect={(value) => setTarget(value)} triggerLabel={t("ui.selectDevotion")} dialogTitle={t("ui.purchaseDevotion")} dialogDescription={t("ui.devotionCatalogDescription")} /></label> : purchase === "lash" ? <label>{purchaseLabel(purchase, locale)}<ExperiencePowerPicker kind="Lash" line="VtR" items={lashPickerItems} selectedId={chosen} onSelect={(value) => setTarget(value)} triggerLabel={t("ui.selectBloodTetherLash")} dialogTitle={t("ui.lashesOfBloodTether")} /></label> : !ritualPurchase && (options.length > 1 || options[0]?.value !== purchase) ? <label>{t("ui.trait")}<RuleSelect value={chosen} onChange={(value) => { setTarget(value); setTargetRating(0); }} options={options} /></label> : null}
            {purchase === "merit" && selectedMerit && Number(nextMeritRating) > 0 && <MeritConfigurationEditor specialtyContext={meritContext} merit={{ definitionId: selectedMerit.id, name: selectedMerit.name, dots: Number(nextMeritRating), configuration: meritConfiguration }} onChange={setMeritConfiguration} catalog={[...meritCatalog]} ownedMerits={character.merits} definitions={VAMPIRE_MERIT_CONFIGURATIONS} />}
            {purchase === "specialty" && <label>{t("ui.specialty")}<Input value={specialtyName} placeholder={t("ui.specialtyName")} onChange={(event) => setSpecialtyName(event.target.value)} maxLength={80} /></label>}
            {ratedMaximum > ratedCurrent && <ExperienceRatingPicker current={ratedCurrent} maximum={ratedMaximum} value={intendedRating} onChange={(value) => { setTargetRating(value); setFreePowerIds([]); }} />}
            {ritualPurchase && freePowerSelections.map((selectedId, index) => {
              const maximumRating = ratedCurrent + index + 1;
              const selectedElsewhere = new Set(freePowerSelections.filter((_, selectedIndex) => selectedIndex !== index));
              const freeOptions = eligibleBloodSorceryPowers(freePowerCatalog, new Set([...knownRites, ...selectedElsewhere]), maximumRating, selectedRitualDiscipline?.id === "theban" ? Number(character.line_data.humanity ?? 7) : selectedRitualDiscipline?.id === "therion" ? Math.max(0, Number(character.line_data.humanity ?? 7) - 1) : 10).map((item) => ({ value: item.id, label: powerName(item, locale), group: `${t("ui.level")} ${item.rating}` }));
              const freeLabel = selectedRitualDiscipline?.id === "cruac" ? t("ui.freeRite") : selectedRitualDiscipline?.id === "theban" ? t("ui.freeMiracle") : selectedRitualDiscipline?.id === "kimiya" ? t("ui.freeFormula") : selectedRitualDiscipline?.id === "gilded-cage" ? t("ui.freeInvocation") : t("ui.freeSacrilege");
              return <label key={`${selectedRitualDiscipline?.id}-${maximumRating}`}>{freeLabel} · {t("ui.level")} {maximumRating}<RuleSelect value={selectedId} onChange={(id) => setFreePowerIds(() => { const next = [...freePowerSelections]; next[index] = id; return next; })} options={freeOptions} /></label>;
            })}
          </div>
          <div className="purchase-preview"><strong>{ratedMaximum ? `${options.find((item) => item.value === chosen)?.label ?? purchaseLabel(purchase, locale)} ${intendedRating}` : options.find((item) => item.value === chosen)?.label ?? purchaseLabel(purchase, locale)}</strong><span>{cost} {t("ui.xp")}</span></div>
          {feedback && <p className="experience-feedback">{feedback}</p>}
          {historyPanel}<DialogFooter><DialogClose asChild><Button type="button" variant="outline" size="sm" className="catalog-dialog-done">{t("ui.close")}</Button></DialogClose><Button type="button" size="sm" className="catalog-selection-action" disabled={unavailable || (!builderMode && available < cost)} onClick={buy}>{t("ui.purchaseFor")} {cost} {t("ui.xp")}</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
    {feedback && <p className="experience-feedback compact">{feedback}</p>}
    {historyPanel}
  </section>;
}
