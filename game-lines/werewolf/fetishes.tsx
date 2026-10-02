"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { RuleSelect } from "@/app/workspace/rule-select";
import { SheetHeading, DotValue } from "@/app/workspace/sheet-primitives";
import { useLanguage, type MessageKey } from "@/lib/i18n";
import type { FetishDefinition, FetishRulesText, WerewolfFetishCatalog } from "./catalogs/fetishes";
import type { WerewolfGiftCatalog } from "./catalogs/gifts";
import { catalogFetishSelection, customFetishSelection, fetishPresentation, type FetishSelection } from "./fetish-rules";
import { FacetRules } from "./creation-gifts";
import "./styles/fetishes.css";

const GENERAL_FIELDS = [
  ["identification", "werewolf.fetishIdentification"], ["creation", "werewolf.fetishCreation"], ["fetishActivation", "werewolf.fetishActivation"],
  ["talenCreation", "werewolf.talenCreation"], ["talenActivation", "werewolf.talenActivation"], ["talenFacet", "werewolf.talenFacet"], ["talenInfluence", "werewolf.talenInfluence"],
] as const satisfies ReadonlyArray<readonly [keyof FetishRulesText, MessageKey]>;

export function FetishGeneralRules({ catalog }: { catalog: WerewolfFetishCatalog }) {
  const { locale, t } = useLanguage();
  return <details className="wtf-rule-disclosure"><summary>{t("werewolf.fetishGeneralRules")}</summary>
    {GENERAL_FIELDS.map(([field, key]) => <p className="wtf-rule-field" key={field}><strong>{t(key)}:</strong>{" "}{locale === "pt-BR" ? catalog.presentation.rules[field] ?? catalog.rules[field] : catalog.rules[field]}</p>)}
    {catalog.rules.ratings.map(level => <p className="wtf-rule-field" key={level.dots}><strong>{t("werewolf.fetishRating", { dots: level.dots })}:</strong>{" "}{locale === "pt-BR" ? catalog.presentation.rules.ratings?.[level.dots] ?? level.effect : level.effect}</p>)}
    <small>{t("conditions.sourcePage", { source: catalog.rules.source, page: catalog.rules.additionalPages?.length ? `${catalog.rules.page}–${catalog.rules.additionalPages.at(-1)}` : catalog.rules.page })}</small>
  </details>;
}

export function FetishItemRules({ item, catalog, gifts, variantId }: { item: FetishDefinition; catalog: WerewolfFetishCatalog; gifts: WerewolfGiftCatalog; variantId?: string }) {
  const { locale, t } = useLanguage();
  const text = fetishPresentation(item, catalog, locale);
  const activationKey = item.kind === "fetish" ? "fetishActivation" : "talenActivation";
  const facet = item.facetId ? gifts.gifts.flatMap(gift => gift.facets).find(facet => facet.id === item.facetId) : undefined;
  return <>
    <p className="wtf-rule-field">{text.description}</p>
    <p className="wtf-rule-field"><strong>{t("werewolf.fetishActivation")}:</strong>{" "}{locale === "pt-BR" ? catalog.presentation.rules[activationKey] ?? catalog.rules[activationKey] : catalog.rules[activationKey]}</p>
    <p className="wtf-rule-field"><strong>{t("ui.effect")}:</strong>{" "}{text.effect}</p>
    {text.variants?.filter(variant => !variantId || variant.id === variantId).map(variant => <p className="wtf-rule-field" key={variant.id}><strong>{variant.name}:</strong>{" "}{variant.effect}</p>)}
    <small>{t("conditions.sourcePage", { source: item.source, page: item.additionalPages?.length ? `${item.page}–${item.additionalPages.at(-1)}` : item.page })}</small>
    {facet && <details className="wtf-rule-disclosure"><summary>{t("werewolf.fetishRelatedFacet")}: {locale === "pt-BR" ? gifts.presentation[facet.id]?.name ?? facet.name : facet.name}</summary>
      {item.kind === "talen" && <p className="wtf-rule-field">{locale === "pt-BR" ? catalog.presentation.rules.talenFacet ?? catalog.rules.talenFacet : catalog.rules.talenFacet}</p>}
      <FacetRules facet={facet} gifts={gifts}/>
    </details>}
  </>;
}

