"use client";

import { Minus, Plus } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { BufferedInput } from "@/components/ui/buffered-text";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectSeparator, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ATTRIBUTES, SKILLS, ATTRIBUTE_BUDGETS, SKILL_BUDGETS, creationCategoryDots, creationAllocationFits } from "@/lib/core/character/creation-rules";
import type { CharacterPortrait, Specialty } from "@/lib/core/character/character-types";
import { CharacterImageControls } from "@/app/character-image";
import { useLanguage } from "@/lib/i18n";
import { systemTerm } from "@/lib/system-terms";

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
  portrait,
  setPortrait,
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
  portrait?: CharacterPortrait;
  setPortrait: Setter<CharacterPortrait | undefined>;
  missing: MissingCheck;
}) {
  const { t } = useLanguage();
  return <div className="builder-section">
    <span className="kicker">{t("ui.step1")}</span>
    <h2>{t("ui.identity")}</h2>
    <CharacterImageControls value={portrait} onChange={setPortrait} />
    <div className="identity-grid">
      <label className={missing("name") || missing("shadowName") ? "missing-field" : ""}>
        {nameLabel}<BufferedInput value={name} onValueCommit={setName} />
      </label>
      <label>{t("ui.player")}<BufferedInput value={player} onValueCommit={setPlayer} /></label>
      <label>{t("ui.concept")}<BufferedInput value={concept} onValueCommit={setConcept} /></label>
      <label>{t("ui.chronicle")}<BufferedInput value={chronicle} onValueCommit={setChronicle} /></label>
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
        <label>{t("ui.specialty")}<BufferedInput value={specialty.name} onValueCommit={(name) => updateArray(setSpecialties, specialties, index, { ...specialty, name })} /></label>
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
      <h4>{systemTerm(category, locale)} <small>{Number.isFinite(spent[index]) ? t("ui.dots638f6d", { p1: spent[index] }) : "—"}</small></h4>
      {names.map((name) => <DotRow
        key={name}
        name={systemTerm(name, locale)}
        value={values[name] ?? base}
        min={base}
        max={maximum}
        canIncrease={creationAllocationFits(next, budgets)}
        setValue={(value) => setValues({ ...values, [name]: value })}
      />)}
    </section>;
  })}</div>;
}

export function DotRow({ name, value, setValue, min, max, tag, canIncrease = true }: { name: ReactNode; value: number; setValue: Setter<number>; min: number; max: number; tag?: string; canIncrease?: boolean }) {
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

function updateArray<T>(setter: Setter<T[]>, values: T[], index: number, value: T) {
  const next = [...values];
  next[index] = value;
  setter(next);
}
