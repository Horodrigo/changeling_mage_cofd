"use client";

import { useId, useState } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { RuleSelect } from "@/app/workspace/rule-select";
import { useLanguage } from "@/lib/i18n";
import type { WerewolfRiteCatalog } from "./catalogs/rites";
import { RiteRules } from "./creation-rites";
import "./styles/sheet.css";

type Props = { catalog: WerewolfRiteCatalog; tribeId: string; knownIds: readonly string[]; selectedId: string; onSelect: (id: string) => void };

/** Purchase eligibility does not hide the reference or require a persisted Pack. */
export function RiteExperienceCatalog({ catalog, tribeId, knownIds, selectedId, onSelect }: Props) {
  const { locale, t } = useLanguage();
  const listId = useId();
  const [search, setSearch] = useState(""), [kind, setKind] = useState("all");
  const name = (id: string, fallback: string) => locale === "pt-BR" ? catalog.presentation.rites[id]?.name ?? fallback : fallback;
  const normalized = search.trim().toLocaleLowerCase(locale);
  const visible = [...catalog.rites].filter(rite => (kind === "all" || rite.kind === kind)
    && `${name(rite.id, rite.name)} ${rite.name} ${rite.source} ${locale === "pt-BR" ? catalog.presentation.rites[rite.id]?.description ?? rite.description : rite.description}`.toLocaleLowerCase(locale).includes(normalized))
    .sort((a, b) => name(a.id, a.name).localeCompare(name(b.id, b.name), locale));
  return <section className="wtf-rite-experience-catalog">
    <div className="catalog-filters"><Input value={search} onChange={event => setSearch(event.target.value)} placeholder={t("werewolf.searchRites")} aria-label={t("werewolf.searchRites")}/>
      <RuleSelect value={kind} onChange={setKind} options={[
        { value: "all", label: t("werewolf.allRites"), localized: true }, { value: "wolf", label: t("werewolf.wolfRites"), localized: true }, { value: "pack", label: t("werewolf.packRites"), localized: true },
      ]}/></div>
    {visible.length ? visible.map(rite => {
      const reason = knownIds.includes(rite.id) ? t("werewolf.experienceProblem.riteKnown")
        : rite.tribeId && rite.tribeId !== tribeId ? t("werewolf.experienceProblem.riteTribe") : "";
      return <div className="wtf-rite-experience-row" key={rite.id}>
        <details className="wtf-rule-disclosure"><summary>{name(rite.id, rite.name)} · {rite.dots}</summary><RiteRules rite={rite} catalog={catalog}/></details>
        <div><Button type="button" size="sm" variant={selectedId === rite.id ? "default" : "outline"} className="catalog-selection-action" disabled={Boolean(reason)} aria-describedby={reason ? `${listId}-${rite.id}` : undefined} aria-label={t("werewolf.selectRite", { name: name(rite.id, rite.name) })} onClick={() => onSelect(rite.id)}>{t("ui.select")}</Button></div>
        {reason && <p id={`${listId}-${rite.id}`} className="wtf-rite-reason">{reason}</p>}
      </div>;
    }) : <p>{t("werewolf.noMatchingRites")}</p>}
  </section>;
}

export function RiteExperiencePicker(props: Props) {
  const { locale, t } = useLanguage();
  const selected = props.catalog.rites.find(rite => rite.id === props.selectedId);
  const name = selected ? locale === "pt-BR" ? props.catalog.presentation.rites[selected.id]?.name ?? selected.name : selected.name : t("werewolf.selectRitePrompt");
  return <Dialog><DialogTrigger asChild><Button type="button" size="sm" variant="outline" className="catalog-selection-action"><span>{name}</span><Search/></Button></DialogTrigger>
    <DialogContent className="experience-dialog"><DialogHeader><DialogTitle>{t("werewolf.learnRite")}</DialogTitle><DialogDescription>{t("werewolf.riteLearningNote")}</DialogDescription></DialogHeader>
      <RiteExperienceCatalog {...props}/>
      <DialogFooter><DialogClose asChild><Button type="button" size="sm" variant="outline" className="catalog-dialog-done">{t("ui.close")}</Button></DialogClose></DialogFooter>
    </DialogContent>
  </Dialog>;
}
