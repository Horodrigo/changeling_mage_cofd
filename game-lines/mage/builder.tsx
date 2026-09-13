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
import { MageBuilderView, type CustomOrderDefinition, type SpellSelection } from "./builder-view";
import { MTA_ORDERS, MTA_PATHS } from "./creation-rules";
import { arcanaCreationErrors, meetsArcanaRequirements } from "./builder-eligibility";
import type { CharacterSheet, MeritSelection } from "@/lib/core/character/character-types";
import type { GameLineBuilderModule, GameLineBuilderProps } from "@/lib/game-line-contracts/game-line-ui";
import { useLanguage } from "@/lib/i18n";
import { hasPublishedMageOrder } from "@/lib/mage-orders";
import { meritSelectionProblems, type MeritDefinition, type MeritPrerequisiteContext } from "@/lib/merits";
import { mergeCreationMerits } from "@/lib/merit-progression";
import { normalizeMeritConfiguration } from "@/lib/core/character/merit-configuration";
import { synchronizeMageBuilderMeritGrants } from "./builder-merit-grants";
import { mageBuilderPowerProgression } from "./builder-power-progression";
import type { SpellDefinition } from "@/lib/catalog/spell-catalog";
import { systemTerm } from "@/lib/system-terms";

function normalizeCustomOrder(value: unknown): CustomOrderDefinition | null {
  if (!value || typeof value !== "object") return null;
  const item = value as Record<string, unknown>;
  const roteSkills = Array.isArray(item.roteSkills) ? item.roteSkills.map(String).slice(0, 3) : [];
  while (roteSkills.length < 3) roteSkills.push("");
  return {
    name: String(item.name ?? ""),
    description: String(item.description ?? ""),
    roteSkills,
    initiation: normalizeMeritConfiguration(item.initiation),
  };
}

function editableArcana(initial: CharacterSheet | null | undefined) {
  const raw = initial?.line_data.arcana;
  const values = raw && typeof raw === "object"
    ? Object.fromEntries(Object.entries(raw as Record<string, unknown>).map(([name, dots]) => [name, Number(dots) || 0]))
    : {};
  for (const [name, dots] of Object.entries(experienceArcanaDots(initial)))
    values[name] = Math.max(0, Number(values[name] ?? 0) - dots);
  return values;
}

function experienceArcanaDots(initial: CharacterSheet | null | undefined) {
  const history = initial?.current_state?.mage_experience_history;
  if (!Array.isArray(history)) return {} as Record<string, number>;
  return history.reduce<Record<string, number>>((totals, entry) => {
    const undo = entry && typeof entry === "object" ? (entry as { undo?: Record<string, unknown> }).undo : undefined;
    if (undo?.kind === "arcana" && typeof undo.name === "string") totals[undo.name] = (totals[undo.name] ?? 0) + 1;
    return totals;
  }, {});
}

function experienceSpecialties(initial: CharacterSheet | null | undefined) {
  const history = initial?.current_state?.mage_experience_history;
  if (!Array.isArray(history)) return [];
  return history
    .map((entry) => entry && typeof entry === "object" ? (entry as { undo?: Record<string, unknown> }).undo : undefined)
    .filter((undo): undo is Record<string, unknown> =>
      undo?.kind === "specialty" && typeof undo.skill === "string" && typeof undo.name === "string",
    )
    .map((undo) => ({ skill: String(undo.skill), name: String(undo.name) }));
}

function readSpells(
  initial: CharacterSheet | null | undefined,
  key: string,
  count: number,
  catalog: readonly SpellDefinition[],
): Array<SpellSelection | null> {
  const raw = initial?.line_data[key];
  const source = Array.isArray(raw) ? raw : [];
  const result = source.slice(0, count).map((value): SpellSelection | null => {
    const record = value && typeof value === "object" ? value as Record<string, unknown> : null;
    const name = typeof value === "string" ? value : String(record?.name ?? "");
    const found = catalog.find((spell) =>
      spell.id === record?.id || spell.originalName === record?.originalName || spell.name === name || spell.originalName === name,
    );
    return found ? { ...found, roteSkill: String(record?.roteSkill ?? found.roteSkills[0] ?? "") } : null;
  });
  while (result.length < count) result.push(null);
  return result;
}

