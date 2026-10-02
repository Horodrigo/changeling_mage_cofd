"use client";

import { useState } from "react";
import { CharacterBuilderShell, builderCurrentState, commonCreationIssues, experienceTraitDots, isCreationDraft, useCommonBuilderState } from "@/app/character-builder-shell";
import { Aspirations, CommonIdentityStep, TraitsStep } from "@/app/builder/common-controls";
import { MeritPicker } from "@/app/builder/merit-picker";
import { MeritConfigurationEditor } from "@/app/builder/merit-configuration-editor";
import { COMMON_MERIT_CONFIGURATIONS, isCommonInlineMeritConfiguration } from "@/app/builder/common-merit-configurations";
import { useHomebrewPreferences } from "@/app/use-homebrew";
import type { CharacterSheet, MeritSelection, Specialty } from "@/lib/core/character/character-types";
import { ATTRIBUTES, SKILLS } from "@/lib/core/character/creation-rules";
import type { GameLineBuilderModule, GameLineBuilderProps } from "@/lib/game-line-contracts/game-line-ui";
import { useLanguage } from "@/lib/i18n";
import { activeMeritCatalog } from "@/lib/merit-homebrews";
import { meritPrerequisitesMet, meritSelectionProblems, type MeritDefinition, type MeritPrerequisiteContext } from "@/lib/merits";
import { meritPresentation } from "@/lib/merit-presentation";
import { meritProblemMessage } from "@/lib/merit-ui";
import { createRandomId } from "@/lib/random-id";
import { systemTerm } from "@/lib/system-terms";
import type { WerewolfReferenceCatalog, RenownId } from "./catalogs/reference";
import type { WerewolfGiftCatalog } from "./catalogs/gifts";
import type { WerewolfRiteCatalog } from "./catalogs/rites";
import type { WerewolfFetishCatalog } from "./catalogs/fetishes";
import { FetishInventory } from "./fetishes";
import { fetishSelections, type FetishSelection } from "./fetish-rules";
import { TotemReference } from "./totem-reference";
import type { WerewolfTotemCatalog } from "./catalogs/totem";
import { WerewolfCreationTemplate } from "./builder-template";
import { creationAuspiceSkill, creationGiftSelection, creationMeritBudget, creationTemplateProblems, formTraits, type WerewolfCreationChoices } from "./creation-rules";
import { mergeWerewolfCreationMerits } from "./creation-grants";
import { WEREWOLF_CREATION_GRANT_SOURCES, withWerewolfCreationGrants, werewolfCreationMeritCost, werewolfMeritDefinition, resolveWerewolfMerits, withoutAuspiceSkillGrant } from "./creation-grants";
import { WerewolfMeritConfigurationEditor } from "./merit-configuration-editor";
import { werewolfMeritPrerequisitesMet, werewolfMeritSelectionProblems, WEREWOLF_MERIT_CONFIGURATION_IDS, type WerewolfMeritContext } from "./merit-rules";
import { creationChoices, recordedAuspiceSkillGrant, renownRatings, werewolfDerived, werewolfIds } from "./rules";
import { WerewolfExperiencePanel } from "./experience-panel";
import { giftProgressionProblems, synchronizeRenownFacets } from "./gift-progression";

const HISTORY_KEY = "werewolf_experience_history";
export function werewolfExperienceSpecialties(initial?: CharacterSheet | null): Specialty[] {
  const history = initial?.current_state[HISTORY_KEY];
  return Array.isArray(history) ? history.flatMap(entry => {
    const undo = entry && typeof entry === "object" ? entry.undo : undefined;
    return undo?.kind === "specialty" && typeof undo.skill === "string" && typeof undo.name === "string" ? [{ skill: undo.skill, name: undo.name }] : [];
  }) : [];
}

function purchasedTraits(values: Record<string, number>, source: CharacterSheet | null | undefined, group: "attributes" | "skills") {
  const result = { ...values };
  for (const [name, dots] of Object.entries(experienceTraitDots(source, group, HISTORY_KEY))) result[name] = Number(result[name] ?? 0) + dots;
  return result;
}

