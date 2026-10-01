"use client";

import { useState } from "react";
import { History, RotateCcw, ShoppingBag } from "lucide-react";
import { BeatTrack, ExperienceMeritPicker, ExperienceRatingPicker, convertFifthBeat, groupedPurchaseOptions, type ExperiencePurchaseGroup } from "@/app/workspace/experience-shared";
import { RuleSelect } from "@/app/workspace/rule-select";
import { COMMON_MERIT_CONFIGURATIONS } from "@/app/builder/common-merit-configurations";
import { MeritConfigurationEditor } from "@/app/builder/merit-configuration-editor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import type { CharacterSheet } from "@/lib/core/character/character-types";
import { ATTRIBUTES, SKILLS } from "@/lib/core/character/creation-rules";
import { normalizeMeritConfiguration, type MeritConfiguration } from "@/lib/core/character/merit-configuration";
import type { CatalogSnapshot } from "@/lib/game-line-contracts/catalog-groups";
import { translate, useLanguage, type Locale } from "@/lib/i18n";
import { meritPrerequisitesMet, type MeritDefinition } from "@/lib/merits";
import { meritPresentation } from "@/lib/merit-presentation";
import { systemTerm } from "@/lib/system-terms";
import { activeMeritCatalog } from "@/lib/merit-homebrews";
import { useHomebrewPreferences } from "@/app/use-homebrew";
import type { WerewolfReferenceCatalog } from "./catalogs/reference";
import type { WerewolfGiftCatalog } from "./catalogs/gifts";
import { boundedPrimalUrge, primalUrgeLevel } from "./creation-rules";
import { WerewolfMeritConfigurationEditor } from "./merit-configuration-editor";
import { WEREWOLF_MERIT_CONFIGURATION_IDS, werewolfMeritPrerequisitesMet } from "./merit-rules";
import { canAdvanceWerewolfGrant, purchaseWerewolfAdvancement, refundWerewolfAdvancement, werewolfAdvancementContexts, werewolfExperienceHistory, werewolfPurchaseQuote, werewolfExperienceValue, WerewolfAdvancementError, type WerewolfPurchase } from "./experience-rules";

type PurchaseType = "attribute" | "skill" | "specialty" | "merit" | "primal-urge";
const LABELS = { attribute: "ui.attribute", skill: "ui.skill", specialty: "ui.specialty", merit: "ui.merit", "primal-urge": "werewolf.primalUrge" } as const;
const GROUPS = [{ group: "core", purchases: ["attribute", "skill", "specialty", "merit"] }, { group: "supernatural", purchases: ["primal-urge"] }] as const satisfies readonly ExperiencePurchaseGroup<PurchaseType>[];

/** Canonical history is localized for display, never rewritten or parsed as English prose. */
export function werewolfPurchaseLabel(purchase: WerewolfPurchase, merits: readonly MeritDefinition[], locale: Locale) {
  if (purchase.kind === "trait") return `${systemTerm(purchase.name, locale)} ${purchase.target}`;
  if (purchase.kind === "specialty") return `${systemTerm(purchase.skill, locale)}: ${purchase.name}`;
  if (purchase.kind === "primalUrge") return `${translate(locale, "werewolf.primalUrge")} ${purchase.target}`;
  const definition = merits.find(item => item.id === purchase.definitionId);
  return `${definition ? meritPresentation(definition, locale).name : purchase.definitionId} ${purchase.target}`;
}

