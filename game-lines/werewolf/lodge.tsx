"use client";

import { useMemo, useState } from "react";
import { ConfirmAction } from "@/app/workspace/confirm-action";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useHomebrewPreferences } from "@/app/use-homebrew";
import type { CharacterSheet } from "@/lib/core/character/character-types";
import { homebrewContentActive, saveHomebrewPreferences, setHomebrewEnabled } from "@/lib/homebrew";
import { useLanguage } from "@/lib/i18n";
import { alphabetical } from "@/lib/option-order";
import { catalogDisplayName } from "@/lib/localized-catalog";
import type { WerewolfLodgeCatalog, WerewolfLodgeDefinition } from "./catalogs/lodges";
import { werewolfLodgePresentation } from "./catalogs/lodges";
import { leaveWerewolfLodge, joinWerewolfLodge, werewolfLodgeId } from "./lodge-membership";
import { useWerewolfLodgeHomebrews } from "./use-lodge-homebrews";
import { saveWerewolfLodgeHomebrews, WEREWOLF_LODGE_HOMEBREW_SOURCE_ID } from "./lodge-homebrews";
import { WerewolfLodgeHomebrewEditor } from "./lodge-homebrew-editor";

export function WerewolfLodgeIdentity({ character, catalog, onOpen }: {
  character: CharacterSheet;
  catalog: WerewolfLodgeCatalog;
  onOpen: (hasMembership: boolean) => void;
}) {
  const { locale, t } = useLanguage();
  const custom = useWerewolfLodgeHomebrews();
  const currentId = werewolfLodgeId(character.line_data.lodge_id);
  const definition = [...catalog.lodges, ...custom].find(item => item.id === currentId);
  const displayName = definition
    ? catalogDisplayName(werewolfLodgePresentation(definition, catalog, locale), locale, undefined, "pt-BR")
    : currentId || t("ui.join");

  return <div className="official-field wtf-lodge-identity">
    <span>{t("werewolf.lodge")}</span>
    <button type="button" onClick={() => onOpen(Boolean(currentId))} aria-label={`${t("werewolf.lodge")}: ${displayName}`}>
      {displayName}
    </button>
  </div>;
}

export function WerewolfLodgePage({ character, updateSheet, catalog, onLeft }: {
  character: CharacterSheet;
  updateSheet: (sheet: CharacterSheet) => void;
  catalog: WerewolfLodgeCatalog;
  onLeft: () => void;
}) {
  const { locale, t } = useLanguage();
  const custom = useWerewolfLodgeHomebrews();
  const currentId = werewolfLodgeId(character.line_data.lodge_id);
  const definition = [...catalog.lodges, ...custom].find(item => item.id === currentId);
  const presented = definition ? werewolfLodgePresentation(definition, catalog, locale) : null;
  const name = presented ? catalogDisplayName(presented, locale, undefined, "pt-BR") : currentId;
  const leave = () => {
    updateSheet(leaveWerewolfLodge(character, currentId));
    onLeft();
  };

  if (!currentId) return null;
  if (!presented) return <section className="affiliation-page wtf-lodge-membership">
    <header className="affiliation-title"><div><h2>{currentId}</h2><p>{t("werewolf.lodgeUnavailable")}</p></div>
      <LeaveLodgeAction name={name} onLeave={leave}/>
    </header>
  </section>;

  const details: Array<[string, string | string[] | undefined]> = [
    [t("werewolf.lodgeAdmission"), presented.admission],
    [t("werewolf.lodgeRecruitment"), presented.recruitment],
    [t("werewolf.lodgeTotem"), presented.totem],
    [t("werewolf.lodgeBlessing"), presented.blessing],
    [t("werewolf.lodgeAspiration"), presented.aspiration],
    [t("werewolf.lodgeBan"), presented.ban],
    [t("werewolf.lodgeSacredHunt"), presented.sacredHunt],
    [t("werewolf.lodgeAccess"), presented.access],
  ];
  return <div className="affiliation-page wtf-lodge-membership">
    <header className="affiliation-title"><div><h2>{name}</h2><p>{presented.source}{presented.page ? ` · p. ${presented.page}` : ""}</p></div>
      <LeaveLodgeAction name={name} onLeave={leave}/>
    </header>
    <div className="affiliation-overview">
      <section><h3>{t("ui.overview")}</h3><p>{presented.summary}</p><p>{presented.description}</p></section>
      {details.some(([, value]) => Array.isArray(value) ? value.length : Boolean(value)) && <section>
        <h3>{t("ui.details")}</h3>
        <dl className="wtf-lodge-details">{details.map(([label, value]) => {
          const text = Array.isArray(value) ? value.join(", ") : value;
          return text ? <div key={label}><dt>{label}</dt><dd>{text}</dd></div> : null;
        })}</dl>
      </section>}
    </div>
    <label className="wtf-lodge-notes">{t("werewolf.lodgeNotes")}
      <Textarea value={String(character.line_data.lodge_notes ?? "")}
        onChange={event => updateSheet({ ...character, line_data: { ...character.line_data, lodge_notes: event.target.value } })}/>
    </label>
  </div>;
}

