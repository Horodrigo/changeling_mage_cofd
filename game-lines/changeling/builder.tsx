"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CharacterBuilderShell,
  commonCreationIssues,
  experienceTraitDots,
  useCommonBuilderState,
  type BuilderValidationIssue,
} from "@/app/character-builder-shell";
import { CommonIdentityStep, TraitsStep } from "@/app/builder/common-controls";
import { ChangelingBuilderView, type ContractSelection, type CustomCourtDefinition } from "./builder-view";
import {
  CTL_SEEMINGS,
  canonicalChangelingAnchorName,
  normalizeChangelingFrailties,
} from "./creation-rules";
import { canSelectInitialContract } from "./builder-eligibility";
import type { CharacterSheet, MeritSelection } from "@/lib/core/character/character-types";
import type { GameLineBuilderModule, GameLineBuilderProps } from "@/lib/game-line-contracts/game-line-ui";
import { useLanguage } from "@/lib/i18n";
import { changelingFavoredRegalia } from "@/lib/changeling-regalia";
import type { KithDefinition } from "@/lib/changeling-kiths";
import type { CourtDefinition } from "@/lib/changeling-courts";
import type { EntitlementDefinition } from "@/lib/entitlements";
import { kithCreationChoice } from "@/lib/changeling-kith-choices";
import type { ContractDefinition } from "@/lib/catalog/contract-catalog";
import { contractWithSupplementalBenefits } from "@/lib/contract-presentation";
import { meritSelectionProblems, type MeritDefinition, type MeritPrerequisiteContext } from "@/lib/merits";
import { mergeCreationMerits } from "@/lib/merit-progression";
import { normalizeMeritConfiguration } from "@/lib/core/character/merit-configuration";
import { synchronizeChangelingBuilderMeritGrants } from "./builder-merit-grants";
import { changelingBuilderPowerProgression } from "./builder-power-progression";
import { systemTerm } from "@/lib/system-terms";
import { createRandomId } from "@/lib/random-id";

type ChangelingReference = {
  courts: CourtDefinition[];
  entitlements: EntitlementDefinition[];
  kiths: KithDefinition[];
  kithPresentation: Record<string, Pick<KithDefinition, "description" | "blessing" | "skill"> & { name: string }>;
};

function translateRegalia(value: string) {
  return ({ Coroa: "Crown", Joias: "Jewels", Espelho: "Mirror", Escudo: "Shield", Corcel: "Steed", Espada: "Sword", Cálice: "Chalice", Moeda: "Coin", Cetro: "Scepter", Estrelas: "Stars", Espinho: "Thorn" } as Record<string, string>)[value] ?? value;
}

