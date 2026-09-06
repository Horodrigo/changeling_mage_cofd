"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Minus,
  Plus,
  Save,
  Search,
  ShieldCheck,
  Trash2,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  ARCANA,
  ATTRIBUTES,
  CTL_COURTS,
  CTL_NEEDLES,
  CTL_SEEMINGS,
  CTL_SEEMING_LABELS,
  seemingDisplayName,
  CTL_THREADS,
  MTA_ORDERS,
  MTA_ORDER_LABELS,
  MTA_PATHS,
  REGALIA,
  SKILLS,
  normalizeChangelingFrailties,
  canIncreaseCreationDots,
} from "@/lib/creation-rules";
import {
  getMeritsForLine,
  meritRatingsFor,
  REPEATABLE_MERITS,
  type MeritDefinition,
} from "@/lib/merits";
import { CONTRACTS, findContract, type ContractDefinition } from "@/lib/contracts";
import { contractDisplayOptions, contractHasInvocationRoll, contractOutcomeSections, contractPresentation, contractSummary, contractWithSupplementalBenefits } from "@/lib/contract-presentation";
import { alphabetical, compareOptionLabels, orderedChoiceOptions } from "@/lib/option-order";
import { SPELLS, type SpellDefinition } from "@/lib/spells";
import { powerProgression, creationMeritAllowance } from "@/lib/power-progression";
import {
  arcanaCreationErrors,
  canSelectInitialContract,
  meetsArcanaRequirements,
} from "@/lib/creation-eligibility";
import { KITHS, findKith, kithDisplayName, kithPresentation, kithSearchText, type KithDefinition } from "@/lib/changeling-kiths";
import { CTL_COURT_DEFINITIONS, courtCanonicalId, courtDisplayName, courtPresentation } from "@/lib/changeling-courts";
import { useHomebrews } from "./use-homebrews";
import { isBuiltinHomebrew, isHomebrewActive } from "@/lib/homebrews";
import {
  findMeritConfiguration,
  isStructuredMerit,
  meritConfigurationTitle,
  normalizeMeritConfiguration,
  synchronizeMeritGrants,
  type MeritConfiguration,
} from "@/lib/merit-configurations";
import { skillSpecialtySuggestions } from "@/lib/skill-specialties";
import { localized, useLanguage, type Locale } from "@/lib/i18n";
import { systemTerm } from "@/lib/system-terms";
import { builderText } from "./character-builder-messages";

export type Specialty = { skill: string; name: string; grantedBy?: string };
export type MeritSelection = {
  instanceId?: string;
  name: string;
  dots: number;
  sourceId?: string;
  source?: string;
  configuration?: MeritConfiguration;
  grantedBy?: string;
};
export type ContractSelection = Pick<
  ContractDefinition,
  | "id"
  | "name"
  | "originalName"
  | "type"
  | "regalia"
  | "description"
  | "summary"
  | "effect"
  | "dicePool"
  | "hasRoll"
  | "loophole"
  | "seemingBenefits"
  | "courtClauses"
  | "courtFamily"
  | "courtIds"
  | "goblin"
  | "cost"
  | "action"
  | "duration"
  | "success"
  | "exceptionalSuccess"
  | "failure"
  | "dramaticFailure"
  | "options"
  | "detailTables"
  | "goblinDebt"
  | "sourceId"
  | "source"
  | "page"
>;
export type SpellSelection = SpellDefinition & { roteSkill?: string };
type CustomCourtDefinition = {
  name: string;
  emotion: string;
  mantleBenefits: string[];
};
type CustomOrderDefinition = {
  name: string;
  description: string;
  roteSkills: string[];
};

export type CharacterSheet = {
  id: string;
  schema_version: 2;
  system: "chronicles-of-darkness";
  game_line: "CtL" | "MtA";
  ruleset: { id: string; version: number };
  character: { name: string; concept: string; player: string; chronicle?: string };
  attributes: Record<string, number>;
  skills: Record<string, number>;
  specializations: Specialty[];
  merits: MeritSelection[];
  line_data: Record<string, unknown>;
  derived: Record<string, number>;
  current_state: Record<string, unknown>;
  created_at: string;
  updated_at: string;
};

const attributeCategories = Object.keys(ATTRIBUTES) as Array<
  keyof typeof ATTRIBUTES
>;
const skillCategories = Object.keys(SKILLS) as Array<keyof typeof SKILLS>;

function initialDots(groups: Record<string, readonly string[]>, base: number) {
  return Object.values(groups)
    .flat()
    .reduce<Record<string, number>>(
      (acc, name) => ({ ...acc, [name]: base }),
      {},
    );
}

function editableAttributes(initial?: CharacterSheet | null) {
  const values = initial?.attributes
    ? { ...initial.attributes }
    : initialDots(ATTRIBUTES, 1);
  if (!initial) return values;
  const bonus = String(
    initial.game_line === "CtL"
      ? (initial.line_data.favored_attribute ?? "")
      : (initial.line_data.resistance_bonus ?? ""),
  );
  if (bonus && values[bonus] > 1) values[bonus] -= 1;
  return values;
}

function inferredPriority(
  values: Record<string, number>,
  groups: Record<string, readonly string[]>,
  base: number,
) {
  return Object.keys(groups).sort(
    (left, right) =>
      spent(values, groups[right], base) - spent(values, groups[left], base),
  );
}

