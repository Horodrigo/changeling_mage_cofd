"use client";

import { useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { MeritHomebrewPanel } from "@/app/merit-homebrew-panel";
import { useHomebrewPreferences } from "@/app/use-homebrew";
import { ConfirmAction } from "@/app/workspace/confirm-action";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { GameLineHomebrewModule, GameLineHomebrewProps } from "@/lib/game-line-contracts/game-line-ui";
import { homebrewContentActive, isHomebrewSource, saveHomebrewPreferences, setHomebrewEnabled } from "@/lib/homebrew";
import { localized, useLanguage } from "@/lib/i18n";
import type { MeritDefinition } from "@/lib/merits";
import { BloodlineHomebrewEditor } from "./bloodline-homebrew-editor";
import { BLOODLINE_HOMEBREW_SOURCE_ID, saveBloodlineHomebrews } from "./bloodline-homebrews";
import type { VampireBloodlineDefinition, VampireCondition, VampireMechanics, VampirePowers, VampireReference } from "./catalog-types";
import { SIMPLIFIED_HOLLOW_ID, vampireHomebrewSourceId } from "./homebrew-catalog";
import { useBloodlineHomebrews } from "./use-bloodline-homebrews";
import { VampireCatalogHomebrewEditor, emptyVampireCatalogHomebrew } from "./catalog-homebrew-editor";
import { saveVampireCatalogHomebrews, VAMPIRE_CATALOG_HOMEBREW_SOURCE_ID, type VampireCatalogHomebrew } from "./catalog-homebrews";
import { useVampireCatalogHomebrews } from "./use-catalog-homebrews";

type Detail = { label: string; text: string };
type ListedHomebrew = { id: string; sourceId: string; source: string; kind: string; name: string; details: Detail[]; parentId?: string; defaultDisabled?: boolean };

function VampireHomebrew({ catalogs }: GameLineHomebrewProps) {
  if (!catalogs) throw new Error("Vampire Homebrew requires its catalog snapshot.");
  const { locale } = useLanguage(), h = (pt: string, en: string) => localized(locale, pt, en);
  const preferences = useHomebrewPreferences(), customBloodlines = useBloodlineHomebrews(), customCatalog = useVampireCatalogHomebrews();
  const reference = catalogs.get<VampireReference>("vampire-reference"), powers = catalogs.get<VampirePowers>("vampire-powers"), conditions = catalogs.get<readonly VampireCondition[]>("vampire-conditions");
  const coreMerits = catalogs.get<readonly MeritDefinition[]>("core-merits"), vampireMerits = catalogs.get<readonly MeritDefinition[]>("vampire-merits"), merits = [...coreMerits, ...vampireMerits];
  const bloodSorcery = h("Feitiçaria de Sangue", "Blood Sorcery"), disciplines = h("Disciplinas", "Disciplines");
  const categoryOrder = [h("Méritos", "Merits"), "Clans", "Covenants", "Bloodlines", disciplines, bloodSorcery, h("Devoções", "Devotions"), h("Condições", "Conditions"), "Errata"];
  const nestedDevotions: Record<string, { kind: string; parentId: string }> = {
    "Lessons of Erebus": { kind: disciplines, parentId: "truths-of-erebus" },
    "Blood Tether Lashes": { kind: disciplines, parentId: "blood-tether" },
    "Ortam Recipes": { kind: disciplines, parentId: "ortam" },
    "Lithopedia Rites": { kind: bloodSorcery, parentId: "lithopedia" },
  };
  const [bloodlineEditorOpen, setBloodlineEditorOpen] = useState(false), [editingBloodline, setEditingBloodline] = useState<VampireBloodlineDefinition | null>(null);
  const [editingCatalog, setEditingCatalog] = useState<VampireCatalogHomebrew | null>(null);
  const listed: ListedHomebrew[] = [];
  const detail = (label: string, value: unknown): Detail[] => String(value ?? "").trim() ? [{ label, text: String(value).trim() }] : [];
  const add = (item: { id: string; source: string; sourceId?: string; name: string; translatedName?: string; page?: number; defaultDisabled?: boolean; errataFor?: string; errataForName?: string }, kind: string, details: Detail[], parentId?: string) => {
    const sourceId = vampireHomebrewSourceId(item);
    if (sourceId && isHomebrewSource(sourceId)) listed.push({ id: item.id, sourceId, source: item.source, kind: item.errataFor || item.defaultDisabled && item.errataForName ? "Errata" : kind, name: locale === "pt-BR" ? item.translatedName ?? item.name : item.name, details: [...detail(h("Corrige", "Errata for"), item.errataForName), ...details, ...detail(h("Página", "Page"), item.page)], parentId, defaultDisabled: item.defaultDisabled });
  };
  const mechanics = (item: VampireMechanics): Detail[] => [
    ...detail(h("Custo", "Cost"), item.cost), ...detail(h("Requisito", "Requirement"), item.requirement), ...detail(h("Parada de dados", "Dice Pool"), item.dicePool),
    ...detail(h("Ação", "Action"), item.action), ...detail(h("Duração", "Duration"), item.duration), ...detail(h("Sucessos-alvo", "Target Successes"), item.targetSuccesses),
    ...detail(h("Disputado por", "Contested By"), item.contestedBy), ...detail(h("Resistido por", "Resisted By"), item.resistedBy), ...detail(h("Sacramento", "Sacrament"), item.sacrament),
    ...detail(h("Condição", "Condition"), item.condition), ...detail(h("Efeito", "Effect"), item.effect),
    ...detail(h("Procedimento", "Procedure"), item.procedure), ...detail(h("Resultado", "Outcome"), item.outcome),
    ...Object.entries(item.rollResults ?? {}).flatMap(([label, text]) => detail(label, text)),
  ];
  merits.forEach((item) => add(item, h("Méritos", "Merits"), [...detail(h("Níveis", "Ratings"), item.ratings.join(", ")), ...detail(h("Pré-requisitos", "Prerequisites"), item.prerequisites), ...detail(h("Efeito", "Effect"), locale === "pt-BR" ? item.description : item.descriptionEn ?? item.description), ...(item.levels ?? []).flatMap((level) => detail(`${"•".repeat(level.rating)} ${level.name}`, level.description))]));
  reference.clans.forEach((item) => add(item, "Clans", [...detail(h("Atributos favorecidos", "Favored Attributes"), item.favoredAttributes.join(" / ")), ...detail(h("Disciplinas", "Disciplines"), item.disciplines.join(", ")), ...detail(item.baneName, item.baneSummary)]));
  reference.covenants.forEach((item) => add(item, "Covenants", [...detail(h("Descrição", "Description"), item.description), ...detail(h("Vantagem", "Advantage"), item.advantage)]));
  reference.bloodlines.forEach((item) => add(item, "Bloodlines", [...detail(h("Resumo", "Summary"), item.summary), ...detail(h("Clã de origem", "Parent Clan"), item.parentClan), ...detail(h("Pré-requisitos", "Prerequisites"), item.requirements), ...detail(h("Atributos favorecidos", "Favored Attributes"), item.favoredAttributes.join(" / ")), ...detail(h("Disciplinas", "Disciplines"), item.disciplines.join(", ")), ...detail(item.giftName ?? "", item.giftSummary), ...detail(item.baneName, item.baneSummary)]));
  powers.disciplines.forEach((item) => add(item, item.id === "lithopedia" ? bloodSorcery : disciplines, [...detail(h("Resumo", "Summary"), item.summary), ...detail("Bloodline", item.bloodlineId), ...(item.levels ?? []).flatMap((level) => detail(`${"•".repeat(level.rating)} ${level.name}`, level.summary))]));
  powers.ritualDisciplines.forEach((item) => add(item, bloodSorcery, [...detail(h("Resumo", "Summary"), item.summary), ...detail(h("Pré-requisitos", "Prerequisites"), item.statusRequirement), ...mechanics(item)]));
  powers.devotions.forEach((item) => { const placement = item.category ? nestedDevotions[item.category] : undefined; add(item, placement?.kind ?? item.category ?? h("Devoções", "Devotions"), [...detail(h("Resumo", "Summary"), item.summary), ...detail(h("Pré-requisitos", "Prerequisites"), item.prerequisites), ...mechanics(item)], placement?.parentId); });
  powers.cruacRites.forEach((item) => add(item, bloodSorcery, [...detail(h("Resumo", "Summary"), item.summary), ...detail(h("Nível", "Level"), item.rating), ...mechanics(item)]));
  powers.thebanMiracles.forEach((item) => add(item, bloodSorcery, [...detail(h("Resumo", "Summary"), item.summary), ...detail(h("Nível", "Level"), item.rating), ...mechanics(item)]));
  powers.gildedInvocations.forEach((item) => add(item, bloodSorcery, [...detail(h("Disciplina", "Discipline"), "Gilded Cage"), ...detail(h("Resumo", "Summary"), item.summary), ...detail(h("Nível", "Level"), item.rating), ...mechanics(item)], "gilded-cage"));
  powers.detournements.forEach((item) => add(item, bloodSorcery, [...detail(h("Resumo", "Summary"), item.summary), ...detail(h("Pré-requisitos", "Prerequisites"), item.prerequisites), ...mechanics(item)]));
  conditions.forEach((item) => add(item, h("Condições", "Conditions"), [...detail(h("Descrição", "Description"), item.description), ...detail(h("Penalidade", "Penalty"), item.penalty), ...detail(h("Persistente", "Persistent"), item.persistent ? h("Sim", "Yes") : ""), ...detail(h("Resolução", "Resolution"), item.resolution), ...detail("Beat", item.beat)]));
  listed.push({ id: SIMPLIFIED_HOLLOW_ID, sourceId: "h-vtr-strange-shades", source: "Strange Shades: Mekhet", kind: "Errata", name: "Simplified Hollow", details: detail(h("Efeito", "Effect"), h("Substitui a ficha completa do Ka pela parada simplificada baseada em Humanidade.", "Replaces the full Ka sheet with the simplified Humanity-based dice pool.")) });
  listed.sort((left, right) => left.name.localeCompare(right.name, locale));
  const sources = [...new Map(listed.map((item) => [item.sourceId, item.source])).entries()].sort((left, right) => left[1].localeCompare(right[1], locale));
  const toggle = (id: string, enabled: boolean, defaultDisabled = false) => saveHomebrewPreferences(setHomebrewEnabled(preferences, id, enabled, defaultDisabled));
  const save = (definition: VampireBloodlineDefinition) => {
    saveBloodlineHomebrews(customBloodlines.some((item) => item.id === definition.id) ? customBloodlines.map((item) => item.id === definition.id ? definition : item) : [...customBloodlines, definition]);
    saveHomebrewPreferences(setHomebrewEnabled(setHomebrewEnabled(preferences, BLOODLINE_HOMEBREW_SOURCE_ID, true), definition.id, true));
  };
  const saveCatalog = (definition: VampireCatalogHomebrew) => {
    saveVampireCatalogHomebrews(customCatalog.some((item) => item.id === definition.id) ? customCatalog.map((item) => item.id === definition.id ? definition : item) : [...customCatalog, definition]);
    saveHomebrewPreferences(setHomebrewEnabled(setHomebrewEnabled(preferences, VAMPIRE_CATALOG_HOMEBREW_SOURCE_ID, true), definition.id, true));
  };
  const renderItem = (item: ListedHomebrew, sourceActive: boolean) => {
    const active = homebrewContentActive(preferences, item.id, item.sourceId, item.defaultDisabled);
    const children = listed.filter((entry) => entry.parentId === item.id);
    return <div key={item.id}><article className="homebrew-list-item"><details><summary><strong>{item.name}</strong></summary><div className="homebrew-list-item-body">{item.details.map((entry, index) => <p key={`${entry.label}:${index}`}><strong>{entry.label}:</strong> {entry.text}</p>)}</div></details><label className="homebrew-toggle"><span>{active ? h("Ativo", "Active") : h("Desativado", "Disabled")}</span><Switch disabled={!sourceActive} checked={active} onCheckedChange={(checked) => toggle(item.id, checked, item.defaultDisabled)} aria-label={`${item.name}: ${active ? h("ativo", "active") : h("desativado", "disabled")}`}/></label></article>{children.length > 0 && <div className="homebrew-item-list homebrew-subitem-list">{children.map((child) => renderItem(child, sourceActive && active))}</div>}</div>;
  };
  const playerGroups = [
    { id: "clan", label: h("Clãs", "Clans"), items: customCatalog.filter((item) => item.entryType === "clan"), create: () => setEditingCatalog(emptyVampireCatalogHomebrew("clan")) },
    { id: "bloodline", label: "Bloodlines", items: customBloodlines, create: () => { setEditingBloodline(null); setBloodlineEditorOpen(true); } },
    { id: "covenant", label: "Covenants", items: customCatalog.filter((item) => item.entryType === "covenant"), create: () => setEditingCatalog(emptyVampireCatalogHomebrew("covenant")) },
    { id: "discipline", label: h("Disciplinas", "Disciplines"), items: customCatalog.filter((item) => item.entryType === "discipline"), create: () => setEditingCatalog(emptyVampireCatalogHomebrew("discipline")) },
    { id: "devotion", label: h("Devoções", "Devotions"), items: customCatalog.filter((item) => item.entryType === "power" && item.kind === "devotion"), create: () => setEditingCatalog(emptyVampireCatalogHomebrew("power", "devotion")) },
    { id: "rites", label: h("Ritos e Milagres", "Rites and Miracles"), items: customCatalog.filter((item) => item.entryType === "power" && ["cruac-rite", "theban-miracle", "kimiya-formula", "therion-sacrilege", "gilded-invocation"].includes(item.kind)), create: () => setEditingCatalog(emptyVampireCatalogHomebrew("power", "cruac-rite")) },
    { id: "coil", label: h("Espirais do Dragão", "Coils of the Dragon"), items: customCatalog.filter((item) => item.entryType === "power" && item.kind === "coil"), create: () => setEditingCatalog(emptyVampireCatalogHomebrew("power", "coil")) },
    { id: "scale", label: h("Escalas do Dragão", "Scales of the Dragon"), items: customCatalog.filter((item) => item.entryType === "power" && item.kind === "scale"), create: () => setEditingCatalog(emptyVampireCatalogHomebrew("power", "scale")) },
  ];
  const itemSummary = (item: VampireCatalogHomebrew | VampireBloodlineDefinition) => "summary" in item ? item.summary : "description" in item ? item.description : "baneSummary" in item ? item.baneSummary : "";
  return <>
    <MeritHomebrewPanel line="VtR" catalog={merits}/>
    <section className="homebrew-panel">
      <div className="panel-heading"><div><h3>{h("Conteúdo criado para Vampire", "Player-created Vampire Content")}</h3><p>{h("Crie, ative e edite opções específicas da linha.", "Create, enable, and edit line-specific options.")}</p></div></div>
      <div className="homebrew-source-controls"><label className="homebrew-toggle"><span>{h("Clãs e poderes", "Clans and powers")}</span><Switch checked={!preferences.disabledIds.includes(VAMPIRE_CATALOG_HOMEBREW_SOURCE_ID)} onCheckedChange={(checked) => toggle(VAMPIRE_CATALOG_HOMEBREW_SOURCE_ID, checked)}/></label><label className="homebrew-toggle"><span>{h("Bloodlines", "Bloodlines")}</span><Switch checked={!preferences.disabledIds.includes(BLOODLINE_HOMEBREW_SOURCE_ID)} onCheckedChange={(checked) => toggle(BLOODLINE_HOMEBREW_SOURCE_ID, checked)}/></label></div>
      <Tabs defaultValue="clan" className="homebrew-kind-tabs"><TabsList variant="line" className="homebrew-kind-tabs-list">{playerGroups.map((group) => <TabsTrigger key={group.id} value={group.id}>{group.label}</TabsTrigger>)}</TabsList>{playerGroups.map((group) => <TabsContent key={group.id} value={group.id} className="homebrew-kind-panel"><div className="homebrew-source-toolbar"><strong>{group.label}</strong><Button type="button" size="sm" onClick={group.create}><Plus/> {h("Criar", "Create")}</Button></div>{group.items.length === 0 ? <p>{h("Nenhum item criado pelo jogador.", "No player-created items yet.")}</p> : <div className="homebrew-grid">{[...group.items].sort((left, right) => left.name.localeCompare(right.name, locale)).map((item) => {
        const bloodline = "parentClan" in item, sourceId = bloodline ? BLOODLINE_HOMEBREW_SOURCE_ID : VAMPIRE_CATALOG_HOMEBREW_SOURCE_ID, sourceActive = !preferences.disabledIds.includes(sourceId), active = homebrewContentActive(preferences, item.id, sourceId);
        return <article className="homebrew-card" key={item.id}><div><h3>{item.name}</h3><p>{itemSummary(item)}</p></div><div className="homebrew-card-actions"><label className="homebrew-toggle"><span>{active ? h("Ativo", "Active") : h("Desativado", "Disabled")}</span><Switch disabled={!sourceActive} checked={active} onCheckedChange={(checked) => toggle(item.id, checked)}/></label><Button type="button" size="sm" variant="outline" onClick={() => bloodline ? (setEditingBloodline(item), setBloodlineEditorOpen(true)) : setEditingCatalog(item)}><Pencil/> {h("Editar", "Edit")}</Button><ConfirmAction trigger={<Button type="button" size="sm" variant="ghost"><Trash2/> {h("Excluir", "Delete")}</Button>} title={h("Excluir item?", "Delete item?")} description={h("Ele deixará de aparecer em novas escolhas.", "It will disappear from new choices.")} action={h("Excluir", "Delete")} onConfirm={() => bloodline ? saveBloodlineHomebrews(customBloodlines.filter((entry) => entry.id !== item.id)) : saveVampireCatalogHomebrews(customCatalog.filter((entry) => entry.id !== item.id))}/></div></article>;
      })}</div>}</TabsContent>)}</Tabs>
      {bloodlineEditorOpen && <BloodlineHomebrewEditor open initial={editingBloodline} clans={reference.clans} onOpenChange={setBloodlineEditorOpen} onSave={save}/>}
      {editingCatalog && <VampireCatalogHomebrewEditor key={editingCatalog.id} initial={editingCatalog} onOpenChange={(open) => { if (!open) setEditingCatalog(null); }} onSave={saveCatalog}/>}
    </section>
    <section className="homebrew-panel">
      <div className="panel-heading"><div><h3>{h("Conteúdo publicado de Vampire", "Published Vampire Homebrew")}</h3><p>{h("A ativação controla novas escolhas; fichas existentes conservam o conteúdo que já possuem.", "Activation controls new choices; existing sheets retain content they already own.")}</p></div></div>
      <div className="homebrew-source-list">{sources.map(([sourceId, source]) => {
        const sourceItems = listed.filter((item) => item.sourceId === sourceId), sourceActive = !preferences.disabledIds.includes(sourceId), kinds = [...new Set(sourceItems.map((item) => item.kind))].sort((left, right) => categoryOrder.indexOf(left) - categoryOrder.indexOf(right));
        return <details className="panel homebrew-source" key={sourceId}><summary className="homebrew-source-summary"><div><Badge variant="outline">{h("Homebrew", "Homebrew")}</Badge><strong>{source}</strong><span>{sourceItems.length} {h("itens implementados", "implemented items")}</span></div></summary><div className="homebrew-source-body"><Tabs defaultValue={kinds[0]} className="homebrew-kind-tabs"><div className="homebrew-source-toolbar"><TabsList variant="line" className="homebrew-kind-tabs-list" aria-label={h("Categorias da fonte", "Source categories")}>{kinds.map((kind) => <TabsTrigger key={kind} value={kind}>{kind}</TabsTrigger>)}</TabsList><label className="homebrew-toggle"><span>{sourceActive ? h("Fonte ativa", "Source active") : h("Fonte desativada", "Source disabled")}</span><Switch checked={sourceActive} onCheckedChange={(checked) => toggle(sourceId, checked)} aria-label={`${source}: ${sourceActive ? h("ativa", "active") : h("desativada", "disabled")}`}/></label></div>{kinds.map((kind) => <TabsContent className="homebrew-kind-panel" value={kind} key={kind}><div className="homebrew-item-list">{sourceItems.filter((item) => item.kind === kind && !item.parentId).map((item) => renderItem(item, sourceActive))}</div></TabsContent>)}</Tabs></div></details>;
      })}</div>
    </section>
  </>;
}

export const vampireHomebrew: GameLineHomebrewModule = { Component: VampireHomebrew };
