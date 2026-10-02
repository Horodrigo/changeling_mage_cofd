"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { RuleSelect } from "@/app/workspace/rule-select";
import { MeritConfigurationEditor } from "@/app/builder/merit-configuration-editor";
import { COMMON_MERIT_CONFIGURATIONS } from "@/app/builder/common-merit-configurations";
import { ATTRIBUTES, SKILLS } from "@/lib/core/character/creation-rules";
import type { CharacterSheet } from "@/lib/core/character/character-types";
import { useLanguage, translate, type Locale } from "@/lib/i18n";
import { systemTerm } from "@/lib/system-terms";
import { meritPresentation } from "@/lib/merit-presentation";
import { meritRatingsFor } from "@/lib/merits";
import { createRandomId } from "@/lib/random-id";
import { resolveTotemAdvantage, totemBenefitCost, type TotemBenefitCatalogs } from "./totem-benefits";
import { totemAdvantage, type TotemBenefit, type TotemBenefitChoice, type TotemSelection } from "./totem-rules";
import { werewolfAdvancementContexts } from "./experience-rules";
import { WerewolfMeritConfigurationEditor } from "./merit-configuration-editor";
import { WEREWOLF_MERIT_CONFIGURATION_IDS } from "./merit-rules";

const initialChoice = (kind: TotemBenefitChoice["kind"]): TotemBenefitChoice => kind === "merit" ? { kind, definitionId: "__choose", dots: 1, configuration: {} }
  : kind === "specialty" ? { kind, skill: "Academics", name: "" } : { kind, target: kind === "attribute" ? "Intelligence" : "Academics" };

export function totemBenefitLabel(choice: TotemBenefitChoice, catalogs: TotemBenefitCatalogs, locale: Locale) {
  if (choice.kind === "specialty") return `${systemTerm(choice.skill, locale)}: ${choice.name}`;
  if (choice.kind === "merit") {
    const definition = catalogs.merits.find(item => item.id === choice.definitionId);
    return `${definition ? meritPresentation(definition, locale).name : choice.definitionId} ${choice.dots}`;
  }
  return translate(locale, "werewolf.totemTraitBenefit", { name: systemTerm(choice.target, locale) });
}

function BenefitRules({ choice, catalogs }: { choice: TotemBenefitChoice; catalogs: TotemBenefitCatalogs }) {
  const { locale, t } = useLanguage();
  if (choice.kind !== "merit") return null;
  const definition = catalogs.merits.find(item => item.id === choice.definitionId);
  if (!definition) return <p className="wtf-rule-field">{t("werewolf.missingMerit", { name: choice.definitionId })}</p>;
  const text = meritPresentation(definition, locale);
  return <div className="wtf-benefit-reference"><p className="wtf-rule-field">{text.description}</p>
    {text.prerequisites && <p className="wtf-rule-field"><strong>{t("ui.prerequisites")}:</strong>{" "}{text.prerequisites}</p>}
    {text.levels?.filter(level => level.rating <= choice.dots).map((level, index) => <p className="wtf-rule-field" key={index}><strong>{level.rating} · {level.name}:</strong>{" "}{level.description}</p>)}
    <small>{t("conditions.sourcePage", { source: definition.source, page: definition.page })}</small>
  </div>;
}

