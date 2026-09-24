"use client";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import {
  CharacterBuilderShell,
  builderCurrentState,
  commonCreationIssues,
  experienceTraitDots,
  isCreationDraft,
  useCommonBuilderState,
  type BuilderValidationIssue,
} from "@/app/character-builder-shell";
import { Aspirations, Choice, CommonIdentityStep, DotRow, TraitsStep } from "@/app/builder/common-controls";
import { MeritConfigurationEditor } from "@/app/builder/merit-configuration-editor";
import { MeritPicker } from "@/app/builder/merit-picker";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectSeparator, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ATTRIBUTES, SKILLS } from "@/lib/core/character/creation-rules";
import type { CharacterSheet } from "@/lib/core/character/character-types";
import { normalizeMeritConfiguration } from "@/lib/core/character/merit-configuration";
import type { GameLineBuilderModule, GameLineBuilderProps } from "@/lib/game-line-contracts/game-line-ui";
import { translate, useLanguage, type Locale } from "@/lib/i18n";
import { mergeCreationMerits } from "@/lib/merit-progression";
import { meritSelectionProblems, type MeritDefinition, type MeritPrerequisiteContext } from "@/lib/merits";
import { createRandomId } from "@/lib/random-id";
import { VampireExperiencePanel } from "./experience-panel";
import { systemTerm } from "@/lib/system-terms";
import type { VampireAnchorDefinition, VampireClanDefinition, VampireCovenantDefinition, VampirePowers, VampireReference } from "./catalog-types";
import { ORDO_MYSTERIES, recordRatings, stringArray, VAMPIRE_CREATION_DISCIPLINES, VAMPIRE_DISCIPLINES, vampireCovenantStatus, vampireDerived, vampireDisciplineAvailable, vampireDisciplineDisplayName } from "./creation-rules";
import { synchronizeVampireBuilderMeritGrants } from "./builder-merit-grants";
import { isVampireInlineMeritConfiguration, VAMPIRE_MERIT_CONFIGURATIONS } from "./merit-configurations";
import { vampireMeritEligible, zirnitraMortalMeritCount, zirnitraMortalMeritLimit } from "./merit-eligibility";
import { useHomebrewPreferences } from "@/app/use-homebrew";
import { useMeritHomebrews } from "@/app/use-merit-homebrews";
import { activeMeritCatalog } from "@/lib/merit-homebrews";

type KindredStatusScope = "covenant" | "clan" | "city";

function initialCreationDisciplines(initial?: CharacterSheet | null) {
  return recordRatings(initial?.line_data.creation_disciplines ?? initial?.line_data.disciplines, VAMPIRE_CREATION_DISCIPLINES, 5);
}

function disciplineAdvancement(initial?: CharacterSheet | null) {
  const creation = recordRatings(initial?.line_data.creation_disciplines, VAMPIRE_DISCIPLINES, 10);
  const current = recordRatings(initial?.line_data.disciplines, VAMPIRE_DISCIPLINES, 10);
  return Object.fromEntries(VAMPIRE_DISCIPLINES.map((name) => [name, Math.max(0, current[name] - creation[name])]));
}

function experienceSpecialties(initial?: CharacterSheet | null) {
  const history = initial?.current_state.vampire_experience_history;
  if (!Array.isArray(history)) return [];
  return history.flatMap((entry) => {
    const undo = entry && typeof entry === "object" ? (entry as { undo?: Record<string, unknown> }).undo : undefined;
    return undo?.kind === "specialty" && typeof undo.skill === "string" && typeof undo.name === "string" ? [{ skill: undo.skill, name: undo.name }] : [];
  });
}

function displayName(item: { name: string; translatedName: string }, locale: string) {
  return locale === "pt-BR" ? item.translatedName : item.name;
}

export function reconcileCreationCovenantPower(
  powers: Pick<VampirePowers, "cruacRites" | "thebanMiracles" | "kimiyaFormulae" | "therionSacrileges" | "coils">,
  previousId: string,
  selectedId: string,
  bloodSorceryValue: unknown,
  coilRatingsValue: unknown,
) {
  const bloodSorcery = bloodSorceryValue && typeof bloodSorceryValue === "object" && !Array.isArray(bloodSorceryValue) ? { ...bloodSorceryValue as Record<string, unknown> } : {};
  const coilRatings = coilRatingsValue && typeof coilRatingsValue === "object" && !Array.isArray(coilRatingsValue) ? { ...coilRatingsValue as Record<string, unknown> } : {};
  const adjust = (id: string, amount: -1 | 1) => {
    if (!id) return;
    const riteKey = powers.cruacRites.some((item) => item.id === id) ? "cruac_rite_ids"
      : powers.thebanMiracles.some((item) => item.id === id) ? "theban_miracle_ids"
        : powers.kimiyaFormulae.some((item) => item.id === id) ? "kimiya_formula_ids"
          : powers.therionSacrileges.some((item) => item.id === id) ? "therion_sacrilege_ids" : "";
    if (riteKey) {
      const ratingKey = ({ cruac_rite_ids: "cruac_rating", theban_miracle_ids: "theban_rating", kimiya_formula_ids: "kimiya_rating", therion_sacrilege_ids: "therion_rating" } as const)[riteKey];
      bloodSorcery[ratingKey] = Math.max(0, Math.min(5, Number(bloodSorcery[ratingKey] ?? 0) + amount));
      const ids = stringArray(bloodSorcery[riteKey]).filter((item) => item !== id);
      bloodSorcery[riteKey] = amount > 0 ? [...ids, id] : ids;
    } else if (powers.coils.some((item) => item.id === id)) {
      const rating = Math.max(0, Math.min(5, Number(coilRatings[id] ?? 0) + amount));
      if (rating) coilRatings[id] = rating;
      else delete coilRatings[id];
    }
  };
  adjust(previousId, -1);
  adjust(selectedId, 1);
  return { bloodSorcery, coilRatings };
}

