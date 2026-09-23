"use client";

import { useMemo, useState } from "react";
import { History, RotateCcw, ShoppingBag } from "lucide-react";
import { COMMON_MERIT_CONFIGURATIONS } from "@/app/builder/common-merit-configurations";
import { MeritConfigurationEditor } from "@/app/builder/merit-configuration-editor";
import { BeatTrack, ExperienceMeritPicker, ExperienceRatingPicker, experiencePurchaseBalances, groupedPurchaseOptions, type ExperiencePurchaseGroup } from "@/app/workspace/experience-shared";
import { RuleSelect } from "@/app/workspace/rule-select";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import type { CharacterSheet } from "@/lib/core/character/character-types";
import { ATTRIBUTES, SKILLS } from "@/lib/core/character/creation-rules";
import { normalizeMeritConfiguration, type MeritConfiguration } from "@/lib/core/character/merit-configuration";
import type { CatalogSnapshot } from "@/lib/game-line-contracts/catalog-groups";
import { useLanguage } from "@/lib/i18n";
import { addExperienceMeritDots } from "@/lib/merit-progression";
import { meritContextForSheet, meritSelectionProblems, type MeritDefinition } from "@/lib/merits";
import { createRandomId } from "@/lib/random-id";
import { systemTerm } from "@/lib/system-terms";
import { mortalDerived } from "./creation-rules";
import { refundMortalAdvancement, type MortalAdvancementUndo } from "./experience-rules";

type PurchaseType = "attribute" | "skill" | "specialty" | "merit" | "integrity";
type HistoryEntry = { id: string; label: string; cost: number; createdAt: string; undo: MortalAdvancementUndo };

const PURCHASE_GROUPS = [
  { group: "core", purchases: ["attribute", "skill", "specialty", "merit"] },
  { group: "integrity", purchases: ["integrity"] },
] as const satisfies readonly ExperiencePurchaseGroup<PurchaseType>[];

function purchaseLabel(type: PurchaseType, locale: string) {
  const labels: Record<PurchaseType, [string, string]> = {
    attribute: ["Atributo", "Attribute"], skill: ["Perícia", "Skill"], specialty: ["Especialização", "Specialty"], merit: ["Mérito", "Merit"], integrity: ["Integridade", "Integrity"],
  };
  return labels[type][locale === "pt-BR" ? 0 : 1];
}

