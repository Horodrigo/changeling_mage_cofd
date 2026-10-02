"use client";

import { useLanguage } from "@/lib/i18n";
import { SheetHeading } from "@/app/workspace/sheet-primitives";
import type { PassiveDefinition, WerewolfReferenceCatalog } from "./catalogs/reference";
import { boundedHarmony, primalUrgeLevel } from "./creation-rules";
import "./styles/traits.css";

export function PassiveRules({ rule, reference }: { rule: PassiveDefinition; reference: WerewolfReferenceCatalog }) {
  const { locale, t } = useLanguage();
  const presentation = locale === "pt-BR" ? reference.presentation[rule.id] : undefined;
  return <details className="wtf-rule-disclosure">
    <summary>{presentation?.name ?? rule.name}</summary>
    {rule.fields.map(field => {
      const translated = presentation?.fields?.[field.id];
      return <p className="wtf-rule-field" key={field.id}><strong>{translated?.label ?? field.label}:</strong>{" "}{translated?.text ?? field.text}</p>;
    })}
    <small>{t("conditions.sourcePage", { source: rule.source, page: rule.additionalPages?.length ? `${rule.page}–${rule.additionalPages.at(-1)}` : rule.page })}</small>
  </details>;
}

/** Purely informative: expanding an entry never spends resources or changes the sheet. */
export function WerewolfPassives({ reference }: { reference: WerewolfReferenceCatalog }) {
  const { t } = useLanguage();
  return <section className="wtf-passives"><SheetHeading>{t("werewolf.bodyOfTheWolf")}</SheetHeading>
    {reference.passives.filter(rule => !["kuruth", "kuruth-triggers", "harmony-breaking-points"].includes(rule.id)).map(rule => <PassiveRules key={rule.id} rule={rule} reference={reference}/>)}
  </section>;
}

/** Read-only limits and Kuruth reference belong next to Primal Urge, not in the Harmony track. */
export function KuruthReference({ reference, rating, harmony }: { reference: WerewolfReferenceCatalog; rating: number; harmony: number }) {
  const { locale, t } = useLanguage();
  const level = reference.harmony.find(item => item.rating === boundedHarmony(harmony))!;
  const urge = primalUrgeLevel(reference, rating);
  const control = locale === "pt-BR" ? reference.presentation[level.id]?.control ?? level.control : level.control;
  const duration = locale === "pt-BR" ? reference.presentation[urge.id]?.basuImTime ?? urge.basuImTime : urge.basuImTime;
  return <div className="wtf-primal-urge-reference">
    <p className="cod-main-power-summary">{t("werewolf.kuruthSummary", { control, duration })}</p>
    <details className="wtf-rule-disclosure"><summary>{t("werewolf.kuruth")}</summary>
      <p className="wtf-rule-field"><strong>{t("werewolf.bans")}:</strong>{" "}{level.bans}</p>
      <p className="wtf-rule-field"><strong>{t("werewolf.trigger")}:</strong>{" "}{level.trigger ? t(`werewolf.${level.trigger}`) : t("werewolf.noPersonalTrigger")}</p>
      {reference.passives.filter(rule => ["kuruth", "kuruth-triggers"].includes(rule.id)).map(rule => <PassiveRules key={rule.id} rule={rule} reference={reference}/>)}
    </details>
    <PrimalUrgeLimits reference={reference} rating={rating}/>
  </div>;
}

export function PrimalUrgeLimits({ reference, rating }: { reference: WerewolfReferenceCatalog; rating: number }) {
  const { locale, t } = useLanguage();
  const level = primalUrgeLevel(reference, rating);
  const translated = locale === "pt-BR" ? reference.presentation[level.id] : undefined;
  const rows = [
    [t("werewolf.traitMaximum"), level.traitMaximum],
    [t("werewolf.essenceMaximum"), level.essenceMaximum],
    [t("werewolf.essencePerTurn"), level.essencePerTurn],
    [t("werewolf.regeneration"), t("werewolf.bashingPerTurn", { amount: level.regenerationBashing })],
    [t("werewolf.basuImTime"), translated?.basuImTime ?? level.basuImTime],
    [t("werewolf.feeding"), translated?.feedingRestriction ?? level.feedingRestriction],
    [t("werewolf.huntInterval"), translated?.huntTime ?? level.huntTime],
    [t("werewolf.lunacyPenalty"), level.lunacyPenalty],
    [t("werewolf.trackingBonus"), level.trackingBonus],
  ];
  return <details className="wtf-rule-disclosure"><summary>{t("werewolf.primalUrge")} {level.rating}</summary>
    {rows.map(([label, value]) => <p className="wtf-rule-field" key={label}><strong>{label}:</strong>{" "}{value}</p>)}
    <small>{t("conditions.sourcePage", { source: level.source, page: level.page })}</small>
  </details>;
}
