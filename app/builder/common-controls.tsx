"use client";

import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ATTRIBUTES, SKILLS, canIncreaseCreationDots } from "@/lib/core/character/creation-rules";
import type { Specialty } from "@/lib/core/character/character-types";
import { useLanguage } from "@/lib/i18n";
import { systemTerm } from "@/lib/system-terms";
import { builderText } from "../character-builder-messages";

type Setter<T> = (value: T) => void;
type MissingCheck = (key: string) => boolean;

export function CommonIdentityStep({
  name,
  setName,
  nameLabel,
  concept,
  setConcept,
  player,
  setPlayer,
  chronicle,
  setChronicle,
  missing,
}: {
  name: string;
  setName: Setter<string>;
  nameLabel: string;
  concept: string;
  setConcept: Setter<string>;
  player: string;
  setPlayer: Setter<string>;
  chronicle: string;
  setChronicle: Setter<string>;
  missing: MissingCheck;
}) {
  const { tr } = useLanguage();
  return <div className="builder-section">
    <span className="kicker">{tr("PASSO 1", "STEP 1")}</span>
    <h2>{tr("Identidade", "Identity")}</h2>
    <div className="identity-grid">
      <label className={missing("name") || missing("shadowName") ? "missing-field" : ""}>
        {nameLabel}<Input value={name} onChange={(event) => setName(event.target.value)} />
      </label>
      <label>{tr("Conceito", "Concept")}<Input value={concept} onChange={(event) => setConcept(event.target.value)} /></label>
      <label>{tr("Jogador", "Player")}<Input value={player} onChange={(event) => setPlayer(event.target.value)} /></label>
      <label>{tr("Crônica", "Chronicle")}<Input value={chronicle} onChange={(event) => setChronicle(event.target.value)} /></label>
    </div>
  </div>;
}

export function TraitsStep({
  attributePriority,
  setAttributePriority,
  skillPriority,
  setSkillPriority,
  attributes,
  setAttributes,
  skills,
  setSkills,
  specialties,
  setSpecialties,
  missing,
}: {
  attributePriority: string[];
  setAttributePriority: Setter<string[]>;
  skillPriority: string[];
  setSkillPriority: Setter<string[]>;
  attributes: Record<string, number>;
  setAttributes: Setter<Record<string, number>>;
  skills: Record<string, number>;
  setSkills: Setter<Record<string, number>>;
  specialties: Specialty[];
  setSpecialties: Setter<Specialty[]>;
  missing: MissingCheck;
}) {
  const { locale, tr } = useLanguage();
  const attributeCategories = Object.keys(ATTRIBUTES);
  const skillCategories = Object.keys(SKILLS);
  return <div className="builder-section">
    <span className="kicker">{tr("PASSO 2", "STEP 2")}</span>
    <h2>{tr("Características", "Traits")}</h2>
    <div className="priority-block">
      <h3>{tr("Prioridades de Atributos", "Attribute priorities")}</h3>
      <PriorityRow labels={attributeCategories} values={attributePriority} setValues={setAttributePriority} budgets={[5, 4, 3]} invalid={missing("attribute-priority")} />
      <DotGroups groups={ATTRIBUTES} values={attributes} setValues={setAttributes} base={1} maximum={5} priorities={attributePriority} budgets={[5, 4, 3]} missing={missing} prefix="attribute" />
    </div>
    <div className="priority-block">
      <h3>{tr("Prioridades de Perícias", "Skill priorities")}</h3>
      <PriorityRow labels={skillCategories} values={skillPriority} setValues={setSkillPriority} budgets={[11, 7, 4]} invalid={missing("skill-priority")} />
      <DotGroups groups={SKILLS} values={skills} setValues={setSkills} base={0} maximum={5} priorities={skillPriority} budgets={[11, 7, 4]} missing={missing} prefix="skill" />
    </div>
    <div className="specialties-block">
      <h3>{tr("Especializações", "Specialties")}</h3>
      {specialties.map((specialty, index) => <div className="specialty-row" key={index}>
        <Choice
          label={`${tr("Perícia", "Skill")} ${index + 1}`}
          value={specialty.skill}
          setValue={(skill) => updateArray(setSpecialties, specialties, index, { ...specialty, skill })}
          options={Object.values(SKILLS).flat()}
          optionLabels={Object.fromEntries(Object.values(SKILLS).flat().map((skill) => [skill, systemTerm(skill, locale)]))}
        />
        <label>{tr("Especialização", "Specialty")}<Input value={specialty.name} onChange={(event) => updateArray(setSpecialties, specialties, index, { ...specialty, name: event.target.value })} /></label>
      </div>)}
    </div>
  </div>;
}

