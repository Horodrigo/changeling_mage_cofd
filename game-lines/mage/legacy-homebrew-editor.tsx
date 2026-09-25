"use client";

import { useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { localized, useLanguage } from "@/lib/i18n";
import { systemTerm } from "@/lib/system-terms";
import { ARCANA, MTA_ORDERS, MTA_PATHS } from "./creation-rules";
import { LEGACY_ATTAINMENT_MINIMUMS, legacyHomebrewId, normalizeLegacyHomebrew } from "./legacy-homebrews";
import type { LegacyDefinition } from "./legacies";

const emptyLegacy = (founderCharacterId: string, path: string, order: string): LegacyDefinition => ({
  id: legacyHomebrewId(), name: "", source: "", page: 0, homebrew: true, founderCharacterId,
  parentage: { paths: path ? [path] : [], orders: order && order !== "Orderless" ? [order] : [] }, rulingArcanum: "", prerequisites: "",
  initiation: "", organization: "", theory: "", yantras: [], oblations: [],
  attainments: LEGACY_ATTAINMENT_MINIMUMS.map(({ rank, orthodoxGnosis, novelGnosis }) => ({ rank, name: "", prerequisites: "", rulingArcanum: rank, orthodoxGnosis, novelGnosis, description: "" })),
});

export function LegacyHomebrewEditor({ open, onOpenChange, initial, founderCharacterId = "", defaultPath = "", defaultOrder = "", onSave }: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initial?: LegacyDefinition | null;
  founderCharacterId?: string;
  defaultPath?: string;
  defaultOrder?: string;
  onSave: (definition: LegacyDefinition) => void;
}) {
  const { locale } = useLanguage(), h = (pt: string, en: string) => localized(locale, pt, en);
  const [value, setValue] = useState<LegacyDefinition>(() => initial ? structuredClone(initial) : emptyLegacy(founderCharacterId, defaultPath, defaultOrder));
  const [error, setError] = useState("");
  const set = (key: keyof LegacyDefinition, next: unknown) => setValue((current) => ({ ...current, [key]: next }));
  const setAttainment = (index: number, key: "name" | "description" | "optional" | "praxisName", next: string) => setValue((current) => ({ ...current, attainments: current.attainments.map((item, itemIndex) => itemIndex === index ? { ...item, [key]: next } : item) }));
  const commit = () => {
    const normalized = normalizeLegacyHomebrew(value);
    if (!normalized) { setError(h("Preencha a identidade, a doutrina, ao menos um Yantra e uma Oblação, e os cinco Attainments.", "Complete the identity, doctrine, at least one Yantra and Oblation, and all five Attainments.")); return; }
    onSave(normalized); onOpenChange(false);
  };
  return <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="homebrew-dialog mage-legacy-homebrew-editor mage-legacy-join-dialog">
      <DialogHeader><DialogTitle>{initial ? h("Editar Legacy", "Edit Legacy") : h("Criar nova Legacy", "Create New Legacy")}</DialogTitle><DialogDescription>{h("Defina a tradição, o Arcano Regente e a progressão completa. O fundador precisa de Gnose 3, dois pontos no Arcano Regente e 1 Experiência Arcana.", "Define the tradition, Ruling Arcanum, and complete progression. The founder needs Gnosis 3, two dots in the Ruling Arcanum, and 1 Arcane Experience.")}</DialogDescription></DialogHeader>
      <div className="homebrew-form">
        <Section title={h("Identidade e linhagem", "Identity and lineage")}>
          <Field label={h("Nome da Legacy *", "Legacy name *")}><Input value={value.name} onChange={(event) => set("name", event.target.value)} /></Field>
          <Field label={h("Arcano Regente *", "Ruling Arcanum *")}><Select value={value.rulingArcanum || undefined} onValueChange={(next) => set("rulingArcanum", next)}><SelectTrigger><SelectValue placeholder={h("Escolha o Arcano", "Choose the Arcanum")} /></SelectTrigger><SelectContent>{ARCANA.map((name) => <SelectItem key={name} value={name}>{systemTerm(name, locale)}</SelectItem>)}</SelectContent></Select></Field>
          <Field label={h("Path de origem *", "Originating Path *")}><Select value={value.parentage.paths[0]} onValueChange={(next) => set("parentage", { ...value.parentage, paths: [next] })}><SelectTrigger><SelectValue placeholder={h("Escolha o Path", "Choose the Path")} /></SelectTrigger><SelectContent>{Object.keys(MTA_PATHS).map((name) => <SelectItem key={name} value={name}>{name}</SelectItem>)}</SelectContent></Select></Field>
          <Field label={h("Order associada", "Associated Order")}><Select value={value.parentage.orders[0] || "none"} onValueChange={(next) => set("parentage", { ...value.parentage, orders: next === "none" ? [] : [next] })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="none">{h("Nenhuma", "None")}</SelectItem>{Object.keys(MTA_ORDERS).map((name) => <SelectItem key={name} value={name}>{name}</SelectItem>)}</SelectContent></Select></Field>
          <Field wide label={h("Pré-requisitos adicionais", "Additional prerequisites")}><Textarea value={value.additionalPrerequisites ?? ""} onChange={(event) => set("additionalPrerequisites", event.target.value)} /></Field>
        </Section>
        <Section title={h("Doutrina", "Doctrine")}>
          <Field wide label={h("Iniciação e indoctrinação *", "Initiation and indoctrination *")}><Textarea value={value.initiation} onChange={(event) => set("initiation", event.target.value)} /></Field>
          <Field wide label={h("Organização *", "Organization *")}><Textarea value={value.organization} onChange={(event) => set("organization", event.target.value)} /></Field>
          <Field wide label={h("Teoria e Mystery explorado *", "Theory and explored Mystery *")}><Textarea value={value.theory} onChange={(event) => set("theory", event.target.value)} /></Field>
          <Field wide label={h("Yantras (um por linha) *", "Yantras (one per line) *")}><Textarea value={value.yantras.join("\n")} onChange={(event) => set("yantras", event.target.value.split("\n"))} /></Field>
          <Field wide label={h("Oblações (uma por linha) *", "Oblations (one per line) *")}><Textarea value={value.oblations.join("\n")} onChange={(event) => set("oblations", event.target.value.split("\n"))} /></Field>
        </Section>
        {value.attainments.map((attainment, index) => {
          const minimum = LEGACY_ATTAINMENT_MINIMUMS[index];
          return <Section key={attainment.rank} title={`${h("Attainment", "Attainment")} ${attainment.rank}`}>
            <p>{h(`Mínimos fixos: ${value.rulingArcanum || "Arcano Regente"} ${attainment.rank}; Gnose ${minimum.orthodoxGnosis}/${minimum.novelGnosis} (ortodoxo/novo).`, `Fixed minimums: ${value.rulingArcanum || "Ruling Arcanum"} ${attainment.rank}; Gnosis ${minimum.orthodoxGnosis}/${minimum.novelGnosis} (orthodox/novel).`)}</p>
            <Field label={h("Nome *", "Name *")}><Input value={attainment.name} onChange={(event) => setAttainment(index, "name", event.target.value)} /></Field>
            <Field label={h("Práxis equivalente", "Equivalent Praxis")}><Input value={attainment.praxisName ?? ""} onChange={(event) => setAttainment(index, "praxisName", event.target.value)} /></Field>
            <Field wide label={h("Efeito *", "Effect *")}><Textarea value={attainment.description} onChange={(event) => setAttainment(index, "description", event.target.value)} /></Field>
            <Field wide label={h("Efeito opcional", "Optional effect")}><Textarea value={attainment.optional ?? ""} onChange={(event) => setAttainment(index, "optional", event.target.value)} /></Field>
          </Section>;
        })}
      </div>
      {error && <p className="homebrew-error" role="alert">{error}</p>}
      <DialogFooter><Button type="button" variant="outline" onClick={() => onOpenChange(false)}>{h("Cancelar", "Cancel")}</Button><Button type="button" onClick={commit}>{h("Salvar Legacy", "Save Legacy")}</Button></DialogFooter>
    </DialogContent>
  </Dialog>;
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return <fieldset className="wide homebrew-section"><legend><span>{title}</span></legend><div>{children}</div></fieldset>;
}

function Field({ label, children, wide = false }: { label: string; children: ReactNode; wide?: boolean }) {
  return <label className={wide ? "wide" : ""}><span>{label}</span>{children}</label>;
}
