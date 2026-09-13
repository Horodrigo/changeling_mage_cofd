"use client";

import { useState, type ReactNode } from "react";
import { Plus, Search, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SKILLS } from "@/lib/core/character/creation-rules";
import type { MeritSelection } from "@/lib/core/character/character-types";
import { useLanguage } from "@/lib/i18n";
import { meritConfigurationTitle, normalizeMeritConfiguration, type MeritConfigDefinition, type MeritConfiguration } from "@/lib/core/character/merit-configuration";
import type { MeritDefinition, MeritPrerequisiteContext } from "@/lib/merits";
import { Choice } from "./common-controls";

export type StructuredMeritEditorProps = {
  merit: MeritSelection;
  configuration: MeritConfiguration;
  onChange: (value: MeritConfiguration) => void;
  compact: boolean;
};

export type CustomMeritFieldProps = {
  keyName: string;
  value: string;
  onChange: (value: string) => void;
};

/** Core configuration mechanism; line modules inject only their own custom fields/editors. */
export function MeritConfigurationEditor({
  merit,
  onChange,
  catalog,
  compact = false,
  inline = false,
  ownedMerits = [],
  renderStructured,
  renderCustomField,
  definitions,
}: {
  merit: MeritSelection;
  onChange: (value: MeritConfiguration) => void;
  catalog: MeritDefinition[];
  compact?: boolean;
  inline?: boolean;
  ownedMerits?: NonNullable<MeritPrerequisiteContext["merits"]>;
  renderStructured?: (props: StructuredMeritEditorProps) => ReactNode;
  renderCustomField?: (kind: string, props: CustomMeritFieldProps) => ReactNode;
  definitions: readonly MeritConfigDefinition[];
}) {
  const { tr } = useLanguage();
  const definition = definitions.find((item) => item.name === merit.name);
  if (!definition) return null;
  const configuration = normalizeMeritConfiguration(merit.configuration);
  const visible = definition.fields.filter((field) => (field.minDots ?? 0) <= merit.dots);
  const set = (key: string, value: string | string[]) => onChange({ ...configuration, [key]: value });
  const structuredProps = { merit, configuration, onChange, compact };
  const injected = renderStructured?.(structuredProps);
  if (injected != null) return injected;
  if (STRUCTURED_MERITS.has(merit.name)) {
    if (merit.name === "Professional Training") return <ProfessionalTrainingEditor {...structuredProps} />;
    if (merit.name === "Mystery Cult Initiation" || merit.name === "Mystery Cult Influence") return <CultMeritEditor {...structuredProps} catalog={catalog} />;
    return null;
  }
  if (!visible.length) return null;
  const fields = <div>{visible.map((field) => {
    const value = configuration[field.key];
    if (field.kind === "merit") {
      const choices = ownedMerits.filter((item) => item.instanceId && field.meritNames?.includes(item.name) && item.dots >= (merit.name === "Infamous Mentor" ? merit.dots : 1));
      return <label key={field.key}>{field.label}<select value={String(value ?? "")} onChange={(event) => set(field.key, event.target.value)}><option value="">{tr("Selecione uma instância", "Select an instance")}</option>{choices.map((item) => <option key={item.instanceId} value={item.instanceId}>{item.name}: {meritConfigurationTitle(item.configuration) || item.instanceId} ({item.dots})</option>)}</select></label>;
    }
    if (field.kind === "court") {
      return <div key={field.key}>{renderCustomField?.(field.kind, { keyName: field.key, value: Array.isArray(value) ? "" : String(value ?? ""), onChange: (next) => set(field.key, next) })}</div>;
    }
    if (field.kind === "list") {
      const rowCount = field.fixedRows ?? merit.dots * (field.rowsPerDot ?? 1);
      const label = merit.name === "Contacts" ? tr("Grupos, organizações ou nome do contato", "Groups, organizations or contact name") : merit.name === "Multilingual" ? tr("Idiomas adicionais", "Additional languages") : field.label;
      const values = Array.isArray(value) ? value : [String(value ?? "")];
      const count = merit.name === "Multilingual" ? merit.dots * 2 : rowCount;
      return <fieldset key={field.key}><legend>{label}</legend><div className="merit-config-list">{Array.from({ length: count }, (_, index) => <Input key={index} value={values[index] ?? ""} placeholder={`${field.placeholder ?? label} ${index + 1}`} onChange={(event) => { const next = Array.from({ length: count }, (_, item) => values[item] ?? ""); next[index] = event.target.value; set(field.key, next); }} />)}</div></fieldset>;
    }
    if (field.kind === "select") return <label key={field.key}>{field.label}<Select value={String(value ?? "")} onValueChange={(next) => set(field.key, next)}><SelectTrigger><SelectValue placeholder={field.placeholder ?? tr("Selecione uma opção", "Select an option")} /></SelectTrigger><SelectContent>{(field.options ?? []).map((option) => <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>)}</SelectContent></Select></label>;
    if (field.kind === "textarea") return <label key={field.key}>{field.label}<textarea value={Array.isArray(value) ? value.join("\n") : String(value ?? "")} placeholder={field.placeholder} onChange={(event) => set(field.key, event.target.value)} /></label>;
    return <label key={field.key}>{field.label}<Input value={Array.isArray(value) ? value.join(", ") : String(value ?? "")} placeholder={field.placeholder} onChange={(event) => set(field.key, event.target.value)} /></label>;
  })}</div>;
  return inline
    ? <div className={`merit-configuration inline${compact ? " compact" : ""}`}>{fields}</div>
    : <details className={`merit-configuration${compact ? " compact" : ""}`}><summary>{tr("Configurar escolhas", "Configure choices")}</summary>{fields}</details>;
}

