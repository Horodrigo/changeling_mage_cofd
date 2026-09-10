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
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
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
  CTL_NEEDLE_DEFINITIONS,
  CTL_SEEMINGS,
  CTL_SEEMING_LABELS,
  seemingDisplayName,
  CTL_THREAD_DEFINITIONS,
  changelingAnchorDisplayName,
  changelingAnchorRecovery,
  canonicalChangelingAnchorName,
  MTA_ORDERS,
  MTA_ORDER_LABELS,
  MTA_ORDER_DESCRIPTIONS,
  MTA_PATHS,
  REGALIA,
  SKILLS,
  normalizeChangelingFrailties,
  canIncreaseCreationDots,
} from "@/lib/creation-rules";
import {
  getMeritsForLine,
  meritPrerequisitesMet,
  meritSelectionProblems,
  type MeritPrerequisiteContext,
  meritRatingsFor,
  REPEATABLE_MERITS,
  UNBOUNDED_MERITS,
  type MeritDefinition,
} from "@/lib/merits";
import { CONTRACTS, findContract, type ContractDefinition } from "@/lib/contracts";
import { hasPublishedMageOrder } from "@/lib/mage-orders";
import { changelingFavoredRegalia } from "@/lib/changeling-regalia";
import { contractDisplayOptions, contractHasInvocationRoll, contractOutcomeSections, contractPresentation, contractSummary, contractWithSupplementalBenefits } from "@/lib/contract-presentation";
import { alphabetical, compareOptionLabels, orderedChoiceOptions } from "@/lib/option-order";
import { SPELLS, type SpellDefinition } from "@/lib/spells";
import { powerProgression } from "@/lib/power-progression";
import { creationMerits, mergeCreationMerits } from "@/lib/merit-progression";
import {
  arcanaCreationErrors,
  canSelectInitialContract,
  meetsArcanaRequirements,
} from "@/lib/creation-eligibility";
import { KITHS, findKith, kithDisplayName, kithPresentation, kithSearchText, kithSkillOptions, type KithDefinition } from "@/lib/changeling-kiths";
import { kithCreationChoice } from "@/lib/changeling-kith-choices";
import { CTL_COURT_DEFINITIONS, courtCanonicalId, courtDisplayName, courtPageCitation, courtPresentation } from "@/lib/changeling-courts";
import { useHomebrews } from "./use-homebrews";
import { isBuiltinHomebrew, isHomebrewActive } from "@/lib/homebrews";
import {
  decodeConfiguredRows,
  decodeHedgespunConfiguration,
  encodeConfiguredRows,
  findMeritConfiguration,
  isInlineMeritConfiguration,
  isStructuredMerit,
  meritConfigurationTitle,
  normalizeMeritConfiguration,
  synchronizeMeritGrants,
  type HedgespunBenefit,
  type MeritConfiguration,
  type TokenConfigurationItem,
  type TokenKind,
} from "@/lib/merit-configurations";
import { skillSpecialtySuggestions } from "@/lib/skill-specialties";
import { useLanguage } from "@/lib/i18n";
import { systemTerm } from "@/lib/system-terms";
import { builderText } from "./character-builder-messages";
import { ENTITLEMENTS, findEntitlement } from "@/lib/entitlements";
import { ConfirmAction } from "./workspace/confirm-action";