type TouchstoneMeritPoint = { key: string; meritInstanceId: string; dot: number; slot: number };

function touchstoneMeritPoints(merits: CharacterSheet["merits"], baseSlot: number): TouchstoneMeritPoint[] {
  const minimumSlot = baseSlot === 7 ? 2 : 1;
  const points: TouchstoneMeritPoint[] = [];
  let offset = 0;
  merits.forEach((merit, meritIndex) => {
    if (merit.name !== "Touchstone") return;
    const meritInstanceId = String(merit.instanceId ?? `touchstone-merit-${meritIndex}`);
    const dots = Math.max(0, Math.floor(Number(merit.dots ?? 0)));
    for (let dot = 1; dot <= dots; dot += 1) {
      offset += 1;
      const slot = baseSlot - offset;
      if (slot < minimumSlot) continue;
      points.push({ key: `${meritInstanceId}:${dot}`, meritInstanceId, dot, slot });
    }
  });
  return points;
}

function existingTouchstoneRows(initial?: CharacterSheet | null): Record<string, unknown>[] {
  const value = initial?.line_data.touchstones;
  if (!Array.isArray(value)) return [];
  return value.filter((row): row is Record<string, unknown> => Boolean(row) && typeof row === "object" && !Array.isArray(row));
}

function reconcileTouchstones(initial: CharacterSheet | null | undefined, merits: CharacterSheet["merits"], baseSlot: number, baseName: string): Record<string, unknown>[] {
  const rows = existingTouchstoneRows(initial);
  const baseRow = rows.find((row) => !String(row.merit_point_key ?? ""));
  const points = touchstoneMeritPoints(merits, baseSlot);
  const activePoints = new Map(points.map((point) => [point.key, point]));
  const nextRows: Record<string, unknown>[] = baseName.trim() ? [{
    ...(baseRow ?? {}), id: String(baseRow?.id ?? createRandomId()), name: baseName.trim(), humanity_slot: baseSlot, notes: String(baseRow?.notes ?? ""),
  }] : [];
  for (const row of rows) {
    const key = String(row.merit_point_key ?? "");
    if (!key) continue;
    const point = activePoints.get(key);
    if (!point) continue;
    nextRows.push({ ...row, humanity_slot: point.slot, merit_point_key: point.key, merit_instance_id: point.meritInstanceId, merit_dot: point.dot });
  }
  return nextRows;
}

function reconcileTraitAllocation(values: Record<string, number>, groups: Record<string, readonly string[]>, priorities: string[], base: number, budgets: readonly number[]) {
  const next = { ...values };
  for (const [category, names] of Object.entries(groups)) {
    const priorityIndex = priorities.indexOf(category);
    if (priorityIndex < 0) continue;
    const budget = budgets[priorityIndex] ?? 0;
    let spent = names.reduce((sum, name) => sum + Math.max(0, Number(next[name] ?? base) - base), 0);
    for (let index = names.length - 1; spent > budget && index >= 0; index -= 1) {
      const name = names[index];
      const current = Math.max(base, Number(next[name] ?? base));
      const removable = Math.min(current - base, spent - budget);
      if (removable > 0) { next[name] = current - removable; spent -= removable; }
    }
  }
  return next;
}