function ProfessionalTrainingEditor({ merit, configuration, onChange, compact }: StructuredMeritEditorProps) {
  const { tr } = useLanguage();
  const contacts = Array.isArray(configuration.contacts) ? configuration.contacts : ["", ""];
  const skills = Array.isArray(configuration.asset_skills) ? configuration.asset_skills : [];
  const assetCount = merit.dots >= 3 ? 3 : merit.dots >= 2 ? 2 : 0;
  const set = (key: string, value: string | string[]) => onChange({ ...configuration, [key]: value });
  const setArray = (key: string, current: string[], index: number, next: string) => { const changed = [...current]; changed[index] = next; set(key, changed); };
  return <details className={`merit-configuration structured${compact ? " compact" : ""}`} open={!compact}><summary>{tr("Configurar Treinamento Profissional", "Configure Professional Training")}</summary><div>
    <label>{tr("Profissão", "Profession")}<Input value={String(configuration.profession ?? "")} onChange={(event) => set("profession", event.target.value)} /></label>
    {merit.dots >= 1 && <fieldset><legend>{tr("Nv 1 · Rede de Contatos", "Dot 1 · Contact Network")}</legend>{[0, 1].map((index) => <label key={index}>{tr("Contato", "Contact")} {index + 1}<Input value={contacts[index] ?? ""} onChange={(event) => setArray("contacts", contacts, index, event.target.value)} /></label>)}</fieldset>}
    {assetCount > 0 && <fieldset><legend>{tr("Perícias de Ativo", "Asset Skills")}</legend>{Array.from({ length: assetCount }, (_, index) => <SkillChoice key={index} label={`${tr("Perícia de Ativo", "Asset Skill")} ${index + 1}`} value={skills[index] ?? ""} options={CONFIG_SKILLS.filter((skill) => skill === skills[index] || !skills.includes(skill))} setValue={(next) => setArray("asset_skills", skills, index, next)} />)}</fieldset>}
    {merit.dots >= 3 && <fieldset><legend>{tr("Nv 3 · Especializações", "Dot 3 · Specialties")}</legend>{[1, 2].map((index) => <div className="structured-choice-row" key={index}><SkillChoice label={`${tr("Perícia", "Skill")} ${index}`} value={String(configuration[`specialty_${index}_skill`] ?? "")} options={skills.filter(Boolean)} setValue={(next) => set(`specialty_${index}_skill`, next)} /><label>{tr("Especialização", "Specialty")} {index}<Input value={String(configuration[`specialty_${index}_name`] ?? "")} onChange={(event) => set(`specialty_${index}_name`, event.target.value)} /></label></div>)}</fieldset>}
    {merit.dots >= 4 && <SkillChoice label={tr("Perícia de Ativo que recebe +1", "Asset Skill receiving +1")} value={String(configuration.boosted_skill ?? "")} options={skills.filter(Boolean)} setValue={(next) => set("boosted_skill", next)} />}
  </div></details>;
}

