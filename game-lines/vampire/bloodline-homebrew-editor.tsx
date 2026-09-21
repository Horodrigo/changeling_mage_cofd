"use client";

import { useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ATTRIBUTES } from "@/lib/core/character/creation-rules";
import { localized, useLanguage } from "@/lib/i18n";
import { systemTerm } from "@/lib/system-terms";
import { bloodlineHomebrewId, normalizeBloodlineHomebrew } from "./bloodline-homebrews";
import type { VampireBloodlineDefinition, VampireClanDefinition } from "./catalog-types";
import { VAMPIRE_DISCIPLINES } from "./creation-rules";

const emptyBloodline = (): VampireBloodlineDefinition => ({
  id: bloodlineHomebrewId(), name: "", translatedName: "", parentClan: "", requirements: "", nicknames: [],
  favoredAttributes: ["", ""], disciplines: ["", "", "", ""], summary: "", baneName: "", baneSummary: "", sourceId: "", source: "", page: 0, homebrew: true,
});

export function BloodlineHomebrewEditor({ open, onOpenChange, initial, clans, onSave }: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initial?: VampireBloodlineDefinition | null;
  clans: readonly VampireClanDefinition[];
  onSave: (definition: VampireBloodlineDefinition) => void;
}) {
  const { locale } = useLanguage(), h = (pt: string, en: string) => localized(locale, pt, en);
  const [value, setValue] = useState<VampireBloodlineDefinition>(() => initial ? structuredClone(initial) : emptyBloodline());
  const [error, setError] = useState("");
  const set = (key: keyof VampireBloodlineDefinition, next: unknown) => setValue((current) => ({ ...current, [key]: next }));
  const commit = () => {
    const normalized = normalizeBloodlineHomebrew(value);
    if (!normalized) { setError(h("Preencha os campos obrigatórios e escolha dois Atributos e quatro Disciplinas diferentes.", "Complete the required fields and choose two different Attributes and four different Disciplines.")); return; }
    onSave(normalized); onOpenChange(false);
  };
  const attributes = Object.values(ATTRIBUTES).flat();
  return <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="homebrew-dialog bloodline-homebrew-editor vtr-dialog">
      <DialogHeader><DialogTitle>{initial ? h("Editar Bloodline", "Edit Bloodline") : h("Criar nova Bloodline", "Create New Bloodline")}</DialogTitle><DialogDescription>{h("Defina a linhagem, suas Disciplinas, vantagens e a Bane adicional.", "Define the lineage, its Disciplines, advantages, and additional Bane.")}</DialogDescription></DialogHeader>
      <div className="homebrew-form">
        <Section title={h("Identidade e linhagem", "Identity and lineage")}>
          <Field label={h("Nome da Bloodline *", "Bloodline name *")}><Input value={value.name} onChange={(event) => set("name", event.target.value)} /></Field>
          <Field label={h("Clã de origem *", "Parent Clan *")}><Select value={value.parentClan || undefined} onValueChange={(next) => set("parentClan", next)}><SelectTrigger><SelectValue placeholder={h("Escolha o Clã", "Choose the Clan")} /></SelectTrigger><SelectContent>{clans.map((clan) => <SelectItem key={clan.id} value={clan.name}>{locale === "pt-BR" ? clan.translatedName : clan.name}</SelectItem>)}</SelectContent></Select></Field>
          <Field wide label={h("Apelidos (um por linha)", "Nicknames (one per line)")}><Textarea value={value.nicknames.join("\n")} onChange={(event) => set("nicknames", event.target.value.split("\n"))} /></Field>
          <Field wide label={h("Requisitos ou tradição de ingresso", "Joining requirements or tradition")}><Textarea value={value.requirements ?? ""} onChange={(event) => set("requirements", event.target.value)} /></Field>
          <Field wide label={h("Visão geral *", "Overview *")}><Textarea value={value.summary} onChange={(event) => set("summary", event.target.value)} /></Field>
        </Section>
        <Section title={h("Vantagens da Bloodline", "Bloodline advantages")}>
          {[0, 1].map((index) => <Field key={`attribute-${index}`} label={`${h("Atributo favorecido", "Favored Attribute")} ${index + 1} *`}><Select value={value.favoredAttributes[index] || undefined} onValueChange={(next) => set("favoredAttributes", value.favoredAttributes.map((item, itemIndex) => itemIndex === index ? next : item))}><SelectTrigger><SelectValue placeholder={h("Escolha", "Choose")} /></SelectTrigger><SelectContent>{attributes.map((attribute) => <SelectItem key={attribute} value={attribute}>{systemTerm(attribute, locale)}</SelectItem>)}</SelectContent></Select></Field>)}
          {[0, 1, 2, 3].map((index) => <Field key={`discipline-${index}`} label={`${h("Disciplina em Clã", "In-clan Discipline")} ${index + 1} *`}><Input list="vampire-bloodline-disciplines" value={value.disciplines[index]} onChange={(event) => set("disciplines", value.disciplines.map((item, itemIndex) => itemIndex === index ? event.target.value : item))} /></Field>)}
          <datalist id="vampire-bloodline-disciplines">{VAMPIRE_DISCIPLINES.map((name) => <option key={name} value={name} />)}</datalist>
          <Field wide label={h("Disciplina exclusiva (uma das quatro; opcional)", "Exclusive Discipline (one of the four; optional)")}><Select value={value.exclusiveDiscipline || "none"} onValueChange={(next) => set("exclusiveDiscipline", next === "none" ? undefined : next)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="none">{h("Nenhuma", "None")}</SelectItem>{value.disciplines.filter(Boolean).map((name) => <SelectItem key={name} value={name}>{name}</SelectItem>)}</SelectContent></Select></Field>
          <p>{h("Uma Disciplina nova pode ser registrada pelo nome, mas seus poderes precisam existir no catálogo para serem comprados na ficha.", "A new Discipline may be recorded by name, but its powers must exist in the catalog before they can be purchased on the sheet.")}</p>
        </Section>
        <Section title={h("Bane adicional", "Additional Bane")}>
          <Field label={h("Nome da Bane *", "Bane name *")}><Input value={value.baneName} onChange={(event) => set("baneName", event.target.value)} /></Field>
          <Field wide label={h("Regras da Bane *", "Bane rules *")}><Textarea value={value.baneSummary} onChange={(event) => set("baneSummary", event.target.value)} /></Field>
        </Section>
      </div>
      {error && <p className="homebrew-error" role="alert">{error}</p>}
      <DialogFooter><Button type="button" variant="outline" onClick={() => onOpenChange(false)}>{h("Cancelar", "Cancel")}</Button><Button type="button" onClick={commit}>{h("Salvar Bloodline", "Save Bloodline")}</Button></DialogFooter>
    </DialogContent>
  </Dialog>;
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return <fieldset className="wide homebrew-section"><legend><span>{title}</span></legend><div>{children}</div></fieldset>;
}

function Field({ label, children, wide = false }: { label: string; children: ReactNode; wide?: boolean }) {
  return <label className={wide ? "wide" : ""}><span>{label}</span>{children}</label>;
}