function VampireCharacterBuilder({ player, initial, onCancel, onSave, onSaveDraft, catalogs }: GameLineBuilderProps) {
  const { locale, t } = useLanguage();
  if (initial && initial.game_line !== "VtR") throw new Error("Vampire builder received a non-Vampire character.");
  if (!catalogs) throw new Error("Vampire builder requires its catalog snapshot.");
  const reference = catalogs.get<VampireReference>("vampire-reference");
  const powers = catalogs.get<VampirePowers>("vampire-powers");
  const initialClan = reference.clans.find((item) => item.id === String(initial?.line_data.clan_id ?? ""));
  const customMerits = useMeritHomebrews("VtR", true), homebrewPreferences = useHomebrewPreferences();
  const meritCatalog = activeMeritCatalog([
    ...catalogs.get<readonly MeritDefinition[]>("core-merits"),
    ...catalogs.get<readonly MeritDefinition[]>("vampire-merits"),
  ], customMerits, homebrewPreferences, initial?.merits.map((item) => item.name)).sort((left, right) => left.translatedName.localeCompare(right.translatedName, "pt-BR"));
  const common = useCommonBuilderState(initial, player, {
    experienceHistoryKey: "vampire_experience_history",
    purchasedSpecialties: experienceSpecialties(initial),
    grantedMeritSources: ["Vampire Template"],
    adjustAttributes: (values) => {
      const favored = initialClan?.favoredAttributeMode === "both" ? initialClan.favoredAttributes : [String(initial?.line_data.favored_attribute ?? "")];
      for (const name of favored) if (name && values[name] > 1) values[name] -= 1;
      return values;
    },
  });
  const setMerits = common.setMerits;
  const [clanId, setClanId] = useState(String(initial?.line_data.clan_id ?? ""));
  const [favoredAttribute, setFavoredAttribute] = useState(String(initial?.line_data.favored_attribute ?? ""));
  const [covenantId, setCovenantId] = useState(String(initial?.line_data.covenant_id ?? "covenantless"));
  const [statusScope, setStatusScope] = useState<KindredStatusScope>(() => {
    const saved = String(initial?.line_data.kindred_status_scope ?? "covenant");
    return ["covenant", "clan", "city"].includes(saved) ? saved as KindredStatusScope : "covenant";
  });
  const [statusCity, setStatusCity] = useState(String(initial?.line_data.kindred_status_city ?? ""));
  const [maskId, setMaskId] = useState(String(initial?.line_data.mask_id ?? ""));
  const [dirgeId, setDirgeId] = useState(String(initial?.line_data.dirge_id ?? ""));
  const [touchstone, setTouchstone] = useState(() => {
    const baseTouchstone = existingTouchstoneRows(initial).find((row) => !String(row.merit_point_key ?? ""));
    return String(baseTouchstone?.name ?? "");
  });
  const [bloodPotency, setBloodPotency] = useState(Number(initial?.line_data.creation_blood_potency ?? initial?.line_data.blood_potency ?? 1));
  const [disciplines, setDisciplines] = useState<Record<string, number>>(() => initialCreationDisciplines(initial));
  const initialChoices = initial?.line_data.discipline_choices && typeof initial.line_data.discipline_choices === "object" && !Array.isArray(initial.line_data.discipline_choices) ? initial.line_data.discipline_choices as Record<string, unknown> : {};
  const initialOrdo = initial?.line_data.ordo_dracul && typeof initial.line_data.ordo_dracul === "object" && !Array.isArray(initial.line_data.ordo_dracul) ? initial.line_data.ordo_dracul as Record<string, unknown> : {};
  const [proteanAspects, setProteanAspects] = useState<string[]>(() => stringArray(initialChoices.protean_aspects));
  const [proteanForms, setProteanForms] = useState<string[]>(() => stringArray(initialChoices.protean_forms));
  const [proteanUnnatural, setProteanUnnatural] = useState<string[]>(() => stringArray(initialChoices.protean_unnatural_aspect));
  const [mysteryId, setMysteryId] = useState(String(initialOrdo.mystery_id ?? ""));
  const [creationCovenantPowerId, setCreationCovenantPowerId] = useState(String(initial?.line_data.creation_covenant_power_id ?? ""));
  const selectedClan = reference.clans.find((item) => item.id === clanId);
  const selectedCovenant = reference.covenants.find((item) => item.id === covenantId);
  const statusGroup = statusScope === "covenant"
    ? (selectedCovenant?.id === "covenantless" ? "" : selectedCovenant?.name ?? "")
    : statusScope === "clan"
      ? selectedClan?.name ?? ""
      : statusCity.trim();
  const purchasedCovenantStatus = selectedCovenant ? vampireCovenantStatus({ merits: common.merits }, covenantId, selectedCovenant.name, selectedCovenant.translatedName) : 0;
  const covenantStatus = Math.max(purchasedCovenantStatus, statusScope === "covenant" && statusGroup ? 1 : 0);
  const covenantPowerOptions = covenantId === "circle-of-the-crone" ? powers.cruacRites.filter((item) => item.rating === 1)
    : covenantId === "lancea-et-sanctum" ? powers.thebanMiracles.filter((item) => item.rating === 1)
      : covenantId === "jaliniyya" ? powers.kimiyaFormulae.filter((item) => item.rating === 1)
        : covenantId === "tenth-choir" ? powers.therionSacrileges.filter((item) => item.rating === 1)
          : covenantId === "ordo-dracul" && mysteryId ? powers.coils.filter((item) => item.id === `coil-${mysteryId}`) : [];
  const hasCreationCovenantPower = covenantPowerOptions.some((item) => item.id === creationCovenantPowerId);
  const covenantPower = reconcileCreationCovenantPower(powers, String(initial?.line_data.creation_covenant_power_id ?? ""), hasCreationCovenantPower ? creationCovenantPowerId : "", initial?.line_data.blood_sorcery, initialOrdo.coil_ratings);
  const zirnitraRating = Number(covenantPower.coilRatings["coil-zirnitra"] ?? 0);
  const disciplineDots = Object.values(disciplines).reduce((sum, value) => sum + value, 0);
  const totalDisciplineDots = disciplineDots + Number(hasCreationCovenantPower);
  const inClanDots = selectedClan?.disciplines.reduce((sum, name) => sum + Number(disciplines[name] ?? 0), 0) ?? 0;
  const meritSpent = common.merits.reduce((sum, merit) => sum + Math.max(0, Number(merit.dots ?? 0) - (merit.grantedBy === "Vampire Template" ? 1 : 0)), 0);
  const meritBudget = Math.max(0, 10 - (bloodPotency - 1) * 5);
  const maxBloodPotency = Math.max(1, Math.min(3, 1 + Math.floor(Math.max(0, 10 - meritSpent) / 5)));
  const setAttributePriority = (priorities: string[]) => { common.setAttributePriority(priorities); common.setAttributes((values) => reconcileTraitAllocation(values, ATTRIBUTES, priorities, 1, [5, 4, 3])); };
  const setSkillPriority = (priorities: string[]) => { common.setSkillPriority(priorities); common.setSkills((values) => reconcileTraitAllocation(values, SKILLS, priorities, 0, [11, 7, 4])); };

  const meritContext: MeritPrerequisiteContext = {
    gameLine: "VtR", archetypes: ["vampire", clanId, covenantId], attributes: common.attributes,
    skills: common.skills, merits: mergeCreationMerits(initial?.merits, common.merits), meritCatalog,
    powers: Object.entries(disciplines).filter(([, value]) => value > 0).map(([name]) => name),
  };
  const issues = (() => {
    const result: BuilderValidationIssue[] = commonCreationIssues(common, {
      attributes: t("ui.attributes"), skills: t("ui.skills"), attributePriorities: t("ui.attributePriorities"), skillPriorities: t("ui.skillPriorities"), categoryLabel: (category) => systemTerm(category, locale),
    });
    const add = (key: string, label: string, step = 3) => result.push({ step, key, label });
    if (!common.name.trim()) add("name", t("ui.name"), 1);
    if (!selectedClan) add("clan", t("ui.clan"));
    if (selectedClan?.favoredAttributeMode !== "both" && !selectedClan?.favoredAttributes.includes(favoredAttribute)) add("favoredAttribute", t("ui.clanFavoredAttribute"));
    if (!reference.covenants.some((item) => item.id === covenantId)) add("covenant", t("sheet.covenant"));
    if (!statusGroup) add("kindredStatus", t("ui.kindredStatus"));
    if (!reference.anchors.some((item) => item.id === maskId)) add("mask", t("sheet.mask"));
    if (!reference.anchors.some((item) => item.id === dirgeId) || dirgeId === maskId) add("dirge", t("ui.dirgeDistinctFromMask"));
    if (totalDisciplineDots !== 3 || inClanDots < 2) add("disciplines", t("ui.message3DisciplineDotsAtLeast2InClan"));
    const protean = Number(disciplines.Protean ?? 0);
    if (protean >= 2 && proteanAspects.filter((value) => value.trim()).length !== 3) add("protean", t("ui.threePredatoryAspectAdaptations"));
    if (protean >= 3 && !proteanForms.some((value) => value.trim())) add("protean", t("ui.beastSSkinForm"));
    if (protean >= 4 && proteanUnnatural.filter((value) => value.trim()).length !== 3) add("protean", t("ui.threeUnnaturalAspectAdaptations"));
    if (covenantId === "ordo-dracul" && !ORDO_MYSTERIES.includes(mysteryId as (typeof ORDO_MYSTERIES)[number])) add("mystery", t("ui.ordoDraculMystery"));
    if (creationCovenantPowerId && (!hasCreationCovenantPower || covenantStatus < 1)) add("covenantPower", t("ui.covenantPowerRequiresKindredStatus1InThe"));
    if (meritSpent > meritBudget) add("merits", t("ui.meritsExceedTheLimit"));
    if (zirnitraMortalMeritCount(meritContext) > zirnitraMortalMeritLimit(zirnitraRating)) add("merits", "Coil of Zirnitra");
    for (const merit of common.merits) {
      const definition = meritCatalog.find((item) => item.name === merit.name);
      if (definition) for (const message of meritSelectionProblems(definition, merit, meritContext)) add("merits", `${displayName(definition, locale)}: ${message}`);
      if (merit.name === "Kindred Status" && !String(merit.configuration?.group ?? "").trim()) add("merits", t("ui.kindredStatusRequiresAClanCovenantOrCity"));
    }
    return result;
  })();
  const missing = (key: string) => issues.some((issue) => issue.key === key);
  const [nosferatuEasterEgg, setNosferatuEasterEgg] = useState(false);

  useEffect(() => {
    setMerits((current) => {
      const existing = current.find((merit) => merit.name === "Kindred Status" && merit.grantedBy === "Vampire Template");
      const retained = current.filter((merit) => !(merit.name === "Kindred Status" && merit.grantedBy === "Vampire Template"));
      const next = statusGroup ? [...retained, {
        ...existing,
        instanceId: existing?.instanceId ?? "vampire-template-kindred-status",
        name: "Kindred Status",
        dots: Math.max(1, Number(existing?.dots ?? 1)),
        sourceId: "vtr-2ed",
        source: "Vampire: The Requiem Second Edition",
        configuration: { group: statusGroup },
        grantedBy: "Vampire Template",
      }] : retained;
      return JSON.stringify(next) === JSON.stringify(current) ? current : next;
    });
  }, [statusGroup, setMerits]);

  useEffect(() => {
    if (!nosferatuEasterEgg) return;
    const timeout = window.setTimeout(() => setNosferatuEasterEgg(false), 15000);
    const prevent = (event: Event) => { event.preventDefault(); event.stopPropagation(); };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", prevent, true);
    window.addEventListener("wheel", prevent, { passive: false, capture: true });
    window.addEventListener("touchmove", prevent, { passive: false, capture: true });
    return () => {
      window.clearTimeout(timeout); document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", prevent, true); window.removeEventListener("wheel", prevent, true); window.removeEventListener("touchmove", prevent, true);
    };
  }, [nosferatuEasterEgg]);

  const chooseClan = (value: string) => {
    setClanId(value);
    const clan = reference.clans.find((item) => item.id === value);
    if (clan?.favoredAttributeMode === "both" || !clan?.favoredAttributes.includes(favoredAttribute)) setFavoredAttribute("");
    setDisciplines((current) => ({ ...current, Praestantia: value === "akhud" ? current.Praestantia : 0, Vitiate: value === "bekaak" ? current.Vitiate : 0 }));
    if (value === "nosferatu") setNosferatuEasterEgg(true);
  };
  const chooseCovenant = (value: string) => {
    setCovenantId(value); setCreationCovenantPowerId("");
    setDisciplines((current) => ({ ...current, "Triadic Evolution": value === "belials-brood" ? current["Triadic Evolution"] : 0 }));
    if (value !== "ordo-dracul") setMysteryId("");
    if (value === "covenantless" && statusScope === "covenant") setStatusScope("clan");
  };

  const buildCharacter = (source: CharacterSheet | null | undefined, draft: boolean) => {
    const advancement = disciplineAdvancement(source);
    const finalDisciplines = Object.fromEntries(VAMPIRE_DISCIPLINES.map((name) => [name, (VAMPIRE_CREATION_DISCIPLINES as readonly string[]).includes(name) ? disciplines[name] + advancement[name] : advancement[name]]));
    const bpAdvancement = Math.max(0, Number(source?.line_data.blood_potency ?? 1) - Number(source?.line_data.creation_blood_potency ?? source?.line_data.blood_potency ?? 1));
    const finalBloodPotency = Math.min(10, bloodPotency + bpAdvancement);
    const finalAttributes = { ...common.attributes };
    const favoredAttributes = selectedClan?.favoredAttributeMode === "both" ? selectedClan.favoredAttributes : favoredAttribute ? [favoredAttribute] : [];
    for (const name of favoredAttributes) finalAttributes[name] = Math.min(5, Number(common.attributes[name] ?? 1) + 1);
    for (const [name, dots] of Object.entries(experienceTraitDots(source, "attributes", "vampire_experience_history"))) finalAttributes[name] = Number(finalAttributes[name] ?? 1) + dots;
    const finalSkills = { ...common.skills };
    for (const [name, dots] of Object.entries(experienceTraitDots(source, "skills", "vampire_experience_history"))) finalSkills[name] = Number(finalSkills[name] ?? 0) + dots;
    const now = new Date().toISOString();
    const touchstoneSlot = clanId === "ventrue" ? 7 : 6;
    const bloodSorcery = covenantPower.bloodSorcery;
    const ordoDracul = { ...initialOrdo, mystery_id: covenantId === "ordo-dracul" ? mysteryId : initialOrdo.mystery_id ?? "", coil_ratings: covenantPower.coilRatings };
    const finalMerits = mergeCreationMerits(source?.merits, common.merits.map((merit) => {
        const definition = meritCatalog.find((item) => item.name === merit.name);
        return { ...merit, sourceId: definition?.sourceId, source: definition?.source, configuration: normalizeMeritConfiguration(merit.configuration) };
      }));
    const finalTouchstones = reconcileTouchstones(source, finalMerits, touchstoneSlot, touchstone);
    const completed: CharacterSheet = {
      id: source?.id ?? createRandomId(), schema_version: 2, system: "chronicles-of-darkness", game_line: "VtR",
      ruleset: { id: "vtr-2ed-embedded", version: 1 },
      character: { name: common.name.trim(), concept: common.concept.trim(), player: common.playerName.trim(), chronicle: common.chronicle.trim() },
      attributes: finalAttributes, skills: finalSkills,
      specializations: [
        ...common.specialties.filter((item) => item.skill && item.name.trim()).map((item) => ({ skill: item.skill, name: item.name.trim() })),
        ...experienceSpecialties(source), ...(source?.specializations ?? []).filter((item) => typeof item !== "string" && Boolean(item.grantedBy)),
      ],
      merits: finalMerits,
      line_data: {
        ...(source?.line_data ?? {}), clan_id: clanId, favored_attribute: favoredAttribute, favored_attributes: favoredAttributes, covenant_id: covenantId,
        kindred_status_scope: statusScope, kindred_status_city: statusCity.trim(), kindred_status_group: statusGroup,
        mask_id: maskId, dirge_id: dirgeId, aspirations: common.aspirations.map((item) => item.trim()).filter(Boolean),
        creation_blood_potency: bloodPotency, blood_potency: finalBloodPotency, creation_covenant_power_id: hasCreationCovenantPower ? creationCovenantPowerId : "",
        creation_disciplines: disciplines, disciplines: finalDisciplines, humanity: Number(source?.line_data.humanity ?? 7),
        discipline_choices: { ...initialChoices, protean_aspects: proteanAspects.map((value) => value.trim()).filter(Boolean), protean_forms: proteanForms.map((value) => value.trim()).filter(Boolean), protean_unnatural_aspect: proteanUnnatural.map((value) => value.trim()).filter(Boolean) },
        touchstones: finalTouchstones, devotion_ids: source?.line_data.devotion_ids ?? [], blood_sorcery: bloodSorcery, ordo_dracul: ordoDracul, banes: source?.line_data.banes ?? [],
      },
      derived: vampireDerived(finalAttributes, finalSkills, finalDisciplines, finalBloodPotency, reference),
      current_state: builderCurrentState(source, draft, common.step, common.allowAdvancement), created_at: source?.created_at ?? now, updated_at: now,
    };
    return synchronizeVampireBuilderMeritGrants(completed);
  };
  const finish = (draft: boolean, advancement?: CharacterSheet) => {
    if (!draft && issues.length) {
      common.setError(`${t("ui.stillRequired")}: ${issues.map((issue) => issue.label).join(", ")}.`);
      common.setStep(issues[0].step); return false;
    }
    (draft ? onSaveDraft : onSave)(buildCharacter(advancement ?? initial, draft));
    return true;
  };

  const statusScopeOptions: KindredStatusScope[] = [
    ...(selectedCovenant && selectedCovenant.id !== "covenantless" ? ["covenant" as const] : []),
    ...(selectedClan ? ["clan" as const] : []),
    "city",
  ];

  return <>
    {nosferatuEasterEgg && <div className="nosferatu-easter-egg"><video src="/vampire/easter-eggs/nosferatu.webm" autoPlay playsInline controls={false} disablePictureInPicture /></div>}
    <CharacterBuilderShell line="VtR" templateLabel={t("ui.vampireTemplate")} state={common} issues={issues} draft={!initial || isCreationDraft(initial)} onCancel={onCancel} onFinish={finish}
      prepareAdvancement={(previous) => buildCharacter(previous ?? initial, false)}
      renderAdvancement={(sheet, updateSheet) => <VampireExperiencePanel character={sheet} updateSheet={updateSheet} catalogs={catalogs} builderMode />}
      identity={<CommonIdentityStep name={common.name} setName={common.setName} nameLabel={t("ui.name")} concept={common.concept} setConcept={common.setConcept} player={common.playerName} setPlayer={common.setPlayerName} chronicle={common.chronicle} setChronicle={common.setChronicle} missing={missing} />}
      traits={<TraitsStep attributes={common.attributes} setAttributes={common.setAttributes} skills={common.skills} setSkills={common.setSkills} attributePriority={common.attributePriority} setAttributePriority={setAttributePriority} skillPriority={common.skillPriority} setSkillPriority={setSkillPriority} specialties={common.specialties} setSpecialties={common.setSpecialties} missing={missing} />}
      lineTemplate={<div className="builder-section vampire-builder-template">
        <span className="kicker">{t("ui.step3VAMPIRE")}</span><h2>{t("ui.vampireTemplate")}</h2>
        <div className="vampire-template-grid vampire-template-standard">
          <div className="vampire-template-primary">
            <GroupedReferenceChoice label={t("ui.clan")} items={reference.clans} value={clanId} onChange={chooseClan} locale={locale} invalid={missing("clan")} />
            <div className="vampire-template-current">
              <strong>{selectedClan ? displayName(selectedClan, locale) : t("ui.noneSelected")}</strong>
              <small>{selectedClan ? selectedClan.disciplines.map((discipline) => vampireDisciplineDisplayName(discipline, powers.disciplines, locale)).join(" · ") : t("ui.selectClan")}</small>
            </div>
            {selectedClan && (selectedClan.favoredAttributeMode === "both" ? <div className="vampire-template-current"><strong>{t("ui.favoredAttribute1")}</strong><small>{selectedClan.favoredAttributes.map((item) => systemTerm(item, locale)).join(" · ")}</small></div> : <div className={missing("favoredAttribute") ? "missing-field block" : ""}><Choice label={t("ui.favoredAttribute1")} value={favoredAttribute} setValue={setFavoredAttribute} options={selectedClan.favoredAttributes} optionLabels={Object.fromEntries(selectedClan.favoredAttributes.map((item) => [item, systemTerm(item, locale)]))} /></div>)}
          </div>
          <CovenantSelector items={reference.covenants} value={covenantId} onChange={chooseCovenant} locale={locale} invalid={missing("covenant")} />
        </div>

        <div className={`vampire-kindred-status-grant${missing("kindredStatus") ? " missing-field" : ""}`}>
          <div><strong>{t("ui.kindredStatus")} •</strong><small>{t("ui.kindredStatusTemplateDot")}</small></div>
          <Choice label={t("ui.statusType")} value={statusScope} setValue={(value) => setStatusScope(value as KindredStatusScope)} options={statusScopeOptions} optionLabels={{ covenant: t("sheet.covenant"), clan: t("ui.clan"), city: t("ui.city") }} />
          {statusScope === "city" && <label>{t("ui.city")}<Input value={statusCity} onChange={(event) => setStatusCity(event.target.value)} placeholder={t("ui.cityName")} /></label>}
          {statusGroup && <span>{t("ui.grants")}: <strong>{t("ui.kindredStatus")} ({statusGroup}) •</strong></span>}
        </div>

        <div className="vampire-anchor-grid">
          <AnchorChoice label={t("sheet.mask")} value={maskId} setValue={setMaskId} anchors={reference.anchors} locale={locale} invalid={missing("mask")} />
          <AnchorChoice label={t("sheet.dirge")} value={dirgeId} setValue={setDirgeId} anchors={reference.anchors.filter((item) => item.id !== maskId)} locale={locale} invalid={missing("dirge")} />
        </div>
        <label>{t("ui.touchstone")}<Input value={touchstone} onChange={(event) => setTouchstone(event.target.value)} /></label>
        <h3>{t("ui.disciplines3Dots")}</h3>
        <div className={`vampire-discipline-grid${missing("disciplines") ? " missing-field" : ""}`}>
          {powers.disciplines.filter((discipline) => !discipline.bloodlineId && vampireDisciplineAvailable(discipline.name, "", clanId, covenantId)).map((discipline) => <DotRow key={discipline.name} name={displayName(discipline, locale)} value={disciplines[discipline.name] ?? 0} min={0} max={3} canIncrease={totalDisciplineDots < 3} setValue={(value) => setDisciplines({ ...disciplines, [discipline.name]: value })} tag={selectedClan?.disciplines.includes(discipline.name) ? t("ui.inClan") : undefined} />)}
          {covenantPowerOptions.length > 0 && <DotRow
            name={covenantId === "circle-of-the-crone" ? "Crúac" : covenantId === "lancea-et-sanctum" ? "Theban Sorcery" : displayName(covenantPowerOptions[0], locale)}
            value={hasCreationCovenantPower ? 1 : 0}
            min={0}
            max={1}
            canIncrease={totalDisciplineDots < 3 && covenantStatus >= 1}
            setValue={(value) => setCreationCovenantPowerId(value ? (hasCreationCovenantPower ? creationCovenantPowerId : covenantPowerOptions[0].id) : "")}
            tag={t("sheet.covenant")}
          />}
        </div>
        <p className="rule-callout">{t("ui.allocate3DotsAtLeast2MustBelong")}</p>
        {Number(disciplines.Protean ?? 0) >= 2 && <div className={`vampire-protean-builder${missing("protean") ? " missing-field block" : ""}`}><h3>{t("ui.proteanChoices")}</h3><ChoiceLines label={t("ui.predatoryAspect")} values={proteanAspects} count={3} placeholder={t("ui.animalAdaptation")} onChange={setProteanAspects} />{Number(disciplines.Protean ?? 0) >= 3 && <ChoiceLines label={t("ui.beastSSkin")} values={proteanForms} count={1} placeholder={t("ui.animalForm")} onChange={setProteanForms} />}{Number(disciplines.Protean ?? 0) >= 4 && <ChoiceLines label={t("ui.unnaturalAspect")} values={proteanUnnatural} count={3} placeholder={t("ui.monstrousAdaptation")} onChange={setProteanUnnatural} />}</div>}
        {covenantId === "ordo-dracul" && <div className={missing("mystery") ? "missing-field block" : ""}><Choice label={t("ui.mystery")} value={mysteryId} setValue={(value) => { setMysteryId(value); setCreationCovenantPowerId(""); }} options={[...ORDO_MYSTERIES]} optionLabels={{ ascendant: t("ui.ascendant"), wyrm: t("ui.wyrm"), voivode: t("ui.voivode"), quintessence: t("ui.quintessence") }} /></div>}
        {hasCreationCovenantPower && covenantPowerOptions.length > 1 && <div className={missing("covenantPower") ? "missing-field block" : ""}><Choice label={covenantId === "circle-of-the-crone" ? t("ui.freeRite") : covenantId === "lancea-et-sanctum" ? t("ui.freeMiracle") : covenantId === "jaliniyya" ? t("ui.freeFormula") : t("ui.freeSacrilege")} value={creationCovenantPowerId} setValue={setCreationCovenantPowerId} options={covenantPowerOptions.map((item) => item.id)} optionLabels={Object.fromEntries(covenantPowerOptions.map((item) => [item.id, displayName(item, locale)]))} /></div>}
        <Aspirations values={common.aspirations} setValues={common.setAspirations} />
        <div className={missing("merits") ? "missing-field block" : ""}><MeritPicker merits={common.merits} setMerits={common.setMerits} catalog={[...meritCatalog]} context={meritContext} spent={meritSpent} budget={meritBudget} powerLabel={t("ui.bloodPotency")} power={bloodPotency} setPower={(value) => setBloodPotency(Math.min(maxBloodPotency, value))} renderConfiguration={({ merit, ownedMerits, inline, onChange }) => <MeritConfigurationEditor merit={merit} onChange={onChange} catalog={[...meritCatalog]} ownedMerits={ownedMerits} inline={inline} definitions={VAMPIRE_MERIT_CONFIGURATIONS} />} isInlineConfiguration={isVampireInlineMeritConfiguration} isEligible={(definition, context) => vampireMeritEligible(definition, context, zirnitraRating)} /></div>
      </div>}
    />
  </>;
}

