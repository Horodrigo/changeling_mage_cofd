import type { ReactNode } from "react";
import { useLanguage } from "@/lib/i18n";
import { ResourceTrack } from "./character-paper-shell";
import { DotValue, SheetHeading } from "./sheet-primitives";

export function MainPowerStat({ label, value, summary }: { label: string; value: number; summary?: string }) {
  return <><SheetHeading>{label}</SheetHeading><div className="cod-main-power-stat"><DotValue value={value} max={10} singleRow /></div>{summary && <p className="cod-main-power-summary">{summary}</p>}</>;
}

export function MainFuel({ label, current, maximum, onChange, storedCurrent, storedMaximum, onStoredChange }: {
  label: string;
  current: number;
  maximum: number;
  onChange: (value: number) => void;
  storedCurrent?: number;
  storedMaximum?: number;
  onStoredChange?: (value: number) => void;
}) {
  return <><SheetHeading>{label}</SheetHeading><ResourceTrack displayMinimum={20} label={label} current={current} maximum={maximum} onChange={onChange} storedCurrent={storedCurrent} storedMaximum={storedMaximum} onStoredChange={onStoredChange} /></>;
}

/**
 * Shared first-page composition for Chronicles of Darkness sheets.
 *
 * The slots intentionally remain React content rather than a universal rules
 * model: each game line owns the meaning and controls inside its slot.
 */
export function MainSheet({
  identity,
  attributes,
  skills,
  specificPowers,
  merits,
  aspirations,
  obsessions,
  conditions,
  health,
  willpower,
  powerStat,
  fuel,
  stability,
  derived,
  experience,
  specificPowersTitle,
  lineSections,
  conditionsAfterSkills = false,
  aspirationsAfterExperience = false,
  className = "",
}: {
  identity: ReactNode;
  attributes: ReactNode;
  skills: ReactNode;
  specificPowers: ReactNode;
  merits: ReactNode;
  aspirations: ReactNode;
  obsessions?: ReactNode;
  conditions: ReactNode;
  health: ReactNode;
  willpower: ReactNode;
  powerStat: ReactNode;
  fuel: ReactNode;
  stability: ReactNode;
  derived: Record<string, unknown>;
  experience: ReactNode;
  specificPowersTitle?: ReactNode;
  lineSections?: ReactNode;
  conditionsAfterSkills?: boolean;
  aspirationsAfterExperience?: boolean;
  className?: string;
}) {
  const { t } = useLanguage();
  const derivedRows: Array<[string, unknown]> = [
    [t("ui.size"), derived.Tamanho ?? "—"],
    [t("ui.speed"), derived.Deslocamento ?? "—"],
    [t("ui.defense"), derived.Defesa ?? "—"],
    [t("ui.armor"), derived.Armadura ?? 0],
    [t("ui.initiative"), derived.Iniciativa ?? "—"],
  ];

  const conditionsSection = <div data-slot="conditions">
    <SheetHeading className="main-sheet-conditions-heading">
      {t("ui.conditions")}
    </SheetHeading>
    {conditions}
  </div>;

  const aspirationsSection = <div data-slot="aspirations">
    <SheetHeading className="main-sheet-aspirations-heading">
      {t("ui.aspirations")}
    </SheetHeading>
    {aspirations}
  </div>;

  return <div className={`cod-main-sheet ${className}`}>
    <section className="cod-main-identity" data-slot="identity">{identity}</section>
    <section className="cod-main-attributes" data-slot="attributes">{attributes}</section>

    <div className="cod-main-columns official-sheet-body">
      <section className="cod-main-skills sheet-skills-column" data-slot="skills">
        {skills}
        {conditionsAfterSkills && conditionsSection}
      </section>

      <section className="cod-main-other sheet-center-column" data-slot="other-traits">
        <div data-slot="specific-powers">
          {specificPowersTitle !== null && <SheetHeading>{specificPowersTitle ?? t("ui.specificPowers")}</SheetHeading>}
          {specificPowers}
        </div>

        <div data-slot="merits">
          <SheetHeading className="main-sheet-merits-heading">
            {t("ui.merits")}
          </SheetHeading>
          {merits}
        </div>

        {lineSections !== undefined && <div data-slot="line-sections">{lineSections}</div>}

        {!aspirationsAfterExperience && aspirationsSection}
        {obsessions !== undefined && <div data-slot="obsessions"><SheetHeading>{t("ui.obsessions")}</SheetHeading>{obsessions}</div>}
        {!conditionsAfterSkills && conditionsSection}
      </section>

      <section className="cod-main-core sheet-right-column" data-slot="core-line-traits">
        <div data-slot="health">{health}</div>
        <div data-slot="willpower">{willpower}</div>
        <div data-slot="power-stat">{powerStat}</div>
        <div data-slot="fuel">{fuel}</div>
        <div data-slot="stability">{stability}</div>

        <section className="cod-main-derived" data-slot="derived-stats">
          <SheetHeading>{t("ui.derivedStats")}</SheetHeading>
          <div className="cod-main-derived-grid">{derivedRows.map(([label, value]) => <div key={String(label)}><span>{label}</span><strong>{String(value)}</strong></div>)}</div>
        </section>

        <section className="cod-main-experience" data-slot="experience">{experience}</section>
        {aspirationsAfterExperience && <section className="cod-main-aspirations">{aspirationsSection}</section>}
      </section>
    </div>
  </div>;
}
