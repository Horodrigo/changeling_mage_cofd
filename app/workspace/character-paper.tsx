"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import {
  ChevronRight,
  Download,
  FileJson,
  History,
  FlaskConical,
  LayoutDashboard,
  MoreHorizontal,
  Pencil,
  Plus,
  RotateCcw,
  Search,
  ShieldCheck,
  Sparkles,
  Trash2,
  Upload,
  UsersRound,
  X,
} from "lucide-react";
import { courtCanonicalId, courtDisplayName, courtPageCitation, courtPresentation } from "@/lib/changeling-courts";
import { ANIMALS, animalPresentation } from "@/lib/companions";
import { availableForeignClauseCourtIds } from "@/lib/contract-clauses";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useIsMobile } from "@/hooks/use-mobile";
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  CharacterBuilder,
  MeritConfigurationEditor,
  type CharacterSheet,
} from "../character-builder";
import { entitlementPrerequisitesMet, findEntitlement, normalizeEntitlementState, synchronizeEntitlement } from "@/lib/entitlements";
import { findLegacy, normalizeLegacyState } from "@/lib/legacies";
import {
  decodeConfiguredRows,
  expandedConfigurationLines,
  findMeritConfiguration,
  isInlineMeritConfiguration,
  meritConfigurationTitle,
  normalizeMeritConfiguration,
  synchronizeMeritGrants,
  type TokenConfigurationItem,
} from "@/lib/merit-configurations";
import {
  ATTRIBUTES,
  CTL_THREADS,
  CTL_SEEMINGS,
  changelingAnchorDisplayName,
  changelingAnchorRecovery,
  seemingDisplayName,
  MTA_ORDER_LABELS,
  MTA_ORDER_DESCRIPTIONS,
  MTA_ORDERS,
  MTA_PATHS,
  SKILLS,
  normalizeChangelingFrailties,
  wyrdSummary,
} from "@/lib/creation-rules";
import {
  getMeritsForLine,
  meritPrerequisitesMet,
  meritContextForSheet,
  meritSelectionProblems,
  meritRatingsFor,
  REPEATABLE_MERITS,
  type MeritDefinition,
} from "@/lib/merits";
import { findKith, kithDisplayName, kithPresentation } from "@/lib/changeling-kiths";
import { kithCreationChoice } from "@/lib/changeling-kith-choices";
import { contractDisplayOptions, contractHasInvocationRoll, contractOutcomeSections, contractPresentation, contractSummary, contractWithSupplementalBenefits } from "@/lib/contract-presentation";
import { alphabetical } from "@/lib/option-order";
import {
  CONTRACTS,
  findContract,
  type ContractDefinition,
} from "@/lib/contracts";
import {
  normalizeClarityDamage,
  normalizeDamage,
  powerResourceLimits,
  permanentClarityBonus,
  changePermanentClarity,
  woundPenalty,
  type ClarityDamageLevel,
  type DamageLevel,
} from "@/lib/resource-rules";
import {
  CHANGELING_CONDITIONS,
  changelingConditionPresentation,
  findChangelingCondition,
} from "@/lib/changeling-conditions";
import { MAGE_CONDITIONS, findMageCondition } from "@/lib/mage-conditions";
import { SPELLS } from "@/lib/spells";
import { RuleSelect } from "./rule-select";
import { SwipeableSheetTabs } from "./sheet-tabs";
import { LegacyPage } from "./legacy-page";
import { EntitlementPage } from "./entitlement-page";
import { workspaceTerm } from "./workspace-i18n";
import { ArmorDotPicker, CompactValues, DotValue, HealthTrack, SheetHeading, TraitBlock, TraitLine, pretty, signed, stringList } from "./sheet-primitives";
import { CombatPage } from "./combat-page";
import { CompanionPage } from "./companion-page";
import { ConfirmAction } from "./confirm-action";
import { ExperiencePanel } from "./changeling-experience-panel";
import { MageExperiencePanel } from "./mage-experience-panel";
import { ExperiencePowerPicker, derivedWithPermanentMerits, formatSpellRequirements } from "./experience-shared";
import { meetsArcanaRequirements } from "@/lib/creation-eligibility";
import { changelingFavoredRegalia, changelingContractExperienceCost } from "@/lib/changeling-regalia";
import { EXPANDED_MERIT_NAMES, findExpandedMerit } from "@/lib/expanded-merits";
import { HomebrewsPage } from "../homebrews";
import { useHomebrews } from "../use-homebrews";
import { isBuiltinHomebrew, isHomebrewActive, migrateCharacterHomebrews, saveHomebrews } from "@/lib/homebrews";
import { getDeviceValue, setDeviceValue } from "@/lib/device-storage";
import { withPowerRating, refundPowerRating } from "@/lib/power-progression";
import { subtractDots, refundMeritDots, refundMageAdvancement, type MageAdvancementUndo } from "@/lib/experience-refunds";
import { addExperienceMeritDots } from "@/lib/merit-progression";
import { localeFlag, useLanguage, type Locale } from "@/lib/i18n";
import { systemTerm } from "@/lib/system-terms";
import { mageNimbusConnection, mageNimbusTiltBudget, normalizeNimbusTiltEffects } from "@/lib/mage-nimbus";