function CovenantSelector({ items, value, onChange, locale, invalid }: { items: readonly VampireCovenantDefinition[]; value: string; onChange: (value: string) => void; locale: Locale; invalid: boolean }) {
  const { t } = useLanguage();
  const selected = items.find((item) => item.id === value);
  return <div className={`kith-field vampire-covenant-field${invalid ? " missing-field" : ""}`}>
    <span>{t("sheet.covenant")}</span>
    <div className="kith-current vampire-template-current">
      <strong>{selected ? displayName(selected, locale) : t("ui.noneSelected")}</strong>
      <p>{selected?.description ?? t("ui.selectCovenant")}</p>
      {selected?.advantage && <small><strong>{t("ui.advantage")}:</strong> {selected.advantage}</small>}
    </div>
    <Dialog>
      <DialogTrigger asChild><Button type="button" variant="outline"><Search /> {t("ui.selectCovenant")}</Button></DialogTrigger>
      <DialogContent className="merit-dialog vtr-dialog">
        <DialogHeader><DialogTitle>{t("ui.selectCovenant")}</DialogTitle><DialogDescription>{t("ui.selectCovenantDescription")}</DialogDescription></DialogHeader>
        <GroupedReferenceChoice label={t("sheet.covenant")} items={items} value={value} onChange={onChange} locale={locale} />
        {selected && <div className="vampire-selector-detail"><strong>{displayName(selected, locale)}</strong><p>{selected.description}</p>{selected.advantage && <small><strong>{t("ui.advantage")}:</strong> {selected.advantage}</small>}</div>}
        <DialogFooter><DialogClose asChild><Button type="button" variant="outline" size="sm" className="catalog-dialog-done">{t("ui.done")}</Button></DialogClose></DialogFooter>
      </DialogContent>
    </Dialog>
  </div>;
}

