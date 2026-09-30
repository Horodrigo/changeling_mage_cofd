"use client";

import { useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ATTRIBUTES } from "@/lib/core/character/creation-rules";
import { useLanguage } from "@/lib/i18n";
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
  const { locale, t } = useLanguage();
  const [value, setValue] = useState<VampireBloodlineDefinition>(() => initial ? structuredClone(initial) : emptyBloodline());
  const [error, setError] = useState("");
  const set = (key: keyof VampireBloodlineDefinition, next: unknown) => setValue((current) => ({ ...current, [key]: next }));
  const commit = () => {
    const normalized = normalizeBloodlineHomebrew(value);
    if (!normalized) { setError(t("ui.bloodlineHomebrewRequiredFields")); return; }
    onSave(normalized); onOpenChange(false);
  };
  const attributes = Object.values(ATTRIBUTES).flat();
  return <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="homebrew-dialog bloodline-homebrew-editor vtr-dialog">
      <DialogHeader><DialogTitle>{initial ? t("ui.editHomebrewBloodline") : t("ui.createHomebrewBloodline")}</DialogTitle><DialogDescription>{t("ui.homebrewBloodlineDescription")}</DialogDescription></DialogHeader>
      <div className="homebrew-form">
        <Section title={t("ui.identityAndLineage")}>
          <Field label={t("ui.requiredBloodlineName")}><Input value={value.name} onChange={(event) => set("name", event.target.value)} /></Field>
          <Field label={t("ui.requiredParentClan")}><Select value={value.parentClan || undefined} onValueChange={(next) => setValue((current) => ({ ...current, parentClan: next, parentClanIds: clans.filter((clan) => clan.name === next).map((clan) => clan.id) }))}><SelectTrigger><SelectValue placeholder={t("ui.chooseClan")} /></SelectTrigger><SelectContent>{clans.map((clan) => <SelectItem key={clan.id} value={clan.name}>{locale === "pt-BR" ? clan.translatedName : clan.name}</SelectItem>)}</SelectContent></Select></Field>
          <Field wide label={t("ui.nicknamesOnePerLine")}><Textarea value={value.nicknames.join("\n")} onChange={(event) => set("nicknames", event.target.value.split("\n"))} /></Field>
          <Field wide label={t("ui.joiningRequirementsOrTradition")}><Textarea value={value.requirements ?? ""} onChange={(event) => set("requirements", event.target.value)} /></Field>
          <Field wide label={t("ui.requiredOverview")}><Textarea value={value.summary} onChange={(event) => set("summary", event.target.value)} /></Field>
        </Section>
        <Section title={t("ui.bloodlineAdvantages")}>
          {[0, 1].map((index) => <Field key={`attribute-${index}`} label={`${t("ui.favoredAttribute")} ${index + 1} *`}><Select value={value.favoredAttributes[index] || undefined} onValueChange={(next) => set("favoredAttributes", value.favoredAttributes.map((item, itemIndex) => itemIndex === index ? next : item))}><SelectTrigger><SelectValue placeholder={t("ui.choose")} /></SelectTrigger><SelectContent>{attributes.map((attribute) => <SelectItem key={attribute} value={attribute}>{systemTerm(attribute, locale)}</SelectItem>)}</SelectContent></Select></Field>)}
          {[0, 1, 2, 3].map((index) => <Field key={`discipline-${index}`} label={`${t("ui.inClanDiscipline")} ${index + 1} *`}><Input list="vampire-bloodline-disciplines" value={value.disciplines[index]} onChange={(event) => set("disciplines", value.disciplines.map((item, itemIndex) => itemIndex === index ? event.target.value : item))} /></Field>)}
          <datalist id="vampire-bloodline-disciplines">{VAMPIRE_DISCIPLINES.map((name) => <option key={name} value={name} />)}</datalist>
          <Field wide label={t("ui.optionalExclusiveDiscipline")}><Select value={value.exclusiveDiscipline || "none"} onValueChange={(next) => set("exclusiveDiscipline", next === "none" ? undefined : next)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="none">{t("ui.none247448")}</SelectItem>{value.disciplines.filter(Boolean).map((name) => <SelectItem key={name} value={name}>{name}</SelectItem>)}</SelectContent></Select></Field>
          <p>{t("ui.newDisciplineRequiresCatalogPowers")}</p>
        </Section>
        <Section title={t("ui.additionalBane")}>
          <Field label={t("ui.requiredBaneName")}><Input value={value.baneName} onChange={(event) => set("baneName", event.target.value)} /></Field>
          <Field wide label={t("ui.requiredBaneRules")}><Textarea value={value.baneSummary} onChange={(event) => set("baneSummary", event.target.value)} /></Field>
        </Section>
      </div>
      {error && <p className="homebrew-error" role="alert">{error}</p>}
      <DialogFooter><Button type="button" variant="outline" onClick={() => onOpenChange(false)}>{t("common.cancel")}</Button><Button type="button" onClick={commit}>{t("ui.saveHomebrewBloodline")}</Button></DialogFooter>
    </DialogContent>
  </Dialog>;
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return <fieldset className="wide homebrew-section"><legend><span>{title}</span></legend><div>{children}</div></fieldset>;
}

function Field({ label, children, wide = false }: { label: string; children: ReactNode; wide?: boolean }) {
  return <label className={wide ? "wide" : ""}><span>{label}</span>{children}</label>;
}
