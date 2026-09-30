"use client";

import { useState, type ReactNode } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { EntitlementBlessing, EntitlementDefinition, EntitlementRole } from "@/lib/entitlements";
import { useLanguage } from "@/lib/i18n";
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
  const { t } = useLanguage();
  const [value, setValue] = useState<EntitlementDefinition>(() => initial ? structuredClone(initial) : emptyEntitlement());
  const [error, setError] = useState("");
  const set = (key: keyof EntitlementDefinition, next: unknown) => setValue((current) => ({ ...current, [key]: next }));
  const commit = () => {
    const normalized = normalizeEntitlementHomebrew(value);
    if (!normalized || !normalized.purpose || !normalized.privileges || !normalized.duties || !normalized.touchstone || !normalized.curse || !normalized.beat || !normalized.token.name || !normalized.token.effect) {
      setError(t("ui.entitlementHomebrewRequiredFields"));
      return;
    }
    onSave(normalized);
    onOpenChange(false);
  };
  const updateBlessing = (index: number, patch: Partial<EntitlementBlessing>) => set("blessings", value.blessings.map((item, itemIndex) => itemIndex === index ? { ...item, ...patch } : item));
  const updateRole = (index: number, patch: Partial<EntitlementRole>) => set("roles", (value.roles ?? []).map((item, itemIndex) => itemIndex === index ? { ...item, ...patch } : item));
  return <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="homebrew-dialog entitlement-homebrew-editor ctl-dialog">
      <DialogHeader><DialogTitle>{initial ? t("ui.editHomebrewEntitlement") : t("ui.createHomebrewEntitlement")}</DialogTitle><DialogDescription>{t("ui.homebrewEntitlementDescription")}</DialogDescription></DialogHeader>
      <div className="homebrew-form">
        <Section title={t("ui.identityAndRole")}>
          <Field label={t("ui.requiredEntitlementName")}><Input value={value.name} onChange={(event) => set("name", event.target.value)}/></Field>
          <Field label={t("ui.requiredMeritName")}><Input value={value.meritName} onChange={(event) => set("meritName", event.target.value)}/></Field>
          <Field wide label={t("ui.prerequisites")}><Textarea value={value.prerequisites} onChange={(event) => set("prerequisites", event.target.value)}/></Field>
          <Field wide label={`${t("ui.purpose")} *`}><Textarea value={value.purpose} onChange={(event) => set("purpose", event.target.value)}/></Field>
          <Field wide label={`${t("ui.privileges")} *`}><Textarea value={value.privileges} onChange={(event) => set("privileges", event.target.value)}/></Field>
          <Field wide label={`${t("ui.duties")} *`}><Textarea value={value.duties} onChange={(event) => set("duties", event.target.value)}/></Field>
          <Field wide label={t("ui.maskAndMien")}><Textarea value={value.maskAndMien} onChange={(event) => set("maskAndMien", event.target.value)}/></Field>
        </Section>
        <Section title={t("ui.touchstoneAndConsequences")}>
          <Field wide label={t("ui.requiredEntitlementTouchstone")}><Textarea value={value.touchstone} onChange={(event) => set("touchstone", event.target.value)}/></Field>
          <Field wide label={`${t("ui.curse")} *`}><Textarea value={value.curse} onChange={(event) => set("curse", event.target.value)}/></Field>
          <Field wide label={t("ui.requiredBeatTrigger")}><Textarea value={value.beat} onChange={(event) => set("beat", event.target.value)}/></Field>
          <Field wide label={t("ui.legendsOnePerLine")}><Textarea value={value.legends.join("\n")} onChange={(event) => set("legends", event.target.value.split("\n"))}/></Field>
        </Section>
        <Section title={t("ui.heraldryAndToken")}>
          <Field wide label={t("ui.heraldry")}><Textarea value={value.heraldry} onChange={(event) => set("heraldry", event.target.value)}/></Field>
          <Field label={t("ui.requiredTokenName")}><Input value={value.token.name} onChange={(event) => set("token", { ...value.token, name: event.target.value })}/></Field>
          <Field wide label={t("ui.tokenDescription")}><Textarea value={value.token.description} onChange={(event) => set("token", { ...value.token, description: event.target.value })}/></Field>
          <Field wide label={`${t("ui.effect")} *`}><Textarea value={value.token.effect} onChange={(event) => set("token", { ...value.token, effect: event.target.value })}/></Field>
          <Field wide label={t("ui.catch")}><Textarea value={value.token.catch} onChange={(event) => set("token", { ...value.token, catch: event.target.value })}/></Field>
          <Field wide label={t("ui.drawback")}><Textarea value={value.token.drawback} onChange={(event) => set("token", { ...value.token, drawback: event.target.value })}/></Field>
        </Section>
        <Section title={`${t("ui.blessings")} *`} action={<Button type="button" size="sm" variant="outline" onClick={() => set("blessings", [...value.blessings, emptyBlessing()])}><Plus/> {t("ui.addBlessing")}</Button>}>
          {value.blessings.map((item, index) => <div className="homebrew-repeat" key={item.id}>
            <Field label={t("ui.requiredName")}><Input value={item.name} onChange={(event) => updateBlessing(index, { name: event.target.value })}/></Field>
            <Field wide label={t("ui.requiredDescription")}><Textarea value={item.description} onChange={(event) => updateBlessing(index, { description: event.target.value })}/></Field>
            <Field label={t("ui.requiredChoice")}><Input value={item.choiceLabel ?? ""} onChange={(event) => updateBlessing(index, { choiceLabel: event.target.value })}/></Field>
            <label className="homebrew-inline-check"><input type="checkbox" checked={item.conditional === true} onChange={(event) => updateBlessing(index, { conditional: event.target.checked })}/><span>{t("ui.conditionalBenefit")}</span></label>
            {value.blessings.length > 1 && <Button type="button" size="sm" variant="ghost" onClick={() => set("blessings", value.blessings.filter((_, itemIndex) => itemIndex !== index))}><Trash2/> {t("common.remove")}</Button>}
          </div>)}
        </Section>
        <Section title={t("ui.optionalRoles")} action={<Button type="button" size="sm" variant="outline" onClick={() => set("roles", [...(value.roles ?? []), emptyRole()])}><Plus/> {t("ui.addRole")}</Button>}>
          {(value.roles ?? []).length === 0 && <p>{t("ui.entitlementRolesDescription")}</p>}
          {(value.roles ?? []).map((item, index) => <div className="homebrew-repeat" key={item.id}>
            <Field label={t("ui.name")}><Input value={item.name} onChange={(event) => updateRole(index, { name: event.target.value })}/></Field>
            <Field label={t("ui.prerequisites")}><Input value={item.prerequisites} onChange={(event) => updateRole(index, { prerequisites: event.target.value })}/></Field>
            <Field wide label={t("ui.privilege")}><Textarea value={item.privilege} onChange={(event) => updateRole(index, { privilege: event.target.value })}/></Field>
            <Field wide label={t("ui.duties")}><Textarea value={item.duties} onChange={(event) => updateRole(index, { duties: event.target.value })}/></Field>
            <Field label={t("ui.heraldryColor")}><Input value={item.heraldryColor ?? ""} onChange={(event) => updateRole(index, { heraldryColor: event.target.value })}/></Field>
            <Field wide label={t("ui.tokenBonus")}><Textarea value={item.tokenBonus} onChange={(event) => updateRole(index, { tokenBonus: event.target.value })}/></Field>
            <Field wide label={t("ui.tokenDrawback")}><Textarea value={item.tokenDrawback} onChange={(event) => updateRole(index, { tokenDrawback: event.target.value })}/></Field>
            <Button type="button" size="sm" variant="ghost" onClick={() => set("roles", (value.roles ?? []).filter((_, itemIndex) => itemIndex !== index))}><Trash2/> {t("common.remove")}</Button>
          </div>)}
        </Section>
      </div>
      {error && <p className="homebrew-error" role="alert">{error}</p>}
      <DialogFooter><Button type="button" variant="outline" onClick={() => onOpenChange(false)}>{t("common.cancel")}</Button><Button type="button" onClick={commit}>{t("ui.saveHomebrewEntitlement")}</Button></DialogFooter>
    </DialogContent>
  </Dialog>;
}

function Section({ title, action, children }: { title: string; action?: ReactNode; children: ReactNode }) {
  return <fieldset className="wide homebrew-section"><legend><span>{title}</span>{action}</legend><div>{children}</div></fieldset>;
}

function Field({ label, children, wide = false }: { label: string; children: ReactNode; wide?: boolean }) {
  return <label className={wide ? "wide" : ""}><span>{label}</span>{children}</label>;
}
