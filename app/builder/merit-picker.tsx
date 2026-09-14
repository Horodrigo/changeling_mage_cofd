"use client";

import { useState, type ReactNode } from "react";
import { Check, Plus, Search, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { MeritSelection } from "@/lib/core/character/character-types";
import { useLanguage } from "@/lib/i18n";
import { meritConfigurationTitle } from "@/lib/core/character/merit-configuration";
import {
  meritPrerequisitesMet,
  meritRatingsFor,
  REPEATABLE_MERITS,
  UNBOUNDED_MERITS,
  type MeritDefinition,
  type MeritPrerequisiteContext,
} from "@/lib/merits";
import { alphabetical, compareOptionLabels } from "@/lib/option-order";
import { Choice } from "./common-controls";
import { ConfirmAction } from "../workspace/confirm-action";
import { MeritCatalogVisibilityToggle } from "../merit-catalog-visibility-toggle";
import { createRandomId } from "@/lib/random-id";

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
}: {
  merits: MeritSelection[];
  setMerits: (value: MeritSelection[]) => void;
  catalog: MeritDefinition[];
  context: MeritPrerequisiteContext;
  spent: number;
  budget: number;
  powerLabel: string;
  power: number;
  setPower: (value: number) => void;
  renderConfiguration: (props: MeritConfigurationRenderProps) => ReactNode;
  isInlineConfiguration: (name: string) => boolean;
}) {
  const { locale, tr } = useLanguage();
  const meritName = (definition: MeritDefinition) => locale === "pt-BR" ? definition.translatedName : definition.name;
  const categoryName = (category: string) => locale === "pt-BR" ? meritCategoryLabel(category) : category;
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [showAllMerits, setShowAllMerits] = useState(false);
  const [catalogOpen, setCatalogOpen] = useState(false);
  const categories = [...new Set(catalog.map((merit) => merit.category))].sort((left, right) => compareOptionLabels(categoryName(left), categoryName(right), locale));
  const normalizedSearch = search.trim().toLocaleLowerCase("pt-BR");
  const visibleCatalog = alphabetical(catalog, meritName, locale).filter((item) =>
    (showAllMerits || meritPrerequisitesMet(item, context)) &&
    (isRepeatableDefinition(item) || !context.merits?.some((owned) => owned.name === item.name) || merits.some((owned) => owned.name === item.name)) &&
    (category === "all" || item.category === category) &&
    (!normalizedSearch || `${item.translatedName} ${item.name} ${item.source} ${item.prerequisites ?? ""}`.toLocaleLowerCase("pt-BR").includes(normalizedSearch))
  );
  const addMerit = (definition: MeritDefinition) => {
    if (!meritPrerequisitesMet(definition, context) || (!isRepeatableDefinition(definition) && context.merits?.some((item) => item.name === definition.name))) return;
    if (!isRepeatableDefinition(definition) && merits.some((merit) => merit.name === definition.name)) return;
    setMerits([...merits, { instanceId: createRandomId(), name: definition.name, dots: meritRatingsFor(definition)[0], sourceId: definition.sourceId, source: definition.source, configuration: {} }]);
  };
  return <>
    <div className="merit-heading"><div><h3>{tr("Méritos", "Merits")}</h3><p>{tr("Core + livros da linha, reunidos por categoria. Você pode guardar pontos sem gastá-los.", "Core and game-line books, grouped by category. You may leave dots unspent.")}</p></div>
      <div className="merit-heading-actions">
        <Badge variant={spent > budget ? "destructive" : "outline"}>{spent}/{budget} {tr("pontos de Mérito usados na criação", "creation Merit dots spent")}</Badge>
        <Badge variant="outline">{powerLabel}: {power}</Badge>
        <Button type="button" variant="outline" size="sm" className="builder-add-action" onClick={() => setCatalogOpen(true)}>{tr("Adicionar Mérito", "Add Merit")}</Button>
        <Button type="button" variant="outline" size="sm" className="builder-add-action" disabled={power >= 3 || spent + 5 > budget} onClick={() => setPower(power + 1)}>{tr(`Adicionar ${powerLabel} (5 pontos de Mérito)`, `Add ${powerLabel} (5 Merit dots)`)}</Button>
        {power > 1 && <Button type="button" variant="ghost" size="sm" className="builder-add-action" onClick={() => setPower(power - 1)}>{tr(`Remover ${powerLabel}`, `Remove ${powerLabel}`)}</Button>}
      </div>
    </div>
    <div className="merit-picker">{merits.map((selection, index) => {
      const definition = catalog.find((item) => item.name === selection.name);
      const remove = () => setMerits(merits.filter((_, itemIndex) => itemIndex !== index));
      const needsConfirmation = ["Fae Mount", "Fae Pet", "Familiar", "Entitlement"].includes(selection.name);
      return <div className="merit-row configurable" key={`${selection.instanceId ?? index}-${selection.name}`} title={definition ? meritTooltip(definition, locale) : undefined}>
        <div className="merit-row-main"><div><strong>{definition ? meritName(definition) : selection.name}{meritConfigurationTitle(selection.configuration) ? `: ${meritConfigurationTitle(selection.configuration)}` : ""}</strong>
          <small>{definition ? `${categoryName(definition.category)} · ${definition.source} · p. ${definition.page || "—"}` : selection.source}{selection.grantedBy ? <> · {tr("primeiro ponto gratuito", "first dot free")}</> : null}</small></div>
          <Choice label={tr("Pontos", "Dots")} value={String(selection.dots)} setValue={(value) => { const next = [...merits]; next[index] = { ...selection, dots: Number(value) }; setMerits(next); }} options={(definition ? meritRatingsFor(definition, Math.max(selection.dots, budget - spent + selection.dots)) : [1]).map(String)} />
          {!selection.grantedBy && (needsConfirmation
            ? <ConfirmAction trigger={<Button type="button" variant="ghost" size="icon" aria-label={`${tr("Remover", "Remove")} ${definition ? meritName(definition) : selection.name}`}><Trash2 /></Button>} title={tr(`Remover ${definition ? meritName(definition) : selection.name}?`, `Remove ${definition ? meritName(definition) : selection.name}?`)} description={tr("O Mérito e benefícios vinculados serão removidos.", "The Merit and linked benefits will be removed.")} action={tr("Remover", "Remove")} onConfirm={remove} />
            : <Button type="button" variant="ghost" size="icon" aria-label={`${tr("Remover", "Remove")} ${definition ? meritName(definition) : selection.name}`} onClick={remove}><Trash2 /></Button>)}
        </div>
        {selection.name !== "Familiar" && renderConfiguration({ merit: selection, ownedMerits: context.merits ?? [], inline: isInlineConfiguration(selection.name), onChange: (configuration) => { const next = [...merits]; next[index] = { ...selection, configuration }; setMerits(next); } })}
      </div>;
    })}</div>
    <Dialog open={catalogOpen} onOpenChange={setCatalogOpen}><DialogContent className="merit-dialog"><DialogHeader><DialogTitle>{tr("Selecionar méritos", "Select Merits")}</DialogTitle><DialogDescription>{tr("Procure por nome ou navegue pelas categorias.", "Search by name or browse categories.")}</DialogDescription></DialogHeader>
      <div className="catalog-filters"><label className="merit-search"><Search aria-hidden="true" /><Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder={tr("Buscar mérito por nome, pré-requisito ou fonte…", "Search Merit by name, prerequisite, or source…")} /></label><Choice label={tr("Categoria", "Category")} value={category} setValue={setCategory} options={["all", ...categories]} optionLabels={{ all: tr("Todas as categorias", "All categories"), ...Object.fromEntries(categories.map((item) => [item, categoryName(item)])) }} /><MeritCatalogVisibilityToggle showAll={showAllMerits} setShowAll={setShowAllMerits} /></div>
      <div className="merit-catalog">{categories.map((catalogCategory) => {
        const items = visibleCatalog.filter((item) => item.category === catalogCategory);
        if (!items.length) return null;
        return <section className="merit-category" key={catalogCategory}><h3>{categoryName(catalogCategory)} <Badge variant="outline">{items.length}</Badge></h3><div>{items.map((definition) => {
          const selected = merits.some((merit) => merit.name === definition.name);
          const repeatable = isRepeatableDefinition(definition);
          const prerequisitesMet = meritPrerequisitesMet(definition, context);
          return <article className={selected ? "merit-option selected" : !prerequisitesMet ? "merit-option merit-option-locked" : "merit-option"} key={definition.id}><div><strong>{meritName(definition)}</strong><small>{definition.source} · p. {definition.page || "—"} · {UNBOUNDED_MERITS.has(definition.name) ? "1+" : formatRatings(meritRatingsFor(definition))}</small>{definition.prerequisites && <p className={`rule-detail${prerequisitesMet ? "" : " merit-prerequisites-missing"}`}><strong>{tr("Pré-requisitos", "Prerequisites")}:</strong> {definition.prerequisites}</p>}<p>{definition.description}</p></div><Button type="button" size="sm" className="catalog-selection-action" variant={selected ? "secondary" : "outline"} disabled={!prerequisitesMet || (selected && !repeatable)} onClick={() => addMerit(definition)}>{selected && !repeatable ? <><Check /> {tr("Selecionado", "Selected")}</> : <><Plus /> {repeatable && selected ? tr("Nova instância", "New instance") : tr("Adicionar", "Add")}</>}</Button></article>;
        })}</div></section>;
      })}{!visibleCatalog.length && <em>{tr("Nenhum Mérito corresponde aos filtros.", "No Merits match the filters.")}</em>}</div><DialogFooter><DialogClose asChild><Button type="button" size="sm" className="catalog-dialog-done">{tr("Concluir", "Done")}</Button></DialogClose></DialogFooter>
    </DialogContent></Dialog>
  </>;
}

function isRepeatableDefinition(definition: MeritDefinition) {
  return REPEATABLE_MERITS.has(definition.name) || Boolean((definition as MeritDefinition & { repeatable?: boolean }).repeatable);
}

function meritTooltip(definition: MeritDefinition, locale: "pt-BR" | "en-US") {
  return definition.prerequisites ? `${locale === "pt-BR" ? "Pré-requisitos" : "Prerequisites"}: ${definition.prerequisites}\n${definition.description}` : definition.description;
}

function meritCategoryLabel(category: string) {
  return ({ Mental: "Mentais", Physical: "Físicos", Social: "Sociais", Supernatural: "Sobrenaturais", "Fighting Style": "Estilos de Combate", Changeling: "Changeling", Awakened: "Despertos", Entitlement: "Títulos Feéricos", Court: "Cortes", Seeming: "Feições", Historical: "Históricos", Order: "Ordens", "Mystery Cult": "Cultos de Mistério" } as Record<string, string>)[category] ?? category;
}

function formatRatings(ratings: number[]) {
  return ratings.length === 1 ? `${ratings[0]} ponto${ratings[0] === 1 ? "" : "s"}` : `${ratings.join(", ")} pontos`;
}
