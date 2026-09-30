"use client";

import { useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useLanguage } from "@/lib/i18n";
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
  const { locale, t } = useLanguage();
  const [value, setValue] = useState<LegacyDefinition>(() => initial ? structuredClone(initial) : emptyLegacy(founderCharacterId, defaultPath, defaultOrder));
  const [error, setError] = useState("");
  const set = (key: keyof LegacyDefinition, next: unknown) => setValue((current) => ({ ...current, [key]: next }));
  const setAttainment = (index: number, key: "name" | "description" | "optional" | "praxisName", next: string) => setValue((current) => ({ ...current, attainments: current.attainments.map((item, itemIndex) => itemIndex === index ? { ...item, [key]: next } : item) }));
  const commit = () => {
    const normalized = normalizeLegacyHomebrew(value);
    if (!normalized) { setError(t("ui.legacyHomebrewRequiredFields")); return; }
    onSave(normalized); onOpenChange(false);
  };
  return <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="homebrew-dialog mage-legacy-homebrew-editor mage-legacy-join-dialog">
      <DialogHeader><DialogTitle>{initial ? t("ui.editHomebrewLegacy") : t("ui.createHomebrewLegacy")}</DialogTitle><DialogDescription>{t("ui.homebrewLegacyDescription")}</DialogDescription></DialogHeader>
      <div className="homebrew-form">
        <Section title={t("ui.identityAndLineage")}>
          <Field label={t("ui.requiredLegacyName")}><Input value={value.name} onChange={(event) => set("name", event.target.value)} /></Field>
          <Field label={t("ui.requiredRulingArcanum")}><Select value={value.rulingArcanum || undefined} onValueChange={(next) => set("rulingArcanum", next)}><SelectTrigger><SelectValue placeholder={t("ui.chooseArcanum")} /></SelectTrigger><SelectContent>{ARCANA.map((name) => <SelectItem key={name} value={name}>{systemTerm(name, locale)}</SelectItem>)}</SelectContent></Select></Field>
          <Field label={t("ui.requiredOriginatingPath")}><Select value={value.parentage.paths[0]} onValueChange={(next) => set("parentage", { ...value.parentage, paths: [next] })}><SelectTrigger><SelectValue placeholder={t("ui.choosePath")} /></SelectTrigger><SelectContent>{Object.keys(MTA_PATHS).map((name) => <SelectItem key={name} value={name}>{name}</SelectItem>)}</SelectContent></Select></Field>
          <Field label={t("ui.associatedOrder")}><Select value={value.parentage.orders[0] || "none"} onValueChange={(next) => set("parentage", { ...value.parentage, orders: next === "none" ? [] : [next] })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="none">{t("ui.none247448")}</SelectItem>{Object.keys(MTA_ORDERS).map((name) => <SelectItem key={name} value={name}>{name}</SelectItem>)}</SelectContent></Select></Field>
          <Field wide label={t("ui.additionalPrerequisites")}><Textarea value={value.additionalPrerequisites ?? ""} onChange={(event) => set("additionalPrerequisites", event.target.value)} /></Field>
        </Section>
        <Section title={t("ui.doctrine")}>
          <Field wide label={t("ui.requiredInitiationAndIndoctrination")}><Textarea value={value.initiation} onChange={(event) => set("initiation", event.target.value)} /></Field>
          <Field wide label={`${t("ui.organization")} *`}><Textarea value={value.organization} onChange={(event) => set("organization", event.target.value)} /></Field>
          <Field wide label={t("ui.requiredTheoryAndMystery")}><Textarea value={value.theory} onChange={(event) => set("theory", event.target.value)} /></Field>
          <Field wide label={t("ui.requiredYantrasOnePerLine")}><Textarea value={value.yantras.join("\n")} onChange={(event) => set("yantras", event.target.value.split("\n"))} /></Field>
          <Field wide label={t("ui.requiredOblationsOnePerLine")}><Textarea value={value.oblations.join("\n")} onChange={(event) => set("oblations", event.target.value.split("\n"))} /></Field>
        </Section>
        {value.attainments.map((attainment, index) => {
          const minimum = LEGACY_ATTAINMENT_MINIMUMS[index];
          return <Section key={attainment.rank} title={`${t("ui.attainment")} ${attainment.rank}`}>
            <p>{t("ui.legacyFixedMinimums", { arcanum: value.rulingArcanum || t("ui.rulingArcanum"), rank: attainment.rank, orthodox: minimum.orthodoxGnosis, novel: minimum.novelGnosis })}</p>
            <Field label={t("ui.requiredName")}><Input value={attainment.name} onChange={(event) => setAttainment(index, "name", event.target.value)} /></Field>
            <Field label={t("ui.equivalentPraxis")}><Input value={attainment.praxisName ?? ""} onChange={(event) => setAttainment(index, "praxisName", event.target.value)} /></Field>
            <Field wide label={`${t("ui.effect")} *`}><Textarea value={attainment.description} onChange={(event) => setAttainment(index, "description", event.target.value)} /></Field>
            <Field wide label={t("ui.optionalEffect")}><Textarea value={attainment.optional ?? ""} onChange={(event) => setAttainment(index, "optional", event.target.value)} /></Field>
          </Section>;
        })}
      </div>
      {error && <p className="homebrew-error" role="alert">{error}</p>}
      <DialogFooter><Button type="button" variant="outline" onClick={() => onOpenChange(false)}>{t("common.cancel")}</Button><Button type="button" onClick={commit}>{t("ui.saveHomebrewLegacy")}</Button></DialogFooter>
    </DialogContent>
  </Dialog>;
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return <fieldset className="wide homebrew-section"><legend><span>{title}</span></legend><div>{children}</div></fieldset>;
}

function Field({ label, children, wide = false }: { label: string; children: ReactNode; wide?: boolean }) {
  return <label className={wide ? "wide" : ""}><span>{label}</span>{children}</label>;
}
