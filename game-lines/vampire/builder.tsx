"use client";

import { useMemo, useState } from "react";
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
import type { CharacterSheet } from "@/lib/core/character/character-types";
import { normalizeMeritConfiguration } from "@/lib/core/character/merit-configuration";
import type { GameLineBuilderModule, GameLineBuilderProps } from "@/lib/game-line-contracts/game-line-ui";
import { useLanguage } from "@/lib/i18n";
import { mergeCreationMerits } from "@/lib/merit-progression";
import { meritSelectionProblems, type MeritDefinition, type MeritPrerequisiteContext } from "@/lib/merits";
import { createRandomId } from "@/lib/random-id";
import { systemTerm } from "@/lib/system-terms";
import type { VampireAnchorDefinition, VampireClanDefinition, VampireCovenantDefinition, VampirePowers, VampireReference } from "./catalog-types";
import { ORDO_MYSTERIES, recordRatings, stringArray, VAMPIRE_DISCIPLINES, vampireCovenantStatus, vampireDerived } from "./creation-rules";
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

function VampireCharacterBuilder({ player, initial, onCancel, onSave, catalogs }: GameLineBuilderProps) {
  const { locale, tr } = useLanguage();
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
  const [touchstone, setTouchstone] = useState(String((initial?.line_data.touchstones as Array<{ name?: string }> | undefined)?.[0]?.name ?? ""));
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
  const meritContext: MeritPrerequisiteContext = {
    gameLine: "VtR", archetypes: ["vampire", clanId, covenantId], attributes: common.attributes,
    skills: common.skills, merits: mergeCreationMerits(initial?.merits, common.merits), meritCatalog,
    powers: Object.entries(disciplines).filter(([, value]) => value > 0).map(([name]) => name),
  };
  const issues = (() => {
    const result: BuilderValidationIssue[] = commonCreationIssues(common, {
      attributes: tr("Atributos", "Attributes"), skills: tr("Perícias", "Skills"),
      attributePriorities: tr("Prioridades de Atributos", "Attribute priorities"),
      skillPriorities: tr("Prioridades de Perícias", "Skill priorities"),
      categoryLabel: (category) => systemTerm(category, locale),
    });
    const add = (key: string, label: string, step = 3) => result.push({ step, key, label });
    if (!common.name.trim()) add("name", tr("Nome", "Name"), 1);
    if (common.specialties.filter((item) => item.skill && item.name.trim()).length !== 3) add("specialties", tr("Três Especializações", "Three Specialties"), 2);
    if (common.aspirations.filter((item) => item.trim()).length !== 3) add("aspirations", tr("Três Aspirações", "Three Aspirations"));
    if (!selectedClan) add("clan", tr("Clã", "Clan"));
    if (!selectedClan?.favoredAttributes.includes(favoredAttribute)) add("favoredAttribute", tr("Atributo favorecido do Clã", "Clan favored Attribute"));
    if (!reference.covenants.some((item) => item.id === covenantId)) add("covenant", "Covenant");
    if (!reference.anchors.some((item) => item.id === maskId)) add("mask", "Mask");
    if (!reference.anchors.some((item) => item.id === dirgeId) || dirgeId === maskId) add("dirge", tr("Dirge diferente de Mask", "Dirge distinct from Mask"));
    if (!touchstone.trim()) add("touchstone", "Touchstone");
    if (disciplineDots !== (hasCreationCovenantPower ? 2 : 3) || inClanDots < 2) add("disciplines", hasCreationCovenantPower ? tr("2 pontos de Disciplinas do Clã mais 1 ponto convertido", "2 in-Clan Discipline dots plus 1 converted dot") : tr("3 pontos de Disciplinas, ao menos 2 no Clã", "3 Discipline dots, at least 2 in Clan"));
    const protean = Number(disciplines.Protean ?? 0);
    if (protean >= 2 && proteanAspects.filter((value) => value.trim()).length !== 3) add("protean", tr("Três adaptações de Predatory Aspect", "Three Predatory Aspect adaptations"));
    if (protean >= 3 && !proteanForms.some((value) => value.trim())) add("protean", tr("Forma de Beast's Skin", "Beast's Skin form"));
    if (protean >= 4 && proteanUnnatural.filter((value) => value.trim()).length !== 3) add("protean", tr("Três adaptações de Unnatural Aspect", "Three Unnatural Aspect adaptations"));
    if (covenantId === "ordo-dracul" && !ORDO_MYSTERIES.includes(mysteryId as (typeof ORDO_MYSTERIES)[number])) add("mystery", tr("Mystery da Ordo Dracul", "Ordo Dracul Mystery"));
    if (creationCovenantPowerId && (!hasCreationCovenantPower || covenantStatus < 1)) add("covenantPower", tr("Poder de Covenant requer Kindred Status 1 no Covenant escolhido", "Covenant power requires Kindred Status 1 in the chosen Covenant"));
    if (meritSpent > meritBudget) add("merits", tr("Méritos acima do limite", "Merits exceed the limit"));
    for (const merit of common.merits) {
      const definition = meritCatalog.find((item) => item.name === merit.name);
      if (definition) for (const message of meritSelectionProblems(definition, merit, meritContext)) add("merits", `${displayName(definition, locale)}: ${message}`);
      if (merit.name === "Kindred Status" && !String(merit.configuration?.group ?? "").trim()) add("merits", tr("Kindred Status exige um Clã, Covenant ou cidade", "Kindred Status requires a Clan, Covenant, or city"));
    }
    return result;
  })();
  const missing = (key: string) => issues.some((issue) => issue.key === key);
  const chooseClan = (value: string) => {
    setClanId(value);
    const clan = reference.clans.find((item) => item.id === value);
    if (!clan?.favoredAttributes.includes(favoredAttribute)) setFavoredAttribute("");
  };
  const finish = () => {
    if (issues.length) {
      common.setError(`${tr("Ainda falta", "Still required")}: ${issues.map((issue) => issue.label).join(", ")}.`);
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
      merits: mergeCreationMerits(initial?.merits, common.merits.map((merit) => {
        const definition = meritCatalog.find((item) => item.name === merit.name);
        return { ...merit, sourceId: definition?.sourceId, source: definition?.source, configuration: normalizeMeritConfiguration(merit.configuration) };
      })),
      line_data: {
        ...(initial?.line_data ?? {}), clan_id: clanId, favored_attribute: favoredAttribute, covenant_id: covenantId,
        mask_id: maskId, dirge_id: dirgeId, aspirations: common.aspirations.map((item) => item.trim()),
        creation_blood_potency: bloodPotency, blood_potency: finalBloodPotency, creation_covenant_power_id: hasCreationCovenantPower ? creationCovenantPowerId : "",
        creation_disciplines: disciplines, disciplines: finalDisciplines, humanity: Number(initial?.line_data.humanity ?? 7),
        discipline_choices: {
          ...initialChoices,
          protean_aspects: proteanAspects.map((value) => value.trim()).filter(Boolean),
          protean_forms: proteanForms.map((value) => value.trim()).filter(Boolean),
          protean_unnatural_aspect: proteanUnnatural.map((value) => value.trim()).filter(Boolean),
        },
        touchstones: [{ id: String((initial?.line_data.touchstones as Array<{ id?: string }> | undefined)?.[0]?.id ?? createRandomId()), name: touchstone.trim(), humanity_slot: touchstoneSlot, notes: "" }],
        devotion_ids: initial?.line_data.devotion_ids ?? [], blood_sorcery: bloodSorcery, ordo_dracul: ordoDracul, banes: initial?.line_data.banes ?? [],
      },
      derived: vampireDerived(finalAttributes, finalSkills, finalDisciplines, finalBloodPotency, reference),
      current_state: initial?.current_state ?? {}, created_at: initial?.created_at ?? now, updated_at: now,
    };
    onSave(completed);
  };
  return <CharacterBuilderShell line="VtR" templateLabel={tr("Modelo Vampírico", "Vampire Template")} state={common} issues={issues} onCancel={onCancel} onFinish={finish}
    identity={<CommonIdentityStep name={common.name} setName={common.setName} nameLabel={tr("Nome", "Name")} concept={common.concept} setConcept={common.setConcept} player={common.playerName} setPlayer={common.setPlayerName} chronicle={common.chronicle} setChronicle={common.setChronicle} missing={missing} />}
    traits={<TraitsStep attributes={common.attributes} setAttributes={common.setAttributes} skills={common.skills} setSkills={common.setSkills} attributePriority={common.attributePriority} setAttributePriority={common.setAttributePriority} skillPriority={common.skillPriority} setSkillPriority={common.setSkillPriority} specialties={common.specialties} setSpecialties={common.setSpecialties} missing={missing} />}
    lineTemplate={<div className="builder-section vampire-builder-template">
      <span className="kicker">{tr("PASSO 3 · VAMPIRO", "STEP 3 · VAMPIRE")}</span><h2>{tr("Modelo Vampírico", "Vampire Template")}</h2>
      <div className="vampire-template-grid">
        <SelectionCards title={tr("Clã", "Clan")} items={reference.clans} value={clanId} onChange={chooseClan} locale={locale} invalid={missing("clan")} />
        <SelectionCards title="Covenant" items={reference.covenants} value={covenantId} onChange={(value) => { setCovenantId(value); setCreationCovenantPowerId(""); if (value !== "ordo-dracul") setMysteryId(""); }} locale={locale} invalid={missing("covenant")} />
      </div>
      {selectedClan && <div className={missing("favoredAttribute") ? "missing-field block" : ""}><Choice label={tr("Atributo favorecido (+1)", "Favored Attribute (+1)")} value={favoredAttribute} setValue={setFavoredAttribute} options={selectedClan.favoredAttributes} optionLabels={Object.fromEntries(selectedClan.favoredAttributes.map((item) => [item, systemTerm(item, locale)]))} /></div>}
      <div className="vampire-anchor-grid">
        <AnchorChoice label="Mask" value={maskId} setValue={setMaskId} anchors={reference.anchors} locale={locale} invalid={missing("mask")} />
        <AnchorChoice label="Dirge" value={dirgeId} setValue={setDirgeId} anchors={reference.anchors.filter((item) => item.id !== maskId)} locale={locale} invalid={missing("dirge")} />
      </div>
      <label className={missing("touchstone") ? "missing-field" : ""}>Touchstone<Input value={touchstone} onChange={(event) => setTouchstone(event.target.value)} /></label>
      <h3>{tr("Disciplinas · 3 pontos", "Disciplines · 3 dots")}</h3>
      <div className={`vampire-discipline-grid${missing("disciplines") ? " missing-field" : ""}`}>{powers.disciplines.map((discipline) => <DotRow key={discipline.name} name={displayName(discipline, locale)} value={disciplines[discipline.name] ?? 0} min={0} max={3} canIncrease={disciplineDots < (hasCreationCovenantPower ? 2 : 3)} setValue={(value) => setDisciplines({ ...disciplines, [discipline.name]: value })} tag={selectedClan?.disciplines.includes(discipline.name) ? tr("do Clã", "in-Clan") : undefined} />)}</div>
      <p className="rule-callout">{tr("Distribua 3 pontos; ao menos 2 devem pertencer às Disciplinas do Clã.", "Allocate 3 dots; at least 2 must belong to the Clan Disciplines.")}</p>
      {Number(disciplines.Protean ?? 0) >= 2 && <div className={`vampire-protean-builder${missing("protean") ? " missing-field block" : ""}`}><h3>{tr("Escolhas de Protean", "Protean Choices")}</h3><ChoiceLines label="Predatory Aspect" values={proteanAspects} count={3} placeholder={tr("Adaptação animal", "Animal adaptation")} onChange={setProteanAspects} />{Number(disciplines.Protean ?? 0) >= 3 && <ChoiceLines label="Beast's Skin" values={proteanForms} count={1} placeholder={tr("Forma animal", "Animal form")} onChange={setProteanForms} />}{Number(disciplines.Protean ?? 0) >= 4 && <ChoiceLines label="Unnatural Aspect" values={proteanUnnatural} count={3} placeholder={tr("Aspecto monstruoso", "Monstrous adaptation")} onChange={setProteanUnnatural} />}</div>}
      {covenantId === "ordo-dracul" && <div className={missing("mystery") ? "missing-field block" : ""}><Choice label="Mystery" value={mysteryId} setValue={(value) => { setMysteryId(value); setCreationCovenantPowerId(""); }} options={[...ORDO_MYSTERIES]} optionLabels={{ ascendant: tr("Ascendente", "Ascendant"), wyrm: tr("Serpente", "Wyrm"), voivode: tr("Voivoda", "Voivode") }} /></div>}
      {covenantPowerOptions.length > 0 && <div className={missing("covenantPower") ? "missing-field block" : ""}><Choice label={tr("Conversão opcional de 1 ponto de Disciplina", "Optional conversion of 1 Discipline dot")} value={creationCovenantPowerId || "__none"} setValue={(value) => setCreationCovenantPowerId(value === "__none" ? "" : value)} options={["__none", ...covenantPowerOptions.map((item) => item.id)]} optionLabels={{ __none: tr("Não converter", "Do not convert"), ...Object.fromEntries(covenantPowerOptions.map((item) => [item.id, displayName(item, locale)])) }} /><small className="anchor-recovery">{covenantStatus >= 1 ? tr("Disponível por Kindred Status no Covenant.", "Available through Kindred Status in the Covenant.") : tr("Exige Kindred Status 1 configurado para este Covenant.", "Requires Kindred Status 1 configured for this Covenant.")}</small></div>}
      <Aspirations values={common.aspirations} setValues={common.setAspirations} />
      <div className={missing("merits") ? "missing-field block" : ""}><MeritPicker merits={common.merits} setMerits={common.setMerits} catalog={[...meritCatalog]} context={meritContext} spent={meritSpent} budget={meritBudget} powerLabel={tr("Potência de Sangue", "Blood Potency")} power={bloodPotency} setPower={(value) => setBloodPotency(Math.min(maxBloodPotency, value))} renderConfiguration={({ merit, ownedMerits, inline, onChange }) => <MeritConfigurationEditor merit={merit} onChange={onChange} catalog={[...meritCatalog]} ownedMerits={ownedMerits} inline={inline} definitions={VAMPIRE_MERIT_CONFIGURATIONS} />} isInlineConfiguration={isVampireInlineMeritConfiguration} /></div>
    </div>}
  />;
}

