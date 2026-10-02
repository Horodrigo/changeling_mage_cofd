"use client";

import { useId, useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { RuleSelect } from "@/app/workspace/rule-select";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useLanguage, type MessageKey } from "@/lib/i18n";
import type { FacetDefinition, GiftDefinition, WerewolfGiftCatalog } from "./catalogs/gifts";
import type { AuspiceDefinition, RenownId, TribeDefinition } from "./catalogs/reference";
import { creationGiftSelection, type WerewolfCreationChoices } from "./creation-rules";
import "./styles/traits.css";
import "./styles/builder.css";

const RULE_FIELDS = [
  ["cost", "ui.cost"], ["dicePool", "ui.dicePool"], ["action", "ui.action"], ["duration", "ui.duration"],
  ["activationRequirement", "werewolf.activationRequirement"], ["effect", "ui.effect"], ["options", "werewolf.options"],
  ["dramaticFailure", "ui.dramaticFailure"], ["failure", "ui.failure"], ["success", "ui.success"], ["exceptionalSuccess", "ui.exceptionalSuccess"],
] as const satisfies ReadonlyArray<readonly [keyof FacetDefinition, MessageKey]>;

/** Only presentation changes with locale; there are no activation or resource-changing actions. */
export function FacetRules({ facet, gifts }: { facet: FacetDefinition; gifts: WerewolfGiftCatalog }) {
  const { locale, t } = useLanguage();
  const translated = locale === "pt-BR" ? gifts.presentation[facet.id] : undefined;
  return <>
    <p className="wtf-rule-field">{translated?.description ?? facet.description}</p>
    {RULE_FIELDS.map(([field, label]) => facet[field] ? <p className="wtf-rule-field" key={field}>
      <strong>{t(label)}:</strong>{" "}{translated?.[field] ?? facet[field]}
    </p> : null)}
    <small>{t("conditions.sourcePage", { source: facet.source, page: facet.additionalPages?.length ? `${facet.page}–${facet.additionalPages.at(-1)}` : facet.page })}</small>
  </>;
}

type Props = {
  value: WerewolfCreationChoices; onChange: (value: WerewolfCreationChoices) => void;
  auspice: AuspiceDefinition; tribe: TribeDefinition; gifts: WerewolfGiftCatalog;
};

export function CreationGifts(props: Props) {
  const { value, onChange, auspice, tribe, gifts } = props;
  const { locale, t } = useLanguage();
  const grants = creationGiftSelection(auspice, tribe, value.renown_choice as RenownId, gifts.gifts, value);
  const name = (item: GiftDefinition | FacetDefinition) => locale === "pt-BR" ? gifts.presentation[item.id]?.name ?? item.name : item.name;
  return <section className="wtf-creation-gifts"><h3>{t("werewolf.moonGift")}</h3><p>{t("werewolf.automaticMoonFacets")}</p>
    {grants.moonFacetIds.map(id => {
      const facet = gifts.gifts.flatMap(gift => gift.facets).find(facet => facet.id === id)!;
      return <details className="wtf-rule-disclosure" key={id}><summary>{name(facet)} · {facet.level}</summary><FacetRules facet={facet} gifts={gifts}/></details>;
    })}
    {(["shadow", "wolf"] as const).map(kind => {
      const key = kind === "shadow" ? "shadow_facets" : "wolf_facets";
      return <section key={kind}><div className="panel-heading"><div><h3>{t(kind === "shadow" ? "werewolf.shadowGift" : "werewolf.wolfGift")}</h3>
        <p>{t("werewolf.selectedFacets", { selected: value[key].length, required: kind === "shadow" ? grants.shadowFacetCount : grants.wolfFacetCount })}</p></div>
        <Dialog><DialogTrigger asChild><Button type="button" size="sm" variant="outline">{t("werewolf.selectFacetPrompt")}</Button></DialogTrigger>
          <DialogContent className="wtf-catalog-dialog"><DialogHeader><DialogTitle>{t(kind === "shadow" ? "werewolf.shadowGift" : "werewolf.wolfGift")}</DialogTitle><DialogDescription>{t("werewolf.selectedFacets", { selected: value[key].length, required: kind === "shadow" ? grants.shadowFacetCount : grants.wolfFacetCount })}</DialogDescription></DialogHeader>
            <CreationFacetCatalog {...props} kind={kind}/><DialogFooter><DialogClose asChild><Button type="button" size="sm" variant="outline">{t("common.close")}</Button></DialogClose></DialogFooter>
          </DialogContent>
        </Dialog></div>
        {value[key].map(id => {
          const parent = gifts.gifts.find(gift => gift.facets.some(facet => facet.id === id)), facet = parent?.facets.find(facet => facet.id === id);
          return <div className="wtf-selected-power" key={id}>
            {facet && parent ? <details className="wtf-rule-disclosure"><summary>{name(facet)} · {name(parent)} · {t(`werewolf.renownNames.${facet.renown}`)}</summary><FacetRules facet={facet} gifts={gifts}/></details> : <p>{t("werewolf.missingSelectedFacet", { id })}</p>}
            <Button type="button" size="sm" variant="outline" aria-label={t("common.remove") + ": " + (facet ? name(facet) : id)} onClick={() => onChange({ ...value, [key]: value[key].filter(item => item !== id) })}>{t("common.remove")}</Button>
          </div>;
        })}
      </section>;
    })}
  </section>;
}

