"use client";

import { useState } from "react";
import { useHomebrewPreferences } from "@/app/use-homebrew";
import { ConfirmAction } from "@/app/workspace/confirm-action";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { CharacterSheet } from "@/lib/core/character/character-types";
import { homebrewContentActive, saveHomebrewPreferences, setHomebrewEnabled } from "@/lib/homebrew";
import { useLanguage } from "@/lib/i18n";
import { catalogDisplayName } from "@/lib/localized-catalog";
import { alphabetical } from "@/lib/option-order";
import { systemTerm } from "@/lib/system-terms";
import { BloodlineHomebrewEditor } from "./bloodline-homebrew-editor";
import { BLOODLINE_HOMEBREW_SOURCE_ID, saveBloodlineHomebrews } from "./bloodline-homebrews";
import type { VampireBloodlineDefinition, VampirePowers, VampireReference } from "./catalog-types";
import { leaveBloodTetherPack, stringArray, synchronizeAutomaticBloodlineDevotions, vampireBloodlineAvailable, vampireBloodlineFavoredAttributes, vampireDisciplineDisplayName } from "./creation-rules";
import { useBloodlineHomebrews } from "./use-bloodline-homebrews";
import { vampireBloodlinePresentation } from "./reference-presentation";

function replaceFavoredAttributes(character: CharacterSheet, previous: readonly string[], replacement: readonly string[]) {
  const next = structuredClone(character), attributes = { ...next.attributes };
  const before = new Set(previous.filter(Boolean)), after = new Set(replacement.filter(Boolean));
  const limit = Math.max(5, Number(next.derived?.LimiteDeCaracteristica ?? 5));
  for (const name of before) if (!after.has(name)) attributes[name] = Math.max(1, Number(attributes[name] ?? 1) - 1);
  for (const name of after) if (!before.has(name)) attributes[name] = Math.min(limit, Number(attributes[name] ?? 1) + 1);
  return { ...next, attributes };
}

export function joinVampireBloodline(character: CharacterSheet, definition: VampireBloodlineDefinition, favoredAttribute: string, powers: VampirePowers, clan?: VampireReference["clans"][number]) {
  if (!vampireBloodlineFavoredAttributes(definition, clan).includes(favoredAttribute)) return character;
  const previous = character.line_data.bloodline_id
    ? [String(character.line_data.bloodline_favored_attribute ?? "")]
    : stringArray(character.line_data.favored_attributes).length ? stringArray(character.line_data.favored_attributes) : [String(character.line_data.favored_attribute ?? "")];
  const next = replaceFavoredAttributes(character, previous, [favoredAttribute]);
  next.line_data = { ...next.line_data, bloodline_id: definition.id, bloodline_favored_attribute: favoredAttribute };
  return synchronizeAutomaticBloodlineDevotions(next, powers);
}

export function removeVampireBloodline(character: CharacterSheet, definition?: VampireBloodlineDefinition, powers?: VampirePowers) {
  const restore = stringArray(character.line_data.favored_attributes).length ? stringArray(character.line_data.favored_attributes) : [String(character.line_data.favored_attribute ?? "")];
  const next = leaveBloodTetherPack(replaceFavoredAttributes(character, [String(character.line_data.bloodline_favored_attribute ?? "")], restore));
  const history = Array.isArray(next.current_state.vampire_experience_history) ? next.current_state.vampire_experience_history as Array<Record<string, unknown>> : [];
  const exclusive = new Set((powers?.disciplines ?? []).filter((item) => item.bloodlineId === definition?.id).map((item) => item.name));
  if (definition?.exclusiveDiscipline) exclusive.add(definition.exclusiveDiscipline);
  const refunded = history.filter((entry) => { const undo = entry.undo as Record<string, unknown> | undefined; return undo?.kind === "lash" || undo?.kind === "discipline" && exclusive.has(String(undo.name ?? "")); });
  const refund = refunded.reduce((sum, entry) => sum + Math.max(0, Number(entry.cost ?? 0)), 0);
  const disciplines = next.line_data.disciplines && typeof next.line_data.disciplines === "object" ? { ...next.line_data.disciplines as Record<string, unknown> } : {};
  for (const name of exclusive) disciplines[name] = 0;
  next.line_data = { ...next.line_data, bloodline_id: "", bloodline_favored_attribute: "", disciplines, lash_ids: [], blood_tether_pack_active: false };
  next.current_state = { ...next.current_state, experience_available: Math.max(0, Number(next.current_state.experience_available ?? 0)) + refund, experience_spent: Math.max(0, Number(next.current_state.experience_spent ?? 0) - refund), vampire_experience_history: history.filter((entry) => !refunded.includes(entry)) };
  return powers ? synchronizeAutomaticBloodlineDevotions(next, powers) : next;
}

