"use client";
import { meritProblemMessage } from "@/lib/merit-ui";
import { meritPresentation } from "@/lib/merit-presentation";

import { useEffect, useState } from "react";
import {
  CharacterBuilderShell,
  builderCurrentState,
  commonCreationIssues,
  experienceTraitDots,
  isCreationDraft,
  useCommonBuilderState,
  type BuilderValidationIssue,
} from "@/app/character-builder-shell";
import { CommonIdentityStep, TraitsStep } from "@/app/builder/common-controls";
import { ChangelingBuilderView, type ContractSelection, type CustomCourtDefinition } from "./builder-view";
import { MobileChangelingBuilderTemplate } from "./mobile-builder-template";
import {
  canonicalChangelingAnchorName,
  normalizeChangelingFrailties,
} from "./creation-rules";
import { canSelectContract } from "./builder-eligibility";
import type { CharacterSheet } from "@/lib/core/character/character-types";
import type { GameLineBuilderModule, GameLineBuilderProps } from "@/lib/game-line-contracts/game-line-ui";
import { useLanguage } from "@/lib/i18n";
import { canonicalRegalia, changelingFavoredRegalia } from "@/lib/changeling-regalia";
import type { KithDefinition } from "@/lib/changeling-kiths";
import { kithCreationChoice } from "./kith-choices";
import type { ContractDefinition } from "./contract-types";
import { contractWithSupplementalBenefits } from "./contract-presentation";
import { meritSelectionProblems, type MeritDefinition } from "@/lib/merits";
import { changelingMeritPrerequisitesMet, type ChangelingMeritContext } from "./merit-context";
import { commonMeritSpecializations } from "@/lib/core/character/synchronize-merit-grants";
import { mergeCreationMerits } from "@/lib/merit-progression";
import { normalizeMeritConfiguration } from "@/lib/core/character/merit-configuration";
import { changelingBuilderPowerProgression } from "./builder-power-progression";
import { createRandomId } from "@/lib/random-id";
import { entitlementCatalogPresentation } from "@/game-lines/changeling/entitlements";
import { useHomebrewPreferences } from "@/app/use-homebrew";
import { homebrewContentActive } from "@/lib/homebrew";
import { ExperiencePanel } from "./experience-panel";
import type { TokenDefinition } from "./catalogs/tokens";
import { withTokenPresentation } from "./token-presentation";
import { mergeContractHomebrews } from "./contract-homebrews";
import { useContractHomebrews } from "./use-contract-homebrews";
import { useMeritHomebrews } from "@/app/use-merit-homebrews";
import { activeMeritCatalog } from "@/lib/merit-homebrews";
import { mergeChangelingReference, mergeChangelingSeemings } from "./catalog-homebrews";
import { useChangelingCatalogHomebrews } from "./use-catalog-homebrews";
import type { ChangelingReference } from "./catalogs/reference";
import { recoverChangelingMeritAllocations } from "./merit-allocation";
import { reconcileChangelingCreationMerits } from "./builder-merit-grants";
import { changelingMeritId } from "./merit-identities";
import { resolveMeritDefinition } from "@/lib/merit-identity";

const translateRegalia = (value: string) => value;

function translateCourt(value: string) {
  return ({ Courtless: "Sem Corte", Spring: "spring", Primavera: "spring", Summer: "summer", Verão: "summer", Autumn: "autumn", Outono: "autumn", Winter: "winter", Inverno: "winter" } as Record<string, string>)[value] ?? value;
}

function normalizeCustomCourt(value: unknown): CustomCourtDefinition | null {
  if (!value || typeof value !== "object") return null;
  const item = value as Record<string, unknown>;
  const mantleBenefits = Array.isArray(item.mantleBenefits) ? item.mantleBenefits.map(String).slice(0, 5) : [];
  while (mantleBenefits.length < 5) mantleBenefits.push("");
  return { name: String(item.name ?? ""), emotion: String(item.emotion ?? ""), mantleBenefits };
}

function emptyContract(type: "Comum" | "Real"): ContractSelection {
  return { id: "", name: "", originalName: "", type, regalia: "", description: "", dicePool: "", sourceId: "", source: "", page: 0 };
}