export function CharacterBuilder({
  player,
  initial,
  onCancel,
  onSave,
}: {
  player: string;
  initial?: CharacterSheet | null;
  onCancel: () => void;
  onSave: (sheet: CharacterSheet) => void;
}) {
  const { locale, tr } = useLanguage();
  const homebrews = useHomebrews();
  const contractCatalog = useMemo(
    () => [...CONTRACTS.filter(item=>!isBuiltinHomebrew(item.sourceId)||isHomebrewActive(homebrews,item.sourceId)).map(item=>contractWithSupplementalBenefits(item,isHomebrewActive(homebrews,"h-seemings")?["h-seemings"]:[])), ...homebrews.contracts.filter(item=>isHomebrewActive(homebrews,item.id))],
    [homebrews],
  );
  const spellCatalog = useMemo(
    () => [...SPELLS, ...homebrews.spells.filter(item=>isHomebrewActive(homebrews,item.id))],
    [homebrews],
  );
  const startingAttributes = editableAttributes(initial);
  const startingSkills = editableSkills(initial);
  const [step, setStep] = useState(1);
  const [line, setLine] = useState<"CtL" | "MtA">(initial?.game_line ?? "CtL");
  const [name, setName] = useState(initial?.character.name ?? "");
  const [concept, setConcept] = useState(initial?.character.concept ?? "");
  const [playerName, setPlayerName] = useState(
    initial?.character.player ?? player,
  );
  const [chronicle, setChronicle] = useState(initial?.character.chronicle ?? "");
  const [attributes, setAttributes] =
    useState<Record<string, number>>(startingAttributes);
  const [skills, setSkills] = useState<Record<string, number>>(startingSkills);
  const [attributePriority, setAttributePriority] = useState<string[]>(() =>
    initial
      ? inferredPriority(startingAttributes, ATTRIBUTES, 1)
      : ["", "", ""],
  );
  const [skillPriority, setSkillPriority] = useState<string[]>(() =>
    initial ? inferredPriority(startingSkills, SKILLS, 0) : ["", "", ""],
  );
  const [specialties, setSpecialties] = useState<Specialty[]>(
    normalizeSpecialties(
      initial?.specializations?.filter((item) => !item.grantedBy),
    ),
  );
  const [aspirations, setAspirations] = useState<string[]>(
    readArray(initial, "aspirations", ["", "", ""]),
  );
  const [merits, setMerits] = useState<MeritSelection[]>(
    initial?.merits?.filter((item) => !item.grantedBy) ?? [],
  );

  const [seeming, setSeeming] = useState(
    String(initial?.line_data.seeming ?? ""),
  );
  const [kith, setKith] = useState(String(initial?.line_data.kith ?? ""));
  const [customKithSkill, setCustomKithSkill] = useState(
    String(initial?.line_data.kith_skill ?? ""),
  );
  const [customKithDescription, setCustomKithDescription] = useState(
    String(initial?.line_data.kith_description ?? ""),
  );
  const [customKith, setCustomKith] = useState(
    Boolean(initial?.line_data.kith_custom),
  );
  const [court, setCourt] = useState(
    translateCourt(String(initial?.line_data.court ?? "")),
  );
  const [customCourt, setCustomCourt] = useState<CustomCourtDefinition | null>(
    () => normalizeCustomCourt(initial?.line_data.custom_court),
  );
  const [needle, setNeedle] = useState(
    translateNeedle(String(initial?.line_data.needle ?? "")),
  );
  const [thread, setThread] = useState(
    translateThread(String(initial?.line_data.thread ?? "")),
  );
  const [touchstone, setTouchstone] = useState(
    String(initial?.line_data.touchstone ?? ""),
  );
  const wyrdProgression = powerProgression(initial, "wyrd");
  const [wyrd, setWyrd] = useState(wyrdProgression.creation);
  const [secondRegalia, setSecondRegalia] = useState(
    translateRegalia(String(initial?.line_data.second_regalia ?? "")),
  );
  const [favoredAttribute, setFavoredAttribute] = useState(
    String(initial?.line_data.favored_attribute ?? ""),
  );
  const [contracts, setContracts] = useState<ContractSelection[]>(
    readContracts(initial),
  );

  const [path, setPath] = useState(String(initial?.line_data.path ?? ""));
  const [order, setOrder] = useState(String(initial?.line_data.order ?? ""));
  const [customOrder, setCustomOrder] = useState<CustomOrderDefinition | null>(
    () => normalizeCustomOrder(initial?.line_data.custom_order),
  );
  const [virtue, setVirtue] = useState(String(initial?.line_data.virtue ?? ""));
  const [vice, setVice] = useState(String(initial?.line_data.vice ?? ""));
  const [nimbus, setNimbus] = useState(String(initial?.line_data.nimbus ?? ""));
  const [shadowName, setShadowName] = useState(String(initial?.line_data.shadow_name ?? ""));
  const [tool, setTool] = useState(
    String(initial?.line_data.dedicated_tool ?? ""),
  );
  const [resistanceBonus, setResistanceBonus] = useState(
    String(initial?.line_data.resistance_bonus ?? ""),
  );
  const gnosisProgression = powerProgression(initial, "gnosis");
  const [gnosis, setGnosis] = useState(gnosisProgression.creation);
  const [arcana, setArcana] = useState<Record<string, number>>(
    normalizeArcana(initial?.line_data.arcana),
  );
  const [rotes, setRotes] = useState<Array<SpellSelection | null>>(
    readSpells(initial, "rotes", 3),
  );
  const [praxes, setPraxes] = useState<Array<SpellSelection | null>>(
    readSpells(initial, "praxes", 3),
  );
  const [error, setError] = useState("");

  const meritAllowance = creationMeritAllowance(initial, line === "CtL" ? "wyrd" : "gnosis");
  const meritBudget = meritAllowance - (line === "CtL" ? (wyrd - 1) * 5 : (gnosis - 1) * 5);
  const meritCatalog = useMemo(() => {
    const merged = new Map(
      getMeritsForLine(line).filter(item=>item.name !== "Mantle" && (!isBuiltinHomebrew(item.sourceId)||isHomebrewActive(homebrews,item.sourceId))).map((item) => [item.name.toLocaleLowerCase(), item]),
    );
    homebrews.merits
      .filter((item) => (item.line === "Core" || item.line === line) && isHomebrewActive(homebrews,item.id))
      .forEach((item) => merged.set(item.name.toLocaleLowerCase(), item));
    return [...merged.values()].sort((a, b) =>
      a.translatedName.localeCompare(b.translatedName, "pt-BR"),
    );
  }, [homebrews, line]);
  const meritSpent = merits.reduce((sum, item) => sum + item.dots, 0);
  const pathData =
    MTA_PATHS[path as keyof typeof MTA_PATHS] ?? MTA_PATHS.Acanthus;
  const maximumPowerFromMerits = Math.max(
    1,
    Math.min(3, 1 + Math.floor(Math.max(0, meritAllowance - meritSpent) / 5)),
  );
  useEffect(() => {
    if (line === "CtL" && wyrd > maximumPowerFromMerits)
      setWyrd(maximumPowerFromMerits);
    if (line === "MtA" && gnosis > maximumPowerFromMerits)
      setGnosis(maximumPowerFromMerits);
  }, [line, meritSpent, maximumPowerFromMerits, wyrd, gnosis]);

  const validationIssues = useMemo(() => {
    const issues: Array<{ step: number; key: string; label: string }> = [];
    const add = (step: number, key: string, label: string) =>
      issues.push({ step, key, label });
    if (!name.trim()) add(1, "name", tr("Nome do personagem", "Character name"));
    const prioritiesValid = (values: string[], labels: readonly string[]) =>
      values.every(Boolean) &&
      new Set(values).size === labels.length &&
      labels.every((label) => values.includes(label));
    if (!prioritiesValid(attributePriority, attributeCategories))
      add(2, "attribute-priority", tr("Prioridades de Atributos", "Attribute priorities"));
    if (!prioritiesValid(skillPriority, skillCategories))
      add(2, "skill-priority", tr("Prioridades de Perícias", "Skill priorities"));
    for (const [category, names] of Object.entries(ATTRIBUTES)) {
      const index = attributePriority.indexOf(category),
        budget = [5, 4, 3][index];
      if (index < 0 || spent(attributes, names, 1) !== budget)
        add(2, `attribute-${category}`, `${tr("Atributos", "Attributes")} ${category}`);
    }
    for (const [category, names] of Object.entries(SKILLS)) {
      const index = skillPriority.indexOf(category),
        budget = [11, 7, 4][index];
      if (index < 0 || spent(skills, names, 0) !== budget)
        add(2, `skill-${category}`, `${tr("Perícias", "Skills")} ${category}`);
    }
    if (meritSpent > meritBudget) add(3, "merits", tr("Méritos acima do limite", "Merits exceed the limit"));
    if (line === "CtL") {
      [
        ["seeming", seeming, "Feição"],
        ["kith", kith, "Fratria"],
        ["needle", needle, "Agulha"],
        ["thread", thread, "Fio"],
        ["favoredAttribute", favoredAttribute, "Atributo favorecido"],
        ["secondRegalia", secondRegalia, "Segunda Regalia"],
      ].forEach(([key, value, label]) => {
        if (!value) add(3, key, label);
      });
      if (customKith && (!customKithSkill || !customKithDescription.trim()))
        add(3, "kith", "Fratria personalizada completa");
      const favoredRegalia = [
        CTL_SEEMINGS[seeming as keyof typeof CTL_SEEMINGS]?.regalia ?? "",
        secondRegalia,
      ].filter(Boolean);
      if (
        contracts
          .slice(0, 4)
          .filter(
            (item) =>
              item.name &&
              item.type === "Comum" &&
              canSelectInitialContract(item, favoredRegalia, court),
          ).length !== 4 ||
        contracts
          .slice(4, 6)
          .filter(
            (item) =>
              item.name &&
              item.type === "Real" &&
              canSelectInitialContract(item, favoredRegalia, court),
          ).length !== 2
      )
        add(
          3,
          "contracts",
          tr("Quatro Contratos Comuns e dois Reais permitidos pelas Regalias e Corte", "Four Common Contracts and two Royal Contracts allowed by the selected Regalia and Court"),
        );
    } else {
      [
        ["path", path, "Caminho"],
        ["order", order, "Ordem"],
        ["virtue", virtue, "Virtude"],
        ["vice", vice, "Vício"],
        ["shadowName", shadowName, "Nome das Sombras"],
        ["nimbus", nimbus, "Nimbus"],
        ["tool", tool, "Ferramenta Mágica Dedicada"],
        ["resistanceBonus", resistanceBonus, "Atributo de Resistência"],
      ].forEach(([key, value, label]) => {
        if (!value) add(3, key, label);
      });
      arcanaCreationErrors(arcana, path ? pathData : undefined).forEach(
        (message) => add(3, "arcana", message),
      );
      if (
        order !== "Nameless" &&
        rotes
          .slice(0, 3)
          .filter(
            (item) =>
              item &&
              item.roteSkill &&
              meetsArcanaRequirements(item.requirements, arcana),
          ).length !== 3
      )
        add(3, "rotes", tr("Três Rotas utilizáveis e suas Perícias", "Three usable Rotes and their Skills"));
      if (
        praxes
          .slice(0, gnosis)
          .filter(
            (item) =>
              item && meetsArcanaRequirements(item.requirements, arcana),
          ).length !== gnosis
      )
        add(3, "praxes", `${gnosis} ${tr("Práxis utilizável(is)", "usable Praxis")}`);
    }
    return issues;
  }, [
    name,
    attributePriority,
    skillPriority,
    attributes,
    skills,
    specialties,
    meritSpent,
    meritBudget,
    aspirations,
    line,
    seeming,
    kith,
    court,
    needle,
    thread,
    touchstone,
    favoredAttribute,
    secondRegalia,
    customKith,
    customKithSkill,
    customKithDescription,
    contracts,
    path,
    order,
    virtue,
    vice,
    shadowName,
    nimbus,
    tool,
    resistanceBonus,
    arcana,
    pathData,
    rotes,
    praxes,
    gnosis,
    locale,
  ]);
  const missing = (key: string) =>
    validationIssues.some((issue) => issue.key === key);

  function validate(nextStep: number) {
    const current = validationIssues.filter((issue) => issue.step === step);
    if (current.length) {
      setError(
        `${tr("Ainda falta", "Still required")}: ${current.map((issue) => issue.label).join(", ")}.`,
      );
      return;
    }
    setError("");
    setStep(nextStep);
  }

  function finish() {
    setError("");
    if (validationIssues.length) {
      setError(
        `${tr("Ainda falta", "Still required")}: ${validationIssues.map((issue) => issue.label).join(", ")}.`,
      );
      setStep(validationIssues[0].step);
      return;
    }
    const finalAttributes = { ...attributes };
    const finalSkills = { ...skills };
    if (line === "CtL")
      finalAttributes[favoredAttribute] = Math.min(
        5,
        (finalAttributes[favoredAttribute] ?? 1) + 1,
      );
    else
      finalAttributes[resistanceBonus] = Math.min(
        5,
        (finalAttributes[resistanceBonus] ?? 1) + 1,
      );
    if (line === "MtA" && order !== "Nameless")
      finalSkills["Ocultismo"] = Math.min(
        5,
        (finalSkills["Ocultismo"] ?? 0) + 1,
      );
    const derived = {
      Tamanho: 5,
      Vitalidade: 5 + finalAttributes["Vigor"],
      Deslocamento: 5 + finalAttributes["Força"] + finalAttributes["Destreza"],
      ForçaDeVontade:
        finalAttributes["Perseverança"] + finalAttributes["Compostura"],
      Iniciativa: finalAttributes["Destreza"] + finalAttributes["Compostura"],
      Defesa:
        Math.min(finalAttributes["Destreza"], finalAttributes["Raciocínio"]) +
        finalSkills["Atletismo"],
      ...(line === "CtL"
        ? {
            LucidezMaxima:
              finalAttributes["Raciocínio"] + finalAttributes["Compostura"],
          }
        : { Sabedoria: 7 }),
    };
    const now = new Date().toISOString();
    const selectedKith = findKith(kith);
    const lineData =
      line === "CtL"
        ? {
            ...(initial?.line_data ?? {}),
            seeming,
            kith,
            court: court || "Sem Corte",
            needle,
            thread,
            touchstone,
            creation_wyrd: wyrd,
            wyrd: Math.min(10, wyrd + wyrdProgression.advancement),
            frailties: normalizeChangelingFrailties(initial?.line_data.frailties, wyrd + wyrdProgression.advancement),
            custom_court: customCourt,
            kith_custom: customKith,
            kith_skill: customKith
              ? customKithSkill
              : (selectedKith?.skill ?? ""),
            kith_description: customKith
              ? customKithDescription
              : (selectedKith?.description ?? ""),
            kith_blessing: customKith
              ? customKithDescription
              : (selectedKith?.blessing ?? ""),
            kith_source: customKith
              ? "Criação do jogador"
              : (selectedKith?.source ?? ""),
            kith_page: customKith ? 0 : (selectedKith?.page ?? 0),
            primary_regalia:
              CTL_SEEMINGS[seeming as keyof typeof CTL_SEEMINGS].regalia,
            second_regalia: secondRegalia,
            favored_attribute: favoredAttribute,
            aspirations,
            contracts,
            learned_contracts: initial?.line_data.learned_contracts ?? [],
            extra_contract_benefits:
              initial?.line_data.extra_contract_benefits ?? [],
            extra_contract_clauses:
              initial?.line_data.extra_contract_clauses ?? [],
          }
        : {
            ...(initial?.line_data ?? {}),
            path,
            order,
            custom_order: customOrder,
            virtue,
            vice,
            shadow_name: shadowName,
            nimbus,
            dedicated_tool: tool,
            resistance_bonus: resistanceBonus,
            creation_gnosis: gnosis,
            gnosis: Math.min(10, gnosis + gnosisProgression.advancement),
            wisdom: 7,
            aspirations,
            arcana,
            rotes: order === "Nameless" ? [] : rotes.filter(Boolean),
            praxes: praxes.slice(0, gnosis).filter(Boolean),
            ruling_arcana: pathData.ruling,
            inferior_arcanum: pathData.inferior,
            rote_skills:
              customOrder?.name === order
                ? customOrder.roteSkills
                : (MTA_ORDERS[order as keyof typeof MTA_ORDERS] ?? []),
          };
    const completed: CharacterSheet = {
      id: initial?.id ?? crypto.randomUUID(),
      schema_version: 2,
      system: "chronicles-of-darkness",
      game_line: line,
      ruleset: {
        id: line === "CtL" ? "ctl-2ed-embedded" : "mta-2ed-embedded",
        version: 1,
      },
      character: {
        name: name.trim(),
        concept: concept.trim(),
        player: playerName.trim(),
        chronicle: chronicle.trim(),
      },
      attributes: finalAttributes,
      skills: finalSkills,
      specializations: specialties.filter((item) => item.skill && item.name.trim()).map((item) => ({
        skill: item.skill,
        name: item.name.trim(),
      })),
      merits: [
        ...merits.map((item) => {
          const definition = meritCatalog.find(
            (entry) => entry.name === item.name,
          );
          return {
            ...item,
            configuration: normalizeMeritConfiguration(item.configuration),
            sourceId: definition?.sourceId,
            source: definition?.source,
          };
        }),
        ...(line === "CtL" && court && court !== "Sem Corte"
          ? [
              {
                name: "Mantle",
                dots:
                  initial?.merits.find(
                    (item) =>
                      item.name === "Mantle" &&
                      item.grantedBy === "Corte" &&
                      String(item.configuration?.court ?? "") === court,
                  )?.dots ?? 1,
                sourceId: "ctl-2ed",
                source: "Changeling the Lost",
                configuration: { court },
                grantedBy: "Corte",
              },
            ]
          : []),
        ...(line === "MtA" && order && order !== "Nameless"
          ? [
              {
                name: "High Speech",
                dots: 1,
                sourceId: "mta-2ed",
                source: "Mage the Awakening",
                configuration: {},
                grantedBy: "Ordem",
              },
            ]
          : []),
      ],
      line_data: lineData,
      derived,
      current_state: initial?.current_state ?? {},
      created_at: initial?.created_at ?? now,
      updated_at: now,
    };
    onSave(synchronizeMeritGrants(completed));
  }

  return (
    <section className="builder">
      <div className="builder-head">
        <Button variant="ghost" onClick={onCancel}>
          <ArrowLeft /> {tr("Voltar", "Back")}
        </Button>
        <div>
          <Badge variant="outline">{line}</Badge>
          <span>{tr("Criação guiada · regras compartilhadas v1", "Guided creation · shared rules v1")}</span>
        </div>
      </div>
      <div className="stepper">
        {[
          tr("Identidade", "Identity"),
          tr("Características", "Traits"),
          line === "CtL" ? tr("Modelo dos Perdidos", "Lost Template") : tr("Modelo dos Despertos", "Awakened Template"),
        ].map((label, index) => (
          <div
            key={label}
            className={
              step === index + 1
                ? "step active"
                : step > index + 1
                  ? "step done"
                  : "step"
            }
          >
            <span>{step > index + 1 ? <Check /> : index + 1}</span>
            <strong>{label}</strong>
          </div>
        ))}
      </div>
      {validationIssues.length > 0 && (
        <div className="builder-pending">
          <strong>
            {validationIssues.length}{" "}
            {validationIssues.length === 1
              ? tr("item pendente", "pending item")
              : tr("itens pendentes", "pending items")}
          </strong>
          <span>
            {validationIssues
              .slice(0, 6)
              .map((issue) => issue.label)
              .join(" · ")}
            {validationIssues.length > 6
              ? ` · +${validationIssues.length - 6}`
              : ""}
          </span>
        </div>
      )}
      {error && <div className="builder-error">{error}</div>}
      <div className="builder-body">
        {step === 1 && (
          <IdentityStep
            line={line}
            setLine={setLine}
            name={name}
            setName={setName}
            concept={concept}
            setConcept={setConcept}
            player={playerName}
            setPlayer={setPlayerName}
            chronicle={chronicle}
            setChronicle={setChronicle}
            shadowName={shadowName}
            setShadowName={setShadowName}
            missing={missing}
          />
        )}
        {step === 2 && (
          <TraitsStep
            attributes={attributes}
            setAttributes={setAttributes}
            skills={skills}
            setSkills={setSkills}
            attributePriority={attributePriority}
            setAttributePriority={setAttributePriority}
            skillPriority={skillPriority}
            setSkillPriority={setSkillPriority}
            specialties={specialties}
            setSpecialties={setSpecialties}
            missing={missing}
          />
        )}
        {step === 3 &&
          (line === "CtL" ? (
            <CtlStep
              {...{
                seeming,
                setSeeming,
                attributes,
                kith,
                setKith,
                customKith,
                setCustomKith,
                customKithSkill,
                setCustomKithSkill,
                customKithDescription,
                setCustomKithDescription,
                court,
                setCourt,
                customCourt,
                setCustomCourt,
                needle,
                setNeedle,
                thread,
                setThread,
                touchstone,
                setTouchstone,
                wyrd,
                setWyrd,
                powerAdvancement: wyrdProgression.advancement,
                secondRegalia,
                setSecondRegalia,
                favoredAttribute,
                setFavoredAttribute,
                contracts,
                setContracts,
                contractCatalog,
                kithCatalog: homebrews.kiths.filter(item=>isHomebrewActive(homebrews,item.id)),
                courtCatalog: homebrews.courts.filter(item=>isHomebrewActive(homebrews,item.id)),
                aspirations,
                setAspirations,
                merits,
                setMerits,
                meritCatalog,
                meritBudget: Math.max(0, meritBudget - meritSpent),
                meritSpent,
                maximumPowerFromMerits,
                missing,
              }}
            />
          ) : (
            <MtaStep
              {...{
                path,
                setPath,
                order,
                setOrder,
                customOrder,
                setCustomOrder,
                virtue,
                setVirtue,
                vice,
                setVice,
                nimbus,
                setNimbus,
                tool,
                setTool,
                resistanceBonus,
                setResistanceBonus,
                gnosis,
                setGnosis,
                powerAdvancement: gnosisProgression.advancement,
                arcana,
                setArcana,
                rotes,
                setRotes,
                praxes,
                setPraxes,
                spellCatalog,
                orderCatalog: homebrews.orders.filter(item=>isHomebrewActive(homebrews,item.id)),
                aspirations,
                setAspirations,
                merits,
                setMerits,
                meritCatalog,
                meritBudget: Math.max(0, meritBudget - meritSpent),
                meritSpent,
                maximumPowerFromMerits,
                missing,
              }}
            />
          ))}
      </div>
      <div className="builder-actions">
        {step > 1 && (
          <Button variant="outline" onClick={() => setStep(step - 1)}>
            <ArrowLeft /> {tr("Anterior", "Previous")}
          </Button>
        )}
        <span />
        {step < 3 ? (
          <Button onClick={() => validate(step + 1)}>
            {tr("Continuar", "Continue")} <ArrowRight />
          </Button>
        ) : (
          <Button onClick={finish}>
            <Save /> {tr("Salvar ficha localmente", "Save character locally")}
          </Button>
        )}
      </div>
    </section>
  );
}

function IdentityStep({
  line,
  setLine,
  name,
  setName,
  concept,
  setConcept,
  player,
  setPlayer,
  chronicle,
  setChronicle,
  shadowName,
  setShadowName,
  missing,
}: any) {
  const { tr } = useLanguage();
  return (
    <div className="builder-section">
      <span className="kicker">{tr("PASSO 1", "STEP 1")}</span>
      <h2>{tr("Quem atravessou a escuridão?", "Who crossed into darkness?")}</h2>
      <p>{tr("Escolha a linha principal. Ela determina todas as próximas opções.", "Choose the main game line. It determines every option that follows.")}</p>
      <div className="line-choice">
        <button
          className={`ctl-line-choice ${line === "CtL" ? "selected" : ""}`}
          onClick={() => setLine("CtL")}
        >
          <Badge>CtL</Badge>
          <strong>Changeling the Lost</strong>
          <small>{tr("Fonte principal", "Core source")}: Changeling the Lost 2e</small>
        </button>
        <button
          className={`mta-line-choice ${line === "MtA" ? "selected" : ""}`}
          onClick={() => setLine("MtA")}
        >
          <Badge>MtA</Badge>
          <strong>Mage the Awakening</strong>
          <small>{tr("Fonte principal", "Core source")}: Mage the Awakening 2e</small>
        </button>
      </div>
      <div className="form-grid">
        <label className={missing("name") ? "missing-field" : ""}>
          {tr("Nome", "Name")}
          <Input value={name} onChange={(e) => setName(e.target.value)} />
        </label>
        <label>
          {tr("Jogador", "Player")}
          <Input
            value={player}
            onChange={(event) => setPlayer(event.target.value)}
            placeholder={tr("Nome do jogador", "Player name")}
          />
        </label>
        <label>
          {tr("Crônica", "Chronicle")}
          <Input
            value={chronicle}
            onChange={(event) => setChronicle(event.target.value)}
            placeholder={tr("Nome da crônica", "Chronicle name")}
          />
        </label>
        {line === "MtA" && (
          <label className={missing("shadowName") ? "missing-field" : ""}>
            {tr("Nome das Sombras", "Shadow Name")}
            <Input
              value={shadowName}
              onChange={(event) => setShadowName(event.target.value)}
              placeholder={tr("Nome mágico do personagem", "Character's magical name")}
            />
          </label>
        )}
        <label className="full">
          {tr("Conceito", "Concept")}
          <Input
            value={concept}
            onChange={(e) => setConcept(e.target.value)}
            placeholder={tr("Uma frase curta", "A short phrase")}
          />
        </label>
      </div>
    </div>
  );
}

