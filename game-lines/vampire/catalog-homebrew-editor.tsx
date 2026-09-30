"use client";

import { useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useLanguage } from "@/lib/i18n";
import { normalizeVampireCatalogHomebrew, type VampireCatalogHomebrew, type VampireHomebrewEntryType, VAMPIRE_CATALOG_HOMEBREW_SOURCE, VAMPIRE_CATALOG_HOMEBREW_SOURCE_ID, vampireCatalogHomebrewId } from "./catalog-homebrews";
import type { VampirePurchasablePower } from "./catalog-types";

const powerKinds = ["devotion", "cruac-rite", "theban-miracle", "kimiya-formula", "therion-sacrilege", "gilded-invocation", "coil", "scale"] as const satisfies readonly VampirePurchasablePower["kind"][];
const csv = (value: unknown) => Array.isArray(value) ? value.join(", ") : "";
const split = (value: string) => value.split(",").map((item) => item.trim()).filter(Boolean);

export function emptyVampireCatalogHomebrew(entryType: VampireHomebrewEntryType, powerKind: VampirePurchasablePower["kind"] = "devotion"): VampireCatalogHomebrew {
  const common = { id: vampireCatalogHomebrewId(entryType), name: "", translatedName: "", source: VAMPIRE_CATALOG_HOMEBREW_SOURCE, sourceId: VAMPIRE_CATALOG_HOMEBREW_SOURCE_ID, page: 0, homebrew: true as const };
  if (entryType === "clan") return { ...common, entryType: "clan", favoredAttributes: ["", ""], disciplines: ["", "", ""], baneName: "", baneSummary: "", group: "uncommon" };
  if (entryType === "covenant") return { ...common, entryType: "covenant", advantage: "", description: "", group: "uncommon" };
  if (entryType === "discipline") return { ...common, entryType: "discipline", summary: "", levels: Array.from({ length: 5 }, (_, index) => ({ rating: index + 1, name: "", translatedName: "", summary: "" })) };
  return { ...common, entryType: "power", kind: powerKind, summary: "", manualOnly: true, ...(powerKind === "coil" ? { levels: Array.from({ length: 5 }, (_, index) => ({ rating: index + 1, name: "", translatedName: "", summary: "" })) } : {}) };
}

function Field({ label, children, wide = false }: { label: string; children: ReactNode; wide?: boolean }) { return <label className={wide ? "wide" : ""}><span>{label}</span>{children}</label>; }

