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
import type { WerewolfRiteCatalog } from "./catalogs/rites";
import type { WerewolfTotemCatalog } from "./catalogs/totem";
import { RiteExperiencePicker } from "./experience-rites";
import { RiteRules } from "./creation-rites";
import { FacetRules } from "./creation-gifts";
import { FacetExperiencePicker, RenownGrantsPanel } from "./experience-gifts";
import { facetDefinition } from "./gift-progression";
import { RENOWN_IDS } from "./mechanics";
import type { RenownId } from "./catalogs/reference";
import { renownRatings, werewolfIds } from "./rules";
import { boundedPrimalUrge, primalUrgeLevel } from "./creation-rules";
import { WerewolfMeritConfigurationEditor } from "./merit-configuration-editor";
import { WEREWOLF_MERIT_CONFIGURATION_IDS, werewolfMeritPrerequisitesMet } from "./merit-rules";
import { canAdvanceWerewolfGrant, purchaseWerewolfAdvancement, refundWerewolfAdvancement, werewolfAdvancementContexts, werewolfExperienceHistory, werewolfPurchaseQuote, werewolfExperienceValue, WerewolfAdvancementError, type WerewolfPurchase, type WerewolfAdvancementCatalogs } from "./experience-rules";

type PurchaseType = "attribute" | "skill" | "specialty" | "merit" | "primal-urge" | "rite" | "renown" | "facet";
const LABELS = { attribute: "ui.attribute", skill: "ui.skill", specialty: "ui.specialty", merit: "ui.merit", "primal-urge": "werewolf.primalUrge", rite: "werewolf.rite", renown: "werewolf.renown", facet: "werewolf.facets" } as const;
const GROUPS = [{ group: "core", purchases: ["attribute", "skill", "specialty", "merit"] }, { group: "supernatural", purchases: ["primal-urge", "renown", "facet", "rite"] }] as const satisfies readonly ExperiencePurchaseGroup<PurchaseType>[];

/** Canonical history is localized for display, never rewritten or parsed as English prose. */
export function werewolfPurchaseLabel(purchase: WerewolfPurchase, catalogs: WerewolfAdvancementCatalogs, locale: Locale) {
  if (purchase.kind === "trait") return `${systemTerm(purchase.name, locale)} ${purchase.target}`;
  if (purchase.kind === "specialty") return `${systemTerm(purchase.skill, locale)}: ${purchase.name}`;
  if (purchase.kind === "primalUrge") return `${translate(locale, "werewolf.primalUrge")} ${purchase.target}`;
  if (purchase.kind === "renown") return `${translate(locale, `werewolf.renownNames.${purchase.name}`)} ${purchase.target}`;
  if (purchase.kind === "facet") {
    const facet = facetDefinition(purchase.definitionId, catalogs.gifts)?.facet;
    return facet ? locale === "pt-BR" ? catalogs.gifts.presentation[facet.id]?.name ?? facet.name : facet.name : purchase.definitionId;
  }
  if (purchase.kind === "rite") {
    const rite = catalogs.rites.rites.find(item => item.id === purchase.definitionId);
    return rite ? locale === "pt-BR" ? catalogs.rites.presentation.rites[rite.id]?.name ?? rite.name : rite.name : purchase.definitionId;
  }
  const definition = catalogs.merits.find(item => item.id === purchase.definitionId);
  return `${definition ? meritPresentation(definition, locale).name : purchase.definitionId} ${purchase.target}`;
}