export function FetishCatalog({ catalog, gifts, onAdd }: { catalog: WerewolfFetishCatalog; gifts: WerewolfGiftCatalog; onAdd: (item: FetishDefinition) => void }) {
  const { locale, t } = useLanguage();
  const [search, setSearch] = useState(""), [kind, setKind] = useState("all"), [rating, setRating] = useState("all");
  const items = catalog.items.map(item => ({ item, text: fetishPresentation(item, catalog, locale) })).filter(({ item, text }) => (kind === "all" || item.kind === kind) && (rating === "all" || item.dots === Number(rating))
    && `${text.name} ${text.description} ${text.effect} ${item.source} ${text.variants?.map(variant => `${variant.name} ${variant.effect}`).join(" ") ?? ""}`.toLocaleLowerCase(locale).includes(search.trim().toLocaleLowerCase(locale))).sort((a, b) => a.text.name.localeCompare(b.text.name, locale));
  return <><div className="catalog-filters wtf-fetish-filters">
    <Input aria-label={t("werewolf.fetishSearch")} placeholder={t("werewolf.fetishSearch")} value={search} onChange={event => setSearch(event.target.value)}/>
    <label>{t("ui.type")}<RuleSelect value={kind} onChange={setKind} options={[{ value: "all", label: t("ui.all"), localized: true }, ...(["fetish", "talen"] as const).map(value => ({ value, label: t(`werewolf.${value}`), localized: true }))]}/></label>
    <label>{t("werewolf.fetishDots")}<RuleSelect value={rating} onChange={setRating} options={[{ value: "all", label: t("ui.all"), localized: true }, ...[1, 2, 3, 4, 5].map(dots => ({ value: String(dots), label: String(dots), localized: true }))]}/></label>
  </div><div className="wtf-fetish-catalog">{items.map(({ item, text }) => <div className="wtf-fetish-row" key={item.id}>
    <details className="wtf-rule-disclosure"><summary>{text.name} · {t(`werewolf.${item.kind}`)} · {item.dots}</summary><FetishItemRules item={item} catalog={catalog} gifts={gifts}/></details>
    <Button type="button" size="sm" variant="outline" onClick={() => onAdd(item)} aria-label={t("werewolf.fetishAddNamed", { name: text.name })}>{t("ui.add")}</Button>
  </div>)}{!items.length && <p>{t("werewolf.fetishNoMatches")}</p>}</div></>;
}

