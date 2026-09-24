"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { ArrowLeft, ArrowRight, Check, Save } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { ATTRIBUTES, SKILLS } from "@/lib/core/character/creation-rules";
import type { CharacterSheet, MeritSelection, Specialty } from "@/lib/core/character/character-types";
import { creationMerits } from "@/lib/merit-progression";
import { useLanguage } from "@/lib/i18n";
import type { PersistedGameLineId } from "@/lib/core/character/game-line-ids";

export type BuilderValidationIssue = { step: number; key: string; label: string };

export const isCreationDraft = (sheet: CharacterSheet | null | undefined) => sheet?.current_state.creation_draft === true;

export function builderCurrentState(initial: CharacterSheet | null | undefined, draft: boolean, step: number, allowAdvancement = false) {
  const state = { ...(initial?.current_state ?? {}) };
  if (draft) {
    state.creation_draft = true;
    state.creation_draft_step = step;
    state.creation_advancement_enabled = allowAdvancement;
  } else {
    delete state.creation_draft;
    delete state.creation_draft_step;
    delete state.creation_advancement_enabled;
  }
  return state;
}

export function useBuilderExitGuard(active: boolean, onRequest: () => void) {
  const leaving = useRef(false);
  useEffect(() => {
    if (!active) return;
    const marker = { ...window.history.state, characterBuilder: true };
    if (!window.history.state?.characterBuilder) window.history.pushState(marker, "");
    const popstate = () => {
      if (leaving.current) return;
      window.history.pushState(marker, "");
      onRequest();
    };
    const beforeunload = (event: BeforeUnloadEvent) => { event.preventDefault(); event.returnValue = ""; };
    window.addEventListener("popstate", popstate);
    window.addEventListener("beforeunload", beforeunload);
    return () => { window.removeEventListener("popstate", popstate); window.removeEventListener("beforeunload", beforeunload); };
  }, [active, onRequest]);
  return useCallback((action: () => boolean | void) => {
    leaving.current = true;
    try {
      if (action() === false) { leaving.current = false; return false; }
      if (window.history.state?.characterBuilder) window.history.back();
      return true;
    } catch (error) {
      leaving.current = false;
      throw error;
    }
  }, []);
}

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
    const trait = undo as { kind?: unknown; group?: unknown; name?: unknown; amount?: unknown };
    if (trait.kind === "trait" && trait.group === group && typeof trait.name === "string")
      totals[trait.name] = (totals[trait.name] ?? 0) + Math.max(1, Number(trait.amount) || 1);
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
  const [step, setStep] = useState(() => isCreationDraft(initial) ? Math.max(1, Math.min(4, Number(initial?.current_state.creation_draft_step ?? 1))) : 1);
  const [allowAdvancement, setAllowAdvancement] = useState(initial?.current_state.creation_advancement_enabled === true);
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
    step, setStep, allowAdvancement, setAllowAdvancement, error, setError,
    name, setName, concept, setConcept, playerName, setPlayerName, chronicle, setChronicle,
    attributes, setAttributes, skills, setSkills,
    attributePriority, setAttributePriority, skillPriority, setSkillPriority,
    specialties, setSpecialties, aspirations, setAspirations, merits, setMerits,
  };
}

