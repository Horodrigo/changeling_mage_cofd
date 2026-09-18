"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CharacterBuilderShell,
  commonCreationIssues,
  experienceTraitDots,
  useCommonBuilderState,
  type BuilderValidationIssue,
} from "@/app/character-builder-shell";
import { Aspirations, Choice, CommonIdentityStep, DotRow, TraitsStep } from "@/app/builder/common-controls";
import { MeritConfigurationEditor } from "@/app/builder/merit-configuration-editor";
import { MeritPicker } from "@/app/builder/merit-picker";
import { Input } from "@/components/ui/input";
import { ATTRIBUTES, SKILLS } from "@/lib/core/character/creation-rules";
import type { CharacterSheet } from "@/lib/core/character/character-types";
import { normalizeMeritConfiguration } from "@/lib/core/character/merit-configuration";
import type { GameLineBuilderModule, GameLineBuilderProps } from "@/lib/game-line-contracts/game-line-ui";
import { useLanguage, type Locale } from "@/lib/i18n";
import { mergeCreationMerits } from "@/lib/merit-progression";
import { meritSelectionProblems, type MeritDefinition, type MeritPrerequisiteContext } from "@/lib/merits";
import { createRandomId } from "@/lib/random-id";
import { systemTerm } from "@/lib/system-terms";
import type { VampireAnchorDefinition, VampireClanDefinition, VampireCovenantDefinition, VampirePowers, VampireReference } from "./catalog-types";
import { ORDO_MYSTERIES, recordRatings, stringArray, VAMPIRE_DISCIPLINES, vampireCovenantStatus, vampireDerived, vampireDisciplineDisplayName } from "./creation-rules";
import { isVampireInlineMeritConfiguration, VAMPIRE_MERIT_CONFIGURATIONS } from "./merit-configurations";

function initialCreationDisciplines(initial?: CharacterSheet | null) {
  return recordRatings(initial?.line_data.creation_disciplines ?? initial?.line_data.disciplines, VAMPIRE_DISCIPLINES, 5);
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

type TouchstoneMeritPoint = {
  key: string;
  meritInstanceId: string;
  dot: number;
  slot: number;
};

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
      points.push({
        key: `${meritInstanceId}:${dot}`,
        meritInstanceId,
        dot,
        slot,
      });
    }
  });

  return points;
}

function existingTouchstoneRows(initial?: CharacterSheet | null): Record<string, unknown>[] {
  const value = initial?.line_data.touchstones;
  if (!Array.isArray(value)) return [];
  return value.filter((row): row is Record<string, unknown> => Boolean(row) && typeof row === "object" && !Array.isArray(row));
}

function reconcileTouchstones(
  initial: CharacterSheet | null | undefined,
  merits: CharacterSheet["merits"],
  baseSlot: number,
  baseName: string,
): Record<string, unknown>[] {
  const rows = existingTouchstoneRows(initial);
  const baseRow = rows.find((row) => !String(row.merit_point_key ?? ""));
  const points = touchstoneMeritPoints(merits, baseSlot);
  const activePoints = new Map(points.map((point) => [point.key, point]));

  const nextRows: Record<string, unknown>[] = [{
    ...(baseRow ?? {}),
    id: String(baseRow?.id ?? createRandomId()),
    name: baseName.trim(),
    humanity_slot: baseSlot,
    notes: String(baseRow?.notes ?? ""),
  }];

  for (const row of rows) {
    const key = String(row.merit_point_key ?? "");
    if (!key) continue;

    const point = activePoints.get(key);
    if (!point) continue;

    nextRows.push({
      ...row,
      humanity_slot: point.slot,
      merit_point_key: point.key,
      merit_instance_id: point.meritInstanceId,
      merit_dot: point.dot,
    });
  }

  return nextRows;
}

function reconcileTraitAllocation(
  values: Record<string, number>,
  groups: Record<string, readonly string[]>,
  priorities: string[],
  base: number,
  budgets: readonly number[],
) {
  const next = { ...values };

  for (const [category, names] of Object.entries(groups)) {
    const priorityIndex = priorities.indexOf(category);
    if (priorityIndex < 0) continue;

    const budget = budgets[priorityIndex] ?? 0;
    let spent = names.reduce((sum, name) => sum + Math.max(0, Number(next[name] ?? base) - base), 0);

    // If the priority order changes after dots were assigned, keep as many
    // existing dots as possible while bringing the category back under its
    // new creation budget.
    for (let index = names.length - 1; spent > budget && index >= 0; index -= 1) {
      const name = names[index];
      const current = Math.max(base, Number(next[name] ?? base));
      const removable = Math.min(current - base, spent - budget);
      if (removable > 0) {
        next[name] = current - removable;
        spent -= removable;
      }
    }
  }

  return next;
}