function GroupedReferenceChoice({ label, items, value, onChange, locale, invalid = false }: { label: string; items: readonly (VampireClanDefinition | VampireCovenantDefinition)[]; value: string; onChange: (value: string) => void; locale: Locale; invalid?: boolean }) {
  const { t } = useLanguage();
  const groups = ["core", "historical", "uncommon"] as const;
  const labels = { core: t("ui.coreOptions"), historical: t("ui.historicalOptions"), uncommon: t("ui.uncommonOptions") };
  return <label className={invalid ? "choice-label missing-field" : "choice-label"}>{label}<Select value={value || undefined} onValueChange={onChange}><SelectTrigger><SelectValue placeholder={t("ui.select")} /></SelectTrigger><SelectContent>{groups.map((group, index) => {
    const options = items.filter((item) => item.group === group);
    return options.length ? <SelectGroup key={group}>{index > 0 && <SelectSeparator />}<SelectLabel>{labels[group]}</SelectLabel>{options.map((item) => <SelectItem key={item.id} value={item.id}>{displayName(item, locale)}</SelectItem>)}</SelectGroup> : null;
  })}</SelectContent></Select></label>;
}

function ChoiceLines({ label, values, count, placeholder, onChange }: { label: string; values: string[]; count: number; placeholder: string; onChange: (value: string[]) => void }) {
  const rows = Array.from({ length: count }, (_, index) => values[index] ?? "");
  return <fieldset><legend>{label}</legend>{rows.map((value, index) => <Input key={index} value={value} placeholder={`${placeholder} ${index + 1}`} onChange={(event) => { const next = [...rows]; next[index] = event.target.value; onChange(next); }} />)}</fieldset>;
}

function AnchorChoice({ label, value, setValue, anchors, locale, invalid }: { label: string; value: string; setValue: (value: string) => void; anchors: VampireAnchorDefinition[]; locale: Locale; invalid: boolean }) {
  const selected = anchors.find((item) => item.id === value);
  return <div><Choice label={label} value={value} setValue={setValue} options={anchors.map((item) => item.id)} optionLabels={Object.fromEntries(anchors.map((item) => [item.id, displayName(item, locale)]))} invalid={invalid} />{selected && <small className="anchor-recovery">{translate(locale, "ui.recoverWillpowerSummary", { single: selected.singleWillpower, all: selected.allWillpower })}</small>}</div>;
}

export const vampireBuilder: GameLineBuilderModule = { Component: VampireCharacterBuilder };