function LeaveLodgeAction({ name, onLeave }: { name: string; onLeave: () => void }) {
  const { t } = useLanguage();
  return <ConfirmAction trigger={<Button type="button" size="sm" className="builder-add-action" variant="destructive">{t("werewolf.leaveLodge")}</Button>}
    title={t("werewolf.leaveLodgeTitle", { name })} description={t("werewolf.leaveLodgeDescription")}
    action={t("ui.leave")} onConfirm={onLeave}/>;
}

export function WerewolfLodgeJoinDialog({ open, onOpenChange, character, updateSheet, catalog, onJoined }: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  character: CharacterSheet;
  updateSheet: (sheet: CharacterSheet) => void;
  catalog: WerewolfLodgeCatalog;
  onJoined: () => void;
}) {
  const { locale, t } = useLanguage();
  const preferences = useHomebrewPreferences();
  const custom = useWerewolfLodgeHomebrews();
  const [previewId, setPreviewId] = useState("");
  const [editorOpen, setEditorOpen] = useState(false);
  const lodges = useMemo(() => alphabetical(
    [...catalog.lodges, ...custom.filter(item => !catalog.lodges.some(official => official.id === item.id))]
      .filter(item => homebrewContentActive(preferences, item.id, item.sourceId)),
    item => catalogDisplayName(item, locale, undefined, "pt-BR"),
    locale,
  ), [catalog, custom, locale, preferences]);
  const preview = lodges.find(item => item.id === previewId) ?? lodges[0];
  const saveCustom = (definition: WerewolfLodgeDefinition) => {
    saveWerewolfLodgeHomebrews([...custom.filter(item => item.id !== definition.id), definition]);
    saveHomebrewPreferences(setHomebrewEnabled(setHomebrewEnabled(preferences, WEREWOLF_LODGE_HOMEBREW_SOURCE_ID, true), definition.id, true));
    setPreviewId(definition.id);
    setEditorOpen(false);
    onOpenChange(true);
  };
  const select = (value: string) => {
    if (value === "__create__") {
      onOpenChange(false);
      setEditorOpen(true);
    } else setPreviewId(value);
  };
  const join = () => {
    if (!preview || werewolfLodgeId(character.line_data.lodge_id)) return;
    updateSheet(joinWerewolfLodge(character, preview.id));
    onOpenChange(false);
    onJoined();
  };
  const presented = preview ? werewolfLodgePresentation(preview, catalog, locale) : null;
  const details: Array<[string, string | string[] | undefined]> = [
    [t("werewolf.lodgeAdmission"), presented?.admission],
    [t("werewolf.lodgeRecruitment"), presented?.recruitment],
    [t("werewolf.lodgeTotem"), presented?.totem],
    [t("werewolf.lodgeBlessing"), presented?.blessing],
    [t("werewolf.lodgeAspiration"), presented?.aspiration],
    [t("werewolf.lodgeBan"), presented?.ban],
    [t("werewolf.lodgeSacredHunt"), presented?.sacredHunt],
    [t("werewolf.lodgeAccess"), presented?.access],
  ];
  return <>
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="homebrew-dialog wtf-lodge-join-dialog">
        <DialogHeader><DialogTitle>{t("werewolf.joinLodgeTitle")}</DialogTitle><DialogDescription>{t("werewolf.joinLodgeDescription")}</DialogDescription></DialogHeader>
        <label className="wtf-lodge-select">{t("werewolf.chooseLodge")}
          <Select value={preview?.id} onValueChange={select}>
            <SelectTrigger><SelectValue placeholder={t("werewolf.chooseLodge")}/></SelectTrigger>
            <SelectContent>
              <SelectItem value="__create__">{t("werewolf.lodgeCreate")}</SelectItem>
              {lodges.map(item => <SelectItem key={item.id} value={item.id}>{catalogDisplayName(item, locale, undefined, "pt-BR")}</SelectItem>)}
            </SelectContent>
          </Select>
        </label>
        {presented && <div className="wtf-lodge-preview">
          <h3>{catalogDisplayName(presented, locale, undefined, "pt-BR")}</h3>
          <p>{presented.summary}</p><p>{presented.description}</p>
          {details.some(([, value]) => Array.isArray(value) ? value.length : Boolean(value)) && <dl className="wtf-lodge-details">
            {details.map(([label, value]) => {
              const text = Array.isArray(value) ? value.join(", ") : value;
              return text ? <div key={label}><dt>{label}</dt><dd>{text}</dd></div> : null;
            })}
          </dl>}
          <small>{presented.source}{presented.page ? ` · p. ${presented.page}` : ""}</small>
        </div>}
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>{t("common.cancel")}</Button>
          <Button type="button" disabled={!preview || Boolean(werewolfLodgeId(character.line_data.lodge_id))} onClick={join}>{t("werewolf.confirmJoinLodge")}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    <WerewolfLodgeHomebrewEditor key={editorOpen ? "open" : "closed"} open={editorOpen} onOpenChange={setEditorOpen}
      onSave={saveCustom} initial={null}/>
  </>;
}
