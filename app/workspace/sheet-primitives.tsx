"use client";
import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { useLanguage } from "@/lib/i18n";
import { workspaceTerm } from "./workspace-i18n";
import { systemTerm } from "@/lib/system-terms";
import { normalizeDamage, woundPenalty, type DamageLevel } from "@/lib/resource-rules";
import { RuleSelect } from "./rule-select";

function damageLabel(value:DamageLevel|undefined){return value==="bashing"?"contundente":value==="lethal"?"letal":value==="aggravated"?"agravado":"vazio";}

export function pretty(value:string){return value.replace(/([A-Z])/g," $1").replace(/_/g," ").trim();}
export function stringList(value:unknown){return Array.isArray(value)?value.map(String):[];}
export function signed(value:number){return value>0?`+${value}`:String(value);}
export function kithSkillMiddlePieceCount(nameWidth:number,frameHeight=38){
  const scale=frameHeight/552;
  const fixedWidth=(471+760)*scale;
  const middleWidth=260*scale;
  const requiredWidth=nameWidth+20;
  return Math.max(0,Math.ceil((requiredWidth-fixedWidth)/middleWidth));
}
export function SheetHeading({children,className}:{children:ReactNode;className?:string}){const {locale}=useLanguage();return <h3 className={`official-heading${className?` ${className}`:""}`}><span>{typeof children==="string"?workspaceTerm(children,locale):children}</span></h3>;}
export function CompactValues({values}:{values:Record<string,number>}){const {locale}=useLanguage();return <div className="compact-values">{Object.entries(values).map(([name,value])=><div key={name}><span>{workspaceTerm(pretty(name),locale)}</span><strong>{value}</strong></div>)}</div>;}

export function TraitBlock({
  title,
  subtitle,
  names,
  values,
  specialties = [],
  compactNames = false,
  highlightedNames,
  highlightTone,
}: {
  title: string;
  subtitle?: ReactNode;
  names: readonly string[];
  values: Record<string, number>;
  specialties?: Array<{ skill: string; name: string }>;
  compactNames?: boolean;
  highlightedNames?: ReadonlySet<string>;
  highlightTone?: "rote" | "kith" | "legacy" | "ruling";
}) {
  const { locale } = useLanguage();

  return (
    <section className="official-trait-block">
      <h4>{workspaceTerm(title, locale)}</h4>

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
          compactName={compactNames}
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
  compactName = false,
  highlightTone,
}: {
  name: string;
  value: number;
  note?: string;
  compactName?: boolean;
  highlightTone?: "rote" | "kith" | "legacy" | "ruling";
}) {
  const {locale}=useLanguage();
  const localizedName=systemTerm(name,locale);
  const displayedName=compactName ? localizedName.slice(0,3) : localizedName;
  return (
    <div className={`official-trait-line${highlightTone ? ` skill-highlight-${highlightTone}` : ""}`}>
      <span className="official-trait-label" title={compactName ? localizedName : undefined} aria-label={note ? `${localizedName} (${note})` : localizedName}>
        {highlightTone === "kith" ? <KithSkillName>{displayedName}</KithSkillName> : <span className="official-trait-name">{displayedName}</span>}
        {note && <small title={note}>({note})</small>}
      </span>
      <DotValue value={value} />
    </div>
  );
}

function KithSkillName({children}:{children:string}) {
  const nameRef=useRef<HTMLSpanElement>(null);
  const [middleCount,setMiddleCount]=useState(0);
  useLayoutEffect(()=>{
    const name=nameRef.current;
    if(!name)return;
    let frame=0;
    const measure=()=>{
      cancelAnimationFrame(frame);
      frame=requestAnimationFrame(()=>{
        const nextCount=kithSkillMiddlePieceCount(name.getBoundingClientRect().width);
        setMiddleCount((current)=>current===nextCount?current:nextCount);
      });
    };
    measure();
    const observer=new ResizeObserver(measure);
    observer.observe(name);
    return()=>{cancelAnimationFrame(frame);observer.disconnect();};
  },[children]);
  return <span ref={nameRef} className="official-trait-name">
    <span className="kith-skill-name-text">{children}</span>
    <span className="kith-skill-frame" aria-hidden="true">
      <span className="kith-skill-piece kith-skill-left"/>
      {Array.from({length:middleCount},(_,index)=><span key={index} className={`kith-skill-piece kith-skill-middle-${index%2+1}`}/>)}
      <span className="kith-skill-piece kith-skill-right"/>
    </span>
  </span>;
}
export function DotValue({ value, max = 5, singleRow=false }: { value: number; max?: number; singleRow?:boolean }) {
  const {tr}=useLanguage();
  const total = Math.max(max, Math.ceil(value / 5) * 5);
  return (
    <span className="official-dots" aria-label={tr(`${value} pontos`,`${value} dots`)}>
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
  const { tr }=useLanguage();
  const penalty = woundPenalty(damage, health);
  const cycle = (index: number) => {
    const slots: Array<DamageLevel | undefined> = Array.from(
      { length: health },
      (_, slot) => damage[slot],
    );
    const current = slots[index];
    slots[index] =
      current === "bashing"
        ? "lethal"
        : current === "lethal"
          ? "aggravated"
          : current === "aggravated"
            ? undefined
            : "bashing";
    onChange(normalizeDamage(slots, health));
  };
  return (
    <div className="tracker-block">
      <div
        className="health-track"
        role="group"
        aria-label={tr(`Vitalidade: ${damage.length} de ${health} caixas marcadas`,`Health: ${damage.length} of ${health} boxes marked`)}
      >
        {Array.from({ length: health }, (_, index) => {
          const level = damage[index];
          return (
            <button
              type="button"
              key={index}
              className={`health-box ${level ?? "empty"}`}
              onClick={() => cycle(index)}
              aria-label={tr(`Caixa ${index + 1}: ${damageLabel(level)}. Clique para alterar.`,`Box ${index + 1}: ${level ?? "empty"}. Click to change.`)}
            >
              <span aria-hidden="true" />
            </button>
          );
        })}
      </div>
      <div className="tracker-meta">
        <span>
          {damage.length}/{health} {tr("marcadas","marked")}
        </span>
        <strong className={penalty < 0 ? "penalty" : ""}>
          {tr("Penalidade","Penalty")} {penalty || "—"}
        </strong>
      </div>
      <p className="tracker-help">
        <span className="legend-mark bashing" />
        {tr("Contusão","Bashing")} <span className="legend-mark lethal" />
        {tr("Letal","Lethal")} <span className="legend-mark aggravated" />
        {tr("Agravado · clique para alternar","Aggravated · click to cycle")}
      </p>
    </div>
  );
}