export function CharacterPaper({
  character,
  updateState,
  updateSheet,
}: {
  character: CharacterSheet;
  updateState: (state: Record<string, unknown>) => void;
  updateSheet: (sheet: CharacterSheet) => void;
}) {
  const { locale, tr } = useLanguage();
  const isMobile = useIsMobile();
  const [sheetTab,setSheetTab]=useState(isMobile?"resumo":"principal");
  const homebrews = useHomebrews();
  const isExpanded = (name: string) =>
    isExpandedMerit(name) ||
    name === "Contacts" ||
    name === "Multilingual" ||
    Boolean(homebrews.merits.find((item) => item.name === name)?.levels?.length);
  const isCtl = character.game_line === "CtL";
  const data = character.line_data;
  const entitlementMerit=character.merits.find((item)=>item.name==="Entitlement"&&!item.grantedBy);
  const hasCompanions=character.merits.some((item)=>!item.grantedBy&&["Fae Mount","Fae Pet","Familiar"].includes(item.name))||selectedConditionList(character.current_state?.conditions).some(item=>item.id==="bonded");
  const derived = derivedWithPermanentMerits(character);
  const grantedSkillBonuses = (
    data.merit_granted_skill_bonuses &&
    typeof data.merit_granted_skill_bonuses === "object"
      ? data.merit_granted_skill_bonuses
      : {}
  ) as Record<string, number>;
  const specialties = [
    ...character.specializations.map((item) =>
      typeof item === "string" ? { skill: "", name: item } : item,
    ),
    ...Object.entries(grantedSkillBonuses)
      .filter(([, value]) => Number(value) > 0)
      .map(([skill, value]) => ({
        skill,
        name: `+${value} concedido por Mérito`,
      })),
  ];
  const effectiveSkills = Object.fromEntries(
    Object.entries(character.skills).map(([name, value]) => [
      name,
      Number(value) + (Number(grantedSkillBonuses[name]) || 0),
    ]),
  );
  const canonicalSkill = (value: unknown): string | undefined => {
    const raw = String(value ?? "").trim();
    return Object.values(SKILLS).flat().find(
      (skill) => skill === raw || systemTerm(skill, "en-US") === raw || systemTerm(skill, "pt-BR") === raw,
    );
  };
  const kithDefinition = isCtl && !data.kith_custom ? findKith(data.kith) : undefined;
  const kithChoiceDefinition = isCtl ? kithCreationChoice(kithDefinition?.id) : undefined;
  const kithSkill = isCtl
    ? canonicalSkill(kithChoiceDefinition?.kind === "skill" ? data.kith_choice : data.kith_skill ?? kithDefinition?.skill)
    : undefined;
  const highlightedSkills = new Set<string>(
    isCtl
      ? (kithSkill ? [kithSkill] : [])
      : stringList(data.rote_skills).map(canonicalSkill).filter((skill): skill is string => Boolean(skill)),
  );
  const skillHighlightTone = isCtl ? "kith" as const : "rote" as const;
  const aspirations = stringList(data.aspirations);
  const frailties = normalizeChangelingFrailties(data.frailties, Number(data.wyrd ?? 1));
  const touchstoneSlots = 1 + character.merits
    .filter((merit) => merit.name === "Touchstone" && !merit.grantedBy)
    .reduce((sum, merit) => sum + merit.dots, 0);
  const touchstones = stringList(data.touchstones);
  if (!touchstones.length) touchstones.push(String(data.touchstone ?? ""));
  while (touchstones.length < touchstoneSlots) touchstones.push("");
  touchstones.splice(touchstoneSlots);
  const oaths = stringList(data.oaths);
  const contracts = [
    ...objectList(data.contracts),
    ...objectList(data.learned_contracts),
  ];
  const rotes = [...objectList(data.rotes), ...objectList(data.learned_rotes)];
  const praxes = [
    ...objectList(data.praxes),
    ...objectList(data.learned_praxes),
  ];
  const arcana = (
    data.arcana && typeof data.arcana === "object" ? data.arcana : {}
  ) as Record<string, number>;
  const gnosis = Number(data.gnosis ?? 1);
  const availablePraxes = [...SPELLS, ...homebrews.spells.filter(item=>isHomebrewActive(homebrews,item.id))]
    .filter(spell=>meetsArcanaRequirements(spell.requirements,arcana)&&!praxes.some(item=>String(item.id)===spell.id))
    .map(spell=>({id:spell.id,name:locale==="en-US"?spell.originalName:spell.name,category:Object.keys(spell.requirements).join(" + "),description:spell.summary??spell.description??"",meta:`${formatSpellRequirements(spell.requirements)} · ${spell.source} · p. ${spell.page||"—"}`}));
  const addGrantedPraxis=(id:string)=>{
    if(praxes.length>=gnosis)return;
    const spell=[...SPELLS,...homebrews.spells].find(item=>item.id===id);
    if(!spell)return;
    const next=structuredClone(character);
    next.line_data.learned_praxes=[...objectList(next.line_data.learned_praxes),{...spell}];
    updateSheet(next);
  };
  const inuredSpells=objectList(data.inured_spells);
  const availableInuredSpells=[...SPELLS,...homebrews.spells.filter(item=>isHomebrewActive(homebrews,item.id))]
    .filter(spell=>meetsArcanaRequirements(spell.requirements,arcana)&&!inuredSpells.some(item=>String(item.id)===spell.id))
    .map(spell=>({id:spell.id,name:locale==="en-US"?spell.originalName:spell.name,category:Object.keys(spell.requirements).join(" + "),description:spell.summary??spell.description??"",meta:`${formatSpellRequirements(spell.requirements)} · ${spell.source} · p. ${spell.page||"—"}`}));
  const setInuredSpells=(items:Array<Record<string,unknown>>)=>{const next=structuredClone(character);next.line_data.inured_spells=items;updateSheet(next);};
  const addInuredSpell=(id:string)=>{if(inuredSpells.length>=gnosis)return;const spell=[...SPELLS,...homebrews.spells].find(item=>item.id===id);if(!spell)return;setInuredSpells([...inuredSpells,{...spell}]);};
  const removeInuredSpell=(id:string)=>setInuredSpells(inuredSpells.filter(item=>String(item.id)!==id));
  const nimbusEffects=normalizeNimbusTiltEffects(data.nimbus_tilt_effects,gnosis);
  const setNimbusEffects=(effects:Array<{trait:string;modifier:number}>)=>{const next=structuredClone(character);next.line_data.nimbus_tilt_effects=normalizeNimbusTiltEffects(effects,gnosis);updateSheet(next);};
  const removePraxis=(item:Record<string,unknown>)=>{
    const id=String(item.id??""),next=structuredClone(character);
    const history=Array.isArray(next.current_state.mage_experience_history)?next.current_state.mage_experience_history as Array<{id:string;regular:number;arcane:number;undo?:MageAdvancementUndo}>:[];
    const purchase=history.find(entry=>entry.undo?.kind==="spell"&&entry.undo.key==="learned_praxes"&&entry.undo.id===id);
    if(purchase?.undo){const refundedRegular=Number(purchase.regular)||0,refundedArcane=Number(purchase.arcane)||0;refundMageAdvancement(next,purchase.undo);next.current_state.mage_experience_available=Number(next.current_state.mage_experience_available??0)+refundedRegular;next.current_state.arcane_experience_available=Number(next.current_state.arcane_experience_available??0)+refundedArcane;next.current_state.mage_experience_spent=Math.max(0,Number(next.current_state.mage_experience_spent??0)-refundedRegular);next.current_state.arcane_experience_spent=Math.max(0,Number(next.current_state.arcane_experience_spent??0)-refundedArcane);next.current_state.mage_experience_history=history.filter(entry=>entry.id!==purchase.id);}
    else for(const key of ["praxes","learned_praxes"]){const list=objectList(next.line_data[key]),index=list.findIndex(candidate=>String(candidate.id??"")===id);if(index>=0){list.splice(index,1);next.line_data[key]=list;break;}}
    updateSheet(next);
  };
  const legacyState = !isCtl ? normalizeLegacyState(data.legacy_state) : null;
  const legacyDefinition = findLegacy(legacyState?.definitionId);
  const hasLegacyAccess = !isCtl && (gnosis >= 2 || Boolean(legacyState?.joined));
  const legacyDisplay = legacyState?.joined ? legacyDefinition?.name??"Legacy" : gnosis >= 3 ? tr("Join/Create","Join/Create") : gnosis >= 2 ? tr("Join","Join") : "";
  const pathDefinition=MTA_PATHS[String(data.path) as keyof typeof MTA_PATHS];
  const sameSystemTerm=(left:string,right:string)=>systemTerm(left,"en-US")===systemTerm(right,"en-US");
  const arcanaPresentation=(name:string)=>{
    const pathRuling=Boolean(pathDefinition?.ruling.some(item=>sameSystemTerm(String(item),name)));
    const legacyRuling=Boolean(legacyState?.joined&&legacyDefinition&&sameSystemTerm(legacyDefinition.rulingArcanum,name));
    const inferior=Boolean(pathDefinition?.inferior&&sameSystemTerm(String(pathDefinition.inferior),name));
    return {note:legacyRuling?tr("Regente da Legacy","Legacy Ruling"):pathRuling?tr("Regente","Ruling"):inferior?tr("Inferior","Inferior"):undefined};
  };
  const obsessionSlots=gnosis<=2?1:gnosis<=5?2:gnosis<=8?3:4;
  const powerRating = isCtl ? Number(data.wyrd ?? 1) : gnosis;
  const resource = powerResourceLimits(powerRating);
  const health = Math.max(1, Number(derived.Vitalidade ?? 5));
  const baseWillpower = Math.max(1, Number(derived.ForçaDeVontade ?? 1));
  const lostWillpower = boundedNumber(
    character.current_state?.willpower_lost_dots,
    baseWillpower - 1,
    0,
  );
  const willpower = Math.max(1, baseWillpower - lostWillpower);
  const damage = normalizeDamage(
    character.current_state?.health_damage,
    health,
  );
  const clarityMaximum = Math.max(
    1,
    Number(derived.LucidezMaxima ?? derived.ClarezaMaxima ?? 1),
  );
  const clarityDamage = normalizeClarityDamage(
    character.current_state?.clarity_damage,
    clarityMaximum,
  );
  const currentWillpower = boundedNumber(
    character.current_state?.willpower_current,
    willpower,
    willpower,
  );
  const resourceKey = isCtl ? "glamour_current" : "mana_current";
  const currentResource = boundedNumber(
    character.current_state?.[resourceKey],
    resource.maximum,
    resource.maximum,
  );
  const entitlementState=isCtl&&entitlementMerit?normalizeEntitlementState(data.entitlement,powerRating):null;
  const hasStoredGlamour=Boolean(entitlementState?.accepted&&entitlementState.allocations.some((item)=>item.target==="blessing"&&item.blessingId==="glamour-gain")&&entitlementState.touchstone.status==="active"&&entitlementState.touchstone.name.trim()&&findEntitlement(entitlementState.definitionId)&&entitlementPrerequisitesMet(findEntitlement(entitlementState.definitionId)!,entitlementState,character));
  const storedGlamour=hasStoredGlamour?boundedNumber(entitlementState?.token.storedGlamour,powerRating,0):0;
  const setStoredGlamour=(value:number)=>{
    if(!entitlementMerit||!entitlementState)return;
    const next=structuredClone(character),merit=next.merits.find((item)=>item.name==="Entitlement"&&!item.grantedBy);
    if(!merit)return;
    const state=normalizeEntitlementState(next.line_data.entitlement,powerRating);
    state.token={...state.token,storedGlamour:boundedNumber(value,powerRating,0)};
    next.line_data.entitlement=state;
    updateSheet(synchronizeEntitlement(next));
  };
  const goblinDebt = boundedNumber(character.current_state?.goblin_debt, 9, 0);
  const expandedMerits = character.merits.filter(
    (item) => (isExpanded(item.name) || item.name === "Mystery Cult Initiation") && (!item.grantedBy || item.grantedBy === "Nameless Order"),
  );
  const principalMerits = character.merits.filter(
    (item) => !item.grantedBy || item.grantedBy === "Corte",
  );
  const selectedConditions = [
    ...selectedConditionList(character.current_state?.conditions),
    ...stringList(data.merit_granted_conditions).map((id) => ({
      id,
      persistent: false,
    })),
  ].filter(
    (item, index, all) =>
      item.id === "bonded" || all.findIndex((other) => other.id === item.id) === index,
  );
  const notes = String(character.current_state?.notes ?? "");
  const setState = (key: string, value: unknown) =>
    updateState({ ...character.current_state, [key]: value });
  const addHubrisCondition=(id:"megalomaniacal"|"rampant",persistent:boolean)=>setState("conditions",[...selectedConditionList(character.current_state?.conditions).filter(item=>item.id!==id),{id,persistent}]);

  if (isMobile) {
    const identity = isCtl
      ? [
          ["Nome", character.character.name], ["Jogador", character.character.player],
          ["Crônica", character.character.chronicle], ["Agulha", changelingAnchorDisplayName("needle",data.needle,locale)], ["Fio", changelingAnchorDisplayName("thread",data.thread,locale)],
          ["Conceito", character.character.concept],
          ["Feição", seemingDisplayName(data.seeming,locale)],
          [tr("Frátria", "Kith"), kithDisplayName(data.kith, Boolean(data.kith_custom), locale)], [tr("Corte", "Court"), courtDisplayName(data.court, locale)],
        ]
      : [
          ["Nome", character.character.name], ["Jogador", character.character.player],
          ["Crônica", character.character.chronicle], ["Vício", data.vice], ["Virtude", data.virtue],
          ["Conceito", character.character.concept], ["Nome das Sombras", data.shadow_name],
          ["Caminho", data.path], ["Ordem", !data.order||data.order==="Orderless"?tr("Sem Ordem","Orderless"):data.order==="Nameless"?"Nameless":locale==="en-US"?data.order:MTA_ORDER_LABELS[String(data.order)] ?? data.order],
        ];
    const paradoxConditions = MAGE_CONDITIONS.filter((condition) =>
      `${condition.name} ${condition.description} ${condition.penalty}`.toLocaleLowerCase("pt-BR").includes("paradoxo"),
    );
    return (
      <article className={`cod-sheet mobile-character-sheet ${isCtl ? "ctl-sheet" : "mta-sheet"}`}>
        <header className="cod-sheet-title">
          <div><span>{isCtl ? "CHANGELING" : tr("MAGO","MAGE")}</span><strong>{isCtl ? tr("OS PERDIDOS","THE LOST") : tr("O DESPERTAR","THE AWAKENING")}</strong></div>
          <p>{tr("CRÔNICAS DAS TREVAS","CHRONICLES OF DARKNESS")}</p>
        </header>
        <SwipeableSheetTabs value={sheetTab} onValueChange={setSheetTab} tabs={[
          { value: "resumo", label: tr("Resumo","Summary") }, { value: "stats", label: "Stats" },
          { value: "detalhes", label: tr("Detalhes","Details") },
          { value: "poderes", label: tr("Poderes","Powers") },
          ...(isCtl&&entitlementMerit?[{value:"entitlement",label:"Entitlement"}]:[]),
          ...(!isCtl&&hasLegacyAccess?[{value:"legacy",label:"Legacy",hidden:!legacyState?.joined}]:[]),
          { value: "combate", label: tr("Combate","Combat") },
          ...(hasCompanions?[{ value: "companheiros", label: tr("Companheiros","Companions") }]:[]), { value: "anotacoes", label: tr("Anotações","Notes") },
        ]}>
          {{
            resumo: <>
              <section className="sheet-identity-grid">{identity.map(([label, value]) => <SheetField key={String(label)} label={String(label)} value={value} />)}{!isCtl&&<LegacySheetField value={legacyDisplay} enabled={hasLegacyAccess} onOpen={()=>setSheetTab("legacy")}/>}</section>
              <SheetHeading>Experiência</SheetHeading>
              {isCtl ? <ExperiencePanel character={character} updateSheet={updateSheet} /> : <MageExperiencePanel character={character} updateSheet={updateSheet} />}
              {!isCtl&&<><SheetHeading>Méritos Expandidos</SheetHeading><ExpandedMeritList merits={expandedMerits} character={character} updateSheet={updateSheet}/></>}
              {!isCtl&&<div className="sheet-bottom-grid mage-bottom-grid"><section><SheetHeading>Condições</SheetHeading><ConditionManager selected={selectedConditions} catalog={MAGE_CONDITIONS} onChange={(value)=>setState("conditions",value)}/></section><section><SheetHeading>Aspirações</SheetHeading><EditableList values={aspirations} minimum={3} maximum={3} placeholder={tr("Escreva uma Aspiração","Write an Aspiration")} onChange={(value)=>updateLineData(updateSheet,character,"aspirations",value)}/></section><section><SheetHeading>Obsessões</SheetHeading><EditableList values={stringList(data.obsessions)} minimum={obsessionSlots} maximum={obsessionSlots} placeholder={tr("Escreva uma Obsessão","Write an Obsession")} onChange={(value)=>updateLineData(updateSheet,character,"obsessions",value)}/></section></div>}
            </>,
            stats: <>
              <SheetHeading>Atributos</SheetHeading>
              <div className="mobile-attribute-grid">{Object.entries(ATTRIBUTES).map(([category, names]) => <TraitBlock key={category} title={category} names={names} values={character.attributes} compactNames />)}</div>
              <SheetHeading>Perícias</SheetHeading>
              <div className="mobile-trait-stack">{Object.entries(SKILLS).map(([category, names]) => <TraitBlock key={category} title={category} names={names} values={effectiveSkills} specialties={specialties} highlightedNames={highlightedSkills} highlightTone={skillHighlightTone} />)}</div>
            </>,
            detalhes: isCtl ? <>
              <SheetHeading>Méritos</SheetHeading><MeritSheetList character={character} merits={principalMerits} line={character.game_line} updateSheet={updateSheet} />
              <SheetHeading>Méritos Expandidos</SheetHeading><CourtLore data={data} merits={character.merits} /><ExpandedMeritList merits={expandedMerits} character={character} updateSheet={updateSheet} hasAdjacentContent />
              <MeritConfigurationPanel character={character} updateSheet={updateSheet} />
              <SheetHeading>Aspirações</SheetHeading><EditableList values={aspirations} minimum={3} maximum={3} placeholder={tr("Escreva uma Aspiração","Write an Aspiration")} onChange={(value)=>updateLineData(updateSheet,character,"aspirations",value)}/>
              <SheetHeading>Fragilidades</SheetHeading><FrailtyList values={frailties} onChange={(value) => updateLineData(updateSheet, character, "frailties", value)} />
              <SheetHeading>Pedras de Contato</SheetHeading><EditableList values={touchstones} minimum={touchstoneSlots} maximum={touchstoneSlots} placeholder={tr("Escreva uma Pedra de Contato","Write a Touchstone")} onChange={(value) => updateLineData(updateSheet, character, "touchstones", value)} />
              <SheetHeading>Lucidez</SheetHeading><ClarityTrack maximum={clarityMaximum} damage={clarityDamage} onChange={(value) => setState("clarity_damage", value)} />
              <SheetHeading>Condições</SheetHeading><ConditionManager selected={selectedConditions} catalog={CHANGELING_CONDITIONS} onChange={(value) => setState("conditions", value)} />
            </> : <>
              <SheetHeading>Méritos</SheetHeading><MeritSheetList character={character} merits={character.merits} line="MtA" updateSheet={updateSheet} />
              <MageOrderSummary data={data} />
              <MeritConfigurationPanel character={character} updateSheet={updateSheet} />
              <SheetHeading>Feitiços Ativos</SheetHeading><EditableList values={stringList(character.current_state?.active_spells)} minimum={gnosis} maximum={gnosis} placeholder={tr("Feitiço ativo","Active spell")} onChange={(value) => setState("active_spells", value)} />
            </>,
            poderes: isCtl ? <>
              <PowerResource name="Fado" rating={powerRating} summary={wyrdSummary(powerRating, locale)} resourceName="Glamour" current={currentResource} maximum={resource.maximum} perTurn={resource.perTurn} onChange={(value) => setState(resourceKey, value)} storedCurrent={hasStoredGlamour?storedGlamour:undefined} storedMaximum={hasStoredGlamour?powerRating:undefined} onStoredChange={setStoredGlamour} />
              <SheetHeading>Regalias Favorecidas</SheetHeading><LineList items={changelingFavoredRegalia(data)} />
              <SheetHeading>Contratos</SheetHeading><ContractPowerList contracts={contracts} seeming={String(data.seeming ?? "")} court={String(data.court ?? "")} extraBenefits={objectList(data.extra_contract_benefits)} extraClauses={objectList(data.extra_contract_clauses)} />
              <SheetHeading>Débito Goblin</SheetHeading><GoblinDebtTrack value={goblinDebt} onChange={(value) => setState("goblin_debt", value)} />
              <SheetHeading>Juramentos</SheetHeading><EditableList values={oaths} minimum={5} placeholder={tr("Escreva um Juramento","Write an Oath")} onChange={(value) => updateLineData(updateSheet, character, "oaths", value)} />
              <SeemingLore seeming={String(data.seeming ?? "")} /><KithLore data={data} />
            </> : <>
              <PowerResource name="Gnose" rating={powerRating} resourceName="Mana" current={currentResource} maximum={resource.maximum} perTurn={resource.perTurn} onChange={(value) => setState(resourceKey, value)} />
              <SheetHeading>Arcanos</SheetHeading><div className="arcana-sheet-list">{Object.entries(arcana).map(([name,value])=><TraitLine key={name} name={name} value={Number(value)} {...arcanaPresentation(name)}/>)}</div>
              <MageWisdomSection wisdom={Number(data.wisdom??7)} gnosis={gnosis} inuredSpells={inuredSpells} available={availableInuredSpells} locale={locale} onAdd={addInuredSpell} onRemove={removeInuredSpell} onHubris={addHubrisCondition}/>
              <SheetHeading>Rotas</SheetHeading><SpellColumn items={rotes} showSkill />
              <SheetHeading>Ferramentas Mágicas</SheetHeading><EditableList values={stringList(data.magical_tools).length ? stringList(data.magical_tools) : [String(data.dedicated_tool ?? "")]} minimum={3} maximum={3} firstPrefix={tr("Ferramenta Dedicada:","Dedicated Tool:")} placeholder={tr("Ferramenta mágica","Magical tool")} onChange={(value) => updateLineData(updateSheet, character, "magical_tools", value)} />
              <SheetHeading>Inclinação do Nimbus</SheetHeading><NimbusEditor wisdom={Number(data.wisdom??7)} gnosis={gnosis} values={stringList(data.nimbus_tilt)} effects={nimbusEffects} onChange={(value)=>updateLineData(updateSheet,character,"nimbus_tilt",value)} onEffectsChange={setNimbusEffects}/>
              <div className="sheet-heading-action"><SheetHeading>Práxis</SheetHeading>{praxes.length<gnosis&&<ExperiencePowerPicker kind="Práxis" items={availablePraxes} selectedId="" onSelect={addGrantedPraxis} compact/>}</div><SpellColumn items={praxes} minimumRows={gnosis} onRemove={removePraxis} />
              <SheetHeading>Attainments</SheetHeading><MageAttainmentList arcana={arcana} />
              <SheetHeading>Condições do Paradoxo</SheetHeading><ConditionManager selected={selectedConditions} catalog={paradoxConditions} onChange={(value) => setState("conditions", value)} />
            </>,
            entitlement: <EntitlementPage character={character} updateSheet={updateSheet}/>,
            legacy: <LegacyPage character={character} updateSheet={updateSheet} onDiscard={()=>setSheetTab("resumo")}/>,
            combate: <>
              <SheetHeading>Vitalidade</SheetHeading><HealthTrack health={health} damage={damage} onChange={(value) => setState("health_damage", value)} />
              <SheetHeading>Força de Vontade</SheetHeading><ResourceTrack label="Força de Vontade" current={currentWillpower} maximum={willpower} onChange={(value) => setState("willpower_current", value)} />
              <CombatPage character={character} derived={derived} updateSheet={updateSheet} />
            </>,
            companheiros: <CompanionPage character={character} updateSheet={updateSheet} />,
            anotacoes: <><SheetHeading>Anotações</SheetHeading><NotesArea value={notes} onChange={(value) => setState("notes", value)} /></>,
          }}
        </SwipeableSheetTabs>
      </article>
    );
  }
  return (
    <article className={`cod-sheet ${isCtl ? "ctl-sheet" : "mta-sheet"}`}>
      <header className="cod-sheet-title">
        <div>
          <span>{isCtl ? "CHANGELING" : tr("MAGO","MAGE")}</span>
          <strong>{isCtl ? tr("OS PERDIDOS","THE LOST") : tr("O DESPERTAR","THE AWAKENING")}</strong>
        </div>
        <p>{tr("CRÔNICAS DAS TREVAS","CHRONICLES OF DARKNESS")}</p>
      </header>
      {isCtl ? (
        <Tabs defaultValue="principal" className="ctl-sheet-tabs">
          <TabsList
            className="ctl-sheet-tab-list"
            aria-label={tr("Páginas da ficha","Character pages")}
          >
            <TabsTrigger value="principal">{tr("Principal","Main")}</TabsTrigger>
            <TabsTrigger value="poderes">{tr("Detalhes","Details")}</TabsTrigger>
            {entitlementMerit&&<TabsTrigger value="entitlement">Entitlement</TabsTrigger>}
            <TabsTrigger value="combate">{tr("Combate","Combat")}</TabsTrigger>
          {hasCompanions&&<TabsTrigger value="companheiros">{tr("Companheiros","Companions")}</TabsTrigger>}
          </TabsList>
          <TabsContent value="principal" data-page-title="Principal" className="ctl-sheet-page">
            <section className="sheet-identity-grid">
              <SheetField label="Nome" value={character.character.name} />
              <SheetField label="Agulha" value={changelingAnchorDisplayName("needle",data.needle,locale)} />
              <SheetField
                label="Feição"
                value={seemingDisplayName(data.seeming,locale)}
              />
              <SheetField label="Jogador" value={character.character.player} />
              <SheetField label="Fio" value={changelingAnchorDisplayName("thread",data.thread,locale)} />
              <SheetField label={tr("Frátria", "Kith")} value={kithDisplayName(data.kith, Boolean(data.kith_custom), locale)} />
              <SheetField label="Crônica" value={character.character.chronicle} />
              <SheetField
                label="Conceito"
                value={character.character.concept}
              />
              <SheetField label={tr("Corte", "Court")} value={courtDisplayName(data.court, locale)} />
            </section>
            <SheetHeading>Atributos</SheetHeading>
            <div className="official-trait-grid">
              {Object.entries(ATTRIBUTES).map(([category, names]) => (
                <TraitBlock
                  key={category}
                  title={category}
                  names={names}
                  values={character.attributes}
                />
              ))}
            </div>
            <div className="official-sheet-body">
              <div className="sheet-skills-column">
                <SheetHeading>Perícias</SheetHeading>
                {Object.entries(SKILLS).map(([category, names]) => (
                  <TraitBlock
                    key={category}
                    title={category}
                    names={names}
                    values={effectiveSkills}
                    specialties={specialties}
                    highlightedNames={highlightedSkills}
                    highlightTone="kith"
                  />
                ))}
              </div>
              <div className="sheet-center-column">
                <SheetHeading>Méritos</SheetHeading>
                <MeritSheetList
                  character={character}
                  merits={principalMerits}
                  line={character.game_line}
                  updateSheet={updateSheet}
                />
                <SheetHeading>Regalias Favorecidas</SheetHeading>
                <LineList
                  items={changelingFavoredRegalia(data)}
                />
                <SheetHeading>Fragilidades</SheetHeading>
                <FrailtyList
                  values={frailties}
                  onChange={(value) =>
                    updateLineData(updateSheet, character, "frailties", value)
                  }
                />
                <SheetHeading>Aspirações</SheetHeading>
                <EditableList
                  values={aspirations}
                  minimum={3}
                  maximum={3}
                  placeholder={tr("Escreva uma Aspiração", "Write an Aspiration")}
                  onChange={(value) =>
                    updateLineData(updateSheet, character, "aspirations", value)
                  }
                />
                <SheetHeading>Lucidez</SheetHeading>
                <ClarityTrack
                  maximum={clarityMaximum}
                  damage={clarityDamage}
                  onChange={(value) => setState("clarity_damage", value)}
                />
                <SheetHeading>Pedras de Contato</SheetHeading>
                <EditableList values={touchstones} minimum={touchstoneSlots} maximum={touchstoneSlots} placeholder={tr("Escreva uma Pedra de Contato","Write a Touchstone")} onChange={(value) => updateLineData(updateSheet, character, "touchstones", value)} />
              </div>
              <div className="sheet-right-column">
                <SheetHeading>Vitalidade</SheetHeading>
                <HealthTrack
                  health={health}
                  damage={damage}
                  onChange={(value) => setState("health_damage", value)}
                />
                <SheetHeading>Força de Vontade</SheetHeading>
                <ResourceTrack
                  label="Força de Vontade"
                  current={currentWillpower}
                  maximum={willpower}
                  onChange={(value) => setState("willpower_current", value)}
                />
                <SheetHeading>Características da Linha</SheetHeading>
                <PowerResource
                  name="Fado"
                  rating={powerRating}
                  summary={wyrdSummary(powerRating, locale)}
                  resourceName="Glamour"
                  current={currentResource}
                  maximum={resource.maximum}
                  perTurn={resource.perTurn}
                  onChange={(value) => setState(resourceKey, value)}
                  storedCurrent={hasStoredGlamour?storedGlamour:undefined}
                  storedMaximum={hasStoredGlamour?powerRating:undefined}
                  onStoredChange={setStoredGlamour}
                />
                <ExperiencePanel
                  character={character}
                  updateSheet={updateSheet}
                />
              </div>
            </div>
            <div className="sheet-bottom-grid mage-bottom-grid">
              <section>
                <SheetHeading>Condições</SheetHeading>
                <ConditionManager
                  selected={selectedConditions}
                  catalog={CHANGELING_CONDITIONS}
                  onChange={(value) => setState("conditions", value)}
                />
              </section>
              <section>
                <SheetHeading>Aspirações</SheetHeading>
                <EditableList values={aspirations} minimum={3} maximum={3} placeholder={tr("Escreva uma Aspiração","Write an Aspiration")} onChange={(value)=>updateLineData(updateSheet,character,"aspirations",value)}/>
              </section>
              <section>
                <SheetHeading>Anotações</SheetHeading>
                <NotesArea
                  value={notes}
                  onChange={(value) => setState("notes", value)}
                />
              </section>
            </div>
          </TabsContent>
          <TabsContent value="poderes" data-page-title="Detalhes" className="ctl-sheet-page powers-page">
            <SheetHeading>Contratos</SheetHeading>
            <ContractPowerList
              contracts={contracts}
              seeming={String(data.seeming ?? "")}
              court={String(data.court ?? "")}
              extraBenefits={objectList(data.extra_contract_benefits)}
              extraClauses={objectList(data.extra_contract_clauses)}
            />
            <div className="powers-sheet-grid">
              <section>
                <SheetHeading>Outras Características</SheetHeading>
                <SeemingLore seeming={String(data.seeming ?? "")} />
                <KithLore data={data} />
                <GoblinDebtTrack
                  value={goblinDebt}
                  onChange={(value) => setState("goblin_debt", value)}
                />
              </section>
              <section>
                <SheetHeading>Juramentos</SheetHeading>
                <EditableList
                  values={oaths}
                  minimum={5}
                  placeholder={tr("Escreva um Juramento", "Write an Oath")}
                  onChange={(value) =>
                    updateLineData(updateSheet, character, "oaths", value)
                  }
                />
                <SheetHeading>Méritos Expandidos</SheetHeading>
                <CourtLore data={data} merits={character.merits} />
                <ExpandedMeritList merits={expandedMerits} character={character} updateSheet={updateSheet} hasAdjacentContent/>
                <MeritConfigurationPanel
                  character={character}
                  updateSheet={updateSheet}
                />
              </section>
            </div>
          </TabsContent>
          {entitlementMerit&&<TabsContent value="entitlement" data-page-title="Entitlement" className="ctl-sheet-page powers-page"><EntitlementPage character={character} updateSheet={updateSheet}/></TabsContent>}
          <TabsContent value="combate" data-page-title="Combate" className="ctl-sheet-page powers-page">
            <CombatPage
              character={character}
              derived={derived}
              updateSheet={updateSheet}
            />
          </TabsContent>
          <TabsContent
            value="companheiros"
            data-page-title="Companheiros"
            className="ctl-sheet-page powers-page"
          >
            <CompanionPage character={character} updateSheet={updateSheet} />
          </TabsContent>
        </Tabs>
      ) : (
        <Tabs
          value={sheetTab}
          onValueChange={setSheetTab}
          className="ctl-sheet-tabs mta-sheet-tabs"
        >
          <TabsList
            className="ctl-sheet-tab-list"
            aria-label={tr("Páginas da ficha de Mago","Mage character pages")}
          >
            <TabsTrigger value="principal">{tr("Principal","Main")}</TabsTrigger>
            <TabsTrigger value="magia">{tr("Detalhes","Details")}</TabsTrigger>
            {legacyState?.joined&&<TabsTrigger value="legacy" data-legacy-tab-trigger>Legacy</TabsTrigger>}
            <TabsTrigger value="combate">{tr("Combate","Combat")}</TabsTrigger>
            {hasCompanions&&<TabsTrigger value="companheiros">{tr("Companheiros","Companions")}</TabsTrigger>}
          </TabsList>
          <TabsContent value="principal" data-page-title="Principal" className="ctl-sheet-page">
            <section className="sheet-identity-grid">
              <SheetField label="Nome das Sombras" value={data.shadow_name} />
              <SheetField label="Virtude" value={data.virtue} />
              <SheetField label="Caminho" value={data.path} />
              <SheetField label="Jogador" value={character.character.player} />
              <SheetField label="Vício" value={data.vice} />
              <SheetField label="Ordem" value={!data.order||data.order==="Orderless"?tr("Sem Ordem","Orderless"):data.order==="Nameless"?"Nameless":locale==="en-US"?data.order:MTA_ORDER_LABELS[String(data.order)] ?? data.order} />
              <SheetField label="Crônica" value={character.character.chronicle} />
              <SheetField label="Conceito" value={character.character.concept} />
              <LegacySheetField value={legacyDisplay} enabled={hasLegacyAccess} onOpen={()=>setSheetTab("legacy")} />
            </section>
            <SheetHeading>Atributos</SheetHeading>
            <div className="official-trait-grid">
              {Object.entries(ATTRIBUTES).map(([category, names]) => (
                <TraitBlock
                  key={category}
                  title={category}
                  names={names}
                  values={character.attributes}
                />
              ))}
            </div>
            <div className="official-sheet-body">
              <div className="sheet-skills-column">
                <SheetHeading>Perícias</SheetHeading>
                {Object.entries(SKILLS).map(([category, names]) => (
                  <TraitBlock
                    key={category}
                    title={category}
                    names={names}
                    values={effectiveSkills}
                    specialties={specialties}
                    highlightedNames={highlightedSkills}
                    highlightTone="rote"
                  />
                ))}
              </div>
              <div className="sheet-center-column">
                <SheetHeading>Méritos</SheetHeading>
                <MeritSheetList character={character} merits={character.merits} line="MtA" updateSheet={updateSheet} />
                <SheetHeading>Méritos Expandidos</SheetHeading>
                <ExpandedMeritList merits={expandedMerits} character={character} updateSheet={updateSheet}/>
                <MageOrderSummary data={data} />
                <SheetHeading>Arcanos</SheetHeading>
                <div className="arcana-sheet-list">
                  {Object.entries(arcana).map(([name,value])=><TraitLine key={name} name={name} value={Number(value)} {...arcanaPresentation(name)}/>) }
                </div>
                <MageWisdomSection wisdom={Number(data.wisdom??7)} gnosis={gnosis} inuredSpells={inuredSpells} available={availableInuredSpells} locale={locale} onAdd={addInuredSpell} onRemove={removeInuredSpell} onHubris={addHubrisCondition}/>
              </div>
              <div className="sheet-right-column">
                <SheetHeading>Vitalidade</SheetHeading>
                <HealthTrack
                  health={health}
                  damage={damage}
                  onChange={(value) => setState("health_damage", value)}
                />
                <SheetHeading>Força de Vontade</SheetHeading>
                <ResourceTrack
                  label="Força de Vontade"
                  current={currentWillpower}
                  maximum={willpower}
                  onChange={(value) => setState("willpower_current", value)}
                />
                <PowerResource
                  name="Gnose"
                  rating={powerRating}
                  resourceName="Mana"
                  current={currentResource}
                  maximum={resource.maximum}
                  perTurn={resource.perTurn}
                  onChange={(value) => setState(resourceKey, value)}
                />
                <MageExperiencePanel
                  character={character}
                  updateSheet={updateSheet}
                />
              </div>
            </div>
            <div className="sheet-bottom-grid mage-bottom-grid">
              <section><SheetHeading>Condições</SheetHeading><ConditionManager selected={selectedConditions} catalog={MAGE_CONDITIONS} onChange={(value)=>setState("conditions",value)}/></section>
              <section><SheetHeading>Aspirações</SheetHeading><EditableList values={aspirations} minimum={3} maximum={3} placeholder={tr("Escreva uma Aspiração","Write an Aspiration")} onChange={(value)=>updateLineData(updateSheet,character,"aspirations",value)}/></section>
              <section><SheetHeading>Obsessões</SheetHeading><EditableList values={stringList(data.obsessions)} minimum={obsessionSlots} maximum={obsessionSlots} placeholder={tr("Escreva uma Obsessão","Write an Obsession")} onChange={(value)=>updateLineData(updateSheet,character,"obsessions",value)}/></section>
            </div>
          </TabsContent>
          <TabsContent
            value="magia"
            data-page-title="Detalhes"
            className="ctl-sheet-page powers-page mage-spell-page"
          >
            <div className="mage-page-355-grid">
              <section className="mage-page-left">
                <SheetHeading>Feitiços Ativos</SheetHeading>
                <EditableList
                  values={stringList(character.current_state?.active_spells)}
                  minimum={gnosis}
                  maximum={gnosis}
                  placeholder={tr("Feitiço ativo","Active spell")}
                  onChange={(value) => setState("active_spells", value)}
                />
                <SheetHeading>Attainments</SheetHeading>
                <MageAttainmentList arcana={arcana} />
                <div className="sheet-heading-action"><SheetHeading>Práxis</SheetHeading>{praxes.length<gnosis&&<ExperiencePowerPicker kind="Práxis" items={availablePraxes} selectedId="" onSelect={addGrantedPraxis} compact/>}</div>
                <SpellColumn items={praxes} minimumRows={gnosis} onRemove={removePraxis} />
              </section>
              <section className="mage-page-main">
                <SheetHeading>Rotas</SheetHeading>
                <SpellColumn items={rotes} showSkill />
                <SheetHeading>Ferramentas Mágicas</SheetHeading>
                <EditableList
                  values={stringList(data.magical_tools).length ? stringList(data.magical_tools) : [String(data.dedicated_tool ?? "")]}
                  minimum={3}
                  maximum={3}
                  firstPrefix={tr("Ferramenta Dedicada:","Dedicated Tool:")}
                  placeholder={tr("Ferramenta mágica","Magical tool")}
                  onChange={(value) => updateLineData(updateSheet, character, "magical_tools", value)}
                />
                <SheetHeading>Inclinação do Nimbus</SheetHeading>
                <NimbusEditor wisdom={Number(data.wisdom??7)} gnosis={gnosis} values={stringList(data.nimbus_tilt)} effects={nimbusEffects} onChange={(value)=>updateLineData(updateSheet,character,"nimbus_tilt",value)} onEffectsChange={setNimbusEffects}/>
                <MeritConfigurationPanel
                  character={character}
                  updateSheet={updateSheet}
                />
                <SheetHeading>Anotações</SheetHeading>
                <NotesArea
                  value={notes}
                  onChange={(value) => setState("notes", value)}
                />
              </section>
            </div>
          </TabsContent>
          {hasLegacyAccess&&<TabsContent value="legacy" data-page-title="Legacy" className="ctl-sheet-page powers-page"><LegacyPage character={character} updateSheet={updateSheet} onDiscard={()=>setSheetTab("principal")}/></TabsContent>}
          <TabsContent value="combate" data-page-title="Combate" className="ctl-sheet-page powers-page">
            <CombatPage
              character={character}
              derived={derived}
              updateSheet={updateSheet}
            />
          </TabsContent>
          <TabsContent
            value="companheiros"
            data-page-title="Companheiros"
            className="ctl-sheet-page powers-page"
          >
            <CompanionPage character={character} updateSheet={updateSheet} />
          </TabsContent>
        </Tabs>
      )}
    </article>
  );
}