export function commonCreationIssues(
  state: ReturnType<typeof useCommonBuilderState>,
  labels: {
    attributes: string;
    skills: string;
    attributePriorities: string;
    skillPriorities: string;
    categoryLabel?: (category: string) => string;
  },
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
    const displayCategory = labels.categoryLabel?.(category) ?? category;
    if (index < 0 || spent(state.attributes, names, 1) !== [5, 4, 3][index])
      issues.push({ step: 2, key: `attribute-${category}`, label: `${labels.attributes} ${displayCategory}` });
  }
  for (const [category, names] of Object.entries(SKILLS)) {
    const index = state.skillPriority.indexOf(category);
    const displayCategory = labels.categoryLabel?.(category) ?? category;
    if (index < 0 || spent(state.skills, names, 0) !== [11, 7, 4][index])
      issues.push({ step: 2, key: `skill-${category}`, label: `${labels.skills} ${displayCategory}` });
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
  prepareAdvancement,
  renderAdvancement,
  draft,
  onCancel,
  onFinish,
}: {
  line: PersistedGameLineId;
  templateLabel: string;
  state: ReturnType<typeof useCommonBuilderState>;
  issues: BuilderValidationIssue[];
  identity: ReactNode;
  traits: ReactNode;
  lineTemplate: ReactNode;
  prepareAdvancement?: (previous?: CharacterSheet) => CharacterSheet;
  renderAdvancement?: (sheet: CharacterSheet, updateSheet: (sheet: CharacterSheet) => void) => ReactNode;
  draft: boolean;
  onCancel: () => void;
  onFinish: (draft: boolean, advancement?: CharacterSheet) => boolean;
}) {
  const { t } = useLanguage();
  const hasAdvancement = Boolean(prepareAdvancement && renderAdvancement);
  const [exitOpen, setExitOpen] = useState(false);
  const [advancement, setAdvancement] = useState<CharacterSheet | undefined>(() => state.step === 4 && prepareAdvancement ? prepareAdvancement() : undefined);
  const requestExit = useCallback(() => setExitOpen(true), []);
  const leave = useBuilderExitGuard(true, requestExit);
  const saveAndExit = (asDraft: boolean) => { setExitOpen(false); leave(() => onFinish(asDraft, advancement)); };
  const missingAtStep = (step: number) => issues.filter((issue) => issue.step === step);
  const advance = () => {
    const current = missingAtStep(state.step);
    if (current.length) {
      state.setError(`${t("ui.stillRequired")}: ${current.map((issue) => issue.label).join(", ")}.`);
      return;
    }
    state.setError("");
    if (state.step === 3 && state.allowAdvancement && prepareAdvancement) setAdvancement(prepareAdvancement(advancement));
    state.setStep(state.step + 1);
  };
  const steps = [t("ui.identity"), t("ui.traits"), templateLabel, ...(hasAdvancement && state.allowAdvancement ? [t("ui.advancement")] : [])];
  return <section className={`builder line-theme-${line.toLowerCase()}`}>
    <div className="builder-head">
      <Button variant="ghost" onClick={requestExit}><ArrowLeft /> {t("ui.back")}</Button>
      <div><Badge variant="outline">{line}</Badge><span>{t("ui.guidedCreationSharedRulesV1")}</span></div>
      <Button type="button" variant="outline" onClick={() => saveAndExit(draft)}><Save /> {draft ? t("ui.saveDraftAndExit") : t("ui.saveChangesAndExit")}</Button>
    </div>
    {hasAdvancement && <label className="builder-advancement-toggle">
      <span><strong>{t("ui.allowCreationAdvancement")}</strong><small>{t("ui.allowCreationAdvancementDescription")}</small></span>
      <Switch checked={state.allowAdvancement} onCheckedChange={(checked) => { state.setAllowAdvancement(checked); if (!checked) { setAdvancement(undefined); if (state.step === 4) state.setStep(3); } }} />
    </label>}
    <div className="stepper">
      {steps.map((label, index) =>
        <div key={label} className={state.step === index + 1 ? "step active" : state.step > index + 1 ? "step done" : "step"}>
          <span>{state.step > index + 1 ? <Check /> : index + 1}</span><strong>{label}</strong>
        </div>,
      )}
    </div>
    {issues.length > 0 && <div className="builder-pending">
      <strong>{issues.length} {issues.length === 1 ? t("ui.pendingItem") : t("ui.pendingItems")}</strong>
      <span>{issues.slice(0, 6).map((issue) => issue.label).join(" · ")}{issues.length > 6 ? ` · +${issues.length - 6}` : ""}</span>
    </div>}
    {state.error && <div className="builder-error">{state.error}</div>}
    <div className="builder-body">{state.step === 1 ? identity : state.step === 2 ? traits : state.step === 3 ? lineTemplate : advancement && renderAdvancement ? renderAdvancement(advancement, setAdvancement) : null}</div>
    <div className="builder-actions">
      {state.step > 1 && <Button variant="outline" onClick={() => state.setStep(state.step - 1)}><ArrowLeft /> {t("ui.previous")}</Button>}
      <span />
      {state.step < steps.length
        ? <Button onClick={advance}>{t("ui.continue")} <ArrowRight /></Button>
        : <Button onClick={() => saveAndExit(false)}><Save /> {t("ui.saveCharacterLocally")}</Button>}
    </div>
    <BuilderExitDialog open={exitOpen} onOpenChange={setExitOpen} draft={draft} onDiscard={() => leave(() => { onCancel(); return true; })} onSave={() => saveAndExit(draft)} />
  </section>;
}

export function BuilderExitDialog({ open, onOpenChange, draft, onDiscard, onSave }: { open: boolean; onOpenChange: (open: boolean) => void; draft: boolean; onDiscard: () => void; onSave?: () => void }) {
  const { t } = useLanguage();
  return <AlertDialog open={open} onOpenChange={onOpenChange}><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>{t("ui.leaveCreation")}</AlertDialogTitle><AlertDialogDescription>{onSave ? t("ui.leaveCreationDescription") : t("ui.leaveCreationWithoutLineDescription")}</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter className="sm:flex-wrap"><AlertDialogCancel>{t("ui.continueEditing")}</AlertDialogCancel><Button type="button" variant="destructive" onClick={onDiscard}>{t("ui.discardAndExit")}</Button>{onSave && <Button type="button" onClick={onSave}>{draft ? t("ui.saveDraftAndExit") : t("ui.saveChangesAndExit")}</Button>}</AlertDialogFooter></AlertDialogContent></AlertDialog>;
}
