"use client";
import type { ReactNode } from "react";
import { useLanguage } from "@/lib/i18n";
import { systemTerm } from "@/lib/system-terms";
import { cycleHealthDamage, woundPenalty, type DamageLevel } from "@/lib/resource-rules";
import { RuleSelect } from "./rule-select";
import { Button } from "@/components/ui/button";

const damageMessageKeys = { bashing: "ui.damageBashing", lethal: "ui.damageLethal", aggravated: "ui.damageAggravated" } as const;

export function pretty(value:string){return value.replace(/([A-Z])/g," $1").replace(/_/g," ").trim();}
export function stringList(value:unknown){return Array.isArray(value)?value.map(String):[];}
export function signed(value:number){return value>0?`+${value}`:String(value);}
export function SheetHeading({children,className}:{children:ReactNode;className?:string}){const {locale}=useLanguage();return <h3 className={`official-heading${className?` ${className}`:""}`}><span>{typeof children==="string"?systemTerm(children,locale):children}</span></h3>;}
export function CompactValues({values}:{values:Record<string,number|string>}){const {locale}=useLanguage();return <div className="compact-values">{Object.entries(values).map(([name,value])=><div key={name}><span>{systemTerm(pretty(name),locale)}</span><strong>{value}</strong></div>)}</div>;}

export function TraitBlock({
  title,
  subtitle,
  names,
  values,
  specialties = [],
  highlightedNames,
  highlightTone,
}: {
  title: string;
  subtitle?: ReactNode;
  names: readonly string[];
  values: Record<string, number>;
  specialties?: Array<{ skill: string; name: string }>;
  highlightedNames?: ReadonlySet<string>;
  highlightTone?: "rote" | "kith" | "legacy" | "ruling";
}) {
  const { locale } = useLanguage();

  return (
    <section className="official-trait-block">
      <h4>{systemTerm(title, locale)}</h4>

      {subtitle && (
        <small className="official-trait-subtitle">
          {subtitle}
        </small>
      )}

      {names.map((name) => (
        <TraitLine
          key={name}
          name={name}
          value={values[name] ?? 0}
          highlightTone={highlightedNames?.has(name) ? highlightTone : undefined}
          note={specialties
            .filter((item) => item.skill === name)
            .map((item) => item.name)
            .join(", ")}
        />
      ))}
    </section>
  );
}
export function TraitLine({
  name,
  value,
  note,
  highlightTone,
}: {
  name: string;
  value: number;
  note?: string;
  highlightTone?: "rote" | "kith" | "legacy" | "ruling";
}) {
  const {locale}=useLanguage();
  const localizedName=systemTerm(name,locale);
  return (
    <div className={`official-trait-line${highlightTone ? ` skill-highlight-${highlightTone}` : ""}`}>
      <span className="official-trait-label" aria-label={note ? `${localizedName} (${note})` : localizedName}>
        <span className="official-trait-name">{localizedName}</span>
        {note && <small title={note}>({note})</small>}
      </span>
      <DotValue value={value} />
    </div>
  );
}

export function DotValue({ value, max = 5, singleRow=false }: { value: number; max?: number; singleRow?:boolean }) {
  const { t }=useLanguage();
  const total = Math.max(max, Math.ceil(value / 5) * 5);
  return (
    <span className="official-dots" aria-label={t("ui.dots638f6d", { p1: value })}>
      {singleRow?<span className="official-dot-row">{Array.from({length:total},(_,index)=><i key={index} className={index<value?"on":""}/>)}</span>:Array.from({ length: Math.ceil(total / 5) }, (_, row) => (
        <span className="official-dot-row" key={row}>
          {Array.from({ length: 5 }, (_, column) => {
            const index = row * 5 + column;
            return <i key={index} className={index < value ? "on" : ""} />;
          })}
        </span>
      ))}
    </span>
  );
}
export function ArmorDotPicker({label,value,onChange}:{label:string;value:number;onChange:(value:number)=>void}){
  return <label className="armor-dot-picker"><span>{label}</span><RuleSelect value={String(value)} onChange={(next)=>onChange(Number(next))} options={Array.from({length:6},(_,rating)=>({value:String(rating),label:String(rating)}))}/></label>;
}
export function HealthTrack({
  health,
  damage,
  onChange,
}: {
  health: number;
  damage: DamageLevel[];
  onChange: (value: DamageLevel[]) => void;
}) {
  const { t }=useLanguage();
  const penalty = woundPenalty(damage, health);
  const cycle = (index: number) => {
    onChange(cycleHealthDamage(damage, health, index));
  };
  return (
    <div className="tracker-block">
      <div
        className="health-track"
        role="group"
        aria-label={t("ui.healthOfBoxesMarked", { p1: damage.length, p2: health })}
      >
        {Array.from({ length: health }, (_, index) => {
          const level = damage[index];
          return (
            <button
              type="button"
              key={index}
              className={`health-box ${level ?? "empty"}`}
              onClick={() => cycle(index)}
              aria-label={t("ui.healthBoxChange", { index: index + 1, state: level ? t(damageMessageKeys[level]) : t("ui.damageEmpty") })}
            >
              <span aria-hidden="true" />
            </button>
          );
        })}
      </div>
      <div className="tracker-meta">
        <Button type="button" variant="ghost" size="sm" onClick={() => onChange([])} disabled={damage.length === 0}>
          {t("ui.heal")}
        </Button>
        <span>
          {damage.length}/{health} {t("ui.marked")}
        </span>
        <strong className={penalty < 0 ? "penalty" : ""}>
          {t("ui.penalty")} {penalty || "—"}
        </strong>
      </div>
      <p className="tracker-help">
        <span className="legend-mark bashing" />
        {t("ui.bashing")} <span className="legend-mark lethal" />
        {t("ui.lethal")} <span className="legend-mark aggravated" />
        {t("ui.aggravatedClickToCycle")}
      </p>
    </div>
  );
}
