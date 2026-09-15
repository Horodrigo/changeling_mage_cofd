"use client";
import { MeritConfigurationEditor } from "@/app/builder/merit-configuration-editor";
import { CharacterPaperShell,SheetField as CommonSheetField,EditableList,NotesArea,PowerResource,ResourceTrack,boundedNumber,updateLineData } from "@/app/workspace/character-paper-shell";
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
import { MTA_ORDERS, MTA_ORDER_DESCRIPTIONS, MTA_ORDER_LABELS, MTA_PATHS } from "./creation-rules";
import { refundMageAdvancement,type MageAdvancementUndo } from "@/lib/experience-refunds";
import type { GameLineSheetProps } from "@/lib/game-line-contracts/game-line-ui";
import { useLanguage,type Locale } from "@/lib/i18n";
import { findLegacy,normalizeLegacyState } from "@/lib/legacies";
import type { MageCondition } from "@/lib/mage-conditions";
import { mageNimbusConnection,mageNimbusTiltBudget,normalizeNimbusTiltEffects } from "@/lib/mage-nimbus";
import { expandedConfigurationLines, findMeritConfiguration, isInlineMeritConfiguration, meritConfigurationTitle, MAGE_SHEET_MERIT_CONFIGURATIONS, normalizeMeritConfiguration, synchronizeMeritGrants } from "./sheet-merit-configurations";
import type { MeritDefinition } from "@/lib/merits";
import { normalizeDamage,powerResourceLimits } from "@/lib/resource-rules";
import { systemTerm } from "@/lib/system-terms";
import { createRandomId } from "@/lib/random-id";
import { Plus,Trash2 } from "lucide-react";
import { useState } from "react";
import { MageStructuredMeritEditor } from "./merit-configuration-editor";
import { CompanionPage as MageCompanionPage } from "./companion-page";
export function MageCharacterPaper({ character, updateState, updateSheet, catalogs, }: GameLineSheetProps) {
    if (!catalogs)
        throw new Error("Mage sheet requires its catalog snapshot.");
    const spellCatalog = catalogs.get<readonly SpellDefinition[]>("mage-spells");
    const meritCatalog = [...catalogs.get<readonly MeritDefinition[]>("core-merits"), ...catalogs.get<readonly MeritDefinition[]>("mage-merits")];
    const conditionCatalog = [
        ...catalogs.get<{ conditions: MageCondition[] }>("core-reference").conditions.filter((condition) => condition.sourceCode === "CofD" || condition.sourceCode === "HL"),
        ...catalogs.get<readonly MageCondition[]>("mage-reference"),
    ];
    const { locale, tr } = useLanguage();
    const isMobile = useIsMobile();
    const [sheetTab, setSheetTab] = useState(isMobile ? "resumo" : "principal");
    const isExpanded = (name: string) => meritCatalog.some((item) => item.name === name && item.levels?.length) ||
        name === "Contacts" ||
        name === "Multilingual";
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
    const legacyDisplay = legacyState?.joined ? legacyDefinition?.name ?? "Legacy" : gnosis >= 3 ? tr("Join/Create", "Join/Create") : gnosis >= 2 ? tr("Join", "Join") : "";
    const pathDefinition = MTA_PATHS[String(data.path) as keyof typeof MTA_PATHS];
    const sameSystemTerm = (left: string, right: string) => systemTerm(left, "en-US") === systemTerm(right, "en-US");
    const arcanaPresentation = (name: string) => {
        const pathRuling = Boolean(pathDefinition?.ruling.some(item => sameSystemTerm(String(item), name)));
        const legacyRuling = Boolean(legacyState?.joined && legacyDefinition && sameSystemTerm(legacyDefinition.rulingArcanum, name));
        const inferior = Boolean(pathDefinition?.inferior && sameSystemTerm(String(pathDefinition.inferior), name));
        return { note: legacyRuling ? tr("Regente da Legacy", "Legacy Ruling") : pathRuling ? tr("Regente", "Ruling") : inferior ? tr("Inferior", "Inferior") : undefined };
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
    const addHubrisCondition = (id: "megalomaniacal" | "rampant", persistent: boolean) => {
        const next = structuredClone(character);
        const history = Array.isArray(next.current_state.mage_experience_history)
            ? next.current_state.mage_experience_history
            : [];
        const wisdom = Math.max(1, Number(next.line_data.wisdom ?? 7));
        const entry = {
            id: createRandomId(),
            description: tr("Falha em Ato de Hubris: -1 Sabedoria", "Act of Hubris failure: -1 Wisdom"),
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
        };
        next.line_data = { ...next.line_data, wisdom: Math.max(1, wisdom - 1) };
        next.current_state = {
            ...next.current_state,
            conditions: [...selectedConditionList(next.current_state.conditions, conditionCatalog).filter(item => item.id !== id), { id, persistent }],
            mage_experience_history: [entry, ...history].slice(0, 100),
        };
        updateSheet(next);
    };
    if (isMobile) {
        const identity = [
            ["Nome", character.character.name], ["Jogador", character.character.player],
            ["Crônica", character.character.chronicle], ["Vício", data.vice], ["Virtude", data.virtue],
            ["Conceito", character.character.concept], ["Nome das Sombras", data.shadow_name],
            ["Caminho", data.path], ["Ordem", !data.order || data.order === "Orderless" ? tr("Sem Ordem", "Orderless") : data.order === "Nameless" ? "Nameless" : locale === "en-US" ? data.order : MTA_ORDER_LABELS[String(data.order)] ?? data.order],
        ];
        const paradoxConditions = conditionCatalog.filter((condition) => `${condition.name} ${condition.description} ${condition.penalty}`.toLocaleLowerCase("pt-BR").includes("paradoxo"));
        return (<CharacterPaperShell line="MtA" mobile title={tr("MAGO", "MAGE")} subtitle={tr("O DESPERTAR", "THE AWAKENING")}>
        <SwipeableSheetTabs value={sheetTab} onValueChange={setSheetTab} tabs={[
                { value: "resumo", label: tr("Resumo", "Summary") }, { value: "stats", label: "Stats" },
                { value: "detalhes", label: tr("Detalhes", "Details") },
                { value: "poderes", label: tr("Poderes", "Powers") },
                ...([]),
                ...(hasLegacyAccess ? [{ value: "legacy", label: "Legacy", hidden: !legacyState?.joined }] : []),
                { value: "combate", label: tr("Combate", "Combat") },
                ...(hasCompanions ? [{ value: "companheiros", label: tr("Companheiros", "Companions") }] : []), { value: "anotacoes", label: tr("Anotações", "Notes") },
            ]}>
          {{
                resumo: <>
              <section className="sheet-identity-grid">{identity.map(([label, value]) => <CommonSheetField key={String(label)} label={String(label)} value={value}/>)}{<LegacySheetField value={legacyDisplay} enabled={hasLegacyAccess} onOpen={() => setSheetTab("legacy")}/>}</section>
              <SheetHeading>Experiência</SheetHeading>
              {<MageExperiencePanel character={character} updateSheet={updateSheet} catalogs={catalogs}/>}
              {<><SheetHeading>Méritos Expandidos</SheetHeading><ExpandedMeritList merits={expandedMerits} character={character} updateSheet={updateSheet} catalog={meritCatalog}/></>}
              {<div className="sheet-bottom-grid mage-bottom-grid"><section><SheetHeading>Condições</SheetHeading><CoreConditionManager selected={selectedConditions} catalog={conditionCatalog} onChange={(value) => setState("conditions", value)}/></section><section><SheetHeading>Aspirações</SheetHeading><EditableList values={aspirations} minimum={3} maximum={3} placeholder={tr("Escreva uma Aspiração", "Write an Aspiration")} onChange={(value) => updateLineData(updateSheet, character, "aspirations", value)}/></section><section><SheetHeading>Obsessões</SheetHeading><EditableList values={stringList(data.obsessions)} minimum={obsessionSlots} maximum={obsessionSlots} placeholder={tr("Escreva uma Obsessão", "Write an Obsession")} onChange={(value) => updateLineData(updateSheet, character, "obsessions", value)}/></section></div>}
            </>,
                stats: <>
              <SheetHeading>Atributos</SheetHeading>
              <div className="mobile-attribute-grid">{Object.entries(ATTRIBUTES).map(([category, names]) => <TraitBlock key={category} title={category} names={names} values={character.attributes} compactNames/>)}</div>
              <SheetHeading>Perícias</SheetHeading>
              <div className="mobile-trait-stack">{Object.entries(SKILLS).map(([category, names]) => <TraitBlock key={category} title={category} names={names} values={effectiveSkills} specialties={specialties} highlightedNames={highlightedSkills} highlightTone={skillHighlightTone}/>)}</div>
            </>,
                detalhes: <>
              <SheetHeading>Méritos</SheetHeading><MeritSheetList character={character} merits={principalMerits} updateSheet={updateSheet} catalog={meritCatalog}/>
              <MageOrderSummary data={data}/>
              <SheetHeading>Feitiços Ativos</SheetHeading><EditableList values={stringList(character.current_state?.active_spells)} minimum={gnosis} maximum={gnosis} placeholder={tr("Feitiço ativo", "Active spell")} onChange={(value) => setState("active_spells", value)}/>
            </>,
                poderes: <>
              <PowerResource name="Gnose" rating={powerRating} resourceName="Mana" current={currentResource} maximum={resource.maximum} perTurn={resource.perTurn} onChange={(value) => setState(resourceKey, value)}/>
              <SheetHeading>Arcanos</SheetHeading><div className="arcana-sheet-list">{Object.entries(arcana).map(([name, value]) => <TraitLine key={name} name={name} value={Number(value)} {...arcanaPresentation(name)}/>)}</div>
              <MageWisdomSection wisdom={Number(data.wisdom ?? 7)} gnosis={gnosis} inuredSpells={inuredSpells} available={availableInuredSpells} locale={locale} onAdd={addInuredSpell} onRemove={removeInuredSpell} onHubris={addHubrisCondition}/>
              <SheetHeading>Rotas</SheetHeading><SpellColumn items={rotes} catalog={spellCatalog} showSkill/>
              <SheetHeading>Ferramentas Mágicas</SheetHeading><EditableList values={stringList(data.magical_tools).length ? stringList(data.magical_tools) : [String(data.dedicated_tool ?? "")]} minimum={3} maximum={3} firstPrefix={tr("Ferramenta Dedicada:", "Dedicated Tool:")} placeholder={tr("Ferramenta mágica", "Magical tool")} onChange={(value) => updateLineData(updateSheet, character, "magical_tools", value)}/>
              <SheetHeading>Inclinação do Nimbus</SheetHeading><NimbusEditor wisdom={Number(data.wisdom ?? 7)} gnosis={gnosis} values={stringList(data.nimbus_tilt)} effects={nimbusEffects} onChange={(value) => updateLineData(updateSheet, character, "nimbus_tilt", value)} onEffectsChange={setNimbusEffects}/>
              <div className="sheet-heading-action"><SheetHeading>Práxis</SheetHeading>{praxes.length < gnosis && <ExperiencePowerPicker kind="Práxis" items={availablePraxes} selectedId="" onSelect={addGrantedPraxis} compact/>}</div><SpellColumn items={praxes} catalog={spellCatalog} minimumRows={gnosis} onRemove={removePraxis}/>
              <SheetHeading>Attainments</SheetHeading><MageAttainmentList arcana={arcana}/>
              <SheetHeading>Condições do Paradoxo</SheetHeading><CoreConditionManager selected={selectedConditions} catalog={paradoxConditions} onChange={(value) => setState("conditions", value)}/>
            </>,
                legacy: <LegacyPage character={character} updateSheet={updateSheet} onDiscard={() => setSheetTab("resumo")}/>,
                combate: <>
              <SheetHeading>Vitalidade</SheetHeading><HealthTrack health={health} damage={damage} onChange={(value) => setState("health_damage", value)}/>
              <SheetHeading>Força de Vontade</SheetHeading><ResourceTrack label="Força de Vontade" current={currentWillpower} maximum={willpower} onChange={(value) => setState("willpower_current", value)}/>
              <CombatPage character={character} derived={derived} updateSheet={updateSheet}/>
            </>,
                companheiros: <div className="companions-page"><MageCompanionPage character={character} updateSheet={updateSheet}/><CoreCompanionPage character={character} updateSheet={updateSheet}/></div>,
                anotacoes: <><SheetHeading>Anotações</SheetHeading><NotesArea value={notes} onChange={(value) => setState("notes", value)}/></>,
            }}
        </SwipeableSheetTabs>
      </CharacterPaperShell>);
    }
    return (<CharacterPaperShell line="MtA" title={tr("MAGO", "MAGE")} subtitle={tr("O DESPERTAR", "THE AWAKENING")}>
      {(<Tabs value={sheetTab} onValueChange={setSheetTab} className="ctl-sheet-tabs mta-sheet-tabs">
          <TabsList className="ctl-sheet-tab-list" aria-label={tr("Páginas da ficha de Mago", "Mage character pages")}>
            <TabsTrigger value="principal">{tr("Principal", "Main")}</TabsTrigger>
            <TabsTrigger value="magia">{tr("Detalhes", "Details")}</TabsTrigger>
            {legacyState?.joined && <TabsTrigger value="legacy" data-legacy-tab-trigger>Legacy</TabsTrigger>}
            <TabsTrigger value="combate">{tr("Combate", "Combat")}</TabsTrigger>
            {hasCompanions && <TabsTrigger value="companheiros">{tr("Companheiros", "Companions")}</TabsTrigger>}
          </TabsList>
          <TabsContent value="principal" data-page-title="Principal" className="ctl-sheet-page">
            <section className="sheet-identity-grid">
              <CommonSheetField label="Nome das Sombras" value={data.shadow_name}/>
              <CommonSheetField label="Virtude" value={data.virtue}/>
              <CommonSheetField label="Caminho" value={data.path}/>
              <CommonSheetField label="Jogador" value={character.character.player}/>
              <CommonSheetField label="Vício" value={data.vice}/>
              <CommonSheetField label="Ordem" value={!data.order || data.order === "Orderless" ? tr("Sem Ordem", "Orderless") : data.order === "Nameless" ? "Nameless" : locale === "en-US" ? data.order : MTA_ORDER_LABELS[String(data.order)] ?? data.order}/>
              <CommonSheetField label="Crônica" value={character.character.chronicle}/>
              <CommonSheetField label="Conceito" value={character.character.concept}/>
              <LegacySheetField value={legacyDisplay} enabled={hasLegacyAccess} onOpen={() => setSheetTab("legacy")}/>
            </section>
            <SheetHeading>Atributos</SheetHeading>
            <div className="official-trait-grid">
              {Object.entries(ATTRIBUTES).map(([category, names]) => (<TraitBlock key={category} title={category} names={names} values={character.attributes}/>))}
            </div>
            <div className="official-sheet-body">
              <div className="sheet-skills-column">
                <SheetHeading>Perícias</SheetHeading>
                {Object.entries(SKILLS).map(([category, names]) => (<TraitBlock key={category} title={category} names={names} values={effectiveSkills} specialties={specialties} highlightedNames={highlightedSkills} highlightTone="rote"/>))}
              </div>
              <div className="sheet-center-column">
                <SheetHeading>Méritos</SheetHeading>
                <MeritSheetList character={character} merits={principalMerits} updateSheet={updateSheet} catalog={meritCatalog}/>
                <SheetHeading>Méritos Expandidos</SheetHeading>
                <ExpandedMeritList merits={expandedMerits} character={character} updateSheet={updateSheet} catalog={meritCatalog}/>
                <MageOrderSummary data={data}/>
                <SheetHeading>Arcanos</SheetHeading>
                <div className="arcana-sheet-list">
                  {Object.entries(arcana).map(([name, value]) => <TraitLine key={name} name={name} value={Number(value)} {...arcanaPresentation(name)}/>)}
                </div>
                <MageWisdomSection wisdom={Number(data.wisdom ?? 7)} gnosis={gnosis} inuredSpells={inuredSpells} available={availableInuredSpells} locale={locale} onAdd={addInuredSpell} onRemove={removeInuredSpell} onHubris={addHubrisCondition}/>
              </div>
              <div className="sheet-right-column">
                <SheetHeading>Vitalidade</SheetHeading>
                <HealthTrack health={health} damage={damage} onChange={(value) => setState("health_damage", value)}/>
                <SheetHeading>Força de Vontade</SheetHeading>
                <ResourceTrack label="Força de Vontade" current={currentWillpower} maximum={willpower} onChange={(value) => setState("willpower_current", value)}/>
                <PowerResource name="Gnose" rating={powerRating} resourceName="Mana" current={currentResource} maximum={resource.maximum} perTurn={resource.perTurn} onChange={(value) => setState(resourceKey, value)}/>
                <MageExperiencePanel character={character} updateSheet={updateSheet} catalogs={catalogs}/>
              </div>
            </div>
            <div className="sheet-bottom-grid mage-bottom-grid">
              <section><SheetHeading>Condições</SheetHeading><CoreConditionManager selected={selectedConditions} catalog={conditionCatalog} onChange={(value) => setState("conditions", value)}/></section>
              <section><SheetHeading>Aspirações</SheetHeading><EditableList values={aspirations} minimum={3} maximum={3} placeholder={tr("Escreva uma Aspiração", "Write an Aspiration")} onChange={(value) => updateLineData(updateSheet, character, "aspirations", value)}/></section>
              <section><SheetHeading>Obsessões</SheetHeading><EditableList values={stringList(data.obsessions)} minimum={obsessionSlots} maximum={obsessionSlots} placeholder={tr("Escreva uma Obsessão", "Write an Obsession")} onChange={(value) => updateLineData(updateSheet, character, "obsessions", value)}/></section>
            </div>
          </TabsContent>
          <TabsContent value="magia" data-page-title="Detalhes" className="ctl-sheet-page powers-page mage-spell-page">
            <div className="mage-page-355-grid">
              <section className="mage-page-left">
                <SheetHeading>Feitiços Ativos</SheetHeading>
                <EditableList values={stringList(character.current_state?.active_spells)} minimum={gnosis} maximum={gnosis} placeholder={tr("Feitiço ativo", "Active spell")} onChange={(value) => setState("active_spells", value)}/>
                <SheetHeading>Attainments</SheetHeading>
                <MageAttainmentList arcana={arcana}/>
                <div className="sheet-heading-action"><SheetHeading>Práxis</SheetHeading>{praxes.length < gnosis && <ExperiencePowerPicker kind="Práxis" items={availablePraxes} selectedId="" onSelect={addGrantedPraxis} compact/>}</div>
                <SpellColumn items={praxes} catalog={spellCatalog} minimumRows={gnosis} onRemove={removePraxis}/>
              </section>
              <section className="mage-page-main">
                <SheetHeading>Rotas</SheetHeading>
                <SpellColumn items={rotes} catalog={spellCatalog} showSkill/>
                <SheetHeading>Ferramentas Mágicas</SheetHeading>
                <EditableList values={stringList(data.magical_tools).length ? stringList(data.magical_tools) : [String(data.dedicated_tool ?? "")]} minimum={3} maximum={3} firstPrefix={tr("Ferramenta Dedicada:", "Dedicated Tool:")} placeholder={tr("Ferramenta mágica", "Magical tool")} onChange={(value) => updateLineData(updateSheet, character, "magical_tools", value)}/>
                <SheetHeading>Inclinação do Nimbus</SheetHeading>
                <NimbusEditor wisdom={Number(data.wisdom ?? 7)} gnosis={gnosis} values={stringList(data.nimbus_tilt)} effects={nimbusEffects} onChange={(value) => updateLineData(updateSheet, character, "nimbus_tilt", value)} onEffectsChange={setNimbusEffects}/>
                <SheetHeading>Anotações</SheetHeading>
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
    </CharacterPaperShell>);
}
function LegacySheetField({ value, enabled, onOpen }: {
    value: string;
    enabled: boolean;
    onOpen: () => void;
}) {
    return <div className={`official-field legacy-sheet-field${enabled ? " enabled" : ""}`}><span>Legacy</span>{enabled ? <button type="button" onClick={onOpen}>{value}</button> : <strong>{value}</strong>}</div>;
}
function meritLabel(item: CharacterSheet["merits"][number], catalog: readonly MeritDefinition[], locale: Locale = "en-US") {
    const definition = catalog.find((entry) => entry.name === item.name);
    const base = locale === "en-US"
        ? definition?.name ?? item.name
        : definition?.translatedName ??
            (item.name === "Hollow" ? "Recanto" : item.name), detail = meritConfigurationTitle(item.configuration);
    return detail ? `${base}: ${detail}` : base;
}
function ExpandedMeritList({ merits, character, updateSheet, catalog, hasAdjacentContent = false }: {
    merits: CharacterSheet["merits"];
    character?: CharacterSheet;
    updateSheet?: (sheet: CharacterSheet) => void;
    catalog: readonly MeritDefinition[];
    hasAdjacentContent?: boolean;
}) {
    const { locale, tr } = useLanguage();
    const visible = merits.filter((item) => (!item.grantedBy || item.grantedBy === "Nameless Order") && item.name !== "Familiar");
    return (<div className="expanded-merit-list">
      {visible.map((item, itemIndex) => {
            const style = catalog.find((entry) => entry.name === item.name && entry.levels?.length), configured = expandedConfigurationLines(item.name, item.dots, item.configuration, locale), cult = String(normalizeMeritConfiguration(item.configuration).cult ?? ""), title = meritLabel(item, catalog, locale), meritIndex = character?.merits.indexOf(item) ?? -1, configurationEditor = character && updateSheet && findMeritConfiguration(item.name) && !isInlineMeritConfiguration(item.name) && item.name !== "Familiar"
                ? <MeritConfigurationEditor compact merit={item} ownedMerits={character.merits} catalog={[...catalog]} definitions={MAGE_SHEET_MERIT_CONFIGURATIONS} renderStructured={(props) => <MageStructuredMeritEditor {...props}/>} onChange={(configuration) => { const next = structuredClone(character); const target = next.merits[meritIndex]; if (target)
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
                    {tr("Consulte a descrição deste Mérito para distribuir ou usar suas características internas.", "See this Merit's description to assign or use its internal traits.")}
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
                  {item.grantedBy !== "Nameless Order" && <> · {tr("Pré-requisitos", "Prerequisites")}: {style.prerequisites || tr("Nenhum", "None")}</>}
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
      {!visible.length && !hasAdjacentContent && <p className="rule-callout expanded-merit-empty">{tr("Nenhum Mérito Expandido adquirido.", "No Expanded Merits purchased.")}</p>}
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
    onHubris: (id: "megalomaniacal" | "rampant", persistent: boolean) => void;
}) {
    const { tr } = useLanguage();
    const [open, setOpen] = useState(false), [failed, setFailed] = useState(false), [condition, setCondition] = useState<"megalomaniacal" | "rampant">("megalomaniacal"), [persistent, setPersistent] = useState(false);
    const close = () => { setOpen(false); setFailed(false); setPersistent(false); };
    return <div className="wisdom-sheet-section">
    <div className="wisdom-heading-row"><SheetHeading>Sabedoria</SheetHeading><Button type="button" size="sm" variant="outline" className="builder-add-action" onClick={() => setOpen(true)}>Hubris</Button></div>
    <div className="wisdom-track"><DotValue value={wisdom} max={10} singleRow/></div>
    <div className="inured-heading-row"><strong>{tr("Feitiços Inured", "Inured Spells")} ({inuredSpells.length}/{gnosis})</strong>{inuredSpells.length < gnosis && <ExperiencePowerPicker kind="Feitiço" items={available} selectedId="" onSelect={onAdd} compact/>}</div>
    <small>{tr("Após perder Sabedoria pelo uso de uma magia, ela pode ser Inured: usos futuros não causam essa perda, mas sempre provocam um risco básico de Paradoxo de dois dados. MtA, p. 88.", "After losing Wisdom from using a spell, it may be Inured: future uses do not cause that loss, but always provoke a base two-die Paradox risk. MtA, p. 88.")}</small>
    <div className="inured-spell-list">{inuredSpells.map(item => <div key={String(item.id)}><span>{String(locale === "en-US" ? item.originalName ?? item.name : item.name ?? item.originalName)}</span><Button type="button" variant="ghost" size="sm" className="compact-remove-action" onClick={() => onRemove(String(item.id))}><Trash2 /> {tr("Remover", "Remove")}</Button></div>)}</div>
    <Dialog open={open} onOpenChange={value => { setOpen(value); if (!value) {
        setFailed(false);
        setPersistent(false);
    } }}><DialogContent><DialogHeader><DialogTitle>{tr("Ato de Hubris", "Act of Hubris")}</DialogTitle><DialogDescription>{failed ? tr("Escolha a Condição causada pela falha.", "Choose the Condition caused by the failure.") : tr("Qual foi o resultado do teste?", "What was the result of the roll?")}</DialogDescription></DialogHeader>{failed ? <div className="hubris-dialog-options"><label>{tr("Condição", "Condition")}<RuleSelect value={condition} onChange={value => setCondition(value as typeof condition)} options={[{ value: "megalomaniacal", label: "Megalomaniacal" }, { value: "rampant", label: "Rampant" }]}/></label><label className="hubris-persistent"><input type="checkbox" checked={persistent} onChange={event => setPersistent(event.target.checked)}/><span>{tr("Persistente", "Persistent")}</span></label></div> : <div className="dialog-choice-actions"><Button type="button" variant="outline" onClick={close}>{tr("Sucesso", "Success")}</Button><Button type="button" variant="destructive" onClick={() => setFailed(true)}>{tr("Falha", "Failure")}</Button></div>}<DialogFooter>{failed && <Button type="button" onClick={() => { onHubris(condition, persistent); close(); }}>{tr("Aplicar Condição", "Apply Condition")}</Button>}</DialogFooter></DialogContent></Dialog>
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
    const { locale, tr } = useLanguage();
    const descriptions = [...values.slice(0, 3)];
    while (descriptions.length < 3)
        descriptions.push("");
    const connection = mageNimbusConnection(wisdom);
    const connectionLabel = connection === "Strong" ? tr("Forte", "Strong") : connection === "Medium" ? tr("Média", "Medium") : tr("Fraca", "Weak");
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
      <header><strong>{tr("Nimbus de Longo Prazo", "Long-Term Nimbus")}</strong><Badge variant="outline">{tr("Conexão simpática", "Sympathetic connection")}: {connectionLabel}</Badge></header>
      <small>{tr("O alcance é calculado automaticamente a partir da Sabedoria.", "Range is calculated automatically from Wisdom.")} · MtA, p. 89</small>
      <Input value={descriptions[0]} onChange={event => setDescription(0, event.target.value)} placeholder={tr("Coincidências e efeitos sutis ao redor do mago", "Subtle coincidences and effects surrounding the mage")}/>
    </article>
    <article>
      <header><strong>{tr("Nimbus Imediato", "Immediate Nimbus")}</strong><Badge variant="outline">{allocated}/{budget} {tr("dados alocados", "dice allocated")}</Badge></header>
      <small>{tr("Defina a aparência e distribua bônus ou penalidades entre Atributos e Perícias.", "Define its appearance and distribute bonuses or penalties among Attributes and Skills.")} · MtA, p. 90</small>
      <Input value={descriptions[1]} onChange={event => setDescription(1, event.target.value)} placeholder={tr("Aparência ou sensação do Nimbus e seu Tilt", "Appearance or sensation of the Nimbus and its Tilt")}/>
      <div className="nimbus-effects">
        {effects.map((effect, index) => {
            const withoutCurrent = allocated - Math.abs(effect.modifier);
            const allowed = Array.from({ length: budget * 2 }, (_, item) => item < budget ? item - budget : item - budget + 1).filter(value => withoutCurrent + Math.abs(value) <= budget);
            return <div key={`${effect.trait}-${index}`}>
            <Select value={effect.trait} onValueChange={value => updateEffect(index, { trait: value })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{traits.filter(trait => trait === effect.trait || !effects.some((item, itemIndex) => itemIndex !== index && item.trait === trait)).map(trait => <SelectItem key={trait} value={trait}>{systemTerm(trait, locale)}</SelectItem>)}</SelectContent></Select>
            <Select value={String(effect.modifier)} onValueChange={value => updateEffect(index, { modifier: Number(value) })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{allowed.map(value => <SelectItem key={value} value={String(value)}>{value > 0 ? `+${value}` : value}</SelectItem>)}</SelectContent></Select>
            <Button type="button" variant="ghost" size="sm" className="compact-remove-action" onClick={() => onEffectsChange(effects.filter((_, itemIndex) => itemIndex !== index))}><Trash2 /> {tr("Remover", "Remove")}</Button>
          </div>;
        })}
        {allocated < budget && unused.length > 0 && <Button type="button" variant="outline" size="sm" className="builder-add-action" onClick={() => onEffectsChange([...effects, { trait: unused[0], modifier: 1 }])}><Plus /> {tr("Adicionar efeito", "Add effect")}</Button>}
      </div>
    </article>
    <article>
      <header><strong>{tr("Nimbus de Assinatura", "Signature Nimbus")}</strong></header>
      <small>{tr("Descreva o resíduo identificável deixado pela magia do personagem.", "Describe the recognizable residue left by the character's magic.")} · MtA, pp. 89–90</small>
      <Input value={descriptions[2]} onChange={event => setDescription(2, event.target.value)} placeholder={tr("Descrição da assinatura mágica", "Magical signature description")}/>
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
    const { locale, tr } = useLanguage();
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
            name: tr("Contramágica", "Counterspell"),
            arcana: one,
            description: tr("Desfaz a Imago de um feitiço observado com Visão Mágica Ativa por meio de um Confronto de Vontades.", "Unravel the Imago of a spell observed with Active Mage Sight through a Clash of Wills."),
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
            name: tr("Armadura do Mago", "Mage Armor"),
            arcana: two,
            description: tr("Ativa uma proteção correspondente a um dos Arcanos dominados; somente uma forma pode permanecer ativa por vez.", "Activate protection corresponding to a mastered Arcanum; only one form may remain active at a time."),
        });
    if (three.length)
        rows.push({
            name: tr("Invocação Direcionada", "Targeted Summoning"),
            arcana: three,
            description: tr("Ao invocar um ser Superno, permite especificar um segundo Arcano para refinar o alvo da invocação.", "When summoning a Supernal being, specify a second Arcanum to refine the target."),
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
            name: tr("Criar Rota", "Create Rote"),
            arcana: five,
            description: tr("Permite codificar como Rota um feitiço cujos Arcanos tenham sido dominados.", "Encode as a Rote a spell whose Arcana have been mastered."),
        });
    return (<div className="mage-attainment-list">
      {rows.map((row) => (<div key={`${row.name}-${row.arcana.join("-")}`} title={row.description}>
          <strong>
            {row.name} ({row.arcana.join(", ")})
          </strong>
          <small>{row.description}</small>
        </div>))}
      {!rows.length && <em>{tr("Nenhum Attainment adquirido.", "No Attainments acquired.")}</em>}
    </div>);
}
function SpellColumn({ items, catalog, showSkill = false, minimumRows = 0, onRemove, }: {
    items: Array<Record<string, unknown>>;
    catalog: readonly SpellDefinition[];
    showSkill?: boolean;
    minimumRows?: number;
    onRemove?: (item: Record<string, unknown>) => void;
}) {
    const { locale, tr } = useLanguage();
    const arcanaSource = (item: Record<string, unknown>) => `${Object.entries((item.requirements ?? {}) as Record<string, number>).map(([name, dots]) => `${systemTerm(name, locale)} ${"•".repeat(dots)}`).join(" + ")} · ${String(item.source ?? "")} · p. ${String(item.page ?? "—")}`;
    return (<div className="mage-spell-lines">
      {items.map((item, index) => (<details className="contract-power-card" key={`${String(item.id ?? item.name)}-${index}`}>
          <summary className="contract-power-summary"><strong>{String(locale === "en-US" ? item.originalName ?? item.name : item.name ?? item.originalName ?? "")}</strong>{onRemove && <Button type="button" variant="ghost" size="sm" className="compact-remove-action" onClick={event => { event.preventDefault(); event.stopPropagation(); onRemove(item); }}><Trash2 /> {tr("Remover", "Remove")}</Button>}<small>{arcanaSource(item)}</small><span className="spell-card-rule-line"><strong>{tr("Prática", "Practice")}:</strong> {String(item.practice ?? "")} | <strong>{tr("Fator Primário", "Primary Factor")}:</strong> {String(item.primaryFactor ?? "")}</span>{Boolean(item.withstand) && <span className="spell-card-rule-line"><strong>{tr("Resistência", "Withstand")}:</strong> {String(item.withstand)}</span>}{showSkill && Boolean(item.roteSkill) && <span className="spell-card-rule-line"><strong>{tr("Perícia de Rota", "Rote Skill")}:</strong> {systemTerm(String(item.roteSkill), locale)}</span>}</summary>
          <div className="contract-power-details"><p><strong>{tr("Resumo", "Summary")}:</strong> {spellItemSummary(item, catalog)}</p>{spellItemReach(item, catalog) && <p><strong>{tr("Alcance", "Reach")}:</strong> {spellItemReach(item, catalog)}</p>}</div>
        </details>))}
      {Array.from({ length: Math.max(0, minimumRows - items.length) }, (_, index) => <div className="mage-spell-empty" key={`empty-${index}`} aria-label={tr("Linha de Práxis disponível", "Available Praxis slot")}>&nbsp;</div>)}
      {!items.length && !minimumRows && <em>{tr("Nenhum registro.", "No entries.")}</em>}
    </div>);
}
function MeritSheetList({ character, merits, updateSheet, catalog, }: {
    character: CharacterSheet;
    merits: CharacterSheet["merits"];
    updateSheet: (sheet: CharacterSheet) => void;
    catalog: readonly MeritDefinition[];
}) {
    const { locale, tr } = useLanguage();
    const availableCatalog = catalog, visible = merits.filter((item) => !item.grantedBy || ["Ordem", "Nameless Order"].includes(String(item.grantedBy)));
    return (<div className="sheet-merits single-column">
      {visible.length ? (visible.map((item, index) => {
            const definition = availableCatalog.find((entry) => entry.name === item.name);
            const tooltip = definition
                ? `${definition.prerequisites ? `${tr("Pré-requisitos", "Prerequisites")}: ${definition.prerequisites}\n` : ""}${definition.description}`
                : item.source;
            const inline = isInlineMeritConfiguration(item.name);
            const meritIndex = character.merits.indexOf(item);
            const inlineField = inline ? findMeritConfiguration(item.name)?.fields[0] : undefined;
            const configuration = normalizeMeritConfiguration(item.configuration);
            const displayName = definition ? definition[locale === "en-US" ? "name" : "translatedName"] : item.name;
            return (<div className={`sheet-merit-row${inline ? " has-inline-config" : ""}`} key={`${item.name}-${index}`} title={inline ? undefined : tooltip}>
              <div className="sheet-merit-main">
                <span>{inline ? `${displayName}:` : meritLabel(item, catalog, locale)}</span>
                {inlineField && <Input className="inline-merit-input" aria-label={`${displayName}: ${tr("descrição", "description")}`} value={String(configuration[inlineField.key] ?? "")} placeholder={tr("Escreva aqui", "Type here")} onChange={(event) => {
                        const next = structuredClone(character);
                        const target = next.merits[meritIndex];
                        if (target)
                            target.configuration = { ...configuration, [inlineField.key]: event.target.value };
                        updateSheet(synchronizeMeritGrants(next));
                    }}/>}
                <DotValue value={item.dots} max={Math.max(5, item.dots)}/>
              </div>
            </div>);
        })) : (<em>{tr("Nenhum Mérito selecionado", "No Merit selected")}</em>)}
    </div>);
}
function MageOrderSummary({ data }: {
    data: Record<string, unknown>;
}) {
    const { locale, tr } = useLanguage();
    const raw = data.custom_order;
    const custom = raw && typeof raw === "object" ? raw as Record<string, unknown> : undefined;
    const orderKey = String(data.order ?? "Orderless");
    const name = orderKey === "Orderless"
        ? tr("Sem Ordem", "Orderless")
        : String(custom?.name || (locale === "en-US" ? orderKey : MTA_ORDER_LABELS[orderKey] ?? orderKey));
    const description = orderKey === "Nameless" ? tr("Uma Ordem sem nome reconhecido entre as grandes sociedades dos Despertos.", "An Order without a recognized name among the great societies of the Awakened.") : String(custom?.description || (MTA_ORDER_DESCRIPTIONS[orderKey]?.[locale === "pt-BR" ? 0 : 1] ?? ""));
    const skills = orderKey === "Nameless"
        ? stringList(data.rote_skills)
        : Array.isArray(custom?.roteSkills)
            ? custom.roteSkills.map(String).filter(Boolean)
            : [...(MTA_ORDERS[orderKey as keyof typeof MTA_ORDERS] ?? [])];
    return (<section className="mage-order-summary">
      <SheetHeading>Ordem</SheetHeading>
      <strong>{name}</strong>
      {description && <p>{description}</p>}
      {skills.length > 0 && <small><strong>{tr("Perícias de Rota", "Rote Skills")}:</strong> {skills.map((skill) => systemTerm(skill, locale)).join(", ")}</small>}
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
function selectedConditionList(value: unknown, catalog: readonly MageCondition[]): CoreSelectedCondition[] {
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