export function CreationFacetCatalog({ value, onChange, auspice, tribe, gifts, kind }: Props & { kind: "shadow" | "wolf" }) {
  const { locale, t } = useLanguage();
  const controlId = useId();
  const [search, setSearch] = useState(""), [renownFilter, setRenownFilter] = useState("all"), [giftFilter, setGiftFilter] = useState("all");
  const grants = creationGiftSelection(auspice, tribe, value.renown_choice as RenownId, gifts.gifts, value);
  const name = (item: GiftDefinition | FacetDefinition) => locale === "pt-BR" ? gifts.presentation[item.id]?.name ?? item.name : item.name;
  const matches = (gift: GiftDefinition, facet: FacetDefinition) => (renownFilter === "all" || facet.renown === renownFilter)
    && `${name(gift)} ${name(facet)} ${locale === "pt-BR" ? gifts.presentation[facet.id]?.description ?? facet.description : facet.description}`.toLocaleLowerCase(locale).includes(search.trim().toLocaleLowerCase(locale));
  const toggle = (key: "shadow_facets" | "wolf_facets", id: string) => onChange({
    ...value, [key]: value[key].includes(id) ? value[key].filter(item => item !== id) : [...value[key], id],
  });
  return <div className="wtf-selection-catalog">
    <div className="catalog-filters"><Input value={search} onChange={event => setSearch(event.target.value)} placeholder={t("werewolf.searchFacets")} aria-label={t("werewolf.searchFacets")}/>
      <label>{t("werewolf.renown")}<RuleSelect value={renownFilter} onChange={setRenownFilter} options={[{ value: "all", label: t("werewolf.allRenown"), localized: true }, ...(["Cunning", "Glory", "Honor", "Purity", "Wisdom"] as const).map(id => ({ value: id, label: t(`werewolf.renownNames.${id}`), localized: true }))]}/></label>
      <label>{t("werewolf.gifts")}<RuleSelect value={giftFilter} onChange={setGiftFilter} options={[{ value: "all", label: t("werewolf.allGifts"), localized: true }, ...gifts.gifts.filter(gift => gift.kind === kind).map(gift => ({ value: gift.id, label: name(gift), localized: true }))]}/></label>
    </div>
    {[kind].map(kind => {
      const key = kind === "shadow" ? "shadow_facets" : "wolf_facets";
      const selected = value[key];
      const required = kind === "shadow" ? grants.shadowFacetCount : grants.wolfFacetCount;
      const parents = gifts.gifts.filter(gift => gift.kind === kind);
      return <section key={kind}>
        <h3>{t(kind === "shadow" ? "werewolf.shadowGift" : "werewolf.wolfGift")}</h3>
        <p>{t("werewolf.selectedFacets", { selected: selected.length, required })}</p>
        {[...parents].filter(gift => (giftFilter === "all" || gift.id === giftFilter) && gift.facets.some(facet => matches(gift, facet))).sort((a, b) => name(a).localeCompare(name(b), locale)).map(gift => <div className="wtf-gift-choices" key={gift.id}>
          <h4>{name(gift)}</h4>
          {[...gift.facets].filter(facet => matches(gift, facet)).sort((a, b) => name(a).localeCompare(name(b), locale)).map(facet => {
            const checked = selected.includes(facet.id);
            const renown = t(`werewolf.renownNames.${facet.renown}`);
            const reason = grants.renown[facet.renown] < 1 ? t("werewolf.needsRenown", { renown })
              : kind === "shadow" && !grants.shadowGiftIds.includes(gift.id) ? t("werewolf.unfavoredCreationGift")
              : kind === "shadow" && gift.facets.some(other => other.id !== facet.id && selected.includes(other.id)) ? t("werewolf.duplicateCreationGift")
              : selected.length >= required && !checked ? t("werewolf.creationFacetLimit") : "";
            return <div className="wtf-facet-choice" key={facet.id}>
              <details className="wtf-rule-disclosure"><summary>{name(facet)} · {renown}</summary><FacetRules facet={facet} gifts={gifts}/></details>
              <label className="wtf-facet-toggle"><Checkbox aria-label={t("werewolf.selectFacet", { name: name(facet) })} aria-describedby={reason ? `${controlId}-${facet.id}` : undefined}
                checked={checked} disabled={!checked && Boolean(reason)} onCheckedChange={() => toggle(key, facet.id)}/></label>
              {reason && <small id={`${controlId}-${facet.id}`} className="wtf-facet-reason">{reason}</small>}
            </div>;
          })}
        </div>)}
        {selected.filter(id => !parents.some(gift => gift.facets.some(facet => facet.id === id))).map((id, index) => <div className="wtf-missing-facet" key={`${id}-${index}`}>
          <p>{t("werewolf.missingSelectedFacet", { id })}</p><Button variant="outline" size="sm" onClick={() => toggle(key, id)}>{t("common.remove")}</Button>
        </div>)}
      </section>;
    })}
  </div>;
}