function readContracts(initial: CharacterSheet | null | undefined, catalog: readonly ContractDefinition[]) {
  const saved = Array.isArray(initial?.line_data.contracts)
    ? initial.line_data.contracts as Array<Record<string, unknown>>
    : [];
  return Array.from({ length: 6 }, (_, index) => {
    const raw = saved[index];
    if (!raw) return emptyContract(index < 4 ? "Comum" : "Real");
    const found = catalog.find((item) => item.id === String(raw.id ?? "") || item.name === String(raw.name ?? "") || item.originalName === String(raw.name ?? ""));
    return found ? { ...found } : { ...emptyContract(index < 4 ? "Comum" : "Real"), name: String(raw.name ?? ""), originalName: String(raw.name ?? ""), regalia: translateRegalia(String(raw.regalia ?? "")) };
  });
}

function findKith(catalog: readonly KithDefinition[], value: string) {
  return catalog.find((item) => item.id === value || item.name === value);
}

function ChangelingCharacterBuilder({ player, initial: storedInitial, onCancel, onSave, onSaveDraft, catalogs }: GameLineBuilderProps) {
  const { locale, t } = useLanguage();
  const initial = storedInitial ? { ...storedInitial, merits: recoverChangelingMeritAllocations(storedInitial) } : storedInitial;
  if (initial && initial.game_line !== "CtL") throw new Error("Changeling builder received a non-Changeling character.");
  if (!catalogs) throw new Error("Changeling builder requires its catalog snapshot.");
  const common = useCommonBuilderState(initial, player, {
    experienceHistoryKey: "experience_history",
    grantedMeritSources: ["Corte"],
    adjustAttributes: (values) => {
      const bonus = String(initial?.line_data.favored_attribute ?? "");
      if (bonus && values[bonus] > 1) values[bonus] -= 1;
      return values;
    },
  });
  const homebrewPreferences = useHomebrewPreferences();
  const customCatalog = useChangelingCatalogHomebrews();
  const reference = mergeChangelingReference(catalogs.get<ChangelingReference>("changeling-reference"), customCatalog);
  const seemingCatalog = mergeChangelingSeemings(customCatalog);
  const tokens = catalogs.get<readonly TokenDefinition[]>("changeling-tokens");
  const tokenCatalog = withTokenPresentation(tokens, reference.tokenPresentation);
  const entitlementCatalog = entitlementCatalogPresentation(reference.entitlements, locale, reference.entitlementPresentation);
  const customContracts = useContractHomebrews();
  const customMerits = useMeritHomebrews("CtL", true);
  const initialContractIds = new Set((Array.isArray(initial?.line_data.contracts) ? initial.line_data.contracts : []).map((item) => String((item as Record<string, unknown>).id ?? "")));
  const contractCatalog = mergeContractHomebrews(catalogs.get<readonly ContractDefinition[]>("changeling-contracts"), customContracts)
    .filter((item) => initialContractIds.has(item.id) || homebrewContentActive(homebrewPreferences, item.id, item.sourceId))
    .map((item) => contractWithSupplementalBenefits(item, homebrewPreferences.disabledIds.includes("h-seemings") ? [] : ["h-seemings"]));
  const meritCatalog = activeMeritCatalog([
    ...catalogs.get<readonly MeritDefinition[]>("core-merits"),
    ...catalogs.get<readonly MeritDefinition[]>("changeling-merits"),
  ], customMerits, homebrewPreferences, [...(initial?.merits ?? []), ...common.merits])
    .sort((left, right) => left.translatedName.localeCompare(right.translatedName, "pt-BR"));

  const [seeming, setSeeming] = useState(String(initial?.line_data.seeming ?? ""));
  const [kith, setKith] = useState(String(initial?.line_data.kith ?? ""));
  const [kithChoice, setKithChoice] = useState(String(initial?.line_data.kith_choice ?? ""));
  const [customKithSkill, setCustomKithSkill] = useState(String(initial?.line_data.kith_skill ?? ""));
  const [customKithDescription, setCustomKithDescription] = useState(String(initial?.line_data.kith_description ?? ""));
  const [customKith, setCustomKith] = useState(Boolean(initial?.line_data.kith_custom));
  const [court, setCourt] = useState(translateCourt(String(initial?.line_data.court ?? "")));
  const [customCourt, setCustomCourt] = useState<CustomCourtDefinition | null>(() => normalizeCustomCourt(initial?.line_data.custom_court));
  const [needle, setNeedle] = useState(canonicalChangelingAnchorName("needle", initial?.line_data.needle));
  const [thread, setThread] = useState(canonicalChangelingAnchorName("thread", initial?.line_data.thread));
  const [touchstone, setTouchstone] = useState(String(initial?.line_data.touchstone ?? ""));
  const wyrdProgression = changelingBuilderPowerProgression(initial);
  const [wyrd, setWyrd] = useState(wyrdProgression.creation);
  const [selectedSecondRegalia, setSecondRegalia] = useState(canonicalRegalia(initial?.line_data.second_regalia));
  const automaticRegalia = changelingFavoredRegalia({ primary_regalia: seemingCatalog[seeming]?.regalia, kith, kith_custom: customKith });
  const secondRegalia = automaticRegalia.includes(selectedSecondRegalia) ? "" : selectedSecondRegalia;
  if (selectedSecondRegalia && !secondRegalia) setSecondRegalia("");
  const [favoredAttribute, setFavoredAttribute] = useState(String(initial?.line_data.favored_attribute ?? ""));
  const [contracts, setContracts] = useState<ContractSelection[]>(() => readContracts(initial, contractCatalog));
  const courtCatalog = reference.courts.filter((item) => [item.id, item.name, item.translatedName].includes(court) || homebrewContentActive(homebrewPreferences, item.id, item.sourceId));
  const kithCatalog = reference.kiths.filter((item) => [item.id, item.name, item.translatedName].includes(kith) || homebrewContentActive(homebrewPreferences, item.id, item.sourceId));
  const setMerits = common.setMerits;

  useEffect(() => {
    setMerits((current) => {
      const next = reconcileChangelingCreationMerits(current, court);
      return JSON.stringify(next) === JSON.stringify(current) ? current : next;
    });
  }, [court, setMerits]);

  const meritSpent = common.merits.reduce((sum, item) => sum + Math.max(0, item.dots - (item.grantedBy ? 1 : 0)), 0);
  const meritBudget = Math.max(0, 10 - (wyrd - 1) * 5);
  const maximumPowerFromMerits = Math.max(1, Math.min(3, 1 + Math.floor(Math.max(0, 10 - meritSpent) / 5)));
  useEffect(() => {
    if (wyrd <= maximumPowerFromMerits) return;
    const timer = window.setTimeout(() => setWyrd(maximumPowerFromMerits), 0);
    return () => window.clearTimeout(timer);
  }, [wyrd, maximumPowerFromMerits]);

  const meritContext: ChangelingMeritContext = {
    gameLine: "CtL", archetypes: ["changeling"], attributes: common.attributes, skills: common.skills,
    seeming, kith, wyrd, court,
    mantle: court && !["sem corte", "courtless"].includes(court.toLowerCase()) ? Math.max(1, mergeCreationMerits(initial?.merits, common.merits, common.meritWasRemoved).find(item => changelingMeritId(item) === "ctl-2ed:mantle" && item.grantedBy === "Corte")?.dots ?? 1) : 0,
    merits: mergeCreationMerits(initial?.merits, common.merits, common.meritWasRemoved),
    specializations: commonMeritSpecializations(common.specializations, mergeCreationMerits(initial?.merits, common.merits, common.meritWasRemoved)),
    meritCatalog,
    powers: contracts.map((item) => item.originalName || item.name).filter(Boolean),
  };
  const issues = (() => {
    const result: BuilderValidationIssue[] = commonCreationIssues(common, {
      attributeAllocation: t("ui.attributeAllocation"), skillAllocation: t("ui.skillAllocation"),
    });
    const add = (step: number, key: string, label: string) => result.push({ step, key, label });
    if (!common.name.trim()) add(1, "name", t("ui.characterName"));
    for (const merit of common.merits) {
      const definition = resolveMeritDefinition(merit, meritCatalog);
      if (definition) for (const message of meritSelectionProblems(definition, merit, meritContext, changelingMeritPrerequisitesMet)) add(3, "merits", `${meritPresentation(definition, locale).name}: ${meritProblemMessage(message, definition, locale)}`);
    }
    if (meritSpent > meritBudget) add(3, "merits", t("ui.meritsExceedTheLimit"));
    for (const [key, value, label] of [
      ["seeming", seeming, t("ui.seeming")], ["kith", kith, t("ui.kith")], ["needle", needle, t("ui.needle")],
      ["thread", thread, t("ui.thread")], ["favoredAttribute", favoredAttribute, t("ui.favoredAttribute")], ["secondRegalia", secondRegalia, t("ui.secondRegalia")],
    ]) if (!value) add(3, key, label);
    const selectedKith = findKith(kithCatalog, kith);
    if (customKith && (!customKithSkill || !customKithDescription.trim())) add(3, "kith", t("ui.completeCustomKith"));
    if (!customKith && kithCreationChoice(selectedKith?.id) && !kithChoice.trim()) add(3, "kith-choice", t("ui.kithBlessingChoice"));
    const favoredRegalia = changelingFavoredRegalia({ primary_regalia: seemingCatalog[seeming]?.regalia, second_regalia: secondRegalia, kith, kith_custom: customKith });
    if (
      contracts.slice(0, 4).filter((item) => item.name && item.type === "Comum" && canSelectContract(item, favoredRegalia, court, reference.courts, meritContext.merits)).length !== 4 ||
      contracts.slice(4, 6).filter((item) => item.name && item.type === "Real" && canSelectContract(item, favoredRegalia, court, reference.courts, meritContext.merits)).length !== 2
    ) add(3, "contracts", t("ui.fourCommonContractsAndTwoRoyalContractsAllowed"));
    return result;
  })();
  const missing = (key: string) => issues.some((issue) => issue.key === key);

  const buildCharacter = (source: CharacterSheet | null | undefined, draft: boolean) => {
    const sourceProgression = changelingBuilderPowerProgression(source);
    const finalAttributes = { ...common.attributes };
    if (favoredAttribute) finalAttributes[favoredAttribute] = Math.min(5, (common.attributes[favoredAttribute] ?? 1) + 1);
    const finalSkills = { ...common.skills };
    for (const [name, dots] of Object.entries(experienceTraitDots(source, "attributes", "experience_history"))) finalAttributes[name] = Number(finalAttributes[name] ?? 1) + dots;
    for (const [name, dots] of Object.entries(experienceTraitDots(source, "skills", "experience_history"))) finalSkills[name] = Number(finalSkills[name] ?? 0) + dots;
    const selectedKith = findKith(kithCatalog, kith);
    const now = new Date().toISOString();
    const completed: CharacterSheet = {
      id: source?.id ?? createRandomId(), schema_version: 2, system: "chronicles-of-darkness", game_line: "CtL",
      ruleset: { id: "ctl-2ed-embedded", version: 1 },
      character: { name: common.name.trim(), concept: common.concept.trim(), player: common.playerName.trim(), chronicle: common.chronicle.trim() },
      attributes: finalAttributes, skills: finalSkills,
      specializations: [
        ...common.specialties.filter((item) => item.skill && item.name.trim()).map((item) => ({ skill: item.skill, name: item.name.trim() })),
        ...(source?.specializations ?? []).filter((item) => Boolean(item.grantedBy)),
      ],
      merits: mergeCreationMerits(source?.merits, common.merits.map((item) => {
        const definition = resolveMeritDefinition(item, meritCatalog);
        return { ...item, configuration: normalizeMeritConfiguration(item.configuration), definitionId: definition?.id ?? item.definitionId,
          sourceId: definition?.sourceId ?? item.sourceId, source: definition?.source ?? item.source };
      }), common.meritWasRemoved),
      line_data: {
        ...(source?.line_data ?? {}), seeming, kith, kith_choice: customKith ? "" : kithChoice,
        court: court || "Sem Corte", needle, thread, touchstone,
        creation_wyrd: wyrd, wyrd: Math.min(10, wyrd + sourceProgression.advancement),
        frailties: normalizeChangelingFrailties(source?.line_data.frailties, wyrd + sourceProgression.advancement),
        custom_court: customCourt, kith_custom: customKith,
        kith_skill: customKith ? customKithSkill : (selectedKith?.skill ?? ""),
        kith_description: customKith ? customKithDescription : (selectedKith?.description ?? ""),
        kith_blessing: customKith ? customKithDescription : (selectedKith?.blessing ?? ""),
        kith_source: customKith ? "Criação do jogador" : (selectedKith?.source ?? ""),
        kith_page: customKith ? 0 : (selectedKith?.page ?? 0),
        primary_regalia: seemingCatalog[seeming]?.regalia ?? "",
        second_regalia: secondRegalia, favored_attribute: favoredAttribute,
        aspirations: common.aspirations, contracts,
        learned_contracts: source?.line_data.learned_contracts ?? [],
        extra_contract_benefits: source?.line_data.extra_contract_benefits ?? [],
        extra_contract_clauses: source?.line_data.extra_contract_clauses ?? [],
      },
      derived: {
        Size: 5, Health: 5 + finalAttributes.Stamina,
        Speed: 5 + finalAttributes.Strength + finalAttributes.Dexterity,
        Willpower: finalAttributes.Resolve + finalAttributes.Composure,
        Initiative: finalAttributes.Dexterity + finalAttributes.Composure,
        Defense: Math.min(finalAttributes.Dexterity, finalAttributes.Wits) + finalSkills.Athletics,
        ClarityMaximum: finalAttributes.Wits + finalAttributes.Composure,
      },
      current_state: builderCurrentState(source, draft, common.step, common.allowAdvancement), created_at: source?.created_at ?? now, updated_at: now,
    };
    return completed;
  };
  const finish = (draft: boolean, advancement?: CharacterSheet) => {
    if (!draft && issues.length) {
      common.setError(`${t("ui.stillRequired")}: ${issues.map((issue) => issue.label).join(", ")}.`);
      common.setStep(issues[0].step);
      return false;
    }
    const completed = buildCharacter(advancement ?? initial, draft);
    (draft ? onSaveDraft : onSave)(completed);
    return true;
  };

  const setAspirations = common.setAspirations;
  return <CharacterBuilderShell
    line="CtL" templateLabel={t("ui.lostTemplate")} state={common} issues={issues}
    draft={!initial || isCreationDraft(initial)} onCancel={onCancel} onFinish={finish}
    prepareAdvancement={(previous) => buildCharacter(previous ?? initial, false)}
    renderAdvancement={(sheet, updateSheet) => <ExperiencePanel character={sheet} updateSheet={updateSheet} catalogs={catalogs} reference={reference} builderMode />}
    identity={<CommonIdentityStep name={common.name} setName={common.setName} nameLabel={t("ui.characterName")} concept={common.concept} setConcept={common.setConcept} player={common.playerName} setPlayer={common.setPlayerName} chronicle={common.chronicle} setChronicle={common.setChronicle} missing={missing} />}
    traits={<TraitsStep attributes={common.attributes} setAttributes={common.setAttributes} skills={common.skills} setSkills={common.setSkills} specialties={common.specialties} setSpecialties={common.setSpecialties} missing={missing} />}
    lineTemplate={<MobileChangelingBuilderTemplate><ChangelingBuilderView seeming={seeming} seemingCatalog={seemingCatalog} setSeeming={setSeeming} attributes={common.attributes} contractCatalog={contractCatalog} contractPresentation={reference.contractPresentation} contracts={contracts} setContracts={setContracts} favoredAttribute={favoredAttribute} setFavoredAttribute={setFavoredAttribute} secondRegalia={secondRegalia} setSecondRegalia={setSecondRegalia} needle={needle} setNeedle={setNeedle} thread={thread} setThread={setThread} touchstone={touchstone} setTouchstone={setTouchstone} wyrd={wyrd} setWyrd={setWyrd} maximumPowerFromMerits={maximumPowerFromMerits} powerAdvancement={wyrdProgression.advancement} aspirations={common.aspirations} setAspirations={setAspirations} meritContext={meritContext} meritCatalog={meritCatalog} merits={common.merits} setMerits={common.setMerits} meritSpent={meritSpent} meritBudget={Math.max(0, meritBudget - meritSpent)} court={court} missing={missing} kith={kith} setKith={setKith} customKith={customKith} setCustomKith={setCustomKith} kithChoice={kithChoice} setKithChoice={setKithChoice} specialties={common.specialties} customKithSkill={customKithSkill} setCustomKithSkill={setCustomKithSkill} customKithDescription={customKithDescription} setCustomKithDescription={setCustomKithDescription} kithCatalog={kithCatalog} kithPresentation={reference.kithPresentation} entitlementCatalog={entitlementCatalog} tokenCatalog={tokenCatalog} customCourt={customCourt} setCustomCourt={setCustomCourt} setCourt={setCourt} courtCatalog={courtCatalog} /></MobileChangelingBuilderTemplate>}
  />;
}

export const changelingBuilder: GameLineBuilderModule = { Component: ChangelingCharacterBuilder };