export function BloodlineJoinDialog({ open, onOpenChange, onJoined, character, updateSheet, reference, powers }: {
  open: boolean; onOpenChange: (open: boolean) => void; onJoined: () => void; character: CharacterSheet; updateSheet: (sheet: CharacterSheet) => void; reference: VampireReference; powers: VampirePowers;
}) {
  const { locale, t } = useLanguage();
  const preferences = useHomebrewPreferences(), custom = useBloodlineHomebrews();
  const bloodlines = [...reference.bloodlines, ...custom.filter((item) => !reference.bloodlines.some((official) => official.id === item.id))];
  const available = alphabetical(bloodlines.filter((item) => homebrewContentActive(preferences, item.id, item.sourceId) && vampireBloodlineAvailable(item, character, reference)), (item) => catalogDisplayName(item, locale, undefined, "pt-BR"), locale);
  const [previewId, setPreviewId] = useState("");
  const [favoredAttribute, setFavoredAttribute] = useState("");
  const [editorOpen, setEditorOpen] = useState(false);
  const preview = available.find((item) => item.id === previewId) ?? available[0];
  const clan = reference.clans.find((item) => item.id === character.line_data.clan_id);
  const favoredAttributes = preview ? vampireBloodlineFavoredAttributes(preview, clan) : [];
  const choose = (id: string) => {
    if (id !== "__create__") { setPreviewId(id); setFavoredAttribute(""); return; }
    onOpenChange(false); setEditorOpen(true);
  };
  const saveCustom = (definition: VampireBloodlineDefinition) => {
    saveBloodlineHomebrews([...custom, definition]);
    saveHomebrewPreferences(setHomebrewEnabled(setHomebrewEnabled(preferences, BLOODLINE_HOMEBREW_SOURCE_ID, true), definition.id, true));
    setPreviewId(definition.id);
  };
  const join = () => {
    if (!preview || !favoredAttributes.includes(favoredAttribute)) return;
    updateSheet(joinVampireBloodline(character, preview, favoredAttribute, powers, clan)); onOpenChange(false); onJoined();
  };
  return <>
    <Dialog open={open} onOpenChange={onOpenChange}><DialogContent className="homebrew-dialog vampire-bloodline-join-dialog vtr-dialog">
      <DialogHeader><DialogTitle>{t("ui.joinBloodlineTitle")}</DialogTitle><DialogDescription>{t("ui.joinBloodlineDescription")}</DialogDescription></DialogHeader>
      <label className="affiliation-select">{t("ui.bloodlineToBrowse")}<Select value={preview?.id} onValueChange={choose}><SelectTrigger><SelectValue placeholder={t("ui.chooseBloodline")} /></SelectTrigger><SelectContent><SelectItem value="__create__">{t("ui.createHomebrewBloodline")}</SelectItem>{available.map((item) => <SelectItem key={item.id} value={item.id}>{catalogDisplayName(item, locale, undefined, "pt-BR")}</SelectItem>)}</SelectContent></Select></label>
      <JoiningNote />
      {preview && <label>{t("ui.bloodlineFavoredAttribute")}<Select value={favoredAttribute || undefined} onValueChange={setFavoredAttribute}><SelectTrigger><SelectValue placeholder={t("ui.chooseAttribute")} /></SelectTrigger><SelectContent>{favoredAttributes.map((name) => <SelectItem key={name} value={name}>{systemTerm(name, locale)}</SelectItem>)}</SelectContent></Select></label>}
      {preview && <BloodlineDetails definition={preview} powers={powers} />}
      <DialogFooter><Button type="button" variant="outline" onClick={() => onOpenChange(false)}>{t("common.cancel")}</Button><Button type="button" disabled={!preview || !favoredAttributes.includes(favoredAttribute)} onClick={join}>{t("ui.joinBloodline")}</Button></DialogFooter>
    </DialogContent></Dialog>
    <BloodlineHomebrewEditor key={editorOpen ? "open" : "closed"} open={editorOpen} onOpenChange={(next) => { setEditorOpen(next); if (!next) onOpenChange(true); }} clans={reference.clans} onSave={saveCustom} />
  </>;
}

