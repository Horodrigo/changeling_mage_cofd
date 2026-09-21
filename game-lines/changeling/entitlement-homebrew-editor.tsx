"use client";

import { useState, type ReactNode } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { EntitlementBlessing, EntitlementDefinition, EntitlementRole } from "@/lib/entitlements";
import { localized, useLanguage } from "@/lib/i18n";
import { ENTITLEMENT_HOMEBREW_SOURCE, ENTITLEMENT_HOMEBREW_SOURCE_ID, entitlementHomebrewId, normalizeEntitlementHomebrew } from "./entitlement-homebrews";

const emptyBlessing = (): EntitlementBlessing => ({ id: crypto.randomUUID(), name: "", description: "" });
const emptyRole = (): EntitlementRole => ({ id: crypto.randomUUID(), name: "", prerequisites: "", privilege: "", duties: "", tokenBonus: "", tokenDrawback: "" });
const emptyEntitlement = (): EntitlementDefinition => ({
  id: entitlementHomebrewId(), name: "", meritName: "", source: ENTITLEMENT_HOMEBREW_SOURCE, sourceCode: "Homebrew", sourceId: ENTITLEMENT_HOMEBREW_SOURCE_ID, page: 0, homebrew: true,
  prerequisites: "", purpose: "", privileges: "", duties: "", maskAndMien: "", heraldry: "",
  token: { name: "", description: "", effect: "", catch: "", drawback: "" }, blessings: [emptyBlessing()],
  touchstone: "", curse: "", beat: "", legends: [],
});