function BenefitChoiceEditor({ choice, onChange, character, catalogs }: {
  choice: TotemBenefitChoice; onChange: (choice: TotemBenefitChoice) => void; character: CharacterSheet; catalogs: TotemBenefitCatalogs;
}) {
  const { locale, t } = useLanguage(), [search, setSearch] = useState("");
  const types = { attribute: "ui.attribute", skill: "ui.skill", specialty: "ui.specialty", merit: "ui.merit" } as const;
  const traitSelect = (kind: "attribute" | "skill", value: string, set: (value: string) => void) => <RuleSelect value={value} onChange={set}
    options={Object.values(kind === "attribute" ? ATTRIBUTES : SKILLS).flat().map(name => ({ value: name, label: systemTerm(name, locale), localized: true }))}/>;
  const definition = choice.kind === "merit" ? catalogs.merits.find(item => item.id === choice.definitionId) : undefined;
  const matches = catalogs.merits.filter(item => meritPresentation(item, locale).name.toLocaleLowerCase(locale).includes(search.trim().toLocaleLowerCase(locale))).sort((a, b) => meritPresentation(a, locale).name.localeCompare(meritPresentation(b, locale).name, locale));
  const contexts = werewolfAdvancementContexts(character, catalogs);
  return <div className="wtf-totem-editor-grid">
    <label>{t("ui.type")}<RuleSelect value={choice.kind} onChange={kind => onChange(initialChoice(kind as TotemBenefitChoice["kind"]))}
      options={Object.entries(types).map(([value, key]) => ({ value, label: t(key), localized: true }))}/></label>
    {(choice.kind === "attribute" || choice.kind === "skill") && <label>{t("werewolf.totemImprovementTarget")}{traitSelect(choice.kind, choice.target, target => onChange({ ...choice, target }))}</label>}
    {choice.kind === "specialty" && <><label>{t("ui.skill")}{traitSelect("skill", choice.skill, skill => onChange({ ...choice, skill }))}</label>
      <label>{t("ui.specialty")}<Input value={choice.name} onChange={event => onChange({ ...choice, name: event.target.value })}/></label></>}
    {choice.kind === "merit" && <>
      <label>{t("ui.search")}<Input value={search} onChange={event => setSearch(event.target.value)}/></label>
      <label>{t("ui.merit")}<RuleSelect value={choice.definitionId} onChange={definitionId => { const next = catalogs.merits.find(item => item.id === definitionId); onChange({ kind: "merit", definitionId, dots: next?.ratings[0] ?? 1, configuration: {} }); }}
        options={[{ value: "__choose", label: t("ui.selectAnOption"), localized: true }, ...(!definition && choice.definitionId !== "__choose" ? [{ value: choice.definitionId, label: t("werewolf.missingMerit", { name: choice.definitionId }), localized: true }] : []), ...(definition && !matches.includes(definition) ? [definition] : []), ...matches].map(item => "id" in item ? { value: item.id, label: meritPresentation(item, locale).name, localized: true } : item)}/></label>
      {definition && <><label>{t("werewolf.fetishDots")}<RuleSelect value={String(choice.dots)} onChange={dots => onChange({ ...choice, dots: Number(dots) })}
        options={meritRatingsFor(definition, 10).map(dots => ({ value: String(dots), label: String(dots), localized: true }))}/></label>
        <div>{WEREWOLF_MERIT_CONFIGURATION_IDS.has(definition.id)
          ? <WerewolfMeritConfigurationEditor merit={{ id: definition.id, dots: choice.dots, configuration: choice.configuration }} context={contexts.own} onChange={configuration => onChange({ ...choice, configuration })} giftPresentation={catalogs.gifts.presentation}/>
          : <MeritConfigurationEditor merit={{ name: definition.name, dots: choice.dots, configuration: choice.configuration }} catalog={[...catalogs.merits]} ownedMerits={contexts.core.merits} definitions={COMMON_MERIT_CONFIGURATIONS} inline onChange={configuration => onChange({ ...choice, configuration })}/>}</div>
        <BenefitRules choice={choice} catalogs={catalogs}/>
      </>}
    </>}
  </div>;
}

