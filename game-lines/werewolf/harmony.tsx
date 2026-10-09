"use client";

import { useState } from "react";
import { useLanguage } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { SheetHeading } from "@/app/workspace/sheet-primitives";
import type { WerewolfReferenceCatalog } from "./catalogs/reference";
import { boundedHarmony } from "./creation-rules";
import { PassiveRules } from "./passives";
import "./styles/traits.css";

export function BreakingPointReference({ reference, harmony }: { reference: WerewolfReferenceCatalog; harmony: number }) {
  const { locale, t } = useLanguage();
  const value = boundedHarmony(harmony);
  const rule = reference.passives.find(item => item.id === "harmony-breaking-points");
  return <div className="wtf-breaking-points">
    {rule && <PassiveRules rule={rule} reference={reference}/>}
    {(["flesh", "spirit"] as const).map(direction => {
      const points = reference.breakingPoints.filter(point => point.direction === direction);
      const applicable = (point: typeof points[number]) => (point.minHarmony === undefined || value >= point.minHarmony) && (point.maxHarmony === undefined || value <= point.maxHarmony);
      const renderPoint = (point: typeof points[number]) => <li key={point.id}>
        {locale === "pt-BR" ? reference.presentation[point.id]?.description ?? point.description : point.description}
        {point.modifier !== 0 && <strong>{` (${point.modifier})`}</strong>}
        {point.minHarmony !== undefined && <small>{t("werewolf.minimumHarmony", { rating: point.minHarmony })}</small>}
        {point.maxHarmony !== undefined && <small>{t("werewolf.maximumHarmony", { rating: point.maxHarmony })}</small>}
      </li>;
      const inactive = points.filter(point => !applicable(point));
      return <section key={direction}>
        <h4>{t(direction === "flesh" ? "werewolf.towardFlesh" : "werewolf.towardSpirit")}</h4>
        <ul>{points.filter(applicable).map(renderPoint)}</ul>
        {inactive.length > 0 && <details className="wtf-rule-disclosure wtf-other-breaking-points">
          <summary>{t("werewolf.otherBreakingPoints")}</summary>
          <ul>{inactive.map(renderPoint)}</ul>
        </details>}
      </section>;
    })}
  </div>;
}

/** Harmony is a manual absolute selection, not an XP purchase or a roll simulator. */
export function HarmonyTrack({ value, onChange, touchstones, onTouchstoneChange, reference }: {
  value: number; onChange: (value: number) => void; touchstones: { physical: string; spiritual: string };
  onTouchstoneChange: (kind: "physical" | "spiritual", value: string) => void; reference: WerewolfReferenceCatalog;
}) {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const selected = boundedHarmony(value);
  return <section className="wtf-harmony">
    <div className="panel-heading"><SheetHeading>{t("werewolf.harmony")}</SheetHeading>
      <Button variant="ghost" size="sm" onClick={() => setOpen(true)}>{t("werewolf.breakingPoints")}</Button>
    </div>
    <div className="wtf-harmony-track">{[...reference.harmony].sort((a, b) => b.rating - a.rating).map(level => {
      const kind = level.rating === 10 ? "physical" : level.rating === 0 ? "spiritual" : null;
      const label = kind === "physical" ? t("werewolf.physicalTouchstone") : t("werewolf.spiritualTouchstone");
      return <div className="wtf-harmony-row" data-harmony-rating={level.rating} key={level.id}>
        <strong>{level.rating}</strong>
        <div className="wtf-harmony-line">{kind && <>
          <Input value={touchstones[kind]} placeholder={label} aria-label={label} onChange={event => onTouchstoneChange(kind, event.target.value)}/>
          {(kind === "physical" ? selected <= 2 : selected >= 8) && <small>{t("werewolf.touchstoneUnavailable")}</small>}
        </>}</div>
        <Button type="button" size="sm" variant="ghost" aria-pressed={level.rating === selected} aria-label={`${t("werewolf.harmony")} ${level.rating}`} onClick={() => onChange(level.rating)}>
          <span className={level.rating === selected ? "wtf-harmony-dot filled" : "wtf-harmony-dot"}/>
        </Button>
      </div>;
    })}</div>
    <Dialog open={open} onOpenChange={setOpen}><DialogContent className="wtf-harmony-dialog" showCloseButton={false}>
      <DialogHeader><DialogTitle>{t("werewolf.breakingPoints")}</DialogTitle><DialogDescription>{t("werewolf.breakingPointsNote")}</DialogDescription></DialogHeader>
      <BreakingPointReference reference={reference} harmony={selected}/>
      <DialogFooter><DialogClose asChild><Button size="sm" variant="outline">{t("common.close")}</Button></DialogClose></DialogFooter>
    </DialogContent></Dialog>
  </section>;
}
