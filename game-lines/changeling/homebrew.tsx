"use client";

import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { ConfirmAction } from "@/app/workspace/confirm-action";
import { useHomebrewPreferences } from "@/app/use-homebrew";
import type { ContractDefinition } from "@/lib/catalog/contract-catalog";
import type { CourtDefinition } from "@/lib/changeling-courts";
import type { KithDefinition } from "@/lib/changeling-kiths";
import type { EntitlementDefinition } from "@/lib/entitlements";
import type { GameLineHomebrewModule, GameLineHomebrewProps } from "@/lib/game-line-contracts/game-line-ui";
import { homebrewContentActive, saveHomebrewPreferences, setHomebrewEnabled } from "@/lib/homebrew";
import { localized, useLanguage } from "@/lib/i18n";
import type { MeritDefinition } from "@/lib/merits";
import { EntitlementHomebrewEditor } from "./entitlement-homebrew-editor";
import { ENTITLEMENT_HOMEBREW_SOURCE_ID, saveEntitlementHomebrews } from "./entitlement-homebrews";
import { useEntitlementHomebrews } from "./use-entitlement-homebrews";
import { CTL_NEEDLE_DEFINITIONS, CTL_SEEMINGS, CTL_THREAD_DEFINITIONS, changelingAnchorRecovery, seemingDisplayName } from "./creation-rules";

type ListedHomebrew = { id: string; sourceId: string; source: string; kind: string; name: string; summary: string; custom?: EntitlementDefinition };

