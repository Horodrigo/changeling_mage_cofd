"use client";

import { useState, type ReactNode } from "react";
import { ArrowLeft, ArrowRight, Check, Save } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ATTRIBUTES, SKILLS } from "@/lib/core/character/creation-rules";
import type { CharacterSheet, MeritSelection, Specialty } from "@/lib/core/character/character-types";
import { creationMerits } from "@/lib/merit-progression";
import { useLanguage } from "@/lib/i18n";

export type BuilderValidationIssue = { step: number; key: string; label: string };

export function experienceTraitDots(
  initial: CharacterSheet | null | undefined,
  group: "attributes" | "skills",
  historyKey: string,
) {
  const history = initial?.current_state?.[historyKey];
  if (!Array.isArray(history)) return {} as Record<string, number>;
  return history.reduce<Record<string, number>>((totals, raw) => {
    if (!raw || typeof raw !== "object") return totals;
    const undo = (raw as { undo?: unknown }).undo;
    if (!undo || typeof undo !== "object") return totals;
    const trait = undo as { kind?: unknown; group?: unknown; name?: unknown };
    if (trait.kind === "trait" && trait.group === group && typeof trait.name === "string")
      totals[trait.name] = (totals[trait.name] ?? 0) + 1;
    return totals;
  }, {});
}

function initialDots(groups: Record<string, readonly string[]>, base: number) {
  return Object.values(groups).flat().reduce<Record<string, number>>(
    (values, name) => ({ ...values, [name]: base }),
    {},
  );
}

function editableTraits(
  initial: CharacterSheet | null | undefined,
  group: "attributes" | "skills",
  historyKey: string,
  adjust?: (values: Record<string, number>) => Record<string, number>,
) {
  const definitions = group === "attributes" ? ATTRIBUTES : SKILLS;
  const base = group === "attributes" ? 1 : 0;
  const stored = initial?.[group];
  const values = stored ? { ...stored } : initialDots(definitions, base);
  if (!initial) return values;
  for (const [name, dots] of Object.entries(experienceTraitDots(initial, group, historyKey)))
    values[name] = Math.max(base, Number(values[name] ?? base) - dots);
  return adjust ? adjust(values) : values;
}

function spent(values: Record<string, number>, names: readonly string[], base: number) {
  return names.reduce((total, name) => total + Number(values[name] ?? base) - base, 0);
}

function inferredPriority(
  values: Record<string, number>,
  groups: Record<string, readonly string[]>,
  base: number,
) {
  return Object.keys(groups).sort(
    (left, right) => spent(values, groups[right], base) - spent(values, groups[left], base),
  );
}

function editableSpecialties(
  initial: CharacterSheet | null | undefined,
  purchasedSpecialties: readonly Specialty[],
) {
  const values = (initial?.specializations ?? [])
    .filter((item) => !item.grantedBy)
    .map((item) => ({ skill: item.skill, name: item.name }));
  for (const purchased of purchasedSpecialties) {
    const index = values.findLastIndex(
      (item) => item.skill === purchased.skill && item.name === purchased.name,
    );
    if (index >= 0) values.splice(index, 1);
  }
  while (values.length < 3) values.push({ skill: "", name: "" });
  return values;
}

export function readLineArray(
  initial: CharacterSheet | null | undefined,
  key: string,
  fallback: string[],
) {
  const value = initial?.line_data[key];
  return Array.isArray(value) ? value.map(String) : fallback;
}

/** Common creation state. Line modules own every line-specific state value. */
export function useCommonBuilderState(
  initial: CharacterSheet | null | undefined,
  player: string,
  options: {
    experienceHistoryKey: string;
    purchasedSpecialties?: readonly Specialty[];
    adjustAttributes?: (values: Record<string, number>) => Record<string, number>;
    adjustSkills?: (values: Record<string, number>) => Record<string, number>;
    grantedMeritSources?: readonly string[];
  },
) {
  const startingAttributes = editableTraits(initial, "attributes", options.experienceHistoryKey, options.adjustAttributes);
  const startingSkills = editableTraits(initial, "skills", options.experienceHistoryKey, options.adjustSkills);
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const [name, setName] = useState(initial?.character.name ?? "");
  const [concept, setConcept] = useState(initial?.character.concept ?? "");
  const [playerName, setPlayerName] = useState(initial?.character.player ?? player);
  const [chronicle, setChronicle] = useState(initial?.character.chronicle ?? "");
  const [attributes, setAttributes] = useState<Record<string, number>>(startingAttributes);
  const [skills, setSkills] = useState<Record<string, number>>(startingSkills);
  const [attributePriority, setAttributePriority] = useState<string[]>(() =>
    initial ? inferredPriority(startingAttributes, ATTRIBUTES, 1) : ["", "", ""],
  );
  const [skillPriority, setSkillPriority] = useState<string[]>(() =>
    initial ? inferredPriority(startingSkills, SKILLS, 0) : ["", "", ""],
  );
  const [specialties, setSpecialties] = useState<Specialty[]>(() =>
    editableSpecialties(initial, options.purchasedSpecialties ?? []),
  );
  const [aspirations, setAspirations] = useState<string[]>(() =>
    readLineArray(initial, "aspirations", ["", "", ""]),
  );
  const [merits, setMerits] = useState<MeritSelection[]>(() => [
    ...creationMerits(initial?.merits),
    ...(initial?.merits ?? [])
      .filter((merit) => (options.grantedMeritSources ?? []).includes(String(merit.grantedBy)))
      .map((merit) => ({
        ...merit,
        dots: Math.max(1, Number(merit.creationDots ?? merit.dots) - Number(merit.experienceDots ?? 0)),
      })),
  ]);
  return {
    step, setStep, error, setError,
    name, setName, concept, setConcept, playerName, setPlayerName, chronicle, setChronicle,
    attributes, setAttributes, skills, setSkills,
    attributePriority, setAttributePriority, skillPriority, setSkillPriority,
    specialties, setSpecialties, aspirations, setAspirations, merits, setMerits,
  };
}