function MeritConfigurationPanel({
  character,
  updateSheet,
}: {
  character: CharacterSheet;
  updateSheet: (sheet: CharacterSheet) => void;
}) {
  const { locale, tr } = useLanguage();
  const configurable = character.merits.filter(
    (item) => findMeritConfiguration(item.name) && !isInlineMeritConfiguration(item.name) && !["Fae Mount","Familiar","Entitlement"].includes(item.name) && !item.grantedBy,
  );
  if (!configurable.length) return null;
  const choices=configurable;
  const conditions = stringList(character.line_data.merit_granted_conditions),
    attainments = stringList(character.line_data.merit_granted_attainments);
  return (
    <section className="sheet-merit-configurations">
      {choices.length > 0 && <SheetHeading>Escolhas dos Méritos</SheetHeading>}
      {(conditions.length > 0 || attainments.length > 0) && (
        <div className="merit-grant-summary">
          {conditions.length > 0 && (
            <p>
              <strong>{tr("Condições concedidas:", "Granted Conditions:")}</strong> {conditions.join(", ")}
            </p>
          )}
          {attainments.length > 0 && (
            <p>
              <strong>{tr("Attainments concedidos:", "Granted Attainments:")}</strong> {attainments.join(", ")}
            </p>
          )}
        </div>
      )}
      {choices.map((item, configIndex) => {
        const meritIndex = character.merits.indexOf(item);
        return (
          <article key={`${item.name}-${item.sourceId ?? ""}-${configIndex}`}>
            <strong>
              {getMeritsForLine(character.game_line).find(
                (entry) => entry.name === item.name,
              )?.[locale === "en-US" ? "name" : "translatedName"] ?? item.name}
            </strong>
            <MeritConfigurationEditor
              compact
              merit={item}
              ownedMerits={character.merits}
              currentCourt={String(character.line_data.court??"")}
              onChange={(configuration) => {
                const next = structuredClone(character);
                const target = next.merits[meritIndex];
                if (target) target.configuration = configuration;
                updateSheet(synchronizeMeritGrants(next));
              }}
            />
          </article>
        );
      })}
    </section>
  );
}
function SheetField({ label, value }: { label: string; value: unknown }) {
  const {locale}=useLanguage();
  const anchorKind=label==="Agulha"?"needle":label==="Fio"?"thread":null;
  const tooltip=anchorKind?changelingAnchorRecovery(anchorKind,systemTerm(String(value??""),"en-US"),locale):"";
  return (
    <div className="official-field" title={tooltip||undefined} data-tooltip={tooltip||undefined} tabIndex={tooltip?0:undefined}>
      <span>{workspaceTerm(label,locale)}</span>
      <strong>{String(value ?? "")}</strong>
    </div>
  );
}
function LegacySheetField({value,enabled,onOpen}:{value:string;enabled:boolean;onOpen:()=>void}) {
  return <div className={`official-field legacy-sheet-field${enabled?" enabled":""}`}><span>Legacy</span>{enabled?<button type="button" onClick={onOpen}>{value}</button>:<strong>{value}</strong>}</div>;
}
function meritLabel(
  item: CharacterSheet["merits"][number],
  line?: "CtL" | "MtA",
  locale:Locale="pt-BR",
) {
  const definition = line
    ? getMeritsForLine(line).find((entry) => entry.name === item.name)
    : [...getMeritsForLine("CtL"), ...getMeritsForLine("MtA")].find(
        (entry) => entry.name === item.name,
      );
  const base = locale==="en-US"
      ? definition?.name ?? item.name
      : definition?.translatedName ??
      (item.name === "Hollow" ? "Recanto" : item.name),
    detail = meritConfigurationTitle(item.configuration, locale);
  return detail ? `${base}: ${detail}` : base;
}
function ExpandedMeritList({ merits,character,updateSheet,hasAdjacentContent=false }: { merits: CharacterSheet["merits"];character?:CharacterSheet;updateSheet?:(sheet:CharacterSheet)=>void;hasAdjacentContent?:boolean }) {
  const {locale,tr}=useLanguage();
  const homebrews = useHomebrews();
  const trifleUses=(character?.current_state.trifle_uses&&typeof character.current_state.trifle_uses==="object"&&!Array.isArray(character.current_state.trifle_uses)?character.current_state.trifle_uses:{}) as Record<string,number>;
  const setTrifleUses=(key:string,value:number)=>{
    if(!character||!updateSheet)return;
    updateSheet({...character,current_state:{...character.current_state,trifle_uses:{...trifleUses,[key]:Math.max(0,Math.min(3,value))}}});
  };
  const visible = merits.filter((item) => !item.grantedBy && !["Fae Mount","Familiar"].includes(item.name));
  return (
    <div className="expanded-merit-list">
      {visible.map((item, itemIndex) => {
        const style =
            findExpandedMerit(item.name,character?.game_line) ??
            homebrews.merits.find(
              (merit) => merit.name === item.name && merit.levels?.length,
            ),
          configured = expandedConfigurationLines(
            item.name,
            item.dots,
            item.configuration,
            locale,
          ),
          tokenItems=item.name==="Token"?decodeConfiguredRows<TokenConfigurationItem>(normalizeMeritConfiguration(item.configuration).items):[],
          cult = String(
            normalizeMeritConfiguration(item.configuration).cult ?? "",
          ),
          title = item.name === "Token"
            ? "Tokens"
            : homebrews.merits.find((merit) => merit.name === item.name)
                ?.[locale==="en-US"?"name":"translatedName"] ?? meritLabel(item,undefined,locale);
        if (!style)
          return (
            <details className="expanded-merit-card" key={`${item.name}-${itemIndex}`}>
              <summary>
                <h4>{title}</h4>
                <DotValue value={item.dots} />
              </summary>
              <div className="expanded-merit-body">
                {configured.length ? (
                  configured.map((line, index) => (
                    <section key={`${item.name}-configured-${index}`}>
                      <strong>{line.split(":")[0]}</strong>
                      <p>{line.slice(line.indexOf(":") + 1).trim()}</p>
                      {tokenItems[index]?.kind==="trifle"&&<TrifleUseTrack used={Number(trifleUses[`trifle:${item.instanceId??itemIndex}:${tokenItems[index].id||index}`]??0)} onChange={(value)=>setTrifleUses(`trifle:${item.instanceId??itemIndex}:${tokenItems[index].id||index}`,value)}/>}
                    </section>
                  ))
                ) : (
                  <p>
                    {tr("Consulte a descrição deste Mérito para distribuir ou usar suas características internas.","See this Merit's description to assign or use its internal traits.")}
                  </p>
                )}
              </div>
            </details>
          );
        return (
          <details className="expanded-merit-card" key={`${item.name}-${itemIndex}`}>
            <summary>
              <div>
                <h4>
                  {title}
                  {cult && !title.includes(cult) ? `: ${cult}` : ""}
                </h4>
                <small>
                  {style.source} · p. {style.page} · {tr("Pré-requisitos","Prerequisites")}:{" "}
                  {style.prerequisites || tr("Nenhum","None")}
                </small>
              </div>
              <DotValue value={item.dots} />
            </summary>
            <div className="expanded-merit-body">
              {configured.length
                ? <>{configured.map((line, index) => (
                    <section key={`${style.name}-configured-${index}`}>
                      <strong>{line.split(":")[0]}</strong>
                      <p>{line.slice(line.indexOf(":") + 1).trim()}</p>
                    </section>
                  ))}{item.name==="Hedge Duelist"&&(style.levels??[]).filter((level)=>level.rating>1&&level.rating<=item.dots).map((level,index)=><section key={`${style.name}-shared-${level.rating}-${index}`}><strong>{"•".repeat(level.rating)} {level.name}</strong><p>{level.description}</p></section>)}</>
                : (style.levels ?? [])
                    .filter((level) => level.rating <= item.dots)
                    .map((level, index) => (
                      <section key={`${style.name}-${level.rating}-${index}`}>
                        <strong>
                          {"•".repeat(level.rating)} {level.name}
                        </strong>
                        <p>{level.description}</p>
                      </section>
                    ))}
            </div>
          </details>
        );
      })}
      {!visible.length && !hasAdjacentContent && <em>{tr("Nenhum Mérito Expandido adquirido.", "No Expanded Merits purchased.")}</em>}
    </div>
  );
}