export function WerewolfExperiencePanel({ character, updateSheet, updateState, catalogs, builderMode = false }: {
  character: CharacterSheet; updateSheet: (sheet: CharacterSheet) => void; updateState?: (state: Record<string, unknown>) => void; catalogs: CatalogSnapshot; builderMode?: boolean;
}) {
  const { locale, t } = useLanguage(), preferences = useHomebrewPreferences();
  const reference = catalogs.get<WerewolfReferenceCatalog>("werewolf-reference"), gifts = catalogs.get<WerewolfGiftCatalog>("werewolf-gifts");
  const merits = activeMeritCatalog([...catalogs.get<MeritDefinition[]>("core-merits"), ...catalogs.get<MeritDefinition[]>("werewolf-merits")], [], preferences, character.merits.map(item => item.name));
  const context = { reference, gifts, merits }, contexts = werewolfAdvancementContexts(character, context), state = character.current_state;
  const available = werewolfExperienceValue(state.experience_available), spent = werewolfExperienceValue(state.experience_spent);
  const total = Math.max(available + spent, werewolfExperienceValue(state.experience_total)), beats = Math.min(5, werewolfExperienceValue(state.beats)), history = werewolfExperienceHistory(character);
  const [amountDraft, setAmountDraft] = useState<string | null>(null), [type, setType] = useState<PurchaseType>("attribute"), [target, setTarget] = useState("");
  const [rating, setRating] = useState(0), [meritIndex, setMeritIndex] = useState(-1), [configuration, setConfiguration] = useState<MeritConfiguration>({});
  const [specialty, setSpecialty] = useState(""), [feedback, setFeedback] = useState("");
  const labels = (value: PurchaseType) => t(LABELS[value]);
  const options = (type === "attribute" ? Object.values(ATTRIBUTES).flat() : Object.values(SKILLS).flat()).map(name => ({ value: name, label: systemTerm(name, locale) }));
  const chosen = options.some(item => item.value === target) ? target : options[0]?.value ?? "";
  const current = type === "attribute" ? Number(character.attributes[chosen] ?? 1) : type === "skill" ? Number(character.skills[chosen] ?? 0) : boundedPrimalUrge(character.line_data.primal_urge);
  const maximum = type === "primal-urge" ? 10 : primalUrgeLevel(reference, character.line_data.primal_urge).traitMaximum;
  const intended = current < maximum ? Math.max(current + 1, Math.min(maximum, rating || current + 1)) : current;
  const definition = merits.find(item => item.id === target), instance = meritIndex >= 0 ? character.merits[meritIndex] : undefined;
  const purchase: WerewolfPurchase = type === "attribute" || type === "skill" ? { kind: "trait", group: type === "attribute" ? "attributes" : "skills", name: chosen, target: intended }
    : type === "specialty" ? { kind: "specialty", skill: chosen, name: specialty.trim() }
      : type === "primal-urge" ? { kind: "primalUrge", target: intended }
        : { kind: "merit", definitionId: target, target: rating, instanceId: instance?.instanceId, configuration };
  let cost = 0, problem = "";
  try { cost = werewolfPurchaseQuote(character, purchase, context); }
  catch (error) { if (error instanceof WerewolfAdvancementError) problem = t(`werewolf.experienceProblem.${error.problem}`); else throw error; }
  const transact = (action: () => CharacterSheet, message: string) => {
    try { updateSheet(action()); setFeedback(message); }
    catch (error) { if (error instanceof WerewolfAdvancementError) setFeedback(t(`werewolf.experienceProblem.${error.problem}`)); else throw error; }
  };
  const saveState = (patch: Record<string, unknown>) => {
    const next = { ...state, ...patch };
    if (updateState) updateState(next); else updateSheet({ ...character, current_state: next });
  };
  const changeType = (next: string) => { setType(next as PurchaseType); setTarget(""); setRating(0); setMeritIndex(-1); setConfiguration({}); setSpecialty(""); setFeedback(""); };
  const historyPanel = <details className="experience-history"><summary><History/>{t("ui.experienceExpenses")} ({history.length})</summary><div>{history.length ? [...history].reverse().map(entry => {
    const label = werewolfPurchaseLabel(entry.purchase, merits, locale);
    return <p key={entry.id}><span>{label}</span><strong>{entry.cost} {t("ui.xp")}</strong><small>{new Date(entry.createdAt).toLocaleDateString(locale)}</small>
      <Button type="button" size="sm" variant="ghost" onClick={() => transact(() => refundWerewolfAdvancement(character, entry.id, context, builderMode), t("ui.wasRefundedExperienceRestored", { p1: label, p2: entry.cost }))}><RotateCcw/>{t("ui.refund")}</Button></p>;
  }) : <em>{t("ui.noExpensesRecorded")}</em>}</div></details>;
  return <section className="experience-panel wtf-experience-panel">
    <div className="experience-title"><div><span>{builderMode ? t("ui.creationAdvancement") : t("ui.beatsAndExperience")}</span><small>{builderMode ? t("ui.creationAdvancementDescription") : t("ui.beatsAreTrackedSeparatelyFromExperience")}</small></div></div>
    <div className="experience-totals">{!builderMode && <label className="experience-input"><Input type="number" min={0} step={1} inputMode="numeric" value={amountDraft ?? String(available)} onChange={event => setAmountDraft(event.target.value)} aria-label={t("ui.availableExperience")}
      onBlur={() => { const value = Number(amountDraft ?? available), next = Number.isFinite(value) ? Math.max(0, Math.trunc(value)) : 0; setAmountDraft(null); saveState({ experience_available: next, experience_spent: spent, experience_total: next + spent }); }} onKeyDown={event => { if (event.key === "Enter") event.currentTarget.blur(); }}/><span>{t("ui.xpAvailable")}</span></label>}
      <div><strong>{total}</strong><span>{t("ui.totalXP")}</span></div><div><strong>{spent}</strong><span>{t("ui.xpSpent")}</span></div></div>
    {!builderMode && <BeatTrack label={t("ui.beats")} value={beats} onChange={value => { const next = convertFifthBeat(value, available, total); saveState({ beats: next.beats, experience_available: next.available, experience_spent: spent, experience_total: next.total }); }}/ >}
    <Dialog><DialogTrigger asChild><Button type="button" variant="outline" size="sm" className="catalog-selection-action"><ShoppingBag/>{t("ui.spendExperience")}</Button></DialogTrigger><DialogContent className="experience-dialog">
      <DialogHeader><DialogTitle>{t("ui.spendExperience")}</DialogTitle><DialogDescription>{t("werewolf.experienceDescription")}</DialogDescription></DialogHeader>
      <div className="experience-purchase-form"><label>{t("ui.type")}<RuleSelect value={type} onChange={changeType} options={groupedPurchaseOptions(GROUPS, labels, locale)}/></label>
        {type === "merit" ? <label>{t("ui.merit")}<ExperienceMeritPicker line="WtF" archetypes={["werewolf"]} meritCatalog={merits} character={character} selectedId={definition?.id ?? ""} targetDots={rating} canAdvanceGrant={canAdvanceWerewolfGrant}
          isEligible={(item, candidate) => meritPrerequisitesMet(item, { ...candidate, attributes: contexts.core.attributes, skills: contexts.core.skills, size: contexts.core.size }) && werewolfMeritPrerequisitesMet(item, { id: item.id, dots: candidate.selectedDots ?? item.ratings[0], configuration: candidate.configuration }, contexts.own)}
          onSelect={(id, dots, index) => { setTarget(id); setRating(dots); setMeritIndex(index); setConfiguration(normalizeMeritConfiguration(character.merits[index]?.configuration)); setFeedback(""); }}/></label>
          : type !== "primal-urge" && <label>{t("ui.trait")}<RuleSelect value={chosen} onChange={value => { setTarget(value); setRating(0); setFeedback(""); }} options={options}/></label>}
        {type === "merit" && definition && rating > 0 && (WEREWOLF_MERIT_CONFIGURATION_IDS.has(definition.id)
          ? <WerewolfMeritConfigurationEditor merit={{ id: definition.id, instanceId: instance?.instanceId, dots: rating, configuration }} context={contexts.own} giftPresentation={gifts.presentation} onChange={setConfiguration}/>
          : <MeritConfigurationEditor merit={{ name: definition.name, dots: rating, configuration }} catalog={merits} ownedMerits={character.merits} definitions={COMMON_MERIT_CONFIGURATIONS} onChange={setConfiguration}/>)}
        {type === "specialty" && <label>{t("ui.specialty")}<Input value={specialty} onChange={event => setSpecialty(event.target.value)} placeholder={t("ui.specialtyName")} maxLength={80}/></label>}
        {(type === "attribute" || type === "skill" || type === "primal-urge") && maximum > current && <ExperienceRatingPicker current={current} maximum={maximum} value={intended} onChange={setRating}/>}
      </div><div className="purchase-preview"><strong>{type === "merit" && !definition ? t("ui.merit") : werewolfPurchaseLabel(purchase, merits, locale)}</strong><span>{cost} {t("ui.xp")}</span></div>
      {(feedback || problem) && <p className="experience-feedback">{feedback || problem}</p>}{historyPanel}
      <DialogFooter><DialogClose asChild><Button type="button" variant="outline" size="sm" className="catalog-dialog-done">{t("ui.close")}</Button></DialogClose><Button type="button" size="sm" className="catalog-selection-action" disabled={Boolean(problem) || cost < 1 || (!builderMode && available < cost)} onClick={() => transact(() => purchaseWerewolfAdvancement(character, purchase, context, builderMode), t("werewolf.purchaseRecorded"))}>{t("ui.purchaseFor")} {cost} {t("ui.xp")}</Button></DialogFooter>
    </DialogContent></Dialog>
    {feedback && <p className="experience-feedback compact">{feedback}</p>}{historyPanel}
  </section>;
}
