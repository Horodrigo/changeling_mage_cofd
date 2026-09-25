"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  CharacterBuilderShell,
  builderCurrentState,
  commonCreationIssues,
  experienceTraitDots,
  isCreationDraft,
  readLineArray,
  useCommonBuilderState,
  type BuilderValidationIssue,
} from "@/app/character-builder-shell";
import { Aspirations, CommonIdentityStep, TraitsStep } from "@/app/builder/common-controls";
import { COMMON_MERIT_CONFIGURATIONS, isCommonInlineMeritConfiguration } from "@/app/builder/common-merit-configurations";
import { MeritConfigurationEditor } from "@/app/builder/merit-configuration-editor";
import { MeritPicker } from "@/app/builder/merit-picker";
import type { CharacterSheet } from "@/lib/core/character/character-types";
import { normalizeMeritConfiguration } from "@/lib/core/character/merit-configuration";
import type { GameLineBuilderModule, GameLineBuilderProps } from "@/lib/game-line-contracts/game-line-ui";
import { useLanguage } from "@/lib/i18n";
import { mergeCreationMerits } from "@/lib/merit-progression";
import { meritSelectionProblems, type MeritDefinition, type MeritPrerequisiteContext } from "@/lib/merits";
import { createRandomId } from "@/lib/random-id";
import { activeMeritCatalog } from "@/lib/merit-homebrews";
import { useHomebrewPreferences } from "@/app/use-homebrew";
import { systemTerm } from "@/lib/system-terms";
import { mortalDerived } from "./creation-rules";
import { MortalExperiencePanel } from "./experience-panel";

function experienceSpecialties(initial: CharacterSheet | null | undefined) {
  const history = initial?.current_state.mortal_experience_history;
  if (!Array.isArray(history)) return [];
  return history.flatMap((entry) => {
    const undo = entry && typeof entry === "object" ? (entry as { undo?: Record<string, unknown> }).undo : undefined;
    return undo?.kind === "specialty" && typeof undo.skill === "string" && typeof undo.name === "string"
      ? [{ skill: undo.skill, name: undo.name }]
      : [];
  });
}

const BREAKING_POINT_KEYS = [
  "ui.breakingPointWorstThingDone",
  "ui.breakingPointWorstThingImaginedDoing",
  "ui.breakingPointWorstThingImaginedAnotherDoing",
  "ui.breakingPointForgotten",
  "ui.breakingPointMostTraumatic",
] as const;

const minimumRows = (values: string[], count: number) => {
  const result = [...values];
  while (result.length < count) result.push("");
  return result;
};

