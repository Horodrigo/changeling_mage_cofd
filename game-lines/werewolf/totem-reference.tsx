"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { RuleSelect } from "@/app/workspace/rule-select";
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
      <TotemPowerReference catalog={catalog}/>
    </details>
  </section>;
}

/** Native disclosures and the existing selector; browsing never activates a power. */
export function TotemPowerReference({ catalog }: { catalog: WerewolfTotemCatalog }) {
  const { locale, t } = useLanguage();
  const [search, setSearch] = useState(""), [kind, setKind] = useState("all"), [reaching, setReaching] = useState("all");
  const presentation = catalog.presentation.powers;
  const query = search.trim().toLocaleLowerCase(locale);
  const powers = catalog.powers.filter(power => {
    const text = locale === "pt-BR" ? presentation[power.id] : undefined;
    return (kind === "all" || power.kind === kind) && (reaching === "all" || (power.kind === "numen" && Boolean(power.reaching) === (reaching === "yes")))
      && [text?.name ?? power.name, power.source, ...power.fields.map(field => text?.fields?.[field.id]?.text ?? field.text)].join(" ").toLocaleLowerCase(locale).includes(query);
  }).sort((a, b) => (locale === "pt-BR" ? presentation[a.id]?.name ?? a.name : a.name).localeCompare(locale === "pt-BR" ? presentation[b.id]?.name ?? b.name : b.name, locale));
  return <details className="wtf-rule-disclosure"><summary>{t("werewolf.totemPowers")}</summary>
    {catalog.powerRules.map(rule => <PassiveRules key={rule.id} rule={rule} reference={{ presentation }}/>) }
    <div className="catalog-filters wtf-totem-power-filters">
      <Input aria-label={t("werewolf.totemPowerSearch")} placeholder={t("werewolf.totemPowerSearch")} value={search} onChange={event => setSearch(event.target.value)}/>
      <label>{t("ui.type")}<RuleSelect value={kind} onChange={setKind} options={[{ value: "all", label: t("ui.all"), localized: true }, ...(["numen", "manifestation", "influence"] as const).map(value => ({ value, label: t(`werewolf.totemPowerKinds.${value}`), localized: true }))]}/></label>
      <label>{t("werewolf.totemReaching")}<RuleSelect value={reaching} onChange={setReaching} options={[{ value: "all", label: t("ui.all"), localized: true }, { value: "yes", label: t("werewolf.totemReachingYes"), localized: true }, { value: "no", label: t("werewolf.totemReachingNo"), localized: true }]}/></label>
    </div>
    <p className="wtf-rule-field">{t("werewolf.totemPowerCount", { count: powers.length })}</p>
    {powers.map(power => <PassiveRules key={power.id} rule={power} reference={{ presentation }}>
      <p className="wtf-rule-field"><strong>{t("ui.type")}:</strong>{" "}{t(`werewolf.totemPowerKinds.${power.kind}`)}{power.influenceLevel ? ` · ${power.influenceLevel}` : ""}</p>
      {power.kind === "numen" && <p className="wtf-rule-field"><strong>{t("werewolf.totemReaching")}:</strong>{" "}{t(power.reaching ? "werewolf.totemReachingYes" : "werewolf.totemReachingNo")}</p>}
    </PassiveRules>)}
    {!powers.length && <p>{t("werewolf.totemPowerNoMatches")}</p>}
  </details>;
}
