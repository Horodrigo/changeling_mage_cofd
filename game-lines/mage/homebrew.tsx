"use client";

import { useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { MeritHomebrewPanel } from "@/app/merit-homebrew-panel";
import { useHomebrewPreferences } from "@/app/use-homebrew";
import { ConfirmAction } from "@/app/workspace/confirm-action";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import type { GameLineHomebrewModule, GameLineHomebrewProps } from "@/lib/game-line-contracts/game-line-ui";
import { homebrewContentActive, saveHomebrewPreferences, setHomebrewEnabled } from "@/lib/homebrew";
import { localized, useLanguage } from "@/lib/i18n";
import type { MeritDefinition } from "@/lib/merits";
import { LegacyHomebrewEditor } from "./legacy-homebrew-editor";
import { LEGACY_HOMEBREW_SOURCE, LEGACY_HOMEBREW_SOURCE_ID, saveLegacyHomebrews } from "./legacy-homebrews";
import type { LegacyDefinition } from "./legacies";
import { useLegacyHomebrews } from "./use-legacy-homebrews";
import { SpellHomebrewEditor } from "./spell-homebrew-editor";
import { SPELL_HOMEBREW_SOURCE, SPELL_HOMEBREW_SOURCE_ID, saveSpellHomebrews, spellHomebrewId, type SpellHomebrew } from "./spell-homebrews";
import { useSpellHomebrews } from "./use-spell-homebrews";

function MageHomebrew({ catalogs }: GameLineHomebrewProps) {
  if (!catalogs) throw new Error("Mage Homebrew requires its catalog snapshot.");
  const { locale } = useLanguage(), h = (pt: string, en: string) => localized(locale, pt, en);
  const preferences = useHomebrewPreferences(), customSpells = useSpellHomebrews(), customLegacies = useLegacyHomebrews();
  const [editingSpell, setEditingSpell] = useState<SpellHomebrew | null>(null);
  const [legacyEditorOpen, setLegacyEditorOpen] = useState(false), [editing, setEditing] = useState<LegacyDefinition | null>(null);
  const toggle = (id: string, enabled: boolean) => saveHomebrewPreferences(setHomebrewEnabled(preferences, id, enabled));
  const save = (definition: LegacyDefinition) => {
    saveLegacyHomebrews(customLegacies.some((item) => item.id === definition.id) ? customLegacies.map((item) => item.id === definition.id ? definition : item) : [...customLegacies, definition]);
    saveHomebrewPreferences(setHomebrewEnabled(setHomebrewEnabled(preferences, LEGACY_HOMEBREW_SOURCE_ID, true), definition.id, true));
  };
  const saveSpell = (definition: SpellHomebrew) => {
    saveSpellHomebrews(customSpells.some((item) => item.id === definition.id) ? customSpells.map((item) => item.id === definition.id ? definition : item) : [...customSpells, definition]);
    saveHomebrewPreferences(setHomebrewEnabled(setHomebrewEnabled(preferences, SPELL_HOMEBREW_SOURCE_ID, true), definition.id, true));
  };
  return <>
    <MeritHomebrewPanel line="MtA" catalog={[...catalogs.get<readonly MeritDefinition[]>("core-merits"), ...catalogs.get<readonly MeritDefinition[]>("mage-merits")]}/>
    <section className="homebrew-panel">
      <div className="panel-heading"><div><h3>{h("Feitiços criados", "Player-created Spells")}</h3><p>{h("Disponíveis para compra como Rote ou Praxis.", "Available for purchase as a Rote or Praxis.")}</p></div><Button type="button" size="sm" onClick={() => setEditingSpell({ id: spellHomebrewId(), name: "", originalName: "", requirements: {}, practice: "", primaryFactor: "Potency", withstand: "None", roteSkills: [], summary: "", description: "", sourceId: SPELL_HOMEBREW_SOURCE_ID, source: SPELL_HOMEBREW_SOURCE, page: 0, homebrew: true })}><Plus/> {h("Criar Feitiço", "Create Spell")}</Button></div>
      {customSpells.length === 0 ? <p>{h("Nenhum Feitiço criado pelo jogador.", "No player-created Spells yet.")}</p> : <div className="homebrew-source-list"><details className="panel homebrew-source" open><summary className="homebrew-source-summary"><div><Badge variant="outline">{h("Criado pelo jogador", "Player-created")}</Badge><strong>{SPELL_HOMEBREW_SOURCE}</strong><span>{customSpells.length} {h("itens", "items")}</span></div></summary><div className="homebrew-source-body"><div className="homebrew-source-controls"><label className="homebrew-toggle"><span>{!preferences.disabledIds.includes(SPELL_HOMEBREW_SOURCE_ID) ? h("Fonte ativa", "Source active") : h("Fonte desativada", "Source disabled")}</span><Switch checked={!preferences.disabledIds.includes(SPELL_HOMEBREW_SOURCE_ID)} onCheckedChange={(checked) => toggle(SPELL_HOMEBREW_SOURCE_ID, checked)}/></label></div><div className="homebrew-grid">{customSpells.map((item) => { const active = homebrewContentActive(preferences, item.id, item.sourceId), sourceActive = !preferences.disabledIds.includes(SPELL_HOMEBREW_SOURCE_ID); return <article className="homebrew-card" key={item.id}><div><h3>{item.name}</h3><p>{item.summary}</p><small>{Object.entries(item.requirements).map(([name, rating]) => `${name} ${rating}`).join(", ")}</small></div><div className="homebrew-card-actions"><label className="homebrew-toggle"><span>{active ? h("Ativo", "Active") : h("Desativado", "Disabled")}</span><Switch disabled={!sourceActive} checked={active} onCheckedChange={(checked) => toggle(item.id, checked)}/></label><Button type="button" size="sm" variant="outline" onClick={() => setEditingSpell(item)}><Pencil/> {h("Editar", "Edit")}</Button><ConfirmAction trigger={<Button type="button" size="sm" variant="ghost"><Trash2/> {h("Excluir", "Delete")}</Button>} title={h("Excluir Feitiço?", "Delete Spell?")} description={h("Ele deixará de aparecer em novas compras.", "It will disappear from new purchases.")} action={h("Excluir", "Delete")} onConfirm={() => saveSpellHomebrews(customSpells.filter((entry) => entry.id !== item.id))}/></div></article>; })}</div></div></details></div>}
      {editingSpell && <SpellHomebrewEditor initial={editingSpell} onOpenChange={(open) => { if (!open) setEditingSpell(null); }} onSave={saveSpell}/>}
    </section>
    <section className="homebrew-panel">
      <div className="panel-heading"><div><h3>{h("Legacies criadas", "Player-created Legacies")}</h3><p>{h("Legacies criadas por jogadores podem ser ativadas, editadas ou excluídas aqui.", "Player-created Legacies can be enabled, edited, or deleted here.")}</p></div><Button type="button" size="sm" onClick={() => { setEditing(null); setLegacyEditorOpen(true); }}><Plus/> {h("Criar Legacy", "Create Legacy")}</Button></div>
      {customLegacies.length === 0 ? <p>{h("Nenhuma Legacy criada pelo jogador.", "No player-created Legacies yet.")}</p> : <div className="homebrew-source-list"><details className="panel homebrew-source"><summary className="homebrew-source-summary"><div><Badge variant="outline">{h("Criado pelo jogador", "Player-created")}</Badge><strong>{LEGACY_HOMEBREW_SOURCE}</strong><span>{customLegacies.length} {h("itens implementados", "implemented items")}</span></div></summary><div className="homebrew-source-body"><div className="homebrew-source-controls"><label className="homebrew-toggle"><span>{!preferences.disabledIds.includes(LEGACY_HOMEBREW_SOURCE_ID) ? h("Fonte ativa", "Source active") : h("Fonte desativada", "Source disabled")}</span><Switch checked={!preferences.disabledIds.includes(LEGACY_HOMEBREW_SOURCE_ID)} onCheckedChange={(checked) => toggle(LEGACY_HOMEBREW_SOURCE_ID, checked)}/></label></div><div className="homebrew-grid">{[...customLegacies].sort((left, right) => left.name.localeCompare(right.name, locale)).map((item) => {
        const active = homebrewContentActive(preferences, item.id, item.sourceId), sourceActive = !preferences.disabledIds.includes(LEGACY_HOMEBREW_SOURCE_ID);
        return <article className="homebrew-card" key={item.id}><div><h3>{item.name}</h3><p>{item.theory}</p></div><div className="homebrew-card-actions"><label className="homebrew-toggle"><span>{active ? h("Ativa", "Active") : h("Desativada", "Disabled")}</span><Switch disabled={!sourceActive} checked={active} onCheckedChange={(checked) => toggle(item.id, checked)}/></label><Button type="button" size="sm" variant="outline" onClick={() => { setEditing(item); setLegacyEditorOpen(true); }}><Pencil/> {h("Editar", "Edit")}</Button><ConfirmAction trigger={<Button type="button" size="sm" variant="ghost"><Trash2/> {h("Excluir", "Delete")}</Button>} title={h("Excluir Legacy?", "Delete Legacy?")} description={h("Ela deixará de aparecer nas escolhas. Fichas que a usam manterão o identificador, mas perderão a apresentação das regras.", "It will disappear from choices. Sheets using it will retain its identifier but lose the rules presentation.")} action={h("Excluir", "Delete")} onConfirm={() => saveLegacyHomebrews(customLegacies.filter((entry) => entry.id !== item.id))}/></div></article>;
      })}</div></div></details></div>}
      {legacyEditorOpen && <LegacyHomebrewEditor open initial={editing} onOpenChange={setLegacyEditorOpen} onSave={save}/>}
    </section>
  </>;
}

export const mageHomebrew: GameLineHomebrewModule = { Component: MageHomebrew };