export function BloodlinePage({ character, updateSheet, bloodlines, powers, onRemoved }: {
  character: CharacterSheet; updateSheet: (sheet: CharacterSheet) => void; bloodlines: readonly VampireBloodlineDefinition[]; powers: VampirePowers; onRemoved: () => void;
}) {
  const { locale, t } = useLanguage();
  const currentId = String(character.line_data.bloodline_id ?? ""), current = bloodlines.find((item) => item.id === currentId);
  const remove = () => { updateSheet(removeVampireBloodline(character, current, powers)); onRemoved(); };
  if (!current) return <div className="affiliation-page bloodline-page"><header className="affiliation-title"><div><h2>{currentId || t("ui.noBloodline")}</h2><p>{t("ui.bloodlineDefinitionUnavailable")}</p></div>{currentId && <ConfirmAction trigger={<Button type="button" size="sm" className="builder-add-action" variant="destructive">{t("ui.leaveBloodline")}</Button>} title={t("ui.leaveBloodlineTitle")} description={t("ui.removeBloodlineDescription")} action={t("ui.leave") } onConfirm={remove} />}</header></div>;
  const currentName = catalogDisplayName(current, locale, undefined, "pt-BR");
  return <div className="affiliation-page bloodline-page">
    <header className="affiliation-title"><div><h2>{currentName}</h2><p>{current.source}{current.page ? ` · p. ${current.page}` : ""}</p></div><ConfirmAction trigger={<Button type="button" size="sm" className="builder-add-action" variant="destructive">{t("ui.leaveBloodline")}</Button>} title={t("ui.leaveNamedBloodline", { name: currentName })} description={t("ui.leaveBloodlineConsequences")} action={t("ui.leaveBloodline")} onConfirm={remove} /></header>
    <BloodlineDetails definition={current} powers={powers} />
  </div>;
}

function JoiningNote() {
  const { t } = useLanguage();
  return <section className="bloodline-joining-note"><h3>{t("ui.eligibility")}</h3><p>{t("ui.bloodlineEligibilityDescription")}</p><ul><li>{t("ui.bloodlineEligibilityOne")}</li><li>{t("ui.bloodlineEligibilityTwo")}</li><li>{t("ui.bloodlineEligibilityFour")}</li><li>{t("ui.bloodlineEligibilitySix")}</li><li>{t("ui.avusFeedingRule")}</li><li>{t("ui.oneBloodlineRule")}</li></ul><small>{["Vampire: The Requiem Second Edition", "p. 98", t("ui.bloodlineRemovalHouseRule")].join(" · ")}</small></section>;
}

function BloodlineDetails({ definition, powers }: { definition: VampireBloodlineDefinition; powers: VampirePowers }) {
  const { locale, t } = useLanguage();
  const presented = vampireBloodlinePresentation(definition, locale);
  return <div className="bloodline-details"><div className="affiliation-overview bloodline-overview"><section><h3>{t("ui.overview")}</h3><p>{presented.summary}</p></section><section><h3>{t("ui.lineage")}</h3><p><strong>{t("ui.parentClan")}:</strong> {presented.parentClan}</p>{presented.requirements && <p><strong>{t("ui.affiliation")}:</strong> {presented.requirements}</p>}{presented.nicknames.length > 0 && <p><strong>{t("ui.nicknames")}:</strong> {presented.nicknames.join(", ")}</p>}</section></div><section><h3>{t("ui.bloodlineAdvantages")}</h3><p><strong>{t("ui.favoredAttributes")}:</strong> {presented.favoredAttributes.map((item) => systemTerm(item, locale)).join(" / ")}</p><div className="bloodline-discipline-list">{presented.disciplines.map((name) => <span key={name}>{vampireDisciplineDisplayName(name, powers.disciplines, locale)}{name === presented.exclusiveDiscipline ? ` · ${t("ui.exclusive")}` : ""}</span>)}</div><small>{t("ui.bloodlineDisciplineReference")}</small></section>{presented.giftName && <section><h3>{presented.giftName}</h3><p>{presented.giftSummary}</p></section>}<section className="bloodline-bane-card"><h3>{presented.baneName}</h3><p>{presented.baneSummary}</p><small>{t("ui.bloodlineBaneActive")}</small></section></div>;
}
