"use client";

import { useLanguage } from "@/lib/i18n";
import type { ReactNode } from "react";
import { SheetHeading } from "@/app/workspace/sheet-primitives";
import type { PassiveDefinition, WerewolfReferenceCatalog } from "./catalogs/reference";
import { boundedHarmony, primalUrgeLevel } from "./creation-rules";
import "./styles/traits.css";

export function PassiveRules({ rule, reference, children }: { rule: PassiveDefinition; reference: WerewolfReferenceCatalog; children?: ReactNode }) {
  const { locale, t } = useLanguage();
  const presentation = locale === "pt-BR" ? reference.presentation[rule.id] : undefined;
  return <details className="wtf-rule-disclosure">
    <summary>{presentation?.name ?? rule.name}</summary>
    {rule.fields.map(field => {
      const translated = presentation?.fields?.[field.id];
      return <p className="wtf-rule-field" key={field.id}><strong>{translated?.label ?? field.label}:</strong>{" "}{translated?.text ?? field.text}</p>;
    })}
    {children}
    <small>{t("conditions.sourcePage", { source: rule.source, page: rule.additionalPages?.length ? `${rule.page}–${rule.additionalPages.at(-1)}` : rule.page })}</small>
  </details>;
}

/** Purely informative: expanding an entry never spends resources or changes the sheet. */
export function WerewolfPassives({ reference, harmony }: { reference: WerewolfReferenceCatalog; harmony: number }) {
  const { t } = useLanguage();
  return <section className="wtf-passives"><SheetHeading>{t("werewolf.bodyOfTheWolf")}</SheetHeading>
    {reference.passives.filter(rule => rule.id !== "harmony-breaking-points").map(rule => rule.id === "kuruth"
      ? <KuruthReference key={rule.id} reference={reference} harmony={harmony}/>
      : <PassiveRules key={rule.id} rule={rule} reference={reference}/>)}
  </section>;
}

/** Kuruth and its current Harmony-dependent limits belong to Body of the Wolf. */
export function KuruthReference({ reference, harmony }: { reference: WerewolfReferenceCatalog; harmony: number }) {
  const { locale, t } = useLanguage();
  const level = reference.harmony.find(item => item.rating === boundedHarmony(harmony))!;
  const rule = reference.passives.find(item => item.id === "kuruth");
  if (!rule) return null;
  const control = locale === "pt-BR" ? reference.presentation[level.id]?.control ?? level.control : level.control;
  return <PassiveRules rule={rule} reference={reference}>
    <p className="wtf-rule-field"><strong>{t("werewolf.control")}:</strong>{" "}{control}</p>
    {level.bans > 0 && <p className="wtf-rule-field"><strong>{t("werewolf.bans")}:</strong>{" "}{level.bans}</p>}
    {level.trigger && <p className="wtf-rule-field"><strong>{t("werewolf.trigger")}:</strong>{" "}{t(`werewolf.${level.trigger}`)}</p>}
  </PassiveRules>;
}

export function PrimalUrgeLimits({ reference, rating }: { reference: WerewolfReferenceCatalog; rating: number }) {
  const { locale, t } = useLanguage();
  const level = primalUrgeLevel(reference, rating);
  const translated = locale === "pt-BR" ? reference.presentation[level.id] : undefined;
  const rows: [string, string | number, boolean][] = [
    [t("werewolf.regeneration"), t("werewolf.bashingPerTurn", { amount: level.regenerationBashing }), level.regenerationBashing !== 0],
    [t("werewolf.basuIm"), translated?.basuImTime ?? level.basuImTime, true],
    [t("werewolf.feeding"), translated?.feedingRestriction ?? level.feedingRestriction, level.feedingRestriction !== "None"],
    [t("werewolf.huntInterval"), translated?.huntTime ?? level.huntTime, level.huntTime !== "None"],
    [t("werewolf.lunacyPenalty"), level.lunacyPenalty, level.lunacyPenalty !== 0],
    [t("werewolf.trackingBonus"), level.trackingBonus, level.trackingBonus !== 0],
    [t("werewolf.traitMaximum"), level.traitMaximum, level.traitMaximum > 5],
  ];
  return <p className="cod-main-power-summary wtf-primal-urge-reference">
    {rows.filter(([, , visible]) => visible).map(([label, value]) => <span key={label}><strong>{label}:</strong>{" "}{value}.</span>)}
  </p>;
}
