"use client";

import { useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { RuleSelect } from "@/app/workspace/rule-select";
import { ResourceTrack } from "@/app/workspace/character-paper-shell";
import { cycleHealthDamage } from "@/lib/resource-rules";
import { createRandomId } from "@/lib/random-id";
import { useLanguage } from "@/lib/i18n";
import { PassiveRules } from "./passives";
import { TotemReference } from "./totem-reference";
import { TotemImprovements } from "./totem-improvements";
import type { TotemPower, WerewolfTotemCatalog } from "./catalogs/totem";
import { effectiveTotem, newTotem, TOTEM_ATTRIBUTES, totemCreationProblems, totemPowerProblems, totemTraits, type TotemSelection, type TotemState } from "./totem-rules";

function TotemPowerPicker({ kind, value, onChange, personalPoints, catalog }: {
  kind: "numen" | "manifestation"; value: TotemSelection; onChange: (value: TotemSelection) => void; personalPoints: number; catalog: WerewolfTotemCatalog;
}) {
  const { locale, t } = useLanguage(), [search, setSearch] = useState(""), [reaching, setReaching] = useState("all");
  const key = kind === "numen" ? "numina" : "manifestations";
  const traits = totemTraits(value, personalPoints, catalog, false, true);
  const powerName = (power: TotemPower) => locale === "pt-BR" ? catalog.presentation.powers[power.id]?.name ?? power.name : power.name;
  const powers = catalog.powers.filter(power => power.kind === kind && (reaching === "all" || Boolean(power.reaching) === (reaching === "yes")) &&
    [powerName(power), power.source, ...power.fields.map(field => locale === "pt-BR" ? catalog.presentation.powers[power.id]?.fields?.[field.id]?.text ?? field.text : field.text)].join(" ").toLocaleLowerCase(locale).includes(search.trim().toLocaleLowerCase(locale)))
    .sort((a, b) => powerName(a).localeCompare(powerName(b), locale));
  return <>
    <div className="catalog-filters wtf-totem-picker-filters"><Input value={search} onChange={event => setSearch(event.target.value)} aria-label={t("werewolf.totemPowerSearch")} placeholder={t("werewolf.totemPowerSearch")}/>
      {kind === "numen" && <label>{t("werewolf.totemReaching")}<RuleSelect value={reaching} onChange={setReaching} options={[{ value: "all", label: t("ui.all"), localized: true }, { value: "yes", label: t("werewolf.totemReachingYes"), localized: true }, { value: "no", label: t("werewolf.totemReachingNo"), localized: true }]}/></label>}
    </div>
    {powers.map(power => {
      const selected = effectiveTotem(value)[key].includes(power.id), candidate = { ...value, [key]: [...value[key], power.id] };
      const problems = [...totemPowerProblems(power, value, traits.rank?.rank), ...totemCreationProblems(candidate, personalPoints, catalog).filter(problem => problem === "powerBudget")];
      return <div className="wtf-totem-power-row" key={power.id}><PassiveRules rule={power} reference={{ presentation: catalog.presentation.powers }}>
        {problems.map(problem => <p className="wtf-rule-field" key={problem}>{t(problem === "unallocatedPowers" ? "werewolf.totemUnallocatedPowers" : `werewolf.totemProblem.${problem}`)}</p>)}
      </PassiveRules><Button type="button" size="sm" variant="outline" disabled={selected || problems.length > 0} onClick={() => onChange(candidate)} aria-label={t("werewolf.totemAddPower", { name: powerName(power) })}>{t(selected ? "werewolf.totemSelected" : "ui.add")}</Button></div>;
    })}
    {!powers.length && <p>{t("werewolf.totemPowerNoMatches")}</p>}
  </>;
}

/** Individual optional creation configuration. No Pack record or automatic character/resource mutation. */
export function TotemEditor({ value, onChange, personalPoints, catalog, state, onStateChange, children }: {
  value: TotemSelection | null; onChange: (value: TotemSelection | null) => void; personalPoints: number; catalog: WerewolfTotemCatalog;
  state?: TotemState; onStateChange?: (value: TotemState) => void;
  children?: ReactNode;
}) {
  const { locale, t } = useLanguage();
  if (!value) return <TotemReference catalog={catalog}><Button type="button" size="sm" variant="outline" onClick={() => onChange(newTotem())}>{t("werewolf.totemConfigure")}</Button></TotemReference>;
  const change = (patch: Partial<TotemSelection>) => onChange({ ...value, ...patch });
  const dormant = Boolean(state && (state.dormant || state.essence === 0));
  const traits = totemTraits(value, personalPoints, catalog, dormant), problems = totemCreationProblems(value, personalPoints, catalog);
  const initialTraits = totemTraits(value, personalPoints, catalog, false, true);
  const numberChange = (raw: string, maximum: number, apply: (value: number) => void) => { const number = Number(raw); if (Number.isSafeInteger(number) && number >= 0 && number <= maximum) apply(number); };
  const name = (id: string) => { const power = catalog.powers.find(power => power.id === id); return power ? locale === "pt-BR" ? catalog.presentation.powers[id]?.name ?? power.name : power.name : id; };
  return <TotemReference catalog={catalog}>
    <details className="wtf-rule-disclosure wtf-totem-editor" open><summary>{value.name || t("werewolf.totemConfigure")}</summary>
      <p className="wtf-rule-field">{t("werewolf.totemEditorNote")}</p>
      <div className="wtf-totem-editor-grid">
        <label>{t("ui.name")}<Input value={value.name} onChange={event => change({ name: event.target.value })}/></label>
        <label>{t("werewolf.totemFields.concept")}<Input value={value.concept} onChange={event => change({ concept: event.target.value })}/></label>
        <label>{t("werewolf.totemFields.aspiration")}<Input value={value.aspiration} onChange={event => change({ aspiration: event.target.value })}/></label>
        <label>{t("werewolf.totemExternalPoints")}<Input type="number" min={0} max={1000} step={1} value={value.externalPoints} onChange={event => numberChange(event.target.value, 1000, externalPoints => change({ externalPoints }))}/></label>
      </div>
      <p className="wtf-rule-field">{t("werewolf.totemPointsSummary", { personal: personalPoints, external: value.externalPoints, total: traits.points })}</p>
      <p className="wtf-rule-field"><strong>{t("werewolf.totemFields.rank")}:</strong>{" "}{traits.rank ? `${traits.rank.rank} · ${traits.rank.title}` : t("werewolf.totemUnallocatedRank")}</p>
      <div className="wtf-totem-attribute-grid">{TOTEM_ATTRIBUTES.map(attribute => <label key={attribute}>{t(`werewolf.totemFields.${attribute}`)}<Input type="number" min={0} max={15} step={1} value={value.attributes[attribute]} onChange={event => numberChange(event.target.value, 15, dots => change({ attributes: { ...value.attributes, [attribute]: dots } }))}/></label>)}</div>
      <p className="wtf-rule-field">{t("werewolf.totemAttributesSummary", { spent: initialTraits.total, budget: initialTraits.points })}</p>
      <div className="wtf-totem-editor-grid">
        <label>{t("werewolf.totemFields.size")}<Input type="number" min={0} max={1000} step={1} value={value.size} onChange={event => numberChange(event.target.value, 1000, size => change({ size }))}/></label>
        <label>{t("werewolf.totemSpeciesFactor")}<Input type="number" min={0} max={1000} step={1} value={value.speciesFactor} onChange={event => numberChange(event.target.value, 1000, speciesFactor => change({ speciesFactor }))}/></label>
        <label>{t("werewolf.totemFields.ban")}<Textarea key={value.instanceId + value.ban} defaultValue={value.ban} onBlur={event => change({ ban: event.target.value })}/></label>
        <label>{t("werewolf.totemFields.bane")}<Textarea key={value.instanceId + value.bane} defaultValue={value.bane} onBlur={event => change({ bane: event.target.value })}/></label>
      </div>
      <dl className="wtf-totem-sample">{(["corpus", "willpower", "initiative", "defense", "speed", "essenceMaximum"] as const).map(field => <div key={field}><dt>{t(field === "essenceMaximum" ? "werewolf.essenceMaximum" : `werewolf.totemFields.${field}`)}:</dt>{" "}<dd>{traits[field]}</dd></div>)}</dl>
      {children}
      {problems.length > 0 && <div role="status" className="wtf-totem-problems"><strong>{t("werewolf.totemIncomplete")}:</strong>{problems.map(problem => <p key={problem}>{t(problem === "unallocatedPowers" ? "werewolf.totemUnallocatedPowers" : `werewolf.totemProblem.${problem}`)}</p>)}</div>}
      <details className="wtf-rule-disclosure"><summary>{t("werewolf.totemFields.influences")}</summary>
        <p className="wtf-rule-field">{t("werewolf.totemInfluenceSummary", { spent: initialTraits.influenceDots, budget: initialTraits.rank?.rank ?? 0, exchanged: initialTraits.influenceExchanges })}</p>
        {value.influences.map(influence => <div className="wtf-totem-influence-row" key={influence.instanceId}>
          <label>{t("werewolf.totemDomain")}<Input value={influence.domain} onChange={event => change({ influences: value.influences.map(item => item.instanceId === influence.instanceId ? { ...item, domain: event.target.value } : item) })}/></label>
          <label>{t("werewolf.fetishDots")}<Input type="number" min={0} max={1000} step={1} value={influence.dots} onChange={event => numberChange(event.target.value, 1000, dots => change({ influences: value.influences.map(item => item.instanceId === influence.instanceId ? { ...item, dots } : item) }))}/></label>
          <Button type="button" size="sm" variant="outline" aria-label={t("werewolf.totemRemoveInfluence", { name: influence.domain })} onClick={() => change({ influences: value.influences.filter(item => item.instanceId !== influence.instanceId) })}>{t("common.remove")}</Button>
        </div>)}
        <Button type="button" size="sm" variant="outline" onClick={() => change({ influences: [...value.influences, { instanceId: createRandomId(), domain: "", dots: 0 }] })}>{t("werewolf.totemAddInfluence")}</Button>
      </details>
      {(["numen", "manifestation"] as const).map(kind => {
        const key = kind === "numen" ? "numina" : "manifestations";
        return <details className="wtf-rule-disclosure" key={kind}><summary>{t(`werewolf.totemFields.${key}`)}</summary>
          <p className="wtf-rule-field">{kind === "numen" ? t("werewolf.totemNuminaSummary", { spent: value.numina.length, budget: initialTraits.numinaBudget }) : t("werewolf.totemManifestationSummary", { budget: initialTraits.rank?.rank ?? 0, exchanged: initialTraits.manifestExchanges })}</p>
          <Dialog><DialogTrigger asChild><Button type="button" size="sm" variant="outline">{t(kind === "numen" ? "werewolf.totemChooseNumina" : "werewolf.totemChooseManifestations")}</Button></DialogTrigger>
            <DialogContent className="wtf-catalog-dialog"><DialogHeader><DialogTitle>{t(`werewolf.totemFields.${key}`)}</DialogTitle><DialogDescription>{t("werewolf.totemPowerSelectionNote")}</DialogDescription></DialogHeader>
              <TotemPowerPicker kind={kind} value={value} onChange={onChange} personalPoints={personalPoints} catalog={catalog}/>
              <DialogFooter><DialogClose asChild><Button type="button" size="sm" variant="outline">{t("common.close")}</Button></DialogClose></DialogFooter>
            </DialogContent>
          </Dialog>
          {value[key].map(id => {
            const definition = catalog.powers.find(power => power.id === id && power.kind === kind);
            const remove = <Button type="button" size="sm" variant="outline" disabled={id === "manifestation:twilight-form"} aria-label={t("werewolf.totemRemovePower", { name: name(id) })} onClick={() => change({ [key]: value[key].filter(powerId => powerId !== id) })}>{t("common.remove")}</Button>;
            return definition ? <PassiveRules key={id} rule={definition} reference={{ presentation: catalog.presentation.powers }}>{remove}</PassiveRules>
              : <div key={id}><p>{t("werewolf.totemUnavailablePower", { id })}</p>{remove}</div>;
          })}
        </details>;
      })}
      <TotemImprovements value={value} onChange={onChange} personalPoints={personalPoints} catalog={catalog}/>
      <label>{t("ui.notes")}<Textarea key={value.instanceId + value.notes} defaultValue={value.notes} onBlur={event => change({ notes: event.target.value })}/></label>
      {state && onStateChange && <details className="wtf-rule-disclosure"><summary>{t("werewolf.totemResources")}</summary>
        <p className="wtf-rule-field">{t("werewolf.totemResourcesNote")}</p>
        <label>{t("werewolf.totemDormancy")}<RuleSelect value={state.dormant ? "dormant" : "active"} onChange={status => onStateChange({ ...state, dormant: status === "dormant" })} options={[{ value: "active", label: t("werewolf.totemNotDeclaredDormant"), localized: true }, { value: "dormant", label: t("werewolf.totemDormant"), localized: true }]}/></label>
        {state.essence === 0 && <p className="wtf-rule-field">{t("werewolf.totemZeroEssence")}</p>}
        <strong>{t("werewolf.totemFields.essence")}</strong><ResourceTrack label={t("werewolf.totemFields.essence")} current={Math.min(state.essence, traits.essenceMaximum)} maximum={traits.essenceMaximum} onChange={essence => onStateChange({ ...state, essence })}/>
        <strong>{t("werewolf.totemFields.willpower")}</strong><ResourceTrack label={t("werewolf.totemFields.willpower")} current={Math.min(state.willpower, traits.willpower)} maximum={traits.willpower} onChange={willpower => onStateChange({ ...state, willpower })}/>
        {(state.essence > traits.essenceMaximum || state.willpower > traits.willpower) && <p className="wtf-rule-field">{t("werewolf.totemPreservedResources", { essence: state.essence, willpower: state.willpower })}</p>}
        <strong>{t("werewolf.totemFields.corpus")}</strong><div className="health-track" role="group" aria-label={t("werewolf.totemCorpusMarked", { damage: state.damage.length, maximum: traits.corpus })}>
          {Array.from({ length: traits.corpus }, (_, index) => <button type="button" key={index} className={`health-box ${state.damage[index] ?? "empty"}`} onClick={() => onStateChange({ ...state, damage: cycleHealthDamage(state.damage, traits.corpus, index) })}
            aria-label={t("ui.healthBoxChange", { index: index + 1, state: t(state.damage[index] ? ({ bashing: "ui.damageBashing", lethal: "ui.damageLethal", aggravated: "ui.damageAggravated" } as const)[state.damage[index]] : "ui.damageEmpty") })}><span aria-hidden="true"/></button>)}
        </div><p className="wtf-rule-field">{t("werewolf.totemCorpusMarked", { damage: state.damage.length, maximum: traits.corpus })}</p>
        <Button type="button" size="sm" variant="ghost" disabled={!state.damage.length} onClick={() => onStateChange({ ...state, damage: [] })}>{t("ui.heal")}</Button>
        <p className="wtf-rule-field">{t("werewolf.totemNoWoundPenalty")}</p>
      </details>}
      <Dialog><DialogTrigger asChild><Button type="button" size="sm" variant="outline">{t("werewolf.totemRemove")}</Button></DialogTrigger>
        <DialogContent><DialogHeader><DialogTitle>{t("werewolf.totemRemove")}</DialogTitle><DialogDescription>{t("werewolf.totemRemoveNote")}</DialogDescription></DialogHeader>
          <DialogFooter><DialogClose asChild><Button type="button" size="sm" variant="outline">{t("common.close")}</Button></DialogClose><DialogClose asChild><Button type="button" size="sm" variant="outline" onClick={() => onChange(null)}>{t("common.remove")}</Button></DialogClose></DialogFooter>
        </DialogContent>
      </Dialog>
    </details>
  </TotemReference>;
}