function ChoiceLines({ label, values, count, placeholder, onChange }: { label: string; values: string[]; count: number; placeholder: string; onChange: (value: string[]) => void }) {
  const rows = Array.from({ length: count }, (_, index) => values[index] ?? "");
  return <fieldset><legend>{label}</legend>{rows.map((value, index) => <Input key={index} value={value} placeholder={`${placeholder} ${index + 1}`} onChange={(event) => { const next = [...rows]; next[index] = event.target.value; onChange(next); }} />)}</fieldset>;
}

function SelectionCards<T extends VampireClanDefinition | VampireCovenantDefinition>({ title, items, value, onChange, locale, invalid }: { title: string; items: readonly T[]; value: string; onChange: (value: string) => void; locale: string; invalid: boolean }) {
  return <section className={invalid ? "vampire-card-selector missing-field" : "vampire-card-selector"}><h3>{title}</h3><div>{items.map((item) => <button type="button" key={item.id} className={value === item.id ? "selected" : ""} onClick={() => onChange(item.id)}><strong>{displayName(item, locale)}</strong><small>{"disciplines" in item ? item.disciplines.join(" · ") : item.advantage}</small></button>)}</div></section>;
}

function AnchorChoice({ label, value, setValue, anchors, locale, invalid }: { label: string; value: string; setValue: (value: string) => void; anchors: VampireAnchorDefinition[]; locale: string; invalid: boolean }) {
  const selected = anchors.find((item) => item.id === value);
  return <div><Choice label={label} value={value} setValue={setValue} options={anchors.map((item) => item.id)} optionLabels={Object.fromEntries(anchors.map((item) => [item.id, displayName(item, locale)]))} invalid={invalid} />{selected && <small className="anchor-recovery">{selected.singleWillpower}</small>}</div>;
}

export const vampireBuilder: GameLineBuilderModule = { Component: VampireCharacterBuilder };
