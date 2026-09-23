"use client";

import { useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { ContractDefinition, SeemingKey } from "@/lib/catalog/catalog-types";
import type { CourtDefinition } from "@/lib/changeling-courts";
import { localized, useLanguage } from "@/lib/i18n";
import { systemTerm } from "@/lib/system-terms";
import { CONTRACT_HOMEBREW_SOURCE, CONTRACT_HOMEBREW_SOURCE_ID, contractHomebrewId, normalizeContractHomebrew } from "./contract-homebrews";
import { REGALIA, seemingDisplayName } from "./creation-rules";

type ContractCategory = "Regalia" | "Court" | "Independent" | "Goblin";
const SEEMINGS: SeemingKey[] = ["Beast", "Darkling", "Elemental", "Fairest", "Grimm", "Ogre", "Wizened"];

const emptyContract = (): ContractDefinition => ({
  id: contractHomebrewId(), name: "", originalName: "", type: "Comum", categoryKind: "Regalia", regalia: REGALIA[0],
  description: "", hasRoll: false, dicePool: "None", cost: "", action: "Instant", duration: "One scene", loophole: "",
  sourceId: CONTRACT_HOMEBREW_SOURCE_ID, source: CONTRACT_HOMEBREW_SOURCE, page: 0, homebrew: true,
});

const categoryFor = (item: ContractDefinition): ContractCategory => item.goblin || item.regalia === "Goblin"
  ? "Goblin"
  : item.categoryKind === "Corte" ? "Court" : item.categoryKind === "Independente" ? "Independent" : "Regalia";

export function ContractHomebrewEditor({ open, onOpenChange, initial, courts, onSave }: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initial?: ContractDefinition | null;
  courts: readonly CourtDefinition[];
  onSave: (definition: ContractDefinition) => void;
}) {
  const { locale } = useLanguage(), h = (pt: string, en: string) => localized(locale, pt, en);
  const [value, setValue] = useState<ContractDefinition>(() => initial ? structuredClone(initial) : emptyContract());
  const [error, setError] = useState("");
  const category = categoryFor(value);
  const set = (key: keyof ContractDefinition, next: unknown) => setValue((current) => ({ ...current, [key]: next }));
  const chooseCategory = (next: ContractCategory) => setValue((current) => {
    if (next === "Goblin") return { ...current, type: "Comum", categoryKind: "Independente", regalia: "Goblin", goblin: true, courtIds: undefined };
    if (next === "Independent") return { ...current, categoryKind: "Independente", regalia: "Independent", goblin: undefined, courtIds: undefined };
    if (next === "Court") {
      const court = courts[0];
      return { ...current, categoryKind: "Corte", regalia: court?.name ?? "Court", goblin: undefined, courtIds: court ? [court.id] : [] };
    }
    return { ...current, categoryKind: "Regalia", regalia: REGALIA.includes(current.regalia) ? current.regalia : REGALIA[0], goblin: undefined, courtIds: undefined };
  });
  const chooseCourt = (id: string) => {
    const court = courts.find((item) => item.id === id);
    if (court) setValue((current) => ({ ...current, regalia: court.name, courtIds: [court.id] }));
  };
  const setSeemingBenefit = (key: SeemingKey, next: string) => set("seemingBenefits", { ...value.seemingBenefits, [key]: next });
  const commit = () => {
    const normalized = normalizeContractHomebrew(value);
    if (!normalized) {
      setError(h("Preencha os campos obrigatórios, o Efeito de Contratos automáticos ou todos os resultados de Contratos com teste.", "Complete the required fields, the Effect for automatic Contracts, or every outcome for rolled Contracts."));
      return;
    }
    onSave(normalized);
    onOpenChange(false);
  };
  return <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="homebrew-dialog contract-homebrew-editor ctl-dialog">
      <DialogHeader><DialogTitle>{initial ? h("Editar Contrato", "Edit Contract") : h("Criar novo Contrato", "Create New Contract")}</DialogTitle><DialogDescription>{h("Cadastre um Contrato de Corte, Regalia, Independente ou Goblin. Ele será classificado também como Homebrew.", "Create a Court, Regalia, Independent, or Goblin Contract. It will also be classified as Homebrew.")}</DialogDescription></DialogHeader>
      <div className="homebrew-form">
        <Section title={h("Identidade e acesso", "Identity and access")}>
          <Field label={h("Nome *", "Name *")}><Input value={value.name} onChange={(event) => set("name", event.target.value)}/></Field>
          <Field label={h("Categoria *", "Category *")}><Select value={category} onValueChange={(next) => chooseCategory(next as ContractCategory)}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent><SelectItem value="Regalia">Regalia</SelectItem><SelectItem value="Court">{h("Corte", "Court")}</SelectItem><SelectItem value="Independent">{h("Independente", "Independent")}</SelectItem><SelectItem value="Goblin">Goblin</SelectItem></SelectContent></Select></Field>
          {category !== "Goblin" && <Field label={h("Nível *", "Tier *")}><Select value={value.type} onValueChange={(next) => set("type", next)}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent><SelectItem value="Comum">{h("Comum", "Common")}</SelectItem><SelectItem value="Real">{h("Real", "Royal")}</SelectItem></SelectContent></Select></Field>}
          {category === "Regalia" && <Field label="Regalia *"><Select value={value.regalia} onValueChange={(next) => set("regalia", next)}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent>{REGALIA.map((item) => <SelectItem key={item} value={item}>{systemTerm(item, locale)}</SelectItem>)}</SelectContent></Select></Field>}
          {category === "Court" && <Field label={h("Corte *", "Court *")}><Select value={value.courtIds?.[0]} onValueChange={chooseCourt}><SelectTrigger><SelectValue placeholder={h("Escolha a Corte", "Choose the Court")}/></SelectTrigger><SelectContent>{courts.map((court) => <SelectItem key={court.id} value={court.id}>{locale === "pt-BR" ? court.translatedName : court.name}</SelectItem>)}</SelectContent></Select></Field>}
          <Field wide label={h("Descrição *", "Description *")}><Textarea value={value.description} onChange={(event) => set("description", event.target.value)}/></Field>
        </Section>
        <Section title={h("Invocação", "Invocation")}>
          <label className="homebrew-inline-check"><input type="checkbox" checked={value.hasRoll === true} onChange={(event) => setValue((current) => ({ ...current, hasRoll: event.target.checked, dicePool: event.target.checked ? (current.dicePool === "None" ? "" : current.dicePool) : "None" }))}/><span>{h("Exige teste", "Requires a roll")}</span></label>
          {value.hasRoll && <Field label={h("Parada de dados *", "Dice pool *")}><Input value={value.dicePool ?? ""} onChange={(event) => set("dicePool", event.target.value)}/></Field>}
          <Field label={h("Custo *", "Cost *")}><Input value={value.cost ?? ""} onChange={(event) => set("cost", event.target.value)} placeholder="● / ○"/></Field>
          <Field label={h("Ação *", "Action *")}><Input value={value.action ?? ""} onChange={(event) => set("action", event.target.value)}/></Field>
          <Field label={h("Duração *", "Duration *")}><Input value={value.duration ?? ""} onChange={(event) => set("duration", event.target.value)}/></Field>
          {!value.hasRoll && <Field wide label={h("Efeito", "Effect")}><Textarea value={value.effect ?? ""} onChange={(event) => set("effect", event.target.value)}/></Field>}
          {value.hasRoll && <><Field wide label={h("Sucesso", "Success")}><Textarea value={value.success ?? ""} onChange={(event) => set("success", event.target.value)}/></Field><Field wide label={h("Sucesso excepcional", "Exceptional success")}><Textarea value={value.exceptionalSuccess ?? ""} onChange={(event) => set("exceptionalSuccess", event.target.value)}/></Field><Field wide label={h("Falha", "Failure")}><Textarea value={value.failure ?? ""} onChange={(event) => set("failure", event.target.value)}/></Field><Field wide label={h("Falha dramática", "Dramatic failure")}><Textarea value={value.dramaticFailure ?? ""} onChange={(event) => set("dramaticFailure", event.target.value)}/></Field></>}
          <Field wide label={h("Brecha *", "Loophole *")}><Textarea value={value.loophole ?? ""} onChange={(event) => set("loophole", event.target.value)}/></Field>
          {category === "Goblin" && <Field wide label={h("Dívida Goblin", "Goblin Debt")}><Textarea value={value.goblinDebt ?? ""} onChange={(event) => set("goblinDebt", event.target.value)}/></Field>}
        </Section>
        <Section title={h("Benefícios de Feição opcionais", "Optional Seeming benefits")}>
          {SEEMINGS.map((seeming) => <Field wide key={seeming} label={seemingDisplayName(seeming, locale)}><Textarea value={value.seemingBenefits?.[seeming] ?? ""} onChange={(event) => setSeemingBenefit(seeming, event.target.value)}/></Field>)}
        </Section>
      </div>
      {error && <p className="homebrew-error" role="alert">{error}</p>}
      <DialogFooter><Button type="button" variant="outline" onClick={() => onOpenChange(false)}>{h("Cancelar", "Cancel")}</Button><Button type="button" onClick={commit}>{h("Salvar Contrato", "Save Contract")}</Button></DialogFooter>
    </DialogContent>
  </Dialog>;
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return <fieldset className="wide homebrew-section"><legend><span>{title}</span></legend><div>{children}</div></fieldset>;
}

function Field({ label, children, wide = false }: { label: string; children: ReactNode; wide?: boolean }) {
  return <label className={wide ? "wide" : ""}><span>{label}</span>{children}</label>;
}
