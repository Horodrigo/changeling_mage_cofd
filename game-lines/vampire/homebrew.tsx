"use client";

import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
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
import { BLOODLINE_HOMEBREW_SOURCE, BLOODLINE_HOMEBREW_SOURCE_ID, saveBloodlineHomebrews } from "./bloodline-homebrews";
import type { VampireBloodlineDefinition, VampireCondition, VampireMechanics, VampirePowers, VampireReference } from "./catalog-types";
import { SIMPLIFIED_HOLLOW_ID, vampireHomebrewSourceId } from "./homebrew-catalog";
import { useBloodlineHomebrews } from "./use-bloodline-homebrews";

type Detail = { label: string; text: string };
type ListedHomebrew = { id: string; sourceId: string; source: string; kind: string; name: string; details: Detail[]; parentId?: string; defaultDisabled?: boolean };

function VampireHomebrew({ catalogs }: GameLineHomebrewProps) {
  if (!catalogs) throw new Error("Vampire Homebrew requires its catalog snapshot.");
  const { locale } = useLanguage(), h = (pt: string, en: string) => localized(locale, pt, en);
  const preferences = useHomebrewPreferences(), customBloodlines = useBloodlineHomebrews();
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
  const [editing, setEditing] = useState<VampireBloodlineDefinition | null>(null);
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
    saveBloodlineHomebrews(customBloodlines.map((item) => item.id === definition.id ? definition : item));
    saveHomebrewPreferences(setHomebrewEnabled(setHomebrewEnabled(preferences, BLOODLINE_HOMEBREW_SOURCE_ID, true), definition.id, true));
  };
  const renderItem = (item: ListedHomebrew, sourceActive: boolean) => {
    const active = homebrewContentActive(preferences, item.id, item.sourceId, item.defaultDisabled);
    const children = listed.filter((entry) => entry.parentId === item.id);
    return <div key={item.id}><article className="homebrew-list-item"><details><summary><strong>{item.name}</strong></summary><div className="homebrew-list-item-body">{item.details.map((entry, index) => <p key={`${entry.label}:${index}`}><strong>{entry.label}:</strong> {entry.text}</p>)}</div></details><label className="homebrew-toggle"><span>{active ? h("Ativo", "Active") : h("Desativado", "Disabled")}</span><Switch disabled={!sourceActive} checked={active} onCheckedChange={(checked) => toggle(item.id, checked, item.defaultDisabled)} aria-label={`${item.name}: ${active ? h("ativo", "active") : h("desativado", "disabled")}`}/></label></article>{children.length > 0 && <div className="homebrew-item-list homebrew-subitem-list">{children.map((child) => renderItem(child, sourceActive && active))}</div>}</div>;
  };
  return <>
    <MeritHomebrewPanel line="VtR" catalog={merits}/>
    <section className="homebrew-panel">
      <div className="panel-heading"><div><h3>{h("Conteúdo publicado de Vampire", "Published Vampire Homebrew")}</h3><p>{h("A ativação controla novas escolhas; fichas existentes conservam o conteúdo que já possuem.", "Activation controls new choices; existing sheets retain content they already own.")}</p></div></div>
      <div className="homebrew-source-list">{sources.map(([sourceId, source]) => {
        const sourceItems = listed.filter((item) => item.sourceId === sourceId), sourceActive = !preferences.disabledIds.includes(sourceId), kinds = [...new Set(sourceItems.map((item) => item.kind))].sort((left, right) => categoryOrder.indexOf(left) - categoryOrder.indexOf(right));
        return <details className="panel homebrew-source" key={sourceId}><summary className="homebrew-source-summary"><div><Badge variant="outline">{h("Homebrew", "Homebrew")}</Badge><strong>{source}</strong><span>{sourceItems.length} {h("itens implementados", "implemented items")}</span></div></summary><div className="homebrew-source-body"><Tabs defaultValue={kinds[0]} className="homebrew-kind-tabs"><div className="homebrew-source-toolbar"><TabsList variant="line" className="homebrew-kind-tabs-list" aria-label={h("Categorias da fonte", "Source categories")}>{kinds.map((kind) => <TabsTrigger key={kind} value={kind}>{kind}</TabsTrigger>)}</TabsList><label className="homebrew-toggle"><span>{sourceActive ? h("Fonte ativa", "Source active") : h("Fonte desativada", "Source disabled")}</span><Switch checked={sourceActive} onCheckedChange={(checked) => toggle(sourceId, checked)} aria-label={`${source}: ${sourceActive ? h("ativa", "active") : h("desativada", "disabled")}`}/></label></div>{kinds.map((kind) => <TabsContent className="homebrew-kind-panel" value={kind} key={kind}><div className="homebrew-item-list">{sourceItems.filter((item) => item.kind === kind && !item.parentId).map((item) => renderItem(item, sourceActive))}</div></TabsContent>)}</Tabs></div></details>;
      })}</div>
    </section>
    <section className="homebrew-panel">
      <div className="panel-heading"><div><h3>{h("Bloodlines criadas", "Player-created Bloodlines")}</h3><p>{h("Bloodlines criadas por jogadores podem ser ativadas, editadas ou excluídas aqui.", "Player-created Bloodlines can be enabled, edited, or deleted here.")}</p></div></div>
      {customBloodlines.length === 0 ? <p>{h("Nenhuma Bloodline criada pelo jogador.", "No player-created Bloodlines yet.")}</p> : <div className="homebrew-source-list"><details className="panel homebrew-source"><summary className="homebrew-source-summary"><div><Badge variant="outline">{h("Criado pelo jogador", "Player-created")}</Badge><strong>{BLOODLINE_HOMEBREW_SOURCE}</strong><span>{customBloodlines.length} {h("itens implementados", "implemented items")}</span></div></summary><div className="homebrew-source-body"><div className="homebrew-source-controls"><label className="homebrew-toggle"><span>{!preferences.disabledIds.includes(BLOODLINE_HOMEBREW_SOURCE_ID) ? h("Fonte ativa", "Source active") : h("Fonte desativada", "Source disabled")}</span><Switch checked={!preferences.disabledIds.includes(BLOODLINE_HOMEBREW_SOURCE_ID)} onCheckedChange={(checked) => toggle(BLOODLINE_HOMEBREW_SOURCE_ID, checked)}/></label></div><div className="homebrew-grid">{[...customBloodlines].sort((left, right) => left.name.localeCompare(right.name, locale)).map((item) => {
        const active = homebrewContentActive(preferences, item.id, item.sourceId), sourceActive = !preferences.disabledIds.includes(BLOODLINE_HOMEBREW_SOURCE_ID);
        return <article className="homebrew-card" key={item.id}><div><h3>{item.name}</h3><p>{item.summary}</p></div><div className="homebrew-card-actions"><label className="homebrew-toggle"><span>{active ? h("Ativa", "Active") : h("Desativada", "Disabled")}</span><Switch disabled={!sourceActive} checked={active} onCheckedChange={(checked) => toggle(item.id, checked)}/></label><Button type="button" size="sm" variant="outline" onClick={() => setEditing(item)}><Pencil/> {h("Editar", "Edit")}</Button><ConfirmAction trigger={<Button type="button" size="sm" variant="ghost"><Trash2/> {h("Excluir", "Delete")}</Button>} title={h("Excluir Bloodline?", "Delete Bloodline?")} description={h("Ela deixará de aparecer nas escolhas. Fichas que a usam manterão o identificador, mas perderão a apresentação das regras.", "It will disappear from choices. Sheets using it will retain its identifier but lose the rules presentation.")} action={h("Excluir", "Delete")} onConfirm={() => saveBloodlineHomebrews(customBloodlines.filter((entry) => entry.id !== item.id))}/></div></article>;
      })}</div></div></details></div>}
      {editing && <BloodlineHomebrewEditor open initial={editing} clans={reference.clans} onOpenChange={(open) => { if (!open) setEditing(null); }} onSave={save}/>}
    </section>
  </>;
}

export const vampireHomebrew: GameLineHomebrewModule = { Component: VampireHomebrew };