function ChangelingHomebrew({ catalogs }: GameLineHomebrewProps) {
  if (!catalogs) throw new Error("Changeling Homebrew requires its catalog snapshot.");
  const { locale } = useLanguage(), h = (pt: string, en: string) => localized(locale, pt, en);
  const preferences = useHomebrewPreferences(), customEntitlements = useEntitlementHomebrews();
  const [editing, setEditing] = useState<EntitlementDefinition | null>(null);
  const reference = catalogs.get<{ courts: CourtDefinition[]; entitlements: EntitlementDefinition[]; kiths: KithDefinition[] }>("changeling-reference");
  const items: ListedHomebrew[] = [];
  const add = (item: ListedHomebrew) => { if (item.sourceId.startsWith("h-") || item.sourceId === ENTITLEMENT_HOMEBREW_SOURCE_ID) items.push(item); };
    for (const item of catalogs.get<ContractDefinition[]>("changeling-contracts")) add({ id: item.id, sourceId: item.sourceId, source: item.source, kind: h("Contrato", "Contract"), name: locale === "pt-BR" ? item.name : item.originalName, summary: item.summary ?? item.effect ?? item.success ?? item.description ?? "" });
    for (const item of catalogs.get<MeritDefinition[]>("changeling-merits")) add({ id: item.id, sourceId: item.sourceId, source: item.source, kind: h("Mérito", "Merit"), name: locale === "pt-BR" ? item.translatedName : item.name, summary: locale === "pt-BR" ? item.description : item.descriptionEn ?? item.description });
    for (const item of reference.courts) add({ id: item.id, sourceId: item.sourceId, source: item.source, kind: h("Corte", "Court"), name: locale === "pt-BR" ? item.translatedName : item.name, summary: locale === "pt-BR" ? item.emotionPt : item.emotion });
    for (const item of reference.kiths) if (item.sourceId) add({ id: item.id, sourceId: item.sourceId, source: item.source, kind: h("Frátria", "Kith"), name: locale === "pt-BR" ? item.translatedName ?? item.name : item.name, summary: item.description });
    for (const item of [...reference.entitlements, ...customEntitlements]) if (item.sourceId) add({ id: item.id, sourceId: item.sourceId, source: item.source, kind: "Entitlement", name: item.name, summary: item.purpose, ...(item.homebrew ? { custom: item } : {}) });
    for (const [name, item] of Object.entries(CTL_SEEMINGS)) if ("sourceId" in item) add({ id: `seeming:${name}`, sourceId: item.sourceId, source: item.source, kind: "Seeming", name: seemingDisplayName(name, locale), summary: `${h("Regalia favorecida", "Favored Regalia")}: ${item.regalia}` });
    for (const item of CTL_NEEDLE_DEFINITIONS) if (item.sourceId) add({ id: `needle:${item.name}`, sourceId: item.sourceId, source: item.source ?? item.sourceId, kind: "Needle", name: locale === "pt-BR" ? item.translatedName ?? item.name : item.name, summary: changelingAnchorRecovery("needle", item.name, locale) });
    for (const item of CTL_THREAD_DEFINITIONS) if (item.sourceId) add({ id: `thread:${item.name}`, sourceId: item.sourceId, source: item.source ?? item.sourceId, kind: "Thread", name: locale === "pt-BR" ? item.translatedName ?? item.name : item.name, summary: changelingAnchorRecovery("thread", item.name, locale) });
  items.sort((left, right) => left.name.localeCompare(right.name, locale));
  const sources = [...new Map(items.map((item) => [item.sourceId, item.source])).entries()];
  const toggle = (id: string, enabled: boolean) => saveHomebrewPreferences(setHomebrewEnabled(preferences, id, enabled));
  const saveCustom = (definition: EntitlementDefinition) => {
    saveEntitlementHomebrews(customEntitlements.some((item) => item.id === definition.id) ? customEntitlements.map((item) => item.id === definition.id ? definition : item) : [...customEntitlements, definition]);
    saveHomebrewPreferences(setHomebrewEnabled(setHomebrewEnabled(preferences, ENTITLEMENT_HOMEBREW_SOURCE_ID, true), definition.id, true));
  };
  const removeCustom = (id: string) => saveEntitlementHomebrews(customEntitlements.filter((item) => item.id !== id));
  return <section className="homebrew-panel">
    <div className="panel-heading"><div><h3>{h("Homebrews de Changeling", "Changeling Homebrews")}</h3><p>{h("A ativação controla novas escolhas; fichas existentes conservam os dados que já possuem.", "Activation controls new choices; existing sheets retain data they already own.")}</p></div></div>
    <div className="homebrew-source-list">{sources.map(([sourceId, source]) => {
      const sourceItems = items.filter((item) => item.sourceId === sourceId), sourceActive = !preferences.disabledIds.includes(sourceId);
      return <section className="panel homebrew-source" key={sourceId}>
        <header><div><Badge variant="outline">{sourceId === ENTITLEMENT_HOMEBREW_SOURCE_ID ? h("Criado pelo jogador", "Player-created") : h("Incluído", "Included")}</Badge><h3>{source}</h3><p>{sourceItems.length} {h("itens implementados", "implemented items")}</p></div><label className="homebrew-toggle"><span>{sourceActive ? h("Fonte ativa", "Source active") : h("Fonte desativada", "Source disabled")}</span><Switch checked={sourceActive} onCheckedChange={(checked) => toggle(sourceId, checked)} aria-label={`${source}: ${sourceActive ? h("ativa", "active") : h("desativada", "disabled")}`}/></label></header>
        <div className="homebrew-grid">{sourceItems.map((item) => {
          const active = homebrewContentActive(preferences, item.id, item.sourceId);
          return <article className="homebrew-card" key={`${item.kind}:${item.id}`}><div><Badge variant="outline">{item.kind}</Badge><h3>{item.name}</h3><p>{item.summary}</p></div><div className="homebrew-card-actions"><label className="homebrew-toggle"><span>{active ? h("Ativo", "Active") : h("Desativado", "Disabled")}</span><Switch disabled={!sourceActive} checked={active} onCheckedChange={(checked) => toggle(item.id, checked)} aria-label={`${item.name}: ${active ? h("ativo", "active") : h("desativado", "disabled")}`}/></label>{item.custom && <><Button type="button" size="sm" variant="outline" onClick={() => setEditing(item.custom ?? null)}><Pencil/> {h("Editar", "Edit")}</Button><ConfirmAction trigger={<Button type="button" size="sm" variant="ghost"><Trash2/> {h("Excluir", "Delete")}</Button>} title={h("Excluir Entitlement?", "Delete Entitlement?")} description={h("Ele deixará de aparecer nas escolhas. Fichas que dependem dele podem perder a apresentação das regras.", "It will disappear from choices. Sheets that depend on it may lose their rules presentation.")} action={h("Excluir", "Delete")} onConfirm={() => removeCustom(item.id)}/></>}</div></article>;
        })}</div>
      </section>;
    })}</div>
    {editing && <EntitlementHomebrewEditor open onOpenChange={(open) => { if (!open) setEditing(null); }} initial={editing} onSave={saveCustom}/>}
  </section>;
}

export const changelingHomebrew: GameLineHomebrewModule = { Component: ChangelingHomebrew };
