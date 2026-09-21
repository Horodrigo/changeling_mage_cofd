"use client";

import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { useHomebrewPreferences } from "@/app/use-homebrew";
import { ConfirmAction } from "@/app/workspace/confirm-action";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import type { GameLineHomebrewModule, GameLineHomebrewProps } from "@/lib/game-line-contracts/game-line-ui";
import { homebrewContentActive, saveHomebrewPreferences, setHomebrewEnabled } from "@/lib/homebrew";
import { localized, useLanguage } from "@/lib/i18n";
import { BloodlineHomebrewEditor } from "./bloodline-homebrew-editor";
import { BLOODLINE_HOMEBREW_SOURCE, BLOODLINE_HOMEBREW_SOURCE_ID, saveBloodlineHomebrews } from "./bloodline-homebrews";
import type { VampireBloodlineDefinition, VampireReference } from "./catalog-types";
import { useBloodlineHomebrews } from "./use-bloodline-homebrews";

function VampireHomebrew({ catalogs }: GameLineHomebrewProps) {
  if (!catalogs) throw new Error("Vampire Homebrew requires its catalog snapshot.");
  const { locale } = useLanguage(), h = (pt: string, en: string) => localized(locale, pt, en);
  const preferences = useHomebrewPreferences(), items = useBloodlineHomebrews();
  const reference = catalogs.get<VampireReference>("vampire-reference");
  const [editing, setEditing] = useState<VampireBloodlineDefinition | null>(null);
  const sourceActive = !preferences.disabledIds.includes(BLOODLINE_HOMEBREW_SOURCE_ID);
  const toggle = (id: string, enabled: boolean) => saveHomebrewPreferences(setHomebrewEnabled(preferences, id, enabled));
  const save = (definition: VampireBloodlineDefinition) => {
    saveBloodlineHomebrews(items.map((item) => item.id === definition.id ? definition : item));
    saveHomebrewPreferences(setHomebrewEnabled(setHomebrewEnabled(preferences, BLOODLINE_HOMEBREW_SOURCE_ID, true), definition.id, true));
  };
  return <section className="homebrew-panel">
    <div className="panel-heading"><div><h3>{h("Homebrews de Vampire", "Vampire Homebrews")}</h3><p>{h("Bloodlines criadas por jogadores podem ser ativadas, editadas ou excluídas aqui.", "Player-created Bloodlines can be enabled, edited, or deleted here.")}</p></div></div>
    {items.length === 0 ? <p>{h("Nenhuma Bloodline criada pelo jogador.", "No player-created Bloodlines yet.")}</p> : <div className="homebrew-source-list"><details className="panel homebrew-source" open><summary className="homebrew-source-summary"><div><Badge variant="outline">{h("Criado pelo jogador", "Player-created")}</Badge><strong>{BLOODLINE_HOMEBREW_SOURCE}</strong><span>{items.length} {h("itens implementados", "implemented items")}</span></div></summary><div className="homebrew-source-body"><div className="homebrew-source-controls"><label className="homebrew-toggle"><span>{sourceActive ? h("Fonte ativa", "Source active") : h("Fonte desativada", "Source disabled")}</span><Switch checked={sourceActive} onCheckedChange={(checked) => toggle(BLOODLINE_HOMEBREW_SOURCE_ID, checked)} /></label></div><div className="homebrew-kind-list"><details className="homebrew-kind" open><summary><strong>{h("Bloodlines", "Bloodlines")}</strong><Badge variant="outline">{items.length}</Badge></summary><div className="homebrew-grid">{[...items].sort((left, right) => left.name.localeCompare(right.name, locale)).map((item) => {
      const active = homebrewContentActive(preferences, item.id, item.sourceId);
      return <article className="homebrew-card" key={item.id}><div><h3>{item.name}</h3><p>{item.summary}</p></div><div className="homebrew-card-actions"><label className="homebrew-toggle"><span>{active ? h("Ativa", "Active") : h("Desativada", "Disabled")}</span><Switch disabled={!sourceActive} checked={active} onCheckedChange={(checked) => toggle(item.id, checked)} /></label><Button type="button" size="sm" variant="outline" onClick={() => setEditing(item)}><Pencil /> {h("Editar", "Edit")}</Button><ConfirmAction trigger={<Button type="button" size="sm" variant="ghost"><Trash2 /> {h("Excluir", "Delete")}</Button>} title={h("Excluir Bloodline?", "Delete Bloodline?")} description={h("Ela deixará de aparecer nas escolhas. Fichas que a usam manterão o identificador, mas perderão a apresentação das regras.", "It will disappear from choices. Sheets using it will retain its identifier but lose the rules presentation.")} action={h("Excluir", "Delete")} onConfirm={() => saveBloodlineHomebrews(items.filter((entry) => entry.id !== item.id))} /></div></article>;
    })}</div></details></div></div></details></div>}
    {editing && <BloodlineHomebrewEditor open initial={editing} clans={reference.clans} onOpenChange={(open) => { if (!open) setEditing(null); }} onSave={save} />}
  </section>;
}

export const vampireHomebrew: GameLineHomebrewModule = { Component: VampireHomebrew };
