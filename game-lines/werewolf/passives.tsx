"use client";

import { useLanguage } from "@/lib/i18n";
import { SheetHeading } from "@/app/workspace/sheet-primitives";
import type { PassiveDefinition, WerewolfReferenceCatalog } from "./catalogs/reference";
import { primalUrgeLevel } from "./creation-rules";
import "./traits.css";

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
  return <section className="wtf-passives"><SheetHeading>{t("werewolf.passives")}</SheetHeading>
    {reference.passives.map(rule => <PassiveRules key={rule.id} rule={rule} reference={reference}/>)}
  </section>;
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
