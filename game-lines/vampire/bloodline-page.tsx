"use client";

import { useState } from "react";
import { useHomebrewPreferences } from "@/app/use-homebrew";
import { ConfirmAction } from "@/app/workspace/confirm-action";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { CharacterSheet } from "@/lib/core/character/character-types";
import { homebrewContentActive, saveHomebrewPreferences, setHomebrewEnabled } from "@/lib/homebrew";
import { localized, useLanguage } from "@/lib/i18n";
import { alphabetical } from "@/lib/option-order";
import { systemTerm } from "@/lib/system-terms";
import { BloodlineHomebrewEditor } from "./bloodline-homebrew-editor";
import { BLOODLINE_HOMEBREW_SOURCE_ID, saveBloodlineHomebrews } from "./bloodline-homebrews";
import type { VampireBloodlineDefinition, VampirePowers, VampireReference } from "./catalog-types";
import { vampireDisciplineDisplayName } from "./creation-rules";
import { useBloodlineHomebrews } from "./use-bloodline-homebrews";
import { vampireHomebrewContentActive } from "./homebrew-catalog";

export function removeVampireBloodline(character: CharacterSheet, definition?: VampireBloodlineDefinition, powers?: VampirePowers) {
  const next = structuredClone(character);
  const history = Array.isArray(next.current_state.vampire_experience_history) ? next.current_state.vampire_experience_history as Array<Record<string, unknown>> : [];
  const exclusive = new Set((powers?.disciplines ?? []).filter((item) => item.bloodlineId === definition?.id).map((item) => item.name));
  if (definition?.exclusiveDiscipline) exclusive.add(definition.exclusiveDiscipline);
  const refunded = history.filter((entry) => { const undo = entry.undo as Record<string, unknown> | undefined; return undo?.kind === "discipline" && exclusive.has(String(undo.name ?? "")); });
  const refund = refunded.reduce((sum, entry) => sum + Math.max(0, Number(entry.cost ?? 0)), 0);
  const disciplines = next.line_data.disciplines && typeof next.line_data.disciplines === "object" ? { ...next.line_data.disciplines as Record<string, unknown> } : {};
  for (const name of exclusive) disciplines[name] = 0;
  const automatic = new Set((powers?.devotions ?? []).filter((item) => item.bloodlineId === definition?.id && Number(item.experienceCost ?? 0) === 0).map((item) => item.id));
  const devotionIds = Array.isArray(next.line_data.devotion_ids) ? next.line_data.devotion_ids.map(String).filter((id) => !automatic.has(id)) : [];
  next.line_data = { ...next.line_data, bloodline_id: "", disciplines, devotion_ids: devotionIds };
  next.current_state = { ...next.current_state, experience_available: Math.max(0, Number(next.current_state.experience_available ?? 0)) + refund, experience_spent: Math.max(0, Number(next.current_state.experience_spent ?? 0) - refund), vampire_experience_history: history.filter((entry) => !refunded.includes(entry)) };
  return next;
}