export function WerewolfExperiencePanel({ character, updateSheet, updateState, catalogs, builderMode = false }: {
  character: CharacterSheet; updateSheet: (sheet: CharacterSheet) => void; updateState?: (state: Record<string, unknown>) => void; catalogs: CatalogSnapshot; builderMode?: boolean;
}) {
  const { locale, t } = useLanguage(), preferences = useHomebrewPreferences();
  const reference = catalogs.get<WerewolfReferenceCatalog>("werewolf-reference"), gifts = catalogs.get<WerewolfGiftCatalog>("werewolf-gifts");
  const rites = catalogs.get<WerewolfRiteCatalog>("werewolf-rites");
  const merits = activeMeritCatalog([...catalogs.get<MeritDefinition[]>("core-merits"), ...catalogs.get<MeritDefinition[]>("werewolf-merits")], [], preferences, character.merits);
  const context = { reference, gifts, rites, merits, totem: catalogs.get<WerewolfTotemCatalog>("werewolf-totem") }, contexts = werewolfAdvancementContexts(character, context), state = character.current_state;
  const available = werewolfExperienceValue(state.experience_available), spent = werewolfExperienceValue(state.experience_spent);
  const total = Math.max(available + spent, werewolfExperienceValue(state.experience_total)), beats = Math.min(5, werewolfExperienceValue(state.beats)), history = werewolfExperienceHistory(character);
  const [amountDraft, setAmountDraft] = useState<string | null>(null), [type, setType] = useState<PurchaseType>("attribute"), [target, setTarget] = useState("");
  const [rating, setRating] = useState(0), [meritIndex, setMeritIndex] = useState(-1), [configuration, setConfiguration] = useState<MeritConfiguration>({});
  const [specialty, setSpecialty] = useState(""), [feedback, setFeedback] = useState("");
  const [learningSource, setLearningSource] = useState("");
  const [authorization, setAuthorization] = useState(""), [deed, setDeed] = useState("");
  const labels = (value: PurchaseType) => t(LABELS[value]);
  const options = type === "renown" ? RENOWN_IDS.map(name => ({ value: name, label: t(`werewolf.renownNames.${name}`), localized: true }))
    : (type === "attribute" ? Object.values(ATTRIBUTES).flat() : Object.values(SKILLS).flat()).map(name => ({ value: name, label: systemTerm(name, locale) }));
  const chosen = options.some(item => item.value === target) ? target : options[0]?.value ?? "";
  const current = type === "attribute" ? Number(character.attributes[chosen] ?? 1) : type === "skill" ? Number(character.skills[chosen] ?? 0) : type === "renown" ? renownRatings(character.line_data.renown)[chosen as RenownId] : boundedPrimalUrge(character.line_data.primal_urge);
  const maximum = type === "primal-urge" ? 10 : primalUrgeLevel(reference, character.line_data.primal_urge).traitMaximum;
  const intended = current < maximum ? Math.max(current + 1, Math.min(maximum, rating || current + 1)) : current;
  const definition = merits.find(item => item.id === target), instance = meritIndex >= 0 ? character.merits[meritIndex] : undefined;
  const selectedRite = rites.rites.find(rite => rite.id === target);
  const selectedFacet = facetDefinition(target, gifts);
  const purchase: WerewolfPurchase = type === "attribute" || type === "skill" ? { kind: "trait", group: type === "attribute" ? "attributes" : "skills", name: chosen, target: intended }
    : type === "specialty" ? { kind: "specialty", skill: chosen, name: specialty.trim() }
      : type === "primal-urge" ? { kind: "primalUrge", target: intended }
        : type === "rite" ? { kind: "rite", definitionId: target, learningSource: learningSource.trim() }
          : type === "renown" ? { kind: "renown", name: chosen as RenownId, target: current + 1, deed: deed.trim() }
            : type === "facet" ? { kind: "facet", definitionId: target, learningSource: learningSource.trim(), authorization: authorization.trim() }
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
  const changeType = (next: string) => { setType(next as PurchaseType); setTarget(""); setRating(0); setMeritIndex(-1); setConfiguration({}); setSpecialty(""); setLearningSource(""); setAuthorization(""); setDeed(""); setFeedback(""); };
  const historyPanel = <details className="experience-history"><summary><History/>{t("ui.experienceExpenses")} ({history.length})</summary><div>{history.length ? [...history].reverse().map(entry => {
    const label = werewolfPurchaseLabel(entry.purchase, context, locale);
    return <p key={entry.id}><span>{label}</span><strong>{entry.cost} {t("ui.xp")}</strong><small>{new Date(entry.createdAt).toLocaleDateString(locale)}</small>
      {entry.purchase.kind === "rite" && <small>{t("werewolf.riteLearningSource")}: {entry.purchase.learningSource}</small>}
      {entry.purchase.kind === "renown" && <small>{t("werewolf.renownDeed")}: {entry.purchase.deed}</small>}
      {entry.purchase.kind === "facet" && (entry.purchase.learningSource || entry.purchase.authorization) && <small>{entry.purchase.learningSource || entry.purchase.authorization}</small>}
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
          isEligible={(item, candidate) => meritPrerequisitesMet(item, { ...candidate, attributes: contexts.core.attributes, skills: contexts.core.skills, size: contexts.core.size, merits: contexts.core.merits }) && werewolfMeritPrerequisitesMet(item, { id: item.id, dots: candidate.selectedDots ?? item.ratings[0], configuration: candidate.configuration }, contexts.own)}
          onSelect={(id, dots, index) => { setTarget(id); setRating(dots); setMeritIndex(index); setConfiguration(normalizeMeritConfiguration(character.merits[index]?.configuration)); setFeedback(""); }}/></label>
          : type === "rite" ? <div><label>{t("werewolf.rite")}</label><RiteExperiencePicker catalog={rites} tribeId={String(character.line_data.tribe_id ?? "")} knownIds={[...werewolfIds(character.line_data.creation_rites), ...werewolfIds(character.line_data.learned_rites)]} selectedId={target} onSelect={id => { setTarget(id); setLearningSource(""); setFeedback(""); }}/></div>
            : type === "facet" ? <div><label>{t("werewolf.facets")}</label><FacetExperiencePicker character={character} catalogs={context} selectedId={target} onSelect={id => { setTarget(id); setLearningSource(""); setAuthorization(""); setFeedback(""); }}/></div>
            : type !== "primal-urge" && <label>{t("ui.trait")}<RuleSelect value={chosen} onChange={value => { setTarget(value); setRating(0); setFeedback(""); }} options={options}/></label>}
        {type === "merit" && definition && rating > 0 && (WEREWOLF_MERIT_CONFIGURATION_IDS.has(definition.id)
          ? <WerewolfMeritConfigurationEditor merit={{ id: definition.id, instanceId: instance?.instanceId, dots: rating, configuration }} context={contexts.own} giftPresentation={gifts.presentation} onChange={setConfiguration}/>
          : <MeritConfigurationEditor merit={{ name: definition.name, dots: rating, configuration }} catalog={merits} ownedMerits={contexts.core.merits} definitions={COMMON_MERIT_CONFIGURATIONS} onChange={setConfiguration}/>)}
        {type === "specialty" && <label>{t("ui.specialty")}<Input value={specialty} onChange={event => setSpecialty(event.target.value)} placeholder={t("ui.specialtyName")} maxLength={80}/></label>}
        {type === "rite" && <label>{t("werewolf.riteLearningSource")}<Input value={learningSource} onChange={event => { setLearningSource(event.target.value); setFeedback(""); }} placeholder={t("werewolf.riteLearningSourcePlaceholder")} maxLength={240}/><small>{t("werewolf.riteLearningNote")}</small></label>}
        {type === "renown" && <label>{t("werewolf.renownDeed")}<Input value={deed} onChange={event => { setDeed(event.target.value); setFeedback(""); }} maxLength={240}/><small>{t("werewolf.renownLearningNote")}</small></label>}
        {type === "facet" && selectedFacet?.gift.kind === "shadow" && <label>{t("werewolf.giftLearningSource")}<Input value={learningSource} onChange={event => { setLearningSource(event.target.value); setFeedback(""); }} maxLength={240}/><small>{t("werewolf.giftLearningNote")}</small></label>}
        {type === "facet" && selectedFacet?.gift.kind === "moon" && <label>{t("werewolf.moonAuthorization")}<Input value={authorization} onChange={event => { setAuthorization(event.target.value); setFeedback(""); }} maxLength={240}/><small>{t("werewolf.moonExceptionNote")}</small></label>}
        {(type === "attribute" || type === "skill" || type === "primal-urge") && maximum > current && <ExperienceRatingPicker current={current} maximum={maximum} value={intended} onChange={setRating}/>}
      </div>
      {type === "rite" && selectedRite && <details className="wtf-rule-disclosure"><summary>{werewolfPurchaseLabel(purchase, context, locale)}</summary><RiteRules rite={selectedRite} catalog={rites}/></details>}
      {type === "facet" && selectedFacet && <details className="wtf-rule-disclosure"><summary>{werewolfPurchaseLabel(purchase, context, locale)}</summary><FacetRules facet={selectedFacet.facet} gifts={gifts}/></details>}
      <div className="purchase-preview"><strong>{type === "merit" && !definition ? t("ui.merit") : type === "rite" && !selectedRite ? t("werewolf.rite") : type === "facet" && !selectedFacet ? t("werewolf.facets") : werewolfPurchaseLabel(purchase, context, locale)}</strong><span>{cost} {t("ui.xp")}</span></div>
      {(feedback || problem) && <p className="experience-feedback">{feedback || problem}</p>}{historyPanel}
      <DialogFooter><DialogClose asChild><Button type="button" variant="outline" size="sm" className="catalog-dialog-done">{t("ui.close")}</Button></DialogClose><Button type="button" size="sm" className="catalog-selection-action" disabled={Boolean(problem) || cost < 1 || (!builderMode && available < cost)} onClick={() => transact(() => purchaseWerewolfAdvancement(character, purchase, context, builderMode), t("werewolf.purchaseRecorded"))}>{t("ui.purchaseFor")} {cost} {t("ui.xp")}</Button></DialogFooter>
    </DialogContent></Dialog>
    {feedback && <p className="experience-feedback compact">{feedback}</p>}{historyPanel}<RenownGrantsPanel character={character} catalogs={context} updateSheet={updateSheet}/>
  </section>;
}