/** The owning Builder constructs its line_data; Core still owns only the outer schema. */
export function buildWerewolfCharacter({ source, identity, attributes, skills, specialties, aspirations, merits, choices, reference, gifts, rites, meritCatalog, fetishes, draft = false, step = 1, allowAdvancement = false }: {
  source?: CharacterSheet | null; identity: CharacterSheet["character"]; attributes: Record<string, number>; skills: Record<string, number>;
  specialties: Specialty[]; aspirations: string[]; merits: MeritSelection[]; choices: WerewolfCreationChoices;
  reference: WerewolfReferenceCatalog; gifts: WerewolfGiftCatalog; rites: WerewolfRiteCatalog; meritCatalog: readonly MeritDefinition[]; draft?: boolean; step?: number; allowAdvancement?: boolean;
  fetishes?: readonly FetishSelection[];
}): CharacterSheet {
  if (source && source.game_line !== "WtF") throw new Error("Werewolf builder received another game line.");
  const problems = creationTemplateProblems(choices, reference, skills, gifts.gifts, rites.rites);
  if (!draft && problems.length) throw new Error(`Invalid Werewolf creation choices: ${problems.join(", ")}.`);
  if (!draft && choices.rites.some(id => werewolfIds(source?.line_data.learned_rites).includes(id))) throw new Error("Creation Rites overlap Experience purchases.");
  const auspice = reference.auspices.find(item => item.id === choices.auspice_id);
  const tribe = reference.tribes.find(item => item.id === choices.tribe_id);
  const skillGranted = Boolean(auspice && !problems.includes("auspiceSkill"));
  const finalSkills = purchasedTraits(skillGranted ? creationAuspiceSkill(skills, auspice!, choices.auspice_skill) : skills, source, "skills");
  const grants = auspice && tribe && !problems.includes("renownChoice")
    ? creationGiftSelection(auspice, tribe, choices.renown_choice as RenownId, gifts.gifts, choices) : null;
  const experienceRenown = renownRatings(source?.line_data.experience_renown);
  const experiencePrimalUrge = Math.max(0, Number(source?.line_data.experience_primal_urge ?? 0));
  if (!draft && (choices.primal_urge + experiencePrimalUrge > 10 || Object.entries(experienceRenown).some(([id, dots]) => dots + (grants?.renown[id as RenownId] ?? 0) > 5)))
    throw new Error("Creation and Experience allocations exceed the Primal Urge or Renown maximum.");
  const now = new Date().toISOString();
  const completed: CharacterSheet = {
    id: source?.id ?? createRandomId(), schema_version: 2, system: "chronicles-of-darkness", game_line: "WtF",
    ruleset: { id: "wtf-2e-embedded", version: 1 }, character: { ...identity },
    attributes: purchasedTraits(attributes, source, "attributes"), skills: finalSkills,
    specializations: [...specialties.filter(item => item.skill && item.name.trim()).map(item => ({ skill: item.skill, name: item.name.trim() })),
      ...werewolfExperienceSpecialties(source), ...(source?.specializations ?? []).filter(item => item.grantedBy)],
    merits: mergeWerewolfCreationMerits(source?.merits ?? [], merits, meritCatalog),
    line_data: {
      ...(source?.line_data ?? {}), creation_choices: structuredClone(choices),
      auspice_id: choices.auspice_id, tribe_id: choices.tribe_id,
      auspice_skill_grant: skillGranted ? { skill: choices.auspice_skill, dots: 1 } : null,
      primal_urge: choices.primal_urge + experiencePrimalUrge, experience_primal_urge: experiencePrimalUrge,
      renown: Object.fromEntries(Object.entries(experienceRenown).map(([id, dots]) => [id, dots + (grants?.renown[id as RenownId] ?? 0)])),
      experience_renown: experienceRenown, harmony: source?.line_data.harmony ?? 7,
      blood: choices.blood, bone: choices.bone, physical_touchstone: choices.physical_touchstone.trim(), spiritual_touchstone: choices.spiritual_touchstone.trim(),
      aspirations: aspirations.map(value => value.trim()).slice(0, 3),
      creation_facets: [...(grants?.moonFacetIds ?? []), ...choices.shadow_facets, ...choices.wolf_facets],
      learned_facets: werewolfIds(source?.line_data.learned_facets), creation_rites: [...choices.rites], learned_rites: werewolfIds(source?.line_data.learned_rites),
      fetishes: fetishSelections(fetishes ?? source?.line_data.fetishes),
    },
    derived: {}, current_state: builderCurrentState(source, draft, step, allowAdvancement), created_at: source?.created_at ?? now, updated_at: now,
  };
  synchronizeRenownFacets(completed, reference, gifts);
  if (!draft && giftProgressionProblems(completed, reference, gifts).length) throw new Error("Creation choices invalidate existing Gift progression.");
  if (!draft && source?.line_data.auspice_id !== choices.auspice_id && Object.values(experienceRenown).some(dots => dots > 0))
    throw new Error("Refund Renown purchases before changing Auspice.");
  completed.derived = werewolfDerived(completed);
  return completed;
}