function MortalCharacterBuilder({ player, initial, onCancel, onSave, onSaveDraft, catalogs }: GameLineBuilderProps) {
  const { locale, t } = useLanguage();
  if (initial && initial.game_line !== "CofD") throw new Error("Mortal builder received a non-mortal character.");
  if (!catalogs) throw new Error("Mortal builder requires its catalog snapshot.");

  const common = useCommonBuilderState(initial, player, {
    experienceHistoryKey: "mortal_experience_history",
    purchasedSpecialties: experienceSpecialties(initial),
  });
  const homebrewPreferences = useHomebrewPreferences();
  const meritCatalog = activeMeritCatalog(catalogs.get<readonly MeritDefinition[]>("core-merits"), [], homebrewPreferences, initial?.merits.map((item) => item.name));
  const [age, setAge] = useState(String(initial?.line_data.age ?? ""));
  const [faction, setFaction] = useState(String(initial?.line_data.faction ?? ""));
  const [groupName, setGroupName] = useState(String(initial?.line_data.group_name ?? ""));
  const [virtue, setVirtue] = useState(String(initial?.line_data.virtue ?? ""));
  const [vice, setVice] = useState(String(initial?.line_data.vice ?? ""));
  const [breakingPoints, setBreakingPoints] = useState(() =>
    minimumRows(readLineArray(initial, "breaking_points", []), 5),
  );
  const meritSpent = common.merits.reduce((sum, merit) => sum + Math.max(0, Number(merit.dots) || 0), 0);
  const meritContext: MeritPrerequisiteContext = {
    gameLine: "CofD",
    archetypes: ["mortal"],
    attributes: common.attributes,
    skills: common.skills,
    size: 5,
    merits: mergeCreationMerits(initial?.merits, common.merits),
    meritCatalog,
    powers: [],
  };

  const issues = (() => {
    const result: BuilderValidationIssue[] = commonCreationIssues(common, {
      attributes: t("ui.attributes"),
      skills: t("ui.skills"),
      attributePriorities: t("ui.attributePriorities"),
      skillPriorities: t("ui.skillPriorities"),
      categoryLabel: (category) => systemTerm(category, locale),
    });
    const add = (step: number, key: string, label: string) => result.push({ step, key, label });
    if (!common.name.trim()) add(1, "name", t("ui.characterName"));
    if (!virtue.trim()) add(3, "virtue", t("ui.virtue"));
    if (!vice.trim()) add(3, "vice", t("ui.vice"));
    if (virtue.trim() && virtue.trim().toLocaleLowerCase() === vice.trim().toLocaleLowerCase())
      add(3, "anchors", t("ui.virtueAndViceMustDiffer"));
    if (meritSpent > 7) add(3, "merits", t("ui.meritsExceedTheLimit"));
    for (const merit of common.merits) {
      const definition = meritCatalog.find((item) => item.name === merit.name);
      if (definition) for (const message of meritSelectionProblems(definition, merit, meritContext))
        add(3, "merits", `${definition.name}: ${message}`);
    }
    return result;
  })();
  const missing = (key: string) => issues.some((issue) => issue.key === key);

  const buildCharacter = (source: CharacterSheet | null | undefined, draft: boolean) => {
    const now = new Date().toISOString();
    const finalAttributes = { ...common.attributes };
    const finalSkills = { ...common.skills };
    for (const [name, dots] of Object.entries(experienceTraitDots(source, "attributes", "mortal_experience_history")))
      finalAttributes[name] = Number(finalAttributes[name] ?? 1) + dots;
    for (const [name, dots] of Object.entries(experienceTraitDots(source, "skills", "mortal_experience_history")))
      finalSkills[name] = Number(finalSkills[name] ?? 0) + dots;
    const completed: CharacterSheet = {
      id: source?.id ?? createRandomId(),
      schema_version: 2,
      system: "chronicles-of-darkness",
      game_line: "CofD",
      ruleset: { id: "cofd-2e-embedded", version: 1 },
      character: {
        name: common.name.trim(),
        concept: common.concept.trim(),
        player: common.playerName.trim(),
        chronicle: common.chronicle.trim(),
      },
      attributes: finalAttributes,
      skills: finalSkills,
      specializations: [
        ...common.specialties
          .filter((specialty) => specialty.skill && specialty.name.trim())
          .map((specialty) => ({ skill: specialty.skill, name: specialty.name.trim() })),
        ...experienceSpecialties(source),
        ...(source?.specializations ?? []).filter((specialty) => Boolean(specialty.grantedBy)),
      ],
      merits: mergeCreationMerits(source?.merits, common.merits.map((merit) => {
        const definition = meritCatalog.find((item) => item.name === merit.name);
        return {
          ...merit,
          sourceId: definition?.sourceId,
          source: definition?.source,
          configuration: normalizeMeritConfiguration(merit.configuration),
        };
      })),
      line_data: {
        ...(source?.line_data ?? {}),
        age: age.trim(),
        faction: faction.trim(),
        group_name: groupName.trim(),
        virtue: virtue.trim(),
        vice: vice.trim(),
        aspirations: common.aspirations.map((value) => value.trim()).slice(0, 3),
        breaking_points: breakingPoints.map((value) => value.trim()),
        integrity: Number(source?.line_data.integrity ?? 7),
      },
      derived: { ...(source?.derived ?? {}) },
      current_state: builderCurrentState(source, draft, common.step, common.allowAdvancement),
      created_at: source?.created_at ?? now,
      updated_at: now,
    };
    completed.derived = mortalDerived(completed);
    return completed;
  };

  const finish = (draft: boolean, advancement?: CharacterSheet) => {
    if (!draft && issues.length) {
      common.setError(`${t("ui.stillRequired")}: ${issues.map((issue) => issue.label).join(", ")}.`);
      common.setStep(issues[0].step);
      return false;
    }
    (draft ? onSaveDraft : onSave)(buildCharacter(advancement ?? initial, draft));
    return true;
  };

  return <CharacterBuilderShell
    line="CofD"
    templateLabel={t("ui.mortalTemplate")}
    state={common}
    issues={issues}
    draft={!initial || isCreationDraft(initial)}
    onCancel={onCancel}
    onFinish={finish}
    prepareAdvancement={(previous) => buildCharacter(previous ?? initial, false)}
    renderAdvancement={(sheet, updateSheet) => <MortalExperiencePanel character={sheet} updateSheet={updateSheet} catalogs={catalogs} builderMode />}
    identity={<>
      <CommonIdentityStep name={common.name} setName={common.setName} nameLabel={t("ui.characterName")} concept={common.concept} setConcept={common.setConcept} player={common.playerName} setPlayer={common.setPlayerName} chronicle={common.chronicle} setChronicle={common.setChronicle} missing={missing} />
      <div className="builder-section mortal-identity-extra"><div className="identity-grid">
        <label>{t("ui.age")}<Input value={age} onChange={(event) => setAge(event.target.value)} /></label>
        <label>{t("ui.faction")}<Input value={faction} onChange={(event) => setFaction(event.target.value)} /></label>
        <label>{t("ui.groupName")}<Input value={groupName} onChange={(event) => setGroupName(event.target.value)} /></label>
      </div></div>
    </>}
    traits={<TraitsStep attributes={common.attributes} setAttributes={common.setAttributes} skills={common.skills} setSkills={common.setSkills} attributePriority={common.attributePriority} setAttributePriority={common.setAttributePriority} skillPriority={common.skillPriority} setSkillPriority={common.setSkillPriority} specialties={common.specialties} setSpecialties={common.setSpecialties} missing={missing} />}
    lineTemplate={<div className="builder-section mortal-template-step">
      <span className="kicker">{t("ui.step3MORTAL")}</span>
      <h2>{t("ui.mortalTemplate")}</h2>
      <div className={`form-grid${missing("anchors") ? " missing-field" : ""}`}>
        <label className={missing("virtue") ? "missing-field" : ""}>{t("ui.virtue")}<Input value={virtue} onChange={(event) => setVirtue(event.target.value)} /></label>
        <label className={missing("vice") ? "missing-field" : ""}>{t("ui.vice")}<Input value={vice} onChange={(event) => setVice(event.target.value)} /></label>
      </div>
      <Aspirations values={common.aspirations} setValues={common.setAspirations} />
      <section className={missing("breakingPoints") ? "breaking-point-builder missing-field block" : "breaking-point-builder"}>
        <h3>{t("ui.breakingPoints")}</h3>
        {BREAKING_POINT_KEYS.map((key, index) => <label key={key}>{t(key)}<Textarea value={breakingPoints[index] ?? ""} onChange={(event) => { const next = [...breakingPoints]; next[index] = event.target.value; setBreakingPoints(next); }} /></label>)}
      </section>
      <div className={missing("merits") ? "missing-field block" : ""}><MeritPicker merits={common.merits} setMerits={common.setMerits} catalog={meritCatalog} context={meritContext} spent={meritSpent} budget={7} renderConfiguration={({ merit, ownedMerits, inline, onChange }) => <MeritConfigurationEditor merit={merit} onChange={onChange} catalog={meritCatalog} ownedMerits={ownedMerits} inline={inline} definitions={COMMON_MERIT_CONFIGURATIONS} />} isInlineConfiguration={isCommonInlineMeritConfiguration} /></div>
    </div>}
  />;
}

export const mortalBuilder: GameLineBuilderModule = { Component: MortalCharacterBuilder };