export function EntitlementHomebrewEditor({ open, onOpenChange, initial, onSave }: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initial?: EntitlementDefinition | null;
  onSave: (definition: EntitlementDefinition) => void;
}) {
  const { locale } = useLanguage(), h = (pt: string, en: string) => localized(locale, pt, en);
  const [value, setValue] = useState<EntitlementDefinition>(() => initial ? structuredClone(initial) : emptyEntitlement());
  const [error, setError] = useState("");
  const set = (key: keyof EntitlementDefinition, next: unknown) => setValue((current) => ({ ...current, [key]: next }));
  const commit = () => {
    const normalized = normalizeEntitlementHomebrew(value);
    if (!normalized || !normalized.purpose || !normalized.privileges || !normalized.duties || !normalized.touchstone || !normalized.curse || !normalized.beat || !normalized.token.name || !normalized.token.effect) {
      setError(h("Preencha os campos obrigatórios e ao menos uma Bênção completa.", "Complete the required fields and at least one complete Blessing."));
      return;
    }
    onSave(normalized);
    onOpenChange(false);
  };
  const updateBlessing = (index: number, patch: Partial<EntitlementBlessing>) => set("blessings", value.blessings.map((item, itemIndex) => itemIndex === index ? { ...item, ...patch } : item));
  const updateRole = (index: number, patch: Partial<EntitlementRole>) => set("roles", (value.roles ?? []).map((item, itemIndex) => itemIndex === index ? { ...item, ...patch } : item));
  return <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="homebrew-dialog entitlement-homebrew-editor">
      <DialogHeader><DialogTitle>{initial ? h("Editar Entitlement", "Edit Entitlement") : h("Criar novo Entitlement", "Create New Entitlement")}</DialogTitle><DialogDescription>{h("Estruture o Título, sua Heraldry e os benefícios que podem ser adquiridos com seus níveis.", "Define the Title, its Heraldry, and the benefits acquired through its ranks.")}</DialogDescription></DialogHeader>
      <div className="homebrew-form">
        <Section title={h("Identidade e função", "Identity and role")}>
          <Field label={h("Nome do Entitlement *", "Entitlement name *")}><Input value={value.name} onChange={(event) => set("name", event.target.value)}/></Field>
          <Field label={h("Nome do Mérito *", "Merit name *")}><Input value={value.meritName} onChange={(event) => set("meritName", event.target.value)}/></Field>
          <Field wide label={h("Pré-requisitos", "Prerequisites")}><Textarea value={value.prerequisites} onChange={(event) => set("prerequisites", event.target.value)}/></Field>
          <Field wide label={h("Propósito *", "Purpose *")}><Textarea value={value.purpose} onChange={(event) => set("purpose", event.target.value)}/></Field>
          <Field wide label={h("Privilégios *", "Privileges *")}><Textarea value={value.privileges} onChange={(event) => set("privileges", event.target.value)}/></Field>
          <Field wide label={h("Deveres *", "Duties *")}><Textarea value={value.duties} onChange={(event) => set("duties", event.target.value)}/></Field>
          <Field wide label={h("Mask e Mien", "Mask and Mien")}><Textarea value={value.maskAndMien} onChange={(event) => set("maskAndMien", event.target.value)}/></Field>
        </Section>
        <Section title={h("Touchstone e consequências", "Touchstone and consequences")}>
          <Field wide label={h("Touchstone do Entitlement *", "Entitlement Touchstone *")}><Textarea value={value.touchstone} onChange={(event) => set("touchstone", event.target.value)}/></Field>
          <Field wide label={h("Maldição *", "Curse *")}><Textarea value={value.curse} onChange={(event) => set("curse", event.target.value)}/></Field>
          <Field wide label={h("Gatilho de Beat *", "Beat trigger *")}><Textarea value={value.beat} onChange={(event) => set("beat", event.target.value)}/></Field>
          <Field wide label={h("Lendas (uma por linha)", "Legends (one per line)")}><Textarea value={value.legends.join("\n")} onChange={(event) => set("legends", event.target.value.split("\n"))}/></Field>
        </Section>
        <Section title={h("Heraldry e Token", "Heraldry and Token")}>
          <Field wide label={h("Heraldry", "Heraldry")}><Textarea value={value.heraldry} onChange={(event) => set("heraldry", event.target.value)}/></Field>
          <Field label={h("Nome do Token *", "Token name *")}><Input value={value.token.name} onChange={(event) => set("token", { ...value.token, name: event.target.value })}/></Field>
          <Field wide label={h("Descrição do Token", "Token description")}><Textarea value={value.token.description} onChange={(event) => set("token", { ...value.token, description: event.target.value })}/></Field>
          <Field wide label={h("Efeito *", "Effect *")}><Textarea value={value.token.effect} onChange={(event) => set("token", { ...value.token, effect: event.target.value })}/></Field>
          <Field wide label={h("Catch", "Catch")}><Textarea value={value.token.catch} onChange={(event) => set("token", { ...value.token, catch: event.target.value })}/></Field>
          <Field wide label={h("Desvantagem", "Drawback")}><Textarea value={value.token.drawback} onChange={(event) => set("token", { ...value.token, drawback: event.target.value })}/></Field>
        </Section>
        <Section title={h("Bênçãos *", "Blessings *")} action={<Button type="button" size="sm" variant="outline" onClick={() => set("blessings", [...value.blessings, emptyBlessing()])}><Plus/> {h("Adicionar Bênção", "Add Blessing")}</Button>}>
          {value.blessings.map((item, index) => <div className="homebrew-repeat" key={item.id}>
            <Field label={h("Nome *", "Name *")}><Input value={item.name} onChange={(event) => updateBlessing(index, { name: event.target.value })}/></Field>
            <Field wide label={h("Descrição *", "Description *")}><Textarea value={item.description} onChange={(event) => updateBlessing(index, { description: event.target.value })}/></Field>
            <Field label={h("Escolha exigida", "Required choice")}><Input value={item.choiceLabel ?? ""} onChange={(event) => updateBlessing(index, { choiceLabel: event.target.value })}/></Field>
            <label className="homebrew-inline-check"><input type="checkbox" checked={item.conditional === true} onChange={(event) => updateBlessing(index, { conditional: event.target.checked })}/><span>{h("Benefício condicional", "Conditional benefit")}</span></label>
            {value.blessings.length > 1 && <Button type="button" size="sm" variant="ghost" onClick={() => set("blessings", value.blessings.filter((_, itemIndex) => itemIndex !== index))}><Trash2/> {h("Remover", "Remove")}</Button>}
          </div>)}
        </Section>
        <Section title={h("Papéis opcionais", "Optional roles")} action={<Button type="button" size="sm" variant="outline" onClick={() => set("roles", [...(value.roles ?? []), emptyRole()])}><Plus/> {h("Adicionar papel", "Add role")}</Button>}>
          {(value.roles ?? []).length === 0 && <p>{h("Use papéis quando membros do mesmo Entitlement tiverem requisitos, privilégios ou deveres diferentes.", "Use roles when members of the same Entitlement have different prerequisites, privileges, or duties.")}</p>}
          {(value.roles ?? []).map((item, index) => <div className="homebrew-repeat" key={item.id}>
            <Field label={h("Nome", "Name")}><Input value={item.name} onChange={(event) => updateRole(index, { name: event.target.value })}/></Field>
            <Field label={h("Pré-requisitos", "Prerequisites")}><Input value={item.prerequisites} onChange={(event) => updateRole(index, { prerequisites: event.target.value })}/></Field>
            <Field wide label={h("Privilégio", "Privilege")}><Textarea value={item.privilege} onChange={(event) => updateRole(index, { privilege: event.target.value })}/></Field>
            <Field wide label={h("Deveres", "Duties")}><Textarea value={item.duties} onChange={(event) => updateRole(index, { duties: event.target.value })}/></Field>
            <Field label={h("Cor heráldica", "Heraldry color")}><Input value={item.heraldryColor ?? ""} onChange={(event) => updateRole(index, { heraldryColor: event.target.value })}/></Field>
            <Field wide label={h("Bônus do Token", "Token bonus")}><Textarea value={item.tokenBonus} onChange={(event) => updateRole(index, { tokenBonus: event.target.value })}/></Field>
            <Field wide label={h("Desvantagem do Token", "Token drawback")}><Textarea value={item.tokenDrawback} onChange={(event) => updateRole(index, { tokenDrawback: event.target.value })}/></Field>
            <Button type="button" size="sm" variant="ghost" onClick={() => set("roles", (value.roles ?? []).filter((_, itemIndex) => itemIndex !== index))}><Trash2/> {h("Remover", "Remove")}</Button>
          </div>)}
        </Section>
      </div>
      {error && <p className="homebrew-error" role="alert">{error}</p>}
      <DialogFooter><Button type="button" variant="outline" onClick={() => onOpenChange(false)}>{h("Cancelar", "Cancel")}</Button><Button type="button" onClick={commit}>{h("Salvar Entitlement", "Save Entitlement")}</Button></DialogFooter>
    </DialogContent>
  </Dialog>;
}

function Section({ title, action, children }: { title: string; action?: ReactNode; children: ReactNode }) {
  return <fieldset className="wide homebrew-section"><legend><span>{title}</span>{action}</legend><div>{children}</div></fieldset>;
}

function Field({ label, children, wide = false }: { label: string; children: ReactNode; wide?: boolean }) {
  return <label className={wide ? "wide" : ""}><span>{label}</span>{children}</label>;
}