/** One character's local choices and equivalent-value alternatives, never a Pack record or XP purchase. */
export function TotemAdvantageEditor({ character, value, onChange, catalogs }: {
  character: CharacterSheet; value: TotemSelection; onChange: (value: TotemSelection) => void; catalogs: TotemBenefitCatalogs;
}) {
  const { locale, t } = useLanguage(), [open, setOpen] = useState(false), [draft, setDraft] = useState<TotemBenefit>(() => ({ id: createRandomId(), choice: initialChoice("attribute") }));
  const selection = totemAdvantage(value.advantage), result = resolveTotemAdvantage(character, value, catalogs);
  const change = (selections: TotemBenefit[]) => onChange({ ...value, advantage: { ...selection, selections } });
  const candidate = { ...value, advantage: { ...selection, selections: selection.selections.some(item => item.id === draft.id) ? selection.selections.map(item => item.id === draft.id ? draft : item) : [...selection.selections, draft] } };
  const preview = resolveTotemAdvantage(character, candidate, catalogs), problems = preview.issues.filter(issue => issue.id === draft.id || issue.id === null);
  const dependentEdit = preview.issues.some(issue => issue.id !== null && issue.id !== draft.id && !result.issues.some(old => old.id === issue.id && old.problem === issue.problem));
  const start = (entry?: TotemBenefit) => { setDraft(entry ? structuredClone(entry) : { id: createRandomId(), choice: initialChoice("attribute") }); setOpen(true); };
  return <details className="wtf-rule-disclosure"><summary>{t("werewolf.totemAdvantage")}</summary>
    <p className="wtf-rule-field">{t("werewolf.totemBenefitNote")}</p>
    <p className="wtf-rule-field">{t("werewolf.totemBenefitBudget", { spent: result.spent, budget: result.budget, remaining: result.remaining })}</p>
    <label>{t("werewolf.totemPatronage")}<RuleSelect value={selection.active ? "active" : "inactive"} onChange={status => onChange({ ...value, advantage: { ...selection, active: status === "active" } })}
      options={[{ value: "active", label: t("werewolf.totemBenefitsActive"), localized: true }, { value: "inactive", label: t("werewolf.totemBenefitsInactive"), localized: true }]}/></label>
    {result.issues.filter(issue => issue.id === null).map(issue => <p className="wtf-rule-field" key={issue.problem}>{t(`werewolf.totemBenefitProblem.${issue.problem}`)}</p>)}
    <Button type="button" size="sm" variant="outline" onClick={() => start()}>{t("werewolf.totemAddBenefit")}</Button>
    {selection.selections.map(entry => {
      const resolved = result.resolved.find(item => item.id === entry.id);
      const without = resolveTotemAdvantage(character, { ...value, advantage: { ...selection, selections: selection.selections.filter(item => item.id !== entry.id) } }, catalogs);
      const dependent = without.issues.some(issue => !result.issues.some(old => old.id === issue.id && old.problem === issue.problem));
      return <details className="wtf-rule-disclosure" key={entry.id}><summary>{totemBenefitLabel(entry.choice, catalogs, locale)} · {totemBenefitCost(entry.choice, catalogs.reference)} {t("ui.experience")}</summary>
        {entry.replacement && <p className="wtf-rule-field"><strong>{t("werewolf.totemIndividualAlternative")}:</strong>{" "}{totemBenefitLabel(entry.replacement.choice, catalogs, locale)} · {entry.replacement.reason}</p>}
        {resolved?.automaticExpertise && <p className="wtf-rule-field">{t("werewolf.totemAutomaticExpertise")}</p>}
        <BenefitRules choice={entry.choice} catalogs={catalogs}/>
        {resolved && (entry.replacement || resolved.automaticExpertise) && <BenefitRules choice={resolved.choice} catalogs={catalogs}/>}
        {result.issues.filter(issue => issue.id === entry.id).map(issue => <p className="wtf-rule-field" key={issue.problem}>{t(`werewolf.totemBenefitProblem.${issue.problem}`)}</p>)}
        <Button type="button" size="sm" variant="outline" onClick={() => start(entry)}>{t("ui.editAction")}</Button>{" "}
        <Button type="button" size="sm" variant="outline" disabled={dependent} onClick={() => change(selection.selections.filter(item => item.id !== entry.id))}>{t("common.remove")}</Button>
        {dependent && <p className="wtf-rule-field">{t("werewolf.totemBenefitDependent")}</p>}
      </details>;
    })}
    <Dialog open={open} onOpenChange={setOpen}><DialogContent className="wtf-catalog-dialog"><DialogHeader><DialogTitle>{t("werewolf.totemAddBenefit")}</DialogTitle><DialogDescription>{t("werewolf.totemBenefitNote")}</DialogDescription></DialogHeader>
      <BenefitChoiceEditor key={`${draft.id}:original`} choice={draft.choice} onChange={choice => setDraft({ ...draft, choice })} character={character} catalogs={catalogs}/>
      <label>{t("werewolf.totemIndividualAlternative")}<RuleSelect value={draft.replacement ? "replacement" : "original"} onChange={status => setDraft({ ...draft, replacement: status === "replacement" ? { choice: initialChoice("specialty"), reason: "" } : undefined })}
        options={[{ value: "original", label: t("werewolf.totemOriginalBenefit"), localized: true }, { value: "replacement", label: t("werewolf.totemIndividualAlternative"), localized: true }]}/></label>
      {draft.replacement && <><BenefitChoiceEditor key={`${draft.id}:replacement`} choice={draft.replacement.choice} onChange={choice => setDraft({ ...draft, replacement: { ...draft.replacement!, choice } })} character={character} catalogs={catalogs}/>
        <label>{t("werewolf.totemAlternativeReason")}<Input value={draft.replacement.reason} onChange={event => setDraft({ ...draft, replacement: { ...draft.replacement!, reason: event.target.value } })}/></label></>}
      <p className="wtf-rule-field"><strong>{t("ui.cost")}:</strong>{" "}{totemBenefitCost(draft.choice, catalogs.reference)} {t("ui.experience")}</p>
      {problems.map(issue => <p className="wtf-rule-field" key={issue.problem}>{t(`werewolf.totemBenefitProblem.${issue.problem}`)}</p>)}
      {dependentEdit && <p className="wtf-rule-field">{t("werewolf.totemBenefitDependent")}</p>}
      <DialogFooter><DialogClose asChild><Button type="button" size="sm" variant="outline">{t("common.close")}</Button></DialogClose>
        <Button type="button" size="sm" variant="outline" disabled={problems.length > 0 || dependentEdit} onClick={() => { onChange(candidate); setOpen(false); }}>{t("common.save")}</Button>
      </DialogFooter>
    </DialogContent></Dialog>
  </details>;
}
