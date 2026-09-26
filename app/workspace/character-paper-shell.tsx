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
import type { PersistedGameLineId } from "@/lib/core/character/game-line-ids";

export function CharacterPaperShell({
  line,
  mobile = false,
  title,
  subtitle,
  children,
}: {
  line: PersistedGameLineId;
  mobile?: boolean;
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  const { t } = useLanguage();
  return (
    <article className={`cod-sheet ${mobile ? "mobile-character-sheet " : ""}${line.toLowerCase()}-sheet`}>
      {line === "CofD" && <div className="cofd-urban-frame" aria-hidden="true">
        <span className="cofd-frame-corner cofd-frame-corner-top-left" />
        <span className="cofd-frame-corner cofd-frame-corner-top-right" />
        <span className="cofd-frame-corner cofd-frame-corner-bottom-left" />
        <span className="cofd-frame-corner cofd-frame-corner-bottom-right" />
        <span className="cofd-frame-center cofd-frame-center-top" />
        <span className="cofd-frame-center cofd-frame-center-bottom" />
      </div>}
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
        {line === "CofD" ? <div className="cofd-title-mark" aria-label={t("workspace.chroniclesOfDarkness")}>
          <span aria-hidden="true">{t("ui.chroniclesTitle")}</span><small aria-hidden="true">{t("ui.ofTitle")}</small><strong aria-hidden="true">{t("ui.darknessTitle")}</strong>
        </div> : <><div><span className={line === "CtL" ? "ctl-title-mark" : undefined}>{title}</span><strong>{subtitle}</strong></div><p>{t("ui.chroniclesOFDARKNESS")}</p></>}
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
  const { t } = useLanguage();
  return (
    <div className="notes-area">
      <Textarea key={value} defaultValue={value} onBlur={(event) => onChange(event.target.value)} placeholder={t("ui.writeYourNotesFreely")} aria-label={t("ui.characterNotes")} />
      <small>{t("ui.savedAutomaticallyWhenLeavingTheField")}</small>
    </div>
  );
}

function inferredPowerResourcePerTurn(label: string, maximum: number) {
  if (!["Mana", "Glamour", "Vitae"].includes(label)) return undefined;
  const byMaximum: Record<number, number> = {
    10: 1,
    11: 2,
    12: 3,
    13: 4,
    15: 5,
    20: 6,
    25: 7,
    30: 8,
    50: 10,
    75: 15,
  };
  return byMaximum[maximum];
}

export function ResourceTrack({
  label, current, maximum, onChange, storedCurrent, storedMaximum, onStoredChange, displayMinimum, perTurn,
}: {
  label: string; current: number; maximum: number; onChange: (value: number) => void;
  storedCurrent?: number; storedMaximum?: number; onStoredChange?: (value: number) => void;
  displayMinimum?: number;
  perTurn?: number;
}) {
  const { locale, t } = useLanguage();
  const displayLabel = systemTerm(label, locale);
  const displayedPerTurn = perTurn ?? inferredPowerResourcePerTurn(label, maximum);
  return (
    <div className="tracker-block">
    <div
      className="resource-track"
      role="group"
      data-label={displayLabel}
      aria-label={t("ui.of", {
        p1: displayLabel,
        p2: current,
        p3: maximum,
      })}
    >
      {Array.from(
        { length: Math.max(maximum, displayMinimum ?? maximum) },
        (_, index) => (
          <button
            type="button"
            key={index}
            disabled={index >= maximum}
            className={`${index < current ? "filled" : ""}${index >= maximum ? " locked" : ""}`}
            onClick={() => onChange(index < current ? index : index + 1)}
            aria-label={t("ui.setTo", {
              p1: displayLabel,
              p2: index < current ? index : index + 1,
            })}
          />
        ),
      )}

      {storedCurrent !== undefined &&
        storedMaximum !== undefined &&
        onStoredChange &&
        Array.from({ length: storedMaximum }, (_, index) => (
          <button
            type="button"
            key={`stored-${index}`}
            className={`stored-glamour-dot${index < storedCurrent ? " filled" : ""}`}
            onClick={() =>
              onStoredChange(index < storedCurrent ? index : index + 1)
            }
            aria-label={t("ui.setStoredGlamourTo", {
              p1: index < storedCurrent ? index : index + 1,
            })}
          />
        ))}
    </div>

    <div className="tracker-meta">
      <span>{t("ui.current")}</span>
      <strong>
        {current}/{maximum}{displayedPerTurn !== undefined && <> | {t("ui.perTurn")}: {displayedPerTurn}</>}
      </strong>
    </div>
  </div>
  );
}

export function PowerResource({
  name, rating, resourceName, current, maximum, perTurn, onChange, summary, storedCurrent, storedMaximum, onStoredChange,
}: {
  name: string; rating: number; resourceName: string; current: number; maximum: number; perTurn: number;
  onChange: (value: number) => void; summary?: string; storedCurrent?: number; storedMaximum?: number; onStoredChange?: (value: number) => void;
}) {
  const { locale, t } = useLanguage();
  return (
    <div className="power-resource">
      <div className="power-rating power-rating-summary" tabIndex={summary ? 0 : undefined} title={summary} aria-label={summary} data-tooltip={summary}>
        <span>{systemTerm(name, locale)}</span><DotValue value={rating} max={10} singleRow />
      </div>
      <ResourceTrack label={resourceName} current={current} maximum={maximum} displayMinimum={20} perTurn={perTurn} onChange={onChange} storedCurrent={storedCurrent} storedMaximum={storedMaximum} onStoredChange={onStoredChange} />
      {storedCurrent !== undefined && <p className="tracker-help">{t("ui.storedGlamour")} <strong>{storedCurrent}</strong></p>}
    </div>
  );
}

export function EditableList({ values, minimum = 1, maximum, firstPrefix, placeholder, onChange }: {
  values: string[]; minimum?: number; maximum?: number; firstPrefix?: string; placeholder: string; onChange: (value: string[]) => void;
}) {
  const { t } = useLanguage();
  const rows = maximum === undefined ? [...values] : [...values].slice(0, maximum);
  while (rows.length < minimum) rows.push("");
  const removable = rows.length > minimum;
  return (
    <div className="editable-lines">
      {rows.map((value, index) => <div className="editable-line-row" key={index}>
        {index === 0 && firstPrefix && <strong className="editable-line-prefix">{firstPrefix}</strong>}
        <Input value={value} placeholder={placeholder} onChange={(event) => { const next = [...rows]; next[index] = event.target.value; onChange(next); }} />
        {removable && <Button type="button" size="icon" variant="ghost" aria-label={`${t("ui.removeRow")} ${index + 1}`} onClick={() => onChange(rows.filter((_, itemIndex) => itemIndex !== index))}><Trash2 /></Button>}
      </div>)}
      {(!maximum || rows.length < maximum) && <Button type="button" size="sm" variant="ghost" onClick={() => onChange([...rows, ""])}><Plus /> {t("ui.addRow")}</Button>}
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
