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
    {(["flesh", "spirit"] as const).map(direction => <section key={direction}>
      <h4>{t(direction === "flesh" ? "werewolf.towardFlesh" : "werewolf.towardSpirit")}</h4>
      <ul>{reference.breakingPoints.filter(point => point.direction === direction).map(point => {
        const applicable = (point.minHarmony === undefined || value >= point.minHarmony) && (point.maxHarmony === undefined || value <= point.maxHarmony);
        return <li key={point.id} className={applicable ? undefined : "wtf-inactive-rule"}>
          {locale === "pt-BR" ? reference.presentation[point.id]?.description ?? point.description : point.description}
          {point.modifier !== 0 && <strong>{` (${point.modifier})`}</strong>}
          {point.minHarmony !== undefined && <small>{t("werewolf.minimumHarmony", { rating: point.minHarmony })}</small>}
          {point.maxHarmony !== undefined && <small>{t("werewolf.maximumHarmony", { rating: point.maxHarmony })}</small>}
        </li>;
      })}</ul>
    </section>)}
  </div>;
}

/** Harmony is a manual absolute selection, not an XP purchase or a roll simulator. */
export function HarmonyTrack({ value, onChange, touchstones, onTouchstoneChange, reference }: {
  value: number; onChange: (value: number) => void; touchstones: { physical: string; spiritual: string };
  onTouchstoneChange: (kind: "physical" | "spiritual", value: string) => void; reference: WerewolfReferenceCatalog;
}) {
  const { locale, t } = useLanguage();
  const [open, setOpen] = useState(false);
  const selected = boundedHarmony(value);
  return <section className="wtf-harmony">
    <div className="panel-heading"><SheetHeading>{t("werewolf.harmony")}</SheetHeading>
      <Button variant="ghost" size="sm" onClick={() => setOpen(true)}>{t("werewolf.breakingPoints")}</Button>
    </div>
    <table><caption className="sr-only">{t("werewolf.harmony")}</caption>
      <thead><tr>{[t("werewolf.harmony"), t("werewolf.bans"), t("werewolf.trigger"), t("werewolf.control")].map(label => <th key={label} scope="col">{label}</th>)}</tr></thead>
      <tbody>{reference.harmony.map(level => <tr key={level.id} className={level.rating === selected ? "wtf-harmony-selected" : undefined}>
        <th scope="row"><Button type="button" size="sm" variant="ghost" aria-pressed={level.rating === selected} aria-label={`${t("werewolf.harmony")} ${level.rating}`} onClick={() => onChange(level.rating)}>{level.rating}</Button></th>
        <td>{level.bans}</td><td>{level.trigger ? t(`werewolf.${level.trigger}`) : t("werewolf.noPersonalTrigger")}</td>
        <td>{locale === "pt-BR" ? reference.presentation[level.id]?.control ?? level.control : level.control}</td>
      </tr>)}</tbody>
      <tfoot>{(["physical", "spiritual"] as const).map(kind => <tr key={kind}>
        <th scope="row">{t(kind === "physical" ? "werewolf.physicalTouchstone" : "werewolf.spiritualTouchstone")}</th>
        <td colSpan={3}><Input value={touchstones[kind]} aria-label={t(kind === "physical" ? "werewolf.physicalTouchstone" : "werewolf.spiritualTouchstone")} onChange={event => onTouchstoneChange(kind, event.target.value)}/>
          {(kind === "physical" ? selected <= 2 : selected >= 8) && <small>{t("werewolf.touchstoneUnavailable")}</small>}
        </td>
      </tr>)}</tfoot>
    </table>
    <Dialog open={open} onOpenChange={setOpen}><DialogContent className="wtf-harmony-dialog" showCloseButton={false}>
      <DialogHeader><DialogTitle>{t("werewolf.breakingPoints")}</DialogTitle><DialogDescription>{t("werewolf.breakingPointsNote")}</DialogDescription></DialogHeader>
      <BreakingPointReference reference={reference} harmony={selected}/>
      <DialogFooter><DialogClose asChild><Button size="sm" variant="outline">{t("common.close")}</Button></DialogClose></DialogFooter>
    </DialogContent></Dialog>
  </section>;
}