export type Specialty = { skill: string; name: string; grantedBy?: string };
export type MeritSelection = {
  instanceId?: string;
  name: string;
  dots: number;
  sourceId?: string;
  source?: string;
  configuration?: MeritConfiguration;
  grantedBy?: string;
  creationDots?: number;
  experienceDots?: number;
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
  initiation?: MeritSelection["configuration"];
};
type Setter<T> = (value: T) => void;
type MissingCheck = (key: string) => boolean;
type IdentityStepProps = {
  line: "CtL" | "MtA"; setLine: Setter<"CtL" | "MtA">;
  name: string; setName: Setter<string>; concept: string; setConcept: Setter<string>;
  player: string; setPlayer: Setter<string>; chronicle: string; setChronicle: Setter<string>;
  shadowName: string; setShadowName: Setter<string>; missing: MissingCheck;
};
type TraitsStepProps = {
  attributePriority: string[]; setAttributePriority: Setter<string[]>;
  skillPriority: string[]; setSkillPriority: Setter<string[]>;
  attributes: Record<string, number>; setAttributes: Setter<Record<string, number>>;
  skills: Record<string, number>; setSkills: Setter<Record<string, number>>;
  specialties: Specialty[]; setSpecialties: Setter<Specialty[]>; missing: MissingCheck;
};
type CtlStepProps = {
  seeming: string; setSeeming: Setter<string>; attributes: Record<string, number>;
  contractCatalog: ContractDefinition[]; contracts: ContractSelection[]; setContracts: Setter<ContractSelection[]>;
  favoredAttribute: string; setFavoredAttribute: Setter<string>; secondRegalia: string; setSecondRegalia: Setter<string>;
  needle: string; setNeedle: Setter<string>; thread: string; setThread: Setter<string>; touchstone: string; setTouchstone: Setter<string>;
  wyrd: number; setWyrd: Setter<number>; maximumPowerFromMerits: number; powerAdvancement: number;
  aspirations: string[]; setAspirations: Setter<string[]>; meritContext: MeritPrerequisiteContext; meritCatalog: MeritDefinition[]; merits: MeritSelection[]; setMerits: Setter<MeritSelection[]>;
  meritSpent: number; meritBudget: number; court: string; missing: MissingCheck;
  kith: string; setKith: Setter<string>; customKith: boolean; setCustomKith: Setter<boolean>;
  kithChoice: string; setKithChoice: Setter<string>; specialties: Specialty[];
  customKithSkill: string; setCustomKithSkill: Setter<string>; customKithDescription: string; setCustomKithDescription: Setter<string>;
  kithCatalog?: Array<KithDefinition & {homebrew?:true}>;
  customCourt: CustomCourtDefinition | null; setCustomCourt: Setter<CustomCourtDefinition | null>; setCourt: Setter<string>; courtCatalog?: CustomCourtDefinition[];
};
type OrderSelectorProps = {order:string;setOrder:Setter<string>;customOrder:CustomOrderDefinition|null;setCustomOrder:Setter<CustomOrderDefinition|null>;orderCatalog?:CustomOrderDefinition[];invalid?:boolean};
type MtaStepProps = {
  path:string;setPath:Setter<string>;order:string;customOrder:CustomOrderDefinition|null;setCustomOrder:Setter<CustomOrderDefinition|null>;setOrder:Setter<string>;orderCatalog?:CustomOrderDefinition[];
  gnosis:number;setGnosis:Setter<number>;maximumPowerFromMerits:number;powerAdvancement:number;virtue:string;setVirtue:Setter<string>;vice:string;setVice:Setter<string>;
  resistanceBonus:string;setResistanceBonus:Setter<string>;nimbus:string;setNimbus:Setter<string>;tool:string;setTool:Setter<string>;
  arcana:Record<string,number>;setArcana:Setter<Record<string,number>>;rotes:Array<SpellSelection|null>;setRotes:Setter<Array<SpellSelection|null>>;
  praxes:Array<SpellSelection|null>;setPraxes:Setter<Array<SpellSelection|null>>;spellCatalog:SpellDefinition[];
  aspirations:string[];setAspirations:Setter<string[]>;meritContext:MeritPrerequisiteContext;meritCatalog:MeritDefinition[];merits:MeritSelection[];setMerits:Setter<MeritSelection[]>;
  meritSpent:number;meritBudget:number;missing:MissingCheck;
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
  for (const [name, dots] of Object.entries(experienceTraitDots(initial, "attributes")))
    values[name] = Math.max(1, Number(values[name] ?? 1) - dots);
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
    editableSpecialties(initial),
  );
  const [aspirations, setAspirations] = useState<string[]>(
    readArray(initial, "aspirations", ["", "", ""]),
  );
  const [merits, setMerits] = useState<MeritSelection[]>(() => [
    ...creationMerits(initial?.merits),
    ...(initial?.merits ?? [])
      .filter((merit) => ["Corte", "Ordem", "Nameless Order"].includes(String(merit.grantedBy)))
      .map((merit) => ({ ...merit, dots: Math.max(1, Number(merit.creationDots ?? merit.dots) - Number(merit.experienceDots ?? 0)) })),
  ]);

  const [seeming, setSeeming] = useState(
    String(initial?.line_data.seeming ?? ""),
  );
  const [kith, setKith] = useState(String(initial?.line_data.kith ?? ""));
  const [kithChoice,setKithChoice]=useState(String(initial?.line_data.kith_choice??""));
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
    canonicalChangelingAnchorName("needle",initial?.line_data.needle),
  );
  const [thread, setThread] = useState(
    canonicalChangelingAnchorName("thread",initial?.line_data.thread),
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
  const [order, setOrder] = useState(String(initial?.line_data.order || "Orderless"));
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
    editableArcana(initial),
  );
  const [rotes, setRotes] = useState<Array<SpellSelection | null>>(
    readSpells(initial, "rotes", 3),
  );
  const [praxes, setPraxes] = useState<Array<SpellSelection | null>>(
    readSpells(initial, "praxes", 3),
  );
  const [error, setError] = useState("");
  const hasCreationOrderBenefits = hasPublishedMageOrder(order) || order === "Nameless";

  useEffect(() => {
    const wanted: MeritSelection[] =
      line === "CtL" && court && !["Sem Corte", "Courtless"].includes(court)
        ? [{ name: "Mantle", dots: 1, grantedBy: "Corte", sourceId: "ctl-2ed", source: "Changeling the Lost", configuration: { court } }]
        : line === "MtA" && hasPublishedMageOrder(order)
          ? [
              { name: "Awakened Status", dots: 1, grantedBy: "Ordem", sourceId: "mta-2ed", source: "Mage the Awakening", configuration: { domain: order, name: order } },
              { name: "High Speech", dots: 1, grantedBy: "Ordem", sourceId: "mta-2ed", source: "Mage the Awakening", configuration: {} },
            ]
          : line === "MtA" && order === "Nameless"
            ? [
                { name: "Mystery Cult Initiation", dots: 1, grantedBy: "Nameless Order", sourceId: "core-2ed", source: "Chronicles of Darkness", configuration: { ...normalizeMeritConfiguration(customOrder?.initiation), cult: customOrder?.name ?? "", level_1_type: "merit", level_1_merits: ["High Speech|1"] } },
              ]
            : [];
    // Keep rule-granted creation Merits in the editable allocation list.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMerits((current) => {
      const automatic = new Set(["Corte", "Ordem", "Nameless Order"]);
      const grantedNames = new Set(wanted.map((merit) => merit.name));
      const paidWithExperience = (name: string) => current.some(
        (merit) => merit.name === name && !merit.grantedBy && Number(merit.experienceDots ?? 0) > 0,
      );
      const retained = current.filter((merit) =>
        !automatic.has(String(merit.grantedBy)) &&
        !(grantedNames.has(merit.name) && Number(merit.experienceDots ?? 0) === 0),
      );
      const grants = wanted.filter((merit) => !paidWithExperience(merit.name));
      const next = [...retained, ...grants.map((grant) => {
        const existing = current.find((merit) =>
          merit.name === grant.name &&
          (merit.grantedBy === grant.grantedBy || (!merit.grantedBy && Number(merit.experienceDots ?? 0) === 0)),
        );
        return {
          ...existing,
          instanceId: existing?.instanceId ?? crypto.randomUUID(),
          ...grant,
          dots: Math.max(1, Number(existing?.dots ?? 1)),
          configuration: {
            ...normalizeMeritConfiguration(existing?.configuration),
            ...grant.configuration,
          },
        };
      })];
      return JSON.stringify(next) === JSON.stringify(current) ? current : next;
    });
  }, [line, court, order, customOrder?.name, customOrder?.initiation]);

  const meritBudget = Math.max(0, 10 - (line === "CtL" ? (wyrd - 1) * 5 : (gnosis - 1) * 5));
  const meritContext: MeritPrerequisiteContext = {
    gameLine:line, attributes, skills: {...skills,...(line==="MtA"&&hasCreationOrderBenefits?{Ocultismo:Math.min(5,(skills.Ocultismo??0)+1)}:{})},
    seeming,kith,wyrd,gnosis,arcana,path,order,court,
    mantle:line==="CtL"&&court&&court!=="Sem Corte"?Math.max(1,initial?.merits.find(item=>item.name==="Mantle"&&item.grantedBy==="Corte")?.dots??1):0,
    merits:mergeCreationMerits(initial?.merits,merits),
    powers:contracts.map(item=>item.originalName||item.name).filter(Boolean),
  };
  const meritCatalog = useMemo(() => {
    const merged = new Map(
      getMeritsForLine(line).filter(item=>(!isBuiltinHomebrew(item.sourceId)||isHomebrewActive(homebrews,item.sourceId))).map(item=>[item.name.toLocaleLowerCase(),item]),
    );
    homebrews.merits
      .filter((item) => (item.line === "Core" || item.line === line) && isHomebrewActive(homebrews,item.id))
      .forEach((item) => merged.set(item.name.toLocaleLowerCase(), item));
    return [...merged.values()].sort((a, b) =>
      a.translatedName.localeCompare(b.translatedName, "pt-BR"),
    );
  }, [court, homebrews, line, merits]);
  const meritSpent = merits.reduce((sum, item) => sum + Math.max(0, item.dots - (item.grantedBy ? 1 : 0)), 0);
  const pathData =
    MTA_PATHS[path as keyof typeof MTA_PATHS] ?? MTA_PATHS.Acanthus;
  const maximumPowerFromMerits = Math.max(1, Math.min(3, 1 + Math.floor(Math.max(0, 10 - meritSpent) / 5)));
  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (line === "CtL" && wyrd > maximumPowerFromMerits)
        setWyrd(maximumPowerFromMerits);
      if (line === "MtA" && gnosis > maximumPowerFromMerits)
        setGnosis(maximumPowerFromMerits);
    }, 0);
    return () => window.clearTimeout(timer);
  }, [line, meritSpent, maximumPowerFromMerits, wyrd, gnosis]);

  const validationIssues = useMemo(() => {
    const issues: Array<{ step: number; key: string; label: string }> = [];
    const add = (step: number, key: string, label: string) =>
      issues.push({ step, key, label });
    if (line === "CtL" && !name.trim()) add(1, "name", tr("Nome do personagem", "Character name"));
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
    for(const item of merits){
      const definition=meritCatalog.find(def=>def.name===item.name);
      if(definition) for(const message of meritSelectionProblems(definition,item,meritContext)) add(3,"merits",`${item.name}: ${message}`);
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
      if (!customKith && kithCreationChoice(findKith(kith)?.id) && !kithChoice.trim())
        add(3, "kith-choice", tr("Escolha da Bênção da Fratria", "Kith Blessing choice"));
      const favoredRegalia = changelingFavoredRegalia({
        primary_regalia: CTL_SEEMINGS[seeming as keyof typeof CTL_SEEMINGS]?.regalia,
        second_regalia: secondRegalia, kith, kith_custom: customKith,
      });
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
        ["resistanceBonus", resistanceBonus, "Atributo de Resistência"],
      ].forEach(([key, value, label]) => {
        if (!value) add(3, key, label);
      });
      if (order === "Nameless" && (!customOrder?.name.trim() || customOrder.roteSkills.length !== 3 || customOrder.roteSkills.some((skill) => !skill) || new Set(customOrder.roteSkills).size !== 3))
        add(3, "order", tr("Definição completa da Nameless Order", "Complete Nameless Order definition"));
      arcanaCreationErrors(arcana, path ? pathData : undefined).forEach(
        (message) => add(3, "arcana", message),
      );
      if (
        hasCreationOrderBenefits &&
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
    kithChoice,
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
    const finalArcana = { ...arcana };
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
    if (line === "MtA" && hasCreationOrderBenefits)
      finalSkills["Ocultismo"] = Math.min(
        5,
        (finalSkills["Ocultismo"] ?? 0) + 1,
      );
    for (const [name, dots] of Object.entries(experienceTraitDots(initial, "attributes")))
      finalAttributes[name] = Number(finalAttributes[name] ?? 1) + dots;
    for (const [name, dots] of Object.entries(experienceTraitDots(initial, "skills")))
      finalSkills[name] = Number(finalSkills[name] ?? 0) + dots;
    for (const [name, dots] of Object.entries(experienceArcanaDots(initial)))
      finalArcana[name] = Number(finalArcana[name] ?? 0) + dots;
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
            kith_choice: customKith ? "" : kithChoice,
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
            resistance_bonus: resistanceBonus,
            order_occult_bonus:hasCreationOrderBenefits?Math.max(0,Math.min(5,(skills.Ocultismo??0)+1)-(skills.Ocultismo??0)):0,
            creation_gnosis: gnosis,
            gnosis: Math.min(10, gnosis + gnosisProgression.advancement),
            wisdom: Number(initial?.line_data.wisdom ?? 7),
            arcana: finalArcana,
            rotes: hasCreationOrderBenefits ? rotes.filter(Boolean) : [],
            praxes: praxes.slice(0, gnosis).filter(Boolean),
            ruling_arcana: pathData.ruling,
            inferior_arcanum: pathData.inferior,
            rote_skills:
              order === "Nameless" && customOrder
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
        name: line === "MtA" ? shadowName.trim() : name.trim(),
        concept: concept.trim(),
        player: playerName.trim(),
        chronicle: chronicle.trim(),
      },
      attributes: finalAttributes,
      skills: finalSkills,
      specializations: [
        ...specialties.filter((item) => item.skill && item.name.trim()).map((item) => ({skill:item.skill,name:item.name.trim()})),
        ...experienceSpecialties(initial),
        ...(initial?.specializations??[]).filter(item=>Boolean(item.grantedBy)),
      ],
      merits: [
        ...mergeCreationMerits(initial?.merits, merits.map((item) => {
          const definition = meritCatalog.find(
            (entry) => entry.name === item.name,
          );
          return {
            ...item,
            configuration: normalizeMeritConfiguration(item.configuration),
            sourceId: definition?.sourceId,
            source: definition?.source,
          };
        })),
        ...(line === "MtA" && hasPublishedMageOrder(order) && !merits.some(item=>item.name==="High Speech") && !initial?.merits.some(item=>item.name==="High Speech"&&item.experienceDots)
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
                kithChoice,
                setKithChoice,
                specialties,
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
                meritContext,
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
                meritContext,
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
}: IdentityStepProps) {
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
        {line === "CtL" ? <label className={missing("name") ? "missing-field" : ""}>
          {tr("Nome", "Name")}
          <Input value={name} onChange={(e) => setName(e.target.value)} />
        </label> : <label className={missing("shadowName") ? "missing-field" : ""}>
          {tr("Nome das Sombras", "Shadow Name")}
          <Input value={shadowName} onChange={(event) => setShadowName(event.target.value)} placeholder={tr("Nome mágico do personagem", "Character's magical name")} />
        </label>}
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
  for (const [name, dots] of Object.entries(experienceTraitDots(initial, "skills")))
    values[name] = Math.max(0, Number(values[name] ?? 0) - dots);
  if (
    initial?.game_line === "MtA" &&
    (hasPublishedMageOrder(initial.line_data.order) || initial.line_data.order === "Nameless") &&
    values["Ocultismo"] > 0
  ) {
    values["Ocultismo"] -= Number(initial.line_data.order_occult_bonus ?? 1);
  }
  return values;
}

function TraitsStep(props: TraitsStepProps) {
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

function CtlStep(props: CtlStepProps) {
  const { locale, tr } = useLanguage();
  const homebrews=useHomebrews();
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
  const secondRegaliaRoyalCount = props.contractCatalog.filter(
    (contract) => contract.type === "Real" && contract.regalia === props.secondRegalia,
  ).length;
  return (
    <div className="builder-section">
      <span className="kicker">{tr("PASSO 3 · CHANGELING", "STEP 3 · CHANGELING")}</span>
      <h2>{tr("Modelo dos Perdidos", "Lost Template")}</h2>
      <p>{tr("As escolhas e limites abaixo vêm de Changeling the Lost.", "The choices and limits below come from Changeling the Lost.")}</p>
      <div className="ctl-template-grid">
        <div className="ctl-template-primary">
          <Choice
            label={tr("Feição", "Seeming")}
            value={props.seeming}
            setValue={props.setSeeming}
            options={Object.entries(CTL_SEEMINGS).filter(([,item])=>!("sourceId" in item)||isHomebrewActive(homebrews,item.sourceId)).map(([name])=>name)}
            optionLabels={Object.fromEntries(Object.entries(CTL_SEEMINGS).map(([name,item])=>[
              name,
              locale === "pt-BR"
                ? `${seemingDisplayName(name, locale)} - favorece a ${systemTerm(item.regalia, locale)}`
                : `${name} - favors the ${item.regalia}`,
            ]))}
            invalid={props.missing("seeming")}
          />
          <div className="ctl-favored-inline">
            <Choice
              label={tr("Atributo favorecido (+1)", "Favored Attribute (+1)")}
              value={props.favoredAttribute}
              setValue={props.setFavoredAttribute}
              options={favored}
              invalid={props.missing("favoredAttribute")}
            />
          </div>
          <div className="regalia-choice-stack">
            <span className="regalia-field-label">{tr("Segunda Regalia favorecida", "Second favored Regalia")}</span>
            <div className="regalia-information" aria-live="polite">
              <strong>{props.secondRegalia ? systemTerm(props.secondRegalia, locale) : tr("Segunda Regalia", "Second Regalia")}</strong>
              <p>{props.secondRegalia
                ? tr(
                    `Esta Regalia favorecida libera seus Contratos Reais (${secondRegaliaRoyalCount} disponíveis nas fontes ativas). Ela não altera a bênção da Feição.`,
                    `This favored Regalia grants access to its Royal Contracts (${secondRegaliaRoyalCount} available from active sources). It does not change the Seeming blessing.`,
                  )
                : tr("Escolha uma segunda Regalia favorecida para liberar outra categoria de Contratos Reais.", "Choose a second favored Regalia to unlock another category of Royal Contracts.")}</p>
            </div>
            <div className="regalia-select">
              <Choice
                label=""
                value={props.secondRegalia}
                setValue={props.setSecondRegalia}
                options={availableRegalia.filter((item) => item !== seemingData?.regalia)}
                invalid={props.missing("secondRegalia")}
              />
            </div>
          </div>
        </div>
        <div className="ctl-template-secondary">
          <div className={props.missing("kith") ? "missing-field" : ""}><KithSelector {...props} /></div>
          <ChangelingAnchorSelector kind="needle" value={props.needle} setValue={props.setNeedle} invalid={props.missing("needle")}/>
        </div>
        <div className="ctl-template-secondary">
          <div className={props.missing("court") ? "missing-field" : ""}><CourtSelector {...props} /></div>
          <ChangelingAnchorSelector kind="thread" value={props.thread} setValue={props.setThread} invalid={props.missing("thread")}/>
        </div>
      </div>
      <div className={props.missing("contracts") ? "missing-field block" : ""}>
        <ContractSelector
          contracts={props.contracts}
          setContracts={props.setContracts}
          seeming={props.seeming}
          primaryRegalia={seemingData?.regalia ?? ""}
          secondRegalia={props.secondRegalia}
          kith={props.kith}
          customKith={props.customKith}
          court={props.court}
          catalog={props.contractCatalog}
        />
      </div>
      <div className={props.missing("merits") ? "missing-field block" : ""}>
        <Merits
          merits={props.merits}
          setMerits={props.setMerits}
          catalog={props.meritCatalog}
          context={props.meritContext}
          spent={props.meritSpent}
          budget={props.meritBudget}
          currentCourt={props.court}
          wyrd={props.wyrd}
          setWyrd={props.setWyrd}
        />
      </div>
    </div>
  );
}

function CourtSelector(props: Pick<CtlStepProps,"court"|"setCourt"|"customCourt"|"setCustomCourt"|"courtCatalog">) {
  const { locale, tr } = useLanguage();
  const homebrews = useHomebrews();
  const [courtSearch, setCourtSearch] = useState("");
  const [courtSource, setCourtSource] = useState("all");
  const select = (name: string) => {
    props.setCourt(name);
    props.setCustomCourt(null);
  };
  const officialCourt = courtPresentation(props.court, locale);
  const officialCourts = CTL_COURT_DEFINITIONS.filter(
    (court) => court.sourceId !== "h-courts" || isHomebrewActive(homebrews, "h-courts"),
  );
  const courtOptions = alphabetical([
    ...officialCourts.map((court) => ({
      value: court.id,
      label: courtDisplayName(court.id, locale),
      detail: `${locale === "pt-BR" ? court.emotionPt : court.emotion} · ${court.source} · p. ${courtPageCitation(court)}`,
      source: court.source,
    })),
  ], (court) => court.label, locale);
  const courtSources = alphabetical([...new Set(courtOptions.map((court) => court.source))], (source) => source, locale);
  const normalizedCourtSearch = courtSearch.trim().toLocaleLowerCase(locale);
  const filteredCourts = courtOptions.filter((court) =>
    (courtSource === "all" || court.source === courtSource) &&
    (!normalizedCourtSearch || `${court.label} ${court.detail}`.toLocaleLowerCase(locale).includes(normalizedCourtSearch)),
  );
  return (
    <div className="kith-field">
      <span>{tr("Corte", "Court")}</span>
      <div className="kith-current">
        <strong>{props.court ? courtDisplayName(props.court, locale) : tr("Nenhuma selecionada", "None selected")}</strong>
        <small>
          {!props.court
            ? tr("Nenhuma Corte selecionada: o personagem será salvo como Sem Corte.", "No Court selected: the character will be saved as Courtless.")
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
            <DialogTitle>{tr("Selecionar Corte", "Select Court")}</DialogTitle>
            <DialogDescription>
              {tr("Escolha entre as Cortes consolidadas das fontes ativas.", "Choose among the consolidated Courts from active sources.")}
            </DialogDescription>
          </DialogHeader>
          <div className="court-catalog-filters">
            <label className="merit-search">
              <Search aria-hidden="true" />
              <Input value={courtSearch} onChange={(event) => setCourtSearch(event.target.value)} placeholder={tr("Buscar Corte…", "Search Court…")} />
            </label>
            <Choice label={tr("Fonte", "Source")} value={courtSource} setValue={setCourtSource} options={["all", ...courtSources]} optionLabels={{ all: tr("Todas", "All") }} />
          </div>
          <div className="court-catalog">
            <button type="button" className={!props.court ? "court-option selected" : "court-option"} onClick={() => select("")}>
              <strong>{tr("Sem Corte", "Courtless")}</strong>
              <small>{tr("O personagem não pertence a uma Corte.", "The character does not belong to a Court.")}</small>
            </button>
            {filteredCourts.map((court) => (
              <button type="button" className={courtCanonicalId(props.court) === courtCanonicalId(court.value) ? "court-option selected" : "court-option"} key={court.value} onClick={() => select(court.value)}>
                <strong>{court.label}</strong>
                <small>{court.detail}</small>
              </button>
            ))}
            {!filteredCourts.length && <p className="empty-state">{tr("Nenhuma Corte encontrada.", "No Courts found.")}</p>}
          </div>
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

function ChangelingAnchorSelector({kind,value,setValue,invalid=false}:{kind:"needle"|"thread";value:string;setValue:(value:string)=>void;invalid?:boolean}) {
  const {locale,tr}=useLanguage();
  const homebrews=useHomebrews();
  const [search,setSearch]=useState("");
  const [sourceFilter,setSourceFilter]=useState("all");
  const definitions=(kind==="needle"?CTL_NEEDLE_DEFINITIONS:CTL_THREAD_DEFINITIONS).filter((item)=>!item.sourceId||isHomebrewActive(homebrews,item.sourceId));
  const sources=alphabetical([...new Set(definitions.map((item)=>item.source).filter((source):source is string=>Boolean(source)))],(source)=>source,locale);
  const label=kind==="needle"?tr("Agulha","Needle"):tr("Fio","Thread");
  const normalized=search.trim().toLocaleLowerCase(locale);
  const filtered=definitions.filter((item)=>(sourceFilter==="all"||item.source===sourceFilter)&&(!normalized||`${item.name} ${changelingAnchorRecovery(kind,item.name,locale)}`.toLocaleLowerCase(locale).includes(normalized)));
  return <div className={`kith-field anchor-field${invalid?" missing-field":""}`}>
    <span>{label}</span>
    <div className="kith-current"><strong>{value?changelingAnchorDisplayName(kind,value,locale):tr("Nenhuma seleção","None selected")}</strong><small>{value?changelingAnchorRecovery(kind,value,locale).replace("\n"," · "):tr("Consulte os gatilhos de recuperação de Força de Vontade antes de escolher.","Review the Willpower recovery triggers before choosing.")}</small></div>
    <Dialog>
      <DialogTrigger asChild><Button type="button" variant="outline"><Search/> {tr(`Selecionar ${label}`,`Select ${label}`)}</Button></DialogTrigger>
      <DialogContent className="merit-dialog anchor-dialog">
        <DialogHeader><DialogTitle>{tr(`Selecionar ${label}`,`Select ${label}`)}</DialogTitle><DialogDescription>{tr("Cada opção recupera 1 ponto ou toda a Força de Vontade em circunstâncias diferentes.","Each option recovers either 1 point or all Willpower under different circumstances.")}</DialogDescription></DialogHeader>
        <label className="merit-search"><Search aria-hidden="true"/><Input value={search} onChange={(event)=>setSearch(event.target.value)} placeholder={tr("Buscar por nome ou gatilho…","Search by name or trigger…")}/></label>
        <div className="catalog-filters anchor-filters"><label>{tr("Fonte","Source")}<Select value={sourceFilter} onValueChange={setSourceFilter}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent><SelectItem value="all">{tr("Todas as Fontes","All Sources")}</SelectItem>{sources.map((source)=><SelectItem key={source} value={source}>{source}</SelectItem>)}</SelectContent></Select></label></div>
        <div className="merit-catalog anchor-catalog">{filtered.map((item)=><article key={item.name} className={value===item.name?"selected":""}><div><strong>{changelingAnchorDisplayName(kind,item.name,locale)}</strong>{item.source&&<small>{item.source} · p. {item.page}</small>}<p>{changelingAnchorRecovery(kind,item.name,locale).split("\n").map((line,index)=><span key={line}>{index===0?"":""}{line}</span>)}</p></div><DialogClose asChild><Button type="button" size="sm" variant={value===item.name?"secondary":"outline"} onClick={()=>setValue(item.name)}>{value===item.name?tr("Selecionado","Selected"):tr("Selecionar","Select")}</Button></DialogClose></article>)}</div>
        <DialogFooter><DialogClose asChild><Button type="button" variant="outline">{tr("Concluir","Done")}</Button></DialogClose></DialogFooter>
      </DialogContent>
    </Dialog>
  </div>;
}

function KithSelector(props: Pick<CtlStepProps,"kith"|"setKith"|"kithChoice"|"setKithChoice"|"specialties"|"customKith"|"setCustomKith"|"customKithSkill"|"setCustomKithSkill"|"customKithDescription"|"setCustomKithDescription"|"kithCatalog">) {
  const { locale, tr } = useLanguage();
  const homebrews=useHomebrews();
  const [search, setSearch] = useState("");
  const [skillFilter,setSkillFilter]=useState("all");
  const [sourceFilter,setSourceFilter]=useState("all");
  const normalized = kithSearchText(search);
  const kithName = (item: KithDefinition & {homebrew?:true}) => locale === "pt-BR" ? (item.translatedName ?? item.name) : item.name;
  const kithText = (item: KithDefinition & {homebrew?:true}) => item.homebrew
    ? {name:item.name,description:item.description,blessing:item.blessing,skill:item.skill}
    : kithPresentation(item.id,locale);
  const allKiths: Array<KithDefinition & {homebrew?:true}> = KITHS.filter((item)=>!item.sourceId||isHomebrewActive(homebrews,item.sourceId)).sort((a,b)=>kithName(a).localeCompare(kithName(b),locale));
  const skillOptionSet=new Set(allKiths.flatMap(kithSkillOptions));
  const skillGroups=Object.entries(SKILLS).map(([category,skills])=>({
    category,
    skills:skills.map(skill=>systemTerm(skill,"en-US")).filter(skill=>skillOptionSet.has(skill)),
  }));
  const canonicalSkills=new Set(skillGroups.flatMap(group=>group.skills));
  const otherSkillOptions=alphabetical([...skillOptionSet].filter(skill=>!canonicalSkills.has(skill)),skill=>systemTerm(skill,locale),locale);
  const sourceOptions=alphabetical([...new Set(allKiths.map((item)=>item.source).filter(Boolean))],(value)=>value,locale);
  const selected = findKith(props.kith);
  const creationChoice=selected&&!props.customKith?kithCreationChoice(selected.id):undefined;
  const creationChoiceOptions=creationChoice?.kind==="specialty"
    ? props.specialties.filter(item=>creationChoice.skillNames?.includes(systemTerm(item.skill,"en-US"))&&item.name.trim()).map(item=>`${systemTerm(item.skill,"en-US")}: ${item.name.trim()}`)
    : [...(creationChoice?.options??[])];
  const filtered = allKiths.filter(
    (item) =>
      (skillFilter==="all"||kithSkillOptions(item).includes(skillFilter))&&
      (sourceFilter==="all"||item.source===sourceFilter)&&
      (!normalized||kithSearchText(`${item.translatedName ?? ""} ${item.name} ${kithSkillOptions(item).join(" ")} ${item.skill} ${item.description} ${item.blessing} ${item.source}`).includes(normalized)),
  );
  const choose = (item: KithDefinition & {homebrew?:true}) => {
    if(item.id!==selected?.id)props.setKithChoice("");
    props.setKith(item.id === "chimera-book-of-seemings" ? item.id : item.name);
    props.setCustomKith(Boolean(item.homebrew));
    props.setCustomKithSkill(item.skill);
    props.setCustomKithDescription(item.description);
  };
  return (
    <div className="kith-field">
      <span>{tr("Fratria", "Kith")}</span>
      <div className={`kith-current${creationChoice?" has-choice":""}`}>
        <div className="kith-choice-row">
          <strong>{(selected ? kithName(selected) : kithDisplayName(props.kith, props.customKith, locale)) || tr("Nenhuma selecionada", "None selected")}</strong>
          {creationChoice&&(creationChoice.kind==="text"?
            <Input className="kith-choice-inline" aria-label={locale==="pt-BR"?creationChoice.labelPt:creationChoice.labelEn} value={props.kithChoice} onChange={event=>props.setKithChoice(event.target.value)} placeholder={locale==="pt-BR"?creationChoice.placeholderPt:creationChoice.placeholderEn}/>
            : <Select value={props.kithChoice} onValueChange={props.setKithChoice} disabled={!creationChoiceOptions.length}><SelectTrigger className={`kith-choice-inline${props.kithChoice?"":" missing-choice"}`} size="sm" aria-label={locale==="pt-BR"?creationChoice.labelPt:creationChoice.labelEn}><SelectValue placeholder={creationChoice.kind==="specialty"&&!creationChoiceOptions.length?tr("Escolha uma Especialização","Choose a Specialty"):(locale==="pt-BR"?creationChoice.labelPt:creationChoice.labelEn)}/></SelectTrigger><SelectContent>{creationChoiceOptions.map(option=>{const [skill,...detail]=option.split(": ");return <SelectItem key={option} value={option}>{detail.length?`${systemTerm(skill,locale)}: ${detail.join(": ")}`:systemTerm(option,locale)}</SelectItem>;})}</SelectContent></Select>
          )}
        </div>
        <small>{selected?`${kithText(selected).skill} · ${selected.source} · p. ${selected.page}`:tr("Abra o catálogo para escolher","Open the catalog to choose")}</small>
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
          <div className="catalog-filters kith-filters">
            <label>{tr("Perícia","Skill")}<Select value={skillFilter} onValueChange={setSkillFilter}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent>
              <SelectItem value="all">{tr("Todas as Perícias","All Skills")}</SelectItem>
              {skillGroups.map((group)=><SelectGroup key={group.category}>
                <SelectSeparator/><SelectLabel>{systemTerm(group.category,locale)}</SelectLabel>
                {group.skills.map(skill=><SelectItem key={skill} value={skill}>{systemTerm(skill,locale)}</SelectItem>)}
              </SelectGroup>)}
              {otherSkillOptions.length>0&&<SelectGroup><SelectSeparator/><SelectLabel>{tr("Outras opções","Other options")}</SelectLabel>{otherSkillOptions.map(option=><SelectItem key={option} value={option}>{option}</SelectItem>)}</SelectGroup>}
            </SelectContent></Select></label>
            <label>{tr("Fonte","Source")}<Select value={sourceFilter} onValueChange={setSourceFilter}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent><SelectItem value="all">{tr("Todas as Fontes","All Sources")}</SelectItem>{sourceOptions.map((source)=><SelectItem key={source} value={source}>{source}</SelectItem>)}</SelectContent></Select></label>
          </div>
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
  kith,
  customKith,
  court,
  catalog,
}: {
  contracts: ContractSelection[];
  setContracts: (value: ContractSelection[]) => void;
  seeming: string;
  primaryRegalia: string;
  secondRegalia: string;
  kith: string;
  customKith: boolean;
  court: string;
  catalog: ContractDefinition[];
}) {
  const { locale, tr } = useLanguage();
  const contractName = (item: ContractDefinition | ContractSelection) => locale === "pt-BR" ? item.name : (item.originalName || item.name);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [regaliaFilter, setRegaliaFilter] = useState("all");
  const normalizedSearch = search.trim().toLocaleLowerCase("pt-BR");
  const commonFull = contracts.slice(0, 4).every((item) => item.name);
  const royalFull = contracts.slice(4).every((item) => item.name);
  const availableContracts = alphabetical(catalog, contractName,locale)
    .sort((left, right) => Number(left.type === "Real") - Number(right.type === "Real"))
    .filter((contract) =>
      canSelectInitialContract(
        contract,
        changelingFavoredRegalia({primary_regalia:primaryRegalia, second_regalia:secondRegalia, kith, kith_custom:customKith}),
        court,
      ) &&
      (typeFilter === "all" || (typeFilter === "common" ? contract.type === "Comum" : contract.type === "Real")) &&
      (regaliaFilter === "all" || contract.regalia === regaliaFilter) &&
      (!((contract.type === "Comum" ? commonFull : royalFull)) || contracts.some((item) => item.id === contract.id || item.originalName === contract.originalName)),
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
      <Dialog>
      <div className="merit-heading">
        <div>
          <h3>{tr("Contratos iniciais", "Starting Contracts")}</h3>
          <p>
            {tr("Selecione quatro Contratos Comuns — incluindo Contratos Goblin — e dois Reais. Expanda uma escolha para rever todos os detalhes.", "Select four Common Contracts — including Goblin Contracts — and two Royal Contracts. Expand a choice to review all details.")}
          </p>
        </div>
        <div className="merit-heading-actions"><Badge variant="outline">
          {contracts.filter((item) => item.name).length}/6 {tr("selecionados", "selected")}
        </Badge><DialogTrigger asChild><Button type="button" variant="outline" size="sm" className="builder-add-action">{tr("Adicionar Contrato", "Add Contract")}</Button></DialogTrigger></div>
      </div>
      <DialogContent className="merit-dialog">
        <DialogHeader>
          <DialogTitle>{tr("Adicionar Contrato", "Add Contract")}</DialogTitle>
          <DialogDescription>
            {tr("Separados por Regalia, com efeito, brecha, parada de dados e o benefício da Feição atual. Contratos Goblin ocupam vagas de Contrato Comum e geram Débito Goblin quando invocados com sucesso. Contratos Reais respeitam suas Regalias favorecidas; Contratos de Corte respeitam a Corte selecionada.", "Grouped by Regalia, with effect, loophole, dice pool, and the current Seeming benefit. Goblin Contracts fill Common Contract slots and generate Goblin Debt when successfully invoked. Royal Contracts follow favored Regalia; Court Contracts follow the selected Court.")}
          </DialogDescription>
        </DialogHeader>
        <div className="catalog-filters">
          <label className="merit-search"><Search aria-hidden="true" /><Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder={tr("Buscar contrato, Regalia ou fonte…", "Search Contract, Regalia, or source…")} /></label>
          <Choice value={typeFilter} setValue={setTypeFilter} options={["all","common","royal"]} optionLabels={{all:tr("Todos os tipos","All types"),common:tr("Comum","Common"),royal:tr("Real","Royal")}} />
          <Choice value={regaliaFilter} setValue={setRegaliaFilter} options={["all",...alphabetical([...new Set(catalog.map((item)=>item.regalia))],(item)=>systemTerm(item,locale),locale)]} optionLabels={{all:tr("Todas as categorias","All categories"),...Object.fromEntries(catalog.map((item)=>[item.regalia,systemTerm(item.regalia,locale)]))}} />
        </div>
        <div className="merit-catalog">
          {groups.map(({ regalia, items }) => (
            <section className="merit-category" key={regalia}>
              <h3>{systemTerm(regalia,locale)} <Badge variant="outline">{items.length}</Badge></h3>
              <div>
                {items.map((contract) => {
                  const presented = contractPresentation(contract, locale);
                  const summary = contractSummary(contract, locale);
                  const displayOptions = contractDisplayOptions(presented, locale);
                  const outcomeSections = contractOutcomeSections(presented, locale);
                  const selected = contracts.some((item) => item.id === contract.id || item.originalName === contract.originalName);
                  const full = contract.type === "Comum" ? commonFull : royalFull;
                  const benefit = presented.seemingBenefits?.[seeming as keyof typeof presented.seemingBenefits];
                  return <article className={selected ? "merit-option selected" : "merit-option"} key={contract.id}><div><strong>{contractName(contract)}</strong><small>{contract.goblin ? "Goblin" : contract.type === "Comum" ? tr("Comum", "Common") : tr("Real", "Royal")} · {contract.source} · p. {contract.page || "—"}</small>{summary && <p className="rule-detail"><strong>{tr("Resumo", "Summary")}:</strong> {summary}</p>}{contractHasInvocationRoll(presented) === true && <p className="rule-detail"><strong>{tr("Parada de dados", "Dice Pool")}:</strong> {presented.dicePool ?? tr("Não informada", "Not listed")}</p>}{presented.cost && <p className="rule-detail"><strong>{tr("Custo", "Cost")}:</strong> {presented.cost}</p>}{displayOptions.length > 0 && <p className="rule-detail"><strong>{tr("Opções", "Options")}:</strong> {displayOptions.join(" · ")}</p>}{outcomeSections[0]?.text && <p className="rule-detail">{outcomeSections[0].text}</p>}{benefit && <p className="rule-detail"><strong>{tr("Benefício", "Benefit")}:</strong> {benefit}</p>}</div><Button type="button" size="sm" variant={selected ? "secondary" : "outline"} disabled={selected || full} onClick={() => addContract(contract)}>{selected ? tr("Selecionado", "Selected") : tr("Adicionar", "Add")}</Button></article>;
                })}
              </div>
            </section>
          ))}
        </div>
        <DialogFooter><DialogClose asChild><Button type="button" variant="outline">{tr("Concluir", "Done")}</Button></DialogClose></DialogFooter>
      </DialogContent>
      </Dialog>
      <div className="contract-power-list creation-contract-list">
        {contracts.map((item,index)=>{
          if(!item.name)return <article className="creation-contract-empty" key={index}><Badge variant={index<4?"secondary":"outline"}>{index<4?tr("Comum","Common"):tr("Real","Royal")}</Badge><div><strong>{tr("Vaga disponível","Available slot")}</strong><small>{tr("Escolha no catálogo","Choose from the catalog")}</small></div></article>;
          const presented=contractPresentation(item,locale),summary=contractSummary(item,locale),displayOptions=contractDisplayOptions(presented,locale),outcomes=contractOutcomeSections(presented,locale);
          const benefit=presented.seemingBenefits?.[seeming as keyof typeof presented.seemingBenefits];
          return <details className="contract-power-card" key={`${item.id}-${index}`}>
            <summary className="contract-power-summary"><strong>{contractName(item)}</strong><Badge variant={item.goblin?"default":"outline"}>{item.goblin?"Goblin":index<4?tr("Comum","Common"):tr("Real","Royal")}</Badge><small>{systemTerm(item.regalia,locale)} · {item.source} · p. {item.page||"—"}</small></summary>
            <div className="contract-power-details"><dl>
              {summary&&<div><dt>{tr("Resumo","Summary")}</dt><dd>{summary}</dd></div>}
              {contractHasInvocationRoll(presented)===true&&<div><dt>{tr("Parada de dados","Dice Pool")}</dt><dd>{presented.dicePool??tr("Não informada","Not listed")}</dd></div>}
              <div><dt>{tr("Custo","Cost")}</dt><dd>{presented.cost??tr("Conforme descrição","As described")}</dd></div>
              <div><dt>{tr("Ação / Duração","Action / Duration")}</dt><dd>{presented.action??tr("Instantânea","Instant")} · {presented.duration??tr("Cena","Scene")}</dd></div>
              {outcomes.map(section=><div key={section.label}><dt>{section.label}</dt><dd>{section.text}</dd></div>)}
              {displayOptions.length>0&&<div className="contract-options"><dt>{tr("Opções","Options")}</dt><dd><ul>{displayOptions.map(option=><li key={option}>{option}</li>)}</ul></dd></div>}
              {presented.detailTables?.map(table=><div className="contract-detail-table" key={table.title}><dt>{table.title}</dt><dd><table><thead><tr>{table.columns.map(column=><th key={column}>{column}</th>)}</tr></thead><tbody>{table.rows.map(row=><tr key={row.join("::")}>{row.map((cell,cellIndex)=><td key={cellIndex}>{cell}</td>)}</tr>)}</tbody></table></dd></div>)}
              <div><dt>{tr("Brecha","Loophole")}</dt><dd>{presented.loophole}</dd></div>
              {item.goblinDebt&&<div className="goblin-debt-row"><dt>{tr("Débito Goblin","Goblin Debt")}</dt><dd>{item.goblinDebt}</dd></div>}
              {benefit&&<div><dt>{tr("Benefício de","Benefit for")} {seemingDisplayName(seeming,locale)}</dt><dd>{benefit}</dd></div>}
            </dl><Button type="button" variant="outline" size="sm" onClick={()=>removeContract(index)}><Trash2/>{tr("Remover Contrato","Remove Contract")}</Button></div>
          </details>;
        })}
      </div>
      <Dialog>
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

function OrderSelector(props: OrderSelectorProps) {
  const { locale, tr } = useLanguage();
  const saved = props.orderCatalog ?? [];
  const draft: CustomOrderDefinition = props.customOrder ?? {
    name: "",
    description: "",
    roteSkills: ["", "", ""],
    initiation: {},
  };
  const select = (name: string) => {
    const custom = name === "Nameless"
      ? (props.order === "Nameless" ? props.customOrder : null) ?? { name: "", description: "", roteSkills: ["", "", ""], initiation: {} }
      : saved.find((item) => item.name === name) ?? null;
    props.setOrder(name);
    props.setCustomOrder(custom);
  };
  return (
    <div className={`kith-field ${props.invalid ? "missing-field" : ""}`}>
      <span>{tr("Ordem", "Order")}</span>
      <div className="kith-current order-current">
        <strong>
          {(props.order === "Orderless" ? tr("Sem Ordem", "Orderless") : props.order === "Nameless" && props.customOrder?.name ? props.customOrder.name : props.order === "Nameless" ? "Nameless" : MTA_ORDER_LABELS[props.order] ?? props.order) ||
            tr("Nenhuma selecionada", "None selected")}
        </strong>
        <p>{(props.order ? MTA_ORDER_DESCRIPTIONS[props.order]?.[locale === "pt-BR" ? 0 : 1] : "") || props.customOrder?.description || tr("Escolha uma Ordem para consultar sua descrição.", "Choose an Order to review its description.")}</p>
        {(props.customOrder?.roteSkills.length || hasPublishedMageOrder(props.order)) ? <small>
          <strong>{tr("Perícias de Rota", "Rote Skills")}:</strong>{" "}
          {(props.customOrder?.roteSkills ?? MTA_ORDERS[props.order as keyof typeof MTA_ORDERS] ?? []).map((skill) => builderText(locale, skill)).join(", ")}
        </small> : null}
      </div>
      <Dialog>
        <DialogTrigger asChild>
          <Button type="button" variant="outline">
            <Search /> {tr("Selecionar Ordem", "Select Order")}
          </Button>
        </DialogTrigger>
        <DialogContent className="merit-dialog">
          <DialogHeader>
            <DialogTitle>{tr("Selecionar Ordem", "Select Order")}</DialogTitle>
            <DialogDescription>
              {tr("Escolha uma das Ordens disponíveis. Nameless permite definir uma Ordem sem nome entre as seis principais.", "Choose an available Order. Nameless lets you define an Order outside the six main Orders.")}
            </DialogDescription>
          </DialogHeader>
          <Choice
            label={tr("Ordem", "Order")}
            value={props.order || "__none"}
            setValue={(value: string) =>
              select(value === "__none" ? "Orderless" : value)
            }
            options={[
              "__none",
              "Orderless",
              ...Object.keys(MTA_ORDERS),
              ...saved.map((item) => item.name),
            ]}
            optionLabels={{
              __none: tr("Selecione uma Ordem", "Select an Order"),
              ...MTA_ORDER_LABELS,
              Nameless: "Nameless",
              Orderless: tr("Sem Ordem", "Orderless"),
            }}
          />
          {props.order === "Nameless" && (
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
              {draft.roteSkills.map((value, index) => {
                const selectedElsewhere = new Set(
                  draft.roteSkills.filter((_, skillIndex) => skillIndex !== index),
                );
                const placeholder = `__skill_${index}`;
                return (
                  <label className="choice-label" key={index}>
                    {`${tr("Perícia de Rota", "Rote Skill")} ${index + 1}`}
                    <Select
                      value={value || placeholder}
                      onValueChange={(skill) => {
                        const skills = [...draft.roteSkills];
                        skills[index] = skill === placeholder ? "" : skill;
                        props.setCustomOrder({ ...draft, roteSkills: skills });
                      }}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue>
                          {value ? builderText(locale, value) : tr("Selecione uma Perícia", "Select a Skill")}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={placeholder}>{tr("Selecione uma Perícia", "Select a Skill")}</SelectItem>
                        {Object.entries(SKILLS).map(([group, skills], groupIndex) => (
                          <SelectGroup key={group}>
                            {groupIndex > 0 && <SelectSeparator />}
                            <SelectLabel>{builderText(locale, group)}</SelectLabel>
                            {skills.filter((skill) => !selectedElsewhere.has(skill)).map((skill) => (
                              <SelectItem key={skill} value={skill}>{builderText(locale, skill)}</SelectItem>
                            ))}
                          </SelectGroup>
                        ))}
                      </SelectContent>
                    </Select>
                  </label>
                );
              })}
              <p className="nameless-order-rule">{tr("Uma Nameless Order concede High Speech e Mystery Cult Initiation • no lugar de Awakened Status •. Configure os benefícios na seção de Méritos, conforme Mage: The Awakening, p. 106.", "A Nameless Order grants High Speech and Mystery Cult Initiation • instead of Awakened Status •. Configure its benefits in the Merits section, following Mage: The Awakening, p. 106.")}</p>
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

function MtaStep(props: MtaStepProps) {
  const { locale, tr } = useLanguage();
  const pathData = MTA_PATHS[props.path as keyof typeof MTA_PATHS];
  const neededPraxes = props.gnosis;
  const hasCreationOrderBenefits = hasPublishedMageOrder(props.order) || props.order === "Nameless";
  return (
    <div className="builder-section">
      <span className="kicker">{tr("PASSO 3 · MAGO", "STEP 3 · MAGE")}</span>
      <h2>{tr("Modelo dos Despertos", "Awakened Template")}</h2>
      <p>{tr("As escolhas e limites abaixo vêm de Mage the Awakening.", "The choices and limits below come from Mage the Awakening.")}</p>
      <div className="mta-template-grid">
        <div className="mta-template-column">
          <Choice
            label={tr("Caminho", "Path")}
            value={props.path}
            setValue={props.setPath}
            options={Object.keys(MTA_PATHS)}
            invalid={props.missing("path")}
          />
          <p className="path-arcana-summary">
            <span>{tr("Regentes", "Ruling")}:</span>{" "}
            <strong>{pathData?.ruling.map((arcanum) => builderText(locale, arcanum)).join(tr(" e ", " and ")) ?? tr("selecione o Caminho", "select a Path")}</strong>
            {" · "}<span>{tr("Inferior", "Inferior")}:</span>{" "}
            <strong>{pathData ? builderText(locale, pathData.inferior) : "—"}</strong>
          </p>
          <div className="ctl-favored-inline">
            <Choice
              label={tr("Atributo de Resistência (+1)", "Resistance Attribute (+1)")}
              value={props.resistanceBonus}
              setValue={props.setResistanceBonus}
              options={["Perseverança", "Vigor", "Compostura"]}
              invalid={props.missing("resistanceBonus")}
            />
          </div>
        </div>
        <div className="mta-template-column">
          <OrderSelector {...props} invalid={props.missing("order")} />
        </div>
        <div className="mta-template-column mta-virtue-vice">
          <label className={props.missing("virtue") ? "missing-field" : ""}>
            {tr("Virtude", "Virtue")}
            <Input value={props.virtue} onChange={(e) => props.setVirtue(e.target.value)} />
          </label>
          <label className={props.missing("vice") ? "missing-field" : ""}>
            {tr("Vício", "Vice")}
            <Input value={props.vice} onChange={(e) => props.setVice(e.target.value)} />
          </label>
        </div>
      </div>
      {props.powerAdvancement > 0 && <p className="rule-callout">
        <ShieldCheck /> {tr("Gnose atual", "Current Gnosis")}: <strong>{Math.min(10, props.gnosis + props.powerAdvancement)}</strong> ({props.powerAdvancement} {tr("por experiência preservados", "preserved from Experiences")})
      </p>}
      {props.order && (
        <p className="rule-callout">
          <ShieldCheck />{" "}
          {!hasPublishedMageOrder(props.order)
            ? props.order === "Orderless"
              ? tr("Sem Ordem: não recebe Alta Fala, ponto gratuito de Ocultismo ou Rotas iniciais.", "Orderless: receives no High Speech, free Occult dot, or starting Rotes.")
              : tr("A Nameless Order recebe Alta Fala e Mystery Cult Initiation • no lugar de Status de Ordem •.", "A Nameless Order receives High Speech and Mystery Cult Initiation • instead of Order Status •.")
            : tr("Membro de Ordem: recebe Alta Fala, +1 em Ocultismo (máximo 5) e três Rotas iniciais.", "Order member: receives High Speech, free Occult dot, and three starting Rotes.")}
        </p>
      )}
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
      {hasCreationOrderBenefits && (
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
          context={props.meritContext}
          spent={props.meritSpent}
          budget={props.meritBudget}
          gnosis={props.gnosis}
          setGnosis={props.setGnosis}
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
  const [arcanaFilter, setArcanaFilter] = useState("__all");
  const [levelFilter, setLevelFilter] = useState("__all");
  const [sourceFilter, setSourceFilter] = useState("__all");
  const [practiceFilter, setPracticeFilter] = useState("__all");
  const [catalogOpen, setCatalogOpen] = useState(false);
  const normalized = search.toLocaleLowerCase("pt-BR");
  const selectedIds = values.filter(Boolean).map((item) => item!.id);
  const filtered = alphabetical(catalog, spellName,locale).filter(
    (spell) =>
      meetsArcanaRequirements(spell.requirements, arcana) &&
      (arcanaFilter === "__all" || Object.hasOwn(spell.requirements, arcanaFilter)) &&
      (levelFilter === "__all" || Object.values(spell.requirements).includes(Number(levelFilter))) &&
      (sourceFilter === "__all" || spell.sourceId === sourceFilter) &&
      (practiceFilter === "__all" || spell.practice === practiceFilter) &&
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
  const arcanaSource = (spell: SpellDefinition) =>
    `${Object.entries(spell.requirements).map(([name,dots])=>`${arcanaLabels[name]??name} ${"•".repeat(dots)}`).join(" + ")} · ${spell.source} · p. ${spell.page || "—"}`;
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
          <small>{arcanaSource(spell)}</small>
          <p className="rule-detail"><strong>{tr("Prática","Practice")}:</strong> {spell.practice} | <strong>{tr("Fator Primário","Primary Factor")}:</strong> {spell.primaryFactor}</p>
          {spell.withstand && <p className="rule-detail"><strong>{tr("Resistência", "Withstand")}:</strong> {spell.withstand}</p>}
          {rote && spell.roteSkills.length > 0 && <p className="rule-detail"><strong>{tr("Perícia de Rota", "Rote Skill")}:</strong> {spell.roteSkills.join(", ")}</p>}
          <p className="rule-detail">
            <strong>{tr("Resumo", "Summary")}:</strong> {spellSummary(spell)}
          </p>
          {spellReach(spell) && <p className="rule-detail"><strong>Reach:</strong> {spellReach(spell)}</p>}
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
            {tr("Escolha no catálogo de feitiços. Expanda uma escolha para consultar os detalhes.", "Choose from the spell catalog. Expand a choice to inspect its details.")}
          </p>
        </div>
        <div className="merit-heading-actions">
          <Badge variant="outline">{values.slice(0, count).filter(Boolean).length}/{count}</Badge>
          <Button type="button" variant="outline" size="sm" className="builder-add-action" onClick={() => setCatalogOpen(true)}>
            <Plus /> {tr("Selecionar", "Select")} {rote ? tr("Rotas", "Rotes") : tr("Práxis", "Praxes")}
          </Button>
        </div>
      </div>
      <div className="contract-power-list creation-contract-list creation-spell-list">
        {Array.from({ length: count }, (_, index) => {
          const item = values[index];
          if (!item) return <article className="creation-contract-empty" key={index}><Badge variant={rote ? "secondary" : "outline"}>{rote ? tr("Rota", "Rote") : tr("Práxis", "Praxis")}</Badge><div><strong>{tr("Vaga disponível", "Available slot")}</strong><small>{tr("Escolha no catálogo", "Choose from the catalog")}</small></div></article>;
          return (
            <details className="contract-power-card" key={`${item.id}-${index}`}>
              <summary className="contract-power-summary"><strong>{spellName(item)}</strong><span className="spell-card-actions"><Badge variant={rote ? "secondary" : "outline"}>{rote ? tr("Rota", "Rote") : tr("Práxis", "Praxis")}</Badge><Button type="button" variant="ghost" size="sm" onClick={(event) => { event.preventDefault(); event.stopPropagation(); remove(index); }}><Trash2 /> {tr("Remover", "Remove")}</Button></span><small>{arcanaSource(item)}</small><span className="spell-card-rule-line"><strong>{tr("Prática","Practice")}:</strong> {item.practice} | <strong>{tr("Fator Primário","Primary Factor")}:</strong> {item.primaryFactor}</span>{item.withstand && <span className="spell-card-rule-line"><strong>{tr("Resistência", "Withstand")}:</strong> {item.withstand}</span>}{rote && item.roteSkills.length > 0 && <span className="collapsed-rote-skill" onClick={(event)=>event.stopPropagation()} onKeyDown={(event)=>event.stopPropagation()}><Choice label={tr("Perícia de Rota", "Rote Skill")} value={item.roteSkill ?? item.roteSkills[0]} setValue={(value) => { const next = [...values]; next[index] = { ...item, roteSkill: value }; setValues(next); }} options={item.roteSkills}/></span>}</summary>
              <div className="contract-power-details">
                <dl>
                  <div><dt>{tr("Resumo", "Summary")}</dt><dd>{spellSummary(item)}</dd></div>
                  {spellReach(item) && <div><dt>Reach</dt><dd>{spellReach(item)}</dd></div>}
                </dl>
              </div>
            </details>
          );
        })}
      </div>
      <Dialog open={catalogOpen} onOpenChange={setCatalogOpen}>
        <DialogContent className="merit-dialog">
          <DialogHeader>
            <DialogTitle>{tr("Catálogo de feitiços", "Spell catalog")}</DialogTitle>
            <DialogDescription>
              {tr("Feitiços organizados por Arcano e nível de maestria.", "Spells grouped by Arcanum and mastery level.")}
            </DialogDescription>
          </DialogHeader>
          <div className="catalog-filters spell-catalog-filters">
            <label className="merit-search"><Search /><Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={tr("Buscar feitiço, Arcano ou fonte…", "Search spell, Arcanum, or source…")}/></label>
            <Choice value={arcanaFilter} setValue={setArcanaFilter} options={["__all",...Object.keys(arcanaLabels)]} optionLabels={{__all:tr("Todos os Arcanos","All Arcana"),...arcanaLabels}} />
            <Choice value={levelFilter} setValue={setLevelFilter} options={["__all","1","2","3","4","5"]} optionLabels={{__all:tr("Todos os níveis","All levels"),...Object.fromEntries([1,2,3,4,5].map(level=>[String(level),`${tr("Nível","Level")} ${level}`]))}} />
            <Choice value={sourceFilter} setValue={setSourceFilter} options={["__all",...new Set(catalog.map(spell=>spell.sourceId))]} optionLabels={{__all:tr("Todas as fontes","All sources"),...Object.fromEntries(catalog.map(spell=>[spell.sourceId,spell.source]))}} />
            <Choice value={practiceFilter} setValue={setPracticeFilter} options={["__all",...new Set(catalog.map(spell=>spell.practice))]} optionLabels={{__all:tr("Todas as Práticas","All Practices")}} />
          </div>
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

function PriorityRow({ labels, values, setValues, budgets, invalid }: {labels:readonly string[];values:string[];setValues:Setter<string[]>;budgets:number[];invalid:boolean}) {
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
}: {groups:Record<string,readonly string[]>;values:Record<string,number>;setValues:Setter<Record<string,number>>;base:number;max:number;priority:string[];budgets:number[];missing:MissingCheck}) {
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
function DotRow({ name, value, setValue, min, max, tag, canIncrease = true }: {name:string;value:number;setValue:Setter<number>;min:number;max:number;tag?:string;canIncrease?:boolean}) {
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
  const labels = Object.fromEntries(Object.entries(optionLabels).map(([key, text]) => [key, builderText(locale, text)]));
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
function Aspirations({ values, setValues, missing }: {values:string[];setValues:Setter<string[]>;missing:MissingCheck}) {
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
  context,
  spent,
  budget,
  currentCourt,
  wyrd,
  setWyrd,
  gnosis,
  setGnosis,
}: {
  merits: MeritSelection[];
  setMerits: (value: MeritSelection[]) => void;
  catalog: MeritDefinition[];
  context: MeritPrerequisiteContext;
  spent: number;
  budget: number;
  currentCourt?: string;
  wyrd?: number;
  setWyrd?: (value: number) => void;
  gnosis?: number;
  setGnosis?: (value: number) => void;
}) {
  const { locale, tr } = useLanguage();
  const meritName = (definition: MeritDefinition) => locale === "pt-BR" ? definition.translatedName : definition.name;
  const categoryName = (category: string) => locale === "pt-BR" ? meritCategoryLabel(category) : category;
  const totalBudget = budget;
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [catalogOpen, setCatalogOpen] = useState(false);
  const categories = [...new Set(catalog.map((merit) => merit.category))].sort(
    (a, b) => compareOptionLabels(categoryName(a), categoryName(b),locale),
  );
  const normalizedSearch = search.trim().toLocaleLowerCase("pt-BR");
  function addMerit(definition: MeritDefinition) {
    if(!meritPrerequisitesMet(definition,context)||(!isRepeatableDefinition(definition)&&context.merits?.some(item=>item.name===definition.name)))return;
    if (
      !isRepeatableDefinition(definition) &&
      merits.some((merit) => merit.name === definition.name)
    )
      return;
    setMerits([
      ...merits,
      {
        instanceId: crypto.randomUUID(),
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
        <div className="merit-heading-actions"><Badge variant={spent > totalBudget ? "destructive" : "outline"}>
          {spent}/{totalBudget} {tr("pontos de Mérito usados na criação", "creation Merit dots spent")}
        </Badge>{wyrd !== undefined && <Badge variant="outline">{tr("Fado inicial", "Wyrd at creation")}: {wyrd}</Badge>}{gnosis !== undefined && <Badge variant="outline">{tr("Gnose inicial", "Gnosis at creation")}: {gnosis}</Badge>}<Button type="button" variant="outline" size="sm" className="builder-add-action" onClick={() => setCatalogOpen(true)}>{tr("Adicionar Mérito", "Add Merit")}</Button>
        {wyrd !== undefined && setWyrd && <>
          <Button type="button" variant="outline" size="sm" className="builder-add-action" disabled={wyrd >= 3 || spent + 5 > totalBudget} onClick={() => setWyrd(wyrd + 1)}>
            {tr("Adicionar Fado (5 pontos)", "Add Wyrd (5 dots)")}
          </Button>
          {wyrd > 1 && <Button type="button" variant="ghost" size="sm" className="builder-add-action" onClick={() => setWyrd(wyrd - 1)}>
            {tr("Remover Fado", "Remove Wyrd")}
          </Button>}
        </>}{gnosis !== undefined && setGnosis && <>
          <Button type="button" variant="outline" size="sm" className="builder-add-action" disabled={gnosis >= 3 || spent + 5 > totalBudget} onClick={() => setGnosis(gnosis + 1)}>
            {tr("Adicionar Gnose (5 pontos de Mérito)", "Add Gnosis (5 Merit dots)")}
          </Button>
          {gnosis > 1 && <Button type="button" variant="ghost" size="sm" className="builder-add-action" onClick={() => setGnosis(gnosis - 1)}>
            {tr("Remover Gnose", "Remove Gnosis")}
          </Button>}
        </>}</div>
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
              title={definition ? meritTooltip(definition,locale) : undefined}
            >
              <div className="merit-row-main">
                <div>
                  <strong>
                    {definition ? meritName(definition) : selection.name}
                    {meritConfigurationTitle(selection.configuration, locale)
                      ? `: ${meritConfigurationTitle(selection.configuration, locale)}`
                      : ""}
                  </strong>
                  <small>
                    {definition
                      ? `${categoryName(definition.category)} · ${definition.source} · p. ${definition.page || "—"}`
                      : selection.source}
                    {selection.grantedBy ? <> · {tr("primeiro ponto gratuito", "first dot free")}</> : null}
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
                  options={(definition ? meritRatingsFor(definition,Math.max(selection.dots,totalBudget-spent+selection.dots)) : [1]).map(
                    String,
                  )}
                />
                {!selection.grantedBy && ((["Fae Mount","Fae Pet","Familiar","Entitlement"].includes(selection.name))?<ConfirmAction trigger={<Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label={`${tr("Remover", "Remove")} ${definition ? meritName(definition) : selection.name}`}
                >
                  <Trash2 />
                </Button>} title={selection.name==="Entitlement"?tr("Remover Entitlement?","Remove Entitlement?"):tr(`Remover ${definition?meritName(definition):selection.name}?`,`Remove ${definition?meritName(definition):selection.name}?`)} description={selection.name==="Entitlement"?tr("O Título e todos os benefícios concedidos serão removidos.","The Entitlement and all granted benefits will be removed."):tr("O Mérito e seu Companion vinculado serão removidos.","The Merit and its linked Companion will be removed.")} action={tr("Remover","Remove")} onConfirm={()=>setMerits(merits.filter((_,itemIndex)=>itemIndex!==index))}/>:<Button type="button" variant="ghost" size="icon" aria-label={`${tr("Remover","Remove")} ${definition?meritName(definition):selection.name}`} onClick={()=>setMerits(merits.filter((_,itemIndex)=>itemIndex!==index))}><Trash2/></Button>)}
              </div>
              {selection.name !== "Familiar" && <MeritConfigurationEditor
                merit={selection}
                ownedMerits={context.merits}
                inline={isInlineMeritConfiguration(selection.name)}
                currentCourt={currentCourt}
                onChange={(configuration) => {
                  const next = [...merits];
                  next[index] = { ...selection, configuration };
                  setMerits(next);
                }}
              />}
            </div>
          );
        })}
      </div>
      <Dialog open={catalogOpen} onOpenChange={setCatalogOpen}>
        <DialogContent className="merit-dialog">
          <DialogHeader>
            <DialogTitle>{tr("Selecionar méritos", "Select Merits")}</DialogTitle>
            <DialogDescription>
              {tr("Procure por nome ou navegue pelas categorias. Méritos repetíveis permitem criar novas instâncias; altere os pontos na instância existente para aumentá-la.", "Search by name or browse categories. Repeatable Merits allow new instances; change the dots on an existing instance to increase it.")}
            </DialogDescription>
          </DialogHeader>
          <div className="catalog-filters"><label className="merit-search">
            <Search aria-hidden="true" />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={tr("Buscar mérito por nome, pré-requisito ou fonte…", "Search Merit by name, prerequisite, or source…")}
            />
          </label><Choice value={category} setValue={setCategory} options={["all",...categories]} optionLabels={{all:tr("Todas as categorias","All categories"),...Object.fromEntries(categories.map((item)=>[item,categoryName(item)]))}} /></div>
          <div className="merit-catalog">
            {categories.map((catalogCategory) => {
              const items = alphabetical(catalog, meritName,locale).filter(
                (item) =>
                  item.category === catalogCategory && meritPrerequisitesMet(item,context) &&
                  (isRepeatableDefinition(item)||!context.merits?.some(owned=>owned.name===item.name)||merits.some(owned=>owned.name===item.name)) &&
                  (category === "all" || item.category === category) &&
                  (!normalizedSearch ||
                    `${item.translatedName} ${item.name} ${item.source} ${item.prerequisites ?? ""}`
                      .toLocaleLowerCase("pt-BR")
                      .includes(normalizedSearch)),
              );
              if (!items.length) return null;
              return (
                <section className="merit-category" key={catalogCategory}>
                  <h3>
                    {categoryName(catalogCategory)}{" "}
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
                              · {UNBOUNDED_MERITS.has(definition.name)?"1+":formatRatings(meritRatingsFor(definition))}
                            </small>
                            {definition.prerequisites && (
                              <p className="rule-detail">
                                <strong>{tr("Pré-requisitos", "Prerequisites")}:</strong>{" "}
                                {definition.prerequisites}
                              </p>
                            )}
                            <p>{definition.description}</p>
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
  currentCourt,
  ownedMerits = [],
}: {
  merit: MeritSelection;
  onChange: (value: MeritConfiguration) => void;
  compact?: boolean;
  inline?: boolean;
  currentCourt?: string;
  ownedMerits?: NonNullable<MeritPrerequisiteContext["merits"]>;
}) {
  const { locale, tr } = useLanguage();
  const homebrews = useHomebrews();
  const definition = findMeritConfiguration(merit.name);
  if (!definition) return null;
  const configuration = normalizeMeritConfiguration(merit.configuration);
  const visible = definition.fields.filter(
    (field) => (field.minDots ?? 0) <= merit.dots,
  );
  if (!visible.length && !isStructuredMerit(merit.name)) return null;
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
  const fields = (
    <div>
      {visible.map((field) => {
        const value = configuration[field.key];
        if (field.kind === "merit") {
          const choices=ownedMerits.filter(item=>item.instanceId&&field.meritNames?.includes(item.name)&&item.dots>=(merit.name==="Infamous Mentor"?merit.dots:1));
          return <label key={field.key}>{field.label}<select value={String(value??"")} onChange={event=>set(field.key,event.target.value)}><option value="">{tr("Selecione uma instância","Select an instance")}</option>{choices.map(item=><option key={item.instanceId} value={item.instanceId}>{item.name}: {meritConfigurationTitle(item.configuration,locale)||item.instanceId} ({item.dots})</option>)}</select></label>;
        }
        if (field.kind === "court") {
          return (
            <CourtGoodwillPicker
              key={field.key}
              value={Array.isArray(value) ? "" : String(value ?? "")}
              currentCourt={currentCourt}
              homebrews={homebrews}
              onSelect={(court) => set(field.key, court)}
            />
          );
        }
        if (field.kind === "list") {
          const rowCount=field.fixedRows??merit.dots*(field.rowsPerDot??1);
          const fieldLabel=merit.name==="Contacts"?tr("Grupos, organizações ou nome do contato","Groups, organizations or contact name"):merit.name==="Multilingual"?tr("Idiomas adicionais","Additional languages"):field.label;
          const values=Array.isArray(value)?value:[String(value??"")];
          if(merit.name==="Multilingual") return <fieldset key={field.key}><legend>{fieldLabel}</legend><div className="multilingual-config-list">{Array.from({length:merit.dots},(_,row)=><div className="multilingual-config-row" key={row}>{[0,1].map((column)=>{const index=row*2+column;return <Input key={index} value={values[index]??""} placeholder={`${tr("Idioma","Language")} ${index+1}`} onChange={(event)=>{const next=Array.from({length:merit.dots*2},(_,item)=>values[item]??"");next[index]=event.target.value;set(field.key,next);}}/>;})}</div>)}</div></fieldset>;
          if(merit.name==="Contacts") return <fieldset className="contacts-config-field" key={field.key}><legend>{fieldLabel}</legend><div className="multilingual-config-list">{Array.from({length:Math.ceil(merit.dots/2)},(_,row)=><div className="multilingual-config-row" key={row}>{[0,1].flatMap((column)=>{const index=row*2+column;if(index>=merit.dots)return [];return [<Input key={index} value={values[index]??""} placeholder={`${tr("Contato","Contact")} ${index+1}`} onChange={(event)=>{const next=Array.from({length:rowCount},(_,item)=>values[item]??"");next[index]=event.target.value;set(field.key,next);}}/>];})}</div>)}</div></fieldset>;
          return <fieldset className={merit.name==="Contacts"?"contacts-config-field":undefined} key={field.key}><legend>{fieldLabel}</legend><div className="merit-config-list">{Array.from({length:rowCount},(_,index)=><Input key={index} value={values[index]??""} placeholder={`${field.placeholder??fieldLabel} ${index+1}`} onChange={(event)=>{const next=Array.from({length:rowCount},(_,item)=>values[item]??"");next[index]=event.target.value;set(field.key,next);}}/>)}</div></fieldset>;
        }
        if (field.kind === "select") {
          const selected=String(value??"");
          return <label key={field.key}>{field.label}<Select value={selected} onValueChange={(next)=>set(field.key,next)}><SelectTrigger><SelectValue placeholder={field.placeholder??tr("Selecione uma opção","Select an option")}/></SelectTrigger><SelectContent>{(field.options??[]).map((option)=><SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>)}</SelectContent></Select></label>;
        }
        if (field.kind === "textarea") return <label key={field.key}>{field.label}<textarea value={Array.isArray(value)?value.join("\n"):String(value??"")} placeholder={field.placeholder} onChange={(event)=>set(field.key,event.target.value)}/></label>;
        return <label key={field.key}>{field.label}<Input value={Array.isArray(value)?value.join(", "):String(value??"")} placeholder={field.placeholder} onChange={(event)=>set(field.key,event.target.value)}/></label>;
      })}
    </div>
  );
  if (inline) return <div className={`merit-configuration inline${compact ? " compact" : ""}`}>{fields}</div>;
  return (
    <details className={`merit-configuration${compact ? " compact" : ""}`}>
      <summary>{tr("Configurar escolhas", "Configure choices")}</summary>
      {fields}
    </details>
  );
}

function CourtGoodwillPicker({ value, currentCourt, homebrews, onSelect }: {
  value: string;
  currentCourt?: string;
  homebrews: ReturnType<typeof useHomebrews>;
  onSelect: (value: string) => void;
}) {
  const { locale, tr } = useLanguage();
  const [search, setSearch] = useState("");
  const [source, setSource] = useState("all");
  const ownCustomCourt = homebrews.courts.find((court) => court.id === currentCourt || court.name === currentCourt);
  const ownCourtId = ownCustomCourt?.id ?? courtCanonicalId(currentCourt ?? "");
  useEffect(() => {
    if (ownCourtId && courtCanonicalId(value) === ownCourtId) onSelect("");
  }, [ownCourtId, value, onSelect]);
  const options = alphabetical([
    ...CTL_COURT_DEFINITIONS
      .filter((court) => (court.sourceId !== "h-courts" || isHomebrewActive(homebrews, "h-courts")) && court.id !== ownCourtId)
      .map((court) => ({
        value: court.id,
        label: courtDisplayName(court.id, locale),
        source: court.source,
        detail: `${locale === "pt-BR" ? court.emotionPt : court.emotion} · ${court.source} · p. ${courtPageCitation(court)}`,
      })),
    ...homebrews.courts
      .filter((court) => isHomebrewActive(homebrews, court.id) && courtCanonicalId(court.id) !== ownCourtId)
      .map((court) => ({ value: court.id, label: court.name, source: tr("Criação do jogador", "Player-created"), detail: court.emotion })),
  ], (court) => court.label, locale);
  const sources = alphabetical([...new Set(options.map((court) => court.source))], (item) => item, locale);
  const normalized = search.trim().toLocaleLowerCase(locale);
  const filtered = options.filter((court) => (source === "all" || court.source === source) && (!normalized || `${court.label} ${court.detail} ${court.source}`.toLocaleLowerCase(locale).includes(normalized)));
  const selected = options.find((court) => courtCanonicalId(court.value) === courtCanonicalId(value));
  return (
    <div className="merit-court-picker">
      <span>{tr("Corte beneficiada", "Benefited Court")}</span>
      {selected && <small>{selected.label} · {selected.detail}</small>}
      <Dialog>
        <DialogTrigger asChild><Button type="button" variant="outline" size="sm"><Search /> {selected ? tr("Alterar Corte", "Change Court") : tr("Selecionar Corte", "Select Court")}</Button></DialogTrigger>
        <DialogContent className="merit-dialog">
          <DialogHeader><DialogTitle>{tr("Selecionar Corte para Court Goodwill", "Select Court for Court Goodwill")}</DialogTitle><DialogDescription>{tr("Sua própria Corte não pode ser escolhida para este Mérito.", "Your own Court cannot be selected for this Merit.")}</DialogDescription></DialogHeader>
          <div className="court-catalog-filters">
            <label className="merit-search"><Search aria-hidden="true" /><Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder={tr("Buscar Corte…", "Search Court…")} /></label>
            <Choice label={tr("Fonte", "Source")} value={source} setValue={setSource} options={["all", ...sources]} optionLabels={{ all: tr("Todas", "All") }} />
          </div>
          <div className="court-catalog">
            {filtered.map((court) => <DialogClose asChild key={court.value}><button type="button" className={courtCanonicalId(value) === courtCanonicalId(court.value) ? "court-option selected" : "court-option"} onClick={() => onSelect(court.value)}><strong>{court.label}</strong><small>{court.detail} · {court.source}</small></button></DialogClose>)}
            {!filtered.length && <p className="empty-state">{tr("Nenhuma Corte encontrada.", "No Courts found.")}</p>}
          </div>
        </DialogContent>
      </Dialog>
    </div>
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
  if (merit.name === "Token")
    return <TokenMeritEditor merit={merit} configuration={configuration} onChange={onChange} compact={compact} />;
  if (merit.name === "Hedgespun Item")
    return <HedgespunItemEditor merit={merit} configuration={configuration} onChange={onChange} compact={compact} />;
  if (merit.name === "Entitlement")
    return <EntitlementMeritEditor configuration={configuration} onChange={onChange} compact={compact} />;
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
                  options={CONFIG_SKILLS.filter(
                    (skill) => skill === skills[index] || !skills.includes(skill),
                  )}
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
  if (merit.name === "Shared Bastion")
    return <SharedBastionEditor merit={merit} configuration={configuration} onChange={onChange} compact={compact} />;
  if (merit.name === "Stable Trod")
    return <StableTrodEditor configuration={configuration} onChange={onChange} compact={compact} />;
  if (merit.name === "Workshop")
    return <WorkshopEditor merit={merit} configuration={configuration} onChange={onChange} compact={compact} />;
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

function EntitlementMeritEditor({configuration,onChange,compact}:{configuration:MeritConfiguration;onChange:(value:MeritConfiguration)=>void;compact:boolean}){
  const {tr}=useLanguage();const homebrews=useHomebrews();const selectedDefinition=findEntitlement(configuration.definitionId);
  const availableEntitlements=ENTITLEMENTS.filter((item)=>!item.sourceId||isHomebrewActive(homebrews,item.sourceId));
  const definition=selectedDefinition&&availableEntitlements.some((item)=>item.id===selectedDefinition.id)?selectedDefinition:undefined;
  return <details className={`merit-configuration structured${compact?" compact":""}`} open={!compact}>
    <summary>{tr("Configurar Título Feérico","Configure Entitlement")}</summary><div>
      <label>{tr("Título","Title")}<Select value={definition?.id} onValueChange={(definitionId)=>onChange({...configuration,definitionId,roleId:""})}><SelectTrigger><SelectValue placeholder={tr("Selecione um Título","Select an Entitlement")}/></SelectTrigger><SelectContent>{availableEntitlements.map((item)=><SelectItem key={item.id} value={item.id}>{item.name} · {item.meritName}</SelectItem>)}</SelectContent></Select></label>
      {definition?.roles&&<label>{tr("Papel","Role")}<Select value={String(configuration.roleId??"")||undefined} onValueChange={(roleId)=>onChange({...configuration,roleId})}><SelectTrigger><SelectValue placeholder={tr("Selecione um papel","Select a role")}/></SelectTrigger><SelectContent>{definition.roles.map((role)=><SelectItem key={role.id} value={role.id}>{role.name} · {role.prerequisites}</SelectItem>)}</SelectContent></Select></label>}
      {definition&&<p className="structured-rule"><strong>{tr("Pré-requisitos","Prerequisites")}:</strong> {definition.prerequisites}<br/><strong>{tr("Fonte","Source")}:</strong> {definition.source} · p. {definition.page}</p>}
    </div>
  </details>;
}

const EMPTY_TOKEN:TokenConfigurationItem={id:"",kind:"token",name:"",rating:1,cost:"1 Glamour",effect:"",description:"",crux:"",catch:"",drawback:""};
function TokenMeritEditor({merit,configuration,onChange,compact}:{merit:MeritSelection;configuration:MeritConfiguration;onChange:(value:MeritConfiguration)=>void;compact:boolean}){
  const {tr}=useLanguage();
  const [newKind,setNewKind]=useState<TokenKind>("token");
  const items=decodeConfiguredRows<TokenConfigurationItem>(configuration.items).map((item)=>({...EMPTY_TOKEN,...item,kind:["token","trifle","bauble"].includes(item.kind)?item.kind:"token",rating:item.kind==="trifle"?1:Math.max(1,Math.min(5,Number(item.rating)||1))}));
  const used=items.reduce((sum,item)=>sum+item.rating,0), remaining=merit.dots-used;
  const save=(next:TokenConfigurationItem[])=>onChange({...configuration,items:encodeConfiguredRows(next)});
  const update=(index:number,patch:Partial<TokenConfigurationItem>)=>save(items.map((item,itemIndex)=>itemIndex===index?{...item,...patch}:item));
  return <details className={`merit-configuration structured${compact?" compact":""}`} open={!compact}>
    <summary>{tr("Configurar Tokens","Configure Tokens")}</summary>
    <div className="token-merit-editor">
      <div className="token-allocation-header">
        <Select value={newKind} onValueChange={(value)=>setNewKind(value as TokenKind)}><SelectTrigger className="token-kind-trigger"><SelectValue/></SelectTrigger><SelectContent><SelectItem value="token">Token</SelectItem><SelectItem value="trifle">Trifle</SelectItem><SelectItem value="bauble">Bauble</SelectItem></SelectContent></Select>
        <Button className="token-add-button" type="button" size="sm" variant="outline" disabled={remaining<1} onClick={()=>save([...items,{...EMPTY_TOKEN,id:crypto.randomUUID(),kind:newKind}])}><Plus/>{tr("Adicionar","Add")} {newKind==="trifle"?"Trifle":newKind==="bauble"?"Bauble":"Token"}</Button>
        <p className={remaining===0?"structured-rule":"structured-rule warning"}>{tr("Pontos distribuídos","Allocated dots")}: {used}/{merit.dots}{remaining>0?` · ${remaining} ${tr("restantes","remaining")}`:remaining<0?` · ${Math.abs(remaining)} ${tr("acima do limite","over the limit")}`:""}</p>
      </div>
      {items.map((item,index)=>{const maximum=Math.max(1,Math.min(5,item.rating+remaining)),kindLabel=item.kind==="trifle"?"Trifle":item.kind==="bauble"?"Bauble":"Token";return <fieldset key={index}>
        <legend>{kindLabel} {index+1} · {item.kind==="trifle"?tr("lote de 3","batch of 3"):"•".repeat(item.rating)}</legend>
        <div className="structured-choice-row token-heading-row"><label>{tr("Tipo","Type")}<Select value={item.kind} onValueChange={(kind)=>update(index,{kind:kind as TokenKind,rating:kind==="trifle"?1:item.rating})}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent><SelectItem value="token">Token</SelectItem><SelectItem value="trifle">Trifle</SelectItem><SelectItem value="bauble">Bauble</SelectItem></SelectContent></Select></label><label>{tr("Nome","Name")}<Input value={item.name} onChange={(event)=>update(index,{name:event.target.value})}/></label>{item.kind!=="trifle"&&<label>{tr("Pontos","Dots")}<Select value={String(item.rating)} onValueChange={(next)=>update(index,{rating:Number(next)})}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent>{Array.from({length:maximum},(_,dot)=><SelectItem key={dot+1} value={String(dot+1)}>{dot+1}</SelectItem>)}</SelectContent></Select></label>}<Button className="token-remove-button" type="button" size="sm" variant="ghost" onClick={()=>{if(window.confirm(tr(`Remover este ${kindLabel}?`,`Remove this ${kindLabel}?`))) save(items.filter((_,itemIndex)=>itemIndex!==index));}}><Trash2/>{tr("Remover","Remove")}</Button></div>
        {item.kind==="token"&&<><label>{tr("Custo","Cost")}<Input value={item.cost} onChange={(event)=>update(index,{cost:event.target.value})} placeholder="1 Glamour"/></label><label>{tr("Efeito","Effect")}<textarea value={item.effect} onChange={(event)=>update(index,{effect:event.target.value})}/></label><label>Catch<textarea value={item.catch} onChange={(event)=>update(index,{catch:event.target.value})}/></label><label>Drawback<textarea value={item.drawback} onChange={(event)=>update(index,{drawback:event.target.value})}/></label></>}
        {item.kind==="trifle"&&<><label>{tr("Efeito","Effect")}<textarea value={item.effect} onChange={(event)=>update(index,{effect:event.target.value})}/></label><p className="structured-rule">{tr("Um ponto do Mérito concede três Bagatelas de função idêntica. Cada uma custa 1 Glamour, não possui Catch ou Drawback e é destruída após o uso.","One Merit dot grants three identically functioning Trifles. Each costs 1 Glamour, has no Catch or Drawback, and is destroyed after use.")}</p></>}
        {item.kind==="bauble"&&<><label>{tr("Descrição","Description")}<textarea value={item.description} onChange={(event)=>update(index,{description:event.target.value})}/></label><label>Crux<textarea value={item.crux} onChange={(event)=>update(index,{crux:event.target.value})}/></label><label>Catch<textarea value={item.catch} onChange={(event)=>update(index,{catch:event.target.value})}/></label><p className="structured-rule">{tr("Sempre é um Token roubado. Ativar custa 1 Glamour, salvo quando a Catch é cumprida.","Always a stolen token. Activation costs 1 Glamour unless its Catch is fulfilled.")}</p></>}
      </fieldset>;})}
    </div>
  </details>;
}

const HEDGESPUN_BENEFITS:Array<{value:HedgespunBenefit;label:string;labelPt:string;effect:string}>=[
  {value:"extraordinary",label:"Extraordinary Equipment",labelPt:"Equipamento Extraordinário",effect:"+1 equipment bonus, armor rating, or weapon damage modifier"},
  {value:"alacrity",label:"Improved Alacrity",labelPt:"Alacridade Aprimorada",effect:"+2 Initiative and Speed"},
  {value:"durability",label:"Increased Durability",labelPt:"Durabilidade Aumentada",effect:"+1 Durability"},
];
function HedgespunItemEditor({merit,configuration,onChange,compact}:{merit:MeritSelection;configuration:MeritConfiguration;onChange:(value:MeritConfiguration)=>void;compact:boolean}){
  const {locale,tr}=useLanguage();const item=decodeHedgespunConfiguration(configuration);
  const set=(patch:Partial<typeof item>)=>onChange({...configuration,name:patch.name??item.name,description:patch.description??item.description,extraordinary_detail:patch.extraordinaryDetail??item.extraordinaryDetail,benefits:patch.benefits??item.benefits});
  const choose=(index:number,next:HedgespunBenefit)=>{const benefits=Array.from({length:merit.dots},(_,itemIndex)=>item.benefits[itemIndex]??"");benefits[index]=next;set({benefits});};
  return <details className={`merit-configuration structured${compact?" compact":""}`} open={!compact}>
    <summary>{tr("Configurar Item Fiado na Sebe","Configure Hedgespun Item")}</summary><div>
      <label>{tr("Nome do item","Item name")}<Input value={item.name} onChange={(event)=>set({name:event.target.value})}/></label>
      <label>{tr("Máscara e semblante feérico","Mask and mien")}<textarea value={item.description} onChange={(event)=>set({description:event.target.value})}/></label>
      <fieldset><legend>{tr("Benefícios","Benefits")} · {item.benefits.filter(Boolean).length}/{merit.dots}</legend>
        {Array.from({length:merit.dots},(_,index)=>{const current=item.benefits[index]??"";return <label key={index}>{tr("Ponto","Dot")} {index+1}<Select value={current||undefined} onValueChange={(next)=>choose(index,next as HedgespunBenefit)}><SelectTrigger><SelectValue placeholder={tr("Selecione um benefício","Select a benefit")}/></SelectTrigger><SelectContent>{HEDGESPUN_BENEFITS.filter((benefit)=>benefit.value===current||item.benefits.filter((entry)=>entry===benefit.value).length<3).map((benefit)=><SelectItem key={benefit.value} value={benefit.value}>{locale==="en-US"?benefit.label:benefit.labelPt} · {benefit.effect}</SelectItem>)}</SelectContent></Select></label>;})}
      </fieldset>
      {item.benefits.includes("extraordinary")&&<label>{tr("Bônus, armadura ou dano escolhido","Chosen bonus, armor, or damage")}<Input value={item.extraordinaryDetail} onChange={(event)=>set({extraordinaryDetail:event.target.value})} placeholder={tr("Ex.: +2 armadura geral","E.g.: +2 general armor")}/></label>}
      <p className="structured-rule">{tr("Sempre ativo; não possui custo de Glamour nem Catch.","Always active; has no Glamour cost or Catch.")}</p>
    </div>
  </details>;
}

const HOLLOW_OPTIONS = [
  {name:"Hob Alarm",cost:1,description:"Friendly hobgoblins prevent loss of Defense from surprise and add Hollow dots to actions during the first turn of an action scene. Requires Hob Kin and incurs 1 Goblin Debt each story."},
  {name:"Luxury Goods",cost:1,description:"Once per chapter, roll Hollow dots to produce one temporary mundane or Hedgespun item with Availability or rating no higher than successes."},
  {name:"Shadow Garden",cost:1,description:"Consumed goblin fruit reappears after one hour as a sensory-perfect but powerless shadow fruit; hunger it satisfies returns one hour later."},
  {name:"Phantom Phone Booth",cost:1,description:"Call any publicly listed mundane phone from the Hollow without knowing its number; traces falsely identify the recipient's own line."},
  {name:"Route Zero",cost:1,description:"A one-dot looping trod crosses the Hollow. A traveler who navigates it safely returns to the start and regains 1 Willpower, once per day."},
  {name:"Size Matters 1",cost:1,group:"size-matters",description:"The Hollow comfortably houses a motley of five or six changelings."},
  {name:"Size Matters 2",cost:2,group:"size-matters",description:"The Hollow becomes a vast estate or small town."},
  {name:"Escape Route 1",cost:1,group:"escape-route",description:"Adds a secure stationary one-way emergency exit usable by owners and permitted guests."},
  {name:"Escape Route 2",cost:2,group:"escape-route",description:"The one-way emergency exit may appear reflexively anywhere inside the Hollow."},
  {name:"Hidden Entry",cost:2,description:"The entrance vanishes while all contributing owners are inside; finding or forcing it while visible suffers a two-die penalty."},
  {name:"Easy Access",cost:3,description:"The Hollow has no fixed entrance; spend 1 Glamour to enter through any unlocked mundane door and exit where you entered."},
  {name:"Home Turf",cost:3,description:"The owner adds Hollow dots to Initiative and Defense against intruders inside the Hollow."},
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
            {HOLLOW_OPTIONS.filter((option) => {
              const key=`${option.name}|${option.cost}`;
              if(selected.includes(key)) return true;
              const replacedCost="group" in option?selected.reduce((sum,item)=>{
                const selectedOption=HOLLOW_OPTIONS.find((candidate)=>`${candidate.name}|${candidate.cost}`===item);
                return sum+(selectedOption&&"group" in selectedOption&&selectedOption.group===option.group?selectedOption.cost:0);
              },0):0;
              return option.cost<=merit.dots-used+replacedCost;
            }).map((option) => {
              const {name, cost, description}=option;
              const key = `${name}|${cost}`,
                active = selected.includes(key);
              const alternatives="group" in option?HOLLOW_OPTIONS.filter((item)=>"group" in item&&item.group===option.group).map((item)=>`${item.name}|${item.cost}`):[];
              const withoutAlternatives=selected.filter((item)=>!alternatives.includes(item));
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
                          : [...withoutAlternatives, key],
                      )
                    }
                  />
                  <span>
                    <strong>{name}</strong>
                    <small>
                      {cost} {cost === 1 ? tr("ponto", "dot") : tr("pontos", "dots")}
                    </small>
                    <small>{description}</small>
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

const SHARED_BASTION_OPTIONS = [
  {name:"Buttressed Dreaming",cost:1,description:"Penalizes an opponent's Clash of Wills to force entry by the Shared Bastion rating."},
  {name:"Fixed Doorway",cost:3,description:"Requires Hollow. Creates a permanent Gate of Horn between that Hollow and the Bastion; each traveler spends 1 Glamour in each direction and may bring a passenger for +1 Glamour."},
  {name:"Guardian Eidolon",cost:1,description:"Spend 1 Willpower to wake the guardian for a scene. Owners cannot lose Defense to surprise and add Bastion dots to first-turn actions."},
  {name:"Illusory Armory",cost:2,description:"Once per chapter, spend Glamour to summon an unimportant prop with equipment rating twice Glamour spent, maximum +5; add 1 Willpower for an important prop."},
  {name:"Permanent Armory",cost:1,description:"Physical equipment remains safely stored in the Bastion. Each non-mundane item requires 1 Willpower per chapter or the Bastion absorbs it."},
  {name:"Raised Defenses",cost:1,description:"While an owner is inside, double the Bastion rating's defensive bonuses, to a maximum of +5."},
  {name:"Subtle Speech",cost:2,description:"Fixed eidolons relay private messages of up to five words from the Bastion to waking motley members."},
] as const;

function SharedBastionEditor({merit,configuration,onChange,compact}:{merit:MeritSelection;configuration:MeritConfiguration;onChange:(value:MeritConfiguration)=>void;compact:boolean}) {
  const {tr}=useLanguage();
  const selected=Array.isArray(configuration.features)?configuration.features:[];
  const used=selected.reduce((sum,item)=>sum+(Number(String(item).split("|")[1])||0),0);
  const set=(key:string,value:string|string[])=>onChange({...configuration,[key]:value});
  return <details className={`merit-configuration structured${compact?" compact":""}`} open={!compact}>
    <summary>{tr("Configurar Bastião Compartilhado","Configure Shared Bastion")}</summary>
    <div>
      <label>{tr("Nome","Name")}<Input value={String(configuration.name??"")} onChange={(event)=>set("name",event.target.value)}/></label>
      <label>{tr("Localização e aparência","Location and appearance")}<textarea value={String(configuration.location??"")} onChange={(event)=>set("location",event.target.value)}/></label>
      <fieldset><legend>{tr("Características","Features")} ({used}/{merit.dots} {tr("pontos","dots")})</legend><div className="structured-option-grid">
        {SHARED_BASTION_OPTIONS.filter(({name,cost})=>selected.includes(`${name}|${cost}`)||cost<=merit.dots-used).map(({name,cost,description})=>{const key=`${name}|${cost}`,active=selected.includes(key);return <label key={key}><input type="checkbox" checked={active} onChange={()=>set("features",active?selected.filter((item)=>item!==key):[...selected,key])}/><span><strong>{name}</strong><small>{cost} {cost===1?tr("ponto","dot"):tr("pontos","dots")}</small><small>{description}</small></span></label>;})}
      </div></fieldset>
    </div>
  </details>;
}

function StableTrodEditor({configuration,onChange,compact}:{configuration:MeritConfiguration;onChange:(value:MeritConfiguration)=>void;compact:boolean}) {
  const {tr}=useLanguage();
  const set=(key:string,value:string|string[])=>onChange({...configuration,[key]:value});
  const oneDotOptions=HOLLOW_OPTIONS.filter((item)=>item.cost===1).map((item)=>item.name);
  return <details className={`merit-configuration structured${compact?" compact":""}`} open={!compact}>
    <summary>{tr("Configurar Trilha Estável","Configure Stable Trod")}</summary><div>
      <label>{tr("Nome ou descrição da Trilha","Trod name or description")}<Input value={String(configuration.name??"")} onChange={(event)=>set("name",event.target.value)}/></label>
      <Choice label={tr("Melhoria de Recanto compartilhada","Shared Hollow enhancement")} value={String(configuration.enhancement??"")} setValue={(value)=>set("enhancement",value)} options={oneDotOptions}/>
    </div>
  </details>;
}

function WorkshopEditor({merit,configuration,onChange,compact}:{merit:MeritSelection;configuration:MeritConfiguration;onChange:(value:MeritConfiguration)=>void;compact:boolean}) {
  const {tr}=useLanguage();
  const specialties=Array.isArray(configuration.specialties)?configuration.specialties:[];
  return <details className={`merit-configuration structured${compact?" compact":""}`} open={!compact}>
    <summary>{tr("Configurar Oficina","Configure Workshop")}</summary><div><fieldset><legend>{tr("Especializações de Ofícios","Craft Specialties")}</legend>
      <div className="merit-config-list">{Array.from({length:merit.dots},(_,index)=><Input key={index} value={specialties[index]??""} placeholder={`${tr("Especialização","Specialty")} ${index+1}`} onChange={(event)=>{const next=Array.from({length:merit.dots},(_,item)=>specialties[item]??"");next[index]=event.target.value;onChange({...configuration,specialties:next});}}/>)}</div>
    </fieldset></div>
  </details>;
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
        {merit.grantedBy !== "Nameless Order" && <label>
          {tr("Nome do culto", "Cult name")}
          <Input
            value={value("cult")}
            onChange={(event) => set("cult", event.target.value)}
            placeholder={tr("Ex.: Igreja Vermelha", "E.g.: Red Church")}
          />
        </label>}
        {Array.from({ length: merit.dots }, (_, index) => index + 1).filter(level=>merit.grantedBy !== "Nameless Order" || level > 1).map(
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
  const { tr } = useLanguage();
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
            <MeritGrantSelectionDialog
              name={name}
              dots={dotOptions.includes(dots) ? dots : (dotOptions[0] ?? 1)}
              available={available}
              onSelect={(nextName,nextDots)=>update(index,nextName,nextDots)}
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

function MeritGrantSelectionDialog({name,dots,available,onSelect}:{name:string;dots:number;available:number;onSelect:(name:string,dots:number)=>void}){
  const {locale,tr}=useLanguage();
  const [search,setSearch]=useState("");
  const [category,setCategory]=useState("__all");
  const categories=[...new Set(CONFIG_MERITS.map((item)=>item.category))].sort((a,b)=>a.localeCompare(b));
  const normalized=search.trim().toLocaleLowerCase(locale);
  const selected=CONFIG_MERITS.find((item)=>item.name===name);
  const label=(item:MeritDefinition)=>locale==="pt-BR"?item.translatedName:item.name;
  const visible=CONFIG_MERITS.filter((item)=>(category==="__all"||item.category===category)&&item.ratings.some((rating)=>rating<=available)&&(!normalized||`${item.name} ${item.translatedName} ${item.description} ${item.prerequisites??""} ${item.source}`.toLocaleLowerCase(locale).includes(normalized)));
  return <Dialog>
    <DialogTrigger asChild><Button type="button" variant="outline" className="experience-merit-trigger"><span>{selected?`${label(selected)} ${"•".repeat(dots)}`:tr("Selecionar Mérito","Select Merit")}</span><Search/></Button></DialogTrigger>
    <DialogContent className="merit-dialog experience-merit-dialog">
      <DialogHeader><DialogTitle>{tr("Selecionar benefício de Mérito","Select Merit benefit")}</DialogTitle><DialogDescription>{tr(`Escolha Méritos somando até ${available} pontos.`,`Choose Merits totaling up to ${available} dots.`)}</DialogDescription></DialogHeader>
      <div className="catalog-filters">
        <label className="merit-search"><Search/><Input value={search} onChange={(event)=>setSearch(event.target.value)} placeholder={tr("Buscar por nome, descrição, requisito ou fonte","Search by name, description, prerequisite, or source")}/></label>
        <Choice label={tr("Categoria","Category")} value={category} setValue={setCategory} options={["__all",...categories]} optionLabels={{__all:tr("Todas as categorias","All categories"),...Object.fromEntries(categories.map((value)=>[value,locale==="pt-BR"?meritCategoryLabel(value):value]))}}/>
      </div>
      <div className="experience-merit-catalog">
        {visible.map((item)=><article key={item.id}><div><strong>{label(item)}</strong><small>{item.source} · p. {item.page||"—"}</small>{item.prerequisites&&<p><b>{tr("Pré-requisitos","Prerequisites")}:</b> {item.prerequisites}</p>}<p>{item.description}</p></div><div className="experience-merit-choice">{item.ratings.filter((rating)=>rating<=available).map((rating)=><DialogClose asChild key={rating}><Button type="button" size="sm" variant={name===item.name&&dots===rating?"default":"outline"} onClick={()=>onSelect(item.name,rating)}>{rating} {tr(rating===1?"ponto":"pontos",rating===1?"dot":"dots")}</Button></DialogClose>)}</div></article>)}
        {!visible.length&&<em>{tr("Nenhuma opção corresponde aos filtros.","No options match the filters.")}</em>}
      </div>
      <DialogFooter><DialogClose asChild><Button type="button" variant="outline">{tr("Cancelar","Cancel")}</Button></DialogClose></DialogFooter>
    </DialogContent>
  </Dialog>;
}

function isRepeatableDefinition(definition: MeritDefinition) {
  return (
    REPEATABLE_MERITS.has(definition.name) ||
    Boolean((definition as MeritDefinition & { repeatable?: boolean }).repeatable)
  );
}
function meritTooltip(definition: MeritDefinition,locale:"pt-BR"|"en-US") {
  return definition.prerequisites
    ? `${locale==="pt-BR"?"Pré-requisitos":"Prerequisites"}: ${definition.prerequisites}\n${definition.description}`
    : definition.description;
}

export function experienceTraitDots(initial: CharacterSheet | null | undefined, group: "attributes" | "skills") {
  const historyKey = initial?.game_line === "MtA" ? "mage_experience_history" : "experience_history";
  const history = initial?.current_state?.[historyKey];
  if (!Array.isArray(history)) return {} as Record<string, number>;
  return history.reduce<Record<string, number>>((totals, raw) => {
    if (!raw || typeof raw !== "object") return totals;
    const undo = (raw as { undo?: unknown }).undo;
    if (!undo || typeof undo !== "object") return totals;
    const trait = undo as { kind?: unknown; group?: unknown; name?: unknown };
    if (trait.kind === "trait" && trait.group === group && typeof trait.name === "string")
      totals[trait.name] = (totals[trait.name] ?? 0) + 1;
    return totals;
  }, {});
}
function mageExperienceHistory(initial: CharacterSheet | null | undefined) {
  const history = initial?.current_state?.mage_experience_history;
  return Array.isArray(history) ? history as Array<{undo?:Record<string,unknown>}> : [];
}
export function experienceArcanaDots(initial: CharacterSheet | null | undefined) {
  return mageExperienceHistory(initial).reduce<Record<string,number>>((totals,entry)=>{
    const undo=entry.undo;
    if(undo?.kind==="arcana"&&typeof undo.name==="string")totals[undo.name]=(totals[undo.name]??0)+1;
    return totals;
  },{});
}
function experienceSpecialties(initial: CharacterSheet | null | undefined) {
  return mageExperienceHistory(initial)
    .map(entry=>entry.undo)
    .filter((undo):undo is Record<string,unknown>=>undo?.kind==="specialty"&&typeof undo.skill==="string"&&typeof undo.name==="string")
    .map(undo=>({skill:String(undo.skill),name:String(undo.name)}));
}
function editableSpecialties(initial: CharacterSheet | null | undefined) {
  const values=(initial?.specializations??[]).filter(item=>!item.grantedBy).map(item=>({skill:item.skill,name:item.name}));
  for(const purchased of experienceSpecialties(initial)){
    const index=values.findLastIndex(item=>item.skill===purchased.skill&&item.name===purchased.name);
    if(index>=0)values.splice(index,1);
  }
  return normalizeSpecialties(values);
}
function editableArcana(initial: CharacterSheet | null | undefined) {
  const values=normalizeArcana(initial?.line_data.arcana);
  for(const [name,dots] of Object.entries(experienceArcanaDots(initial)))values[name]=Math.max(0,Number(values[name]??0)-dots);
  return values;
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
  if (spell.summary?.trim()) return spell.summary.trim();
  const description = spell.description?.trim() || "Descrição não disponível.";
  const firstSentence = description.match(/^.*?[.!?](?:\s|$)/)?.[0]?.trim();
  return firstSentence || description;
}

function spellReach(spell: SpellDefinition) {
  const description = spell.description?.trim() ?? "";
  const firstReach = description.search(/(?:Add [A-Za-z]+\s*[•●\d]+:\s*)?\+\d+ Reach:/i);
  if (firstReach < 0) return "";
  return description.slice(firstReach).replace(/\s+(?=(?:Add [A-Za-z]+\s*[•●\d]+:\s*)?\+\d+ Reach:)/gi, " · ");
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
        Changeling: "Changeling",
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
function updateArray<T>(setter: Setter<T[]>, values: T[], index: number, value: T) {
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
    initiation: normalizeMeritConfiguration(item.initiation),
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