function TrifleUseTrack({used,onChange}:{used:number;onChange:(value:number)=>void}){
  const {tr}=useLanguage();
  return <div className="trifle-use-block"><span>{tr("Trifles usadas","Trifles used")}: {used}/3</span><div className="trifle-use-track" role="group" aria-label={tr(`${used} de 3 Trifles usadas`,`${used} of 3 Trifles used`)}>{Array.from({length:3},(_,index)=><button key={index} type="button" className={index<used?"used":""} onClick={()=>onChange(index<used?index:index+1)} aria-label={tr(`Definir Trifles usadas como ${index<used?index:index+1}`,`Set used Trifles to ${index<used?index:index+1}`)}/>)}</div></div>;
}

function ClarityTrack({
  maximum,
  damage,
  onChange,
}: {
  maximum: number;
  damage: ClarityDamageLevel[];
  onChange: (value: ClarityDamageLevel[]) => void;
}) {
  const { tr } = useLanguage();
  const current = Math.max(0, maximum - damage.length);
  const cycle = (index: number) => {
    const slots: Array<ClarityDamageLevel | undefined> = Array.from(
      { length: maximum },
      (_, slot) => damage[slot],
    );
    const level = slots[index];
    slots[index] =
      level === "mild" ? "severe" : level === "severe" ? undefined : "mild";
    onChange(normalizeClarityDamage(slots, maximum));
  };
  return (
    <div className="tracker-block clarity-block">
      <div
        className="health-track clarity-track"
        role="group"
        aria-label={tr(`Lucidez atual ${current} de ${maximum}`, `Current Clarity ${current} of ${maximum}`)}
      >
        {Array.from({ length: maximum }, (_, index) => {
          const level = damage[index];
          return (
            <button
              type="button"
              key={index}
              className={`health-box clarity-box ${level ?? "empty"}`}
              onClick={() => cycle(index)}
              aria-label={tr(`Caixa ${index + 1}: ${level === "mild" ? "dano leve" : level === "severe" ? "dano grave" : "vazia"}. Clique para alterar.`, `Box ${index + 1}: ${level === "mild" ? "mild damage" : level === "severe" ? "severe damage" : "empty"}. Press to change.`)}
            >
              <span aria-hidden="true" />
            </button>
          );
        })}
      </div>
      <div className="clarity-numbers" aria-hidden="true">
        {Array.from({ length: maximum }, (_, index) => (
          <span key={index}>{index === 0 ? "" : index}</span>
        ))}
      </div>
      <div className="tracker-meta">
        <span>{tr("Lucidez atual", "Current Clarity")}</span>
        <strong>
          {current} / {maximum}
        </strong>
      </div>
      <p className="tracker-help">
        <span className="legend-mark mild" />
        {tr("Leve", "Mild")} <span className="legend-mark severe" />
        {tr("Grave · as três caixas à direita podem gerar Condições de Lucidez", "Severe · the three rightmost boxes may cause Clarity Conditions")}
      </p>
    </div>
  );
}
type SelectedCondition = { id: string; persistent: boolean; instanceId?: string; animalId?: string; animalName?: string };
function ConditionManager({
  selected,
  catalog,
  onChange,
}: {
  selected: SelectedCondition[];
  catalog: typeof CHANGELING_CONDITIONS;
  onChange: (value: SelectedCondition[]) => void;
}) {
  const {locale,tr}=useLanguage();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Todas");
  const [bondedAnimal,setBondedAnimal]=useState(ANIMALS[0]?.id??"");
  const chosen = new Map(selected.map((item) => [item.id, item]));
  const bonded=selected.filter(item=>item.id==="bonded");
  const present = (item: (typeof catalog)[number]) => {
    const shared = findChangelingCondition(item.id);
    return shared?.sourceCode === item.sourceCode
      ? changelingConditionPresentation(shared, locale)
      : item;
  };
  const presentedCatalog = catalog.map(present);
  const categories = [
    "Todas",
    ...Array.from(new Set(presentedCatalog.map((item) => item.category))),
  ];
  const conditionName=(item:(typeof catalog)[number])=>item.name;
  const filtered = alphabetical(presentedCatalog, conditionName,locale).filter(
    (condition) =>
      (category === "Todas" || condition.category === category) &&
      `${condition.name} ${condition.originalName} ${condition.description} ${condition.penalty ?? ""} ${condition.sourceCode}`
      .toLocaleLowerCase(locale)
      .includes(search.toLocaleLowerCase(locale)),
  );
  const find = (id: string) =>
    presentedCatalog.find((item) => item.id === id) ??
    (findChangelingCondition(id) ? changelingConditionPresentation(findChangelingCondition(id)!, locale) : undefined) ??
    findMageCondition(id);
  return (
    <div className="condition-manager">
      <div className="selected-conditions">
        {selected.map((saved) => {
          const condition = find(saved.id);
          if (!condition) return null;
          return (
            <details
              key={saved.instanceId??`${condition.id}-${selected.indexOf(saved)}`}
              className="selected-condition"
            >
              <summary><span><strong>{conditionName(condition)}{saved.id==="bonded"?`: ${animalPresentation(ANIMALS.find(item=>item.id===saved.animalId)??ANIMALS[0],locale).name}`:""}{saved.persistent ? " [P]" : ""}</strong><small>{condition.sourceCode} · p. {condition.page}</small></span>{saved.id==="bonded"?<ConfirmAction trigger={<Button type="button" size="icon" variant="ghost" aria-label={`${tr("Remover","Remove")} ${conditionName(condition)}`}><X/></Button>} title={tr("Remover Bonded?","Remove Bonded?")} description={tr("A Condição e o animal vinculado serão removidos da ficha e da aba Companions.","The Condition and its linked animal will be removed from the sheet and the Companions tab.")} action={tr("Remover Bonded","Remove Bonded")} onConfirm={()=>onChange(selected.filter(item=>item!==saved))}/>:<Button type="button" size="icon" variant="ghost" onClick={(event)=>{event.preventDefault();event.stopPropagation();onChange(selected.filter(item=>item!==saved));}} aria-label={`${tr("Remover","Remove")} ${conditionName(condition)}`}><X/></Button>}</summary>
              <div className="selected-condition-body"><p>{condition.description}</p>{condition.penalty&&<p className="condition-penalty"><b>{tr("Efeito","Effect")}:</b> {condition.penalty}</p>}<p><b>{tr("Resolução","Resolution")}:</b> {condition.resolution??tr("Conforme a fonte indicada.","As described in the listed source.")}</p>{condition.beat&&<p><b>Beat:</b> {condition.beat}</p>}</div>
            </details>
          );
        })}
        {!selected.length && <em>{tr("Nenhuma Condição selecionada.","No Conditions selected.")}</em>}
      </div>
      <Dialog>
        <DialogTrigger asChild>
          <Button type="button" size="sm" variant="outline">
            <Plus /> {tr("Selecionar Condição","Select Condition")}
          </Button>
        </DialogTrigger>
        <DialogContent className="condition-dialog">
          <DialogHeader>
            <DialogTitle>{tr("Selecionar Condição","Select Condition")}</DialogTitle>
            <DialogDescription>
              {tr("Escolha uma Condição e marque-a como Persistente quando necessário.","Choose a Condition and mark it Persistent when needed.")}
            </DialogDescription>
          </DialogHeader>
          <div className="condition-filters">
            <label>
              <Search />
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder={tr("Buscar por nome, efeito ou fonte","Search by name, effect, or source")}
              />
            </label>
            <RuleSelect
              value={categories.includes(category) ? category : "Todas"}
              onChange={setCategory}
              options={categories.map((value) => ({ value, label: value === "Todas" ? tr("Todas", "All") : value }))}
            />
          </div>
          <div className="condition-catalog">
            {filtered.map((condition) => {
              const saved = chosen.get(condition.id);
              const isBonded=condition.id==="bonded";
              return (
                <article key={condition.id} className={saved ? "selected" : ""}>
                  <div>
                    <strong>
                      {conditionName(condition)}
                      {saved?.persistent ? " [P]" : ""}
                    </strong>
                    <small>
                      {condition.originalName !== condition.name && <>{condition.originalName} · </>}{condition.sourceCode} · p.{" "}
                      {condition.page}
                    </small>
                  </div>
                  <p>{condition.description}</p>
                  {condition.penalty && (
                    <p className="condition-penalty">
                      <b>{tr("Efeito","Effect")}:</b> {condition.penalty}
                    </p>
                  )}
                  <p>
                    <b>{tr("Resolução","Resolution")}:</b>{" "}
                    {condition.resolution ?? tr("Conforme a fonte indicada.","As described in the listed source.")}
                  </p>
                  {condition.beat && (
                    <p>
                      <b>Beat:</b> {condition.beat}
                    </p>
                  )}
                  {isBonded&&<div className="companion-form-grid"><label>{tr("Animal vinculado","Bonded animal")}<RuleSelect value={bondedAnimal} onChange={setBondedAnimal} options={ANIMALS.map(item=>animalPresentation(item,locale)).map(item=>({value:item.id,label:item.name}))}/></label></div>}
                  {!isBonded&&<label className="persistent-toggle">
                    <input
                      type="checkbox"
                      checked={
                        saved?.persistent ?? condition.persistent ?? false
                      }
                      onChange={(event) => {
                        const persistent = event.target.checked;
                        onChange(
                          saved
                            ? selected.map((item) =>
                                item.id === condition.id
                                  ? { ...item, persistent }
                                  : item,
                              )
                            : [...selected, { id: condition.id, persistent }],
                        );
                      }}
                    />{" "}
                    {tr("Persistente","Persistent")} [P]
                  </label>}
                  <Button
                    type="button"
                    size="sm"
                    variant={saved&&!isBonded ? "ghost" : "outline"}
                    onClick={() =>
                      onChange(
                        saved&&!isBonded
                          ? selected.filter((item) => item.id !== condition.id)
                          : [
                              ...selected,
                              {
                                id: condition.id,
                                persistent: condition.persistent ?? false,
                                instanceId: crypto.randomUUID(),
                                ...(isBonded?{animalId:bondedAnimal,animalName:""}:{}),
                              },
                            ],
                      )
                    }
                  >
                    {saved&&!isBonded ? tr("Remover","Remove") : isBonded&&bonded.length?tr("Adicionar outro","Add another"):tr("Adicionar","Add")}
                  </Button>
                </article>
              );
            })}
            {!filtered.length && <em>{tr("Nenhuma Condição encontrada.","No Conditions found.")}</em>}
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button">{tr("Concluir","Done")}</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
function MageWisdomSection({wisdom,gnosis,inuredSpells,available,locale,onAdd,onRemove,onHubris}:{wisdom:number;gnosis:number;inuredSpells:Array<Record<string,unknown>>;available:Array<{id:string;name:string;category:string;description:string;meta:string}>;locale:Locale;onAdd:(id:string)=>void;onRemove:(id:string)=>void;onHubris:(id:"megalomaniacal"|"rampant",persistent:boolean)=>void}) {
  const {tr}=useLanguage();
  const [open,setOpen]=useState(false),[failed,setFailed]=useState(false),[condition,setCondition]=useState<"megalomaniacal"|"rampant">("megalomaniacal"),[persistent,setPersistent]=useState(false);
  const close=()=>{setOpen(false);setFailed(false);setPersistent(false);};
  return <div className="wisdom-sheet-section">
    <div className="wisdom-heading-row"><SheetHeading>Sabedoria</SheetHeading><Button type="button" size="sm" variant="outline" className="builder-add-action" onClick={()=>setOpen(true)}>Hubris</Button></div>
    <div className="wisdom-track"><DotValue value={wisdom} max={10} singleRow/></div>
    <div className="inured-heading-row"><strong>{tr("Feitiços Inured","Inured Spells")} ({inuredSpells.length}/{gnosis})</strong>{inuredSpells.length<gnosis&&<ExperiencePowerPicker kind="Feitiço" items={available} selectedId="" onSelect={onAdd} compact/>}</div>
    <small>{tr("Após perder Sabedoria pelo uso de uma magia, ela pode ser Inured: usos futuros não causam essa perda, mas sempre provocam um risco básico de Paradoxo de dois dados. MtA, p. 88.","After losing Wisdom from using a spell, it may be Inured: future uses do not cause that loss, but always provoke a base two-die Paradox risk. MtA, p. 88.")}</small>
    <div className="inured-spell-list">{inuredSpells.map(item=><div key={String(item.id)}><span>{String(locale==="en-US"?item.originalName??item.name:item.name??item.originalName)}</span><Button type="button" variant="ghost" size="sm" className="compact-remove-action" onClick={()=>onRemove(String(item.id))}><Trash2/> {tr("Remover","Remove")}</Button></div>)}</div>
    <Dialog open={open} onOpenChange={value=>{setOpen(value);if(!value){setFailed(false);setPersistent(false);}}}><DialogContent><DialogHeader><DialogTitle>{tr("Ato de Hubris","Act of Hubris")}</DialogTitle><DialogDescription>{failed?tr("Escolha a Condição causada pela falha.","Choose the Condition caused by the failure."):tr("Qual foi o resultado do teste?","What was the result of the roll?")}</DialogDescription></DialogHeader>{failed?<div className="hubris-dialog-options"><label>{tr("Condição","Condition")}<RuleSelect value={condition} onChange={value=>setCondition(value as typeof condition)} options={[{value:"megalomaniacal",label:"Megalomaniacal"},{value:"rampant",label:"Rampant"}]}/></label><label className="hubris-persistent"><input type="checkbox" checked={persistent} onChange={event=>setPersistent(event.target.checked)}/><span>{tr("Persistente","Persistent")}</span></label></div>:<div className="dialog-choice-actions"><Button type="button" variant="outline" onClick={close}>{tr("Sucesso","Success")}</Button><Button type="button" variant="destructive" onClick={()=>setFailed(true)}>{tr("Falha","Failure")}</Button></div>}<DialogFooter>{failed&&<Button type="button" onClick={()=>{onHubris(condition,persistent);close();}}>{tr("Aplicar Condição","Apply Condition")}</Button>}</DialogFooter></DialogContent></Dialog>
  </div>;
}

function NotesArea({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const {tr}=useLanguage();
  return (
    <div className="notes-area">
      <Textarea
        key={value}
        defaultValue={value}
        onBlur={(event) => onChange(event.target.value)}
        placeholder={tr("Escreva livremente suas anotações...","Write your notes freely...")}
        aria-label={tr("Anotações da ficha","Character notes")}
      />
      <small>{tr("Salvo automaticamente ao sair do campo.","Saved automatically when leaving the field.")}</small>
    </div>
  );
}
function GoblinDebtTrack({
  value,
  onChange,
}: {
  value: number;
  onChange: (value: number) => void;
}) {
  const {tr}=useLanguage();
  return (
    <div className="goblin-debt-block">
      <h4>{tr("Débito Goblin","Goblin Debt")}</h4>
      <div
        className="goblin-debt-track"
        role="group"
        aria-label={tr(`Débito Goblin: ${value} de 9`,`Goblin Debt: ${value} of 9`)}
      >
        {Array.from({ length: 9 }, (_, index) => (
          <button
            type="button"
            key={index}
            className={index < value ? "filled" : ""}
            onClick={() => onChange(index < value ? index : index + 1)}
            aria-label={tr(`Definir Débito Goblin como ${index < value ? index : index + 1}`,`Set Goblin Debt to ${index < value ? index : index + 1}`)}
          />
        ))}
      </div>
      <p>
        {value}/9 · {tr("ao receber o décimo ponto, o personagem adquire a Condição Habitante da Sebe.","upon receiving the tenth point, the character gains the Hedge Denizen Condition.")}
      </p>
    </div>
  );
}
function ResourceTrack({
  label,
  current,
  maximum,
  onChange,
  storedCurrent,
  storedMaximum,
  onStoredChange,
}: {
  label: string;
  current: number;
  maximum: number;
  onChange: (value: number) => void;
  storedCurrent?: number;
  storedMaximum?: number;
  onStoredChange?: (value:number)=>void;
}) {
  const {locale,tr}=useLanguage();
  const displayLabel=systemTerm(label,locale);
  return (
    <div className="tracker-block">
      <div
        className="resource-track"
        role="group"
        data-label={displayLabel}
        aria-label={tr(`${displayLabel}: ${current} de ${maximum}`,`${displayLabel}: ${current} of ${maximum}`)}
      >
        {Array.from({ length: maximum }, (_, index) => (
          <button
            type="button"
            key={index}
            className={index < current ? "filled" : ""}
            onClick={() => onChange(index < current ? index : index + 1)}
            aria-label={tr(`Definir ${displayLabel} como ${index < current ? index : index + 1}`,`Set ${displayLabel} to ${index < current ? index : index + 1}`)}
          />
        ))}
        {storedCurrent!==undefined&&storedMaximum!==undefined&&onStoredChange&&Array.from({length:storedMaximum},(_,index)=><button type="button" key={`stored-${index}`} className={`stored-glamour-dot${index<storedCurrent?" filled":""}`} onClick={()=>onStoredChange(index<storedCurrent?index:index+1)} aria-label={tr(`Definir Glamour armazenado como ${index<storedCurrent?index:index+1}`,`Set Stored Glamour to ${index<storedCurrent?index:index+1}`)}/>)}
      </div>
      <div className="tracker-meta">
        <span>{tr("Atual","Current")}</span>
        <strong>
          {current} / {maximum}
        </strong>
      </div>
    </div>
  );
}
function PowerResource({
  name,
  rating,
  resourceName,
  current,
  maximum,
  perTurn,
  onChange,
  summary,
  storedCurrent,
  storedMaximum,
  onStoredChange,
}: {
  name: string;
  rating: number;
  resourceName: string;
  current: number;
  maximum: number;
  perTurn: number;
  onChange: (value: number) => void;
  summary?: string;
  storedCurrent?: number;
  storedMaximum?: number;
  onStoredChange?: (value:number)=>void;
}) {
  const {locale,tr}=useLanguage();
  return (
    <div className="power-resource">
      <div className="power-rating power-rating-summary" tabIndex={summary ? 0 : undefined} title={summary} aria-label={summary} data-tooltip={summary}>
        <span>{systemTerm(name,locale)}</span>
        <DotValue value={rating} max={10} />
      </div>
      <ResourceTrack
        label={resourceName}
        current={current}
        maximum={maximum}
        onChange={onChange}
        storedCurrent={storedCurrent}
        storedMaximum={storedMaximum}
        onStoredChange={onStoredChange}
      />
      <p className="tracker-help">
        {tr(`${resourceName} máximo:`,`${systemTerm(resourceName,locale)} maximum:`)} <strong>{maximum}</strong>{storedCurrent!==undefined&&<> · {tr("Glamour armazenado:","Stored Glamour:")} <strong>{storedCurrent}</strong></>} · {tr("gasto por turno:","spent per turn:")}{" "}
        <strong>{perTurn}</strong>
      </p>
    </div>
  );
}
function FrailtyList({ values, onChange }: { values: string[]; onChange: (value: string[]) => void }) {
  const { locale, tr } = useLanguage();
  return (
    <div className="editable-lines frailty-lines">
      {values.map((value, index) => (
        <div className="editable-line-row" key={index}>
          <Input
            value={index === 0 ? systemTerm(value, locale) : value}
            readOnly={index === 0}
            aria-label={index === 0 ? tr("Fragilidade obrigatória: Ferro Frio", "Mandatory Frailty: Cold Iron") : tr(`Fragilidade de Fado ${index * 2}`, `Wyrd ${index * 2} Frailty`)}
            placeholder={index === 0 ? undefined : tr(`Fragilidade de Fado ${index * 2}`, `Wyrd ${index * 2} Frailty`)}
            onChange={(event) => {
              const next = [...values];
              next[index] = event.target.value;
              onChange(next);
            }}
          />
        </div>
      ))}
    </div>
  );
}
function damageLabel(value: DamageLevel | undefined) {
  return value === "bashing"
    ? "dano de contusão"
    : value === "lethal"
      ? "dano letal"
      : value === "aggravated"
        ? "dano agravado"
        : "vazia";
}
function boundedNumber(value: unknown, maximum: number, fallback: number) {
  const number = Number(value);
  return Number.isFinite(number)
    ? Math.max(0, Math.min(maximum, Math.trunc(number)))
    : fallback;
}
function LineList({ items }: { items: string[] }) {
  return (
    <div className="official-lines">
      {items.filter(Boolean).map((item, index) => (
        <div key={`${item}-${index}`}>{item}</div>
      ))}
      {!items.filter(Boolean).length && <div>&nbsp;</div>}
    </div>
  );
}
function NimbusEditor({
  wisdom,
  gnosis,
  values,
  effects,
  onChange,
  onEffectsChange,
}: {
  wisdom:number;
  gnosis:number;
  values:string[];
  effects:Array<{trait:string;modifier:number}>;
  onChange:(value:string[])=>void;
  onEffectsChange:(value:Array<{trait:string;modifier:number}>)=>void;
}) {
  const {locale,tr}=useLanguage();
  const descriptions=[...values.slice(0,3)];
  while(descriptions.length<3) descriptions.push("");
  const connection=mageNimbusConnection(wisdom);
  const connectionLabel=connection==="Strong"?tr("Forte","Strong"):connection==="Medium"?tr("Média","Medium"):tr("Fraca","Weak");
  const budget=mageNimbusTiltBudget(gnosis);
  const allocated=effects.reduce((total,item)=>total+Math.abs(item.modifier),0);
  const traits=[...Object.values(ATTRIBUTES).flat(),...Object.values(SKILLS).flat()];
  const setDescription=(index:number,value:string)=>{const next=[...descriptions];next[index]=value;onChange(next);};
  const updateEffect=(index:number,patch:Partial<{trait:string;modifier:number}>)=>onEffectsChange(effects.map((item,itemIndex)=>itemIndex===index?{...item,...patch}:item));
  const unused=traits.filter(trait=>!effects.some(item=>item.trait===trait));
  return <div className="nimbus-editor">
    <article>
      <header><strong>{tr("Nimbus de Longo Prazo","Long-Term Nimbus")}</strong><Badge variant="outline">{tr("Conexão simpática","Sympathetic connection")}: {connectionLabel}</Badge></header>
      <small>{tr("O alcance é calculado automaticamente a partir da Sabedoria.","Range is calculated automatically from Wisdom.")} · MtA, p. 89</small>
      <Input value={descriptions[0]} onChange={event=>setDescription(0,event.target.value)} placeholder={tr("Coincidências e efeitos sutis ao redor do mago","Subtle coincidences and effects surrounding the mage")}/>
    </article>
    <article>
      <header><strong>{tr("Nimbus Imediato","Immediate Nimbus")}</strong><Badge variant="outline">{allocated}/{budget} {tr("dados alocados","dice allocated")}</Badge></header>
      <small>{tr("Defina a aparência e distribua bônus ou penalidades entre Atributos e Perícias.","Define its appearance and distribute bonuses or penalties among Attributes and Skills.")} · MtA, p. 90</small>
      <Input value={descriptions[1]} onChange={event=>setDescription(1,event.target.value)} placeholder={tr("Aparência ou sensação do Nimbus e seu Tilt","Appearance or sensation of the Nimbus and its Tilt")}/>
      <div className="nimbus-effects">
        {effects.map((effect,index)=>{
          const withoutCurrent=allocated-Math.abs(effect.modifier);
          const allowed=Array.from({length:budget*2},(_,item)=>item<budget?item-budget:item-budget+1).filter(value=>withoutCurrent+Math.abs(value)<=budget);
          return <div key={`${effect.trait}-${index}`}>
            <Select value={effect.trait} onValueChange={value=>updateEffect(index,{trait:value})}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent>{traits.filter(trait=>trait===effect.trait||!effects.some((item,itemIndex)=>itemIndex!==index&&item.trait===trait)).map(trait=><SelectItem key={trait} value={trait}>{systemTerm(trait,locale)}</SelectItem>)}</SelectContent></Select>
            <Select value={String(effect.modifier)} onValueChange={value=>updateEffect(index,{modifier:Number(value)})}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent>{allowed.map(value=><SelectItem key={value} value={String(value)}>{value>0?`+${value}`:value}</SelectItem>)}</SelectContent></Select>
            <Button type="button" variant="ghost" size="sm" className="compact-remove-action" onClick={()=>onEffectsChange(effects.filter((_,itemIndex)=>itemIndex!==index))}><Trash2/> {tr("Remover","Remove")}</Button>
          </div>;
        })}
        {allocated<budget&&unused.length>0&&<Button type="button" variant="outline" size="sm" className="builder-add-action" onClick={()=>onEffectsChange([...effects,{trait:unused[0],modifier:1}])}><Plus/> {tr("Adicionar efeito","Add effect")}</Button>}
      </div>
    </article>
    <article>
      <header><strong>{tr("Nimbus de Assinatura","Signature Nimbus")}</strong></header>
      <small>{tr("Descreva o resíduo identificável deixado pela magia do personagem.","Describe the recognizable residue left by the character's magic.")} · MtA, pp. 89–90</small>
      <Input value={descriptions[2]} onChange={event=>setDescription(2,event.target.value)} placeholder={tr("Descrição da assinatura mágica","Magical signature description")}/>
    </article>
  </div>;
}
function EditableList({
  values,
  minimum = 1,
  maximum,
  firstPrefix,
  placeholder,
  onChange,
}: {
  values: string[];
  minimum?: number;
  maximum?: number;
  firstPrefix?: string;
  placeholder: string;
  onChange: (value: string[]) => void;
}) {
  const {tr}=useLanguage();
  const rows =
    maximum === undefined ? [...values] : [...values].slice(0, maximum);
  while (rows.length < minimum) rows.push("");
  const removable = rows.length > minimum;
  return (
    <div className="editable-lines">
      {rows.map((value, index) => (
        <div className="editable-line-row" key={index}>
          {index === 0 && firstPrefix && <strong className="editable-line-prefix">{firstPrefix}</strong>}
          <Input
            value={value}
            placeholder={placeholder}
            onChange={(event) => {
              const next = [...rows];
              next[index] = event.target.value;
              onChange(next);
            }}
          />
          {removable && (
            <Button
              type="button"
              size="icon"
              variant="ghost"
              aria-label={`${tr("Remover linha", "Remove row")} ${index + 1}`}
              onClick={() =>
                onChange(rows.filter((_, itemIndex) => itemIndex !== index))
              }
            >
              <Trash2 />
            </Button>
          )}
        </div>
      ))}
      {(!maximum || rows.length < maximum) && (
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={() => onChange([...rows, ""])}
        >
          <Plus /> {tr("Adicionar linha", "Add row")}
        </Button>
      )}
    </div>
  );
}
function updateLineData(
  updateSheet: (sheet: CharacterSheet) => void,
  character: CharacterSheet,
  key: string,
  value: string[],
) {
  const next = structuredClone(character);
  next.line_data = { ...next.line_data, [key]: value };
  updateSheet(next);
}
const ARCANA_PT: Record<string, string> = {
  Death: "Morte",
  Fate: "Destino",
  Forces: "Forças",
  Life: "Vida",
  Matter: "Matéria",
  Mind: "Mente",
  Prime: "Primórdio",
  Space: "Espaço",
  Spirit: "Espírito",
  Time: "Tempo",
  Morte: "Morte",
  Destino: "Destino",
  Forças: "Forças",
  Vida: "Vida",
  Matéria: "Matéria",
  Mente: "Mente",
  Primórdio: "Primórdio",
  Espaço: "Espaço",
  Espírito: "Espírito",
  Tempo: "Tempo",
};
const LESSER_ATTAINMENTS: Record<string, [string, string, string, string]> = {
  Death: [
    "Olhos dos Mortos",
    "Percebe fantasmas, almas e fenômenos do Crepúsculo com a Visão da Morte; com Mana, pode interagir com eles pela cena.",
    "Eyes of the Dead",
    "Perceive ghosts, souls, and Twilight phenomena with Death Sight; by spending Mana, interact with them for the scene.",
  ],
  Fate: [
    "Duração Condicional",
    "Acrescenta a um feitiço uma condição de encerramento que amplia sua Duração.",
    "Conditional Duration",
    "Add a termination condition to a spell to extend its Duration.",
  ],
  Forces: [
    "Força Precisa",
    "Otimiza a aplicação deliberada de força contra objetos ou alvos imóveis.",
    "Precise Force",
    "Optimize the deliberate application of force against objects or stationary targets.",
  ],
  Life: [
    "Restauração Aprimorada do Padrão",
    "Cura dano com Mana de modo mais eficiente e reduz efeitos derivados do Esfolamento de Atributos Físicos.",
    "Improved Pattern Restoration",
    "Heal damage more efficiently with Mana and reduce effects caused by Pattern scouring Physical Attributes.",
  ],
  Matter: [
    "Permanência",
    "Permite pagar Mana, em vez de Alcance, para aplicar Duração Avançada a feitiços cujo Arcano mais alto seja Matéria.",
    "Permanence",
    "Spend Mana instead of Reach to apply Advanced Duration when Matter is the spell's highest Arcanum.",
  ],
  Mind: [
    "Olho da Mente",
    "Percebe Goetia, entidades Astrais e projeções no Crepúsculo; com Mana, pode interagir com elas pela cena.",
    "Mind's Eye",
    "Perceive Goetia, Astral entities, and projections in Twilight; by spending Mana, interact with them for the scene.",
  ],
  Prime: [
    "Contramágica Universal",
    "Permite usar Contramágica contra qualquer feitiço Desperto usando Gnose + Primórdio.",
    "Universal Counterspell",
    "Use Counterspell against any Awakened spell with Gnosis + Prime.",
  ],
  Space: [
    "Alcance Simpático",
    "Permite conjurar à distância por uma conexão simpática, um Yantra apropriado e Mana.",
    "Sympathetic Range",
    "Cast at a distance through a sympathetic connection, an appropriate Yantra, and Mana.",
  ],
  Spirit: [
    "Olhos do Espírito",
    "Percebe espíritos e fenômenos do Crepúsculo espiritual; com Mana, pode interagir com eles pela cena.",
    "Spirit Eyes",
    "Perceive spirits and spiritual Twilight phenomena; by spending Mana, interact with them for the scene.",
  ],
  Time: [
    "Simpatia Temporal",
    "Permite lançar determinados feitiços de Tempo sobre o passado de um alvo atual.",
    "Temporal Sympathy",
    "Cast certain Time spells upon the past of a present target.",
  ],
};
const GREATER_ATTAINMENTS: Record<string, [string, string, string, string]> = {
  Death: [
    "Alma Inviolável",
    "Pode repelir reflexivamente poderes que afetem sua alma, Nimbus, aura ou tentem possuí-lo.",
    "Inviolate Soul",
    "Reflexively repel powers that affect the soul, Nimbus, or aura, or that attempt possession.",
  ],
  Fate: [
    "Destino Desimpedido",
    "Pode repelir juramentos, compulsões e alterações sobrenaturais impostas ao próprio destino.",
    "Unfettered Fate",
    "Repel oaths, compulsions, and supernatural alterations imposed on your fate.",
  ],
  Forces: [
    "Imunidade Ambiental",
    "Com Mana, ignora Inclinações Ambientais e Ambientes Extremos pela cena.",
    "Environmental Immunity",
    "Spend Mana to ignore Environmental Tilts and Extreme Environments for the scene.",
  ],
  Life: [
    "Autonomia Corporal",
    "Pode repelir reflexivamente poderes que alterem ou firam seu corpo ou imponham Inclinações Pessoais.",
    "Body Autonomy",
    "Reflexively repel powers that alter or harm the body or impose Personal Tilts.",
  ],
  Matter: [
    "Controle de Durabilidade",
    "Com Mana e toque, aumenta ou reduz a Durabilidade de um objeto pelos pontos em Matéria.",
    "Durability Control",
    "Spend Mana and touch an object to raise or lower its Durability by Matter dots.",
  ],
  Mind: [
    "Salto Intuitivo",
    "Com Mana, transforma três ou mais sucessos em teste Mental ou Social num sucesso excepcional.",
    "Intuitive Leap",
    "Spend Mana to turn three or more successes on a Mental or Social roll into an exceptional success.",
  ],
  Prime: [
    "Imbuir Item",
    "Permite criar um Item Imbuído com um feitiço que o mago saiba conjurar.",
    "Imbue Item",
    "Create an Imbued Item with a spell the mage can cast.",
  ],
  Space: [
    "Onipresença",
    "Permite pagar Mana, em vez de Alcance, para aplicar Escala Avançada.",
    "Omnipresence",
    "Spend Mana instead of Reach to apply Advanced Scale.",
  ],
  Spirit: [
    "Posto Honorário",
    "Espíritos reconhecem um Posto honorário igual a Espírito, com benefícios sociais e ofensivos.",
    "Honorary Rank",
    "Spirits recognize an honorary Rank equal to Spirit, with social and offensive benefits.",
  ],
  Time: [
    "Tempo numa Garrafa",
    "Permite pagar Mana, em vez de Alcance, para usar tempo de conjuração instantâneo.",
    "Time in a Bottle",
    "Spend Mana instead of Reach to use instant casting time.",
  ],
};
function MageAttainmentList({ arcana }: { arcana: Record<string, number> }) {
  const {locale,tr}=useLanguage();
  const owned = (minimum: number) =>
    Object.entries(arcana)
      .filter(([, dots]) => Number(dots) >= minimum)
      .map(([name]) => locale==="en-US"?systemTerm(name,locale):ARCANA_PT[name] ?? name);
  const rows: Array<{ name: string; arcana: string[]; description: string }> =
    [];
  const one = owned(1),
    two = owned(2),
    three = owned(3),
    five = owned(5);
  if (one.length)
    rows.push({
      name: tr("Contramágica","Counterspell"),
      arcana: one,
      description:
        tr("Desfaz a Imago de um feitiço observado com Visão Mágica Ativa por meio de um Confronto de Vontades.","Unravel the Imago of a spell observed with Active Mage Sight through a Clash of Wills."),
    });
  for (const [name, dots] of Object.entries(arcana)) {
    if (Number(dots) >= 2 && LESSER_ATTAINMENTS[name])
      rows.push({
        name: LESSER_ATTAINMENTS[name][locale==="en-US"?2:0],
        arcana: [locale==="en-US"?systemTerm(name,locale):ARCANA_PT[name] ?? name],
        description: LESSER_ATTAINMENTS[name][locale==="en-US"?3:1],
      });
  }
  if (two.length)
    rows.push({
      name: tr("Armadura do Mago","Mage Armor"),
      arcana: two,
      description:
        tr("Ativa uma proteção correspondente a um dos Arcanos dominados; somente uma forma pode permanecer ativa por vez.","Activate protection corresponding to a mastered Arcanum; only one form may remain active at a time."),
    });
  if (three.length)
    rows.push({
      name: tr("Invocação Direcionada","Targeted Summoning"),
      arcana: three,
      description:
        tr("Ao invocar um ser Superno, permite especificar um segundo Arcano para refinar o alvo da invocação.","When summoning a Supernal being, specify a second Arcanum to refine the target."),
    });
  for (const [name, dots] of Object.entries(arcana)) {
    if (Number(dots) >= 4 && GREATER_ATTAINMENTS[name])
      rows.push({
        name: GREATER_ATTAINMENTS[name][locale==="en-US"?2:0],
        arcana: [locale==="en-US"?systemTerm(name,locale):ARCANA_PT[name] ?? name],
        description: GREATER_ATTAINMENTS[name][locale==="en-US"?3:1],
      });
  }
  if (five.length)
    rows.push({
      name: tr("Criar Rota","Create Rote"),
      arcana: five,
      description:
        tr("Permite codificar como Rota um feitiço cujos Arcanos tenham sido dominados.","Encode as a Rote a spell whose Arcana have been mastered."),
    });
  return (
    <div className="mage-attainment-list">
      {rows.map((row) => (
        <div
          key={`${row.name}-${row.arcana.join("-")}`}
          title={row.description}
        >
          <strong>
            {row.name} ({row.arcana.join(", ")})
          </strong>
          <small>{row.description}</small>
        </div>
      ))}
      {!rows.length && <em>{tr("Nenhum Attainment adquirido.","No Attainments acquired.")}</em>}
    </div>
  );
}
function SpellColumn({
  items,
  showSkill = false,
  minimumRows = 0,
  onRemove,
}: {
  items: Array<Record<string, unknown>>;
  showSkill?: boolean;
  minimumRows?: number;
  onRemove?: (item:Record<string,unknown>)=>void;
}) {
  const {locale,tr}=useLanguage();
  const arcanaSource=(item:Record<string,unknown>)=>`${Object.entries((item.requirements??{}) as Record<string,number>).map(([name,dots])=>`${systemTerm(name,locale)} ${"•".repeat(dots)}`).join(" + ")} · ${String(item.source??"")} · p. ${String(item.page??"—")}`;
  return (
    <div className="mage-spell-lines">
      {items.map((item, index) => (
        <details className="contract-power-card"
          key={`${String(item.id ?? item.name)}-${index}`}
        >
          <summary className="contract-power-summary"><strong>{String(locale==="en-US"?item.originalName??item.name:item.name??item.originalName??"")}</strong>{onRemove&&<Button type="button" variant="ghost" size="sm" className="compact-remove-action" onClick={event=>{event.preventDefault();event.stopPropagation();onRemove(item);}}><Trash2/> {tr("Remover","Remove")}</Button>}<small>{arcanaSource(item)}</small><span className="spell-card-rule-line"><strong>{tr("Prática","Practice")}:</strong> {String(item.practice??"")} | <strong>{tr("Fator Primário","Primary Factor")}:</strong> {String(item.primaryFactor??"")}</span>{Boolean(item.withstand)&&<span className="spell-card-rule-line"><strong>{tr("Resistência","Withstand")}:</strong> {String(item.withstand)}</span>}{showSkill&&Boolean(item.roteSkill)&&<span className="spell-card-rule-line"><strong>{tr("Perícia de Rota","Rote Skill")}:</strong> {systemTerm(String(item.roteSkill),locale)}</span>}</summary>
          <div className="contract-power-details"><p><strong>{tr("Resumo","Summary")}:</strong> {spellItemSummary(item)}</p>{spellItemReach(item)&&<p><strong>{tr("Alcance","Reach")}:</strong> {spellItemReach(item)}</p>}</div>
        </details>
      ))}
      {Array.from({length:Math.max(0,minimumRows-items.length)},(_,index)=><div className="mage-spell-empty" key={`empty-${index}`} aria-label={tr("Linha de Práxis disponível","Available Praxis slot")}>&nbsp;</div>)}
      {!items.length&&!minimumRows && <em>{tr("Nenhum registro.","No entries.")}</em>}
    </div>
  );
}
function MeritSheetList({
  character,
  merits,
  line,
  updateSheet,
}: {
  character: CharacterSheet;
  merits: CharacterSheet["merits"];
  line: "CtL" | "MtA";
  updateSheet: (sheet: CharacterSheet) => void;
}) {
  const {locale,tr}=useLanguage();
  const homebrews = useHomebrews();
  const catalog = [
      ...getMeritsForLine(line),
      ...homebrews.merits.filter(
        (item) => item.line === "Core" || item.line === line,
      ),
    ],
    visible = merits.filter(
      (item) =>
        !item.grantedBy ||
        (line === "CtL" && item.grantedBy === "Corte") ||
        (line === "MtA" && item.grantedBy === "Ordem"),
    );
  return (
    <div className="sheet-merits single-column">
      {visible.length ? (
        visible.map((item, index) => {
          const definition = catalog.find((entry) => entry.name === item.name);
          const tooltip = definition
            ? `${definition.prerequisites ? `${tr("Pré-requisitos", "Prerequisites")}: ${definition.prerequisites}\n` : ""}${definition.description}`
            : item.source;
          const inline = isInlineMeritConfiguration(item.name);
          const meritIndex = character.merits.indexOf(item);
          const inlineField = inline ? findMeritConfiguration(item.name)?.fields[0] : undefined;
          const configuration = normalizeMeritConfiguration(item.configuration);
          const displayName = definition ? definition[locale === "en-US" ? "name" : "translatedName"] : item.name;
          return (
            <div className={`sheet-merit-row${inline ? " has-inline-config" : ""}`} key={`${item.name}-${index}`} title={inline ? undefined : tooltip}>
              <div className="sheet-merit-main">
                <span>{inline ? `${displayName}:` : meritLabel(item,line,locale)}</span>
                {inlineField && <Input className="inline-merit-input" aria-label={`${displayName}: ${tr("descrição", "description")}`} value={String(configuration[inlineField.key] ?? "")} placeholder={tr("Escreva aqui", "Type here")} onChange={(event) => {
                  const next=structuredClone(character);
                  const target=next.merits[meritIndex];
                  if(target) target.configuration={...configuration,[inlineField.key]:event.target.value};
                  updateSheet(synchronizeMeritGrants(next));
                }} />}
                <DotValue value={item.dots} max={Math.max(5, item.dots)} />
              </div>
            </div>
          );
        })
      ) : (
        <em>{tr("Nenhum Mérito selecionado","No Merit selected")}</em>
      )}
    </div>
  );
}
function ContractSheetList({
  contracts,
  seeming,
}: {
  contracts: Array<Record<string, unknown>>;
  seeming: string;
}) {
  const {locale,tr}=useLanguage();
  const homebrews=useHomebrews();
  return (
    <div className="official-lines">
      {contracts
        .filter((item) => item.name)
        .map((item, index) => {
          const found = findContract(String(item.id ?? item.name ?? ""));
          const definition = found ? contractPresentation(contractWithSupplementalBenefits(found,isHomebrewActive(homebrews,"h-seemings")?["h-seemings"]:[]),locale) : undefined;
          const description =
            definition?.description ?? String(item.description ?? "");
          const dicePool =
            definition?.dicePool ?? String(item.dicePool ?? "Não informada");
          const benefit =
            definition?.seemingBenefits?.[
              seeming as keyof typeof definition.seemingBenefits
            ];
          return (
            <div
              key={`${String(item.name)}-${index}`}
              title={`${description}\n${tr("Parada de dados", "Dice Pool")}: ${dicePool}\n${tr("Brecha", "Loophole")}: ${definition?.loophole ?? tr("Não informada", "Not listed")}${benefit ? `\n${tr("Benefício de", "Benefit for")} ${seemingDisplayName(seeming,locale)}: ${benefit}` : ""}`}
            >
              <span>{String(locale==="en-US"?(definition?.originalName??item.originalName??item.name):(definition?.name??item.name))}</span>
              <small>
                {systemTerm(definition?.regalia ?? String(item.regalia ?? ""),locale)} ·{" "}
                {definition?.type ??
                  String(item.type ?? (index < 4 ? "Comum" : "Real"))}
              </small>
            </div>
          );
        })}
      {!contracts.some((item) => item.name) && <div>&nbsp;</div>}
    </div>
  );
}
function ContractPowerList({
  contracts,
  seeming,
  court,
  extraBenefits = [],
  extraClauses = [],
}: {
  contracts: Array<Record<string, unknown>>;
  seeming: string;
  court: string;
  extraBenefits?: Array<Record<string, unknown>>;
  extraClauses?: Array<Record<string, unknown>>;
}) {
  const {locale,tr}=useLanguage();
  const homebrews=useHomebrews();
  return (
    <div className="contract-power-list">
      {contracts
        .filter((item) => item.name)
        .map((item, index) => {
          const baseDefinition =
            findContract(String(item.id ?? item.name ?? "")) ??
            (item as unknown as ContractDefinition);
          const definition=contractPresentation(contractWithSupplementalBenefits(baseDefinition,isHomebrewActive(homebrews,"h-seemings")?["h-seemings"]:[]),locale);
          const summary=contractSummary(baseDefinition,locale);
          if (!definition?.id) return null;
          const benefits = [
            seeming,
            ...extraBenefits
              .filter((extra) => String(extra.contractId) === definition.id)
              .map((extra) => String(extra.seeming)),
          ]
            .filter(
              (value, item, array) => value && array.indexOf(value) === item,
            )
            .map((key) => ({
              key,
              text: definition.seemingBenefits?.[
                key as keyof typeof definition.seemingBenefits
              ],
            }))
            .filter((item) => item.text);
          const courtBenefit = (
            definition as ContractDefinition & {
              courtBenefits?: Record<string, string>;
            }
          ).courtBenefits?.[court];
          const clauseCourtIds = [
            courtCanonicalId(court),
            ...extraClauses.filter((extra) => String(extra.contractId) === definition.id).map((extra) => String(extra.courtId)),
          ].filter((value, position, values) => value && values.indexOf(value) === position);
          const clauses = clauseCourtIds.map((courtId) => ({ courtId, text: definition.courtClauses?.[courtId] })).filter((item) => item.text);
          const displayOptions = contractDisplayOptions(definition, locale);
          const outcomeSections = contractOutcomeSections(definition, locale);
          const details = <dl>
                {summary && <div>
                  <dt>{tr("Resumo", "Summary")}</dt>
                  <dd>{summary}</dd>
                </div>}
                {contractHasInvocationRoll(definition) === true && <div>
                  <dt>{tr("Parada de dados", "Dice Pool")}</dt>
                  <dd>{definition.dicePool ?? tr("Não informada", "Not listed")}</dd>
                </div>}
                <div>
                  <dt>{tr("Custo", "Cost")}</dt>
                  <dd>{definition.cost ?? tr("Conforme descrição", "As described")}</dd>
                </div>
                <div>
                  <dt>{tr("Ação / Duração","Action / Duration")}</dt>
                  <dd>
                    {definition.action ?? tr("Instantânea", "Instant")} ·{" "}
                    {definition.duration ?? tr("Cena", "Scene")}
                  </dd>
                </div>
                {outcomeSections.slice(0, 1).map((section) => (
                  <div key={section.label}>
                    <dt>{section.label}</dt>
                    <dd>{section.text}</dd>
                  </div>
                ))}
                {displayOptions.length > 0 && (
                  <div className="contract-options">
                    <dt>{tr("Opções", "Options")}</dt>
                    <dd><ul>{displayOptions.map((option) => <li key={option}>{option}</li>)}</ul></dd>
                  </div>
                )}
                {definition.detailTables?.map((table) => (
                  <div className="contract-detail-table" key={table.title}>
                    <dt>{table.title}</dt>
                    <dd><table><thead><tr>{table.columns.map((column) => <th key={column}>{column}</th>)}</tr></thead><tbody>{table.rows.map((row) => <tr key={row.join("::")}>{row.map((cell, cellIndex) => <td key={cellIndex}>{cell}</td>)}</tr>)}</tbody></table></dd>
                  </div>
                ))}
                {outcomeSections.slice(1).map((section) => (
                  <div key={section.label}>
                    <dt>{section.label}</dt>
                    <dd>{section.text}</dd>
                  </div>
                ))}
                <div>
                  <dt>{tr("Brecha","Loophole")}</dt>
                  <dd>{definition.loophole}</dd>
                </div>
                {benefits.map((benefit) => (
                  <div key={benefit.key}>
                    <dt>
                      {tr("Benefício de", "Benefit for")}{" "}
                      {seemingDisplayName(benefit.key,locale)}
                    </dt>
                    <dd>{benefit.text}</dd>
                  </div>
                ))}
                {courtBenefit && (
                  <div>
                    <dt>{tr("Benefício da Corte", "Court Benefit")} {court}</dt>
                    <dd>{courtBenefit}</dd>
                  </div>
                )}
                {clauses.map((clause) => (
                  <div key={`clause-${clause.courtId}`}>
                    <dt>Clause · {courtDisplayName(clause.courtId, locale)}</dt>
                    <dd>{clause.text}</dd>
                  </div>
                ))}
                {definition.goblin && (
                  <div className="goblin-debt-row">
                    <dt>{tr("Débito Goblin", "Goblin Debt")}</dt>
                    <dd>{definition.goblinDebt}</dd>
                  </div>
                )}
              </dl>;
          return (
            <details className="contract-power-card" key={`${definition.id}-${index}`}>
              <summary className="contract-power-summary">
                <strong>{locale==="en-US"?definition.originalName??definition.name:definition.name}</strong>
                <Badge variant={definition.goblin ? "default" : "outline"}>{definition.goblin ? "Goblin" : definition.type === "Comum" ? tr("Comum", "Common") : tr("Real", "Royal")}</Badge>
                <small>{systemTerm(definition.regalia,locale)} · {definition.source}{definition.page ? ` · p. ${definition.page}` : ""}</small>
              </summary>
              <div className="contract-power-details">{details}</div>
            </details>
          );
        })}
    </div>
  );
}
function SeemingLore({ seeming }: { seeming: string }) {
  const {locale,tr}=useLanguage();
  const definition = CTL_SEEMINGS[seeming as keyof typeof CTL_SEEMINGS];
  if (!definition)
    return <LorePanel title={tr("Feição","Seeming")} text={tr("Nenhuma Feição selecionada.","No Seeming selected.")} />;
  const page = (
    {
      Beast: 22,
      Darkling: 24,
      Elemental: 26,
      Fairest: 28,
      Ogre: 30,
      Wizened: 32,
    } as Record<string, number>
  )[seeming];
  return (
    <>
      <LorePanel
        title={tr(`Bênção de ${definition.translated}`,`${seeming} Blessing`)}
        text={locale==="en-US"?definition.blessingEn:definition.blessing}
        source={`Changeling the Lost · p. ${page}`}
      />
      <LorePanel
        title={tr(`Maldição de ${definition.translated}`,`${seeming} Curse`)}
        text={locale==="en-US"?definition.curseEn:definition.curse}
        source={`Changeling the Lost · p. ${page}`}
      />
    </>
  );
}
function KithLore({ data }: { data: Record<string, unknown> }) {
  const {locale,tr}=useLanguage();
  const definition = data.kith_custom ? undefined : findKith(data.kith);
  const presentation=data.kith_custom?undefined:kithPresentation(data.kith,locale);
  const name = data.kith_custom?kithDisplayName(data.kith,true):presentation?.name??"";
  const skill = String(presentation?.skill ?? definition?.skill ?? data.kith_skill ?? "");
  const description = String(presentation?.description ?? definition?.description ?? data.kith_description ?? "");
  const blessing = String(presentation?.blessing ?? definition?.blessing ?? data.kith_blessing ?? "");
  const source = String(definition?.source ?? data.kith_source ?? "");
  const page = Number(definition?.page ?? data.kith_page ?? 0);
  const choice=String(data.kith_choice??"").trim();
  const choiceDefinition=kithCreationChoice(definition?.id);
  const choiceLabel=choiceDefinition?(locale==="pt-BR"?choiceDefinition.labelPt:choiceDefinition.labelEn):"";
  const choiceParts=choice.split(": ");
  const displayedChoice=choiceDefinition?.kind==="skill"?systemTerm(choice,locale):choiceDefinition?.kind==="specialty"&&choiceParts.length>1?`${systemTerm(choiceParts[0],locale)}: ${choiceParts.slice(1).join(": ")}`:choice;
  if (!name)
    return (
      <LorePanel
        title={tr("Bênção da Fratria","Kith Blessing")}
        text={tr("Nenhuma Fratria selecionada.","No Kith selected.")}
      />
    );
  return (
    <LorePanel
      title={tr(`Bênção de ${name}`,`${name} Blessing`)}
      intro={data.kith_custom ? undefined : description}
      text={`${choice ? `${choiceLabel}: ${displayedChoice}. ` : ""}${skill ? `${skill}. ` : ""}${blessing || description}`}
      source={source ? `${source}${page ? ` · p. ${page}` : ""}` : undefined}
    />
  );
}
function CourtLore({
  data,
  merits,
}: {
  data: Record<string, unknown>;
  merits: CharacterSheet["merits"];
}) {
  const { locale, tr } = useLanguage();
  const raw = data.custom_court;
  const custom = raw && typeof raw === "object" ? raw as Record<string, unknown> : undefined;
  const official = custom ? undefined : courtPresentation(data.court, locale);
  if (!custom && !official) return null;
  const name = custom ? String(custom.name ?? data.court ?? "") : courtDisplayName(data.court, locale);
  const emotion = custom ? String(custom.emotion ?? "") : String(official?.emotion ?? "");
  const benefits = custom && Array.isArray(custom.mantleBenefits)
      ? custom.mantleBenefits.map(String)
      : official?.mantleBenefits ?? [],
    dots =
      merits.find(
        (item) => item.name === "Mantle" && item.grantedBy === "Corte",
      )?.dots ?? 1;
  return (
    <article className="lore-panel">
      <h4>{tr("Manto", "Mantle")}: {name}</h4>
      <small>{tr("Sentimento da Corte", "Court emotion")}: {emotion}</small>
      {benefits.slice(0, dots).map((benefit, index) => (
        <p key={index}>
          <strong>{tr("Manto", "Mantle")} {index + 1}:</strong> {benefit}
        </p>
      ))}
      {official && <small>{official.source} · p. {courtPageCitation(official)}</small>}
    </article>
  );
}
function MageOrderSummary({ data }: { data: Record<string, unknown> }) {
  const {locale,tr}=useLanguage();
  const raw = data.custom_order;
  const custom = raw && typeof raw === "object" ? raw as Record<string, unknown> : undefined;
  const orderKey = String(data.order ?? "Orderless");
  const name = orderKey === "Orderless"
    ? tr("Sem Ordem","Orderless")
    : String(custom?.name || (locale === "en-US" ? orderKey : MTA_ORDER_LABELS[orderKey] ?? orderKey));
  const description = orderKey === "Nameless" ? tr("Uma Ordem sem nome reconhecido entre as grandes sociedades dos Despertos.","An Order without a recognized name among the great societies of the Awakened.") : String(custom?.description || (MTA_ORDER_DESCRIPTIONS[orderKey]?.[locale === "pt-BR" ? 0 : 1] ?? ""));
  const skills = Array.isArray(custom?.roteSkills)
    ? custom.roteSkills.map(String).filter(Boolean)
    : [...(MTA_ORDERS[orderKey as keyof typeof MTA_ORDERS] ?? [])];
  return (
    <section className="mage-order-summary">
      <SheetHeading>Ordem</SheetHeading>
      <strong>{name}</strong>
      {description && <p>{description}</p>}
      {skills.length > 0 && <small><strong>{tr("Perícias de Rota","Rote Skills")}:</strong> {skills.map((skill)=>systemTerm(skill,locale)).join(", ")}</small>}
    </section>
  );
}
function LorePanel({
  title,
  intro,
  text,
  source,
}: {
  title: string;
  intro?: string;
  text: string;
  source?: string;
}) {
  return (
    <article className="lore-panel">
      <h4>{title}</h4>
      {intro && intro !== text && <p className="lore-intro">{intro}</p>}
      <p>{text}</p>
      {source && <small>{source}</small>}
    </article>
  );
}
function LabeledBlank({ title, lines }: { title: string; lines: number }) {
  return (
    <div className="labeled-blank">
      <h4>{title}</h4>
      <div className="blank-lines">
        {Array.from({ length: lines }, (_, index) => (
          <i key={index} />
        ))}
      </div>
    </div>
  );
}
function SpellSheetList({
  rotes,
  praxes,
}: {
  rotes: Array<Record<string, unknown>>;
  praxes: Array<Record<string, unknown>>;
}) {
  const {locale,tr}=useLanguage();
  const rows = [
    ...rotes.map((item) => ({ kind: "Rota", item })),
    ...praxes.map((item) => ({ kind: "Práxis", item })),
  ];
  return (
    <div className="official-lines">
      {rows.map(({ kind, item }, index) => (
        <div
          key={`${kind}-${String(item.id ?? item.name)}-${index}`}
          title={`${tr("Resumo", "Summary")}: ${spellItemSummary(item)}\n${tr("Parada de dados", "Dice Pool")}: ${tr("Gnose", "Gnosis")} + ${formatSpellRequirements((item.requirements ?? {}) as Record<string, number>)}\n${tr("Custo", "Cost")}: ${tr("Conforme os Alcances e efeitos aplicados", "As determined by Reach and applied effects")}\n${tr("Ação / Duração", "Action / Duration")}: ${tr("Conjuração instantânea", "Instant casting")} · ${tr("Fator Primário", "Primary Factor")}: ${String(item.primaryFactor ?? "")}\n${tr("Prática", "Practice")}: ${String(item.practice ?? "")}${item.withstand ? ` · ${tr("Resistência", "Withstand")}: ${String(item.withstand)}` : ""}`}
        >
          <span>
            {kind==="Rota"?tr("Rota","Rote"):tr("Práxis","Praxis")} · {String(locale==="en-US"?item.originalName??item.name:item.name??item.originalName??"")}
          </span>
          <small>
            {kind === "Rota" && item.roteSkill
              ? `${tr("Perícia","Skill")}: ${systemTerm(String(item.roteSkill),locale)} · `
              : ""}
            {String(item.source ?? "")} · p. {String(item.page ?? "—")}
          </small>
        </div>
      ))}
    </div>
  );
}
function spellItemSummary(item: Record<string, unknown>) {
  const current=SPELLS.find(spell=>spell.id===String(item.id??"")||spell.originalName===String(item.originalName??item.name??""));
  const reviewedSummary = String(current?.summary ?? item.summary ?? "").trim();
  if (reviewedSummary) return reviewedSummary;
  const description = String(current?.description ?? item.description ?? "").trim() ||
    "Descrição não disponível.";
  return description.match(/^.*?[.!?](?:\s|$)/)?.[0]?.trim() || description;
}
function spellItemReach(item:Record<string,unknown>){const current=SPELLS.find(spell=>spell.id===String(item.id??"")||spell.originalName===String(item.originalName??item.name??"")),description=String(current?.description??item.description??"").trim(),index=description.search(/(?:Add [A-Za-z]+\s*[•●\d]+:\s*)?\+\d+ Reach:/i);return index<0?"":description.slice(index).replace(/\s+(?=(?:Add [A-Za-z]+\s*[•●\d]+:\s*)?\+\d+ Reach:)/gi," · ");}
function selectedConditionList(value: unknown): SelectedCondition[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) =>
      typeof item === "string"
        ? {
            id: item,
            persistent: Boolean(
              findChangelingCondition(item)?.persistent ||
              findMageCondition(item)?.persistent,
            ),
          }
        : item && typeof item === "object"
          ? {
              id: String((item as Record<string, unknown>).id ?? ""),
              persistent: Boolean((item as Record<string, unknown>).persistent),
              instanceId: String((item as Record<string, unknown>).instanceId??"")||undefined,
              animalId: String((item as Record<string, unknown>).animalId??"")||undefined,
              animalName: String((item as Record<string, unknown>).animalName??"")||undefined,
            }
          : null,
    )
    .filter((item): item is SelectedCondition => Boolean(item?.id));
}
function objectList(value: unknown) {
  return Array.isArray(value) ? (value as Array<Record<string, unknown>>) : [];
}
function isExpandedMerit(name: string) {
  return (
    EXPANDED_MERIT_NAMES.has(name) ||
    [
      "Hollow",
      "Warded Dreams",
      "Dream Bastion",
      "Mantle",
      "Court Goodwill",
      "Token",
    ].includes(name)
  );
}



for (const [translated, original] of Object.entries({Morte:"Death",Destino:"Fate",Forças:"Forces",Vida:"Life",Matéria:"Matter",Mente:"Mind",Primórdio:"Prime",Espaço:"Space",Espírito:"Spirit",Tempo:"Time"})) {
  LESSER_ATTAINMENTS[translated] = LESSER_ATTAINMENTS[original];
  GREATER_ATTAINMENTS[translated] = GREATER_ATTAINMENTS[original];
}