function MageCharacterBuilder({ player, initial, onCancel, onSave, catalogs }: GameLineBuilderProps) {
  const { locale, tr } = useLanguage();
  if (initial && initial.game_line !== "MtA") throw new Error("Mage builder received a non-Mage character.");
  if (!catalogs) throw new Error("Mage builder requires its catalog snapshot.");
  const common = useCommonBuilderState(initial, player, {
    experienceHistoryKey: "mage_experience_history",
    purchasedSpecialties: experienceSpecialties(initial),
    grantedMeritSources: ["Ordem", "Nameless Order"],
    adjustAttributes: (values) => {
      const bonus = String(initial?.line_data.resistance_bonus ?? "");
      if (bonus && values[bonus] > 1) values[bonus] -= 1;
      return values;
    },
    adjustSkills: (values) => {
      if (Number(initial?.line_data.order_occult_bonus ?? 0) > 0)
        values.Ocultismo = Math.max(0, Number(values.Ocultismo ?? 0) - 1);
      return values;
    },
  });
  const spellCatalog = catalogs.get<readonly SpellDefinition[]>("mage-spells");
  const meritCatalog = useMemo(() => [
    ...catalogs.get<readonly MeritDefinition[]>("core-merits"),
    ...catalogs.get<readonly MeritDefinition[]>("mage-merits"),
  ].sort((left, right) => left.translatedName.localeCompare(right.translatedName, "pt-BR")), [catalogs]);

  const [path, setPath] = useState(String(initial?.line_data.path ?? ""));
  const [order, setOrder] = useState(String(initial?.line_data.order || "Orderless"));
  const [customOrder, setCustomOrder] = useState<CustomOrderDefinition | null>(() => normalizeCustomOrder(initial?.line_data.custom_order));
  const [virtue, setVirtue] = useState(String(initial?.line_data.virtue ?? ""));
  const [vice, setVice] = useState(String(initial?.line_data.vice ?? ""));
  const [nimbus, setNimbus] = useState(String(initial?.line_data.nimbus ?? ""));
  const [shadowName, setShadowName] = useState(String(initial?.line_data.shadow_name ?? ""));
  const [tool, setTool] = useState(String(initial?.line_data.dedicated_tool ?? ""));
  const [resistanceBonus, setResistanceBonus] = useState(String(initial?.line_data.resistance_bonus ?? ""));
  const gnosisProgression = mageBuilderPowerProgression(initial);
  const [gnosis, setGnosis] = useState(gnosisProgression.creation);
  const [arcana, setArcana] = useState<Record<string, number>>(() => editableArcana(initial));
  const [rotes, setRotes] = useState<Array<SpellSelection | null>>(() => readSpells(initial, "rotes", 3, spellCatalog));
  const [praxes, setPraxes] = useState<Array<SpellSelection | null>>(() => readSpells(initial, "praxes", 3, spellCatalog));
  const setMerits = common.setMerits;

  const namelessInitiation = common.merits.find((item) => item.name === "Mystery Cult Initiation" && item.grantedBy === "Nameless Order");
  const namelessInitiationDots = Number(namelessInitiation?.dots ?? 1);
  const namelessConfiguration = normalizeMeritConfiguration(namelessInitiation?.configuration);
  const namelessRoteSkills = Array.isArray(namelessConfiguration.level_2_rote_skills)
    ? namelessConfiguration.level_2_rote_skills.map(String).filter(Boolean)
    : [];
  const hasCreationOrderBenefits = hasPublishedMageOrder(order) || (order === "Nameless" && namelessInitiationDots >= 2);
  const hasOrderOccultBonus = hasPublishedMageOrder(order);

  useEffect(() => {
    const wanted: MeritSelection[] = hasPublishedMageOrder(order)
      ? [
          { name: "Awakened Status", dots: 1, grantedBy: "Ordem", sourceId: "mta-2ed", source: "Mage the Awakening", configuration: { domain: order, name: order } },
          { name: "High Speech", dots: 1, grantedBy: "Ordem", sourceId: "mta-2ed", source: "Mage the Awakening", configuration: {} },
        ]
      : order === "Nameless"
        ? [{ name: "Mystery Cult Initiation", dots: 1, grantedBy: "Nameless Order", sourceId: "core-2ed", source: "Chronicles of Darkness", configuration: { ...normalizeMeritConfiguration(customOrder?.initiation), cult: customOrder?.name ?? "", level_1_type: "merit", level_1_merits: ["High Speech|1"] } }]
        : [];
    setMerits((current) => {
      const automatic = new Set(["Ordem", "Nameless Order"]);
      const grantedNames = new Set(wanted.map((merit) => merit.name));
      const paidWithExperience = (name: string) => current.some((merit) => merit.name === name && !merit.grantedBy && Number(merit.experienceDots ?? 0) > 0);
      const retained = current.filter((merit) => !automatic.has(String(merit.grantedBy)) && !(grantedNames.has(merit.name) && Number(merit.experienceDots ?? 0) === 0));
      const next = [...retained, ...wanted.filter((merit) => !paidWithExperience(merit.name)).map((grant) => {
        const existing = current.find((merit) => merit.name === grant.name && (merit.grantedBy === grant.grantedBy || (!merit.grantedBy && Number(merit.experienceDots ?? 0) === 0)));
        return { ...existing, instanceId: existing?.instanceId ?? crypto.randomUUID(), ...grant, dots: Math.max(1, Number(existing?.dots ?? 1)), configuration: { ...normalizeMeritConfiguration(existing?.configuration), ...grant.configuration } };
      })];
      return JSON.stringify(next) === JSON.stringify(current) ? current : next;
    });
  }, [order, customOrder?.name, customOrder?.initiation, setMerits]);

  const meritSpent = common.merits.reduce((sum, item) => sum + Math.max(0, item.dots - (item.grantedBy ? 1 : 0)), 0);
  const meritBudget = Math.max(0, 10 - (gnosis - 1) * 5);
  const maximumPowerFromMerits = Math.max(1, Math.min(3, 1 + Math.floor(Math.max(0, 10 - meritSpent) / 5)));
  useEffect(() => {
    if (gnosis <= maximumPowerFromMerits) return;
    const timer = window.setTimeout(() => setGnosis(maximumPowerFromMerits), 0);
    return () => window.clearTimeout(timer);
  }, [gnosis, maximumPowerFromMerits]);

  const meritContext: MeritPrerequisiteContext = {
    gameLine: "MtA",
    archetypes: ["awakened"],
    attributes: common.attributes,
    skills: { ...common.skills, ...(hasCreationOrderBenefits ? { Ocultismo: Math.min(5, (common.skills.Ocultismo ?? 0) + 1) } : {}) },
    gnosis, arcana, path, order,
    merits: mergeCreationMerits(initial?.merits, common.merits),
    powers: [],
  };
  const pathData = MTA_PATHS[path as keyof typeof MTA_PATHS] ?? MTA_PATHS.Acanthus;
  const issues = (() => {
    const result: BuilderValidationIssue[] = commonCreationIssues(common, {
      attributes: tr("Atributos", "Attributes"), skills: tr("Perícias", "Skills"),
      attributePriorities: tr("Prioridades de Atributos", "Attribute priorities"),
      skillPriorities: tr("Prioridades de Perícias", "Skill priorities"),
      categoryLabel: (category) => systemTerm(category, locale),
    });
    const add = (key: string, label: string) => result.push({ step: 3, key, label });
    for (const merit of common.merits) {
      const definition = meritCatalog.find((item) => item.name === merit.name);
      if (definition) for (const message of meritSelectionProblems(definition, merit, meritContext)) add("merits", `${merit.name}: ${message}`);
    }
    if (meritSpent > meritBudget) add("merits", tr("Méritos acima do limite", "Merits exceed the limit"));
    for (const [key, value, label] of [
      ["path", path, "Caminho"], ["order", order, "Ordem"], ["virtue", virtue, "Virtude"],
      ["vice", vice, "Vício"], ["shadowName", shadowName, "Nome das Sombras"],
      ["resistanceBonus", resistanceBonus, "Atributo de Resistência"],
    ]) if (!value) add(key, label);
    if (order === "Nameless" && !customOrder?.name.trim()) add("order", tr("Escolha o nome da Nameless Order", "Choose a name for the Nameless Order"));
    if (order === "Nameless" && namelessInitiationDots >= 2 && (namelessRoteSkills.length !== 3 || new Set(namelessRoteSkills).size !== 3))
      add("merits", tr("Escolha três Perícias de Rota distintas no nível 2 de Mystery Cult Initiation", "Choose three distinct Rote Skills for Mystery Cult Initiation dot 2"));
    arcanaCreationErrors(arcana, path ? pathData : undefined).forEach((message) => add("arcana", message));
    if (hasCreationOrderBenefits && rotes.slice(0, 3).filter((item) => item?.roteSkill && meetsArcanaRequirements(item.requirements, arcana)).length !== 3)
      add("rotes", tr("Três Rotas utilizáveis e suas Perícias", "Three usable Rotes and their Skills"));
    if (praxes.slice(0, gnosis).filter((item) => item && meetsArcanaRequirements(item.requirements, arcana)).length !== gnosis)
      add("praxes", `${gnosis} ${tr("Práxis utilizável(is)", "usable Praxis")}`);
    return result;
  })();
  const missing = (key: string) => issues.some((issue) => issue.key === key);

  const finish = () => {
    if (issues.length) {
      common.setError(`${tr("Ainda falta", "Still required")}: ${issues.map((issue) => issue.label).join(", ")}.`);
      common.setStep(issues[0].step);
      return;
    }
    const finalAttributes = { ...common.attributes, [resistanceBonus]: Math.min(5, (common.attributes[resistanceBonus] ?? 1) + 1) };
    const finalSkills = { ...common.skills };
    const finalArcana = { ...arcana };
    if (hasOrderOccultBonus) finalSkills.Ocultismo = Math.min(5, (finalSkills.Ocultismo ?? 0) + 1);
    for (const [name, dots] of Object.entries(experienceTraitDots(initial, "attributes", "mage_experience_history"))) finalAttributes[name] = Number(finalAttributes[name] ?? 1) + dots;
    for (const [name, dots] of Object.entries(experienceTraitDots(initial, "skills", "mage_experience_history"))) finalSkills[name] = Number(finalSkills[name] ?? 0) + dots;
    for (const [name, dots] of Object.entries(experienceArcanaDots(initial))) finalArcana[name] = Number(finalArcana[name] ?? 0) + dots;
    const now = new Date().toISOString();
    const completed: CharacterSheet = {
      id: initial?.id ?? crypto.randomUUID(), schema_version: 2, system: "chronicles-of-darkness", game_line: "MtA",
      ruleset: { id: "mta-2ed-embedded", version: 1 },
      character: { name: shadowName.trim(), concept: common.concept.trim(), player: common.playerName.trim(), chronicle: common.chronicle.trim() },
      attributes: finalAttributes, skills: finalSkills,
      specializations: [
        ...common.specialties.filter((item) => item.skill && item.name.trim()).map((item) => ({ skill: item.skill, name: item.name.trim() })),
        ...experienceSpecialties(initial),
        ...(initial?.specializations ?? []).filter((item) => Boolean(item.grantedBy)),
      ],
      merits: [
        ...mergeCreationMerits(initial?.merits, common.merits.map((item) => {
          const definition = meritCatalog.find((entry) => entry.name === item.name);
          return { ...item, configuration: normalizeMeritConfiguration(item.configuration), sourceId: definition?.sourceId, source: definition?.source };
        })),
        ...(hasPublishedMageOrder(order) && !common.merits.some((item) => item.name === "High Speech") && !initial?.merits.some((item) => item.name === "High Speech" && item.experienceDots)
          ? [{ name: "High Speech", dots: 1, sourceId: "mta-2ed", source: "Mage the Awakening", configuration: {}, grantedBy: "Ordem" }]
          : []),
      ],
      line_data: {
        ...(initial?.line_data ?? {}), path, order, custom_order: customOrder, virtue, vice, shadow_name: shadowName,
        resistance_bonus: resistanceBonus,
        order_occult_bonus: hasOrderOccultBonus ? Math.max(0, Math.min(5, (common.skills.Ocultismo ?? 0) + 1) - (common.skills.Ocultismo ?? 0)) : 0,
        creation_gnosis: gnosis, gnosis: Math.min(10, gnosis + gnosisProgression.advancement),
        wisdom: Number(initial?.line_data.wisdom ?? 7), arcana: finalArcana,
        rotes: hasCreationOrderBenefits ? rotes.filter(Boolean) : [], praxes: praxes.slice(0, gnosis).filter(Boolean),
        ruling_arcana: pathData.ruling, inferior_arcanum: pathData.inferior,
        rote_skills: order === "Nameless" ? namelessRoteSkills : (MTA_ORDERS[order as keyof typeof MTA_ORDERS] ?? []),
      },
      derived: {
        Tamanho: 5, Vitalidade: 5 + finalAttributes.Vigor,
        Deslocamento: 5 + finalAttributes["Força"] + finalAttributes.Destreza,
        ForçaDeVontade: finalAttributes["Perseverança"] + finalAttributes.Compostura,
        Iniciativa: finalAttributes.Destreza + finalAttributes.Compostura,
        Defesa: Math.min(finalAttributes.Destreza, finalAttributes["Raciocínio"]) + finalSkills.Atletismo,
        Sabedoria: 7,
      },
      current_state: initial?.current_state ?? {}, created_at: initial?.created_at ?? now, updated_at: now,
    };
    onSave(synchronizeMageBuilderMeritGrants(completed));
  };

  return <CharacterBuilderShell
    line="MtA" templateLabel={tr("Modelo dos Despertos", "Awakened Template")} state={common} issues={issues}
    onCancel={onCancel} onFinish={finish}
    identity={<CommonIdentityStep name={shadowName} setName={setShadowName} nameLabel={tr("Nome das Sombras", "Shadow Name")} concept={common.concept} setConcept={common.setConcept} player={common.playerName} setPlayer={common.setPlayerName} chronicle={common.chronicle} setChronicle={common.setChronicle} missing={missing} />}
    traits={<TraitsStep attributes={common.attributes} setAttributes={common.setAttributes} skills={common.skills} setSkills={common.setSkills} attributePriority={common.attributePriority} setAttributePriority={common.setAttributePriority} skillPriority={common.skillPriority} setSkillPriority={common.setSkillPriority} specialties={common.specialties} setSpecialties={common.setSpecialties} missing={missing} />}
    lineTemplate={<MageBuilderView path={path} setPath={setPath} order={order} setOrder={setOrder} customOrder={customOrder} setCustomOrder={setCustomOrder} virtue={virtue} setVirtue={setVirtue} vice={vice} setVice={setVice} nimbus={nimbus} setNimbus={setNimbus} tool={tool} setTool={setTool} resistanceBonus={resistanceBonus} setResistanceBonus={setResistanceBonus} gnosis={gnosis} setGnosis={setGnosis} maximumPowerFromMerits={maximumPowerFromMerits} powerAdvancement={gnosisProgression.advancement} arcana={arcana} setArcana={setArcana} rotes={rotes} setRotes={setRotes} praxes={praxes} setPraxes={setPraxes} spellCatalog={[...spellCatalog]} aspirations={common.aspirations} setAspirations={common.setAspirations} meritContext={meritContext} meritCatalog={meritCatalog} merits={common.merits} setMerits={common.setMerits} meritSpent={meritSpent} meritBudget={Math.max(0, meritBudget - meritSpent)} missing={missing} />}
  />;
}

export const mageBuilder: GameLineBuilderModule = { Component: MageCharacterBuilder };