/** Explicit inventory edits only: never spends XP/Essence, grants a Facet, or consumes a Talen. */
export function FetishInventory({ value, onChange, catalog, gifts }: { value: FetishSelection[]; onChange: (value: FetishSelection[]) => void; catalog: WerewolfFetishCatalog; gifts: WerewolfGiftCatalog }) {
  const { locale, t } = useLanguage();
  const change = (id: string, patch: Partial<FetishSelection>) => onChange(value.map(item => item.instanceId === id ? { ...item, ...patch } : item));
  return <section className="wtf-fetish-inventory"><div className="panel-heading"><div><SheetHeading>{t("werewolf.fetishesAndTalens")}</SheetHeading><p className="wtf-rule-field">{t("werewolf.fetishInventoryNote")}</p></div>
    <Dialog><DialogTrigger asChild><Button type="button" size="sm" variant="outline">{t("werewolf.fetishAdd")}</Button></DialogTrigger>
      <DialogContent className="wtf-catalog-dialog"><DialogHeader><DialogTitle>{t("werewolf.fetishesAndTalens")}</DialogTitle><DialogDescription>{t("werewolf.fetishInventoryNote")}</DialogDescription></DialogHeader>
        <FetishCatalog catalog={catalog} gifts={gifts} onAdd={item => onChange([...value, catalogFetishSelection(item)])}/>
        <DialogFooter><Button type="button" size="sm" variant="outline" onClick={() => onChange([...value, customFetishSelection()])}>{t("werewolf.fetishCustomAdd")}</Button><DialogClose asChild><Button type="button" size="sm" variant="outline">{t("common.close")}</Button></DialogClose></DialogFooter>
      </DialogContent>
    </Dialog></div>
    <FetishGeneralRules catalog={catalog}/>
    {value.map(selection => {
      const definition = catalog.items.find(item => item.id === selection.catalogId);
      const item = definition ? fetishPresentation(definition, catalog, locale) : selection.custom;
      const name = item?.name || (selection.custom ? t("werewolf.fetishCustom") : t("werewolf.fetishMissing", { id: selection.catalogId ?? "" }));
      return <div className="wtf-fetish-row" key={selection.instanceId}><details className="wtf-rule-disclosure"><summary><span>{name}{item ? ` · ${t(`werewolf.${item.kind}`)}` : ""}</span>{item && <DotValue value={item.dots}/>}</summary>
        {definition && <FetishItemRules item={definition} catalog={catalog} gifts={gifts} variantId={selection.variantId}/>}
        {definition?.variants && <label>{t("werewolf.fetishVariant")}<RuleSelect value={selection.variantId || "__choose"} onChange={variantId => change(selection.instanceId, { variantId: variantId === "__choose" ? undefined : variantId })} options={[
          { value: "__choose", label: t("werewolf.fetishChooseVariant"), localized: true }, ...(selection.variantId && !definition.variants.some(variant => variant.id === selection.variantId) ? [{ value: selection.variantId, label: t("werewolf.fetishMissing", { id: selection.variantId }), localized: true }] : []),
          ...fetishPresentation(definition, catalog, locale).variants!.map(variant => ({ value: variant.id, label: variant.name, localized: true })),
        ]}/></label>}
        {selection.custom && <div className="wtf-fetish-custom">
          <label>{t("ui.name")}<Input value={selection.custom.name} onChange={event => change(selection.instanceId, { custom: { ...selection.custom!, name: event.target.value } })}/></label>
          <label>{t("ui.type")}<RuleSelect value={selection.custom.kind} onChange={kind => change(selection.instanceId, { custom: { ...selection.custom!, kind: kind as "fetish" | "talen" } })} options={(["fetish", "talen"] as const).map(kind => ({ value: kind, label: t(`werewolf.${kind}`), localized: true }))}/></label>
          <label>{t("werewolf.fetishDots")}<RuleSelect value={String(selection.custom.dots)} onChange={dots => change(selection.instanceId, { custom: { ...selection.custom!, dots: Number(dots) } })} options={[1, 2, 3, 4, 5].map(dots => ({ value: String(dots), label: String(dots), localized: true }))}/></label>
          <label>{t("ui.descriptionLabel")}<Textarea value={selection.custom.description} onChange={event => change(selection.instanceId, { custom: { ...selection.custom!, description: event.target.value } })}/></label>
          <label>{t("ui.effect")}<Textarea value={selection.custom.effect} onChange={event => change(selection.instanceId, { custom: { ...selection.custom!, effect: event.target.value } })}/></label>
        </div>}
        {item?.kind === "talen" && <label>{t("werewolf.fetishQuantity")}<Input type="number" min={0} step={1} value={selection.quantity} onChange={event => { const quantity = Number(event.target.value); if (Number.isSafeInteger(quantity) && quantity >= 0) change(selection.instanceId, { quantity }); }}/></label>}
        <label>{t("werewolf.fetishSpirit")}<Input value={selection.spirit} onChange={event => change(selection.instanceId, { spirit: event.target.value })}/></label>
        <label>{t("ui.notes")}<Textarea value={selection.notes} onChange={event => change(selection.instanceId, { notes: event.target.value })}/></label>
      </details><Button type="button" size="sm" variant="outline" aria-label={t("werewolf.fetishRemoveNamed", { name })} onClick={() => onChange(value.filter(item => item.instanceId !== selection.instanceId))}>{t("common.remove")}</Button></div>;
    })}
  </section>;
}