export function commonCreationIssues(
  state: ReturnType<typeof useCommonBuilderState>,
  labels: { attributes: string; skills: string; attributePriorities: string; skillPriorities: string },
) {
  const issues: BuilderValidationIssue[] = [];
  const prioritiesValid = (values: string[], categories: readonly string[]) =>
    values.every(Boolean) && new Set(values).size === categories.length && categories.every((item) => values.includes(item));
  const attributeCategories = Object.keys(ATTRIBUTES);
  const skillCategories = Object.keys(SKILLS);
  if (!prioritiesValid(state.attributePriority, attributeCategories))
    issues.push({ step: 2, key: "attribute-priority", label: labels.attributePriorities });
  if (!prioritiesValid(state.skillPriority, skillCategories))
    issues.push({ step: 2, key: "skill-priority", label: labels.skillPriorities });
  for (const [category, names] of Object.entries(ATTRIBUTES)) {
    const index = state.attributePriority.indexOf(category);
    if (index < 0 || spent(state.attributes, names, 1) !== [5, 4, 3][index])
      issues.push({ step: 2, key: `attribute-${category}`, label: `${labels.attributes} ${category}` });
  }
  for (const [category, names] of Object.entries(SKILLS)) {
    const index = state.skillPriority.indexOf(category);
    if (index < 0 || spent(state.skills, names, 0) !== [11, 7, 4][index])
      issues.push({ step: 2, key: `skill-${category}`, label: `${labels.skills} ${category}` });
  }
  return issues;
}

export function CharacterBuilderShell({
  line,
  templateLabel,
  state,
  issues,
  identity,
  traits,
  lineTemplate,
  onCancel,
  onFinish,
}: {
  line: "CtL" | "MtA";
  templateLabel: string;
  state: ReturnType<typeof useCommonBuilderState>;
  issues: BuilderValidationIssue[];
  identity: ReactNode;
  traits: ReactNode;
  lineTemplate: ReactNode;
  onCancel: () => void;
  onFinish: () => void;
}) {
  const { tr } = useLanguage();
  const missingAtStep = (step: number) => issues.filter((issue) => issue.step === step);
  const advance = () => {
    const current = missingAtStep(state.step);
    if (current.length) {
      state.setError(`${tr("Ainda falta", "Still required")}: ${current.map((issue) => issue.label).join(", ")}.`);
      return;
    }
    state.setError("");
    state.setStep(state.step + 1);
  };
  return <section className="builder">
    <div className="builder-head">
      <Button variant="ghost" onClick={onCancel}><ArrowLeft /> {tr("Voltar", "Back")}</Button>
      <div><Badge variant="outline">{line}</Badge><span>{tr("Criação guiada · regras compartilhadas v1", "Guided creation · shared rules v1")}</span></div>
    </div>
    <div className="stepper">
      {[tr("Identidade", "Identity"), tr("Características", "Traits"), templateLabel].map((label, index) =>
        <div key={label} className={state.step === index + 1 ? "step active" : state.step > index + 1 ? "step done" : "step"}>
          <span>{state.step > index + 1 ? <Check /> : index + 1}</span><strong>{label}</strong>
        </div>,
      )}
    </div>
    {issues.length > 0 && <div className="builder-pending">
      <strong>{issues.length} {issues.length === 1 ? tr("item pendente", "pending item") : tr("itens pendentes", "pending items")}</strong>
      <span>{issues.slice(0, 6).map((issue) => issue.label).join(" · ")}{issues.length > 6 ? ` · +${issues.length - 6}` : ""}</span>
    </div>}
    {state.error && <div className="builder-error">{state.error}</div>}
    <div className="builder-body">{state.step === 1 ? identity : state.step === 2 ? traits : lineTemplate}</div>
    <div className="builder-actions">
      {state.step > 1 && <Button variant="outline" onClick={() => state.setStep(state.step - 1)}><ArrowLeft /> {tr("Anterior", "Previous")}</Button>}
      <span />
      {state.step < 3
        ? <Button onClick={advance}>{tr("Continuar", "Continue")} <ArrowRight /></Button>
        : <Button onClick={onFinish}><Save /> {tr("Salvar ficha localmente", "Save character locally")}</Button>}
    </div>
  </section>;
}
