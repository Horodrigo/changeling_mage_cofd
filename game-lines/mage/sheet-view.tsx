"use client";
import { MeritConfigurationEditor } from "@/app/builder/merit-configuration-editor";
import { CharacterPaperShell,SheetField as CommonSheetField,EditableList,NotesArea,PowerResource,ResourceTrack,boundedNumber,updateLineData } from "@/app/workspace/character-paper-shell";
import { MainFuel, MainPowerStat, MainSheet } from "@/app/workspace/main-sheet";
import { CombatPage } from "@/app/workspace/combat-page";
import { CompanionPage as CoreCompanionPage } from "@/app/workspace/companion-page";
import { ConditionManager as CoreConditionManager, type SelectedCondition as CoreSelectedCondition } from "@/app/workspace/condition-manager";
import { ExperiencePowerPicker,derivedWithPermanentMerits } from "@/app/workspace/experience-shared";
import { formatSpellRequirements } from "./experience-shared";
import { LegacyPage } from "@/app/workspace/legacy-page";
import { MageExperiencePanel } from "./experience-panel";
import { RuleSelect } from "@/app/workspace/rule-select";
import { DotValue,HealthTrack,SheetHeading,TraitBlock,TraitLine,stringList } from "@/app/workspace/sheet-primitives";
import { SwipeableSheetTabs } from "@/app/workspace/sheet-tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog,DialogContent,DialogDescription,DialogFooter,DialogHeader,DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select,SelectContent,SelectItem,SelectTrigger,SelectValue } from "@/components/ui/select";
import { Tabs,TabsContent,TabsList,TabsTrigger } from "@/components/ui/tabs";
import { useIsMobile } from "@/hooks/use-mobile";
import type { SpellDefinition } from "@/lib/catalog/catalog-types";
import type { CharacterSheet } from "@/lib/core/character/character-types";
import { meetsArcanaRequirements } from "./builder-eligibility";
import { ATTRIBUTES, SKILLS } from "@/lib/core/character/creation-rules";
import { mageGnosisSummary, MTA_ORDERS, MTA_ORDER_DESCRIPTIONS, MTA_ORDER_LABELS, MTA_PATHS } from "./creation-rules";
import { refundMageAdvancement,type MageAdvancementUndo } from "@/lib/experience-refunds";
import type { GameLineSheetProps } from "@/lib/game-line-contracts/game-line-ui";
import { useLanguage,type Locale } from "@/lib/i18n";
import { findLegacy,normalizeLegacyState } from "@/lib/legacies";
import type { ConditionDefinition } from "@/lib/catalog/catalog-types";
import { mageNimbusConnection,mageNimbusTiltBudget,normalizeNimbusTiltEffects } from "./nimbus";
import { availableHubrisTiers, hubrisPool, wisdomState } from "./hubris";
import { expandedConfigurationLines, findMeritConfiguration, meritConfigurationTitle, MAGE_SHEET_MERIT_CONFIGURATIONS, normalizeMeritConfiguration, synchronizeMeritGrants } from "./sheet-merit-configurations";
import type { MeritDefinition } from "@/lib/merits";
import { normalizeDamage,powerResourceLimits } from "@/lib/resource-rules";
import { systemTerm } from "@/lib/system-terms";
import { createRandomId } from "@/lib/random-id";
import { Plus,Trash2 } from "lucide-react";
import { useState } from "react";
import { MageStructuredMeritEditor } from "./merit-configuration-editor";
import { CompanionPage as MageCompanionPage } from "./companion-page";
import { useMeritHomebrews } from "@/app/use-merit-homebrews";
import { mergeMeritHomebrews } from "@/lib/merit-homebrews";
import type { MageFactionDefinition } from "./factions";
export function MageCharacterPaper({ character, updateState, updateSheet, catalogs, }: GameLineSheetProps) {
    if (!catalogs)
        throw new Error("Mage sheet requires its catalog snapshot.");
    const spellCatalog = catalogs.get<readonly SpellDefinition[]>("mage-spells");
    const factionCatalog = catalogs.get<readonly MageFactionDefinition[]>("mage-factions");
    const customMerits = useMeritHomebrews("MtA", true);
    const meritCatalog = mergeMeritHomebrews([...catalogs.get<readonly MeritDefinition[]>("core-merits"), ...catalogs.get<readonly MeritDefinition[]>("mage-merits")], customMerits);
    const conditionCatalog = [
        ...catalogs.get<{ conditions: ConditionDefinition[] }>("core-reference").conditions.filter((condition) => condition.sourceCode === "CofD" || condition.sourceCode === "HL"),
        ...catalogs.get<readonly ConditionDefinition[]>("mage-reference"),
    ];
    const { locale, t } = useLanguage();
    const isMobile = useIsMobile();
    const [mobileTab, setMobileTab] = useState({ characterId: character.id, value: "resumo" });
    const [desktopTab, setDesktopTab] = useState("principal");
    const [legacyJoinOpen, setLegacyJoinOpen] = useState(false);
    const sheetTab = isMobile ? (mobileTab.characterId === character.id ? mobileTab.value : "resumo") : desktopTab;
    const setSheetTab = (value: string) => isMobile ? setMobileTab({ characterId: character.id, value }) : setDesktopTab(value);
    const isExpanded = (name: string) => meritCatalog.some((item) => item.name === name && item.levels?.length) || Boolean(findMeritConfiguration(name));
    const data = character.line_data;
    const hasCompanions = character.merits.some((item) => !item.grantedBy && item.name === "Familiar") || selectedConditionList(character.current_state?.conditions, conditionCatalog).some(item => item.id === "bonded");
    const derived = derivedWithPermanentMerits(character);
    const grantedSkillBonuses = (data.merit_granted_skill_bonuses &&
        typeof data.merit_granted_skill_bonuses === "object"
        ? data.merit_granted_skill_bonuses
        : {}) as Record<string, number>;
    const specialties = [
        ...character.specializations.map((item) => typeof item === "string" ? { skill: "", name: item } : item),
        ...Object.entries(grantedSkillBonuses)
            .filter(([, value]) => Number(value) > 0)
            .map(([skill, value]) => ({
            skill,
            name: `+${value} concedido por Mérito`,
        })),
    ];
    const effectiveSkills = Object.fromEntries(Object.entries(character.skills).map(([name, value]) => [
        name,
        Number(value) + (Number(grantedSkillBonuses[name]) || 0),
    ]));
    const canonicalSkill = (value: unknown): string | undefined => {
        const raw = String(value ?? "").trim();
        return Object.values(SKILLS).flat().find((skill) => skill === raw || systemTerm(skill, "en-US") === raw || systemTerm(skill, "pt-BR") === raw);
    };
    const highlightedSkills = new Set<string>(stringList(data.rote_skills).map(canonicalSkill).filter((skill): skill is string => Boolean(skill)));
    const skillHighlightTone = "rote" as const;
    const aspirations = stringList(data.aspirations);
    const rotes = [...objectList(data.rotes), ...objectList(data.learned_rotes)];
    const praxes = [
        ...objectList(data.praxes),
        ...objectList(data.learned_praxes),
    ];
    const arcana = (data.arcana && typeof data.arcana === "object" ? data.arcana : {}) as Record<string, number>;
    const gnosis = Number(data.gnosis ?? 1);
    const availablePraxes = spellCatalog
        .filter(spell => meetsArcanaRequirements(spell.requirements, arcana) && !praxes.some(item => String(item.id) === spell.id))
        .map(spell => ({ id: spell.id, name: locale === "en-US" ? spell.originalName : spell.name, category: Object.keys(spell.requirements).join(" + "), description: spell.summary ?? spell.description ?? "", meta: `${formatSpellRequirements(spell.requirements)} · ${spell.source} · p. ${spell.page || "—"}` }));
    const addGrantedPraxis = (id: string) => {
        if (praxes.length >= gnosis)
            return;
        const spell = spellCatalog.find(item => item.id === id);
        if (!spell)
            return;
        const next = structuredClone(character);
        next.line_data.learned_praxes = [...objectList(next.line_data.learned_praxes), { ...spell }];
        updateSheet(next);
    };
    const inuredSpells = objectList(data.inured_spells);
    const availableInuredSpells = spellCatalog
        .filter(spell => meetsArcanaRequirements(spell.requirements, arcana) && !inuredSpells.some(item => String(item.id) === spell.id))
        .map(spell => ({ id: spell.id, name: locale === "en-US" ? spell.originalName : spell.name, category: Object.keys(spell.requirements).join(" + "), description: spell.summary ?? spell.description ?? "", meta: `${formatSpellRequirements(spell.requirements)} · ${spell.source} · p. ${spell.page || "—"}` }));
    const setInuredSpells = (items: Array<Record<string, unknown>>) => { const next = structuredClone(character); next.line_data.inured_spells = items; updateSheet(next); };
    const addInuredSpell = (id: string) => { if (inuredSpells.length >= gnosis)
        return; const spell = spellCatalog.find(item => item.id === id); if (!spell)
        return; setInuredSpells([...inuredSpells, { ...spell }]); };
    const removeInuredSpell = (id: string) => setInuredSpells(inuredSpells.filter(item => String(item.id) !== id));
    const nimbusEffects = normalizeNimbusTiltEffects(data.nimbus_tilt_effects, gnosis);
    const setNimbusEffects = (effects: Array<{
        trait: string;
        modifier: number;
    }>) => { const next = structuredClone(character); next.line_data.nimbus_tilt_effects = normalizeNimbusTiltEffects(effects, gnosis); updateSheet(next); };
    const removePraxis = (item: Record<string, unknown>) => {
        const id = String(item.id ?? ""), next = structuredClone(character);
        const history = Array.isArray(next.current_state.mage_experience_history) ? next.current_state.mage_experience_history as Array<{
            id: string;
            regular: number;
            arcane: number;
            undo?: MageAdvancementUndo;
        }> : [];
        const purchase = history.find(entry => entry.undo?.kind === "spell" && entry.undo.key === "learned_praxes" && entry.undo.id === id);
        if (purchase?.undo) {
            const refundedRegular = Number(purchase.regular) || 0, refundedArcane = Number(purchase.arcane) || 0;
            refundMageAdvancement(next, purchase.undo);
            next.current_state.mage_experience_available = Number(next.current_state.mage_experience_available ?? 0) + refundedRegular;
            next.current_state.arcane_experience_available = Number(next.current_state.arcane_experience_available ?? 0) + refundedArcane;
            next.current_state.mage_experience_spent = Math.max(0, Number(next.current_state.mage_experience_spent ?? 0) - refundedRegular);
            next.current_state.arcane_experience_spent = Math.max(0, Number(next.current_state.arcane_experience_spent ?? 0) - refundedArcane);
            next.current_state.mage_experience_history = history.filter(entry => entry.id !== purchase.id);
        }
        else
            for (const key of ["praxes", "learned_praxes"]) {
                const list = objectList(next.line_data[key]), index = list.findIndex(candidate => String(candidate.id ?? "") === id);
                if (index >= 0) {
                    list.splice(index, 1);
                    next.line_data[key] = list;
                    break;
                }
            }
        updateSheet(next);
    };
    const legacyState = normalizeLegacyState(data.legacy_state);
    const legacyDefinition = findLegacy(legacyState?.definitionId);
    const hasLegacyAccess = (gnosis >= 2 || Boolean(legacyState?.joined));
    const legacyDisplay = legacyState?.joined ? legacyDefinition?.name ?? "Legacy" : hasLegacyAccess ? t("ui.join") : "";
    const openLegacy = () => legacyState?.joined ? setSheetTab("legacy") : setLegacyJoinOpen(true);
    const legacyJoinDialog = <Dialog open={legacyJoinOpen} onOpenChange={setLegacyJoinOpen}><DialogContent className="homebrew-dialog mage-legacy-join-dialog"><DialogHeader><DialogTitle>{t("ui.selectLegacy")}</DialogTitle><DialogDescription>{t("ui.selectAnAvailableLegacy")}</DialogDescription></DialogHeader><LegacyPage character={character} updateSheet={updateSheet} onDiscard={() => setLegacyJoinOpen(false)} onJoined={() => { setLegacyJoinOpen(false); setSheetTab("legacy"); }}/></DialogContent></Dialog>;
    const pathDefinition = MTA_PATHS[String(data.path) as keyof typeof MTA_PATHS];
    const sameSystemTerm = (left: string, right: string) => systemTerm(left, "en-US") === systemTerm(right, "en-US");
    const arcanaPresentation = (name: string) => {
        const pathRuling = Boolean(pathDefinition?.ruling.some(item => sameSystemTerm(String(item), name)));
        const legacyRuling = Boolean(legacyState?.joined && legacyDefinition && sameSystemTerm(legacyDefinition.rulingArcanum, name));
        const inferior = Boolean(pathDefinition?.inferior && sameSystemTerm(String(pathDefinition.inferior), name));
        return { note: legacyRuling ? t("ui.legacyRuling") : pathRuling ? t("ui.ruling") : inferior ? t("ui.inferior") : undefined };
    };
    const obsessionSlots = gnosis <= 2 ? 1 : gnosis <= 5 ? 2 : gnosis <= 8 ? 3 : 4;
    const powerRating = gnosis;
    const resource = powerResourceLimits(powerRating);
    const health = Math.max(1, Number(derived.Vitalidade ?? 5));
    const baseWillpower = Math.max(1, Number(derived.ForçaDeVontade ?? 1));
    const lostWillpower = boundedNumber(character.current_state?.willpower_lost_dots, baseWillpower - 1, 0);
    const willpower = Math.max(1, baseWillpower - lostWillpower);
    const damage = normalizeDamage(character.current_state?.health_damage, health);
    const currentWillpower = boundedNumber(character.current_state?.willpower_current, willpower, willpower);
    const resourceKey = "mana_current";
    const currentResource = boundedNumber(character.current_state?.[resourceKey], resource.maximum, resource.maximum);
    const expandedMerits = character.merits.filter((item) => (isExpanded(item.name) || item.name === "Mystery Cult Initiation") && (!item.grantedBy || item.grantedBy === "Nameless Order"));
    const principalMerits = character.merits.filter((item) => !item.grantedBy || ["Ordem", "Nameless Order"].includes(String(item.grantedBy)));
    const selectedConditions = [
        ...selectedConditionList(character.current_state?.conditions, conditionCatalog),
        ...stringList(data.merit_granted_conditions).map((id) => ({
            id,
            persistent: false,
        })),
    ].filter((item, index, all) => item.id === "bonded" || all.findIndex((other) => other.id === item.id) === index);
    const notes = String(character.current_state?.notes ?? "");
    const setState = (key: string, value: unknown) => updateState({ ...character.current_state, [key]: value });
    const applyHubris = (result: "dramatic-failure" | "failure" | "success" | "exceptional-success", id: "megalomaniacal" | "rampant", act: string) => {
        const next = structuredClone(character);
        const history = Array.isArray(next.current_state.mage_experience_history)
            ? next.current_state.mage_experience_history
            : [];
        const wisdom = Math.max(1, Number(next.line_data.wisdom ?? 7));
        const losesWisdom = result === "dramatic-failure" || result === "failure";
        const earnedBeats = result === "exceptional-success" ? 2 : 1;
        const currentArcaneBeats = Math.max(0, Math.trunc(Number(next.current_state.arcane_experience_beats ?? 0)));
        const currentArcaneAvailable = Math.max(0, Math.trunc(Number(next.current_state.arcane_experience_available ?? 0)));
        const currentArcaneSpent = Math.max(0, Math.trunc(Number(next.current_state.arcane_experience_spent ?? 0)));
        const arcaneBeatTotal = currentArcaneBeats + earnedBeats;
        const gainedArcaneExperience = Math.floor(arcaneBeatTotal / 5);
        const entry = losesWisdom ? {
            id: createRandomId(),
            description: `${t("ui.actOfHubris")}: ${act}`,
            regular: 0,
            arcane: 0,
            createdAt: new Date().toISOString(),
            undo: { kind: "wisdomLoss" },
            before: {
                attributes: structuredClone(next.attributes),
                skills: structuredClone(next.skills),
                merits: structuredClone(next.merits),
                specializations: structuredClone(next.specializations),
                line_data: structuredClone(next.line_data),
            },
        } : null;
        if (losesWisdom) next.line_data = { ...next.line_data, wisdom: Math.max(1, wisdom - 1) };
        const currentConditions = selectedConditionList(next.current_state.conditions, conditionCatalog);
        const conditions = losesWisdom
            ? [...currentConditions.filter(item => item.id !== id), { id, persistent: result === "dramatic-failure" }]
            : currentConditions;
        next.current_state = {
            ...next.current_state,
            conditions,
            arcane_experience_beats: arcaneBeatTotal % 5,
            arcane_experience_available: currentArcaneAvailable + gainedArcaneExperience,
            arcane_experience_total: currentArcaneAvailable + gainedArcaneExperience + currentArcaneSpent,
            mage_experience_history: entry ? [entry, ...history].slice(0, 100) : history,
        };
        updateSheet(next);
    };
    if (isMobile) {
        const identity = [
            ["Nome", character.character.name], ["Jogador", character.character.player],
            ["Crônica", character.character.chronicle], ["Vício", data.vice], ["Virtude", data.virtue],
            ["Conceito", character.character.concept], ["Nome das Sombras", data.shadow_name],
            ["Caminho", data.path], ["Ordem", !data.order || data.order === "Orderless" ? t("ui.orderless") : data.order === "Nameless" ? "Nameless" : locale === "en-US" ? data.order : MTA_ORDER_LABELS[String(data.order)] ?? data.order],
        ];
        const paradoxConditions = conditionCatalog.filter((condition) => `${condition.name} ${condition.description} ${condition.penalty}`.toLocaleLowerCase("pt-BR").includes("paradoxo"));
        return (<><CharacterPaperShell line="MtA" mobile title={t("ui.mage")} subtitle={t("ui.theAWAKENING")}>
        <SwipeableSheetTabs value={sheetTab} onValueChange={setSheetTab} tabs={[
                { value: "resumo", label: t("ui.summary") }, { value: "stats", label: "Stats" },
                { value: "detalhes", label: t("ui.details") },
                { value: "poderes", label: t("ui.powers") },
                ...([]),
                ...(hasLegacyAccess ? [{ value: "legacy", label: "Legacy", hidden: !legacyState?.joined }] : []),
                { value: "combate", label: t("ui.combat") },
                ...(hasCompanions ? [{ value: "companheiros", label: t("ui.companions") }] : []), { value: "anotacoes", label: t("ui.notes") },
            ]}>
          {{
                resumo: <>
              <section className="sheet-identity-grid">{identity.map(([label, value]) => <CommonSheetField key={String(label)} label={String(label)} value={value}/>)}{<LegacySheetField value={legacyDisplay} enabled={hasLegacyAccess} onOpen={openLegacy}/>}</section>
              {<div className="sheet-bottom-grid mage-bottom-grid"><section><SheetHeading>{t("ui.aspirations")}</SheetHeading><EditableList values={aspirations} minimum={3} maximum={3} placeholder={t("ui.writeAnAspiration")} onChange={(value) => updateLineData(updateSheet, character, "aspirations", value)}/></section><section><SheetHeading>{t("ui.obsessions")}</SheetHeading><EditableList values={stringList(data.obsessions)} minimum={obsessionSlots} maximum={obsessionSlots} placeholder={t("ui.writeAnObsession")} onChange={(value) => updateLineData(updateSheet, character, "obsessions", value)}/></section></div>}
              <SheetHeading>{t("ui.experience")}</SheetHeading>
              {<MageExperiencePanel character={character} updateSheet={updateSheet} catalogs={catalogs}/>}
            </>,
                stats: <>
              <SheetHeading>{t("ui.attributes")}</SheetHeading>
              <div className="mobile-attribute-grid">{Object.entries(ATTRIBUTES).map(([category, names]) => <TraitBlock key={category} title={category} names={names} values={character.attributes} compactNames/>)}</div>
              <SheetHeading>{t("ui.skills")}</SheetHeading>
              <div className="mobile-trait-stack">{Object.entries(SKILLS).map(([category, names]) => <TraitBlock key={category} title={category} names={names} values={effectiveSkills} specialties={specialties} highlightedNames={highlightedSkills} highlightTone={skillHighlightTone}/>)}</div>
            </>,
                detalhes: <>
              <SheetHeading>{t("ui.merits")}</SheetHeading><MeritSheetList character={character} merits={principalMerits} updateSheet={updateSheet} catalog={meritCatalog}/>
              <SheetHeading>{t("ui.expandedMerits")}</SheetHeading><ExpandedMeritList merits={expandedMerits} character={character} updateSheet={updateSheet} catalog={meritCatalog} factions={factionCatalog}/>
              <MageOrderSummary data={data}/>
              <SheetHeading>{t("ui.activeSpells")}</SheetHeading><EditableList values={stringList(character.current_state?.active_spells)} minimum={gnosis} maximum={gnosis} placeholder={t("ui.activeSpell")} onChange={(value) => setState("active_spells", value)}/>
              <SheetHeading>{t("ui.conditions")}</SheetHeading><CoreConditionManager selected={selectedConditions} catalog={conditionCatalog} onChange={(value) => setState("conditions", value)}/>
            </>,
                poderes: <>
              <PowerResource name={t("ui.gnosis")} rating={powerRating} resourceName="Mana" current={currentResource} maximum={resource.maximum} perTurn={resource.perTurn} onChange={(value) => setState(resourceKey, value)}/>
              <SheetHeading>{t("ui.arcana")}</SheetHeading><div className="arcana-sheet-list">{Object.entries(arcana).map(([name, value]) => <TraitLine key={name} name={name} value={Number(value)} {...arcanaPresentation(name)}/>)}</div>
              <MageWisdomSection wisdom={Number(data.wisdom ?? 7)} gnosis={gnosis} inuredSpells={inuredSpells} available={availableInuredSpells} locale={locale} onAdd={addInuredSpell} onRemove={removeInuredSpell} onHubris={applyHubris}/>
              <SheetHeading>{t("ui.rotes")}</SheetHeading><SpellColumn items={rotes} catalog={spellCatalog} showSkill/>
              <SheetHeading>{t("ui.magicalTools")}</SheetHeading><EditableList values={stringList(data.magical_tools).length ? stringList(data.magical_tools) : [String(data.dedicated_tool ?? "")]} minimum={3} maximum={3} firstPrefix={t("ui.dedicatedTool")} placeholder={t("ui.magicalTool")} onChange={(value) => updateLineData(updateSheet, character, "magical_tools", value)}/>
              <SheetHeading>{t("ui.nimbusTilt")}</SheetHeading><NimbusEditor wisdom={Number(data.wisdom ?? 7)} gnosis={gnosis} values={stringList(data.nimbus_tilt)} effects={nimbusEffects} onChange={(value) => updateLineData(updateSheet, character, "nimbus_tilt", value)} onEffectsChange={setNimbusEffects}/>
              <div className="sheet-heading-action"><SheetHeading>{t("ui.praxes")}</SheetHeading>{praxes.length < gnosis && <ExperiencePowerPicker kind="Práxis" items={availablePraxes} selectedId="" onSelect={addGrantedPraxis} compact/>}</div><SpellColumn items={praxes} catalog={spellCatalog} minimumRows={gnosis} onRemove={removePraxis}/>
              <SheetHeading>{t("ui.attainments")}</SheetHeading><MageAttainmentList arcana={arcana}/>
              <SheetHeading>{t("ui.paradoxConditions")}</SheetHeading><CoreConditionManager selected={selectedConditions} catalog={paradoxConditions} onChange={(value) => setState("conditions", value)}/>
            </>,
                legacy: <LegacyPage character={character} updateSheet={updateSheet} onDiscard={() => setSheetTab("resumo")}/>,
                combate: <>
              <SheetHeading>{t("ui.health")}</SheetHeading><HealthTrack health={health} damage={damage} onChange={(value) => setState("health_damage", value)}/>
              <SheetHeading>{t("ui.willpower")}</SheetHeading><ResourceTrack label={t("ui.willpower")} current={currentWillpower} maximum={willpower} onChange={(value) => setState("willpower_current", value)}/>
              <CombatPage character={character} derived={derived} updateSheet={updateSheet}/>
            </>,
                companheiros: <div className="companions-page"><MageCompanionPage character={character} updateSheet={updateSheet}/><CoreCompanionPage character={character} updateSheet={updateSheet}/></div>,
                anotacoes: <><SheetHeading>{t("ui.notes")}</SheetHeading><NotesArea value={notes} onChange={(value) => setState("notes", value)}/></>,
            }}
        </SwipeableSheetTabs>
      </CharacterPaperShell>{legacyJoinDialog}</>);
    }
    return (<><CharacterPaperShell line="MtA" title={t("ui.mage")} subtitle={t("ui.theAWAKENING")}>
      {(<Tabs value={sheetTab} onValueChange={setSheetTab} className="ctl-sheet-tabs mta-sheet-tabs">
          <TabsList className="ctl-sheet-tab-list" aria-label={t("ui.mageCharacterPages")}>
            <TabsTrigger value="principal">{t("ui.main")}</TabsTrigger>
            <TabsTrigger value="magia">{t("ui.details")}</TabsTrigger>
            {legacyState?.joined && <TabsTrigger value="legacy" data-legacy-tab-trigger>{t("ui.legacy")}</TabsTrigger>}
            <TabsTrigger value="combate">{t("ui.combat")}</TabsTrigger>
            {hasCompanions && <TabsTrigger value="companheiros">{t("ui.companions")}</TabsTrigger>}
          </TabsList>
          <TabsContent value="principal" data-page-title="Principal" className="ctl-sheet-page">
            <MainSheet className="mage-main-body"
              identity={<section className="sheet-identity-grid"><CommonSheetField label={t("ui.shadowName")} value={data.shadow_name}/><CommonSheetField label={t("ui.virtue")} value={data.virtue}/><CommonSheetField label={t("ui.path")} value={data.path}/><CommonSheetField label={t("ui.player")} value={character.character.player}/><CommonSheetField label={t("ui.vice")} value={data.vice}/><CommonSheetField label={t("ui.order")} value={!data.order || data.order === "Orderless" ? t("ui.orderless") : data.order === "Nameless" ? "Nameless" : locale === "en-US" ? data.order : MTA_ORDER_LABELS[String(data.order)] ?? data.order}/><CommonSheetField label={t("ui.chronicle")} value={character.character.chronicle}/><CommonSheetField label={t("ui.concept")} value={character.character.concept}/><LegacySheetField value={legacyDisplay} enabled={hasLegacyAccess} onOpen={openLegacy}/></section>}
              attributes={<><SheetHeading>{t("ui.attributes")}</SheetHeading><div className="official-trait-grid">{Object.entries(ATTRIBUTES).map(([category, names]) => <TraitBlock key={category} title={category} names={names} values={character.attributes}/>)}</div></>}
              skills={
                <>
                    <SheetHeading>{t("ui.skills")}</SheetHeading>
                    {Object.entries(SKILLS).map(([category, names]) => (
                    <TraitBlock
                        key={category}
                        title={category}
                        subtitle={
                        category === "Mental"
                            ? t("ui.message3IfUntrained")
                            : t("ui.message1IfUntrained")
                        }
                        names={names}
                        values={effectiveSkills}
                        specialties={specialties}
                        highlightedNames={highlightedSkills}
                        highlightTone="rote"
                    />
                    ))}
                </>
                }
              specificPowers={<MageArcanaList arcana={arcana} presentation={arcanaPresentation}/>}
              merits={<MeritSheetList character={character} merits={principalMerits} updateSheet={updateSheet} catalog={meritCatalog}/>}
              aspirations={<EditableList values={aspirations} minimum={3} maximum={3} placeholder={t("ui.writeAnAspiration")} onChange={(value) => updateLineData(updateSheet, character, "aspirations", value)}/>}
              obsessions={<EditableList values={stringList(data.obsessions)} minimum={obsessionSlots} maximum={obsessionSlots} placeholder={t("ui.writeAnObsession")} onChange={(value) => updateLineData(updateSheet, character, "obsessions", value)}/>}
              conditions={<CoreConditionManager selected={selectedConditions} catalog={conditionCatalog} onChange={(value) => setState("conditions", value)}/>}
              health={<><SheetHeading>{t("ui.health")}</SheetHeading><HealthTrack health={health} damage={damage} onChange={(value) => setState("health_damage", value)}/></>} willpower={<><SheetHeading>{t("ui.willpower")}</SheetHeading><ResourceTrack label={t("ui.willpower")} current={currentWillpower} maximum={willpower} onChange={(value) => setState("willpower_current", value)}/></>}
              specificPowersTitle="Arcanos" powerStat={<MainPowerStat label={t("ui.gnosis")} value={powerRating} summary={mageGnosisSummary(gnosis, t)}/>} fuel={<MainFuel label={t("ui.mana")} current={currentResource} maximum={resource.maximum} onChange={(value) => setState(resourceKey, value)}/>} stability={<MageWisdomSection wisdom={Number(data.wisdom ?? 7)} gnosis={gnosis} inuredSpells={inuredSpells} available={availableInuredSpells} locale={locale} onAdd={addInuredSpell} onRemove={removeInuredSpell} onHubris={applyHubris}/>} derived={derived} armorId={data.combat_armor} experience={<MageExperiencePanel character={character} updateSheet={updateSheet} catalogs={catalogs}/>} />
          </TabsContent>
          <TabsContent value="magia" data-page-title="Detalhes" className="ctl-sheet-page powers-page mage-spell-page">
            <div className="mage-page-355-grid">
              <section className="mage-page-left">
                <SheetHeading>{t("ui.activeSpells")}</SheetHeading>
                <EditableList values={stringList(character.current_state?.active_spells)} minimum={gnosis} maximum={gnosis} placeholder={t("ui.activeSpell")} onChange={(value) => setState("active_spells", value)}/>
                <SheetHeading>{t("ui.attainments")}</SheetHeading>
                <MageAttainmentList arcana={arcana}/>
                <div className="sheet-heading-action"><SheetHeading>{t("ui.praxes")}</SheetHeading>{praxes.length < gnosis && <ExperiencePowerPicker kind="Práxis" items={availablePraxes} selectedId="" onSelect={addGrantedPraxis} compact/>}</div>
                <SpellColumn items={praxes} catalog={spellCatalog} minimumRows={gnosis} onRemove={removePraxis}/>
              </section>
              <section className="mage-page-main">
                <SheetHeading>{t("ui.rotes")}</SheetHeading>
                <SpellColumn items={rotes} catalog={spellCatalog} showSkill/>
                <SheetHeading>{t("ui.magicalTools")}</SheetHeading>
                <EditableList values={stringList(data.magical_tools).length ? stringList(data.magical_tools) : [String(data.dedicated_tool ?? "")]} minimum={3} maximum={3} firstPrefix={t("ui.dedicatedTool")} placeholder={t("ui.magicalTool")} onChange={(value) => updateLineData(updateSheet, character, "magical_tools", value)}/>
                <SheetHeading>{t("ui.nimbusTilt")}</SheetHeading>
                <NimbusEditor wisdom={Number(data.wisdom ?? 7)} gnosis={gnosis} values={stringList(data.nimbus_tilt)} effects={nimbusEffects} onChange={(value) => updateLineData(updateSheet, character, "nimbus_tilt", value)} onEffectsChange={setNimbusEffects}/>
                <SheetHeading>{t("ui.notes")}</SheetHeading>
                <NotesArea value={notes} onChange={(value) => setState("notes", value)}/>
              </section>
            </div>
          </TabsContent>
          {hasLegacyAccess && <TabsContent value="legacy" data-page-title="Legacy" className="ctl-sheet-page powers-page"><LegacyPage character={character} updateSheet={updateSheet} onDiscard={() => setSheetTab("principal")}/></TabsContent>}
          <TabsContent value="combate" data-page-title="Combate" className="ctl-sheet-page powers-page">
            <CombatPage character={character} derived={derived} updateSheet={updateSheet}/>
          </TabsContent>
          <TabsContent value="companheiros" data-page-title="Companheiros" className="ctl-sheet-page powers-page">
            <div className="companions-page"><MageCompanionPage character={character} updateSheet={updateSheet}/><CoreCompanionPage character={character} updateSheet={updateSheet}/></div>
          </TabsContent>
        </Tabs>)}
    </CharacterPaperShell>{legacyJoinDialog}</>);
}
function LegacySheetField({ value, enabled, onOpen }: {
    value: string;
    enabled: boolean;
    onOpen: () => void;
}) {
    const { t } = useLanguage();
    return <div className={`official-field legacy-sheet-field${enabled ? " enabled" : ""}`}><span>{t("ui.legacy")}</span>{enabled ? <button type="button" onClick={onOpen}>{value}</button> : <strong>{value}</strong>}</div>;
}
function meritLabel(item: CharacterSheet["merits"][number], catalog: readonly MeritDefinition[], locale: Locale = "en-US") {
    const definition = catalog.find((entry) => entry.name === item.name);
    const base = locale === "en-US"
        ? definition?.name ?? item.name
        : definition?.translatedName ??
            (item.name === "Hollow" ? "Recanto" : item.name), detail = meritConfigurationTitle(item.configuration);
    return detail ? `${base}: ${detail}` : base;
}
function ExpandedMeritList({ merits, character, updateSheet, catalog, factions, hasAdjacentContent = false }: {
    merits: CharacterSheet["merits"];
    character?: CharacterSheet;
    updateSheet?: (sheet: CharacterSheet) => void;
    catalog: readonly MeritDefinition[];
    factions?: readonly MageFactionDefinition[];
    hasAdjacentContent?: boolean;
}) {
    const { locale, t } = useLanguage();
    const visible = merits.filter((item) => (!item.grantedBy || item.grantedBy === "Nameless Order") && item.name !== "Familiar");
    return (<div className="expanded-merit-list">
      {visible.map((item, itemIndex) => {
            const style = catalog.find((entry) => entry.name === item.name && entry.levels?.length), configured = expandedConfigurationLines(item.name, item.dots, item.configuration, locale), cult = String(normalizeMeritConfiguration(item.configuration).cult ?? ""), title = meritLabel(item, catalog, locale), meritIndex = character?.merits.indexOf(item) ?? -1, configurationEditor = character && updateSheet && findMeritConfiguration(item.name) && item.name !== "Familiar"
                ? <MeritConfigurationEditor compact merit={item} ownedMerits={character.merits} configurationDots={item.name === "Masque" ? character.merits.find((candidate) => candidate.name === "Masque (Style)")?.dots : undefined} catalog={[...catalog]} definitions={MAGE_SHEET_MERIT_CONFIGURATIONS} renderStructured={(props) => <MageStructuredMeritEditor {...props} factions={factions} order={String(character.line_data.order??"")}/>} onChange={(configuration) => { const next = structuredClone(character); const target = next.merits[meritIndex]; if (target)
                    target.configuration = configuration; updateSheet(synchronizeMeritGrants(next)); }}/>
                : null;
            if (!style)
                return (<details className="expanded-merit-card" key={`${item.name}-${itemIndex}`}>
              <summary>
                <h4>{title}</h4>
                <DotValue value={item.dots}/>
              </summary>
              <div className="expanded-merit-body">
                {configured.length ? (configured.map((line, index) => (<section key={`${item.name}-configured-${index}`}>
                      <strong>{line.split(":")[0]}</strong>
                      <p>{line.slice(line.indexOf(":") + 1).trim()}</p>
                    </section>))) : (<p>
                    {t("ui.seeThisMeritSDescriptionToAssignOr")}
                  </p>)}
                {configurationEditor}
              </div>
            </details>);
            return (<details className="expanded-merit-card" key={`${item.name}-${itemIndex}`}>
            <summary>
              <div>
                <h4>
                  {title}
                  {cult && !title.includes(cult) ? `: ${cult}` : ""}
                </h4>
                <small>
                  {style.source} · p. {style.page}
                  {item.grantedBy !== "Nameless Order" && <> · {t("ui.prerequisites")}: {style.prerequisites || t("ui.none")}</>}
                </small>
              </div>
              <DotValue value={item.dots}/>
            </summary>
            <div className="expanded-merit-body">
              {item.name === "Mystery Cult Initiation" && item.grantedBy === "Nameless Order"
                    ? <NamelessMysteryCultLevels dots={item.dots} configuration={normalizeMeritConfiguration(item.configuration)} locale={locale}/>
                    : configured.length
                        ? <>{configured.map((line, index) => (<section key={`${style.name}-configured-${index}`}>
                      <strong>{line.split(":")[0]}</strong>
                      <p>{line.slice(line.indexOf(":") + 1).trim()}</p>
                      </section>))}</>
                        : (style.levels ?? [])
                            .filter((level) => level.rating <= item.dots)
                            .map((level, index) => (<section key={`${style.name}-${level.rating}-${index}`}>
                        <strong>
                          {"•".repeat(level.rating)} {level.name}
                        </strong>
                        <p>{level.description}</p>
                      </section>))}
              {configurationEditor}
            </div>
          </details>);
        })}
      {!visible.length && !hasAdjacentContent && <p className="rule-callout expanded-merit-empty">{t("ui.noExpandedMeritsPurchased")}</p>}
    </div>);
}
function NamelessMysteryCultLevels({ dots, configuration, locale }: {
    dots: number;
    configuration: Record<string, string | string[]>;
    locale: Locale;
}) {
    const english = locale === "en-US";
    const roteSkills = Array.isArray(configuration.level_2_rote_skills)
        ? configuration.level_2_rote_skills.filter(Boolean).map((skill) => systemTerm(String(skill), locale))
        : [];
    const configured = expandedConfigurationLines("Mystery Cult Initiation", dots, configuration, locale);
    const configuredDescription = (level: number) => {
        const prefix = `${english ? "Dot" : "Nível"} ${level}:`;
        const line = configured.find((entry) => entry.startsWith(prefix));
        return line?.slice(prefix.length).trim() || (english ? "Configure this benefit below." : "Configure este benefício abaixo.");
    };
    const levels = [
        { rating: 1, name: english ? "Initiate" : "Iniciado", description: english ? "The Awakened receives the High Speech merit." : "O Desperto recebe o mérito High Speech." },
        { rating: 2, name: english ? "Attendee" : "Frequentador", description: roteSkills.length === 3
                ? `${english ? "Grants the Rote Skills" : "Concede as Perícias de Rota"}: ${roteSkills.join(", ")}`
                : (english ? "Choose three Rote Skills below." : "Escolha três Perícias de Rota abaixo.") },
        { rating: 3, name: english ? "Disciple" : "Discípulo", description: english ? "Bestows knowledge, gifting +1 in the Occult Skill." : "Concede conhecimento, fornecendo +1 na Perícia Ocultismo." },
        { rating: 4, name: english ? "Configurable benefit" : "Benefício configurável", description: configuredDescription(4) },
        { rating: 5, name: english ? "Configurable benefit" : "Benefício configurável", description: configuredDescription(5) },
    ];
    return <>{levels.filter((level) => level.rating <= dots).map((level) => <section key={level.rating}><strong>{level.name} {"•".repeat(level.rating)}</strong><p>{level.description}</p></section>)}</>;
}
function MageWisdomSection({ wisdom, gnosis, inuredSpells, available, locale, onAdd, onRemove, onHubris }: {
    wisdom: number;
    gnosis: number;
    inuredSpells: Array<Record<string, unknown>>;
    available: Array<{
        id: string;
        name: string;
        category: string;
        description: string;
        meta: string;
    }>;
    locale: Locale;
    onAdd: (id: string) => void;
    onRemove: (id: string) => void;
    onHubris: (result: "dramatic-failure" | "failure" | "success" | "exceptional-success", id: "megalomaniacal" | "rampant", act: string) => void;
}) {
    const { t } = useLanguage();
    const tiers = availableHubrisTiers(wisdom);
    const [open, setOpen] = useState(false), [selectedActId, setSelectedActId] = useState(""), [result, setResult] = useState<"dramatic-failure" | "failure" | "success" | "exceptional-success">("success"), [condition, setCondition] = useState<"megalomaniacal" | "rampant">("megalomaniacal"), [obsession, setObsession] = useState(false), [virtue, setVirtue] = useState(false), [vice, setVice] = useState(false);
    const selectedTier = tiers.find(tier => tier.acts.some(act => act.id === selectedActId)) ?? tiers[0];
    const selectedAct = selectedTier?.acts.find(act => act.id === selectedActId) ?? selectedTier?.acts[0];
    const pool = selectedTier ? hubrisPool(selectedTier, { obsession, virtue, vice }) : 0;
    const close = () => { setOpen(false); setResult("success"); setObsession(false); setVirtue(false); setVice(false); };
    const outcome = result === "dramatic-failure" ? t("ui.hubrisDramaticFailure") : result === "failure" ? t("ui.hubrisFailure") : result === "exceptional-success" ? t("ui.hubrisExceptionalSuccess") : t("ui.hubrisSuccess");
    return <div className="wisdom-sheet-section">
    <div className="wisdom-heading-row"><SheetHeading>{t("ui.wisdom")}</SheetHeading><Button type="button" size="sm" variant="outline" className="builder-add-action" disabled={wisdom < 1} onClick={() => setOpen(true)}>{t("ui.hubris")}</Button></div>
    <div className="wisdom-track"><DotValue value={wisdom} max={10} singleRow/><strong className="wisdom-current">{wisdom} · {wisdomState(wisdom)}</strong></div>
    <div className="inured-heading-row"><strong>{t("ui.inuredSpells")} ({inuredSpells.length}/{gnosis})</strong>{inuredSpells.length < gnosis && <ExperiencePowerPicker kind="Feitiço" items={available} selectedId="" onSelect={onAdd} compact triggerLabel={t("ui.selectInuredSpell")} dialogTitle={t("ui.selectInuredSpell")} dialogDescription={t("ui.afterLosingWisdomFromUsingASpellIt")}/>}</div>
    <div className="inured-spell-list">{inuredSpells.map(item => <div key={String(item.id)}><span>{String(locale === "en-US" ? item.originalName ?? item.name : item.name ?? item.originalName)}</span><Button type="button" variant="ghost" size="sm" className="compact-remove-action" onClick={() => onRemove(String(item.id))}><Trash2 /> {t("ui.remove7d41cc")}</Button></div>)}</div>
    <Dialog open={open} onOpenChange={value => value ? setOpen(true) : close()}><DialogContent className="experience-dialog mage-hubris-dialog"><DialogHeader><DialogTitle>{t("ui.actOfHubris")}</DialogTitle><DialogDescription>{t("ui.hubrisDescription")}</DialogDescription></DialogHeader><div className="mage-hubris-form"><div className="mage-hubris-tiers">{tiers.map(tier => <section key={tier.id}><header><strong>{t(tier.labelKey)}</strong></header><div>{tier.acts.map(act => <label className="mage-hubris-act" key={act.id}><input type="radio" name="mage-hubris-act" checked={selectedAct?.id === act.id} onChange={() => setSelectedActId(act.id)}/><span>{t(act.labelKey)}</span></label>)}</div></section>)}</div><div className="mage-hubris-reference"><strong>{t("ui.hubrisPool")}: {pool <= 0 ? t("ui.chanceDie") : t("ui.diceCount", { p1: pool })}</strong><small>{t("ui.hubrisNoWillpower")}</small></div><div className="mage-hubris-modifiers"><label><input type="checkbox" checked={obsession} onChange={event => setObsession(event.target.checked)}/><span>{t("ui.hubrisPursuedObsession")}</span></label><label><input type="checkbox" checked={virtue} onChange={event => setVirtue(event.target.checked)}/><span>{t("ui.hubrisDefendedVirtue")}</span></label><label><input type="checkbox" checked={vice} onChange={event => setVice(event.target.checked)}/><span>{t("ui.hubrisFollowedVice")}</span></label></div><label>{t("ui.rollResult")}<RuleSelect value={result} onChange={value => setResult(value as typeof result)} options={[{ value: "dramatic-failure", label: t("ui.dramaticFailure") }, { value: "failure", label: t("ui.failure") }, { value: "success", label: t("ui.success") }, { value: "exceptional-success", label: t("ui.exceptionalSuccess") }]}/></label>{(result === "dramatic-failure" || result === "failure") && <div className="hubris-dialog-options"><label>{t("ui.condition")}<RuleSelect value={condition} onChange={value => setCondition(value as typeof condition)} options={[{ value: "megalomaniacal", label: "Megalomaniacal" }, { value: "rampant", label: "Rampant" }]}/></label>{result === "dramatic-failure" && <strong>{t("ui.persistent")}</strong>}</div>}<div className="mage-hubris-outcome"><p>{outcome}</p></div></div><DialogFooter><Button type="button" size="sm" variant="outline" className="catalog-dialog-done" onClick={close}>{t("common.cancel")}</Button><Button type="button" size="sm" className="catalog-selection-action" disabled={!selectedAct} onClick={() => { if (selectedAct) onHubris(result, condition, t(selectedAct.labelKey)); close(); }}>{t("ui.applyResult")}</Button></DialogFooter></DialogContent></Dialog>
  </div>;
}
function NimbusEditor({ wisdom, gnosis, values, effects, onChange, onEffectsChange, }: {
    wisdom: number;
    gnosis: number;
    values: string[];
    effects: Array<{
        trait: string;
        modifier: number;
    }>;
    onChange: (value: string[]) => void;
    onEffectsChange: (value: Array<{
        trait: string;
        modifier: number;
    }>) => void;
}) {
    const { locale, t } = useLanguage();
    const descriptions = [...values.slice(0, 3)];
    while (descriptions.length < 3)
        descriptions.push("");
    const connection = mageNimbusConnection(wisdom);
    const connectionLabel = connection === "Strong" ? t("ui.strong") : connection === "Medium" ? t("ui.medium") : t("ui.weak");
    const budget = mageNimbusTiltBudget(gnosis);
    const allocated = effects.reduce((total, item) => total + Math.abs(item.modifier), 0);
    const traits = [...Object.values(ATTRIBUTES).flat(), ...Object.values(SKILLS).flat()];
    const setDescription = (index: number, value: string) => { const next = [...descriptions]; next[index] = value; onChange(next); };
    const updateEffect = (index: number, patch: Partial<{
        trait: string;
        modifier: number;
    }>) => onEffectsChange(effects.map((item, itemIndex) => itemIndex === index ? { ...item, ...patch } : item));
    const unused = traits.filter(trait => !effects.some(item => item.trait === trait));
    return <div className="nimbus-editor">
    <article>
      <header><strong>{t("ui.longTermNimbus")}</strong><Badge variant="outline">{t("ui.sympatheticConnection")}: {connectionLabel}</Badge></header>
      <small>{t("ui.rangeIsCalculatedAutomaticallyFromWisdom")} · MtA, p. 89</small>
      <Input value={descriptions[0]} onChange={event => setDescription(0, event.target.value)} placeholder={t("ui.subtleCoincidencesAndEffectsSurroundingTheMage")}/>
    </article>
    <article>
      <header><strong>{t("ui.immediateNimbus")}</strong><Badge variant="outline">{allocated}/{budget} {t("ui.diceAllocated")}</Badge></header>
      <small>{t("ui.defineItsAppearanceAndDistributeBonusesOrPenalties")} · MtA, p. 90</small>
      <Input value={descriptions[1]} onChange={event => setDescription(1, event.target.value)} placeholder={t("ui.appearanceOrSensationOfTheNimbusAndIts")}/>
      <div className="nimbus-effects">
        {effects.map((effect, index) => {
            const withoutCurrent = allocated - Math.abs(effect.modifier);
            const allowed = Array.from({ length: budget * 2 }, (_, item) => item < budget ? item - budget : item - budget + 1).filter(value => withoutCurrent + Math.abs(value) <= budget);
            return <div key={`${effect.trait}-${index}`}>
            <Select value={effect.trait} onValueChange={value => updateEffect(index, { trait: value })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{traits.filter(trait => trait === effect.trait || !effects.some((item, itemIndex) => itemIndex !== index && item.trait === trait)).map(trait => <SelectItem key={trait} value={trait}>{systemTerm(trait, locale)}</SelectItem>)}</SelectContent></Select>
            <Select value={String(effect.modifier)} onValueChange={value => updateEffect(index, { modifier: Number(value) })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{allowed.map(value => <SelectItem key={value} value={String(value)}>{value > 0 ? `+${value}` : value}</SelectItem>)}</SelectContent></Select>
            <Button type="button" variant="ghost" size="sm" className="compact-remove-action" onClick={() => onEffectsChange(effects.filter((_, itemIndex) => itemIndex !== index))}><Trash2 /> {t("ui.remove7d41cc")}</Button>
          </div>;
        })}
        {allocated < budget && unused.length > 0 && <Button type="button" variant="outline" size="sm" className="builder-add-action" onClick={() => onEffectsChange([...effects, { trait: unused[0], modifier: 1 }])}><Plus /> {t("ui.addEffect")}</Button>}
      </div>
    </article>
    <article>
      <header><strong>{t("ui.signatureNimbus")}</strong></header>
      <small>{t("ui.describeTheRecognizableResidueLeftByTheCharacter")} · MtA, pp. 89–90</small>
      <Input value={descriptions[2]} onChange={event => setDescription(2, event.target.value)} placeholder={t("ui.magicalSignatureDescription")}/>
    </article>
  </div>;
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
};
const LESSER_ATTAINMENTS: Record<string, [
    string,
    string,
    string,
    string
]> = {
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
const GREATER_ATTAINMENTS: Record<string, [
    string,
    string,
    string,
    string
]> = {
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
function MageAttainmentList({ arcana }: {
    arcana: Record<string, number>;
}) {
    const { locale, t } = useLanguage();
    const owned = (minimum: number) => Object.entries(arcana)
        .filter(([, dots]) => Number(dots) >= minimum)
        .map(([name]) => locale === "en-US" ? systemTerm(name, locale) : ARCANA_PT[name] ?? name);
    const rows: Array<{
        name: string;
        arcana: string[];
        description: string;
    }> = [];
    const one = owned(1), two = owned(2), three = owned(3), five = owned(5);
    if (one.length)
        rows.push({
            name: t("ui.counterspell"),
            arcana: one,
            description: t("ui.unravelTheImagoOfASpellObservedWith"),
        });
    for (const [name, dots] of Object.entries(arcana)) {
        if (Number(dots) >= 2 && LESSER_ATTAINMENTS[name])
            rows.push({
                name: LESSER_ATTAINMENTS[name][locale === "en-US" ? 2 : 0],
                arcana: [locale === "en-US" ? systemTerm(name, locale) : ARCANA_PT[name] ?? name],
                description: LESSER_ATTAINMENTS[name][locale === "en-US" ? 3 : 1],
            });
    }
    if (two.length)
        rows.push({
            name: t("ui.mageArmor"),
            arcana: two,
            description: t("ui.activateProtectionCorrespondingToAMasteredArcanumOnly"),
        });
    if (three.length)
        rows.push({
            name: t("ui.targetedSummoning"),
            arcana: three,
            description: t("ui.whenSummoningASupernalBeingSpecifyASecond"),
        });
    for (const [name, dots] of Object.entries(arcana)) {
        if (Number(dots) >= 4 && GREATER_ATTAINMENTS[name])
            rows.push({
                name: GREATER_ATTAINMENTS[name][locale === "en-US" ? 2 : 0],
                arcana: [locale === "en-US" ? systemTerm(name, locale) : ARCANA_PT[name] ?? name],
                description: GREATER_ATTAINMENTS[name][locale === "en-US" ? 3 : 1],
            });
    }
    if (five.length)
        rows.push({
            name: t("ui.createRote"),
            arcana: five,
            description: t("ui.encodeAsARoteASpellWhoseArcana"),
        });
    return (<div className="mage-attainment-list">
      {rows.map((row) => (<div key={`${row.name}-${row.arcana.join("-")}`} title={row.description}>
          <strong>
            {row.name} ({row.arcana.join(", ")})
          </strong>
          <small>{row.description}</small>
        </div>))}
      {!rows.length && <em>{t("ui.noAttainmentsAcquired")}</em>}
    </div>);
}
function SpellColumn({ items, catalog, showSkill = false, minimumRows = 0, onRemove, }: {
    items: Array<Record<string, unknown>>;
    catalog: readonly SpellDefinition[];
    showSkill?: boolean;
    minimumRows?: number;
    onRemove?: (item: Record<string, unknown>) => void;
}) {
    const { locale, t } = useLanguage();
    const arcanaSource = (item: Record<string, unknown>) => `${Object.entries((item.requirements ?? {}) as Record<string, number>).map(([name, dots]) => `${systemTerm(name, locale)} ${"•".repeat(dots)}`).join(" + ")} · ${String(item.source ?? "")} · p. ${String(item.page ?? "—")}`;
    return (<div className="mage-spell-lines">
      {items.map((item, index) => (<details className="contract-power-card" key={`${String(item.id ?? item.name)}-${index}`}>
          <summary className="contract-power-summary"><strong>{String(locale === "en-US" ? item.originalName ?? item.name : item.name ?? item.originalName ?? "")}</strong>{onRemove && <Button type="button" variant="ghost" size="sm" className="compact-remove-action" onClick={event => { event.preventDefault(); event.stopPropagation(); onRemove(item); }}><Trash2 /> {t("ui.remove7d41cc")}</Button>}<small>{arcanaSource(item)}</small><span className="spell-card-rule-line"><strong>{t("ui.practice")}:</strong> {String(item.practice ?? "")}</span><span className="spell-card-rule-line"><strong>{t("ui.primaryFactor")}:</strong> {String(item.primaryFactor ?? "")}</span>{Boolean(item.withstand) && <span className="spell-card-rule-line"><strong>{t("ui.withstand")}:</strong> {String(item.withstand)}</span>}{showSkill && Boolean(item.roteSkill) && <span className="spell-card-rule-line"><strong>{t("ui.roteSkill")}:</strong> {systemTerm(String(item.roteSkill), locale)}</span>}</summary>
          <div className="contract-power-details"><p><strong>{t("ui.summary")}:</strong> {spellItemSummary(item, catalog)}</p>{spellItemReach(item, catalog) && <p><strong>{t("ui.reach")}:</strong> {spellItemReach(item, catalog)}</p>}</div>
        </details>))}
      {Array.from({ length: Math.max(0, minimumRows - items.length) }, (_, index) => <div className="mage-spell-empty" key={`empty-${index}`} aria-label={t("ui.availablePraxisSlot")}>&nbsp;</div>)}
      {!items.length && !minimumRows && <em>{t("ui.noEntries")}</em>}
    </div>);
}
function MeritSheetList({ merits, catalog, }: {
    character: CharacterSheet;
    merits: CharacterSheet["merits"];
    updateSheet: (sheet: CharacterSheet) => void;
    catalog: readonly MeritDefinition[];
}) {
    const { locale, t } = useLanguage();
    const availableCatalog = catalog, visible = merits.filter((item) => !item.grantedBy || ["Ordem", "Nameless Order"].includes(String(item.grantedBy)));
    return (<div className="sheet-merits single-column">
      {visible.length ? (visible.map((item, index) => {
            const definition = availableCatalog.find((entry) => entry.name === item.name);
            const tooltip = definition
                ? `${definition.prerequisites ? `${t("ui.prerequisites")}: ${definition.prerequisites}\n` : ""}${definition.description}`
                : item.source;
            return (<div className="sheet-merit-row" key={`${item.name}-${index}`} title={tooltip}>
              <div className="sheet-merit-main">
                <span>{meritLabel(item, catalog, locale)}</span>
                <DotValue value={item.dots} max={Math.max(5, item.dots)}/>
              </div>
            </div>);
        })) : (<em>{t("ui.noMeritSelected")}</em>)}
    </div>);
}
function MageArcanaList({ arcana, presentation }: {
  arcana: Record<string, number>;
  presentation: (name: string) => { note?: string };
}) {
  return <div className="arcana-sheet-list">{Object.entries(arcana).map(([name, value]) => {
    const note = presentation(name).note;
    return <div className="mage-arcana-line" key={name}><TraitLine name={name} value={Number(value)}/>{note && <small>{note}</small>}</div>;
  })}</div>;
}
function MageOrderSummary({ data }: {
    data: Record<string, unknown>;
}) {
    const { locale, t } = useLanguage();
    const raw = data.custom_order;
    const custom = raw && typeof raw === "object" ? raw as Record<string, unknown> : undefined;
    const orderKey = String(data.order ?? "Orderless");
    const name = orderKey === "Orderless"
        ? t("ui.orderless")
        : String(custom?.name || (locale === "en-US" ? orderKey : MTA_ORDER_LABELS[orderKey] ?? orderKey));
    const description = orderKey === "Nameless" ? t("ui.anOrderWithoutARecognizedNameAmongThe") : String(custom?.description || (MTA_ORDER_DESCRIPTIONS[orderKey]?.[locale === "pt-BR" ? 0 : 1] ?? ""));
    const skills = orderKey === "Nameless"
        ? stringList(data.rote_skills)
        : Array.isArray(custom?.roteSkills)
            ? custom.roteSkills.map(String).filter(Boolean)
            : [...(MTA_ORDERS[orderKey as keyof typeof MTA_ORDERS] ?? [])];
    return (<section className="mage-order-summary">
      <SheetHeading>{t("ui.order")}</SheetHeading>
      <strong>{name}</strong>
      {description && <p>{description}</p>}
      {skills.length > 0 && <small><strong>{t("ui.roteSkills")}:</strong> {skills.map((skill) => systemTerm(skill, locale)).join(", ")}</small>}
    </section>);
}
function spellItemSummary(item: Record<string, unknown>, catalog: readonly SpellDefinition[]) {
    const current = catalog.find(spell => spell.id === String(item.id ?? "") || spell.originalName === String(item.originalName ?? item.name ?? ""));
    const reviewedSummary = String(current?.summary ?? item.summary ?? "").trim();
    if (reviewedSummary)
        return reviewedSummary;
    const description = String(current?.description ?? item.description ?? "").trim() ||
        "Descrição não disponível.";
    return description.match(/^.*?[.!?](?:\s|$)/)?.[0]?.trim() || description;
}
function spellItemReach(item: Record<string, unknown>, catalog: readonly SpellDefinition[]) { const current = catalog.find(spell => spell.id === String(item.id ?? "") || spell.originalName === String(item.originalName ?? item.name ?? "")), description = String(current?.description ?? item.description ?? "").trim(), index = description.search(/(?:Add [A-Za-z]+\s*[•●\d]+:\s*)?\+\d+ Reach:/i); return index < 0 ? "" : description.slice(index).replace(/\s+(?=(?:Add [A-Za-z]+\s*[•●\d]+:\s*)?\+\d+ Reach:)/gi, " · "); }
function selectedConditionList(value: unknown, catalog: readonly ConditionDefinition[]): CoreSelectedCondition[] {
    if (!Array.isArray(value))
        return [];
    return value
        .map((item) => typeof item === "string"
        ? {
            id: item,
            persistent: Boolean(catalog.find((condition) => condition.id === item)?.persistent),
        }
        : item && typeof item === "object"
            ? {
                id: String((item as Record<string, unknown>).id ?? ""),
                persistent: Boolean((item as Record<string, unknown>).persistent),
                instanceId: String((item as Record<string, unknown>).instanceId ?? "") || undefined,
                animalId: String((item as Record<string, unknown>).animalId ?? "") || undefined,
                animalName: String((item as Record<string, unknown>).animalName ?? "") || undefined,
            }
            : null)
        .filter((item): item is CoreSelectedCondition => Boolean(item?.id));
}
function objectList(value: unknown) {
    return Array.isArray(value) ? (value as Array<Record<string, unknown>>) : [];
}
