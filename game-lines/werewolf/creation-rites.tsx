"use client";

import { useId } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useLanguage, type MessageKey } from "@/lib/i18n";
import type { RiteDefinition, RiteRulesText, WerewolfRiteCatalog } from "./catalogs/rites";
import { creationRiteSelection, type WerewolfCreationChoices } from "./creation-rules";
import "./styles/traits.css";
import "./styles/builder.css";

const GENERAL_FIELDS = [
  ["dicePool", "ui.dicePool"], ["participants", "werewolf.riteParticipants"], ["symbolism", "werewolf.riteSymbolism"],
  ["interruption", "werewolf.riteInterruption"], ["learning", "werewolf.learningRites"], ["modifiers", "werewolf.riteModifiers"],
] as const satisfies ReadonlyArray<readonly [keyof RiteRulesText, MessageKey]>;
const RITE_FIELDS = [
  ["prerequisites", "werewolf.ritePrerequisites"], ["cost", "ui.cost"], ["action", "ui.action"], ["duration", "ui.duration"],
  ["symbols", "werewolf.riteSymbols"], ["sampleRite", "werewolf.sampleRite"], ["sampleDicePool", "werewolf.sampleRitePool"],
] as const satisfies ReadonlyArray<readonly [keyof RiteDefinition, MessageKey]>;

/** General outcomes apply to every Core Rite; sample pools never become mechanical identity. */
export function RiteRules({ rite, catalog }: { rite: RiteDefinition; catalog: WerewolfRiteCatalog }) {
  const { locale, t } = useLanguage();
  const translated = locale === "pt-BR" ? catalog.presentation.rites[rite.id] : undefined;
  const general = locale === "pt-BR" ? { ...catalog.rules, ...catalog.presentation.rules } : catalog.rules;
  return <>
    <p className="wtf-rule-field">{translated?.description ?? rite.description}</p>
    <p className="wtf-rule-field"><strong>{t("ui.dicePool")}:</strong>{" "}{general.dicePool}</p>
    {RITE_FIELDS.map(([field, label]) => rite[field] ? <p className="wtf-rule-field" key={field}><strong>{t(label)}:</strong>{" "}{translated?.[field] ?? rite[field]}</p> : null)}
    <p className="wtf-rule-field"><strong>{t("ui.dramaticFailure")}:</strong>{" "}{general.dramaticFailure}</p>
    <p className="wtf-rule-field"><strong>{t("ui.failure")}:</strong>{" "}{general.failure}</p>
    <p className="wtf-rule-field"><strong>{t("ui.success")}:</strong>{" "}{translated?.success ?? rite.success}</p>
    <p className="wtf-rule-field"><strong>{t("ui.exceptionalSuccess")}:</strong>{" "}{general.exceptionalSuccess}</p>
    <small>{t("conditions.sourcePage", { source: rite.source, page: rite.additionalPages?.length ? `${rite.page}–${rite.additionalPages.at(-1)}` : rite.page })}</small>
  </>;
}

export function CreationRites({ value, onChange, catalog }: {
  value: WerewolfCreationChoices; onChange: (value: WerewolfCreationChoices) => void; catalog: WerewolfRiteCatalog;
}) {
  const { locale, t } = useLanguage();
  const controlId = useId();
  const { budget, spent } = creationRiteSelection(value, catalog.rites);
  const name = (rite: RiteDefinition) => locale === "pt-BR" ? catalog.presentation.rites[rite.id]?.name ?? rite.name : rite.name;
  const general = locale === "pt-BR" ? { ...catalog.rules, ...catalog.presentation.rules } : catalog.rules;
  const toggle = (id: string) => onChange({ ...value, rites: value.rites.includes(id) ? value.rites.filter(item => item !== id) : [...value.rites, id] });
  return <section className="wtf-creation-rites">
    <h3>{t("werewolf.rites")}</h3>
    {budget !== null && <p>{t("werewolf.selectedRiteDots", { spent, budget })}</p>}
    <details className="wtf-rule-disclosure"><summary>{t("werewolf.generalRiteRules")}</summary>
      {GENERAL_FIELDS.map(([field, label]) => <p className="wtf-rule-field" key={field}><strong>{t(label)}:</strong>{" "}{general[field]}</p>)}
      <p className="wtf-rule-field"><strong>{t("ui.success")}:</strong>{" "}{general.success}</p>
      <small>{t("conditions.sourcePage", { source: catalog.rules.source, page: catalog.rules.page })}</small>
    </details>
    {(["wolf", "pack"] as const).map(kind => <section key={kind}>
      <h4>{t(kind === "wolf" ? "werewolf.wolfRites" : "werewolf.packRites")}</h4>
      {[...catalog.rites].filter(rite => rite.kind === kind).sort((a, b) => name(a).localeCompare(name(b), locale)).map(rite => {
        const checked = value.rites.includes(rite.id);
        const reason = rite.tribeId && rite.tribeId !== value.tribe_id ? t("werewolf.riteOtherTribe")
          : budget === null ? t("werewolf.creationProblem.creationBudget")
          : spent + (checked ? 0 : rite.dots) > budget ? t("werewolf.riteDotLimit") : "";
        return <div className="wtf-rite-choice" key={rite.id}>
          <details className="wtf-rule-disclosure"><summary>{name(rite)} · {rite.dots}</summary><RiteRules rite={rite} catalog={catalog}/></details>
          <label className="wtf-rite-toggle"><Checkbox checked={checked} disabled={!checked && Boolean(reason)}
            aria-label={t("werewolf.selectRite", { name: name(rite) })} aria-describedby={reason ? `${controlId}-${rite.id}` : undefined}
            onCheckedChange={() => toggle(rite.id)}/></label>
          {reason && <small id={`${controlId}-${rite.id}`} className="wtf-rite-reason">{reason}</small>}
        </div>;
      })}
    </section>)}
    {value.rites.filter(id => !catalog.rites.some(rite => rite.id === id)).map((id, index) => <div className="wtf-missing-rite" key={`${id}-${index}`}>
      <p>{t("werewolf.missingSelectedRite", { id })}</p><Button variant="outline" size="sm" onClick={() => toggle(id)}>{t("common.remove")}</Button>
    </div>)}
  </section>;
}