function translateCourt(value: string) {
  return ({ Courtless: "Sem Corte", Spring: "Primavera", Summer: "Verão", Autumn: "Outono", Winter: "Inverno" } as Record<string, string>)[value] ?? value;
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

function ChangelingCharacterBuilder({ player, initial, onCancel, onSave, catalogs }: GameLineBuilderProps) {
  const { locale, tr } = useLanguage();
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
  const reference = catalogs.get<ChangelingReference>("changeling-reference");
  const contractCatalog = useMemo(() => catalogs.get<readonly ContractDefinition[]>("changeling-contracts").map((item) => contractWithSupplementalBenefits(item, [])), [catalogs]);
  const meritCatalog = useMemo(() => [
    ...catalogs.get<readonly MeritDefinition[]>("core-merits"),
    ...catalogs.get<readonly MeritDefinition[]>("changeling-merits"),
  ].sort((left, right) => left.translatedName.localeCompare(right.translatedName, "pt-BR")), [catalogs]);

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
  const [secondRegalia, setSecondRegalia] = useState(translateRegalia(String(initial?.line_data.second_regalia ?? "")));
  const [favoredAttribute, setFavoredAttribute] = useState(String(initial?.line_data.favored_attribute ?? ""));
  const [contracts, setContracts] = useState<ContractSelection[]>(() => readContracts(initial, contractCatalog));
  const setMerits = common.setMerits;

  useEffect(() => {
    const wanted: MeritSelection[] = court && !["Sem Corte", "Courtless"].includes(court)
      ? [{ name: "Mantle", dots: 1, grantedBy: "Corte", sourceId: "ctl-2ed", source: "Changeling the Lost", configuration: { court } }]
      : [];
    setMerits((current) => {
      const retained = current.filter((merit) => merit.grantedBy !== "Corte" && !(merit.name === "Mantle" && Number(merit.experienceDots ?? 0) === 0));
      const paidWithExperience = current.some((merit) => merit.name === "Mantle" && !merit.grantedBy && Number(merit.experienceDots ?? 0) > 0);
      const next = [...retained, ...wanted.filter(() => !paidWithExperience).map((grant) => {
        const existing = current.find((merit) => merit.name === grant.name && (merit.grantedBy === grant.grantedBy || (!merit.grantedBy && Number(merit.experienceDots ?? 0) === 0)));
        return { ...existing, instanceId: existing?.instanceId ?? createRandomId(), ...grant, dots: Math.max(1, Number(existing?.dots ?? 1)), configuration: { ...normalizeMeritConfiguration(existing?.configuration), ...grant.configuration } };
      })];
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

  const meritContext: MeritPrerequisiteContext = {
    gameLine: "CtL", archetypes: ["changeling"], attributes: common.attributes, skills: common.skills,
    seeming, kith, wyrd, court,
    mantle: court && court !== "Sem Corte" ? Math.max(1, initial?.merits.find((item) => item.name === "Mantle" && item.grantedBy === "Corte")?.dots ?? 1) : 0,
    merits: mergeCreationMerits(initial?.merits, common.merits),
    meritCatalog,
    powers: contracts.map((item) => item.originalName || item.name).filter(Boolean),
  };
  const issues = (() => {
    const result: BuilderValidationIssue[] = commonCreationIssues(common, {
      attributes: tr("Atributos", "Attributes"), skills: tr("Perícias", "Skills"),
      attributePriorities: tr("Prioridades de Atributos", "Attribute priorities"),
      skillPriorities: tr("Prioridades de Perícias", "Skill priorities"),
      categoryLabel: (category) => systemTerm(category, locale),
    });
    const add = (step: number, key: string, label: string) => result.push({ step, key, label });
    if (!common.name.trim()) add(1, "name", tr("Nome do personagem", "Character name"));
    for (const merit of common.merits) {
      const definition = meritCatalog.find((item) => item.name === merit.name);
      if (definition) for (const message of meritSelectionProblems(definition, merit, meritContext)) add(3, "merits", `${merit.name}: ${message}`);
    }
    if (meritSpent > meritBudget) add(3, "merits", tr("Méritos acima do limite", "Merits exceed the limit"));
    for (const [key, value, label] of [
      ["seeming", seeming, tr("Feição", "Seeming")], ["kith", kith, tr("Fratria", "Kith")], ["needle", needle, tr("Agulha", "Needle")],
      ["thread", thread, tr("Fio", "Thread")], ["favoredAttribute", favoredAttribute, tr("Atributo favorecido", "Favored Attribute")], ["secondRegalia", secondRegalia, tr("Segunda Regalia", "Second Regalia")],
    ]) if (!value) add(3, key, label);
    const selectedKith = findKith(reference.kiths, kith);
    if (customKith && (!customKithSkill || !customKithDescription.trim())) add(3, "kith", tr("Fratria personalizada completa", "Complete custom Kith"));
    if (!customKith && kithCreationChoice(selectedKith?.id) && !kithChoice.trim()) add(3, "kith-choice", tr("Escolha da Bênção da Fratria", "Kith Blessing choice"));
    const favoredRegalia = changelingFavoredRegalia({ primary_regalia: CTL_SEEMINGS[seeming as keyof typeof CTL_SEEMINGS]?.regalia, second_regalia: secondRegalia, kith, kith_custom: customKith });
    if (
      contracts.slice(0, 4).filter((item) => item.name && item.type === "Comum" && canSelectInitialContract(item, favoredRegalia, court, reference.courts)).length !== 4 ||
      contracts.slice(4, 6).filter((item) => item.name && item.type === "Real" && canSelectInitialContract(item, favoredRegalia, court, reference.courts)).length !== 2
    ) add(3, "contracts", tr("Quatro Contratos Comuns e dois Reais permitidos pelas Regalias e Corte", "Four Common Contracts and two Royal Contracts allowed by the selected Regalia and Court"));
    return result;
  })();
  const missing = (key: string) => issues.some((issue) => issue.key === key);

  const finish = () => {
    if (issues.length) {
      common.setError(`${tr("Ainda falta", "Still required")}: ${issues.map((issue) => issue.label).join(", ")}.`);
      common.setStep(issues[0].step);
      return;
    }
    const finalAttributes = { ...common.attributes, [favoredAttribute]: Math.min(5, (common.attributes[favoredAttribute] ?? 1) + 1) };
    const finalSkills = { ...common.skills };
    for (const [name, dots] of Object.entries(experienceTraitDots(initial, "attributes", "experience_history"))) finalAttributes[name] = Number(finalAttributes[name] ?? 1) + dots;
    for (const [name, dots] of Object.entries(experienceTraitDots(initial, "skills", "experience_history"))) finalSkills[name] = Number(finalSkills[name] ?? 0) + dots;
    const selectedKith = findKith(reference.kiths, kith);
    const now = new Date().toISOString();
    const completed: CharacterSheet = {
      id: initial?.id ?? createRandomId(), schema_version: 2, system: "chronicles-of-darkness", game_line: "CtL",
      ruleset: { id: "ctl-2ed-embedded", version: 1 },
      character: { name: common.name.trim(), concept: common.concept.trim(), player: common.playerName.trim(), chronicle: common.chronicle.trim() },
      attributes: finalAttributes, skills: finalSkills,
      specializations: [
        ...common.specialties.filter((item) => item.skill && item.name.trim()).map((item) => ({ skill: item.skill, name: item.name.trim() })),
        ...(initial?.specializations ?? []).filter((item) => Boolean(item.grantedBy)),
      ],
      merits: mergeCreationMerits(initial?.merits, common.merits.map((item) => {
        const definition = meritCatalog.find((entry) => entry.name === item.name);
        return { ...item, configuration: normalizeMeritConfiguration(item.configuration), sourceId: definition?.sourceId, source: definition?.source };
      })),
      line_data: {
        ...(initial?.line_data ?? {}), seeming, kith, kith_choice: customKith ? "" : kithChoice,
        court: court || "Sem Corte", needle, thread, touchstone,
        creation_wyrd: wyrd, wyrd: Math.min(10, wyrd + wyrdProgression.advancement),
        frailties: normalizeChangelingFrailties(initial?.line_data.frailties, wyrd + wyrdProgression.advancement),
        custom_court: customCourt, kith_custom: customKith,
        kith_skill: customKith ? customKithSkill : (selectedKith?.skill ?? ""),
        kith_description: customKith ? customKithDescription : (selectedKith?.description ?? ""),
        kith_blessing: customKith ? customKithDescription : (selectedKith?.blessing ?? ""),
        kith_source: customKith ? "Criação do jogador" : (selectedKith?.source ?? ""),
        kith_page: customKith ? 0 : (selectedKith?.page ?? 0),
        primary_regalia: CTL_SEEMINGS[seeming as keyof typeof CTL_SEEMINGS].regalia,
        second_regalia: secondRegalia, favored_attribute: favoredAttribute,
        aspirations: common.aspirations, contracts,
        learned_contracts: initial?.line_data.learned_contracts ?? [],
        extra_contract_benefits: initial?.line_data.extra_contract_benefits ?? [],
        extra_contract_clauses: initial?.line_data.extra_contract_clauses ?? [],
      },
      derived: {
        Tamanho: 5, Vitalidade: 5 + finalAttributes.Vigor,
        Deslocamento: 5 + finalAttributes["Força"] + finalAttributes.Destreza,
        ForçaDeVontade: finalAttributes["Perseverança"] + finalAttributes.Compostura,
        Iniciativa: finalAttributes.Destreza + finalAttributes.Compostura,
        Defesa: Math.min(finalAttributes.Destreza, finalAttributes["Raciocínio"]) + finalSkills.Atletismo,
        LucidezMaxima: finalAttributes["Raciocínio"] + finalAttributes.Compostura,
      },
      current_state: initial?.current_state ?? {}, created_at: initial?.created_at ?? now, updated_at: now,
    };
    onSave(synchronizeChangelingBuilderMeritGrants(completed, reference.entitlements));
  };

  return <CharacterBuilderShell
    line="CtL" templateLabel={tr("Modelo dos Perdidos", "Lost Template")} state={common} issues={issues}
    onCancel={onCancel} onFinish={finish}
    identity={<CommonIdentityStep name={common.name} setName={common.setName} nameLabel={tr("Nome do personagem", "Character name")} concept={common.concept} setConcept={common.setConcept} player={common.playerName} setPlayer={common.setPlayerName} chronicle={common.chronicle} setChronicle={common.setChronicle} missing={missing} />}
    traits={<TraitsStep attributes={common.attributes} setAttributes={common.setAttributes} skills={common.skills} setSkills={common.setSkills} attributePriority={common.attributePriority} setAttributePriority={common.setAttributePriority} skillPriority={common.skillPriority} setSkillPriority={common.setSkillPriority} specialties={common.specialties} setSpecialties={common.setSpecialties} missing={missing} />}
    lineTemplate={<ChangelingBuilderView seeming={seeming} setSeeming={setSeeming} attributes={common.attributes} contractCatalog={contractCatalog} contracts={contracts} setContracts={setContracts} favoredAttribute={favoredAttribute} setFavoredAttribute={setFavoredAttribute} secondRegalia={secondRegalia} setSecondRegalia={setSecondRegalia} needle={needle} setNeedle={setNeedle} thread={thread} setThread={setThread} touchstone={touchstone} setTouchstone={setTouchstone} wyrd={wyrd} setWyrd={setWyrd} maximumPowerFromMerits={maximumPowerFromMerits} powerAdvancement={wyrdProgression.advancement} aspirations={common.aspirations} setAspirations={common.setAspirations} meritContext={meritContext} meritCatalog={meritCatalog} merits={common.merits} setMerits={common.setMerits} meritSpent={meritSpent} meritBudget={Math.max(0, meritBudget - meritSpent)} court={court} missing={missing} kith={kith} setKith={setKith} customKith={customKith} setCustomKith={setCustomKith} kithChoice={kithChoice} setKithChoice={setKithChoice} specialties={common.specialties} customKithSkill={customKithSkill} setCustomKithSkill={setCustomKithSkill} customKithDescription={customKithDescription} setCustomKithDescription={setCustomKithDescription} kithCatalog={reference.kiths} kithPresentation={reference.kithPresentation} entitlementCatalog={reference.entitlements} customCourt={customCourt} setCustomCourt={setCustomCourt} setCourt={setCourt} courtCatalog={reference.courts} />}
  />;
}

export const changelingBuilder: GameLineBuilderModule = { Component: ChangelingCharacterBuilder };
