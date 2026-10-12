"use client";

import { useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useLanguage } from "@/lib/i18n";
import { systemTerm } from "@/lib/system-terms";
import { REGALIA } from "./creation-rules";
import { CHANGELING_CATALOG_HOMEBREW_SOURCE, CHANGELING_CATALOG_HOMEBREW_SOURCE_ID, changelingCatalogHomebrewId, normalizeChangelingCatalogHomebrew, type ChangelingCatalogHomebrew } from "./catalog-homebrews";
import { useChangelingCatalogHomebrews } from "./use-catalog-homebrews";

export function emptyChangelingCatalogHomebrew(entryType: ChangelingCatalogHomebrew["entryType"]): ChangelingCatalogHomebrew {
  const common = { id: changelingCatalogHomebrewId(entryType), name: "", sourceId: CHANGELING_CATALOG_HOMEBREW_SOURCE_ID, source: CHANGELING_CATALOG_HOMEBREW_SOURCE, page: 0, homebrew: true as const };
  if (entryType === "regalia") return { ...common, entryType, translatedName: "" };
  if (entryType === "seeming") return { ...common, entryType, translated: "", favored: "Power", regalia: "Crown", blessing: "", curse: "", blessingEn: "", curseEn: "" };
  if (entryType === "kith") return { ...common, entryType, translatedName: "", skill: "", description: "", blessing: "" };
  return { ...common, entryType: "court", translatedName: "", emotion: "", emotionPt: "", mantleBenefits: Array(5).fill(""), mantleBenefitsPt: Array(5).fill("") };
}

function Field({ label, children, wide = false }: { label: string; children: ReactNode; wide?: boolean }) {
  return <label className={wide ? "wide" : ""}><span>{label}</span>{children}</label>;
}

export function ChangelingCatalogHomebrewEditor({ initial, onOpenChange, onSave }: { initial: ChangelingCatalogHomebrew; onOpenChange: (open: boolean) => void; onSave: (item: ChangelingCatalogHomebrew) => void }) {
  const { locale, t } = useLanguage();
  const catalog = useChangelingCatalogHomebrews();
  const [value, setValue] = useState<Record<string, unknown>>(() => structuredClone(initial) as unknown as Record<string, unknown>);
  const [error, setError] = useState("");
  const set = (key: string, next: unknown) => setValue((current) => ({ ...current, [key]: next }));
  const type = value.entryType;
  const regalia = [...REGALIA, ...catalog.filter((item) => item.entryType === "regalia").map((item) => item.name)];
  const benefits = Array.isArray(value.mantleBenefits) ? value.mantleBenefits as string[] : [];
  const commit = () => {
    const authored = type === "seeming" ? { ...value, translated: value.name, blessingEn: value.blessing, curseEn: value.curse }
      : type === "court" ? { ...value, translatedName: value.name, emotionPt: value.emotion, glamourTriggerPt: value.glamourTrigger, mantleBenefitsPt: value.mantleBenefits }
      : type === "kith" ? { ...value, translatedName: value.name } : value;
    const normalized = normalizeChangelingCatalogHomebrew(authored);
    if (!normalized) return setError(t("ui.completeAllRequiredFields"));
    onSave(normalized);
    onOpenChange(false);
  };
  return <Dialog open onOpenChange={onOpenChange}><DialogContent className="homebrew-dialog ctl-dialog">
    <DialogHeader><DialogTitle>{t("ui.changelingHomebrewContent")}</DialogTitle><DialogDescription>{t("ui.changelingHomebrewContentDescription")}</DialogDescription></DialogHeader>
    <div className="homebrew-form">
      <Field label={t("ui.requiredName")}><Input value={String(value.name ?? "")} onChange={(event) => set("name", event.target.value)}/></Field>
      {type === "regalia" && <Field label={t("ui.optionalRegaliaTranslation")}><Input value={String(value.translatedName ?? "")} onChange={(event) => set("translatedName", event.target.value)}/></Field>}
      {type === "seeming" && <>
        <Field label={t("ui.favoredCategory")}><select value={String(value.favored)} onChange={(event) => set("favored", event.target.value)}>{["Power", "Finesse", "Resistance"].map((item) => <option key={item} value={item}>{systemTerm(item, locale)}</option>)}</select></Field>
        <Field label={t("ui.regalia")}><select value={String(value.regalia)} onChange={(event) => set("regalia", event.target.value)}>{regalia.map((item) => <option key={item} value={item}>{systemTerm(item, locale)}</option>)}</select></Field>
        <Field wide label={t("ui.requiredBlessing")}><Textarea value={String(value.blessing ?? "")} onChange={(event) => set("blessing", event.target.value)}/></Field>
        <Field wide label={t("ui.curse")}><Textarea value={String(value.curse ?? "")} onChange={(event) => set("curse", event.target.value)}/></Field>
      </>}
      {type === "kith" && <>
        <Field label={t("ui.requiredSkill")}><Input value={String(value.skill ?? "")} onChange={(event) => set("skill", event.target.value)}/></Field>
        <Field wide label={t("ui.requiredDescription")}><Textarea value={String(value.description ?? "")} onChange={(event) => set("description", event.target.value)}/></Field>
        <Field wide label={t("ui.requiredBlessing")}><Textarea value={String(value.blessing ?? "")} onChange={(event) => set("blessing", event.target.value)}/></Field>
      </>}
      {type === "court" && <>
        <Field label={t("ui.emotion")}><Input value={String(value.emotion ?? "")} onChange={(event) => set("emotion", event.target.value)}/></Field>
        <Field wide label={t("ui.glamourTrigger")}><Textarea value={String(value.glamourTrigger ?? "")} onChange={(event) => set("glamourTrigger", event.target.value)}/></Field>
        {Array.from({ length: 5 }, (_, index) => <Field wide key={index} label={`${t("ui.mantle")} ${index + 1} *`}><Textarea rows={2} value={benefits[index] ?? ""} onChange={(event) => set("mantleBenefits", Array.from({ length: 5 }, (_, dot) => dot === index ? event.target.value : benefits[dot] ?? ""))}/></Field>)}
      </>}
    </div>
    {error && <p className="homebrew-error" role="alert">{error}</p>}
    <DialogFooter><Button type="button" variant="outline" onClick={() => onOpenChange(false)}>{t("common.cancel")}</Button><Button type="button" onClick={commit}>{t("common.save")}</Button></DialogFooter>
  </DialogContent></Dialog>;
}
