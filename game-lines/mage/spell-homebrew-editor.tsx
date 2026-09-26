"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { localized, useLanguage } from "@/lib/i18n";
import { ARCANA } from "./creation-rules";
import { normalizeSpellHomebrew, type SpellHomebrew } from "./spell-homebrews";

export function SpellHomebrewEditor({ initial, onOpenChange, onSave }: { initial: SpellHomebrew; onOpenChange: (open: boolean) => void; onSave: (spell: SpellHomebrew) => void }) {
  const { locale } = useLanguage(), h = (pt: string, en: string) => localized(locale, pt, en);
  const [value, setValue] = useState(() => structuredClone(initial)), [skills, setSkills] = useState(initial.roteSkills.join(", ")), [error, setError] = useState("");
  const set = (key: keyof SpellHomebrew, next: unknown) => setValue((current) => ({ ...current, [key]: next }));
  const setArcanum = (arcanum: string, rating: number) => setValue((current) => {
    const requirements = { ...current.requirements };
    if (rating) requirements[arcanum] = rating; else delete requirements[arcanum];
    return { ...current, requirements };
  });
  const commit = () => {
    const normalized = normalizeSpellHomebrew({ ...value, roteSkills: skills.split(",") });
    if (!normalized) return setError(h("Preencha nome, Arcana, Prática, fator primário, ao menos uma Perícia de Rote e resumo.", "Complete name, Arcana, Practice, primary factor, at least one Rote Skill, and summary."));
    onSave(normalized); onOpenChange(false);
  };
  return <Dialog open onOpenChange={onOpenChange}><DialogContent className="homebrew-dialog"><DialogHeader><DialogTitle>{value.name ? h("Editar Feitiço", "Edit Spell") : h("Criar Feitiço", "Create Spell")}</DialogTitle><DialogDescription>{h("Feitiços criados podem ser adquiridos como Rotes ou Praxes.", "Created spells can be purchased as Rotes or Praxes.")}</DialogDescription></DialogHeader><div className="homebrew-form">
    <label><span>{h("Nome *", "Name *")}</span><Input value={value.name} onChange={(event) => set("name", event.target.value)}/></label>
    <label><span>{h("Prática *", "Practice *")}</span><Input value={value.practice} onChange={(event) => set("practice", event.target.value)}/></label>
    <label><span>{h("Fator primário *", "Primary factor *")}</span><Input value={value.primaryFactor} onChange={(event) => set("primaryFactor", event.target.value)}/></label>
    <label><span>{h("Resistido por", "Withstand")}</span><Input value={value.withstand} onChange={(event) => set("withstand", event.target.value)}/></label>
    <fieldset className="wide homebrew-section"><legend><span>{h("Arcana *", "Arcana *")}</span></legend><div>{ARCANA.map((arcanum) => <label key={arcanum}><span>{arcanum}</span><Input type="number" min={0} max={5} value={value.requirements[arcanum] ?? 0} onChange={(event) => setArcanum(arcanum, Number(event.target.value))}/></label>)}</div></fieldset>
    <label className="wide"><span>{h("Perícias de Rote, separadas por vírgula *", "Rote Skills, comma-separated *")}</span><Input value={skills} onChange={(event) => setSkills(event.target.value)}/></label>
    <label className="wide"><span>{h("Resumo *", "Summary *")}</span><Textarea value={value.summary ?? ""} onChange={(event) => set("summary", event.target.value)}/></label>
    <label className="wide"><span>{h("Descrição detalhada", "Detailed description")}</span><Textarea value={value.description ?? ""} onChange={(event) => set("description", event.target.value)}/></label>
  </div>{error && <p className="homebrew-error" role="alert">{error}</p>}<DialogFooter><Button type="button" variant="outline" onClick={() => onOpenChange(false)}>{h("Cancelar", "Cancel")}</Button><Button type="button" onClick={commit}>{h("Salvar Feitiço", "Save Spell")}</Button></DialogFooter></DialogContent></Dialog>;
}