function CultMeritEditor({ merit, configuration, onChange, compact, catalog }: StructuredMeritEditorProps & { catalog: MeritDefinition[] }) {
  const { tr } = useLanguage();
  const set = (key: string, value: string | string[]) => onChange({ ...configuration, [key]: value });
  const value = (key: string) => String(configuration[key] ?? "");
  return <details className={`merit-configuration structured${compact ? " compact" : ""}`} open={!compact}><summary>{tr("Configurar benefícios do Culto de Mistério", "Configure Mystery Cult benefits")}</summary><div>
    <label>{tr("Nome do culto", "Cult name")}<Input value={value("cult")} onChange={(event) => set("cult", event.target.value)} /></label>
    {Array.from({ length: merit.dots }, (_, index) => index + 1).map((level) =>
      <CultLevelEditor key={level} level={level} configuration={configuration} set={set} catalog={catalog} />)}
  </div></details>;
}

function CultLevelEditor({ level, configuration, set, catalog }: { level: number; configuration: MeritConfiguration; set: (key: string, value: string | string[]) => void; catalog: MeritDefinition[] }) {
  const { tr } = useLanguage();
  const prefix = `level_${level}`;
  const value = (suffix: string) => String(configuration[`${prefix}_${suffix}`] ?? "");
  const type = value("type");
  const options = level <= 2 ? ["__none", "specialty", "merit", "custom"] : level === 3 ? ["__none", "merits", "skill", "custom"] : ["__none", "merits", "merit_skill", "custom"];
  const max = level <= 2 ? 1 : level === 3 ? 2 : type === "merit_skill" ? 1 : 3;
  return <fieldset><legend>{tr("Nv", "Dot")} {level}</legend><Choice label={tr("Tipo de benefício", "Benefit type")} value={type || "__none"} setValue={(next) => set(`${prefix}_type`, next === "__none" ? "" : next)} options={options} />
    {type === "specialty" && <div className="structured-choice-row"><SkillChoice label={tr("Perícia", "Skill")} value={value("specialty_skill")} setValue={(next) => set(`${prefix}_specialty_skill`, next)} /><label>{tr("Especialização", "Specialty")}<Input value={value("specialty_name")} onChange={(event) => set(`${prefix}_specialty_name`, event.target.value)} /></label></div>}
    {(type === "merit" || type === "merits" || type === "merit_skill") && <MeritGrantPicker value={Array.isArray(configuration[`${prefix}_merits`]) ? configuration[`${prefix}_merits`] as string[] : []} max={max} catalog={catalog} onChange={(next) => set(`${prefix}_merits`, next)} />}
    {(type === "skill" || type === "merit_skill") && <SkillChoice label={tr("Perícia que recebe +1", "Skill receiving +1")} value={value("skill")} setValue={(next) => set(`${prefix}_skill`, next)} />}
    {type === "custom" && <label>{tr("Benefício customizado", "Custom benefit")}<textarea value={value("custom")} onChange={(event) => set(`${prefix}_custom`, event.target.value)} /></label>}
  </fieldset>;
}

const CONFIG_SKILLS = Object.values(SKILLS).flat();
const STRUCTURED_MERITS = new Set(["Professional Training", "Mystery Cult Initiation", "Mystery Cult Influence"]);

