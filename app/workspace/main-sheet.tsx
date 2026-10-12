import type { ReactNode } from "react";
import { useLanguage } from "@/lib/i18n";
import { ResourceTrack } from "./character-paper-shell";
import { DotValue, SheetHeading } from "./sheet-primitives";
import { derivedTraitsWithArmor } from "@/lib/combat-equipment";
import { SheetLayoutDesktopPage, type MainSheetDesktopLayout } from "./sheet-layout";

export function MainPowerStat({ label, value, summary }: { label: string; value: number; summary?: string }) {
  return <><div className="cod-main-power-stat"><strong>{label}</strong><DotValue value={value} max={10} singleRow /></div>{summary && <p className="cod-main-power-summary">{summary}</p>}</>;
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
  identityItems,
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
  armorId,
  shieldId,
  helmet,
  experience,
  specificPowersTitle,
  lineSections,
  layout,
  className = "",
}: {
  identityItems: Readonly<Record<string, ReactNode>>;
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
  armorId?: unknown;
  shieldId?: unknown;
  helmet?: unknown;
  experience: ReactNode;
  specificPowersTitle?: ReactNode;
  lineSections?: ReactNode;
  layout: MainSheetDesktopLayout;
  className?: string;
}) {
  const { t } = useLanguage();
  const traits = derivedTraitsWithArmor(derived, armorId, shieldId, helmet);
  const derivedRows: Array<[string, unknown]> = [
    [t("ui.size"), traits.Size],
    [t("ui.speed"), traits.Speed],
    [t("ui.defense"), traits.Defense],
    [t("ui.initiative"), traits.Initiative],
    [t("ui.armor"), traits.Armor],
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

  const bodyItems: Record<string, ReactNode> = {
    skills: <div data-slot="skills">{skills}</div>,
    conditions: conditionsSection,
    specificPowers: <div data-slot="specific-powers">
      {specificPowersTitle !== null && <SheetHeading>{specificPowersTitle ?? t("ui.specificPowers")}</SheetHeading>}
      {specificPowers}
    </div>,
    merits: <div data-slot="merits">
      <SheetHeading className="main-sheet-merits-heading">{t("ui.merits")}</SheetHeading>
      {merits}
    </div>,
    lineSections: lineSections === undefined ? null : <div data-slot="line-sections">{lineSections}</div>,
    aspirations: aspirationsSection,
    obsessions: obsessions === undefined ? null : <div data-slot="obsessions"><SheetHeading>{t("ui.obsessions")}</SheetHeading>{obsessions}</div>,
    health: <div data-slot="health">{health}</div>,
    willpower: <div data-slot="willpower">{willpower}</div>,
    powerStat: <div data-slot="power-stat">{powerStat}</div>,
    fuel: <div data-slot="fuel">{fuel}</div>,
    stability: <div data-slot="stability">{stability}</div>,
    derived: <section className="cod-main-derived" data-slot="derived-stats">
      <SheetHeading>{t("ui.derivedStats")}</SheetHeading>
      <div className="cod-main-derived-grid">{derivedRows.map(([label, value]) => <div key={String(label)}><span>{label}</span><strong>{String(value)}</strong></div>)}</div>
    </section>,
    experience: <section className="cod-main-experience" data-slot="experience">{experience}</section>,
  };

  const layoutItems: Readonly<Record<string, ReactNode>> = {
    ...identityItems,
    attributes: <div data-slot="attributes">{attributes}</div>,
    ...bodyItems,
  };
  return (
    <SheetLayoutDesktopPage
      id="main-sheet"
      definition={{ sections: layout.desktopSections }}
      items={layoutItems}
      className={`cod-main-sheet ${className}`}
    />
  );
}
