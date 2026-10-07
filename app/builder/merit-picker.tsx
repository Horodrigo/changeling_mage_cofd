"use client";

import { useState, type ReactNode } from "react";
import { Check, Plus, Search, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { MeritSelection } from "@/lib/core/character/character-types";
import { translate, useLanguage } from "@/lib/i18n";
import { meritConfigurationTitle } from "@/lib/core/character/merit-configuration";
import {
  meritPrerequisitesMet,
  meritRatingsFor,
  type MeritDefinition,
  type MeritPrerequisiteContext,
} from "@/lib/merits";
import { alphabetical, compareOptionLabels } from "@/lib/option-order";
import { Choice } from "./common-controls";
import { ConfirmAction } from "../workspace/confirm-action";
import { MeritCatalogVisibilityToggle } from "../merit-catalog-visibility-toggle";
import { createRandomId } from "@/lib/random-id";
import { experienceMeritDots } from "@/lib/merit-progression";
import { homebrewCategoryKeys } from "@/lib/homebrew";
import { meritPresentation } from "@/lib/merit-presentation";
import { meritCategoryLabel } from "@/lib/merit-ui";
import { meritMatchesDefinition, resolveMeritDefinition } from "@/lib/merit-identity";

export type MeritConfigurationRenderProps = {
  merit: MeritSelection;
  ownedMerits: NonNullable<MeritPrerequisiteContext["merits"]>;
  inline: boolean;
  onChange: (configuration: MeritSelection["configuration"]) => void;
};

export function MeritPicker({
  merits,
  setMerits,
  catalog,
  context,
  spent,
  budget,
  powerLabel,
  power,
  setPower,
  renderConfiguration,
  isInlineConfiguration,
  isEligible = meritPrerequisitesMet,
  categoryFor = (definition) => definition.category,
  confirmRemoval = () => false,
}: {
  merits: MeritSelection[];
  setMerits: (value: MeritSelection[]) => void;
  catalog: MeritDefinition[];
  context: MeritPrerequisiteContext;
  spent: number;
  budget: number;
  powerLabel?: string;
  power?: number;
  setPower?: (value: number) => void;
  renderConfiguration: (props: MeritConfigurationRenderProps) => ReactNode;
  isInlineConfiguration: (id: string) => boolean;
  isEligible?: (definition: MeritDefinition, context: MeritPrerequisiteContext) => boolean;
  categoryFor?: (definition: MeritDefinition) => string;
  confirmRemoval?: (definition: MeritDefinition | undefined) => boolean;
}) {
  const { locale, t } = useLanguage();
  const meritName = (definition: MeritDefinition) => meritPresentation(definition, locale).name;
  const categoryName = (category: string) => meritCategoryLabel(category, locale);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [showAllMerits, setShowAllMerits] = useState(false);
  const [catalogOpen, setCatalogOpen] = useState(false);
  const categoryKeys = (merit: MeritDefinition) => homebrewCategoryKeys(categoryFor(merit), merit.sourceId);
  const categories = [...new Set(catalog.flatMap(categoryKeys))].sort((left, right) => compareOptionLabels(categoryName(left), categoryName(right), locale));
  const normalizedSearch = search.trim().toLocaleLowerCase(locale);
  const experienceMerits = (context.merits ?? []).filter((merit) => experienceMeritDots(merit) > 0);
  const visibleCatalog = alphabetical(catalog, meritName, locale).filter((item) =>
    (showAllMerits || isEligible(item, context)) &&
    (isRepeatableDefinition(item) || !context.merits?.some((owned) => meritMatchesDefinition(owned, item, catalog)) || merits.some((owned) => meritMatchesDefinition(owned, item, catalog))) &&
    (category === "all" || categoryKeys(item).includes(category)) &&
    (!normalizedSearch || `${meritName(item)} ${item.name} ${item.source} ${meritPresentation(item, locale, catalog).prerequisites ?? ""} ${categoryKeys(item).join(" ")}`.toLocaleLowerCase(locale).includes(normalizedSearch))
  );
  const addMerit = (definition: MeritDefinition) => {
    if (!isEligible(definition, context) || (!isRepeatableDefinition(definition) && context.merits?.some((item) => meritMatchesDefinition(item, definition, catalog)))) return;
    if (!isRepeatableDefinition(definition) && merits.some((merit) => meritMatchesDefinition(merit, definition, catalog))) return;
    setMerits([...merits, { definitionId: definition.id, instanceId: createRandomId(), name: definition.name, dots: meritRatingsFor(definition)[0], sourceId: definition.sourceId, source: definition.source, configuration: {} }]);
  };
  return <>
    <div className="merit-heading"><div><h3>{t("ui.merits")}</h3><p>{t("ui.coreAndGameLineBooksGroupedByCategory")}</p></div>
      <div className="merit-heading-actions">
        <Badge variant={spent > budget ? "destructive" : "outline"}>{spent}/{budget} {t("ui.creationMeritDotsSpent")}</Badge>
        {powerLabel && power !== undefined && setPower && <Badge variant="outline">{powerLabel}: {power}</Badge>}
        <Button type="button" variant="outline" size="sm" className="builder-add-action" onClick={() => setCatalogOpen(true)}>{t("ui.addMerit")}</Button>
        {powerLabel && power !== undefined && setPower && <Button type="button" variant="outline" size="sm" className="builder-add-action" disabled={power >= 3 || spent + 5 > budget} onClick={() => setPower(power + 1)}>{t("ui.add5MeritDots", { p1: powerLabel })}</Button>}
        {powerLabel && power !== undefined && setPower && power > 1 && <Button type="button" variant="ghost" size="sm" className="builder-add-action" onClick={() => setPower(power - 1)}>{t("ui.remove", { p1: powerLabel })}</Button>}
      </div>
    </div>
    <div className="merit-picker">{merits.map((selection, index) => {
      const definition = resolveMeritDefinition(selection, catalog);
      const remove = () => setMerits(merits.filter((_, itemIndex) => itemIndex !== index));
      const needsConfirmation = confirmRemoval(definition);
      return <div className="merit-row configurable" key={`${selection.instanceId ?? index}-${selection.name}`} title={definition ? meritTooltip(definition, locale, catalog) : undefined}>
        <div className="merit-row-main"><div><strong>{definition ? meritName(definition) : selection.name}{meritConfigurationTitle(selection.configuration) ? `: ${meritConfigurationTitle(selection.configuration)}` : ""}</strong>
          <small>{definition ? `${categoryName(categoryFor(definition))} · ${definition.source} · p. ${definition.page || "—"}` : selection.source}{selection.grantedBy ? <> · {t("ui.firstDotFree")}</> : null}</small></div>
          <Choice label={t("ui.dots")} value={String(selection.dots)} setValue={(value) => { const next = [...merits]; next[index] = { ...selection, dots: Number(value) }; setMerits(next); }} options={(definition ? meritRatingsFor(definition, Math.max(selection.dots, budget - spent + selection.dots)) : [1]).map(String)} />
          {!selection.grantedBy && (needsConfirmation
            ? <ConfirmAction trigger={<Button type="button" variant="ghost" size="icon" aria-label={`${t("ui.remove7d41cc")} ${definition ? meritName(definition) : selection.name}`}><Trash2 /></Button>} title={t("ui.removefc5df2", { p1: definition ? meritName(definition) : selection.name })} description={t("ui.theMeritAndLinkedBenefitsWillBeRemoved")} action={t("ui.remove7d41cc")} onConfirm={remove} />
            : <Button type="button" variant="ghost" size="icon" aria-label={`${t("ui.remove7d41cc")} ${definition ? meritName(definition) : selection.name}`} onClick={remove}><Trash2 /></Button>)}
        </div>
        {renderConfiguration({ merit: selection, ownedMerits: context.merits ?? [], inline: Boolean(definition && isInlineConfiguration(definition.id)), onChange: (configuration) => { const next = [...merits]; next[index] = { ...selection, configuration }; setMerits(next); } })}
      </div>;
    })}</div>
    {experienceMerits.length > 0 && <>
      <div className="merit-heading"><div><h3>{t("ui.experience")}</h3><p>{t("ui.experienceMeritsPreservedDuringEditing")}</p></div></div>
      <div className="merit-picker">{experienceMerits.map((selection, index) => {
        const definition = resolveMeritDefinition(selection, catalog);
        return <div className="merit-row configurable" key={`experience-${selection.instanceId ?? index}-${selection.name}`}>
          <div className="merit-row-main"><div><strong>{definition ? meritName(definition) : selection.name}{meritConfigurationTitle(selection.configuration) ? `: ${meritConfigurationTitle(selection.configuration)}` : ""}</strong><small>{definition ? `${definition.source} · p. ${definition.page || "—"}` : t("ui.experience")}</small></div><Badge variant="outline">{selection.dots} {t("ui.dots")}</Badge><Badge variant="outline">{experienceMeritDots(selection)} {t("ui.xp")}</Badge></div>
        </div>;
      })}</div>
    </>}
    <Dialog open={catalogOpen} onOpenChange={setCatalogOpen}><DialogContent className="merit-dialog"><DialogHeader><DialogTitle>{t("ui.selectMerits")}</DialogTitle><DialogDescription>{t("ui.searchByNameOrBrowseCategories")}</DialogDescription></DialogHeader>
      <div className="catalog-filters"><label className="merit-search"><Search aria-hidden="true" /><Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder={t("ui.searchMeritByNamePrerequisiteOrSource")} /></label><Choice label={t("ui.category")} value={category} setValue={setCategory} options={["all", ...categories]} optionLabels={{ all: t("ui.allCategories"), ...Object.fromEntries(categories.map((item) => [item, categoryName(item)])) }} /><MeritCatalogVisibilityToggle showAll={showAllMerits} setShowAll={setShowAllMerits} /></div>
      <div className="merit-catalog">{categories.map((catalogCategory) => {
        const items = visibleCatalog.filter((item) => categoryFor(item) === catalogCategory);
        if (!items.length) return null;
        return <section className="merit-category" key={catalogCategory}><h3>{categoryName(catalogCategory)} <Badge variant="outline">{items.length}</Badge></h3><div>{items.map((definition) => {
          const selected = merits.some((merit) => meritMatchesDefinition(merit, definition, catalog));
          const repeatable = isRepeatableDefinition(definition);
          const prerequisitesMet = isEligible(definition, context);
          const presented = meritPresentation(definition, locale, catalog);
          return <article className={selected ? "merit-option selected" : !prerequisitesMet ? "merit-option merit-option-locked" : "merit-option"} key={definition.id}><div><strong>{meritName(definition)}</strong><small>{definition.source} · p. {definition.page || "—"} · {definition.unbounded ? `${Math.min(...definition.ratings)}+` : meritRatingsFor(definition).map((rating) => "•".repeat(rating)).join(", ")}</small>{presented.prerequisites && <p className={`rule-detail${prerequisitesMet ? "" : " merit-prerequisites-missing"}`}><strong>{t("ui.prerequisites")}:</strong> {presented.prerequisites}</p>}<p>{presented.description}</p>{presented.levels?.map((level, index) => <p key={`${level.rating}-${index}`}><strong>{"•".repeat(level.rating)} {level.name}:</strong> {level.description}</p>)}</div><Button type="button" size="sm" className="catalog-selection-action" variant={selected ? "secondary" : "outline"} disabled={!prerequisitesMet || (selected && !repeatable)} onClick={() => addMerit(definition)}>{selected && !repeatable ? <><Check /> {t("ui.selected")}</> : <><Plus /> {repeatable && selected ? t("ui.newInstance") : t("ui.add")}</>}</Button></article>;
        })}</div></section>;
      })}{!visibleCatalog.length && <em>{t("ui.noMeritsMatchTheFilters")}</em>}</div><DialogFooter><DialogClose asChild><Button type="button" size="sm" className="catalog-dialog-done">{t("ui.done")}</Button></DialogClose></DialogFooter>
    </DialogContent></Dialog>
  </>;
}

function isRepeatableDefinition(definition: MeritDefinition) {
  return Boolean(definition.repeatable);
}

function meritTooltip(definition: MeritDefinition, locale: "pt-BR" | "en-US", catalog: readonly MeritDefinition[]) {
  const presented = meritPresentation(definition, locale, catalog);
  return presented.prerequisites ? `${translate(locale, "ui.prerequisites")}: ${presented.prerequisites}\n${presented.description}` : presented.description;
}