function WerewolfCharacterBuilder({ player, initial, onCancel, onSave, onSaveDraft, catalogs }: GameLineBuilderProps) {
  const { locale, t } = useLanguage();
  if (initial && initial.game_line !== "WtF") throw new Error("Werewolf builder received another game line.");
  if (!catalogs) throw new Error("Werewolf builder requires its catalog snapshot.");
  const reference = catalogs.get<WerewolfReferenceCatalog>("werewolf-reference");
  const gifts = catalogs.get<WerewolfGiftCatalog>("werewolf-gifts");
  const rites = catalogs.get<WerewolfRiteCatalog>("werewolf-rites");
  const fetishCatalog = catalogs.get<WerewolfFetishCatalog>("werewolf-fetishes");
  const totemCatalog = catalogs.get<WerewolfTotemCatalog>("werewolf-totem");
  const [fetishes, setFetishes] = useState(() => fetishSelections(initial?.line_data.fetishes));
  const preferences = useHomebrewPreferences();
  const meritCatalog = activeMeritCatalog([...catalogs.get<MeritDefinition[]>("core-merits"), ...catalogs.get<MeritDefinition[]>("werewolf-merits")], [], preferences, initial?.merits.map(item => item.name));
  const common = useCommonBuilderState(initial, player, { experienceHistoryKey: HISTORY_KEY, purchasedSpecialties: werewolfExperienceSpecialties(initial),
    adjustSkills: values => withoutAuspiceSkillGrant(values, recordedAuspiceSkillGrant(initial?.line_data.auspice_skill_grant)), grantedMeritSources: WEREWOLF_CREATION_GRANT_SOURCES });
  const [freeGrants] = useState(() => withWerewolfCreationGrants([], initial?.merits ?? [], meritCatalog));
  const merits = withWerewolfCreationGrants(common.merits, freeGrants, meritCatalog);
  const [choices, setChoices] = useState(() => {
    const value = creationChoices(initial?.line_data.creation_choices);
    if (initial) for (const key of ["blood", "bone", "physical_touchstone", "spiritual_touchstone"] as const)
      if (typeof initial.line_data[key] === "string") value[key] = initial.line_data[key];
    return value;
  });
  // The shell owns the advancement sheet; this line-owned selection context prevents duplicate creation allocations after returning from its XP step.
  const [advancementSource, setAdvancementSource] = useState(initial);
  const learnedRiteIds = werewolfIds(advancementSource?.line_data.learned_rites);
  const templateProblems = creationTemplateProblems(choices, reference, common.skills, gifts.gifts, rites.rites);
  const auspice = reference.auspices.find(item => item.id === choices.auspice_id), tribe = reference.tribes.find(item => item.id === choices.tribe_id);
  const finalSkills = purchasedTraits(auspice && !templateProblems.includes("auspiceSkill") ? creationAuspiceSkill(common.skills, auspice, choices.auspice_skill) : common.skills, advancementSource, "skills");
  const finalAttributes = purchasedTraits(common.attributes, advancementSource, "attributes");
  const allMerits = mergeWerewolfCreationMerits(advancementSource?.merits ?? [], merits, meritCatalog);
  const resolved = resolveWerewolfMerits(allMerits, meritCatalog);
  const hishu = formTraits({ attributes: finalAttributes, skills: finalSkills }, reference.forms.find(form => form.id === "hishu")!, 5, resolved, allMerits);
  const renown = auspice && tribe && !templateProblems.includes("renownChoice") ? creationGiftSelection(auspice, tribe, choices.renown_choice as RenownId, gifts.gifts, choices).renown : renownRatings(null);
  const experienceRenown = renownRatings(advancementSource?.line_data.experience_renown);
  for (const id of Object.keys(renown) as RenownId[]) renown[id] += experienceRenown[id];
  const context: MeritPrerequisiteContext = { gameLine: "WtF", archetypes: ["werewolf"], attributes: hishu.attributes, skills: finalSkills, size: hishu.size, merits: allMerits, meritCatalog };
  const ownContext: WerewolfMeritContext = { attributes: hishu.attributes, skills: finalSkills, harmony: Number(initial?.line_data.harmony ?? 7),
    primalUrge: choices.primal_urge + Number(advancementSource?.line_data.experience_primal_urge ?? 0), renown, tribeId: choices.tribe_id, auspice, forms: reference.forms, gifts: gifts.gifts, merits: resolved };
  const eligible = (definition: MeritDefinition, candidate: MeritPrerequisiteContext) => meritPrerequisitesMet(definition, candidate) &&
    werewolfMeritPrerequisitesMet(definition, { id: definition.id, dots: candidate.selectedDots ?? definition.ratings[0], configuration: candidate.configuration }, ownContext);
  const spent = werewolfCreationMeritCost(merits, meritCatalog);
  const budget = templateProblems.includes("creationBudget") ? 0 : creationMeritBudget(choices.primal_urge, choices.extra_rite_dots);
  const issues = commonCreationIssues(common, { attributes: t("ui.attributes"), skills: t("ui.skills"), attributePriorities: t("ui.attributePriorities"), skillPriorities: t("ui.skillPriorities"), categoryLabel: category => systemTerm(category, locale) });
  const add = (step: number, key: string, label: string) => issues.push({ step, key, label });
  if (!common.name.trim()) add(1, "name", t("ui.characterName"));
  for (const problem of templateProblems) add(3, problem, t(`werewolf.creationProblem.${problem}`));
  if (choices.rites.some(id => learnedRiteIds.includes(id))) add(3, "riteExperienceOverlap", t("werewolf.experienceProblem.riteKnown"));
  if (advancementSource && !templateProblems.length) {
    const preview = buildWerewolfCharacter({ source: advancementSource, identity: advancementSource.character, attributes: common.attributes, skills: common.skills, specialties: common.specialties,
      aspirations: common.aspirations, merits, choices, reference, gifts, rites, meritCatalog, draft: true });
    for (const problem of giftProgressionProblems(preview, reference, gifts)) add(3, "giftProgression", t(`werewolf.experienceProblem.${problem}`));
    if (advancementSource.line_data.auspice_id !== choices.auspice_id && Object.values(experienceRenown).some(dots => dots > 0)) add(3, "giftProgression", t("werewolf.experienceProblem.giftDependency"));
  }
  if (ownContext.primalUrge > 10 || Object.values(renown).some(dots => dots > 5)) add(3, "progressionMaximum", t("werewolf.progressionMaximum"));
  for (const [group, names, values, minimum] of [["attributes", Object.values(ATTRIBUTES).flat(), common.attributes, 1], ["skills", Object.values(SKILLS).flat(), common.skills, 0]] as const)
    if (names.some(name => !Number.isInteger(values[name]) || values[name] < minimum || values[name] > 5)) add(2, group, t("werewolf.creationTraitRange"));
  if (common.specialties.some(item => item.name.trim() && (!Object.values(SKILLS).flat().some(skill => skill === item.skill) || !(finalSkills[item.skill] >= 1))))
    add(2, "specialties", t("werewolf.creationSpecialties"));
  if (spent > budget) add(3, "merits", t("ui.meritsExceedTheLimit"));
  for (const selection of merits) {
    const definition = werewolfMeritDefinition(selection, meritCatalog);
    if (!definition) { add(3, "merits", t("werewolf.missingMerit", { name: selection.name })); continue; }
    const choice = { id: definition.id, instanceId: selection.instanceId, dots: selection.dots + Number(advancementSource?.merits.find(item => item.instanceId === selection.instanceId)?.experienceDots ?? 0), configuration: selection.configuration };
    const messages = [...meritSelectionProblems(definition, choice, context), ...(definition.line === "WtF" ? werewolfMeritSelectionProblems(definition, choice, ownContext) : [])];
    if (!werewolfMeritPrerequisitesMet(definition, choice, ownContext)) messages.push({ key: "ui.meritPrerequisitesNotMet", params: { prerequisites: definition.prerequisites ?? definition.name } });
    for (const message of messages) add(3, "merits", `${meritPresentation(definition, locale).name}: ${meritProblemMessage(message, definition, locale)}`);
  }
  const missing = (key: string) => issues.some(issue => issue.key === key);
  const buildCharacter = (source: CharacterSheet | null | undefined, draft: boolean) => buildWerewolfCharacter({ source, identity: { name: common.name.trim(), concept: common.concept.trim(), player: common.playerName.trim(), chronicle: common.chronicle.trim() },
    attributes: common.attributes, skills: common.skills, specialties: common.specialties, aspirations: common.aspirations, merits, choices, reference, gifts, rites, meritCatalog, fetishes, draft, step: common.step, allowAdvancement: common.allowAdvancement });
  const finish = (draft: boolean, advancement?: CharacterSheet) => {
    if (!draft && issues.length) { common.setError(`${t("ui.stillRequired")}: ${issues.map(issue => issue.label).join(", ")}.`); common.setStep(issues[0].step); return false; }
    const sheet = buildCharacter(advancement ?? initial, draft);
    (draft ? onSaveDraft : onSave)(sheet);
    return true;
  };
  return <CharacterBuilderShell line="WtF" state={common} templateLabel={t("werewolf.forsakenTemplate")} issues={issues} draft={!initial || isCreationDraft(initial)} onCancel={onCancel} onFinish={finish}
    prepareAdvancement={previous => buildCharacter(previous ?? initial, false)}
    renderAdvancement={(sheet, updateSheet) => <WerewolfExperiencePanel character={sheet} updateSheet={next => { setAdvancementSource(next); updateSheet(next); }} catalogs={catalogs} builderMode/>}
    identity={<CommonIdentityStep name={common.name} setName={common.setName} nameLabel={t("ui.characterName")} concept={common.concept} setConcept={common.setConcept} player={common.playerName} setPlayer={common.setPlayerName} chronicle={common.chronicle} setChronicle={common.setChronicle} missing={missing}/>}
    traits={<TraitsStep attributes={common.attributes} setAttributes={common.setAttributes} skills={common.skills} setSkills={common.setSkills} attributePriority={common.attributePriority} setAttributePriority={common.setAttributePriority} skillPriority={common.skillPriority} setSkillPriority={common.setSkillPriority} specialties={common.specialties} setSpecialties={common.setSpecialties} missing={missing}/>}
    lineTemplate={<><WerewolfCreationTemplate value={choices} onChange={setChoices} skills={common.skills} reference={reference} gifts={gifts} rites={rites} learnedRiteIds={learnedRiteIds}/>
      <div className="builder-section"><Aspirations values={common.aspirations} setValues={common.setAspirations}/><p>{t("werewolf.freeCreationMerits")}</p>
        <MeritPicker merits={merits} setMerits={common.setMerits} catalog={meritCatalog} context={context} spent={spent} budget={budget} isEligible={eligible} isInlineConfiguration={isCommonInlineMeritConfiguration}
          renderConfiguration={({ merit, ownedMerits, inline, onChange }) => {
            const definition = werewolfMeritDefinition(merit, meritCatalog);
            if (merit.grantedBy === "werewolf:first-tongue") return <p>{t("werewolf.firstTongueGrant")}</p>;
            return definition && WEREWOLF_MERIT_CONFIGURATION_IDS.has(definition.id)
              ? <WerewolfMeritConfigurationEditor merit={{ ...merit, id: definition.id }} context={ownContext} onChange={onChange} giftPresentation={gifts.presentation}/>
              : <MeritConfigurationEditor merit={merit} onChange={onChange} catalog={meritCatalog} ownedMerits={ownedMerits} inline={inline} definitions={COMMON_MERIT_CONFIGURATIONS}/>;
          }}/>
      </div><div className="builder-section"><FetishInventory value={fetishes} onChange={setFetishes} catalog={fetishCatalog} gifts={gifts}/></div>
      <div className="builder-section"><TotemReference catalog={totemCatalog}/></div></>}/>;
}

export const werewolfBuilder: GameLineBuilderModule = { Component: WerewolfCharacterBuilder };