export function BloodlineJoinDialog({ open, onOpenChange, onJoined, character, updateSheet, reference, powers }: {
  open: boolean; onOpenChange: (open: boolean) => void; onJoined: () => void; character: CharacterSheet; updateSheet: (sheet: CharacterSheet) => void; reference: VampireReference; powers: VampirePowers;
}) {
  const { locale } = useLanguage(), h = (pt: string, en: string) => localized(locale, pt, en);
  const preferences = useHomebrewPreferences(), custom = useBloodlineHomebrews();
  const bloodlines = [...reference.bloodlines, ...custom.filter((item) => !reference.bloodlines.some((official) => official.id === item.id))];
  const available = alphabetical(bloodlines.filter((item) => homebrewContentActive(preferences, item.id, item.sourceId)), (item) => item.name, locale);
  const [previewId, setPreviewId] = useState("");
  const [editorOpen, setEditorOpen] = useState(false);
  const preview = available.find((item) => item.id === previewId) ?? available[0];
  const choose = (id: string) => {
    if (id !== "__create__") { setPreviewId(id); return; }
    onOpenChange(false); setEditorOpen(true);
  };
  const saveCustom = (definition: VampireBloodlineDefinition) => {
    saveBloodlineHomebrews([...custom, definition]);
    saveHomebrewPreferences(setHomebrewEnabled(setHomebrewEnabled(preferences, BLOODLINE_HOMEBREW_SOURCE_ID, true), definition.id, true));
    setPreviewId(definition.id);
  };
  const join = () => {
    if (!preview) return;
    const next = structuredClone(character);
    const devotionIds = new Set(Array.isArray(next.line_data.devotion_ids) ? next.line_data.devotion_ids.map(String) : []);
    for (const item of powers.devotions) if (vampireHomebrewContentActive(preferences, item) && item.bloodlineId === preview.id && Number(item.experienceCost ?? 0) === 0) devotionIds.add(item.id);
    next.line_data = { ...next.line_data, bloodline_id: preview.id, devotion_ids: [...devotionIds] };
    updateSheet(next); onOpenChange(false); onJoined();
  };
  return <>
    <Dialog open={open} onOpenChange={onOpenChange}><DialogContent className="homebrew-dialog vampire-bloodline-join-dialog vtr-dialog">
      <DialogHeader><DialogTitle>{h("Ingressar em uma Bloodline", "Join a Bloodline")}</DialogTitle><DialogDescription>{h("Consulte as vantagens e a Bane antes de confirmar a linhagem.", "Review the advantages and Bane before confirming the lineage.")}</DialogDescription></DialogHeader>
      <label className="entitlement-select">{h("Bloodline para consultar", "Bloodline to browse")}<Select value={preview?.id} onValueChange={choose}><SelectTrigger><SelectValue placeholder={h("Escolha uma Bloodline", "Choose a Bloodline")} /></SelectTrigger><SelectContent><SelectItem value="__create__">{h("Criar nova Bloodline", "Create New Bloodline")}</SelectItem>{available.map((item) => <SelectItem key={item.id} value={item.id}>{item.name}</SelectItem>)}</SelectContent></Select></label>
      <JoiningNote />
      {preview && <BloodlineDetails definition={preview} powers={powers} />}
      <DialogFooter><Button type="button" variant="outline" onClick={() => onOpenChange(false)}>{h("Cancelar", "Cancel")}</Button><Button type="button" disabled={!preview} onClick={join}>{h("Ingressar na Bloodline", "Join Bloodline")}</Button></DialogFooter>
    </DialogContent></Dialog>
    <BloodlineHomebrewEditor key={editorOpen ? "open" : "closed"} open={editorOpen} onOpenChange={(next) => { setEditorOpen(next); if (!next) onOpenChange(true); }} clans={reference.clans} onSave={saveCustom} />
  </>;
}

export function BloodlinePage({ character, updateSheet, bloodlines, powers, onRemoved }: {
  character: CharacterSheet; updateSheet: (sheet: CharacterSheet) => void; bloodlines: readonly VampireBloodlineDefinition[]; powers: VampirePowers; onRemoved: () => void;
}) {
  const { locale } = useLanguage(), h = (pt: string, en: string) => localized(locale, pt, en);
  const currentId = String(character.line_data.bloodline_id ?? ""), current = bloodlines.find((item) => item.id === currentId);
  const remove = () => { updateSheet(removeVampireBloodline(character, current, powers)); onRemoved(); };
  if (!current) return <div className="entitlement-page bloodline-page"><header className="entitlement-title"><div><h2>{currentId || h("Nenhuma Bloodline", "No Bloodline")}</h2><p>{h("A definição desta Bloodline não está mais disponível.", "This Bloodline definition is no longer available.")}</p></div>{currentId && <ConfirmAction trigger={<Button type="button" size="sm" variant="destructive">{h("Sair da Bloodline", "Leave Bloodline")}</Button>} title={h("Sair da Bloodline?", "Leave Bloodline?")} description={h("A Bloodline será removida da ficha.", "The Bloodline will be removed from the sheet.")} action={h("Sair", "Leave")} onConfirm={remove} />}</header></div>;
  return <div className="entitlement-page bloodline-page">
    <header className="entitlement-title"><div><h2>{current.name}</h2><p>{current.source}{current.page ? ` · p. ${current.page}` : ""}</p></div><ConfirmAction trigger={<Button type="button" size="sm" variant="destructive">{h("Sair da Bloodline", "Leave Bloodline")}</Button>} title={h(`Sair de ${current.name}?`, `Leave ${current.name}?`)} description={h("A Bloodline, sua Disciplina exclusiva e seus poderes automáticos serão removidos; a Experiência gasta na Disciplina será devolvida.", "The Bloodline, its exclusive Discipline, and automatic powers will be removed; Experience spent on the Discipline will be refunded.")} action={h("Sair da Bloodline", "Leave Bloodline")} onConfirm={remove} /></header>
    <BloodlineDetails definition={current} powers={powers} />
  </div>;
}

