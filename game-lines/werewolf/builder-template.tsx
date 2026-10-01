"use client";

import { Choice } from "@/app/builder/common-controls";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/lib/i18n";
import { systemTerm } from "@/lib/system-terms";
import type { WerewolfReferenceCatalog, RenownId } from "./catalogs/reference";
import { creationGiftAllowance, creationMeritBudget, creationTemplateProblems, type WerewolfCreationChoices } from "./creation-rules";
import { AnchorField } from "./anchors";
import "./styles/builder.css";

/** Forsaken template choices stay line-owned; Core trait allocations remain untouched. */
export function WerewolfCreationTemplate({ value, onChange, skills, reference }: {
  value: WerewolfCreationChoices; onChange: (value: WerewolfCreationChoices) => void;
  skills: Record<string, number>; reference: WerewolfReferenceCatalog;
}) {
  const { locale, t } = useLanguage();
  const update = <K extends keyof WerewolfCreationChoices>(key: K, next: WerewolfCreationChoices[K]) => onChange({ ...value, [key]: next });
  const auspice = reference.auspices.find(item => item.id === value.auspice_id);
  const tribe = reference.tribes.find(item => item.id === value.tribe_id);
  const problems = creationTemplateProblems(value, reference, skills);
  const validRenown = auspice && tribe && !problems.includes("renownChoice");
  const grants = validRenown ? creationGiftAllowance(auspice, tribe, value.renown_choice as RenownId) : null;
  const budget = problems.includes("creationBudget") ? null : creationMeritBudget(value.primal_urge, value.extra_rite_dots);
  const names = (items: Array<{ id: string; name: string }>) => Object.fromEntries(items.map(item => [item.id,
    locale === "pt-BR" ? reference.presentation[item.id]?.name ?? item.name : item.name,
  ]));
  const renownNames = Object.fromEntries((["Cunning", "Glory", "Honor", "Purity", "Wisdom"] as const).map(name => [name, t(`werewolf.renownNames.${name}`)]));
  const chooseAuspice = (id: string) => {
    const selected = reference.auspices.find(item => item.id === id);
    onChange({ ...value, auspice_id: id, auspice_skill: selected?.skills.includes(value.auspice_skill) ? value.auspice_skill : "" });
  };
  return <div className="builder-section wtf-creation-template">
    <h2>{t("werewolf.forsakenTemplate")}</h2>
    <div className="form-grid">
      <Choice label={t("werewolf.auspice")} value={value.auspice_id} setValue={chooseAuspice} options={reference.auspices.map(item => item.id)} optionLabels={names(reference.auspices)} />
      <Choice label={t("werewolf.tribe")} value={value.tribe_id} setValue={id => update("tribe_id", id)} options={reference.tribes.map(item => item.id)} optionLabels={names(reference.tribes)} />
      <Choice label={t("werewolf.auspiceSkill")} value={value.auspice_skill} setValue={skill => update("auspice_skill", skill)} options={(auspice?.skills ?? []).filter(skill => Number(skills[skill] ?? 0) < 5)} optionLabels={Object.fromEntries((auspice?.skills ?? []).map(skill => [skill, systemTerm(skill, locale)]))} />
      <Choice label={t("werewolf.renownChoice")} value={value.renown_choice} setValue={name => update("renown_choice", name as RenownId)} options={Object.keys(renownNames)} optionLabels={renownNames} />
      <Choice label={t("werewolf.primalUrge")} value={String(value.primal_urge)} setValue={rating => update("primal_urge", Number(rating))} options={["1", "2", "3"]} />
      <Choice label={t("werewolf.extraRiteDots")} value={String(value.extra_rite_dots)} setValue={dots => update("extra_rite_dots", Number(dots))} options={["0", "1", "2", "3", "4", "5"]} />
    </div>
    <p>{t("werewolf.creationConversions")}</p>
    {budget !== null && <p>{t("werewolf.creationBudget", { merits: budget, rites: 2 + value.extra_rite_dots })}</p>}
    <div className="form-grid">
      <label>{t("werewolf.blood")}<AnchorField kind="blood" value={value.blood} onChange={id => update("blood", id)} reference={reference}/></label>
      <label>{t("werewolf.bone")}<AnchorField kind="bone" value={value.bone} onChange={id => update("bone", id)} reference={reference}/></label>
      <label>{t("werewolf.physicalTouchstone")}<Input value={value.physical_touchstone} onChange={event => update("physical_touchstone", event.target.value)}/></label>
      <label>{t("werewolf.spiritualTouchstone")}<Input value={value.spiritual_touchstone} onChange={event => update("spiritual_touchstone", event.target.value)}/></label>
    </div>
    {grants && <>
      <h3>{t("werewolf.renown")}</h3>
      <dl className="wtf-creation-renown">{Object.entries(grants.renown).map(([name, dots]) => <div key={name}><dt>{renownNames[name]}</dt><dd>{dots}</dd></div>)}</dl>
      <p>{t("werewolf.creationGiftGrants", { moon: grants.moonFacetCount, shadow: grants.shadowFacetCount, wolf: grants.wolfFacetCount })}</p>
    </>}
    {problems.length > 0 && <ul>{problems.map(problem => <li key={problem}>{t(`werewolf.creationProblem.${problem}`)}</li>)}</ul>}
  </div>;
}
