"use client";

import type { ReactNode } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { CharacterSheet } from "@/lib/core/character/character-types";
import { useLanguage } from "@/lib/i18n";
import { systemTerm } from "@/lib/system-terms";
import { DotValue } from "./sheet-primitives";

export function CharacterPaperShell({
  line,
  mobile = false,
  title,
  subtitle,
  children,
}: {
  line: "CtL" | "MtA";
  mobile?: boolean;
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  const { tr } = useLanguage();
  return (
    <article className={`cod-sheet ${mobile ? "mobile-character-sheet " : ""}${line === "CtL" ? "ctl-sheet" : "mta-sheet"}`}>
      {line === "CtL" && <div className="ctl-botanical-frame" aria-hidden="true">
        <span className="ctl-frame-edge ctl-frame-edge-top" />
        <span className="ctl-frame-edge ctl-frame-edge-bottom" />
        <span className="ctl-frame-edge ctl-frame-edge-left" />
        <span className="ctl-frame-edge ctl-frame-edge-right" />
        <span className="ctl-frame-star ctl-frame-star-top" />
        <span className="ctl-frame-star ctl-frame-star-bottom" />
        <span className="ctl-frame-star-side ctl-frame-star-side-top-left" />
        <span className="ctl-frame-star-side ctl-frame-star-side-top-right" />
        <span className="ctl-frame-star-side ctl-frame-star-side-bottom-left" />
        <span className="ctl-frame-star-side ctl-frame-star-side-bottom-right" />
        <span className="ctl-frame-corner ctl-frame-corner-top-left" />
        <span className="ctl-frame-corner ctl-frame-corner-top-right" />
        <span className="ctl-frame-corner ctl-frame-corner-bottom-left" />
        <span className="ctl-frame-corner ctl-frame-corner-bottom-right" />
      </div>}
      <header className="cod-sheet-title">
        <div><span className={line === "CtL" ? "ctl-title-mark" : undefined}>{title}</span><strong>{subtitle}</strong></div>
        <p>{tr("CRÔNICAS DAS TREVAS", "CHRONICLES OF DARKNESS")}</p>
      </header>
      {children}
    </article>
  );
}

export function SheetField({ label, value, tooltip }: { label: string; value: unknown; tooltip?: string }) {
  const { locale } = useLanguage();
  return (
    <div className="official-field" title={tooltip || undefined} data-tooltip={tooltip || undefined} tabIndex={tooltip ? 0 : undefined}>
      <span>{systemTerm(label, locale)}</span>
      <strong>{String(value ?? "")}</strong>
    </div>
  );
}

export function NotesArea({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const { tr } = useLanguage();
  return (
    <div className="notes-area">
      <Textarea key={value} defaultValue={value} onBlur={(event) => onChange(event.target.value)} placeholder={tr("Escreva livremente suas anotações...", "Write your notes freely...")} aria-label={tr("Anotações da ficha", "Character notes")} />
      <small>{tr("Salvo automaticamente ao sair do campo.", "Saved automatically when leaving the field.")}</small>
    </div>
  );
}

export function ResourceTrack({
  label, current, maximum, onChange, storedCurrent, storedMaximum, onStoredChange,
}: {
  label: string; current: number; maximum: number; onChange: (value: number) => void;
  storedCurrent?: number; storedMaximum?: number; onStoredChange?: (value: number) => void;
}) {
  const { locale, tr } = useLanguage();
  const displayLabel = systemTerm(label, locale);
  return (
    <div className="tracker-block">
      <div className="resource-track" role="group" data-label={displayLabel} aria-label={tr(`${displayLabel}: ${current} de ${maximum}`, `${displayLabel}: ${current} of ${maximum}`)}>
        {Array.from({ length: maximum }, (_, index) => <button type="button" key={index} className={index < current ? "filled" : ""} onClick={() => onChange(index < current ? index : index + 1)} aria-label={tr(`Definir ${displayLabel} como ${index < current ? index : index + 1}`, `Set ${displayLabel} to ${index < current ? index : index + 1}`)} />)}
        {storedCurrent !== undefined && storedMaximum !== undefined && onStoredChange && Array.from({ length: storedMaximum }, (_, index) => <button type="button" key={`stored-${index}`} className={`stored-glamour-dot${index < storedCurrent ? " filled" : ""}`} onClick={() => onStoredChange(index < storedCurrent ? index : index + 1)} aria-label={tr(`Definir Glamour armazenado como ${index < storedCurrent ? index : index + 1}`, `Set Stored Glamour to ${index < storedCurrent ? index : index + 1}`)} />)}
      </div>
      <div className="tracker-meta"><span>{tr("Atual", "Current")}</span><strong>{current} / {maximum}</strong></div>
    </div>
  );
}

export function PowerResource({
  name, rating, resourceName, current, maximum, perTurn, onChange, summary, storedCurrent, storedMaximum, onStoredChange,
}: {
  name: string; rating: number; resourceName: string; current: number; maximum: number; perTurn: number;
  onChange: (value: number) => void; summary?: string; storedCurrent?: number; storedMaximum?: number; onStoredChange?: (value: number) => void;
}) {
  const { locale, tr } = useLanguage();
  return (
    <div className="power-resource">
      <div className="power-rating power-rating-summary" tabIndex={summary ? 0 : undefined} title={summary} aria-label={summary} data-tooltip={summary}>
        <span>{systemTerm(name, locale)}</span><DotValue value={rating} max={10} />
      </div>
      <ResourceTrack label={resourceName} current={current} maximum={maximum} onChange={onChange} storedCurrent={storedCurrent} storedMaximum={storedMaximum} onStoredChange={onStoredChange} />
      <p className="tracker-help">{tr(`${resourceName} máximo:`, `${systemTerm(resourceName, locale)} maximum:`)} <strong>{maximum}</strong>{storedCurrent !== undefined && <> · {tr("Glamour armazenado:", "Stored Glamour:")} <strong>{storedCurrent}</strong></>} · {tr("gasto por turno:", "spent per turn:")} <strong>{perTurn}</strong></p>
    </div>
  );
}

export function EditableList({ values, minimum = 1, maximum, firstPrefix, placeholder, onChange }: {
  values: string[]; minimum?: number; maximum?: number; firstPrefix?: string; placeholder: string; onChange: (value: string[]) => void;
}) {
  const { tr } = useLanguage();
  const rows = maximum === undefined ? [...values] : [...values].slice(0, maximum);
  while (rows.length < minimum) rows.push("");
  const removable = rows.length > minimum;
  return (
    <div className="editable-lines">
      {rows.map((value, index) => <div className="editable-line-row" key={index}>
        {index === 0 && firstPrefix && <strong className="editable-line-prefix">{firstPrefix}</strong>}
        <Input value={value} placeholder={placeholder} onChange={(event) => { const next = [...rows]; next[index] = event.target.value; onChange(next); }} />
        {removable && <Button type="button" size="icon" variant="ghost" aria-label={`${tr("Remover linha", "Remove row")} ${index + 1}`} onClick={() => onChange(rows.filter((_, itemIndex) => itemIndex !== index))}><Trash2 /></Button>}
      </div>)}
      {(!maximum || rows.length < maximum) && <Button type="button" size="sm" variant="ghost" onClick={() => onChange([...rows, ""])}><Plus /> {tr("Adicionar linha", "Add row")}</Button>}
    </div>
  );
}

export function boundedNumber(value: unknown, maximum: number, fallback: number) {
  const number = Number(value);
  return Number.isFinite(number) ? Math.max(0, Math.min(maximum, Math.trunc(number))) : fallback;
}

export function updateLineData(
  updateSheet: (sheet: CharacterSheet) => void,
  character: CharacterSheet,
  key: string,
  value: string[],
) {
  const next = structuredClone(character);
  next.line_data = { ...next.line_data, [key]: value };
  updateSheet(next);
}