function JoiningNote() {
  const { locale } = useLanguage(), h = (pt: string, en: string) => localized(locale, pt, en);
  return <section className="bloodline-joining-note"><h3>{h("Elegibilidade", "Eligibility")}</h3><p>{h("Estas restrições são apenas uma referência e não bloqueiam a escolha na ficha.", "These restrictions are reference only and do not block selection on the sheet.")}</p><ul><li>{h("Potência de Sangue 1: Bloodline do sire.", "Blood Potency 1: the sire's Bloodline.")}</li><li>{h("Potência de Sangue 2: um parente de sangue pode agir como Avus.", "Blood Potency 2: a blood relative may act as Avus.")}</li><li>{h("Potência de Sangue 4: qualquer vampiro do mesmo Clã pode agir como Avus.", "Blood Potency 4: any vampire of the same Clan may act as Avus.")}</li><li>{h("Potência de Sangue 6: o vampiro pode fundar uma Bloodline própria.", "Blood Potency 6: the vampire may found a unique Bloodline.")}</li><li>{h("O Avus alimenta o candidato com ao menos 1 Vitae, com os riscos normais de vício e laço de sangue.", "The Avus feeds the prospect at least 1 Vitae, with the normal risks of addiction and blood bond.")}</li><li>{h("A regra impressa limita cada vampiro a uma Bloodline e não permite abandoná-la.", "The printed rule limits each vampire to one Bloodline and does not allow leaving it.")}</li></ul><small>{["Vampire: The Requiem Second Edition", "p. 98", h("Esta ficha permite remover a Bloodline como regra da casa.", "This sheet allows Bloodline removal as a house rule.")].join(" · ")}</small></section>;
}

function BloodlineDetails({ definition, powers }: { definition: VampireBloodlineDefinition; powers: VampirePowers }) {
  const { locale } = useLanguage(), h = (pt: string, en: string) => localized(locale, pt, en);
  return <div className="bloodline-details"><div className="entitlement-overview bloodline-overview"><section><h3>{h("Visão geral", "Overview")}</h3><p>{definition.summary}</p></section><section><h3>{h("Linhagem", "Lineage")}</h3><p><strong>{h("Clã de origem", "Parent Clan")}:</strong> {definition.parentClan}</p>{definition.requirements && <p><strong>{h("Afiliação", "Affiliation")}:</strong> {definition.requirements}</p>}{definition.nicknames.length > 0 && <p><strong>{h("Apelidos", "Nicknames")}:</strong> {definition.nicknames.join(", ")}</p>}</section></div><section><h3>{h("Vantagens da Bloodline", "Bloodline Advantages")}</h3><p><strong>{h("Atributos favorecidos", "Favored Attributes")}:</strong> {definition.favoredAttributes.map((item) => systemTerm(item, locale)).join(" / ")}</p><div className="bloodline-discipline-list">{definition.disciplines.map((name) => <span key={name}>{vampireDisciplineDisplayName(name, powers.disciplines, locale)}{name === definition.exclusiveDiscipline ? ` · ${h("exclusiva", "exclusive")}` : ""}</span>)}</div><small>{h("As quatro Disciplinas são apresentadas como referência. Apenas a Disciplina exclusiva é limitada mecanicamente à Bloodline.", "The four Disciplines are shown as reference. Only the exclusive Discipline is mechanically restricted to the Bloodline.")}</small></section>{definition.giftName && <section><h3>{definition.giftName}</h3><p>{definition.giftSummary}</p></section>}<section className="bloodline-bane-card"><h3>{definition.baneName}</h3><p>{definition.baneSummary}</p><small>{h("Esta Bane permanece ativa enquanto a Bloodline estiver selecionada.", "This Bane remains active while the Bloodline is selected.")}</small></section></div>;
}
