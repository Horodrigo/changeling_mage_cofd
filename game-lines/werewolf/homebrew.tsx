"use client";

import { useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { ConfirmAction } from "@/app/workspace/confirm-action";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import type { GameLineHomebrewModule, GameLineHomebrewProps } from "@/lib/game-line-contracts/game-line-ui";
import { homebrewContentActive, saveHomebrewPreferences, setHomebrewEnabled } from "@/lib/homebrew";
import { useLanguage } from "@/lib/i18n";
import { useHomebrewPreferences } from "@/app/use-homebrew";
import { useWerewolfLodgeHomebrews } from "./use-lodge-homebrews";
import { saveWerewolfLodgeHomebrews } from "./lodge-homebrews";
import { WerewolfLodgeHomebrewEditor } from "./lodge-homebrew-editor";
import { werewolfLodgePresentation, type WerewolfLodgeCatalog, type WerewolfLodgeDefinition } from "./catalogs/lodges";

function WerewolfHomebrew({ catalogs }: GameLineHomebrewProps) {
  if (!catalogs) throw new Error("Werewolf Homebrew requires its catalog snapshot.");
  const { locale, t } = useLanguage();
  const preferences = useHomebrewPreferences();
  const custom = useWerewolfLodgeHomebrews();
  const catalog = catalogs.get<WerewolfLodgeCatalog>("werewolf-lodges");
  const [query, setQuery] = useState("");
  const [editor, setEditor] = useState<{ open: boolean; initial: WerewolfLodgeDefinition | null }>({ open: false, initial: null });
  const localizedCustom = custom.map(item => werewolfLodgePresentation(item, catalog, locale));
  const filtered = localizedCustom.filter(item => `${item.name} ${item.summary} ${item.description}`.toLocaleLowerCase(locale).includes(query.toLocaleLowerCase(locale)));
  const save = (definition: WerewolfLodgeDefinition) => saveWerewolfLodgeHomebrews(custom.some(item => item.id === definition.id)
    ? custom.map(item => item.id === definition.id ? definition : item)
    : [...custom, definition]);
  const remove = (id: string) => saveWerewolfLodgeHomebrews(custom.filter(item => item.id !== id));
  return <section className="wtf-lodge-homebrews">
    <header className="panel-heading"><div><h2>{t("werewolf.playerCreatedLodges")}</h2></div>
      <Button type="button" size="sm" onClick={() => setEditor({ open: true, initial: null })}><Plus/>{t("werewolf.lodgeCreate")}</Button>
    </header>
    <label className="wtf-lodge-search"><span>{t("werewolf.lodgeSearch")}</span><Input value={query} onChange={event => setQuery(event.target.value)} /></label>
    <div className="wtf-lodge-list">{filtered.map(item => {
      const isHomebrew = custom.some(customItem => customItem.id === item.id);
      const active = homebrewContentActive(preferences, item.id, item.sourceId);
      return <article className="panel wtf-lodge-homebrew-card" key={item.id}>
        <header><div><h3>{item.name}</h3><p>{item.summary}</p><Badge variant={isHomebrew ? "secondary" : "outline"}>{isHomebrew ? t("workspace.homebrewBadge") : item.source}</Badge></div>
          {isHomebrew && <div className="wtf-lodge-card-actions">
            <label className="wtf-lodge-toggle"><span>{t("ui.active")}</span><Switch checked={active} onCheckedChange={enabled => saveHomebrewPreferences(setHomebrewEnabled(preferences, item.id, enabled))}/></label>
            <Button type="button" size="sm" variant="outline" onClick={() => setEditor({ open: true, initial: custom.find(customItem => customItem.id === item.id) ?? null })}><Pencil/>{t("ui.editAction")}</Button>
            <ConfirmAction trigger={<Button type="button" size="sm" variant="destructive"><Trash2/>{t("werewolf.lodgeDelete")}</Button>}
              title={t("werewolf.lodgeDelete")} description={t("ui.deleteItemDescription")} action={t("werewolf.lodgeDelete")} onConfirm={() => remove(item.id)}/>
          </div>}
        </header>
        <p>{item.description}</p>
        <LodgeDetails item={item} t={t}/>
      </article>;
    })}</div>
    <WerewolfLodgeHomebrewEditor key={editor.initial?.id ?? (editor.open ? "new" : "closed")} open={editor.open}
      initial={editor.initial} onOpenChange={open => setEditor(current => ({ ...current, open }))} onSave={save}/>
  </section>;
}

function LodgeDetails({ item, t }: { item: WerewolfLodgeDefinition; t: ReturnType<typeof useLanguage>["t"] }) {
  const fields = [
    [t("werewolf.lodgeAdmission"), item.admission], [t("werewolf.lodgeRecruitment"), item.recruitment],
    [t("werewolf.lodgeTotem"), item.totem], [t("werewolf.lodgeBlessing"), item.blessing],
    [t("werewolf.lodgeAspiration"), item.aspiration], [t("werewolf.lodgeBan"), item.ban],
    [t("werewolf.lodgeSacredHunt"), item.sacredHunt],
  ].filter((entry): entry is [string, string] => Boolean(entry[1]));
  return <dl className="wtf-lodge-details">{fields.map(([label, text]) => <div key={label}><dt>{label}</dt><dd>{text}</dd></div>)}
    {Boolean(item.access?.length) && <div><dt>{t("werewolf.lodgeAccess")}</dt><dd>{item.access?.join(", ")}</dd></div>}
    <div><dt>{t("werewolf.lodgeSource")}</dt><dd>{item.source}{item.page ? ` · p. ${item.page}` : ""}</dd></div>
  </dl>;
}

export const werewolfHomebrew: GameLineHomebrewModule = { Component: WerewolfHomebrew };
