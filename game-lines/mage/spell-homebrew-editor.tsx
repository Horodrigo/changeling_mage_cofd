"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useLanguage } from "@/lib/i18n";
import { ARCANA } from "./creation-rules";
import { normalizeSpellHomebrew, type SpellHomebrew } from "./spell-homebrews";

export function SpellHomebrewEditor({ initial, onOpenChange, onSave }: { initial: SpellHomebrew; onOpenChange: (open: boolean) => void; onSave: (spell: SpellHomebrew) => void }) {
  const { t } = useLanguage();
  const [value, setValue] = useState(() => structuredClone(initial)), [skills, setSkills] = useState(initial.roteSkills.join(", ")), [error, setError] = useState("");
  const set = (key: keyof SpellHomebrew, next: unknown) => setValue((current) => ({ ...current, [key]: next }));
  const setArcanum = (arcanum: string, rating: number) => setValue((current) => {
    const requirements = { ...current.requirements };
    if (rating) requirements[arcanum] = rating; else delete requirements[arcanum];
    return { ...current, requirements };
  });
  const commit = () => {
    const normalized = normalizeSpellHomebrew({ ...value, roteSkills: skills.split(",") });
    if (!normalized) return setError(t("ui.homebrewSpellRequiredFields"));
    onSave(normalized); onOpenChange(false);
  };
  return <Dialog open onOpenChange={onOpenChange}><DialogContent className="homebrew-dialog"><DialogHeader><DialogTitle>{t(value.name ? "ui.editHomebrewSpell" : "ui.createHomebrewSpell")}</DialogTitle><DialogDescription>{t("ui.homebrewSpellDescription")}</DialogDescription></DialogHeader><div className="homebrew-form">
    <label><span>{t("ui.requiredName")}</span><Input value={value.name} onChange={(event) => set("name", event.target.value)}/></label>
    <label><span>{t("ui.requiredPractice")}</span><Input value={value.practice} onChange={(event) => set("practice", event.target.value)}/></label>
    <label><span>{t("ui.requiredPrimaryFactor")}</span><Input value={value.primaryFactor} onChange={(event) => set("primaryFactor", event.target.value)}/></label>
    <label><span>{t("ui.withstand")}</span><Input value={value.withstand} onChange={(event) => set("withstand", event.target.value)}/></label>
    <fieldset className="wide homebrew-section"><legend><span>{t("ui.requiredArcana")}</span></legend><div>{ARCANA.map((arcanum) => <label key={arcanum}><span>{arcanum}</span><Input type="number" min={0} max={5} value={value.requirements[arcanum] ?? 0} onChange={(event) => setArcanum(arcanum, Number(event.target.value))}/></label>)}</div></fieldset>
    <label className="wide"><span>{t("ui.requiredCommaSeparatedRoteSkills")}</span><Input value={skills} onChange={(event) => setSkills(event.target.value)}/></label>
    <label className="wide"><span>{t("ui.requiredSummary")}</span><Textarea value={value.summary ?? ""} onChange={(event) => set("summary", event.target.value)}/></label>
    <label className="wide"><span>{t("ui.detailedDescription")}</span><Textarea value={value.description ?? ""} onChange={(event) => set("description", event.target.value)}/></label>
  </div>{error && <p className="homebrew-error" role="alert">{error}</p>}<DialogFooter><Button type="button" variant="outline" onClick={() => onOpenChange(false)}>{t("common.cancel")}</Button><Button type="button" onClick={commit}>{t("ui.saveHomebrewSpell")}</Button></DialogFooter></DialogContent></Dialog>;
}
