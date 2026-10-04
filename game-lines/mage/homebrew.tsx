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
import { useLanguage } from "@/lib/i18n";
import { systemTerm } from "@/lib/system-terms";
import type { MeritDefinition } from "@/lib/merits";
import { LegacyHomebrewEditor } from "./legacy-homebrew-editor";
import { LEGACY_HOMEBREW_SOURCE_ID, saveLegacyHomebrews } from "./legacy-homebrews";
import type { LegacyDefinition } from "./legacies";
import { useLegacyHomebrews } from "./use-legacy-homebrews";
import { SpellHomebrewEditor } from "./spell-homebrew-editor";
import { SPELL_HOMEBREW_SOURCE, SPELL_HOMEBREW_SOURCE_ID, saveSpellHomebrews, spellHomebrewId, type SpellHomebrew } from "./spell-homebrews";
import { useSpellHomebrews } from "./use-spell-homebrews";

function MageHomebrew({ catalogs }: GameLineHomebrewProps) {
  if (!catalogs) throw new Error("Mage Homebrew requires its catalog snapshot.");
  const { locale, t } = useLanguage();
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
      <div className="panel-heading"><div><h3>{t("ui.playerCreatedSpells")}</h3><p>{t("ui.playerCreatedSpellsDescription")}</p></div><Button type="button" size="sm" onClick={() => setEditingSpell({ id: spellHomebrewId(), name: "", originalName: "", requirements: {}, practice: "", primaryFactor: "Potency", withstand: "None", roteSkills: [], summary: "", description: "", sourceId: SPELL_HOMEBREW_SOURCE_ID, source: SPELL_HOMEBREW_SOURCE, page: 0, homebrew: true })}><Plus/> {t("ui.createSpell")}</Button></div>
      {customSpells.length === 0 ? <p>{t("ui.noPlayerCreatedSpells")}</p> : <div className="homebrew-source-list"><details className="panel homebrew-source" open><summary className="homebrew-source-summary"><div><Badge variant="outline">{t("ui.playerCreated")}</Badge><strong>{t("ui.playerCreatedSpells")}</strong><span>{customSpells.length} {t("ui.items")}</span></div></summary><div className="homebrew-source-body"><div className="homebrew-source-controls"><label className="homebrew-toggle"><span>{!preferences.disabledIds.includes(SPELL_HOMEBREW_SOURCE_ID) ? t("ui.sourceActive") : t("ui.sourceDisabled")}</span><Switch checked={!preferences.disabledIds.includes(SPELL_HOMEBREW_SOURCE_ID)} onCheckedChange={(checked) => toggle(SPELL_HOMEBREW_SOURCE_ID, checked)}/></label></div><div className="homebrew-grid">{customSpells.map((item) => { const active = homebrewContentActive(preferences, item.id, item.sourceId), sourceActive = !preferences.disabledIds.includes(SPELL_HOMEBREW_SOURCE_ID); return <article className="homebrew-card" key={item.id}><div><h3>{item.name}</h3><p>{item.summary}</p><small>{Object.entries(item.requirements).map(([name, rating]) => `${systemTerm(name, locale)} ${rating}`).join(", ")}</small></div><div className="homebrew-card-actions"><label className="homebrew-toggle"><span>{active ? t("ui.activeMasculine") : t("ui.disabledMasculine")}</span><Switch disabled={!sourceActive} checked={active} onCheckedChange={(checked) => toggle(item.id, checked)}/></label><Button type="button" size="sm" variant="outline" onClick={() => setEditingSpell(item)}><Pencil/> {t("ui.editAction")}</Button><ConfirmAction trigger={<Button type="button" size="sm" variant="ghost"><Trash2/> {t("ui.deleteAction")}</Button>} title={t("ui.deleteSpellTitle")} description={t("ui.deleteSpellDescription")} action={t("ui.deleteAction")} onConfirm={() => saveSpellHomebrews(customSpells.filter((entry) => entry.id !== item.id))}/></div></article>; })}</div></div></details></div>}
      {editingSpell && <SpellHomebrewEditor initial={editingSpell} onOpenChange={(open) => { if (!open) setEditingSpell(null); }} onSave={saveSpell}/>}
    </section>
    <section className="homebrew-panel">
      <div className="panel-heading"><div><h3>{t("ui.playerCreatedLegacies")}</h3><p>{t("ui.playerCreatedLegaciesDescription")}</p></div><Button type="button" size="sm" onClick={() => { setEditing(null); setLegacyEditorOpen(true); }}><Plus/> {t("ui.createLegacy")}</Button></div>
      {customLegacies.length === 0 ? <p>{t("ui.noPlayerCreatedLegacies")}</p> : <div className="homebrew-source-list"><details className="panel homebrew-source"><summary className="homebrew-source-summary"><div><Badge variant="outline">{t("ui.playerCreated")}</Badge><strong>{t("ui.playerCreatedLegacies")}</strong><span>{customLegacies.length} {t("ui.implementedItems")}</span></div></summary><div className="homebrew-source-body"><div className="homebrew-source-controls"><label className="homebrew-toggle"><span>{!preferences.disabledIds.includes(LEGACY_HOMEBREW_SOURCE_ID) ? t("ui.sourceActive") : t("ui.sourceDisabled")}</span><Switch checked={!preferences.disabledIds.includes(LEGACY_HOMEBREW_SOURCE_ID)} onCheckedChange={(checked) => toggle(LEGACY_HOMEBREW_SOURCE_ID, checked)}/></label></div><div className="homebrew-grid">{[...customLegacies].sort((left, right) => left.name.localeCompare(right.name, locale)).map((item) => {
        const active = homebrewContentActive(preferences, item.id, item.sourceId), sourceActive = !preferences.disabledIds.includes(LEGACY_HOMEBREW_SOURCE_ID);
        return <article className="homebrew-card" key={item.id}><div><h3>{item.name}</h3><p>{item.theory}</p></div><div className="homebrew-card-actions"><label className="homebrew-toggle"><span>{active ? t("ui.active") : t("ui.disabledFeminine")}</span><Switch disabled={!sourceActive} checked={active} onCheckedChange={(checked) => toggle(item.id, checked)}/></label><Button type="button" size="sm" variant="outline" onClick={() => { setEditing(item); setLegacyEditorOpen(true); }}><Pencil/> {t("ui.editAction")}</Button><ConfirmAction trigger={<Button type="button" size="sm" variant="ghost"><Trash2/> {t("ui.deleteAction")}</Button>} title={t("ui.deleteLegacyTitle")} description={t("ui.deleteLegacyDescription")} action={t("ui.deleteAction")} onConfirm={() => saveLegacyHomebrews(customLegacies.filter((entry) => entry.id !== item.id))}/></div></article>;
      })}</div></div></details></div>}
      {legacyEditorOpen && <LegacyHomebrewEditor open initial={editing} onOpenChange={setLegacyEditorOpen} onSave={save}/>}
    </section>
  </>;
}

export const mageHomebrew: GameLineHomebrewModule = { Component: MageHomebrew };
