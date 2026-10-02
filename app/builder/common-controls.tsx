"use client";

import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectSeparator, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ATTRIBUTES, SKILLS, ATTRIBUTE_BUDGETS, SKILL_BUDGETS, creationCategoryDots, creationAllocationFits } from "@/lib/core/character/creation-rules";
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
  const { t } = useLanguage();
  return <div className="builder-section">
    <span className="kicker">{t("ui.step1")}</span>
    <h2>{t("ui.identity")}</h2>
    <div className="identity-grid">
      <label className={missing("name") || missing("shadowName") ? "missing-field" : ""}>
        {nameLabel}<Input value={name} onChange={(event) => setName(event.target.value)} />
      </label>
      <label>{t("ui.player")}<Input value={player} onChange={(event) => setPlayer(event.target.value)} /></label>
      <label>{t("ui.concept")}<Input value={concept} onChange={(event) => setConcept(event.target.value)} /></label>
      <label>{t("ui.chronicle")}<Input value={chronicle} onChange={(event) => setChronicle(event.target.value)} /></label>
    </div>
  </div>;
}

export function TraitsStep({
  attributes,
  setAttributes,
  skills,
  setSkills,
  specialties,
  setSpecialties,
  missing,
}: {
  attributes: Record<string, number>;
  setAttributes: Setter<Record<string, number>>;
  skills: Record<string, number>;
  setSkills: Setter<Record<string, number>>;
  specialties: Specialty[];
  setSpecialties: Setter<Specialty[]>;
  missing: MissingCheck;
}) {
  const { t } = useLanguage();
  return <div className="builder-section">
    <span className="kicker">{t("ui.step2")}</span>
    <h2>{t("ui.traits")}</h2>
    <div className="allocation-block">
      <h3>{t("ui.attributes")}</h3>
      <p className={missing("attribute-allocation") ? "allocation-status invalid" : "allocation-status"} role={missing("attribute-allocation") ? "alert" : undefined}>{missing("attribute-allocation") && <strong>{t("ui.incompleteAllocation")} </strong>}{t("ui.attributeAllocation")}</p>
      <DotGroups groups={ATTRIBUTES} values={attributes} setValues={setAttributes} base={1} maximum={5} budgets={ATTRIBUTE_BUDGETS} />
    </div>
    <div className="allocation-block">
      <h3>{t("ui.skills")}</h3>
      <p className={missing("skill-allocation") ? "allocation-status invalid" : "allocation-status"} role={missing("skill-allocation") ? "alert" : undefined}>{missing("skill-allocation") && <strong>{t("ui.incompleteAllocation")} </strong>}{t("ui.skillAllocation")}</p>
      <DotGroups groups={SKILLS} values={skills} setValues={setSkills} base={0} maximum={5} budgets={SKILL_BUDGETS} />
    </div>
    <div className="specialties-block">
      <h3>{t("ui.specialties")}</h3>
      {specialties.map((specialty, index) => <div className="specialty-row" key={index}>
        <SkillSpecialtyChoice
          label={`${t("ui.skill")} ${index + 1}`}
          value={specialty.skill}
          setValue={(skill) => updateArray(setSpecialties, specialties, index, { ...specialty, skill })}
        />
        <label>{t("ui.specialty")}<Input value={specialty.name} onChange={(event) => updateArray(setSpecialties, specialties, index, { ...specialty, name: event.target.value })} /></label>
      </div>)}
    </div>
  </div>;
}

function DotGroups({ groups, values, setValues, base, maximum, budgets }: {
  groups: Record<string, readonly string[]>;
  values: Record<string, number>;
  setValues: Setter<Record<string, number>>;
  base: number;
  maximum: number;
  budgets: readonly number[];
}) {
  const { locale, t } = useLanguage();
  const spent = creationCategoryDots(values, groups, base, maximum);
  return <div className="dot-groups">{Object.entries(groups).map(([category, names], index) => {
    const next = spent.map((dots, candidate) => dots + (candidate === index ? 1 : 0));
    return <section className="dot-group" key={category}>
      <h4>{builderText(locale, category)} <small>{Number.isFinite(spent[index]) ? t("ui.dots638f6d", { p1: spent[index] }) : "—"}</small></h4>
      {names.map((name) => <DotRow
        key={name}
        name={builderText(locale, name)}
        value={values[name] ?? base}
        min={base}
        max={maximum}
        canIncrease={creationAllocationFits(next, budgets)}
        setValue={(value) => setValues({ ...values, [name]: value })}
      />)}
    </section>;
  })}</div>;
}

export function DotRow({ name, value, setValue, min, max, tag, canIncrease = true }: { name: string; value: number; setValue: Setter<number>; min: number; max: number; tag?: string; canIncrease?: boolean }) {
  const { t } = useLanguage();
  return <div className="dot-row"><span>{name}{tag && <small>{tag}</small>}</span><div>
    <Button type="button" size="icon" variant="ghost" disabled={value <= min} onClick={() => setValue(value - 1)}><Minus /></Button>
    <span className="dots" aria-label={t("ui.dots638f6d", { p1: value })}>{Array.from({ length: max }, (_, index) => <i className={index < value ? "filled" : ""} key={index} />)}</span>
    <Button type="button" size="icon" variant="ghost" disabled={value >= max || !canIncrease} onClick={() => setValue(value + 1)}><Plus /></Button>
  </div></div>;
}

export function Choice({ label = "", value, setValue, options, optionLabels = {}, invalid = false }: { label?: string; value: string; setValue: Setter<string>; options: readonly string[]; optionLabels?: Record<string, string>; invalid?: boolean }) {
  const { t } = useLanguage();
  return <label className={invalid ? "choice-label missing-field" : "choice-label"}>{label}<Select value={value || undefined} onValueChange={setValue}><SelectTrigger><SelectValue placeholder={t("ui.select")} /></SelectTrigger><SelectContent>{options.map((option) => <SelectItem key={option} value={option}>{optionLabels[option] ?? option}</SelectItem>)}</SelectContent></Select></label>;
}

function SkillSpecialtyChoice({ label, value, setValue }: { label: string; value: string; setValue: Setter<string> }) {
  const { locale, t } = useLanguage();
  return <label className="choice-label">{label}<Select value={value || undefined} onValueChange={setValue}>
    <SelectTrigger><SelectValue placeholder={t("ui.selectASkill")} /></SelectTrigger>
    <SelectContent>{Object.entries(SKILLS).map(([category, skills], index) => <SelectGroup key={category}>
      {index > 0 && <SelectSeparator />}
      <SelectLabel>{systemTerm(category, locale)}</SelectLabel>
      {skills.map((skill) => <SelectItem key={skill} value={skill}>{systemTerm(skill, locale)}</SelectItem>)}
    </SelectGroup>)}</SelectContent>
  </Select></label>;
}

export function Aspirations({ values, setValues }: { values: string[]; setValues: Setter<string[]> }) {
  const { t } = useLanguage();
  return <div className="aspirations-block"><h3>{t("ui.aspirations")}</h3><div>{values.map((value, index) => <Input key={index} value={value} onChange={(event) => updateArray(setValues, values, index, event.target.value)} placeholder={`${t("ui.aspiration")} ${index + 1}`} />)}</div></div>;
}

function updateArray<T>(setter: Setter<T[]>, values: T[], index: number, value: T) {
  const next = [...values];
  next[index] = value;
  setter(next);
}