function SkillChoice({ label, value, setValue, options = CONFIG_SKILLS }: { label: string; value: string; setValue: (value: string) => void; options?: string[] }) {
  const { tr } = useLanguage();
  return <Choice label={label} value={value || "__none"} setValue={(next) => setValue(next === "__none" ? "" : next)} options={["__none", ...options]} optionLabels={{ __none: tr("Selecione uma Perícia", "Select a Skill") }} />;
}

function MeritGrantPicker({ value, max, catalog, onChange }: { value: string[]; max: number; catalog: MeritDefinition[]; onChange: (value: string[]) => void }) {
  const { tr } = useLanguage();
  const rows = value.length ? value : ["|1"];
  const used = rows.reduce((sum, row) => sum + (Number(row.split("|")[1]) || 1), 0);
  return <div className="merit-grant-picker">{rows.map((row, index) => { const [name, rawDots] = row.split("|"); const dots = Math.max(1, Number(rawDots) || 1); const available = Math.max(1, max - (used - dots)); return <div className="structured-choice-row" key={index}><MeritGrantSelectionDialog name={name} dots={dots} available={available} catalog={catalog} onSelect={(nextName, nextDots) => { const next = [...rows]; next[index] = `${nextName}|${nextDots}`; onChange(next); }} />{rows.length > 1 && <Button type="button" variant="ghost" size="icon" onClick={() => onChange(rows.filter((_, item) => item !== index))}><Trash2 /></Button>}</div>; })}{used < max && <Button type="button" size="sm" variant="outline" onClick={() => onChange([...rows, "|1"])}><Plus />{tr("Adicionar outro Mérito", "Add another Merit")}</Button>}</div>;
}

function MeritGrantSelectionDialog({ name, dots, available, catalog, onSelect }: { name: string; dots: number; available: number; catalog: MeritDefinition[]; onSelect: (name: string, dots: number) => void }) {
  const { locale, tr } = useLanguage();
  const [search, setSearch] = useState("");
  const normalized = search.trim().toLocaleLowerCase(locale);
  const selected = catalog.find((item) => item.name === name);
  const label = (item: MeritDefinition) => locale === "pt-BR" ? item.translatedName : item.name;
  const visible = catalog.filter((item) => item.ratings.some((rating) => rating <= available) && (!normalized || `${item.name} ${item.translatedName} ${item.description}`.toLocaleLowerCase(locale).includes(normalized)));
  return <Dialog><DialogTrigger asChild><Button type="button" variant="outline" className="experience-merit-trigger"><span>{selected ? `${label(selected)} ${"•".repeat(dots)}` : tr("Selecionar Mérito", "Select Merit")}</span><Search /></Button></DialogTrigger><DialogContent className="merit-dialog experience-merit-dialog"><DialogHeader><DialogTitle>{tr("Selecionar benefício de Mérito", "Select Merit benefit")}</DialogTitle><DialogDescription>{tr("Escolha um Mérito dentro do limite.", "Choose a Merit within the limit.")}</DialogDescription></DialogHeader><label className="merit-search"><Search /><Input value={search} onChange={(event) => setSearch(event.target.value)} /></label><div className="experience-merit-catalog">{visible.map((item) => <article key={item.id}><div><strong>{label(item)}</strong><small>{item.source} · p. {item.page || "—"}</small><p>{item.description}</p></div><div className="experience-merit-choice">{item.ratings.filter((rating) => rating <= available).map((rating) => <DialogClose asChild key={rating}><Button type="button" size="sm" variant={name === item.name && dots === rating ? "default" : "outline"} onClick={() => onSelect(item.name, rating)}>{rating}</Button></DialogClose>)}</div></article>)}</div><DialogFooter><DialogClose asChild><Button type="button" variant="outline" size="sm" className="catalog-dialog-done">{tr("Cancelar", "Cancel")}</Button></DialogClose></DialogFooter></DialogContent></Dialog>;
}
