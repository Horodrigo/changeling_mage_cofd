"use client";

import { useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { localized, useLanguage } from "@/lib/i18n";
import { REGALIA } from "./creation-rules";
import { CHANGELING_CATALOG_HOMEBREW_SOURCE, CHANGELING_CATALOG_HOMEBREW_SOURCE_ID, changelingCatalogHomebrewId, normalizeChangelingCatalogHomebrew, type ChangelingCatalogHomebrew } from "./catalog-homebrews";

export function emptyChangelingCatalogHomebrew(entryType: ChangelingCatalogHomebrew["entryType"]): ChangelingCatalogHomebrew {
  const common = { id: changelingCatalogHomebrewId(entryType), name: "", sourceId: CHANGELING_CATALOG_HOMEBREW_SOURCE_ID, source: CHANGELING_CATALOG_HOMEBREW_SOURCE, page: 0, homebrew: true as const };
  if (entryType === "seeming") return { ...common, entryType, translated: "", favored: "Power", regalia: "Crown", blessing: "", curse: "", blessingEn: "", curseEn: "" };
  if (entryType === "kith") return { ...common, entryType, translatedName: "", skill: "", description: "", blessing: "" };
  return { ...common, entryType: "court", translatedName: "", emotion: "", emotionPt: "", mantleBenefits: Array(5).fill(""), mantleBenefitsPt: Array(5).fill("") };
}

function Field({ label, children, wide = false }: { label: string; children: ReactNode; wide?: boolean }) { return <label className={wide ? "wide" : ""}><span>{label}</span>{children}</label>; }

export function ChangelingCatalogHomebrewEditor({ initial, onOpenChange, onSave }: { initial: ChangelingCatalogHomebrew; onOpenChange: (open: boolean) => void; onSave: (item: ChangelingCatalogHomebrew) => void }) {
  const { locale } = useLanguage(), h = (pt: string, en: string) => localized(locale, pt, en);
  const [value, setValue] = useState<Record<string, unknown>>(() => structuredClone(initial) as unknown as Record<string, unknown>), [error, setError] = useState("");
  const set = (key: string, next: unknown) => setValue((current) => ({ ...current, [key]: next }));
  const lines = (key: string) => Array.isArray(value[key]) ? (value[key] as unknown[]).map(String).join("\n") : "";
  const commit = () => { const normalized = normalizeChangelingCatalogHomebrew(value); if (!normalized) return setError(h("Preencha todos os campos obrigatórios.", "Complete all required fields.")); onSave(normalized); onOpenChange(false); };
  const type = value.entryType;
  return <Dialog open onOpenChange={onOpenChange}><DialogContent className="homebrew-dialog ctl-dialog"><DialogHeader><DialogTitle>{h("Conteúdo de Changeling", "Changeling Content")}</DialogTitle><DialogDescription>{h("Defina os textos em português e inglês usados nas escolhas e na ficha.", "Define the Portuguese and English text used in choices and on the sheet.")}</DialogDescription></DialogHeader><div className="homebrew-form">
    <Field label={h("Nome original *", "Original name *")}><Input value={String(value.name ?? "")} onChange={(event) => set("name", event.target.value)}/></Field><Field label={h("Nome em português *", "Portuguese name *")}><Input value={String(value.translatedName ?? value.translated ?? "")} onChange={(event) => set(type === "seeming" ? "translated" : "translatedName", event.target.value)}/></Field>
    {type === "seeming" && <><Field label={h("Categoria favorecida", "Favored category")}><select value={String(value.favored)} onChange={(event) => set("favored", event.target.value)}>{["Power", "Finesse", "Resistance"].map((item) => <option key={item}>{item}</option>)}</select></Field><Field label={h("Regalia", "Regalia")}><select value={String(value.regalia)} onChange={(event) => set("regalia", event.target.value)}>{REGALIA.map((item) => <option key={item}>{item}</option>)}</select></Field><Field wide label={h("Bênção (português) *", "Blessing (Portuguese) *")}><Textarea value={String(value.blessing ?? "")} onChange={(event) => set("blessing", event.target.value)}/></Field><Field wide label={h("Bênção (inglês) *", "Blessing (English) *")}><Textarea value={String(value.blessingEn ?? "")} onChange={(event) => set("blessingEn", event.target.value)}/></Field><Field wide label={h("Maldição (português) *", "Curse (Portuguese) *")}><Textarea value={String(value.curse ?? "")} onChange={(event) => set("curse", event.target.value)}/></Field><Field wide label={h("Maldição (inglês) *", "Curse (English) *")}><Textarea value={String(value.curseEn ?? "")} onChange={(event) => set("curseEn", event.target.value)}/></Field></>}
    {type === "kith" && <><Field label={h("Perícia *", "Skill *")}><Input value={String(value.skill ?? "")} onChange={(event) => set("skill", event.target.value)}/></Field><Field wide label={h("Descrição *", "Description *")}><Textarea value={String(value.description ?? "")} onChange={(event) => set("description", event.target.value)}/></Field><Field wide label={h("Bênção *", "Blessing *")}><Textarea value={String(value.blessing ?? "")} onChange={(event) => set("blessing", event.target.value)}/></Field></>}
    {type === "court" && <><Field label={h("Emoção (inglês) *", "Emotion (English) *")}><Input value={String(value.emotion ?? "")} onChange={(event) => set("emotion", event.target.value)}/></Field><Field label={h("Emoção (português) *", "Emotion (Portuguese) *")}><Input value={String(value.emotionPt ?? "")} onChange={(event) => set("emotionPt", event.target.value)}/></Field><Field wide label={h("Gatilho de Glamour (inglês)", "Glamour Trigger (English)")}><Textarea value={String(value.glamourTrigger ?? "")} onChange={(event) => set("glamourTrigger", event.target.value)}/></Field><Field wide label={h("Gatilho de Glamour (português)", "Glamour Trigger (Portuguese)")}><Textarea value={String(value.glamourTriggerPt ?? "")} onChange={(event) => set("glamourTriggerPt", event.target.value)}/></Field><Field wide label={h("Benefícios de Mantle 1–5 (um por linha) *", "Mantle 1–5 benefits (one per line) *")}><Textarea rows={6} value={lines("mantleBenefits")} onChange={(event) => set("mantleBenefits", event.target.value.split("\n"))}/></Field><Field wide label={h("Benefícios de Mantle 1–5 em português *", "Portuguese Mantle 1–5 benefits *")}><Textarea rows={6} value={lines("mantleBenefitsPt")} onChange={(event) => set("mantleBenefitsPt", event.target.value.split("\n"))}/></Field></>}
  </div>{error && <p className="homebrew-error" role="alert">{error}</p>}<DialogFooter><Button type="button" variant="outline" onClick={() => onOpenChange(false)}>{h("Cancelar", "Cancel")}</Button><Button type="button" onClick={commit}>{h("Salvar", "Save")}</Button></DialogFooter></DialogContent></Dialog>;
}
