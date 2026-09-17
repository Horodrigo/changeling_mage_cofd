"use client";

import { useState } from "react";
import { Plus, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ANIMALS, animalPresentation } from "@/lib/companions";
import { useLanguage } from "@/lib/i18n";
import { alphabetical } from "@/lib/option-order";
import { createRandomId } from "@/lib/random-id";
import { ConfirmAction } from "./confirm-action";
import { RuleSelect } from "./rule-select";

export type SelectedCondition = {
  id: string;
  persistent: boolean;
  instanceId?: string;
  animalId?: string;
  animalName?: string;
};

export type ConditionDefinition = {
  id: string;
  name: string;
  originalName: string;
  category: string;
  description: string;
  penalty?: string;
  resolution?: string;
  beat?: string;
  persistent?: boolean;
  sourceCode: string;
  page: number | string;
};

/** Core condition UI. Bonded is a repeatable general Condition with an attached animal. */
export function ConditionManager({ selected, catalog, onChange }: {
  selected: SelectedCondition[];
  catalog: readonly ConditionDefinition[];
  onChange: (value: SelectedCondition[]) => void;
}) {
  const { locale, t } = useLanguage();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Todas");
  const [bondedAnimal, setBondedAnimal] = useState(ANIMALS[0]?.id ?? "");
  const chosen = new Map(selected.map(item => [item.id, item]));
  const bonded = selected.filter(item => item.id === "bonded");
  const categories = ["Todas", ...Array.from(new Set(catalog.map(item => item.category)))];
  const filtered = alphabetical(catalog, item => item.name, locale).filter(condition =>
    (category === "Todas" || condition.category === category) &&
    `${condition.name} ${condition.originalName} ${condition.description} ${condition.penalty ?? ""} ${condition.sourceCode}`.toLocaleLowerCase(locale).includes(search.toLocaleLowerCase(locale)),
  );
  const find = (id: string) => catalog.find(item => item.id === id);

  return <div className="condition-manager">
    <div className="selected-conditions">
      {selected.map(saved => {
        const condition = find(saved.id);
        if (!condition) return null;
        const animal = ANIMALS.find(item => item.id === saved.animalId) ?? ANIMALS[0];
        return <details key={saved.instanceId ?? `${condition.id}-${selected.indexOf(saved)}`} className="selected-condition">
          <summary><span><strong>{condition.name}{saved.id === "bonded" && animal ? `: ${animalPresentation(animal, locale).name}` : ""}{saved.persistent ? " [P]" : ""}</strong><small>{t("conditions.sourcePage", { source: condition.sourceCode, page: condition.page })}</small></span>
            {saved.id === "bonded" ? <ConfirmAction trigger={<Button type="button" size="icon" variant="ghost" aria-label={t("conditions.removeNamed", { name: condition.name })}><X /></Button>} title={t("conditions.removeBondedTitle")} description={t("conditions.removeBondedDescription")} action={t("conditions.removeBondedAction")} onConfirm={() => onChange(selected.filter(item => item !== saved))}/> : <Button type="button" size="icon" variant="ghost" onClick={event => { event.preventDefault(); event.stopPropagation(); onChange(selected.filter(item => item !== saved)); }} aria-label={t("conditions.removeNamed", { name: condition.name })}><X /></Button>}
          </summary>
          <div className="selected-condition-body"><p>{condition.description}</p>{condition.penalty && <p className="condition-penalty"><b>{t("conditions.effectLabel")}</b> {condition.penalty}</p>}<p><b>{t("conditions.resolutionLabel")}</b> {condition.resolution ?? t("conditions.listedSourceResolution")}</p>{condition.beat && <p><b>{t("conditions.beatLabel")}</b> {condition.beat}</p>}</div>
        </details>;
      })}
      {!selected.length && <em>{t("conditions.noConditions")}</em>}
    </div>
    <Dialog>
      <DialogTrigger asChild><Button type="button" size="sm" variant="outline" className="catalog-selection-action"><Plus /> {t("conditions.selectCondition")}</Button></DialogTrigger>
      <DialogContent className="condition-dialog">
        <DialogHeader><DialogTitle>{t("conditions.selectCondition")}</DialogTitle><DialogDescription>{t("conditions.selectDescription")}</DialogDescription></DialogHeader>
        <div className="condition-filters"><label><Search /><Input value={search} onChange={event => setSearch(event.target.value)} placeholder={t("conditions.search")}/></label><RuleSelect value={categories.includes(category) ? category : "Todas"} onChange={setCategory} options={categories.map(value => ({ value, label: value === "Todas" ? t("conditions.all") : value }))}/></div>
        <div className="condition-catalog">{filtered.map(condition => {
          const saved = chosen.get(condition.id);
          const isBonded = condition.id === "bonded";
          return <article key={condition.id} className={saved ? "selected" : ""}>
            <div><strong>{condition.name}{saved?.persistent ? " [P]" : ""}</strong><small>{condition.originalName !== condition.name ? t("conditions.originalSourcePage", { original: condition.originalName, source: condition.sourceCode, page: condition.page }) : t("conditions.sourcePage", { source: condition.sourceCode, page: condition.page })}</small></div>
            <p>{condition.description}</p>{condition.penalty && <p className="condition-penalty"><b>{t("conditions.effectLabel")}</b> {condition.penalty}</p>}<p><b>{t("conditions.resolutionLabel")}</b> {condition.resolution ?? t("conditions.listedSourceResolution")}</p>{condition.beat && <p><b>{t("conditions.beatLabel")}</b> {condition.beat}</p>}
            {isBonded && <div className="companion-form-grid"><label>{t("conditions.bondedAnimal")}<RuleSelect value={bondedAnimal} onChange={setBondedAnimal} options={ANIMALS.map(item => animalPresentation(item, locale)).map(item => ({ value: item.id, label: item.name }))}/></label></div>}
            {!isBonded && <label className="persistent-toggle"><input type="checkbox" checked={saved?.persistent ?? condition.persistent ?? false} onChange={event => { const persistent = event.target.checked; onChange(saved ? selected.map(item => item.id === condition.id ? { ...item, persistent } : item) : [...selected, { id: condition.id, persistent }]); }}/> {t("conditions.persistent")} [P]</label>}
            <Button type="button" size="sm" className="catalog-selection-action" variant={saved && !isBonded ? "ghost" : "outline"} onClick={() => onChange(saved && !isBonded ? selected.filter(item => item.id !== condition.id) : [...selected, { id: condition.id, persistent: condition.persistent ?? false, instanceId: createRandomId(), ...(isBonded ? { animalId: bondedAnimal, animalName: "" } : {}) }])}>
              {saved && !isBonded ? t("conditions.remove") : isBonded && bonded.length ? t("conditions.addAnother") : t("conditions.add")}
            </Button>
          </article>;
        })}{!filtered.length && <em>{t("conditions.noMatches")}</em>}</div>
        <DialogFooter><DialogClose asChild><Button type="button" size="sm" className="catalog-dialog-done">{t("conditions.done")}</Button></DialogClose></DialogFooter>
      </DialogContent>
    </Dialog>
  </div>;
}