export function MortalExperiencePanel({ character, updateSheet, catalogs, builderMode = false }: { character: CharacterSheet; updateSheet: (sheet: CharacterSheet) => void; catalogs: CatalogSnapshot; builderMode?: boolean }) {
  const { locale, t } = useLanguage();
  const state = character.current_state;
  const available = Math.max(0, Math.trunc(Number(state.experience_available ?? 0)));
  const spent = Math.max(0, Math.trunc(Number(state.experience_spent ?? 0)));
  const total = Math.max(available + spent, Math.max(0, Math.trunc(Number(state.experience_total ?? 0))));
  const beats = Math.max(0, Math.min(5, Math.trunc(Number(state.beats ?? 0))));
  const history = Array.isArray(state.mortal_experience_history) ? state.mortal_experience_history as HistoryEntry[] : [];
  const meritCatalog = useMemo(() => [...catalogs.get<readonly MeritDefinition[]>("core-merits")], [catalogs]);
  const [amountDraft, setAmountDraft] = useState<string | null>(null);
  const [purchase, setPurchase] = useState<PurchaseType>("attribute");
  const [target, setTarget] = useState("");
  const [targetRating, setTargetRating] = useState(0);
  const [specialtyName, setSpecialtyName] = useState("");
  const [meritDots, setMeritDots] = useState(0);
  const [meritInstance, setMeritInstance] = useState(-1);
  const [meritConfiguration, setMeritConfiguration] = useState<MeritConfiguration>({});
  const [feedback, setFeedback] = useState("");
  const options = purchase === "attribute"
    ? Object.values(ATTRIBUTES).flat().map((name) => ({ value: name, label: systemTerm(name, locale) }))
    : purchase === "skill" || purchase === "specialty"
      ? Object.values(SKILLS).flat().map((name) => ({ value: name, label: systemTerm(name, locale) }))
      : [{ value: purchase, label: purchaseLabel(purchase, locale) }];
  const chosen = purchase === "merit" ? target : options.some((item) => item.value === target) ? target : options[0]?.value ?? "";
  const selectedMerit = meritCatalog.find((item) => item.id === chosen);
  const ownedMerit = meritInstance >= 0 ? character.merits[meritInstance] : undefined;
  const current = purchase === "attribute" ? Number(character.attributes[chosen] ?? 1)
    : purchase === "skill" ? Number(character.skills[chosen] ?? 0)
      : purchase === "integrity" ? Number(character.line_data.integrity ?? 7) : 0;
  const maximum = purchase === "integrity" ? 10 : purchase === "attribute" || purchase === "skill" ? 5 : 0;
  const intended = current < maximum ? Math.max(current + 1, Math.min(maximum, targetRating || current + 1)) : current;
  const amount = Math.max(0, intended - current);
  const cost = purchase === "attribute" ? amount * 4
    : purchase === "skill" ? amount * 2
      : purchase === "specialty" ? 1
        : purchase === "merit" ? Math.max(0, meritDots - Number(ownedMerit?.dots ?? 0))
          : amount * 2;
  const meritContext = meritContextForSheet(character, meritCatalog, ["mortal"]);
  const meritUnavailable = purchase === "merit" && (!selectedMerit || !meritDots || meritSelectionProblems(selectedMerit, { dots: meritDots, configuration: meritConfiguration }, meritContext).length > 0);
  const unavailable = !chosen || cost < 1 || meritUnavailable || (maximum > 0 && current >= maximum) || (purchase === "specialty" && !specialtyName.trim());
  const saveState = (patch: Record<string, unknown>) => {
    const next = structuredClone(character);
    next.current_state = { ...next.current_state, ...patch };
    updateSheet(next);
  };

  const buy = () => {
    if (unavailable || (!builderMode && available < cost)) return setFeedback(t("ui.mortalPurchaseUnavailable"));
    const next = structuredClone(character);
    let label = options.find((item) => item.value === chosen)?.label ?? purchaseLabel(purchase, locale);
    let undo: MortalAdvancementUndo;
    if (purchase === "attribute" || purchase === "skill") {
      const group = purchase === "attribute" ? "attributes" : "skills";
      next[group][chosen] = intended;
      label = `${systemTerm(chosen, locale)} ${intended}`;
      undo = { kind: "trait", group, name: chosen, amount };
    } else if (purchase === "specialty") {
      const name = specialtyName.trim();
      next.specializations.push({ skill: chosen, name });
      label = `${systemTerm(chosen, locale)}: ${name}`;
      undo = { kind: "specialty", skill: chosen, name };
    } else if (purchase === "merit" && selectedMerit) {
      let index = meritInstance;
      if (index >= 0 && next.merits[index]?.name === selectedMerit.name) {
        addExperienceMeritDots(next.merits[index], cost);
        next.merits[index].configuration = normalizeMeritConfiguration(meritConfiguration);
      } else {
        next.merits.push({ instanceId: createRandomId(), name: selectedMerit.name, dots: meritDots, creationDots: 0, experienceDots: meritDots, sourceId: selectedMerit.sourceId, source: selectedMerit.source, configuration: normalizeMeritConfiguration(meritConfiguration) });
        index = next.merits.length - 1;
      }
      const merit = next.merits[index];
      label = `${locale === "pt-BR" ? selectedMerit.translatedName : selectedMerit.name} ${meritDots}`;
      undo = { kind: "merit", name: selectedMerit.name, dots: cost, instanceId: merit.instanceId, index };
    } else {
      next.line_data.integrity = intended;
      label = `${purchaseLabel("integrity", locale)} ${intended}`;
      undo = { kind: "integrity", amount };
    }
    next.derived = mortalDerived(next);
    const balance = experiencePurchaseBalances(available, spent, total, cost, builderMode);
    const entry: HistoryEntry = { id: createRandomId(), label, cost, createdAt: new Date().toISOString(), undo };
    next.current_state = { ...next.current_state, experience_available: balance.available, experience_spent: balance.spent, experience_total: balance.total, mortal_experience_history: [...history, entry] };
    updateSheet(next);
    setFeedback(t("ui.mortalPurchaseRecorded"));
    setTarget("");
    setTargetRating(0);
    setSpecialtyName("");
    setMeritDots(0);
    setMeritInstance(-1);
    setMeritConfiguration({});
  };
  const revert = (entry: HistoryEntry) => {
    if (!history.some((item) => item.id === entry.id)) return;
    const next = structuredClone(character);
    refundMortalAdvancement(next, entry.undo);
    next.derived = mortalDerived(next);
    next.current_state = { ...next.current_state, experience_available: available + entry.cost, experience_spent: Math.max(0, spent - entry.cost), experience_total: total, mortal_experience_history: history.filter((item) => item.id !== entry.id) };
    updateSheet(next);
    setFeedback(t("ui.wasRefundedExperienceRestored", { p1: entry.label, p2: entry.cost }));
  };
  const commitAvailableExperience = () => {
    const nextAvailable = Math.max(0, Math.trunc(Number(amountDraft ?? available) || 0));
    setAmountDraft(null);
    saveState({ experience_available: nextAvailable, experience_spent: spent, experience_total: nextAvailable + spent });
  };
  const historyPanel = <details className="experience-history"><summary><History /> {t("ui.experienceExpenses")} ({history.length})</summary><div>{history.length ? [...history].reverse().map((entry) => <p key={entry.id}><span>{entry.label}</span><strong>{entry.cost} {t("ui.xp")}</strong><small>{new Date(entry.createdAt).toLocaleDateString(locale)}</small><Button type="button" size="sm" variant="ghost" onClick={() => revert(entry)}><RotateCcw /> {t("ui.refund")}</Button></p>) : <em>{t("ui.noExpensesRecorded")}</em>}</div></details>;

  return <section className="experience-panel mortal-experience-panel">
    <div className="experience-title"><div><span>{builderMode ? t("ui.creationAdvancement") : t("ui.beatsAndExperience")}</span><small>{builderMode ? t("ui.creationAdvancementDescription") : t("ui.beatsAreTrackedSeparatelyFromExperience")}</small></div></div>
    <div className="experience-totals">
      {!builderMode && <label className="experience-input"><Input type="number" min={0} step={1} inputMode="numeric" value={amountDraft ?? String(available)} onChange={(event) => setAmountDraft(event.target.value)} onBlur={commitAvailableExperience} onKeyDown={(event) => { if (event.key === "Enter") event.currentTarget.blur(); }} aria-label={t("ui.availableExperience")} /><span>{t("ui.xpAvailable")}</span></label>}
      <div><strong>{total}</strong><span>{t("ui.totalXP")}</span></div><div><strong>{spent}</strong><span>{t("ui.xpSpent")}</span></div>
    </div>
    {!builderMode && <BeatTrack label={t("ui.beats")} value={beats} onChange={(value) => saveState(value === 5 ? { beats: 0, experience_available: available + 1, experience_spent: spent, experience_total: total + 1 } : { beats: value })} />}
    <div className="experience-actions"><Dialog><DialogTrigger asChild><Button type="button" variant="outline" size="sm" className="catalog-selection-action"><ShoppingBag /> {t("ui.spendExperience")}</Button></DialogTrigger><DialogContent className="experience-dialog">
      <DialogHeader><DialogTitle>{t("ui.spendExperience")}</DialogTitle><DialogDescription>{t("ui.mortalExperienceDescription")}</DialogDescription></DialogHeader>
      <div className="experience-purchase-form">
        <label>{t("ui.type")}<RuleSelect value={purchase} onChange={(value) => { setPurchase(value as PurchaseType); setTarget(""); setTargetRating(0); setMeritDots(0); setMeritInstance(-1); setMeritConfiguration({}); setFeedback(""); }} options={groupedPurchaseOptions(PURCHASE_GROUPS, (value) => purchaseLabel(value, locale), locale)} /></label>
        {purchase === "merit" ? <label>{t("ui.merit")}<ExperienceMeritPicker line="CofD" archetypes={["mortal"]} meritCatalog={meritCatalog} character={character} selectedId={selectedMerit?.id ?? ""} targetDots={meritDots} onSelect={(id, dots, instance) => { setTarget(id); setMeritDots(dots); setMeritInstance(instance); setMeritConfiguration(normalizeMeritConfiguration(character.merits[instance]?.configuration)); }} /></label> : <label>{t("ui.trait")}<RuleSelect value={chosen} onChange={(value) => { setTarget(value); setTargetRating(0); }} options={options} /></label>}
        {purchase === "merit" && selectedMerit && meritDots > 0 && <MeritConfigurationEditor merit={{ name: selectedMerit.name, dots: meritDots, configuration: meritConfiguration }} onChange={setMeritConfiguration} catalog={meritCatalog} ownedMerits={character.merits} definitions={COMMON_MERIT_CONFIGURATIONS} />}
        {purchase === "specialty" && <label>{t("ui.specialty")}<Input value={specialtyName} placeholder={t("ui.specialtyName")} onChange={(event) => setSpecialtyName(event.target.value)} maxLength={80} /></label>}
        {maximum > current && <ExperienceRatingPicker current={current} maximum={maximum} value={intended} onChange={setTargetRating} />}
      </div>
      <div className="purchase-preview"><strong>{purchase === "merit" ? selectedMerit ? (locale === "pt-BR" ? selectedMerit.translatedName : selectedMerit.name) : purchaseLabel(purchase, locale) : options.find((item) => item.value === chosen)?.label ?? purchaseLabel(purchase, locale)}</strong><span>{cost} {t("ui.xp")}</span></div>
      {feedback && <p className="experience-feedback">{feedback}</p>}{historyPanel}
      <DialogFooter><DialogClose asChild><Button type="button" variant="outline" size="sm" className="catalog-dialog-done">{t("ui.close")}</Button></DialogClose><Button type="button" size="sm" className="catalog-selection-action" disabled={unavailable || (!builderMode && available < cost)} onClick={buy}>{t("ui.purchaseFor")} {cost} {t("ui.xp")}</Button></DialogFooter>
    </DialogContent></Dialog></div>
    {feedback && <p className="experience-feedback compact">{feedback}</p>}{historyPanel}
  </section>;
}
