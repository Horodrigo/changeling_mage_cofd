"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { SheetHeading } from "@/app/workspace/sheet-primitives";
import { useLanguage } from "@/lib/i18n";
import { PassiveRules } from "./passives";
import { totemSamplePresentation, type TotemSample, type WerewolfTotemCatalog } from "./catalogs/totem";
import "./styles/totem.css";

const SAMPLE_FIELDS = ["concept", "aspiration", "points", "rank", "power", "finesse", "resistance", "willpower", "essence", "initiative", "defense", "speed", "size", "corpus", "influences", "manifestations", "numina", "ban", "bane", "advantage"] as const satisfies readonly (keyof TotemSample)[];

/** Read-only references: no Pack entity, purchases, resource recovery or derived-state mutation. */
export function TotemReference({ catalog }: { catalog: WerewolfTotemCatalog }) {
  const { locale, t } = useLanguage();
  const [search, setSearch] = useState("");
  const query = search.trim().toLocaleLowerCase(locale);
  const samples = catalog.samples.map(sample => totemSamplePresentation(sample, catalog, locale)).filter(sample =>
    [sample.name, sample.epithet, sample.concept, sample.description, sample.source].join(" ").toLocaleLowerCase(locale).includes(query)).sort((a, b) => a.name.localeCompare(b.name, locale));
  return <section className="wtf-totem-reference"><SheetHeading>{t("werewolf.totem")}</SheetHeading>
    <details className="wtf-rule-disclosure"><summary>{t("werewolf.totemReference")}</summary>
      <p className="wtf-rule-field">{t("werewolf.totemReferenceNote")}</p>
      {catalog.rules.map(rule => <PassiveRules key={rule.id} rule={rule} reference={{ presentation: catalog.presentation.rules }}/>) }
      <details className="wtf-rule-disclosure"><summary>{t("werewolf.totemRankLimits")}</summary>
        <div className="wtf-totem-ranks">{catalog.ranks.map(level => <article key={level.rank}>
          <h4>{t("werewolf.totemFields.rank")} {level.rank} · {level.title}</h4>
          <dl>{[
            [t("werewolf.totemAttributeDots"), `${level.attributeMinimum}–${level.attributeMaximum}`],
            [t("werewolf.totemTraitMaximum"), level.traitMaximum], [t("werewolf.essenceMaximum"), level.essenceMaximum],
            [t("werewolf.totemFields.numina"), `${level.numinaMinimum}–${level.numinaMaximum}`],
          ].map(([label, value]) => <div key={label}><dt>{label}:</dt>{" "}<dd>{value}</dd></div>)}</dl>
        </article>)}</div>
        <small>{t("werewolf.totemRankNote")}</small>
        <small>{t("conditions.sourcePage", { source: "Werewolf: The Forsaken Second Edition", page: 183 })}</small>
      </details>
      <details className="wtf-rule-disclosure"><summary>{t("werewolf.totemAdvantageTable")}</summary>
        <dl className="wtf-totem-bands">{catalog.advantageBands.map(band => <div key={band.minimum}>
          <dt>{band.maximum == null ? `${band.minimum}+` : `${band.minimum}–${band.maximum}`}</dt>{" "}<dd>{t("werewolf.totemAdvantagePool", { amount: band.experience })}</dd>
        </div>)}</dl><p className="wtf-rule-field">{t("werewolf.totemOverlapNote")}</p>
        <small>{t("conditions.sourcePage", { source: "Werewolf: The Forsaken Second Edition", page: 92 })}</small>
      </details>
      <details className="wtf-rule-disclosure"><summary>{t("werewolf.totemSamples")}</summary>
        <Input aria-label={t("werewolf.totemSearch")} placeholder={t("werewolf.totemSearch")} value={search} onChange={event => setSearch(event.target.value)}/>
        {samples.map(sample => <details className="wtf-rule-disclosure" key={sample.id}><summary>{sample.name} · {sample.epithet}</summary>
          <p className="wtf-rule-field">{sample.description}</p>
          <dl className="wtf-totem-sample">{SAMPLE_FIELDS.map(field => <div key={field} className={typeof sample[field] === "number" || field === "speed" ? undefined : "wtf-totem-text"}>
            <dt>{t(`werewolf.totemFields.${field}`)}:</dt>{" "}<dd>{sample[field]}</dd>
          </div>)}</dl>
          {sample.editorialNote && <p className="wtf-rule-field"><strong>{t("werewolf.totemEditorialNote")}:</strong>{" "}{sample.editorialNote}</p>}
          <small>{t("conditions.sourcePage", { source: sample.source, page: sample.additionalPages?.length ? `${sample.page}–${sample.additionalPages.at(-1)}` : sample.page })}</small>
        </details>)}
        {!samples.length && <p>{t("werewolf.totemNoMatches")}</p>}
      </details>
    </details>
  </section>;
}