function PriorityRow({ labels, values, setValues, budgets, invalid }: { labels: readonly string[]; values: string[]; setValues: Setter<string[]>; budgets: number[]; invalid: boolean }) {
  const { locale, tr } = useLanguage();
  return <div className={invalid ? "priority-row missing-field" : "priority-row"}>
    {values.map((value, index) => <Choice
      key={index}
      label={`${index === 0 ? tr("Primária", "Primary") : index === 1 ? tr("Secundária", "Secondary") : tr("Terciária", "Tertiary")} · ${budgets[index]}`}
      value={value}
      setValue={(next) => updateArray(setValues, values, index, next)}
      options={labels.filter((label) => label === value || !values.includes(label))}
      optionLabels={Object.fromEntries(labels.map((label) => [label, builderText(locale, label)]))}
    />)}
  </div>;
}

function DotGroups({ groups, values, setValues, base, maximum, priorities, budgets, missing, prefix }: {
  groups: Record<string, readonly string[]>;
  values: Record<string, number>;
  setValues: Setter<Record<string, number>>;
  base: number;
  maximum: number;
  priorities: string[];
  budgets: number[];
  missing: MissingCheck;
  prefix: string;
}) {
  const { locale } = useLanguage();
  return <div className="dot-groups">{Object.entries(groups).map(([category, names]) => {
    const priorityIndex = priorities.indexOf(category);
    const budget = budgets[priorityIndex];
    const used = names.reduce((total, name) => total + Number(values[name] ?? base) - base, 0);
    return <section className={missing(`${prefix}-${category}`) ? "dot-group missing-field" : "dot-group"} key={category}>
      <h4>{builderText(locale, category)} {budget !== undefined && <small>{used}/{budget}</small>}</h4>
      {names.map((name) => <DotRow
        key={name}
        name={builderText(locale, name)}
        value={values[name] ?? base}
        min={base}
        max={maximum}
        canIncrease={budget !== undefined && canIncreaseCreationDots(values[name] ?? base, maximum, used, budget)}
        setValue={(value) => setValues({ ...values, [name]: value })}
      />)}
    </section>;
  })}</div>;
}

export function DotRow({ name, value, setValue, min, max, tag, canIncrease = true }: { name: string; value: number; setValue: Setter<number>; min: number; max: number; tag?: string; canIncrease?: boolean }) {
  return <div className="dot-row"><span>{name}{tag && <small>{tag}</small>}</span><div>
    <Button type="button" size="icon" variant="ghost" disabled={value <= min} onClick={() => setValue(value - 1)}><Minus /></Button>
    <span className="dots" aria-label={`${value} dots`}>{Array.from({ length: max }, (_, index) => <i className={index < value ? "filled" : ""} key={index} />)}</span>
    <Button type="button" size="icon" variant="ghost" disabled={value >= max || !canIncrease} onClick={() => setValue(value + 1)}><Plus /></Button>
  </div></div>;
}

export function Choice({ label = "", value, setValue, options, optionLabels = {}, invalid = false }: { label?: string; value: string; setValue: Setter<string>; options: readonly string[]; optionLabels?: Record<string, string>; invalid?: boolean }) {
  const { tr } = useLanguage();
  return <label className={invalid ? "missing-field" : ""}>{label}<Select value={value || undefined} onValueChange={setValue}><SelectTrigger><SelectValue placeholder={tr("Selecione", "Select")} /></SelectTrigger><SelectContent>{options.map((option) => <SelectItem key={option} value={option}>{optionLabels[option] ?? option}</SelectItem>)}</SelectContent></Select></label>;
}

export function Aspirations({ values, setValues }: { values: string[]; setValues: Setter<string[]> }) {
  const { tr } = useLanguage();
  return <div className="aspirations-block"><h3>{tr("Aspirações", "Aspirations")}</h3><div>{values.map((value, index) => <Input key={index} value={value} onChange={(event) => updateArray(setValues, values, index, event.target.value)} placeholder={`${tr("Aspiração", "Aspiration")} ${index + 1}`} />)}</div></div>;
}

function updateArray<T>(setter: Setter<T[]>, values: T[], index: number, value: T) {
  const next = [...values];
  next[index] = value;
  setter(next);
}