function editableSkills(initial?: CharacterSheet | null) {
  const values = initial?.skills
    ? { ...initial.skills }
    : initialDots(SKILLS, 0);
  if (
    initial?.game_line === "MtA" &&
    String(initial.line_data.order ?? "") !== "Nameless" &&
    values["Ocultismo"] > 0
  ) {
    values["Ocultismo"] -= 1;
  }
  return values;
}

function TraitsStep(props: any) {
  const { locale, tr } = useLanguage();
  const allSkills = Object.values(SKILLS).flat();
  return (
    <div className="builder-section">
      <span className="kicker">{tr("PASSO 2", "STEP 2")}</span>
      <h2>{tr("Atributos e Perícias", "Attributes and Skills")}</h2>
      <p>
        {tr("Defina a prioridade das categorias e distribua exatamente os pontos indicados.", "Set the category priorities and distribute exactly the indicated points.")}
      </p>
      <PriorityRow
        labels={attributeCategories}
        values={props.attributePriority}
        setValues={props.setAttributePriority}
        budgets={[5, 4, 3]}
        invalid={props.missing("attribute-priority")}
      />
      <DotGroups
        groups={ATTRIBUTES}
        values={props.attributes}
        setValues={props.setAttributes}
        base={1}
        max={5}
        priority={props.attributePriority}
        budgets={[5, 4, 3]}
        missing={props.missing}
      />
      <div className="section-divider" />
      <PriorityRow
        labels={skillCategories}
        values={props.skillPriority}
        setValues={props.setSkillPriority}
        budgets={[11, 7, 4]}
        invalid={props.missing("skill-priority")}
      />
      <DotGroups
        groups={SKILLS}
        values={props.skills}
        setValues={props.setSkills}
        base={0}
        max={5}
        priority={props.skillPriority}
        budgets={[11, 7, 4]}
        missing={props.missing}
      />
      <div className="section-divider" />
      <h3>{tr("Especializações", "Specialties")}</h3>
      <p>
        {tr("Escolha uma Perícia e escreva a área específica. A mesma Perícia pode ser escolhida mais de uma vez.", "Choose a Skill and enter a specific area. The same Skill may be chosen more than once.")}
      </p>
      <div className="specialty-grid">
        {props.specialties.map((value: Specialty, index: number) => {
          const listId = `specialties-${index}`;
          return (
            <div
              className={`specialty-row ${props.missing(`specialty-${index}`) ? "missing-field" : ""}`}
              key={index}
            >
              <Choice
                label={`${tr("Perícia", "Skill")} ${index + 1}`}
                value={value.skill}
                setValue={(skill) =>
                  updateArray(props.setSpecialties, props.specialties, index, {
                    ...value,
                    skill,
                    name: "",
                  })
                }
                options={allSkills}
              />
              <label>
                {tr("Especialização", "Specialty")}
                <Input
                  list={listId}
                  value={value.name}
                  onChange={(e) =>
                    updateArray(
                      props.setSpecialties,
                      props.specialties,
                      index,
                      { ...value, name: e.target.value },
                    )
                  }
                  placeholder={
                    value.skill
                      ? tr("Escolha uma sugestão ou escreva outra", "Choose a suggestion or type another")
                      : tr("Selecione primeiro a Perícia", "Select the Skill first")
                  }
                  disabled={!value.skill}
                />
                <datalist id={listId}>
                  {alphabetical(skillSpecialtySuggestions(value.skill, locale), name => name, locale).map(
                    (item) => (
                      <option value={item} key={item} />
                    ),
                  )}
                </datalist>
              </label>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function CtlStep(props: any) {
  const { locale, tr } = useLanguage();
  const seemingData = CTL_SEEMINGS[props.seeming as keyof typeof CTL_SEEMINGS];
  const availableRegalia = [
    ...REGALIA,
    ...props.contractCatalog
      .filter(
        (item: ContractDefinition & { categoryKind?: string }) =>
          item.categoryKind === "Regalia",
      )
      .map((item: ContractDefinition) => item.regalia),
  ].filter((item, index, values) => values.indexOf(item) === index);
  const favored = seemingData ? favoredChoices(seemingData.favored).filter((attribute) => Number(props.attributes?.[attribute] ?? 1) < 5) : [];
  useEffect(() => {
    if (props.favoredAttribute && !favored.includes(props.favoredAttribute)) props.setFavoredAttribute("");
  }, [props.favoredAttribute, props.setFavoredAttribute, favored.join("|")]);
  const powerOptions = Array.from(
    { length: props.maximumPowerFromMerits },
    (_, index) => String(index + 1),
  );
  return (
    <div className="builder-section">
      <span className="kicker">{tr("PASSO 3 · CHANGELING", "STEP 3 · CHANGELING")}</span>
      <h2>{tr("Modelo dos Perdidos", "Lost Template")}</h2>
      <p>{tr("As escolhas e limites abaixo vêm de Changeling the Lost.", "The choices and limits below come from Changeling the Lost.")}</p>
      <div className="form-grid thirds">
        <Choice
          label={tr("Feição", "Seeming")}
          value={props.seeming}
          setValue={props.setSeeming}
          options={Object.keys(CTL_SEEMINGS)}
          invalid={props.missing("seeming")}
        />
        <div className={props.missing("kith") ? "missing-field" : ""}>
          <KithSelector {...props} />
        </div>
        <div className={props.missing("court") ? "missing-field" : ""}>
          <CourtSelector {...props} />
        </div>
        <Choice
          label={tr("Agulha", "Needle")}
          value={props.needle}
          setValue={props.setNeedle}
          options={CTL_NEEDLES}
          invalid={props.missing("needle")}
        />
        <Choice
          label={tr("Fio", "Thread")}
          value={props.thread}
          setValue={props.setThread}
          options={CTL_THREADS}
          invalid={props.missing("thread")}
        />
        <label className={props.missing("touchstone") ? "missing-field" : ""}>
          {tr("Pedra de Contato", "Touchstone")}
          <Input
            value={props.touchstone}
            onChange={(e) => props.setTouchstone(e.target.value)}
          />
        </label>
        <Choice
          label={tr("Atributo favorecido (+1)", "Favored Attribute (+1)")}
          value={props.favoredAttribute}
          setValue={props.setFavoredAttribute}
          options={favored}
          invalid={props.missing("favoredAttribute")}
        />
        <Choice
          label={tr("Segunda Regalia favorecida", "Second favored Regalia")}
          value={props.secondRegalia}
          setValue={props.setSecondRegalia}
          options={availableRegalia.filter(
            (item) => item !== seemingData?.regalia,
          )}
          invalid={props.missing("secondRegalia")}
        />
        <Choice
          label={props.powerAdvancement ? tr("Fado na criação", "Wyrd at creation") : tr("Fado", "Wyrd")}
          value={String(props.wyrd)}
          setValue={(value) => props.setWyrd(Number(value))}
          options={powerOptions}
        />
      </div>
      <p className="rule-callout">
        <ShieldCheck /> {props.powerAdvancement > 0 && <>{tr("Fado atual", "Current Wyrd")}: <strong>{Math.min(10, props.wyrd + props.powerAdvancement)}</strong> ({props.powerAdvancement} {tr("por experiência preservados", "preserved from Experiences")}) · </>}{tr("Regalia da Feição", "Seeming Regalia")}:{" "}
        <strong>{seemingData ? systemTerm(seemingData.regalia, locale) : tr("selecione a Feição", "select a Seeming")}</strong> ·
        {tr("Méritos disponíveis", "Available Merits")}: <strong>{props.meritBudget}</strong>
      </p>
      <Aspirations
        values={props.aspirations}
        setValues={props.setAspirations}
        missing={props.missing}
      />
      <div className={props.missing("contracts") ? "missing-field block" : ""}>
        <ContractSelector
          contracts={props.contracts}
          setContracts={props.setContracts}
          seeming={props.seeming}
          primaryRegalia={seemingData?.regalia ?? ""}
          secondRegalia={props.secondRegalia}
          court={props.court}
          catalog={props.contractCatalog}
        />
      </div>
      <div className={props.missing("merits") ? "missing-field block" : ""}>
        <Merits
          merits={props.merits}
          setMerits={props.setMerits}
          catalog={props.meritCatalog}
          spent={props.meritSpent}
          budget={props.meritBudget}
        />
      </div>
    </div>
  );
}

function CourtSelector(props: any) {
  const { locale, tr } = useLanguage();
  const [saved, setSaved] = useState<CustomCourtDefinition[]>(props.courtCatalog ?? []);
  const emptyCourt = (): CustomCourtDefinition => ({
    name: "",
    emotion: "",
    mantleBenefits: ["", "", "", "", ""],
  });
  const copyCourt = (
    court: CustomCourtDefinition | null | undefined,
  ): CustomCourtDefinition =>
    court
      ? { ...court, mantleBenefits: [...court.mantleBenefits] }
      : emptyCourt();
  const [creating, setCreating] = useState(false);
  const [draft, setDraft] = useState<CustomCourtDefinition>(() =>
    copyCourt(props.customCourt),
  );
  const save = () => {
    if (
      !draft.name.trim() ||
      !draft.emotion.trim() ||
      draft.mantleBenefits.some((item) => !item.trim())
    )
      return;
    const next = [...saved.filter((item) => item.name !== draft.name), draft];
    setSaved(next);
    localStorage.setItem(
      "arquivo-das-trevas:custom-courts",
      JSON.stringify(next),
    );
    props.setCourt(draft.name);
    props.setCustomCourt(draft);
    setCreating(false);
  };
  const select = (name: string) => {
    const custom = saved.find((item) => item.name === name) ?? null;
    props.setCourt(name);
    props.setCustomCourt(custom);
    setDraft(copyCourt(custom));
    setCreating(false);
  };
  const cancelCreation = () => {
    setDraft(copyCourt(props.customCourt));
    setCreating(false);
  };
  const officialCourt = courtPresentation(props.court, locale);
  const courtLabels = Object.fromEntries([
    ["Sem Corte", tr("Sem Corte", "Courtless")],
    ...CTL_COURTS.filter((name) => name !== "Sem Corte").map((name) => [name, courtDisplayName(name, locale)]),
  ]);
  return (
    <div className="kith-field">
      <span>{tr("Corte", "Court")}</span>
      <div className="kith-current">
        <strong>{props.court ? courtDisplayName(props.court, locale) : tr("Nenhuma selecionada", "None selected")}</strong>
        <small>
          {!props.court
            ? tr("Nenhuma Corte selecionada: o personagem será salvo como Sem Corte.", "No Court selected: the character will be saved as Courtless.")
            : props.customCourt
            ? `${props.customCourt.emotion} · ${tr("Corte criada pelo jogador", "Player-created Court")}`
            : officialCourt
              ? `${officialCourt.emotion} · ${tr("A Corte concede Manto 1 automaticamente", "The Court grants Mantle 1 automatically")}`
              : tr("Sem benefícios de Manto.", "No Mantle benefits.")}
        </small>
      </div>
      <Dialog>
        <DialogTrigger asChild>
          <Button type="button" variant="outline">
            <Search /> {tr("Selecionar Corte", "Select Court")}
          </Button>
        </DialogTrigger>
        <DialogContent className="merit-dialog">
          <DialogHeader>
            <DialogTitle>{tr("Selecionar ou criar Corte", "Select or create Court")}</DialogTitle>
            <DialogDescription>
              {tr("Uma Corte personalizada precisa de sentimento e dos benefícios de Manto de 1 a 5.", "A custom Court requires an emotion and Mantle benefits from 1 to 5.")}
            </DialogDescription>
          </DialogHeader>
          <Choice
            label={tr("Corte", "Court")}
            value={props.court || "__none"}
            setValue={(value) => select(value === "__none" ? "" : value)}
            options={[
              "__none",
              ...CTL_COURTS,
              ...saved.map((item) => item.name),
            ]}
            optionLabels={{ __none: tr("Selecione uma Corte", "Select a Court"), ...courtLabels }}
          />
          <Button
            type="button"
            variant={creating ? "secondary" : "outline"}
            onClick={() => {
              setDraft(copyCourt(props.customCourt));
              setCreating(true);
            }}
          >
            <Plus /> {props.customCourt ? tr("Editar Corte", "Edit Court") : tr("Criar Corte", "Create Court")}
          </Button>
          {creating && (
            <div className="custom-kith-editor">
              <label>
                {tr("Nome da Corte", "Court name")}
                <Input
                  value={draft.name}
                  maxLength={80}
                  onChange={(event) =>
                    setDraft({ ...draft, name: event.target.value })
                  }
                />
              </label>
              <label>
                {tr("Sentimento da Corte", "Court emotion")}
                <Input
                  value={draft.emotion}
                  maxLength={80}
                  onChange={(event) =>
                    setDraft({
                      ...draft,
                      emotion: event.target.value,
                    })
                  }
                />
              </label>
              {draft.mantleBenefits.map((value, index) => (
                <label className="full" key={index}>
                  {tr("Manto", "Mantle")} {index + 1}
                  <textarea
                    value={value}
                    onChange={(event) => {
                      const benefits = [...draft.mantleBenefits];
                      benefits[index] = event.target.value;
                      setDraft({
                        ...draft,
                        mantleBenefits: benefits,
                      });
                    }}
                    placeholder={`${tr("Benefício concedido por Manto", "Benefit granted by Mantle")} ${index + 1}`}
                  />
                </label>
              ))}
              <div className="custom-court-actions full">
                <Button type="button" variant="outline" onClick={cancelCreation}>
                  <X /> {tr("Cancelar", "Cancel")}
                </Button>
                <Button
                  type="button"
                  onClick={save}
                  disabled={
                    !draft.name.trim() ||
                    !draft.emotion.trim() ||
                    draft.mantleBenefits.some((item) => !item.trim())
                  }
                >
                  {tr("Salvar e selecionar Corte", "Save and select Court")}
                </Button>
              </div>
            </div>
          )}
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                {tr("Concluir", "Done")}
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function KithSelector(props: any) {
  const { locale, tr } = useLanguage();
  const [search, setSearch] = useState("");
  const [creating, setCreating] = useState(Boolean(props.customKith));
  const normalized = kithSearchText(search);
  const kithName = (item: KithDefinition & {homebrew?:true}) => locale === "pt-BR" ? (item.translatedName ?? item.name) : item.name;
  const kithText = (item: KithDefinition & {homebrew?:true}) => item.homebrew
    ? {name:item.name,description:item.description,blessing:item.blessing,skill:item.skill}
    : kithPresentation(item.id,locale);
  const allKiths: Array<KithDefinition & {homebrew?:true}> = [...KITHS, ...(props.kithCatalog ?? [])].sort((a,b)=>kithName(a).localeCompare(kithName(b),locale));
  const selected = props.customKith ? allKiths.find(item=>item.homebrew && item.name===props.kith) : findKith(props.kith);
  const filtered = allKiths.filter(
    (item) =>
      !normalized ||
      kithSearchText(`${item.translatedName ?? ""} ${item.name} ${item.skill} ${item.description} ${item.blessing} ${item.source}`)
        .includes(normalized),
  );
  const choose = (item: KithDefinition & {homebrew?:true}) => {
    props.setKith(item.name);
    props.setCustomKith(Boolean(item.homebrew));
    props.setCustomKithSkill(item.skill);
    props.setCustomKithDescription(item.description);
    setCreating(false);
  };
  const chooseCustom = () => {
    props.setCustomKith(true);
    props.setKith(props.customKith ? props.kith : "");
    setCreating(true);
  };
  return (
    <div className="kith-field">
      <span>{tr("Fratria", "Kith")}</span>
      <div className="kith-current">
        <strong>{(selected ? kithName(selected) : kithDisplayName(props.kith, props.customKith, locale)) || tr("Nenhuma selecionada", "None selected")}</strong>
        <small>
          {props.customKith
            ? `${props.customKithSkill || tr("Perícia não escolhida", "Skill not selected")} · ${tr("Criação do jogador", "Player creation")}`
            : selected
              ? `${kithText(selected).skill} · ${selected.source} · p. ${selected.page}`
              : tr("Abra o catálogo para escolher", "Open the catalog to choose")}
        </small>
      </div>
      <Dialog>
        <DialogTrigger asChild>
          <Button type="button" variant="outline">
            <Search /> {tr("Selecionar Fratria", "Select Kith")}
          </Button>
        </DialogTrigger>
        <DialogContent className="merit-dialog kith-dialog">
          <DialogHeader>
            <DialogTitle>{tr("Selecionar Fratria", "Select Kith")}</DialogTitle>
            <DialogDescription>
              {tr("Consulte descrição, Perícia e Bênção antes de escolher.", "Review the description, Skill, and Blessing before choosing.")}
            </DialogDescription>
          </DialogHeader>
          <label className="merit-search">
            <Search aria-hidden="true" />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={tr("Buscar Fratria, Perícia ou fonte…", "Search Kith, Skill, or source…")}
            />
          </label>
          <div className="kith-create-toggle">
            <Button
              type="button"
              variant={creating ? "secondary" : "outline"}
              onClick={chooseCustom}
            >
              <Plus /> {tr("Criar Kith", "Create Kith")}
            </Button>
            {creating && <Badge variant="outline">{tr("Fratria personalizada", "Custom Kith")}</Badge>}
          </div>
          {creating && (
            <div className="custom-kith-editor">
              <label>
                {tr("Nome", "Name")}
                <Input
                  value={props.kith}
                  onChange={(e) => props.setKith(e.target.value)}
                  maxLength={80}
                  placeholder={tr("Nome da Fratria", "Kith name")}
                />
              </label>
              <Choice
                label={tr("Perícia", "Skill")}
                value={props.customKithSkill}
                setValue={props.setCustomKithSkill}
                options={Object.values(SKILLS).flat()}
              />
              <label className="full">
                {tr("Descrição da Bênção", "Blessing description")}
                <textarea
                  value={props.customKithDescription}
                  onChange={(e) =>
                    props.setCustomKithDescription(e.target.value.slice(0, 350))
                  }
                  maxLength={350}
                  placeholder={tr("Descreva a Bênção da Fratria em até 350 caracteres.", "Describe the Kith Blessing in up to 350 characters.")}
                />
                <small>
                  {props.customKithDescription.length}/350 {tr("caracteres", "characters")}
                </small>
              </label>
            </div>
          )}
          <div className="merit-catalog">
            <section className="merit-category">
              <h3>
                {tr("Fratrias", "Kiths")} <Badge variant="outline">{filtered.length}</Badge>
              </h3>
              <div>
                {filtered.map((item) => {
                  const presentation=kithText(item);
                  const isSelected =
                    selected?.id === item.id;
                  return (
                    <article
                      className={
                        isSelected ? "merit-option selected" : "merit-option"
                      }
                      key={item.id}
                    >
                      <div>
                        <strong>{kithName(item)}</strong>
                        {locale === "pt-BR" && item.translatedName && item.translatedName !== item.name && <small>{item.name}</small>}
                        <small>
                          {presentation.skill} · {item.source} · p. {item.page}
                        </small>
                        <p>{presentation.description}</p>
                        <p className="rule-detail">
                          <strong>{tr("Bênção", "Blessing")}:</strong> {presentation.blessing}
                        </p>
                      </div>
                      <Button
                        type="button"
                        size="sm"
                        variant={isSelected ? "secondary" : "outline"}
                        disabled={isSelected}
                        onClick={() => choose(item)}
                      >
                        {isSelected ? (
                          <>
                            <Check />
                            {tr("Selecionada", "Selected")}
                          </>
                        ) : (
                          <>
                            <Plus />
                            {tr("Escolher", "Choose")}
                          </>
                        )}
                      </Button>
                    </article>
                  );
                })}
              </div>
            </section>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button">{tr("Concluir", "Done")}</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function ContractSelector({
  contracts,
  setContracts,
  seeming,
  primaryRegalia,
  secondRegalia,
  court,
  catalog,
}: {
  contracts: ContractSelection[];
  setContracts: (value: ContractSelection[]) => void;
  seeming: string;
  primaryRegalia: string;
  secondRegalia: string;
  court: string;
  catalog: ContractDefinition[];
}) {
  const { locale, tr } = useLanguage();
  const contractName = (item: ContractDefinition | ContractSelection) => locale === "pt-BR" ? item.name : (item.originalName || item.name);
  const [search, setSearch] = useState("");
  const normalizedSearch = search.trim().toLocaleLowerCase("pt-BR");
  const availableContracts = alphabetical(catalog, contractName,locale).filter((contract) =>
    canSelectInitialContract(
      contract,
      [primaryRegalia, secondRegalia].filter(Boolean),
      court,
    ),
  );
  const contractGroups = [
    ...REGALIA,
    ...availableContracts.map((item) => item.regalia).filter(
      (item) => !REGALIA.includes(item),
    ),
  ];
  const groups = alphabetical([...new Set(contractGroups)], value => builderText(locale,value),locale)
    .map((regalia) => ({
      regalia,
      items: availableContracts.filter(
        (item) =>
          item.regalia === regalia &&
          (!normalizedSearch ||
            `${item.name} ${item.originalName} ${item.source} ${item.description} ${item.dicePool}`
              .toLocaleLowerCase("pt-BR")
              .includes(normalizedSearch)),
      ),
    }))
    .filter((group) => group.items.length);
  function addContract(contract: ContractDefinition) {
    if (
      contracts.some(
        (item) =>
          item.id === contract.id ||
          item.originalName === contract.originalName,
      )
    )
      return;
    const start = contract.type === "Comum" ? 0 : 4;
    const end = contract.type === "Comum" ? 4 : 6;
    const slot = contracts.findIndex(
      (item, index) => index >= start && index < end && !item.name,
    );
    if (slot < 0) return;
    const next = [...contracts];
    next[slot] = { ...contract };
    setContracts(next);
  }
  function removeContract(index: number) {
    const next = [...contracts];
    next[index] = emptyContract(index < 4 ? "Comum" : "Real");
    setContracts(next);
  }
  return (
    <>
      <div className="merit-heading">
        <div>
          <h3>{tr("Contratos iniciais", "Starting Contracts")}</h3>
          <p>
            {tr("Selecione quatro Contratos Comuns — incluindo Contratos Goblin — e dois Reais. Passe o mouse sobre uma escolha para rever todos os detalhes.", "Select four Common Contracts — including Goblin Contracts — and two Royal Contracts. Hover over a choice to review all details.")}
          </p>
        </div>
        <Badge variant="outline">
          {contracts.filter((item) => item.name).length}/6 {tr("selecionados", "selected")}
        </Badge>
      </div>
      <div className="contract-grid">
        {contracts.map((item, index) => (
          <div key={index} title={contractTooltip(item, seeming,locale)}>
            <Badge
              variant={
                item.goblin ? "default" : index < 4 ? "secondary" : "outline"
              }
            >
              {item.goblin ? "Goblin" : index < 4 ? tr("Comum", "Common") : tr("Real", "Royal")}
            </Badge>
            <div>
              <strong>{item.name ? contractName(item) : tr("Vaga disponível", "Available slot")}</strong>
              <small>
                {item.name
                  ? `${systemTerm(item.regalia,locale)} · ${item.source} · p. ${item.page || "—"}`
                  : tr("Escolha no catálogo", "Choose from the catalog")}
              </small>
            </div>
            {item.name ? (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label={`${tr("Remover", "Remove")} ${contractName(item)}`}
                onClick={() => removeContract(index)}
              >
                <Trash2 />
              </Button>
            ) : (
              <span />
            )}
          </div>
        ))}
      </div>
      <Dialog>
        <DialogTrigger asChild>
          <Button type="button" variant="outline">
            <Plus /> {tr("Selecionar contratos", "Select Contracts")}
          </Button>
        </DialogTrigger>
        <DialogContent className="merit-dialog">
          <DialogHeader>
            <DialogTitle>{tr("Selecionar contratos", "Select Contracts")}</DialogTitle>
            <DialogDescription>
              {tr("Separados por Regalia, com efeito, brecha, parada de dados e o benefício da Feição atual. Contratos Goblin ocupam vagas de Contrato Comum e geram Débito Goblin quando invocados com sucesso. Contratos Reais respeitam suas Regalias favorecidas; Contratos de Corte respeitam a Corte selecionada.", "Grouped by Regalia, with effect, loophole, dice pool, and the current Seeming benefit. Goblin Contracts fill Common Contract slots and generate Goblin Debt when successfully invoked. Royal Contracts follow favored Regalia; Court Contracts follow the selected Court.")}
            </DialogDescription>
          </DialogHeader>
          <label className="merit-search">
            <Search aria-hidden="true" />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={tr("Buscar contrato, Regalia ou fonte…", "Search Contract, Regalia, or source…")}
            />
          </label>
          <div className="merit-catalog">
            {groups.map(({ regalia, items }) => (
              <section className="merit-category" key={regalia}>
                <h3>
                  {systemTerm(regalia,locale)} <Badge variant="outline">{items.length}</Badge>
                </h3>
                <div>
                  {items.map((contract) => {
                    const presented = contractPresentation(contract, locale);
                    const summary = contractSummary(contract, locale);
                    const displayOptions = contractDisplayOptions(presented, locale);
                    const outcomeSections = contractOutcomeSections(presented, locale);
                    const selected = contracts.some(
                      (item) =>
                        item.id === contract.id ||
                        item.originalName === contract.originalName,
                    );
                    const full =
                      contract.type === "Comum"
                        ? contracts.slice(0, 4).every((item) => item.name)
                        : contracts.slice(4).every((item) => item.name);
                    const benefit =
                      presented.seemingBenefits?.[
                        seeming as keyof typeof presented.seemingBenefits
                      ];
                    return (
                      <article
                        className={
                          selected ? "merit-option selected" : "merit-option"
                        }
                        key={contract.id}
                      >
                        <div>
                          <strong>{contractName(contract)}</strong>
                          <small>
                            {contract.goblin ? "Goblin" : contract.type === "Comum" ? tr("Comum", "Common") : tr("Real", "Royal")}{" "}
                            · {contract.source} · p. {contract.page || "—"}
                          </small>
                          {summary && <p className="rule-detail">
                            <strong>{tr("Resumo", "Summary")}:</strong> {summary}
                          </p>}
                          {contractHasInvocationRoll(presented) === true && <p className="rule-detail">
                            <strong>{tr("Parada de dados", "Dice Pool")}:</strong>{" "}
                            {presented.dicePool ?? tr("Não informada", "Not listed")}
                          </p>}
                          {presented.cost && (
                            <p className="rule-detail">
                              <strong>{tr("Custo", "Cost")}:</strong> {presented.cost}
                            </p>
                          )}
                          <p className="rule-detail">
                            <strong>{tr("Ação / Duração", "Action / Duration")}:</strong>{" "}
                            {presented.action ?? tr("Instantânea", "Instant")} ·{" "}
                            {presented.duration ?? tr("Cena", "Scene")}
                          </p>
                          {outcomeSections.slice(0, 1).map((section) => (
                            <p className="rule-detail" key={section.label}>
                              <strong>{section.label}:</strong> {section.text}
                            </p>
                          ))}
                          {displayOptions.length > 0 && (
                            <div className="contract-options">
                              <strong>{tr("Opções", "Options")}</strong>
                              <ul>
                                {displayOptions.map((option) => (
                                  <li key={option}>{option}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                          {presented.detailTables?.map((table) => (
                            <div className="contract-detail-table" key={table.title}>
                              <strong>{table.title}</strong>
                              <table><thead><tr>{table.columns.map((column) => <th key={column}>{column}</th>)}</tr></thead><tbody>{table.rows.map((row) => <tr key={row.join("::")}>{row.map((cell, cellIndex) => <td key={cellIndex}>{cell}</td>)}</tr>)}</tbody></table>
                            </div>
                          ))}
                          {outcomeSections.slice(1).map((section) => (
                            <p className="rule-detail" key={section.label}>
                              <strong>{section.label}:</strong> {section.text}
                            </p>
                          ))}
                          <p className="rule-detail">
                            <strong>{tr("Brecha", "Loophole")}:</strong> {presented.loophole}
                          </p>
                          {contract.goblinDebt && (
                            <p className="rule-detail goblin-debt-note">
                              <strong>{tr("Débito Goblin", "Goblin Debt")}:</strong>{" "}
                              {contract.goblinDebt}
                            </p>
                          )}
                          {benefit && (
                            <p className="rule-detail">
                              <strong>
                                {tr("Benefício de", "Benefit for")}{" "}
                                {seemingDisplayName(seeming,locale)}:
                              </strong>{" "}
                              {benefit}
                            </p>
                          )}
                        </div>
                        <Button
                          type="button"
                          size="sm"
                          variant={selected ? "secondary" : "outline"}
                          disabled={selected || full}
                          onClick={() => addContract(contract)}
                        >
                          {selected ? (
                            <>
                              <Check />
                              {tr("Selecionado", "Selected")}
                            </>
                          ) : full ? (
                            tr("Vagas preenchidas", "Slots filled")
                          ) : (
                            <>
                              <Plus />
                              {tr("Adicionar", "Add")}
                            </>
                          )}
                        </Button>
                      </article>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button">{tr("Concluir", "Done")}</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

function OrderSelector(props: any) {
  const { tr } = useLanguage();
  const [saved, setSaved] = useState<CustomOrderDefinition[]>(props.orderCatalog ?? []);
  const [creating, setCreating] = useState(false);
  const draft: CustomOrderDefinition = props.customOrder ?? {
    name: "",
    description: "",
    roteSkills: ["", "", ""],
  };
  const allSkills = Object.values(SKILLS).flat();
  const select = (name: string) => {
    const custom = saved.find((item) => item.name === name) ?? null;
    props.setOrder(name);
    props.setCustomOrder(custom);
  };
  const valid = Boolean(
    draft.name.trim() &&
    draft.description.trim() &&
    draft.roteSkills.length === 3 &&
    draft.roteSkills.every(Boolean) &&
    new Set(draft.roteSkills).size === 3,
  );
  const save = () => {
    if (!valid) return;
    const next = [...saved.filter((item) => item.name !== draft.name), draft];
    setSaved(next);
    localStorage.setItem(
      "arquivo-das-trevas:custom-orders",
      JSON.stringify(next),
    );
    props.setOrder(draft.name);
    props.setCustomOrder(draft);
    setCreating(false);
  };
  return (
    <div className={`kith-field ${props.invalid ? "missing-field" : ""}`}>
      <span>{tr("Ordem", "Order")}</span>
      <div className="kith-current">
        <strong>
          {(MTA_ORDER_LABELS[props.order] ?? props.order) ||
            tr("Nenhuma selecionada", "None selected")}
        </strong>
        <small>
          {props.customOrder
            ? `${props.customOrder.roteSkills.join(", ")} · ${tr("Ordem criada pelo jogador", "Player-created Order")}`
            : props.order === "Nameless"
              ? tr("Sem benefícios de Ordem", "No Order benefits")
              : tr("A Ordem define três Perícias de Rota", "The Order defines three Rote Skills")}
        </small>
      </div>
      <Dialog>
        <DialogTrigger asChild>
          <Button type="button" variant="outline">
            <Search /> {tr("Selecionar Ordem", "Select Order")}
          </Button>
        </DialogTrigger>
        <DialogContent className="merit-dialog">
          <DialogHeader>
            <DialogTitle>{tr("Selecionar ou criar Ordem", "Select or create Order")}</DialogTitle>
            <DialogDescription>
              {tr("Uma Ordem personalizada define sua identidade e três Perícias de Rota distintas.", "A custom Order defines its identity and three distinct Rote Skills.")}
            </DialogDescription>
          </DialogHeader>
          <Choice
            label={tr("Ordem", "Order")}
            value={props.order || "__none"}
            setValue={(value: string) =>
              select(value === "__none" ? "" : value)
            }
            options={[
              "__none",
              ...Object.keys(MTA_ORDERS),
              ...saved.map((item) => item.name),
            ]}
            optionLabels={{
              __none: tr("Selecione uma Ordem", "Select an Order"),
              ...MTA_ORDER_LABELS,
            }}
          />
          <Button
            type="button"
            variant={creating ? "secondary" : "outline"}
            onClick={() => {
              setCreating(true);
              props.setCustomOrder(draft);
            }}
          >
            <Plus /> {tr("Criar Ordem", "Create Order")}
          </Button>
          {creating && (
            <div className="custom-kith-editor">
              <label>
                {tr("Nome da Ordem", "Order name")}
                <Input
                  value={draft.name}
                  maxLength={80}
                  onChange={(event) =>
                    props.setCustomOrder({ ...draft, name: event.target.value })
                  }
                />
              </label>
              <label className="full">
                {tr("Descrição da Ordem", "Order description")}
                <textarea
                  value={draft.description}
                  maxLength={500}
                  onChange={(event) =>
                    props.setCustomOrder({
                      ...draft,
                      description: event.target.value,
                    })
                  }
                />
              </label>
              {draft.roteSkills.map((value, index) => (
                <Choice
                  key={index}
                  label={`${tr("Perícia de Rota", "Rote Skill")} ${index + 1}`}
                  value={value || `__skill_${index}`}
                  setValue={(skill: string) => {
                    const skills = [...draft.roteSkills];
                    skills[index] = skill.startsWith("__skill_") ? "" : skill;
                    props.setCustomOrder({ ...draft, roteSkills: skills });
                  }}
                  options={[`__skill_${index}`, ...allSkills]}
                  optionLabels={{
                    [`__skill_${index}`]: tr("Selecione uma Perícia", "Select a Skill"),
                  }}
                />
              ))}
              <Button type="button" onClick={save} disabled={!valid}>
                {tr("Salvar e selecionar Ordem", "Save and select Order")}
              </Button>
            </div>
          )}
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                {tr("Concluir", "Done")}
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function MtaStep(props: any) {
  const { tr } = useLanguage();
  const pathData = MTA_PATHS[props.path as keyof typeof MTA_PATHS];
  const neededPraxes = props.gnosis;
  const powerOptions = Array.from(
    { length: props.maximumPowerFromMerits },
    (_, index) => String(index + 1),
  );
  return (
    <div className="builder-section">
      <span className="kicker">{tr("PASSO 3 · MAGO", "STEP 3 · MAGE")}</span>
      <h2>{tr("Modelo dos Despertos", "Awakened Template")}</h2>
      <p>{tr("As escolhas e limites abaixo vêm de Mage the Awakening.", "The choices and limits below come from Mage the Awakening.")}</p>
      <div className="form-grid thirds">
        <Choice
          label={tr("Caminho", "Path")}
          value={props.path}
          setValue={props.setPath}
          options={Object.keys(MTA_PATHS)}
          invalid={props.missing("path")}
        />
        <OrderSelector {...props} invalid={props.missing("order")} />
        <Choice
          label={props.powerAdvancement ? tr("Gnose na criação", "Gnosis at creation") : tr("Gnose", "Gnosis")}
          value={String(props.gnosis)}
          setValue={(value: string) => props.setGnosis(Number(value))}
          options={powerOptions}
        />
        <label className={props.missing("virtue") ? "missing-field" : ""}>
          {tr("Virtude", "Virtue")}
          <Input
            value={props.virtue}
            onChange={(e) => props.setVirtue(e.target.value)}
          />
        </label>
        <label className={props.missing("vice") ? "missing-field" : ""}>
          {tr("Vício", "Vice")}
          <Input
            value={props.vice}
            onChange={(e) => props.setVice(e.target.value)}
          />
        </label>
        <Choice
          label={tr("Atributo de Resistência (+1)", "Resistance Attribute (+1)")}
          value={props.resistanceBonus}
          setValue={props.setResistanceBonus}
          options={["Perseverança", "Vigor", "Compostura"]}
          invalid={props.missing("resistanceBonus")}
        />
        <label
          className={`full ${props.missing("nimbus") ? "missing-field" : ""}`}
        >
          Nimbus
          <Input
            value={props.nimbus}
            onChange={(e) => props.setNimbus(e.target.value)}
          />
        </label>
        <label
          className={`full ${props.missing("tool") ? "missing-field" : ""}`}
        >
          {tr("Ferramenta Mágica Dedicada", "Dedicated Magical Tool")}
          <Input
            value={props.tool}
            onChange={(e) => props.setTool(e.target.value)}
          />
        </label>
      </div>
      <p className="rule-callout">
        <ShieldCheck /> {props.powerAdvancement > 0 && <>{tr("Gnose atual", "Current Gnosis")}: <strong>{Math.min(10, props.gnosis + props.powerAdvancement)}</strong> ({props.powerAdvancement} {tr("por experiência preservados", "preserved from Experiences")}) · </>}{tr("Regentes", "Ruling")}:{" "}
        <strong>{pathData?.ruling.join(tr(" e ", " and ")) ?? tr("selecione o Caminho", "select a Path")}</strong>{" "}
        · {tr("Inferior", "Inferior")}: <strong>{pathData?.inferior ?? "—"}</strong> · {tr("Méritos disponíveis", "Available Merits")}: <strong>{props.meritBudget}</strong>
      </p>
      {props.order && (
        <p className="rule-callout">
          <ShieldCheck />{" "}
          {props.order === "Nameless"
            ? tr("Sem Ordem: não recebe Alta Fala, ponto gratuito de Ocultismo ou Rotas iniciais.", "Nameless: receives no High Speech, free Occult dot, or starting Rotes.")
            : tr("Membro de Ordem: recebe Alta Fala, +1 em Ocultismo (máximo 5) e três Rotas iniciais.", "Order member: receives High Speech, +1 Occult (maximum 5), and three starting Rotes.")}
        </p>
      )}
      <Aspirations
        values={props.aspirations}
        setValues={props.setAspirations}
        missing={props.missing}
      />
      <h3>{tr("Arcanos · 6 pontos", "Arcana · 6 dots")}</h3>
      <div
        className={`arcana-grid ${props.missing("arcana") ? "missing-field" : ""}`}
      >
        {ARCANA.map((item) => (
          <DotRow
            key={item}
            name={item}
            value={props.arcana[item]}
            setValue={(value: number) =>
              props.setArcana({ ...props.arcana, [item]: value })
            }
            min={0}
            max={3}
            tag={
              pathData?.ruling.includes(item as never)
                ? tr("Regente", "Ruling")
                : pathData?.inferior === item
                  ? tr("Inferior", "Inferior")
                  : undefined
            }
          />
        ))}
      </div>
      {arcanaCreationErrors(props.arcana, pathData).length > 0 && (
        <div className="rule-callout" role="alert">
          <ShieldCheck />
          <div>
            <strong>{tr("Revise a distribuição de Arcana:", "Review the Arcana distribution:")}</strong>
            <ul>
              {arcanaCreationErrors(props.arcana, pathData).map((message) => (
                <li key={message}>{message}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
      {props.order !== "Nameless" && (
        <div className={props.missing("rotes") ? "missing-field block" : ""}>
          <SpellSelector
            title={tr("Rotas iniciais", "Starting Rotes")}
            count={3}
            values={props.rotes}
            setValues={props.setRotes}
            rote
            arcana={props.arcana}
            catalog={props.spellCatalog}
          />
        </div>
      )}
      <div className={props.missing("praxes") ? "missing-field block" : ""}>
        <SpellSelector
          title={`${tr("Práxis", "Praxes")} · ${neededPraxes}`}
          count={neededPraxes}
          values={props.praxes}
          setValues={props.setPraxes}
          arcana={props.arcana}
          catalog={props.spellCatalog}
        />
      </div>
      <div className={props.missing("merits") ? "missing-field block" : ""}>
        <Merits
          merits={props.merits}
          setMerits={props.setMerits}
          catalog={props.meritCatalog}
          spent={props.meritSpent}
          budget={props.meritBudget}
        />
      </div>
    </div>
  );
}

function SpellSelector({
  title,
  count,
  values,
  setValues,
  rote = false,
  arcana,
  catalog,
}: {
  title: string;
  count: number;
  values: Array<SpellSelection | null>;
  setValues: (value: Array<SpellSelection | null>) => void;
  rote?: boolean;
  arcana: Record<string, number>;
  catalog: SpellDefinition[];
}) {
  const { locale, tr } = useLanguage();
  const spellName = (spell: SpellDefinition) => locale === "pt-BR" ? spell.name : (spell.originalName || spell.name);
  const [search, setSearch] = useState("");
  const normalized = search.toLocaleLowerCase("pt-BR");
  const selectedIds = values.filter(Boolean).map((item) => item!.id);
  const filtered = alphabetical(catalog, spellName,locale).filter(
    (spell) =>
      meetsArcanaRequirements(spell.requirements, arcana) &&
      (!normalized ||
        `${spell.name} ${spell.originalName} ${spell.source} ${Object.keys(spell.requirements).join(" ")}`
          .toLocaleLowerCase("pt-BR")
          .includes(normalized)),
  );
  const choose = (spell: SpellDefinition) => {
    const slot = values.findIndex((item, index) => index < count && !item);
    if (slot < 0) return;
    const next = [...values];
    next[slot] = { ...spell, roteSkill: rote ? "" : undefined };
    setValues(next);
  };
  const remove = (index: number) => {
    const next = [...values];
    next[index] = null;
    setValues(next);
  };
  const arcanaLabels: Record<string, string> = {
    Death: tr("Morte", "Death"), Fate: tr("Destino", "Fate"), Forces: tr("Forças", "Forces"), Life: tr("Vida", "Life"), Matter: tr("Matéria", "Matter"), Mind: tr("Mente", "Mind"), Prime: tr("Primórdio", "Prime"), Space: tr("Espaço", "Space"), Spirit: tr("Espírito", "Spirit"), Time: tr("Tempo", "Time"),
  };
  const groups = new Map<string, SpellDefinition[]>();
  for (const spell of filtered) {
    const entries = Object.entries(spell.requirements).sort(
      (a, b) => b[1] - a[1],
    );
    const [arcana, level] = entries[0] ?? ["Outro", 0];
    const key = `${arcanaLabels[arcana] ?? arcana} ${level}`;
    groups.set(key, [...(groups.get(key) ?? []), spell]);
  }
  const option = (spell: SpellDefinition) => {
    const selected = selectedIds.includes(spell.id),
      full = values.slice(0, count).every(Boolean);
    return (
      <article
        className={selected ? "merit-option selected" : "merit-option"}
        key={spell.id}
      >
        <div>
          <strong>{spellName(spell)}</strong>
          <small>
            {formatRequirements(spell.requirements)} · {spell.source} · p.{" "}
            {spell.page || "—"}
          </small>
          <p className="rule-detail">
            <strong>{tr("Resumo", "Summary")}:</strong> {spellSummary(spell)}
          </p>
          <p className="rule-detail">
            <strong>{tr("Parada de dados", "Dice Pool")}:</strong> {tr("Gnose", "Gnosis")} +{" "}
            {formatRequirements(spell.requirements)}
          </p>
          <p className="rule-detail">
            <strong>{tr("Custo", "Cost")}:</strong> {tr("Conforme os Alcances e efeitos aplicados", "As determined by applied Reaches and effects")}
          </p>
          <p className="rule-detail">
            <strong>{tr("Ação / Duração", "Action / Duration")}:</strong> {tr("Conjuração instantânea", "Instant casting")} · {tr("Fator Primário", "Primary Factor")}: {spell.primaryFactor}
          </p>
          <p className="rule-detail">
            <strong>{tr("Efeitos", "Effects")}:</strong> {spell.description}
          </p>
          <p className="rule-detail">
            <strong>{tr("Prática", "Practice")}:</strong> {spell.practice}
            {spell.withstand ? ` · ${tr("Resistência", "Withstand")}: ${spell.withstand}` : ""}
          </p>
          <p className="rule-detail">
            <strong>{tr("Perícias de Rota", "Rote Skills")}:</strong> {spell.roteSkills.join(", ")}
          </p>
        </div>
        <Button
          type="button"
          size="sm"
          variant={selected ? "secondary" : "outline"}
          disabled={selected || full}
          onClick={() => choose(spell)}
        >
          {selected ? (
            <>
              <Check />
              {tr("Selecionado", "Selected")}
            </>
          ) : (
            <>
              <Plus />
              {tr("Adicionar", "Add")}
            </>
          )}
        </Button>
      </article>
    );
  };
  return (
    <>
      <div className="merit-heading">
        <div>
          <h3>{title}</h3>
          <p>
            {tr("Escolha no catálogo de feitiços. Passe o mouse para consultar os fatores.", "Choose from the spell catalog. Hover to inspect the factors.")}
          </p>
        </div>
        <Badge variant="outline">
          {values.slice(0, count).filter(Boolean).length}/{count}
        </Badge>
      </div>
      <div className="contract-grid">
        {Array.from({ length: count }, (_, index) => {
          const item = values[index];
          return (
            <div key={index} title={item ? spellTooltip(item) : undefined}>
              <Badge variant={rote ? "secondary" : "outline"}>
                {rote ? tr("Rota", "Rote") : tr("Práxis", "Praxis")}
              </Badge>
              <div>
                <strong>{item ? spellName(item) : tr("Vaga disponível", "Available slot")}</strong>
                <small>
                  {item
                    ? `${formatRequirements(item.requirements)} · ${item.source} · p. ${item.page || "—"}`
                    : tr("Escolha no catálogo", "Choose from the catalog")}
                </small>
                {rote && item && item.roteSkills.length > 0 && (
                  <Choice
                    value={item.roteSkill ?? item.roteSkills[0]}
                    setValue={(value) => {
                      const next = [...values];
                      next[index] = { ...item, roteSkill: value };
                      setValues(next);
                    }}
                    options={item.roteSkills}
                  />
                )}
              </div>
              {item ? (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => remove(index)}
                >
                  <Trash2 />
                </Button>
              ) : (
                <span />
              )}
            </div>
          );
        })}
      </div>
      <Dialog>
        <DialogTrigger asChild>
          <Button type="button" variant="outline">
            <Plus /> {tr("Selecionar", "Select")} {rote ? tr("Rotas", "Rotes") : tr("Práxis", "Praxes")}
          </Button>
        </DialogTrigger>
        <DialogContent className="merit-dialog">
          <DialogHeader>
            <DialogTitle>{tr("Catálogo de feitiços", "Spell catalog")}</DialogTitle>
            <DialogDescription>
              {tr("Feitiços organizados por Arcano e nível de maestria.", "Spells grouped by Arcanum and mastery level.")}
            </DialogDescription>
          </DialogHeader>
          <label className="merit-search">
            <Search />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={tr("Buscar feitiço, Arcano ou fonte…", "Search spell, Arcanum, or source…")}
            />
          </label>
          <div className="merit-catalog spell-groups">
            {Array.from(groups.entries())
              .sort(([a], [b]) =>
                a.localeCompare(b, locale, { numeric: true }),
              )
              .map(([group, spells]) => (
                <section className="merit-category" key={group}>
                  <h3>
                    {group} <Badge variant="outline">{spells.length}</Badge>
                  </h3>
                  <div>{spells.map(option)}</div>
                </section>
              ))}
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button">{tr("Concluir", "Done")}</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

function PriorityRow({ labels, values, setValues, budgets, invalid }: any) {
  const { tr } = useLanguage();
  return (
    <div className={`priority-row ${invalid ? "missing-field" : ""}`}>
      {values.map((value: string, index: number) => (
        <Choice
          key={index}
          label={
            [tr("Primária", "Primary"), tr("Secundária", "Secondary"), tr("Terciária", "Tertiary")][index] +
            ` · ${budgets[index]} ${tr("pontos", "dots")}`
          }
          value={value}
          setValue={(next) => {
            const updated = [...values];
            const other = updated.indexOf(next);
            if (other >= 0) updated[other] = "";
            updated[index] = next;
            setValues(updated);
          }}
          options={labels}
          invalid={
            !value || values.filter((item: string) => item === value).length > 1
          }
        />
      ))}
    </div>
  );
}
function DotGroups({
  groups,
  values,
  setValues,
  base,
  max,
  priority,
  budgets,
  missing,
}: any) {
  const { locale } = useLanguage();
  return (
    <div className="dot-groups">
      {Object.entries(groups).map(([category, names]) => {
        const budget = budgets[priority.indexOf(category)];
        const used = spent(values, names as string[], base),
          invalid = missing(
            `${base === 1 ? "attribute" : "skill"}-${category}`,
          );
        return (
          <section key={category} className={invalid ? "missing-field" : ""}>
            <div>
              <h3>{builderText(locale, category)}</h3>
              <Badge variant={used === budget ? "secondary" : "outline"}>
                {used}/{budget ?? "—"}
              </Badge>
            </div>
            {(names as string[]).map((name) => (
              <DotRow
                key={name}
                name={name}
                value={values[name]}
                setValue={(value: number) => {
                  const delta = value - Number(values[name] ?? base);
                  if (delta > 0 && (budget === undefined || used + delta > budget)) return;
                  setValues({ ...values, [name]: value });
                }}
                min={base}
                max={max}
                canIncrease={canIncreaseCreationDots(used, budget, Number(values[name] ?? base), max)}
              />
            ))}
          </section>
        );
      })}
    </div>
  );
}
function DotRow({ name, value, setValue, min, max, tag, canIncrease = true }: any) {
  const { locale, tr } = useLanguage();
  return (
    <div className="dot-row">
      <span>
        {builderText(locale, name)}
        {tag && <small>{builderText(locale, tag)}</small>}
      </span>
      <div>
        <Button
          type="button"
          variant="ghost"
          size="icon-xs"
          aria-label={`${tr("Diminuir", "Decrease")} ${builderText(locale, name)}`}
          onClick={() => setValue(Math.max(min, value - 1))}
        >
          <Minus />
        </Button>
        <div className="dots">
          {Array.from({ length: max }, (_, i) => (
            <i key={i} className={i < value ? "filled" : ""} />
          ))}
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon-xs"
          aria-label={`${tr("Aumentar", "Increase")} ${builderText(locale, name)}`}
          disabled={!canIncrease || value >= max}
          onClick={() => setValue(Math.min(max, value + 1))}
        >
          <Plus />
        </Button>
      </div>
    </div>
  );
}
function Choice({
  label,
  value,
  setValue,
  options,
  optionLabels = { ...CTL_SEEMING_LABELS, ...MTA_ORDER_LABELS },
  invalid = false,
}: {
  label?: string;
  value: string;
  setValue: (value: string) => void;
  options: readonly string[];
  optionLabels?: Record<string, string>;
  invalid?: boolean;
}) {
  const { locale, tr } = useLanguage();
  const labels = Object.fromEntries(Object.entries(optionLabels).map(([key, text]) => [key, key in CTL_SEEMINGS ? seemingDisplayName(key,locale) : builderText(locale, text)]));
  return (
    <label className={`choice-label ${invalid ? "missing-field" : ""}`}>
      {label}
      <Select value={value} onValueChange={setValue}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder={tr("Selecione", "Select")}>
            {value ? (labels[value] ?? builderText(locale, value)) : undefined}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {orderedChoiceOptions(options, labels,locale).map((option) => (
            <SelectItem key={option} value={option}>
              {labels[option] ?? builderText(locale, option)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </label>
  );
}
function Aspirations({ values, setValues, missing }: any) {
  const { tr } = useLanguage();
  return (
    <>
      <h3>{tr("Aspirações", "Aspirations")}</h3>
      <div className="three-inputs">
        {values.map((value: string, index: number) => (
          <div
            className={missing?.(`aspiration-${index}`) ? "missing-field" : ""}
            key={index}
          >
            <Input
              value={value}
              onChange={(e) =>
                updateArray(setValues, values, index, e.target.value)
              }
              placeholder={`${tr("Aspiração", "Aspiration")} ${index + 1}`}
            />
          </div>
        ))}
      </div>
    </>
  );
}
function Merits({
  merits,
  setMerits,
  catalog,
  spent,
  budget,
}: {
  merits: MeritSelection[];
  setMerits: (value: MeritSelection[]) => void;
  catalog: MeritDefinition[];
  spent: number;
  budget: number;
}) {
  const { locale, tr } = useLanguage();
  const meritName = (definition: MeritDefinition) => locale === "pt-BR" ? definition.translatedName : definition.name;
  const categoryName = (category: string) => locale === "pt-BR" ? meritCategoryLabel(category) : category;
  budget += spent;
  const [search, setSearch] = useState("");
  const categories = [...new Set(catalog.map((merit) => merit.category))].sort(
    (a, b) => compareOptionLabels(categoryName(a), categoryName(b),locale),
  );
  const normalizedSearch = search.trim().toLocaleLowerCase("pt-BR");
  function addMerit(definition: MeritDefinition) {
    if (
      !isRepeatableDefinition(definition) &&
      merits.some((merit) => merit.name === definition.name)
    )
      return;
    setMerits([
      ...merits,
      {
        name: definition.name,
        dots: meritRatingsFor(definition)[0],
        sourceId: definition.sourceId,
        source: definition.source,
        configuration: {},
      },
    ]);
  }
  return (
    <>
      <div className="merit-heading">
        <div>
          <h3>{tr("Méritos", "Merits")}</h3>
          <p>
            {tr("Core + livros da linha, reunidos por categoria. Você pode guardar pontos sem gastá-los.", "Core and game-line books, grouped by category. You may leave dots unspent.")}
          </p>
        </div>
        <Badge variant={spent > budget ? "destructive" : "outline"}>
          {spent}/{budget} {tr("pontos usados", "dots spent")}
        </Badge>
      </div>
      <div className="merit-picker">
        {merits.map((selection, index) => {
          const definition = catalog.find(
            (item) => item.name === selection.name,
          );
          return (
            <div
              className="merit-row configurable"
              key={`${index}-${selection.name}`}
              title={definition ? meritTooltip(definition) : undefined}
            >
              <div className="merit-row-main">
                <div>
                  <strong>
                    {definition ? meritName(definition) : selection.name}
                    {meritConfigurationTitle(selection.configuration)
                      ? `: ${meritConfigurationTitle(selection.configuration)}`
                      : ""}
                  </strong>
                  <small>
                    {definition
                      ? `${categoryName(definition.category)} · ${definition.source} · p. ${definition.page || "—"}`
                      : selection.source}
                  </small>
                </div>
                <Choice
                  label={tr("Pontos", "Dots")}
                  value={String(selection.dots)}
                  setValue={(value) => {
                    const next = [...merits];
                    next[index] = { ...selection, dots: Number(value) };
                    setMerits(next);
                  }}
                  options={(definition ? meritRatingsFor(definition) : [1]).map(
                    String,
                  )}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label={`${tr("Remover", "Remove")} ${definition ? meritName(definition) : selection.name}`}
                  onClick={() =>
                    setMerits(
                      merits.filter((_, itemIndex) => itemIndex !== index),
                    )
                  }
                >
                  <Trash2 />
                </Button>
              </div>
              <MeritConfigurationEditor
                merit={selection}
                onChange={(configuration) => {
                  const next = [...merits];
                  next[index] = { ...selection, configuration };
                  setMerits(next);
                }}
              />
            </div>
          );
        })}
      </div>
      <Dialog>
        <DialogTrigger asChild>
          <Button type="button" variant="outline">
            <Plus /> {tr("Selecionar méritos", "Select Merits")}
          </Button>
        </DialogTrigger>
        <DialogContent className="merit-dialog">
          <DialogHeader>
            <DialogTitle>{tr("Selecionar méritos", "Select Merits")}</DialogTitle>
            <DialogDescription>
              {tr("Procure por nome ou navegue pelas categorias. Méritos repetíveis permitem criar novas instâncias; altere os pontos na instância existente para aumentá-la.", "Search by name or browse categories. Repeatable Merits allow new instances; change the dots on an existing instance to increase it.")}
            </DialogDescription>
          </DialogHeader>
          <label className="merit-search">
            <Search aria-hidden="true" />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={tr("Buscar mérito por nome, pré-requisito ou fonte…", "Search Merit by name, prerequisite, or source…")}
            />
          </label>
          <div className="merit-catalog">
            {categories.map((category) => {
              const items = alphabetical(catalog, meritName,locale).filter(
                (item) =>
                  item.category === category &&
                  (!normalizedSearch ||
                    `${item.translatedName} ${item.name} ${item.source} ${item.prerequisites ?? ""}`
                      .toLocaleLowerCase("pt-BR")
                      .includes(normalizedSearch)),
              );
              if (!items.length) return null;
              return (
                <section className="merit-category" key={category}>
                  <h3>
                    {categoryName(category)}{" "}
                    <Badge variant="outline">{items.length}</Badge>
                  </h3>
                  <div>
                    {items.map((definition) => {
                      const selected = merits.some(
                          (merit) => merit.name === definition.name,
                        ),
                        repeatable = isRepeatableDefinition(definition);
                      return (
                        <article
                          className={
                            selected ? "merit-option selected" : "merit-option"
                          }
                          key={definition.id}
                        >
                          <div>
                            <strong>{meritName(definition)}</strong>
                            <small>
                              {definition.source} · p. {definition.page || "—"}{" "}
                              · {formatRatings(meritRatingsFor(definition))}
                            </small>
                            <p>{definition.description}</p>
                            {definition.prerequisites && (
                              <p className="rule-detail">
                                <strong>{tr("Pré-requisitos", "Prerequisites")}:</strong>{" "}
                                {definition.prerequisites}
                              </p>
                            )}
                          </div>
                          <Button
                            type="button"
                            size="sm"
                            variant={selected ? "secondary" : "outline"}
                            disabled={selected && !repeatable}
                            onClick={() => addMerit(definition)}
                          >
                            {selected && !repeatable ? (
                              <>
                                <Check /> {tr("Selecionado", "Selected")}
                              </>
                            ) : repeatable && selected ? (
                              <>
                                <Plus /> {tr("Nova instância", "New instance")}
                              </>
                            ) : (
                              <>
                                <Plus /> {tr("Adicionar", "Add")}
                              </>
                            )}
                          </Button>
                        </article>
                      );
                    })}
                  </div>
                </section>
              );
            })}
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button">{tr("Concluir", "Done")}</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export function MeritConfigurationEditor({
  merit,
  onChange,
  compact = false,
  inline = false,
}: {
  merit: MeritSelection;
  onChange: (value: MeritConfiguration) => void;
  compact?: boolean;
  inline?: boolean;
}) {
  const { locale, tr } = useLanguage();
  const homebrews = useHomebrews();
  const definition = findMeritConfiguration(merit.name);
  if (!definition) return null;
  const configuration = normalizeMeritConfiguration(merit.configuration);
  const visible = definition.fields.filter(
    (field) => (field.minDots ?? 0) <= merit.dots,
  );
  const set = (key: string, value: string | string[]) =>
    onChange({ ...configuration, [key]: value });
  if (isStructuredMerit(merit.name))
    return (
      <StructuredMeritEditor
        merit={merit}
        configuration={configuration}
        onChange={onChange}
        compact={compact}
      />
    );
  return (
    <details open={inline || undefined} className={`merit-configuration${compact ? " compact" : ""}${inline ? " inline" : ""}`}>
      {!inline && <summary>{tr("Configurar escolhas", "Configure choices")}</summary>}
      <div>
        {visible.map((field) => {
          const value = configuration[field.key];
          if (field.kind === "court") {
            const selected = String(value ?? "");
            const courtOptions = alphabetical([
              ...CTL_COURT_DEFINITIONS
                .filter((court) => court.sourceId !== "h-courts" || isHomebrewActive(homebrews, "h-courts"))
                .map((court) => ({ value: court.id, label: courtDisplayName(court.id, locale) })),
              ...homebrews.courts
                .filter((court) => isHomebrewActive(homebrews, court.id))
                .map((court) => ({ value: court.id, label: court.name })),
            ], (item) => item.label, locale);
            if (selected && !courtOptions.some((option) => option.value === selected))
              courtOptions.push({ value: selected, label: courtDisplayName(selected, locale) });
            return (
              <label key={field.key}>
                {tr(field.label, "Benefited Court")}
                <Select value={courtCanonicalId(selected)} onValueChange={(next) => set(field.key, next)}>
                  <SelectTrigger><SelectValue placeholder={tr("Selecione uma Corte", "Select a Court")} /></SelectTrigger>
                  <SelectContent>
                    {courtOptions.map((option) => <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </label>
            );
          }
          if (field.kind === "list")
            return (
              <label key={field.key}>
                {field.label}
                <textarea
                  value={
                    Array.isArray(value)
                      ? value.join("\n")
                      : String(value ?? "")
                  }
                  placeholder={field.placeholder}
                  onChange={(event) =>
                    set(
                      field.key,
                      event.target.value
                        .split("\n")
                        .map((item) => item.trim())
                        .filter(Boolean),
                    )
                  }
                />
              </label>
            );
          if (field.kind === "select") {
            const selected=String(value??"");
            return <label key={field.key}>{field.label}<Select value={selected} onValueChange={(next)=>set(field.key,next)}><SelectTrigger><SelectValue placeholder={field.placeholder??tr("Selecione uma opção","Select an option")}/></SelectTrigger><SelectContent>{(field.options??[]).map((option)=><SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>)}</SelectContent></Select></label>;
          }
          if (field.kind === "textarea")
            return (
              <label key={field.key}>
                {field.label}
                <textarea
                  value={
                    Array.isArray(value)
                      ? value.join("\n")
                      : String(value ?? "")
                  }
                  placeholder={field.placeholder}
                  onChange={(event) => set(field.key, event.target.value)}
                />
              </label>
            );
          return (
            <label key={field.key}>
              {field.label}
              <Input
                value={
                  Array.isArray(value) ? value.join(", ") : String(value ?? "")
                }
                placeholder={field.placeholder}
                onChange={(event) => set(field.key, event.target.value)}
              />
            </label>
          );
        })}
      </div>
    </details>
  );
}

const CONFIG_SKILLS = Object.values(SKILLS).flat();
const CONFIG_MERITS = [
  ...new Map(
    [...getMeritsForLine("CtL"), ...getMeritsForLine("MtA")]
      .filter((item) => !item.sourceId.startsWith("h-"))
      .map((item) => [item.name, item]),
  ).values(),
].sort((a, b) => a.translatedName.localeCompare(b.translatedName, "pt-BR"));
function StructuredMeritEditor({
  merit,
  configuration,
  onChange,
  compact,
}: {
  merit: MeritSelection;
  configuration: MeritConfiguration;
  onChange: (value: MeritConfiguration) => void;
  compact: boolean;
}) {
  const { tr } = useLanguage();
  const set = (key: string, value: string | string[]) =>
    onChange({ ...configuration, [key]: value });
  const value = (key: string) => String(configuration[key] ?? "");
  if (merit.name === "Professional Training") {
    const contacts = Array.isArray(configuration.contacts)
      ? configuration.contacts
      : ["", ""];
    const skills = Array.isArray(configuration.asset_skills)
      ? configuration.asset_skills
      : [];
    const assetCount = merit.dots >= 3 ? 3 : merit.dots >= 2 ? 2 : 0;
    const setArray = (
      key: string,
      current: string[],
      index: number,
      next: string,
    ) => {
      const changed = [...current];
      changed[index] = next;
      set(key, changed);
    };
    return (
      <details
        className={`merit-configuration structured${compact ? " compact" : ""}`}
        open={!compact}
      >
        <summary>{tr("Configurar Treinamento Profissional", "Configure Professional Training")}</summary>
        <div>
          <label>
            {tr("Profissão", "Profession")}
            <Input
              value={value("profession")}
              onChange={(event) => set("profession", event.target.value)}
              placeholder={tr("Ex.: Jornalista investigativo", "E.g.: Investigative journalist")}
            />
          </label>
          {merit.dots >= 1 && (
            <fieldset>
              <legend>{tr("Nv 1 · Rede de Contatos", "Dot 1 · Contact Network")}</legend>
              <p>
                {tr("Nomeie as duas áreas ou especialidades dos Contatos concedidos.", "Name the two areas or specialties of the granted Contacts.")}
              </p>
              {[0, 1].map((index) => (
                <label key={index}>
                  {tr("Contato", "Contact")} {index + 1}
                  <Input
                    value={contacts[index] ?? ""}
                    onChange={(event) =>
                      setArray("contacts", contacts, index, event.target.value)
                    }
                    placeholder={tr("Ex.: Polícia local", "E.g.: Local police")}
                  />
                </label>
              ))}
            </fieldset>
          )}
          {assetCount > 0 && (
            <fieldset>
              <legend>
                {tr("Nv", "Dots")} {merit.dots >= 3 ? "2–3" : "2"} · {tr("Perícias de Ativo", "Asset Skills")}
              </legend>
              <p>
                {tr("As escolhas abaixo alimentam as Especializações e o aumento dos níveis posteriores.", "The choices below determine later Specialties and Skill increases.")}
              </p>
              {Array.from({ length: assetCount }, (_, index) => (
                <SkillChoice
                  key={index}
                  label={`${tr("Perícia de Ativo", "Asset Skill")} ${index + 1}`}
                  value={skills[index] || ""}
                  setValue={(next) =>
                    setArray("asset_skills", skills, index, next)
                  }
                />
              ))}
            </fieldset>
          )}
          {merit.dots >= 3 && (
            <fieldset>
              <legend>{tr("Nv 3 · Especializações", "Dot 3 · Specialties")}</legend>
              {[1, 2].map((index) => (
                <div className="structured-choice-row" key={index}>
                  <SkillChoice
                    label={`${tr("Perícia", "Skill")} ${index}`}
                    value={value(`specialty_${index}_skill`)}
                    setValue={(next) => set(`specialty_${index}_skill`, next)}
                    options={skills.filter(Boolean)}
                  />
                  <label>
                    {tr("Especialização", "Specialty")} {index}
                    <Input
                      value={value(`specialty_${index}_name`)}
                      onChange={(event) =>
                        set(`specialty_${index}_name`, event.target.value)
                      }
                      placeholder={tr("Nome da Especialização", "Specialty name")}
                    />
                  </label>
                </div>
              ))}
            </fieldset>
          )}
          {merit.dots >= 4 && (
            <fieldset>
              <legend>{tr("Nv 4 · Aumento de Perícia", "Dot 4 · Skill Increase")}</legend>
              <SkillChoice
                label={tr("Perícia de Ativo que recebe +1", "Asset Skill receiving +1")}
                value={value("boosted_skill")}
                setValue={(next) => set("boosted_skill", next)}
                options={skills.filter(Boolean)}
              />
            </fieldset>
          )}
          {merit.dots >= 5 && (
            <p className="structured-rule">
              <strong>{tr("Nv 5 · Rotina", "Dot 5 · Routine")}:</strong> {tr("aplica-se às Perícias de Ativo escolhidas.", "applies to the selected Asset Skills.")}
            </p>
          )}
        </div>
      </details>
    );
  }
  if (merit.name === "Hollow")
    return (
      <HollowEditor
        merit={merit}
        configuration={configuration}
        onChange={onChange}
        compact={compact}
      />
    );
  if (merit.name === "Warded Dreams" || merit.name === "Dream Bastion")
    return (
      <details
        className={`merit-configuration structured${compact ? " compact" : ""}`}
        open={!compact}
      >
        <summary>{tr("Configurar Bastião dos Sonhos", "Configure Dream Bastion")}</summary>
        <div>
          <label>
            {tr("Descrição e aparência do Bastião", "Bastion description and appearance")}
            <textarea
              value={value("description")}
              onChange={(event) => set("description", event.target.value)}
              placeholder={tr("Descreva a paisagem onírica, acessos e defesas.", "Describe the dreamscape, entrances, and defenses.")}
            />
          </label>
          <p className="structured-rule">
            {tr("Este Mérito acrescenta", "This Merit adds")} +{merit.dots} {tr("à Fortificação do Bastião.", "to Bastion Fortification.")}
          </p>
        </div>
      </details>
    );
  return (
    <CultMeritEditor
      merit={merit}
      configuration={configuration}
      onChange={onChange}
      compact={compact}
    />
  );
}

const HOLLOW_OPTIONS = [
  ["Alarme de Hob", 1],
  ["Artigos de Luxo", 1],
  ["Jardim de Sombras", 1],
  ["Cabine Telefônica Fantasma", 1],
  ["Rota Zero", 1],
  ["Questão de Tamanho 1", 1],
  ["Questão de Tamanho 2", 2],
  ["Rota de Fuga 1", 1],
  ["Rota de Fuga 2", 2],
  ["Entrada Oculta", 2],
  ["Acesso Fácil", 3],
  ["Terreno Próprio", 3],
] as const;
function HollowEditor({
  merit,
  configuration,
  onChange,
  compact,
}: {
  merit: MeritSelection;
  configuration: MeritConfiguration;
  onChange: (value: MeritConfiguration) => void;
  compact: boolean;
}) {
  const { tr } = useLanguage();
  const selected = Array.isArray(configuration.features)
    ? configuration.features
    : [];
  const used = selected.reduce(
    (sum, item) => sum + (Number(String(item).split("|")[1]) || 0),
    0,
  );
  const set = (key: string, value: string | string[]) =>
    onChange({ ...configuration, [key]: value });
  return (
    <details
      className={`merit-configuration structured${compact ? " compact" : ""}`}
      open={!compact}
    >
      <summary>{tr("Configurar Recanto", "Configure Hollow")}</summary>
      <div>
        <label>
          {tr("Nome", "Name")}
          <Input
            value={String(configuration.name ?? "")}
            onChange={(event) => set("name", event.target.value)}
          />
        </label>
        <label>
          {tr("Localização e aparência", "Location and appearance")}
          <textarea
            value={String(configuration.location ?? "")}
            onChange={(event) => set("location", event.target.value)}
          />
        </label>
        <fieldset>
          <legend>
            {tr("Melhorias", "Enhancements")} ({used}/{merit.dots} {tr("pontos", "dots")})
          </legend>
          <div className="structured-option-grid">
            {HOLLOW_OPTIONS.map(([name, cost]) => {
              const key = `${name}|${cost}`,
                active = selected.includes(key);
              return (
                <label key={key}>
                  <input
                    type="checkbox"
                    checked={active}
                    disabled={!active && used + cost > merit.dots}
                    onChange={() =>
                      set(
                        "features",
                        active
                          ? selected.filter((item) => item !== key)
                          : [...selected, key],
                      )
                    }
                  />
                  <span>
                    <strong>{name}</strong>
                    <small>
                      {cost} {cost === 1 ? tr("ponto", "dot") : tr("pontos", "dots")}
                    </small>
                  </span>
                </label>
              );
            })}
          </div>
        </fieldset>
        <p className="structured-rule">
          {tr("A soma das melhorias não pode exceder os pontos de Recanto. Alarme de Hob exige Parentesco Hob.", "The total enhancement cost cannot exceed the Hollow dots. Hob Alarm requires Hob Kin.")}
        </p>
      </div>
    </details>
  );
}

function CultMeritEditor({
  merit,
  configuration,
  onChange,
  compact,
}: {
  merit: MeritSelection;
  configuration: MeritConfiguration;
  onChange: (value: MeritConfiguration) => void;
  compact: boolean;
}) {
  const { tr } = useLanguage();
  const set = (key: string, value: string | string[]) =>
    onChange({ ...configuration, [key]: value });
  const value = (key: string) => String(configuration[key] ?? "");
  return (
    <details
      className={`merit-configuration structured${compact ? " compact" : ""}`}
      open={!compact}
    >
      <summary>{tr("Configurar benefícios do Culto de Mistério", "Configure Mystery Cult benefits")}</summary>
      <div>
        <label>
          {tr("Nome do culto", "Cult name")}
          <Input
            value={value("cult")}
            onChange={(event) => set("cult", event.target.value)}
            placeholder={tr("Ex.: Igreja Vermelha", "E.g.: Red Church")}
          />
        </label>
        {Array.from({ length: merit.dots }, (_, index) => index + 1).map(
          (level) => (
            <CultLevelEditor
              key={level}
              level={level}
              configuration={configuration}
              set={set}
            />
          ),
        )}
      </div>
    </details>
  );
}
function CultLevelEditor({
  level,
  configuration,
  set,
}: {
  level: number;
  configuration: MeritConfiguration;
  set: (key: string, value: string | string[]) => void;
}) {
  const { tr } = useLanguage();
  const prefix = `level_${level}`,
    value = (suffix: string) =>
      String(configuration[`${prefix}_${suffix}`] ?? "");
  const type = value("type");
  const options =
    level <= 2
      ? ["__none", "specialty", "merit", "custom"]
      : level === 3
        ? ["__none", "merits", "skill", "custom"]
        : ["__none", "merits", "merit_skill", "custom"];
  const labels: Record<string, string> = {
    __none: tr("Selecione o benefício", "Select benefit"),
    specialty: tr("Especialização", "Specialty"),
    merit: tr("Mérito de 1 ponto", "One-dot Merit"),
    merits: `${tr("Um ou mais Méritos somando até", "One or more Merits totaling up to")} ${level === 3 ? 2 : 3} ${tr("pontos", "dots")}`,
    skill: tr("Um ponto em uma Perícia", "One Skill dot"),
    merit_skill: tr("Um Mérito de 1 ponto e um ponto em Perícia", "One one-dot Merit and one Skill dot"),
    custom: tr("Escrever benefício customizado", "Write a custom benefit"),
  };
  const max = level <= 2 ? 1 : level === 3 ? 2 : type === "merit_skill" ? 1 : 3;
  return (
    <fieldset>
      <legend>{tr("Nv", "Dot")} {level}</legend>
      <Choice
        label={tr("Tipo de benefício", "Benefit type")}
        value={type || "__none"}
        setValue={(next) =>
          set(`${prefix}_type`, next === "__none" ? "" : next)
        }
        options={options}
        optionLabels={labels}
      />
      {type === "specialty" && (
        <div className="structured-choice-row">
          <SkillChoice
            label={tr("Perícia", "Skill")}
            value={value("specialty_skill")}
            setValue={(next) => set(`${prefix}_specialty_skill`, next)}
          />
          <label>
            {tr("Especialização", "Specialty")}
            <Input
              value={value("specialty_name")}
              onChange={(event) =>
                set(`${prefix}_specialty_name`, event.target.value)
              }
              placeholder={tr("Nome da Especialização", "Specialty name")}
            />
          </label>
        </div>
      )}
      {(type === "merit" || type === "merits" || type === "merit_skill") && (
        <MeritGrantPicker
          value={
            Array.isArray(configuration[`${prefix}_merits`])
              ? (configuration[`${prefix}_merits`] as string[])
              : []
          }
          max={max}
          onChange={(next) => set(`${prefix}_merits`, next)}
        />
      )}{" "}
      {(type === "skill" || type === "merit_skill") && (
        <SkillChoice
          label={tr("Perícia que recebe +1", "Skill receiving +1")}
          value={value("skill")}
          setValue={(next) => set(`${prefix}_skill`, next)}
        />
      )}{" "}
      {type === "custom" && (
        <label>
          {tr("Benefício customizado", "Custom benefit")}
          <textarea
            value={value("custom")}
            onChange={(event) => set(`${prefix}_custom`, event.target.value)}
            placeholder={tr("Descreva o benefício próprio deste nível.", "Describe this dot's custom benefit.")}
          />
        </label>
      )}
    </fieldset>
  );
}
function SkillChoice({
  label,
  value,
  setValue,
  options = CONFIG_SKILLS,
}: {
  label: string;
  value: string;
  setValue: (value: string) => void;
  options?: string[];
}) {
  const { tr } = useLanguage();
  const choices = options.length ? options : CONFIG_SKILLS;
  return (
    <Choice
      label={label}
      value={value || "__none"}
      setValue={(next) => setValue(next === "__none" ? "" : next)}
      options={["__none", ...choices]}
      optionLabels={{ __none: tr("Selecione uma Perícia", "Select a Skill") }}
    />
  );
}
function MeritGrantPicker({
  value,
  max,
  onChange,
}: {
  value: string[];
  max: number;
  onChange: (value: string[]) => void;
}) {
  const { locale, tr } = useLanguage();
  const rows = value.length ? value : ["|1"],
    used = rows.reduce((sum, row) => sum + (Number(row.split("|")[1]) || 1), 0);
  const update = (index: number, name: string, dots: number) => {
    const next = [...rows];
    next[index] = `${name}|${dots}`;
    onChange(next);
  };
  return (
    <div className="merit-grant-picker">
      <p>
        {tr("Distribua no máximo", "Distribute at most")} {max} {max === 1 ? tr("ponto", "dot") : tr("pontos", "dots")} {tr("de Méritos", "of Merits")}.
      </p>
      {rows.map((row, index) => {
        const [name, rawDots] = row.split("|"),
          dots = Math.max(1, Number(rawDots) || 1),
          available = Math.max(1, max - (used - dots)),
          selected = CONFIG_MERITS.find((item) => item.name === name),
          dotOptions = selected
            ? selected.ratings.filter((rating) => rating <= available)
            : Array.from({ length: available }, (_, dot) => dot + 1);
        return (
          <div className="structured-choice-row" key={index}>
            <label>
              {tr("Mérito", "Merit")}
              <Select
                value={name || "__none"}
                onValueChange={(next) => {
                  const merit = CONFIG_MERITS.find(
                      (item) => item.name === next,
                    ),
                    first =
                      merit?.ratings.find((rating) => rating <= available) ?? 1;
                  update(index, next === "__none" ? "" : next, first);
                }}
              >
                <SelectTrigger>
                  <SelectValue>
                    {name ? (selected ? (locale === "pt-BR" ? selected.translatedName : selected.name) : name) : tr("Selecione", "Select")}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__none">{tr("Selecione", "Select")}</SelectItem>
                  {CONFIG_MERITS.filter((item) =>
                    item.ratings.some((rating) => rating <= available),
                  ).map((item) => (
                    <SelectItem key={item.id} value={item.name}>
                      {locale === "pt-BR" ? item.translatedName : item.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </label>
            <Choice
              label={tr("Pontos", "Dots")}
              value={String(
                dotOptions.includes(dots) ? dots : (dotOptions[0] ?? 1),
              )}
              setValue={(next) => update(index, name, Number(next))}
              options={(dotOptions.length ? dotOptions : [1]).map(String)}
            />
            {rows.length > 1 && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label={tr("Remover Mérito", "Remove Merit")}
                onClick={() =>
                  onChange(rows.filter((_, item) => item !== index))
                }
              >
                <Trash2 />
              </Button>
            )}
          </div>
        );
      })}
      {used < max && (
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() => onChange([...rows, "|1"])}
        >
          <Plus />
          Adicionar outro Mérito
        </Button>
      )}
    </div>
  );
}

function isRepeatableDefinition(definition: MeritDefinition) {
  return (
    REPEATABLE_MERITS.has(definition.name) ||
    Boolean((definition as MeritDefinition & { repeatable?: boolean }).repeatable)
  );
}
function meritTooltip(definition: MeritDefinition) {
  return definition.prerequisites
    ? `${definition.description}\nPré-requisitos: ${definition.prerequisites}`
    : definition.description;
}
function contractTooltip(
  contract: Pick<
    ContractDefinition,
    | "id"
    | "description"
    | "dicePool"
    | "hasRoll"
    | "loophole"
    | "seemingBenefits"
    | "goblin"
    | "goblinDebt"
    | "cost"
    | "action"
    | "duration"
    | "success"
    | "exceptionalSuccess"
    | "failure"
    | "dramaticFailure"
    | "options"
  >,
  seeming: string,
  locale:Locale="pt-BR",
) {
  const source = contract.id ? findContract(contract.id) ?? contract as ContractDefinition : contract as ContractDefinition;
  contract = contractPresentation(source,locale);
  const benefit =
    contract.seemingBenefits?.[
      seeming as keyof typeof contract.seemingBenefits
    ];
  const displayOptions = contractDisplayOptions(contract, locale);
  const options = displayOptions.length ? `\n${localized(locale,"Opções","Options")}:\n${displayOptions.map((option) => `• ${option}`).join("\n")}` : "";
  const outcomes = contractOutcomeSections(contract,locale);
  const primaryOutcome = outcomes.slice(0, 1).map(({label, text}) => `${label}: ${text}`).join("\n");
  const remainingOutcomes = outcomes.slice(1).map(({label, text}) => `${label}: ${text}`).join("\n");
  return contract.description
    ? `${contract.cost ? `${localized(locale,"Custo","Cost")}: ${contract.cost}\n` : ""}${contractHasInvocationRoll(contract) === true ? `${localized(locale,"Parada de dados","Dice Pool")}: ${contract.dicePool ?? localized(locale,"Não informada","Not provided")}\n` : ""}${localized(locale,"Ação","Action")}: ${contract.action ?? localized(locale,"Instantânea","Instant")} · ${localized(locale,"Duração","Duration")}: ${contract.duration ?? localized(locale,"Cena","Scene")}\n${primaryOutcome}${options}${remainingOutcomes ? `\n${remainingOutcomes}` : ""}\n${localized(locale,"Brecha","Loophole")}: ${contract.loophole ?? localized(locale,"Não informada","Not provided")}${contract.goblin ? `\n${localized(locale,"Débito Goblin","Goblin Debt")}: ${contract.goblinDebt}` : ""}${benefit ? `\n${localized(locale,"Benefício de","Benefit for")} ${seemingDisplayName(seeming,locale)}: ${benefit}` : ""}`
    : "";
}
function formatRequirements(requirements: Record<string, number>) {
  return Object.entries(requirements)
    .map(([name, dots]) => `${name} ${"●".repeat(dots)}`)
    .join(" + ");
}
function spellTooltip(spell: SpellDefinition) {
  return `Resumo: ${spellSummary(spell)}\nParada de dados: Gnose + ${formatRequirements(spell.requirements)}\nCusto: Conforme os Alcances e efeitos aplicados\nAção / Duração: Conjuração instantânea · Fator Primário: ${spell.primaryFactor}\nEfeitos: ${spell.description ?? "Descrição não disponível."}\nPrática: ${spell.practice}${spell.withstand ? ` · Resistência: ${spell.withstand}` : ""}`;
}

function spellSummary(spell: SpellDefinition) {
  const description = spell.description?.trim() || "Descrição não disponível.";
  const firstSentence = description.match(/^.*?[.!?](?:\s|$)/)?.[0]?.trim();
  return firstSentence || description;
}

function meritCategoryRank(category: string) {
  const order = [
    "Mental",
    "Physical",
    "Social",
    "Supernatural",
    "Fighting Style",
    "Changeling",
    "Awakened",
    "Entitlement",
    "Court",
    "Seeming",
    "Historical",
    "Order",
    "Mystery Cult",
  ];
  const rank = order.indexOf(category);
  return rank < 0 ? 99 : rank;
}
function meritCategoryLabel(category: string) {
  return (
    (
      {
        Mental: "Mentais",
        Physical: "Físicos",
        Social: "Sociais",
        Supernatural: "Sobrenaturais",
        "Fighting Style": "Estilos de Combate",
        Changeling: "Perdidos",
        Awakened: "Despertos",
        Entitlement: "Títulos Feéricos",
        Court: "Cortes",
        Seeming: "Feições",
        Historical: "Históricos",
        Order: "Ordens",
        "Mystery Cult": "Cultos de Mistério",
      } as Record<string, string>
    )[category] ?? category
  );
}
function formatRatings(ratings: number[]) {
  return ratings.length === 1
    ? `${ratings[0]} ponto${ratings[0] === 1 ? "" : "s"}`
    : `${ratings.join(", ")} pontos`;
}

function spent(
  values: Record<string, number>,
  names: readonly string[],
  base: number,
) {
  return names.reduce((sum, name) => sum + values[name] - base, 0);
}
function favoredChoices(type: string) {
  return type === "Power"
    ? ["Inteligência", "Força", "Presença"]
    : type === "Finesse"
      ? ["Raciocínio", "Destreza", "Manipulação"]
      : ["Perseverança", "Vigor", "Compostura"];
}
function updateArray(setter: any, values: any[], index: number, value: any) {
  const next = [...values];
  next[index] = value;
  setter(next);
}
function normalizeSpecialties(value: unknown): Specialty[] {
  if (!Array.isArray(value) || value.length === 0)
    return Array.from({ length: 3 }, () => ({ skill: "", name: "" }));
  const normalized = value.map((item) => {
    const record = item as Record<string, unknown>;
    return typeof item === "string"
      ? { skill: "", name: item }
      : {
          skill: String(record?.skill ?? ""),
          name: String(record?.name ?? ""),
        };
  });
  while (normalized.length < 3) normalized.push({ skill: "", name: "" });
  return normalized;
}
function readArray(
  initial: CharacterSheet | null | undefined,
  key: string,
  fallback: string[],
) {
  const value = initial?.line_data[key];
  return Array.isArray(value) ? value.map(String) : fallback;
}
function normalizeCustomCourt(value: unknown): CustomCourtDefinition | null {
  if (!value || typeof value !== "object") return null;
  const item = value as Record<string, unknown>,
    benefits = Array.isArray(item.mantleBenefits)
      ? item.mantleBenefits.map(String).slice(0, 5)
      : [];
  while (benefits.length < 5) benefits.push("");
  return {
    name: String(item.name ?? ""),
    emotion: String(item.emotion ?? ""),
    mantleBenefits: benefits,
  };
}
function normalizeCustomOrder(value: unknown): CustomOrderDefinition | null {
  if (!value || typeof value !== "object") return null;
  const item = value as Record<string, unknown>;
  const roteSkills = Array.isArray(item.roteSkills)
    ? item.roteSkills.map(String).slice(0, 3)
    : [];
  while (roteSkills.length < 3) roteSkills.push("");
  return {
    name: String(item.name ?? ""),
    description: String(item.description ?? ""),
    roteSkills,
  };
}
function readSpells(
  initial: CharacterSheet | null | undefined,
  key: string,
  count: number,
): Array<SpellSelection | null> {
  const value = initial?.line_data[key];
  const source = Array.isArray(value) ? value : [];
  const result = source.slice(0, count).map((raw): SpellSelection | null => {
    if (typeof raw === "string") {
      const found = SPELLS.find(
        (spell) => spell.name === raw || spell.originalName === raw,
      );
      return found ? { ...found } : null;
    }
    if (raw && typeof raw === "object") {
      const record = raw as Record<string, unknown>;
      const found = SPELLS.find(
        (spell) =>
          spell.id === record.id ||
          spell.originalName === record.originalName ||
          spell.name === record.name,
      );
      return found
        ? {
            ...found,
            roteSkill: String(record.roteSkill ?? found.roteSkills[0] ?? ""),
          }
        : null;
    }
    return null;
  });
  while (result.length < count) result.push(null);
  return result;
}
function emptyContract(type: "Comum" | "Real"): ContractSelection {
  return {
    id: "",
    name: "",
    originalName: "",
    type,
    regalia: "",
    description: "",
    dicePool: "",
    sourceId: "",
    source: "",
    page: 0,
  };
}
function readContracts(initial: CharacterSheet | null | undefined) {
  const value = initial?.line_data.contracts;
  const saved = Array.isArray(value)
    ? (value as Array<Record<string, unknown>>)
    : [];
  return Array.from({ length: 6 }, (_, index) => {
    const raw = saved[index];
    if (!raw) return emptyContract(index < 4 ? "Comum" : "Real");
    const found = findContract(String(raw.id ?? "")) ?? findContract(String(raw.name ?? ""));
    return found
      ? { ...found }
      : {
          ...emptyContract(index < 4 ? "Comum" : "Real"),
          name: String(raw.name ?? ""),
          originalName: String(raw.name ?? ""),
          regalia: translateRegalia(String(raw.regalia ?? "")),
        };
  });
}
function translateRegalia(value: string) {
  return (
    (
      {
        Coroa: "Crown",
        Joias: "Jewels",
        Espelho: "Mirror",
        Escudo: "Shield",
        Corcel: "Steed",
        Espada: "Sword",
        Cálice: "Chalice",
        Moeda: "Coin",
        Cetro: "Scepter",
        Estrelas: "Stars",
        Espinho: "Thorn",
      } as Record<string, string>
    )[value] ?? value
  );
}
function translateCourt(value: string) {
  return (
    (
      {
        Courtless: "Sem Corte",
        Spring: "Primavera",
        Summer: "Verão",
        Autumn: "Outono",
        Winter: "Inverno",
      } as Record<string, string>
    )[value] ?? value
  );
}
function translateNeedle(value: string) {
  return (
    (
      {
        "Chess Master": "Mestre de Xadrez",
        Commander: "Comandante",
        Composer: "Compositor",
        Counselor: "Conselheiro",
        Daredevil: "Audacioso",
        Dynamo: "Dínamo",
        Protector: "Protetor",
        Provider: "Provedor",
        Scholar: "Erudito",
        Storyteller: "Contador de Histórias",
        Teacher: "Professor",
        Traditionalist: "Tradicionalista",
        Visionary: "Visionário",
      } as Record<string, string>
    )[value] ?? value
  );
}
function translateThread(value: string) {
  return (
    (
      {
        Acceptance: "Aceitação",
        Anger: "Raiva",
        Family: "Família",
        Friendship: "Amizade",
        Hate: "Ódio",
        Honor: "Honra",
        Joy: "Alegria",
        Love: "Amor",
        Memory: "Memória",
        Revenge: "Vingança",
      } as Record<string, string>
    )[value] ?? value
  );
}
function normalizeArcana(value: unknown) {
  const source =
    value && typeof value === "object" ? (value as Record<string, number>) : {};
  const legacy: Record<string, string> = {
    Morte: "Death",
    Destino: "Fate",
    Forças: "Forces",
    Vida: "Life",
    Matéria: "Matter",
    Mente: "Mind",
    Primórdio: "Prime",
    Espaço: "Space",
    Espírito: "Spirit",
    Tempo: "Time",
  };
  return Object.fromEntries(
    ARCANA.map((item) => [
      item,
      Number(source[item] ?? source[legacy[item]] ?? 0),
    ]),
  );
}