function VampireCharacterBuilder({ player, initial, onCancel, onSave, catalogs }: GameLineBuilderProps) {
  const { locale, t } = useLanguage();
  if (initial && initial.game_line !== "VtR") throw new Error("Vampire builder received a non-Vampire character.");
  if (!catalogs) throw new Error("Vampire builder requires its catalog snapshot.");
  const reference = catalogs.get<VampireReference>("vampire-reference");
  const powers = catalogs.get<VampirePowers>("vampire-powers");
  const meritCatalog = useMemo(() => [
    ...catalogs.get<readonly MeritDefinition[]>("core-merits"),
    ...catalogs.get<readonly MeritDefinition[]>("vampire-merits"),
  ].sort((left, right) => left.translatedName.localeCompare(right.translatedName, "pt-BR")), [catalogs]);
  const common = useCommonBuilderState(initial, player, {
    experienceHistoryKey: "vampire_experience_history",
    purchasedSpecialties: experienceSpecialties(initial),
    adjustAttributes: (values) => {
      const favored = String(initial?.line_data.favored_attribute ?? "");
      if (favored && values[favored] > 1) values[favored] -= 1;
      return values;
    },
  });
  const [clanId, setClanId] = useState(String(initial?.line_data.clan_id ?? ""));
  const [favoredAttribute, setFavoredAttribute] = useState(String(initial?.line_data.favored_attribute ?? ""));
  const [covenantId, setCovenantId] = useState(String(initial?.line_data.covenant_id ?? "covenantless"));
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
  const covenantStatus = selectedCovenant ? vampireCovenantStatus({ merits: common.merits }, covenantId, selectedCovenant.name, selectedCovenant.translatedName) : 0;
  const covenantPowerOptions = covenantId === "circle-of-the-crone" ? powers.cruacRites.filter((item) => item.rating === 1) : covenantId === "lancea-et-sanctum" ? powers.thebanMiracles.filter((item) => item.rating === 1) : covenantId === "ordo-dracul" && mysteryId ? powers.coils.filter((item) => item.id === `coil-${mysteryId}`) : [];
  const hasCreationCovenantPower = covenantPowerOptions.some((item) => item.id === creationCovenantPowerId);
  const disciplineDots = Object.values(disciplines).reduce((sum, value) => sum + value, 0);
  const inClanDots = selectedClan?.disciplines.reduce((sum, name) => sum + Number(disciplines[name] ?? 0), 0) ?? 0;
  const meritSpent = common.merits.reduce((sum, merit) => sum + Number(merit.dots ?? 0), 0);
  const meritBudget = Math.max(0, 10 - (bloodPotency - 1) * 5);
  const maxBloodPotency = Math.max(1, Math.min(3, 1 + Math.floor(Math.max(0, 10 - meritSpent) / 5)));
  const setAttributePriority = (priorities: string[]) => {
    common.setAttributePriority(priorities);
    common.setAttributes((values) => reconcileTraitAllocation(values, ATTRIBUTES, priorities, 1, [5, 4, 3]));
  };
  const setSkillPriority = (priorities: string[]) => {
    common.setSkillPriority(priorities);
    common.setSkills((values) => reconcileTraitAllocation(values, SKILLS, priorities, 0, [11, 7, 4]));
  };

  const meritContext: MeritPrerequisiteContext = {
    gameLine: "VtR", archetypes: ["vampire", clanId, covenantId], attributes: common.attributes,
    skills: common.skills, merits: mergeCreationMerits(initial?.merits, common.merits), meritCatalog,
    powers: Object.entries(disciplines).filter(([, value]) => value > 0).map(([name]) => name),
  };
  const issues = (() => {
    const result: BuilderValidationIssue[] = commonCreationIssues(common, {
      attributes: t("ui.attributes"), skills: t("ui.skills"),
      attributePriorities: t("ui.attributePriorities"),
      skillPriorities: t("ui.skillPriorities"),
      categoryLabel: (category) => systemTerm(category, locale),
    });
    const add = (key: string, label: string, step = 3) => result.push({ step, key, label });
    if (!common.name.trim()) add("name", t("ui.name"), 1);
    if (!selectedClan) add("clan", t("ui.clan"));
    if (!selectedClan?.favoredAttributes.includes(favoredAttribute)) add("favoredAttribute", t("ui.clanFavoredAttribute"));
    if (!reference.covenants.some((item) => item.id === covenantId)) add("covenant", "Covenant");
    if (!reference.anchors.some((item) => item.id === maskId)) add("mask", "Mask");
    if (!reference.anchors.some((item) => item.id === dirgeId) || dirgeId === maskId) add("dirge", t("ui.dirgeDistinctFromMask"));
    if (!touchstone.trim()) add("touchstone", "Touchstone");
    if (disciplineDots !== (hasCreationCovenantPower ? 2 : 3) || inClanDots < 2) add("disciplines", hasCreationCovenantPower ? t("ui.message2InClanDisciplineDotsPlus1Converted") : t("ui.message3DisciplineDotsAtLeast2InClan"));
    const protean = Number(disciplines.Protean ?? 0);
    if (protean >= 2 && proteanAspects.filter((value) => value.trim()).length !== 3) add("protean", t("ui.threePredatoryAspectAdaptations"));
    if (protean >= 3 && !proteanForms.some((value) => value.trim())) add("protean", t("ui.beastSSkinForm"));
    if (protean >= 4 && proteanUnnatural.filter((value) => value.trim()).length !== 3) add("protean", t("ui.threeUnnaturalAspectAdaptations"));
    if (covenantId === "ordo-dracul" && !ORDO_MYSTERIES.includes(mysteryId as (typeof ORDO_MYSTERIES)[number])) add("mystery", t("ui.ordoDraculMystery"));
    if (creationCovenantPowerId && (!hasCreationCovenantPower || covenantStatus < 1)) add("covenantPower", t("ui.covenantPowerRequiresKindredStatus1InThe"));
    if (meritSpent > meritBudget) add("merits", t("ui.meritsExceedTheLimit"));
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
    if (!nosferatuEasterEgg) return;

    const timeout = window.setTimeout(() => {
      setNosferatuEasterEgg(false);
    }, 15000);

    const prevent = (event: Event) => {
      event.preventDefault();
      event.stopPropagation();
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    window.addEventListener("keydown", prevent, true);
    window.addEventListener("wheel", prevent, {
      passive: false,
      capture: true,
    });
    window.addEventListener("touchmove", prevent, {
      passive: false,
      capture: true,
    });

    return () => {
      window.clearTimeout(timeout);

      document.body.style.overflow = previousOverflow;

      window.removeEventListener("keydown", prevent, true);
      window.removeEventListener("wheel", prevent, true);
      window.removeEventListener("touchmove", prevent, true);
    };
  }, [nosferatuEasterEgg]);

  const chooseClan = (value: string) => {
  setClanId(value);

  const clan = reference.clans.find((item) => item.id === value);

  if (!clan?.favoredAttributes.includes(favoredAttribute)) {
    setFavoredAttribute("");
  }

  if (value === "nosferatu") {
    setNosferatuEasterEgg(true);
  }
};
  const finish = () => {
    if (issues.length) {
      common.setError(`${t("ui.stillRequired")}: ${issues.map((issue) => issue.label).join(", ")}.`);
      common.setStep(issues[0].step);
      return;
    }
    const advancement = disciplineAdvancement(initial);
    const finalDisciplines = Object.fromEntries(VAMPIRE_DISCIPLINES.map((name) => [name, disciplines[name] + advancement[name]]));
    const bpAdvancement = Math.max(0, Number(initial?.line_data.blood_potency ?? 1) - Number(initial?.line_data.creation_blood_potency ?? initial?.line_data.blood_potency ?? 1));
    const finalBloodPotency = Math.min(10, bloodPotency + bpAdvancement);
    const finalAttributes = { ...common.attributes, [favoredAttribute]: Math.min(5, Number(common.attributes[favoredAttribute] ?? 1) + 1) };
    for (const [name, dots] of Object.entries(experienceTraitDots(initial, "attributes", "vampire_experience_history"))) finalAttributes[name] = Number(finalAttributes[name] ?? 1) + dots;
    const finalSkills = { ...common.skills };
    for (const [name, dots] of Object.entries(experienceTraitDots(initial, "skills", "vampire_experience_history"))) finalSkills[name] = Number(finalSkills[name] ?? 0) + dots;
    const now = new Date().toISOString();
    const touchstoneSlot = clanId === "ventrue" ? 7 : 6;
    const existingBloodSorcery = initial?.line_data.blood_sorcery && typeof initial.line_data.blood_sorcery === "object" && !Array.isArray(initial.line_data.blood_sorcery) ? initial.line_data.blood_sorcery as Record<string, unknown> : {};
    const existingCoils = initialOrdo.coil_ratings && typeof initialOrdo.coil_ratings === "object" && !Array.isArray(initialOrdo.coil_ratings) ? initialOrdo.coil_ratings as Record<string, unknown> : {};
    const startingRite = powers.cruacRites.some((item) => item.id === creationCovenantPowerId);
    const startingMiracle = powers.thebanMiracles.some((item) => item.id === creationCovenantPowerId);
    const startingCoil = powers.coils.some((item) => item.id === creationCovenantPowerId);
    const bloodSorcery = initial ? existingBloodSorcery : startingRite ? { cruac_rating: 1, cruac_rite_ids: [creationCovenantPowerId], theban_rating: 0, theban_miracle_ids: [] } : startingMiracle ? { cruac_rating: 0, cruac_rite_ids: [], theban_rating: 1, theban_miracle_ids: [creationCovenantPowerId] } : {};
    const ordoDracul = { ...initialOrdo, mystery_id: covenantId === "ordo-dracul" ? mysteryId : initialOrdo.mystery_id ?? "", coil_ratings: initial ? existingCoils : startingCoil ? { [creationCovenantPowerId]: 1 } : {} };
    const finalMerits = mergeCreationMerits(initial?.merits, common.merits.map((merit) => {
      const definition = meritCatalog.find((item) => item.name === merit.name);
      return { ...merit, sourceId: definition?.sourceId, source: definition?.source, configuration: normalizeMeritConfiguration(merit.configuration) };
    }));
    const finalTouchstones = reconcileTouchstones(initial, finalMerits, touchstoneSlot, touchstone);
    const completed: CharacterSheet = {
      id: initial?.id ?? createRandomId(), schema_version: 2, system: "chronicles-of-darkness", game_line: "VtR",
      ruleset: { id: "vtr-2ed-embedded", version: 1 },
      character: { name: common.name.trim(), concept: common.concept.trim(), player: common.playerName.trim(), chronicle: common.chronicle.trim() },
      attributes: finalAttributes, skills: finalSkills,
      specializations: [
        ...common.specialties.filter((item) => item.skill && item.name.trim()).map((item) => ({ skill: item.skill, name: item.name.trim() })),
        ...experienceSpecialties(initial),
        ...(initial?.specializations ?? []).filter((item) => typeof item !== "string" && Boolean(item.grantedBy)),
      ],
      merits: finalMerits,
      line_data: {
        ...(initial?.line_data ?? {}), clan_id: clanId, favored_attribute: favoredAttribute, covenant_id: covenantId,
        mask_id: maskId, dirge_id: dirgeId, aspirations: common.aspirations.map((item) => item.trim()).filter(Boolean),
        creation_blood_potency: bloodPotency, blood_potency: finalBloodPotency, creation_covenant_power_id: hasCreationCovenantPower ? creationCovenantPowerId : "",
        creation_disciplines: disciplines, disciplines: finalDisciplines, humanity: Number(initial?.line_data.humanity ?? 7),
        discipline_choices: {
          ...initialChoices,
          protean_aspects: proteanAspects.map((value) => value.trim()).filter(Boolean),
          protean_forms: proteanForms.map((value) => value.trim()).filter(Boolean),
          protean_unnatural_aspect: proteanUnnatural.map((value) => value.trim()).filter(Boolean),
        },
        touchstones: finalTouchstones,
        devotion_ids: initial?.line_data.devotion_ids ?? [], blood_sorcery: bloodSorcery, ordo_dracul: ordoDracul, banes: initial?.line_data.banes ?? [],
      },
      derived: vampireDerived(finalAttributes, finalSkills, finalDisciplines, finalBloodPotency, reference),
      current_state: initial?.current_state ?? {}, created_at: initial?.created_at ?? now, updated_at: now,
    };
    onSave(completed);
  };
  return (
    <>
    {nosferatuEasterEgg && (
      <div className="nosferatu-easter-egg">
        <video
          src="/vampire/easter-eggs/nosferatu.webm"
          autoPlay
          playsInline
          controls={false}
          disablePictureInPicture
        />
      </div>
    )}
  
  <CharacterBuilderShell line="VtR" templateLabel={t("ui.vampireTemplate")} state={common} issues={issues} onCancel={onCancel} onFinish={finish}
    identity={<CommonIdentityStep name={common.name} setName={common.setName} nameLabel={t("ui.name")} concept={common.concept} setConcept={common.setConcept} player={common.playerName} setPlayer={common.setPlayerName} chronicle={common.chronicle} setChronicle={common.setChronicle} missing={missing} />}
    traits={<TraitsStep attributes={common.attributes} setAttributes={common.setAttributes} skills={common.skills} setSkills={common.setSkills} attributePriority={common.attributePriority} setAttributePriority={setAttributePriority} skillPriority={common.skillPriority} setSkillPriority={setSkillPriority} specialties={common.specialties} setSpecialties={common.setSpecialties} missing={missing} />}
    lineTemplate={<div className="builder-section vampire-builder-template">
      <span className="kicker">{t("ui.step3VAMPIRE")}</span><h2>{t("ui.vampireTemplate")}</h2>
      <div className="vampire-template-grid">
        <SelectionCards title={t("ui.clan")} items={reference.clans} value={clanId} onChange={chooseClan} locale={locale} invalid={missing("clan")} disciplineCatalog={powers.disciplines} />
        <SelectionCards title="Covenant" items={reference.covenants} value={covenantId} onChange={(value) => { setCovenantId(value); setCreationCovenantPowerId(""); if (value !== "ordo-dracul") setMysteryId(""); }} locale={locale} invalid={missing("covenant")} disciplineCatalog={powers.disciplines} />
      </div>
      {selectedClan && <div className={missing("favoredAttribute") ? "missing-field block" : ""}><Choice label={t("ui.favoredAttribute1")} value={favoredAttribute} setValue={setFavoredAttribute} options={selectedClan.favoredAttributes} optionLabels={Object.fromEntries(selectedClan.favoredAttributes.map((item) => [item, systemTerm(item, locale)]))} /></div>}
      <div className="vampire-anchor-grid">
        <AnchorChoice label="Mask" value={maskId} setValue={setMaskId} anchors={reference.anchors} locale={locale} invalid={missing("mask")} />
        <AnchorChoice label="Dirge" value={dirgeId} setValue={setDirgeId} anchors={reference.anchors.filter((item) => item.id !== maskId)} locale={locale} invalid={missing("dirge")} />
      </div>
      <label className={missing("touchstone") ? "missing-field" : ""}>Touchstone<Input value={touchstone} onChange={(event) => setTouchstone(event.target.value)} /></label>
      <h3>{t("ui.disciplines3Dots")}</h3>
      <div className={`vampire-discipline-grid${missing("disciplines") ? " missing-field" : ""}`}>{powers.disciplines.map((discipline) => <DotRow key={discipline.name} name={displayName(discipline, locale)} value={disciplines[discipline.name] ?? 0} min={0} max={3} canIncrease={disciplineDots < (hasCreationCovenantPower ? 2 : 3)} setValue={(value) => setDisciplines({ ...disciplines, [discipline.name]: value })} tag={selectedClan?.disciplines.includes(discipline.name) ? t("ui.inClan") : undefined} />)}</div>
      <p className="rule-callout">{t("ui.allocate3DotsAtLeast2MustBelong")}</p>
      {Number(disciplines.Protean ?? 0) >= 2 && <div className={`vampire-protean-builder${missing("protean") ? " missing-field block" : ""}`}><h3>{t("ui.proteanChoices")}</h3><ChoiceLines label="Predatory Aspect" values={proteanAspects} count={3} placeholder={t("ui.animalAdaptation")} onChange={setProteanAspects} />{Number(disciplines.Protean ?? 0) >= 3 && <ChoiceLines label="Beast's Skin" values={proteanForms} count={1} placeholder={t("ui.animalForm")} onChange={setProteanForms} />}{Number(disciplines.Protean ?? 0) >= 4 && <ChoiceLines label="Unnatural Aspect" values={proteanUnnatural} count={3} placeholder={t("ui.monstrousAdaptation")} onChange={setProteanUnnatural} />}</div>}
      {covenantId === "ordo-dracul" && <div className={missing("mystery") ? "missing-field block" : ""}><Choice label="Mystery" value={mysteryId} setValue={(value) => { setMysteryId(value); setCreationCovenantPowerId(""); }} options={[...ORDO_MYSTERIES]} optionLabels={{ ascendant: t("ui.ascendant"), wyrm: t("ui.wyrm"), voivode: t("ui.voivode") }} /></div>}
      {covenantPowerOptions.length > 0 && <div className={missing("covenantPower") ? "missing-field block" : ""}><Choice label={t("ui.optionalConversionOf1DisciplineDot")} value={creationCovenantPowerId || "__none"} setValue={(value) => setCreationCovenantPowerId(value === "__none" ? "" : value)} options={["__none", ...covenantPowerOptions.map((item) => item.id)]} optionLabels={{ __none: t("ui.doNotConvert"), ...Object.fromEntries(covenantPowerOptions.map((item) => [item.id, displayName(item, locale)])) }} /><small className="anchor-recovery">{covenantStatus >= 1 ? t("ui.availableThroughKindredStatusInTheCovenant") : t("ui.requiresKindredStatus1ConfiguredForThisCovenant")}</small></div>}
      <Aspirations values={common.aspirations} setValues={common.setAspirations} />
      <div className={missing("merits") ? "missing-field block" : ""}><MeritPicker merits={common.merits} setMerits={common.setMerits} catalog={[...meritCatalog]} context={meritContext} spent={meritSpent} budget={meritBudget} powerLabel={t("ui.bloodPotency")} power={bloodPotency} setPower={(value) => setBloodPotency(Math.min(maxBloodPotency, value))} renderConfiguration={({ merit, ownedMerits, inline, onChange }) => <MeritConfigurationEditor merit={merit} onChange={onChange} catalog={[...meritCatalog]} ownedMerits={ownedMerits} inline={inline} definitions={VAMPIRE_MERIT_CONFIGURATIONS} />} isInlineConfiguration={isVampireInlineMeritConfiguration} /></div>
    </div>}
  />
  </>);
}

function ChoiceLines({ label, values, count, placeholder, onChange }: { label: string; values: string[]; count: number; placeholder: string; onChange: (value: string[]) => void }) {
  const rows = Array.from({ length: count }, (_, index) => values[index] ?? "");
  return <fieldset><legend>{label}</legend>{rows.map((value, index) => <Input key={index} value={value} placeholder={`${placeholder} ${index + 1}`} onChange={(event) => { const next = [...rows]; next[index] = event.target.value; onChange(next); }} />)}</fieldset>;
}

function SelectionCards<T extends VampireClanDefinition | VampireCovenantDefinition>({ title, items, value, onChange, locale, invalid, disciplineCatalog }: { title: string; items: readonly T[]; value: string; onChange: (value: string) => void; locale: Locale; invalid: boolean; disciplineCatalog: VampirePowers["disciplines"] }) {
  return <section className={invalid ? "vampire-card-selector missing-field" : "vampire-card-selector"}><h3>{title}</h3><div>{items.map((item) => <button type="button" key={item.id} className={value === item.id ? "selected" : ""} onClick={() => onChange(item.id)}><strong>{displayName(item, locale)}</strong><small>{"disciplines" in item ? item.disciplines.map((discipline) => vampireDisciplineDisplayName(discipline, disciplineCatalog, locale)).join(" · ") : item.advantage}</small></button>)}</div></section>;
}

function AnchorChoice({ label, value, setValue, anchors, locale, invalid }: { label: string; value: string; setValue: (value: string) => void; anchors: VampireAnchorDefinition[]; locale: string; invalid: boolean }) {
  const selected = anchors.find((item) => item.id === value);
  return <div><Choice label={label} value={value} setValue={setValue} options={anchors.map((item) => item.id)} optionLabels={Object.fromEntries(anchors.map((item) => [item.id, displayName(item, locale)]))} invalid={invalid} />{selected && <small className="anchor-recovery">{selected.singleWillpower}</small>}</div>;
}

export const vampireBuilder: GameLineBuilderModule = { Component: VampireCharacterBuilder };