export function VampireCatalogHomebrewEditor({ initial, onOpenChange, onSave }: { initial: VampireCatalogHomebrew; onOpenChange: (open: boolean) => void; onSave: (item: VampireCatalogHomebrew) => void }) {
  const { t } = useLanguage();
  const powerKindLabels: Record<(typeof powerKinds)[number], string> = { devotion: t("ui.devotion"), "cruac-rite": t("ui.cruacRite"), "theban-miracle": t("ui.thebanMiracle"), "kimiya-formula": t("ui.kimiyaFormula"), "therion-sacrilege": t("ui.therionSacrilege"), "gilded-invocation": t("ui.gildedInvocation"), coil: t("ui.coilOfTheDragon"), scale: t("ui.scaleOfTheDragon") };
  const [value, setValue] = useState<Record<string, unknown>>(() => structuredClone(initial) as unknown as Record<string, unknown>), [error, setError] = useState("");
  const set = (key: string, next: unknown) => setValue((current) => ({ ...current, [key]: next }));
  const updateLevel = (index: number, key: string, next: string) => setValue((current) => ({ ...current, levels: (Array.isArray(current.levels) ? current.levels : []).map((level, levelIndex) => levelIndex === index ? { ...(level as Record<string, unknown>), [key]: next } : level) }));
  const entryType = value.entryType as VampireHomebrewEntryType, kind = value.kind as VampirePurchasablePower["kind"];
  const commit = () => {
    const normalized = normalizeVampireCatalogHomebrew(value);
    if (!normalized) return setError(t("ui.vampireCatalogHomebrewRequiredFields"));
    onSave(normalized); onOpenChange(false);
  };
  return <Dialog open onOpenChange={onOpenChange}><DialogContent className="homebrew-dialog"><DialogHeader><DialogTitle>{t("ui.vampireHomebrewContent")}</DialogTitle><DialogDescription>{t("ui.vampireHomebrewContentDescription")}</DialogDescription></DialogHeader><div className="homebrew-form">
    <Field label={t("ui.requiredName")}><Input value={String(value.name ?? "")} onChange={(event) => { set("name", event.target.value); if (!value.translatedName) set("translatedName", event.target.value); }}/></Field>
    <Field label={t("ui.translatedName")}><Input value={String(value.translatedName ?? "")} onChange={(event) => set("translatedName", event.target.value)}/></Field>
    {entryType === "clan" && <><Field label={t("ui.requiredFavoredAttributes")} wide><Input value={csv(value.favoredAttributes)} onChange={(event) => set("favoredAttributes", split(event.target.value))}/></Field><Field label={t("ui.requiredThreeDisciplines")} wide><Input value={csv(value.disciplines)} onChange={(event) => set("disciplines", split(event.target.value))}/></Field><Field label={t("ui.requiredBaneName")}><Input value={String(value.baneName ?? "")} onChange={(event) => set("baneName", event.target.value)}/></Field><Field label={`${t("ui.bane")} *`} wide><Textarea value={String(value.baneSummary ?? "")} onChange={(event) => set("baneSummary", event.target.value)}/></Field></>}
    {entryType === "covenant" && <><Field label={`${t("ui.advantage")} *`} wide><Textarea value={String(value.advantage ?? "")} onChange={(event) => set("advantage", event.target.value)}/></Field><Field label={t("ui.requiredDescription")} wide><Textarea value={String(value.description ?? "")} onChange={(event) => set("description", event.target.value)}/></Field></>}
    {entryType === "power" && <Field label={t("ui.type")}><select value={kind} onChange={(event) => { const next = event.target.value as VampirePurchasablePower["kind"]; setValue((current) => ({ ...current, kind: next, levels: next === "coil" ? Array.from({ length: 5 }, (_, index) => ({ rating: index + 1, name: "", translatedName: "", summary: "" })) : undefined })); }}>{powerKinds.map((id) => <option key={id} value={id}>{powerKindLabels[id]}</option>)}</select></Field>}
    {(entryType === "discipline" || entryType === "power") && <><Field label={t("ui.requiredSummary")} wide><Textarea value={String(value.summary ?? "")} onChange={(event) => set("summary", event.target.value)}/></Field>{entryType === "discipline" && <><Field label={t("ui.allowedClans")} wide><Input value={csv(value.clanIds)} onChange={(event) => set("clanIds", split(event.target.value))}/></Field><Field label={t("ui.allowedCovenants")} wide><Input value={csv(value.covenantIds)} onChange={(event) => set("covenantIds", split(event.target.value))}/></Field></>}{entryType === "power" && kind !== "coil" && <><Field label={t("ui.rank")}><Input type="number" min={1} max={5} value={Number(value.rating ?? 1)} onChange={(event) => set("rating", Number(event.target.value))}/></Field><Field label={t("ui.experienceCost")}><Input type="number" min={0} value={Number(value.experienceCost ?? (kind === "devotion" ? 1 : 2))} onChange={(event) => set("experienceCost", Number(event.target.value))}/></Field></>}<Field label={t("ui.prerequisites")} wide><Input value={String(value.prerequisites ?? "")} onChange={(event) => set("prerequisites", event.target.value)}/></Field><Field label={t("ui.cost")}><Input value={String(value.cost ?? "")} onChange={(event) => set("cost", event.target.value)}/></Field><Field label={t("ui.dicePool")}><Input value={String(value.dicePool ?? "")} onChange={(event) => set("dicePool", event.target.value)}/></Field><Field label={t("ui.action")}><Input value={String(value.action ?? "")} onChange={(event) => set("action", event.target.value)}/></Field><Field label={t("ui.duration")}><Input value={String(value.duration ?? "")} onChange={(event) => set("duration", event.target.value)}/></Field><Field label={t("ui.effect")} wide><Textarea value={String(value.effect ?? "")} onChange={(event) => set("effect", event.target.value)}/></Field></>}
    {(entryType === "discipline" || kind === "coil") && <fieldset className="wide homebrew-section"><legend><span>{t("ui.levels")}</span></legend><div>{(Array.isArray(value.levels) ? value.levels : []).map((level, index) => { const item = level as Record<string, unknown>; return <section className="homebrew-repeat" key={index}><strong>{index + 1}</strong><Input placeholder={t("ui.levelName")} value={String(item.name ?? "")} onChange={(event) => { updateLevel(index, "name", event.target.value); updateLevel(index, "translatedName", event.target.value); }}/><Textarea placeholder={t("ui.levelSummary")} value={String(item.summary ?? "")} onChange={(event) => updateLevel(index, "summary", event.target.value)}/></section>; })}</div></fieldset>}
  </div>{error && <p className="homebrew-error" role="alert">{error}</p>}<DialogFooter><Button type="button" variant="outline" onClick={() => onOpenChange(false)}>{t("common.cancel")}</Button><Button type="button" onClick={commit}>{t("common.save")}</Button></DialogFooter></DialogContent></Dialog>;
}
