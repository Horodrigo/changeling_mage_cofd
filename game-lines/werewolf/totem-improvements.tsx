"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { RuleSelect } from "@/app/workspace/rule-select";
import { useLanguage } from "@/lib/i18n";
import { createRandomId } from "@/lib/random-id";
import { PassiveRules } from "./passives";
import type { WerewolfTotemCatalog } from "./catalogs/totem";
import { effectiveTotem, recordTotemImprovement, removeTotemImprovement, TOTEM_ATTRIBUTES, totemImprovementProblems, type TotemAttribute, type TotemImprovement, type TotemSelection } from "./totem-rules";

/** Externally resolved funding, recorded locally. This is not a Pack XP account or an individual XP transaction. */
export function TotemImprovements({ value, onChange, personalPoints, catalog }: {
  value: TotemSelection; onChange: (value: TotemSelection) => void; personalPoints: number; catalog: WerewolfTotemCatalog;
}) {
  const { locale, t } = useLanguage();
  const [kind, setKind] = useState<TotemImprovement["kind"]>("attribute"), [target, setTarget] = useState("power"), [origin, setOrigin] = useState(""), [domain, setDomain] = useState("");
  const current = effectiveTotem(value);
  const name = (id: string) => { const power = catalog.powers.find(item => item.id === id); return power ? locale === "pt-BR" ? catalog.presentation.powers[id]?.name ?? power.name : power.name : id; };
  const options = kind === "attribute" ? TOTEM_ATTRIBUTES.map(attribute => ({ value: attribute, label: t(`werewolf.totemFields.${attribute}`), localized: true }))
    : kind === "influence" ? [...current.influences.map(item => ({ value: item.instanceId, label: `${item.domain} (${item.dots})`, localized: true })), { value: "new", label: t("werewolf.totemNewInfluence"), localized: true }]
    : [{ value: "__choose", label: t("ui.selectAnOption"), localized: true }, ...catalog.powers.filter(power => power.kind === "numen" && !current.numina.includes(power.id)).map(power => ({ value: power.id, label: name(power.id), localized: true })).sort((a, b) => a.label.localeCompare(b.label, locale))];
  const candidate = { ...value, improvements: [...(value.improvements ?? []), { id: "preview", kind, target: target === "new" ? "new-influence-preview" : target, experience: catalog.improvementCosts[kind], origin, createdAt: new Date().toISOString(), ...(kind === "influence" && target === "new" ? { domain } : {}) }] };
  const problems = totemImprovementProblems(candidate, personalPoints, catalog);
  const selectedPower = kind === "numen" ? catalog.powers.find(power => power.id === target) : undefined;
  const storedProblems = totemImprovementProblems(value, personalPoints, catalog);
  return <details className="wtf-rule-disclosure"><summary>{t("werewolf.totemImprovements")}</summary>
    <p className="wtf-rule-field">{t("werewolf.totemImprovementNote")}</p>
    <p className="wtf-rule-field">{t("werewolf.totemImprovementTotal", { amount: (value.improvements ?? []).reduce((sum, entry) => sum + entry.experience, 0) })}</p>
    <dl className="wtf-totem-sample">{TOTEM_ATTRIBUTES.map(attribute => <div key={attribute}><dt>{t(`werewolf.totemFields.${attribute}`)}:</dt>{" "}<dd>{current.attributes[attribute]}</dd></div>)}</dl>
    {current.influences.map(item => <p className="wtf-rule-field" key={item.instanceId}><strong>{item.domain}:</strong>{" "}{item.dots}</p>)}
    <p className="wtf-rule-field">{t("werewolf.totemEffectiveNumina", { amount: current.numina.length })}</p>
    {storedProblems.map(problem => <p className="wtf-rule-field" key={problem}>{t(`werewolf.totemImprovementProblem.${problem}`)}</p>)}
    <Dialog><DialogTrigger asChild><Button type="button" size="sm" variant="outline">{t("werewolf.totemRecordImprovement")}</Button></DialogTrigger>
      <DialogContent className="wtf-catalog-dialog"><DialogHeader><DialogTitle>{t("werewolf.totemRecordImprovement")}</DialogTitle><DialogDescription>{t("werewolf.totemImprovementNote")}</DialogDescription></DialogHeader>
        <div className="wtf-totem-editor-grid">
          <label>{t("ui.type")}<RuleSelect value={kind} onChange={raw => { const next = raw as TotemImprovement["kind"]; setKind(next); setTarget(next === "attribute" ? "power" : next === "influence" ? "new" : "__choose"); }} options={(["attribute", "influence", "numen"] as const).map(value => ({ value, label: t(`werewolf.totemImprovementKind.${value}`), localized: true }))}/></label>
          <label>{t("werewolf.totemImprovementTarget")}<RuleSelect value={target} onChange={setTarget} options={options}/></label>
          {kind === "influence" && target === "new" && <label>{t("werewolf.totemDomain")}<Input value={domain} onChange={event => setDomain(event.target.value)}/></label>}
          <label>{t("werewolf.totemImprovementOrigin")}<Input value={origin} onChange={event => setOrigin(event.target.value)}/></label>
        </div>
        <p className="wtf-rule-field"><strong>{t("ui.cost")}:</strong>{" "}{catalog.improvementCosts[kind]} {t("ui.experience")}</p>
        {selectedPower && <PassiveRules rule={selectedPower} reference={{ presentation: catalog.presentation.powers }}/>}
        {problems.map(problem => <p className="wtf-rule-field" key={problem}>{t(`werewolf.totemImprovementProblem.${problem}`)}</p>)}
        <DialogFooter><DialogClose asChild><Button type="button" size="sm" variant="outline">{t("common.close")}</Button></DialogClose>
          <Button type="button" size="sm" variant="outline" disabled={problems.length > 0 || !options.some(item => item.value === target)} onClick={() => { onChange(recordTotemImprovement(value, kind, target === "new" ? createRandomId() : target, origin, personalPoints, catalog, kind === "influence" && target === "new" ? domain : undefined)); setOrigin(""); if (kind === "numen") setTarget("__choose"); }}>{t("werewolf.totemRecordImprovement")}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    {(value.improvements ?? []).map(entry => {
      const label = entry.kind === "attribute" ? TOTEM_ATTRIBUTES.includes(entry.target as TotemAttribute) ? t(`werewolf.totemFields.${entry.target as TotemAttribute}`) : entry.target
        : entry.kind === "influence" ? current.influences.find(item => item.instanceId === entry.target)?.domain ?? entry.target : name(entry.target);
      const power = entry.kind === "numen" ? catalog.powers.find(power => power.id === entry.target) : undefined;
      let removable = true;
      try { removeTotemImprovement(value, entry.id, personalPoints, catalog); } catch { removable = false; }
      return <details className="wtf-rule-disclosure" key={entry.id}><summary>{label} · {entry.experience} {t("ui.experience")}</summary>
        <p className="wtf-rule-field"><strong>{t("werewolf.totemImprovementOrigin")}:</strong>{" "}{entry.origin}</p>
        <p className="wtf-rule-field">{t("werewolf.totemImprovementRecorded", { date: new Date(entry.createdAt).toLocaleDateString(locale) })}</p>
        {power && <PassiveRules rule={power} reference={{ presentation: catalog.presentation.powers }}/>}
        <Dialog><DialogTrigger asChild><Button type="button" size="sm" variant="outline" disabled={!removable} aria-label={t("werewolf.totemRemoveImprovement", { name: label })}>{t("common.remove")}</Button></DialogTrigger>
          <DialogContent><DialogHeader><DialogTitle>{t("werewolf.totemRemoveImprovement", { name: label })}</DialogTitle><DialogDescription>{t("werewolf.totemRemoveImprovementNote")}</DialogDescription></DialogHeader>
            <DialogFooter><DialogClose asChild><Button type="button" size="sm" variant="outline">{t("common.close")}</Button></DialogClose><DialogClose asChild><Button type="button" size="sm" variant="outline" onClick={() => onChange(removeTotemImprovement(value, entry.id, personalPoints, catalog))}>{t("common.remove")}</Button></DialogClose></DialogFooter>
          </DialogContent>
        </Dialog>
        {!removable && <p className="wtf-rule-field">{t("werewolf.totemImprovementDependent")}</p>}
      </details>;
    })}
  </details>;
}
