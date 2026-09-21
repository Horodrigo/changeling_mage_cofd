"use client";

import { useState } from "react";
import { ConfirmAction } from "@/app/workspace/confirm-action";
import { RuleSelect } from "@/app/workspace/rule-select";
import { Button } from "@/components/ui/button";
import type { CharacterSheet } from "@/lib/core/character/character-types";
import { useLanguage } from "@/lib/i18n";
import { systemTerm } from "@/lib/system-terms";
import type { VampirePowers, VampireReference } from "./catalog-types";
import { vampireDisciplineDisplayName } from "./creation-rules";

export function removeVampireBloodline(character: CharacterSheet) {
  const next = structuredClone(character);
  const history = Array.isArray(next.current_state.vampire_experience_history)
    ? next.current_state.vampire_experience_history as Array<Record<string, unknown>>
    : [];
  const refunded = history.filter((entry) => {
    const undo = entry.undo as Record<string, unknown> | undefined;
    return undo?.kind === "discipline" && undo.name === "Dead Signal";
  });
  const refund = refunded.reduce((sum, entry) => sum + Math.max(0, Number(entry.cost ?? 0)), 0);
  const disciplines = next.line_data.disciplines && typeof next.line_data.disciplines === "object"
    ? { ...next.line_data.disciplines as Record<string, unknown>, "Dead Signal": 0 }
    : { "Dead Signal": 0 };
  next.line_data = { ...next.line_data, bloodline_id: "", disciplines };
  next.current_state = {
    ...next.current_state,
    experience_available: Math.max(0, Number(next.current_state.experience_available ?? 0)) + refund,
    experience_spent: Math.max(0, Number(next.current_state.experience_spent ?? 0) - refund),
    vampire_experience_history: history.filter((entry) => !refunded.includes(entry)),
  };
  return next;
}

export function BloodlinePage({ character, updateSheet, reference, powers }: {
  character: CharacterSheet;
  updateSheet: (sheet: CharacterSheet) => void;
  reference: VampireReference;
  powers: VampirePowers;
}) {
  const { locale } = useLanguage();
  const h = (pt: string, en: string) => locale === "pt-BR" ? pt : en;
  const current = reference.bloodlines.find((item) => item.id === character.line_data.bloodline_id);
  const [previewId, setPreviewId] = useState(current?.id ?? reference.bloodlines[0]?.id ?? "");
  const preview = current ?? reference.bloodlines.find((item) => item.id === previewId);
  if (!preview) return null;

  const join = () => {
    const next = structuredClone(character);
    next.line_data = { ...next.line_data, bloodline_id: preview.id };
    updateSheet(next);
  };

  return <div className="entitlement-page bloodline-page">
    <header className="entitlement-title">
      <div><h2>{preview.name}</h2><p>{preview.source} · p. {preview.page}</p></div>
      {current
        ? <ConfirmAction
            trigger={<Button type="button" size="sm" variant="destructive">{h("Remover Bloodline", "Remove Bloodline")}</Button>}
            title={h(`Remover ${current.name}?`, `Remove ${current.name}?`)}
            description={h("A Bloodline e seus dots de Dead Signal serão removidos. Experiência gasta em Dead Signal será devolvida.", "The Bloodline and its Dead Signal dots will be removed. Experience spent on Dead Signal will be refunded.")}
            action={h("Remover Bloodline", "Remove Bloodline")}
            onConfirm={() => updateSheet(removeVampireBloodline(character))}
          />
        : <Button type="button" size="sm" onClick={join}>{h("Ingressar na Bloodline", "Join Bloodline")}</Button>}
    </header>

    {!current && <>
      <section className="bloodline-joining-note">
        <h3>{h("Ingresso em Bloodlines", "Joining Bloodlines")}</h3>
        <p>{h("Estas restrições são apenas uma referência e não bloqueiam a escolha na ficha.", "These restrictions are reference only and do not block selection on the sheet.")}</p>
        <ul>
          <li>{h("Potência de Sangue 1: Bloodline do sire.", "Blood Potency 1: the sire's Bloodline.")}</li>
          <li>{h("Potência de Sangue 2: um parente de sangue pode agir como Avus.", "Blood Potency 2: a blood relative may act as Avus.")}</li>
          <li>{h("Potência de Sangue 4: qualquer vampiro do mesmo Clã pode agir como Avus.", "Blood Potency 4: any vampire of the same Clan may act as Avus.")}</li>
          <li>{h("Potência de Sangue 6: o vampiro pode fundar uma Bloodline própria.", "Blood Potency 6: the vampire may found a unique Bloodline.")}</li>
          <li>{h("O Avus alimenta o candidato com ao menos 1 Vitae, com os riscos normais de vício e laço de sangue.", "The Avus feeds the prospect at least 1 Vitae, with the normal risks of addiction and blood bond.")}</li>
          <li>{h("A regra impressa limita cada vampiro a uma Bloodline e não permite abandoná-la.", "The printed rule limits each vampire to one Bloodline and does not allow leaving it.")}</li>
        </ul>
        <small>{["Vampire: The Requiem Second Edition", "p. 98", h("Esta ficha permite remover a Bloodline como regra da casa.", "This sheet allows Bloodline removal as a house rule.")].join(" · ")}</small>
      </section>
      <label className="entitlement-select">{h("Bloodline para consultar", "Bloodline to browse")}<RuleSelect value={preview.id} onChange={setPreviewId} options={reference.bloodlines.map((item) => ({ value: item.id, label: item.name }))} /></label>
    </>}

    <div className="entitlement-overview bloodline-overview">
      <section><h3>{h("Visão geral", "Overview")}</h3><p>{preview.summary}</p></section>
      <section><h3>{h("Linhagem", "Lineage")}</h3><p><strong>{h("Clã de origem", "Parent Clan")}:</strong> {preview.parentClan}</p>{preview.requirements && <p><strong>{h("Afiliação", "Affiliation")}:</strong> {preview.requirements}</p>}<p><strong>{h("Apelidos", "Nicknames")}:</strong> {preview.nicknames.join(", ")}</p></section>
    </div>
    <section>
      <h3>{h("Vantagens da Bloodline", "Bloodline Advantages")}</h3>
      <p><strong>{h("Atributos favorecidos", "Favored Attributes")}:</strong> {preview.favoredAttributes.map((item) => systemTerm(item, locale)).join(" / ")}</p>
      <div className="bloodline-discipline-list">{preview.disciplines.map((name) => <span key={name}>{vampireDisciplineDisplayName(name, powers.disciplines, locale)}{name === preview.exclusiveDiscipline ? ` · ${h("exclusiva", "exclusive")}` : ""}</span>)}</div>
      <small>{h("As quatro Disciplinas são apresentadas como referência. Apenas a Disciplina exclusiva é limitada mecanicamente à Bloodline.", "The four Disciplines are shown as reference. Only the exclusive Discipline is mechanically restricted to the Bloodline.")}</small>
    </section>
    <section className="bloodline-bane-card"><h3>{preview.baneName}</h3><p>{preview.baneSummary}</p><small>{h("Esta Bane permanece ativa enquanto a Bloodline estiver selecionada.", "This Bane remains active while the Bloodline is selected.")}</small></section>
  </div>;
}
