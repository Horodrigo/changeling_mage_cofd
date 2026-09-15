"use client";
import { MeritConfigurationEditor } from "@/app/builder/merit-configuration-editor";
import { ExperiencePanel } from "./experience-panel";
import { CharacterPaperShell,EditableList,NotesArea,PowerResource,ResourceTrack,boundedNumber,updateLineData } from "@/app/workspace/character-paper-shell";
import { CombatPage } from "@/app/workspace/combat-page";
import { CompanionPage } from "./companion-page";
import { CompanionPage as CoreCompanionPage } from "@/app/workspace/companion-page";
import { ConditionManager as CoreConditionManager, type SelectedCondition as CoreSelectedCondition } from "@/app/workspace/condition-manager";
import { EntitlementPage } from "@/app/workspace/entitlement-page";
import { derivedWithPermanentMerits } from "./experience-shared";
import { DotValue,HealthTrack,SheetHeading,TraitBlock,stringList } from "@/app/workspace/sheet-primitives";
import { SwipeableSheetTabs } from "@/app/workspace/sheet-tabs";
import { workspaceTerm } from "@/app/workspace/workspace-i18n";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs,TabsContent,TabsList,TabsTrigger } from "@/components/ui/tabs";
import { useIsMobile } from "@/hooks/use-mobile";
import type { ContractDefinition } from "@/lib/catalog/contract-catalog";
import type { ChangelingCondition } from "@/lib/changeling-conditions";
import type { CourtDefinition } from "@/lib/changeling-courts";
import { kithCreationChoice } from "@/lib/changeling-kith-choices";
import type { KithDefinition } from "@/lib/changeling-kiths";
import { changelingFavoredRegalia } from "@/lib/changeling-regalia";
import { contractDisplayOptions,contractHasInvocationRoll,contractOutcomeSections,contractPresentation,contractSummary,contractWithSupplementalBenefits } from "@/lib/contract-presentation";
import type { CharacterSheet } from "@/lib/core/character/character-types";
import { ATTRIBUTES, SKILLS } from "@/lib/core/character/creation-rules";
import { CTL_SEEMINGS, changelingAnchorDisplayName, changelingAnchorRecovery, normalizeChangelingFrailties, seemingDisplayName, wyrdSummary } from "./creation-rules";
import { entitlementPrerequisitesMet,normalizeEntitlementState,synchronizeEntitlement,type EntitlementDefinition } from "@/lib/entitlements";
import type { GameLineSheetProps } from "@/lib/game-line-contracts/game-line-ui";
import { useLanguage,type Locale } from "@/lib/i18n";
import { CHANGELING_SHEET_MERIT_CONFIGURATIONS, decodeConfiguredRows, expandedConfigurationLines, findMeritConfiguration, isInlineMeritConfiguration, meritConfigurationTitle, normalizeMeritConfiguration, synchronizeMeritGrants, type TokenConfigurationItem } from "./sheet-merit-configurations";
import type { MeritDefinition } from "@/lib/merits";
import { normalizeClarityDamage,normalizeDamage,powerResourceLimits,type ClarityDamageLevel } from "@/lib/resource-rules";
import { systemTerm } from "@/lib/system-terms";
import { useState } from "react";
import { renderChangelingStructuredMeritEditor } from "./builder-merit-editor";

type ChangelingReference = {
    conditions: ChangelingCondition[];
    presentation: Record<string, Partial<ChangelingCondition>>;
    courts: CourtDefinition[];
    entitlements: EntitlementDefinition[];
    kiths: KithDefinition[];
    kithPresentation: Record<string, Pick<KithDefinition, "description" | "blessing" | "skill"> & { name: string }>;
};

function normalizedCatalogName(value: unknown) {
    return String(value ?? "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim().toLocaleLowerCase("pt-BR");
}

function findKithInCatalog(catalog: readonly KithDefinition[], value: unknown) {
    const wanted = normalizedCatalogName(value);
    return catalog.find((item) => [item.id, item.name, item.translatedName].some((candidate) => candidate && normalizedCatalogName(candidate) === wanted));
}

function presentKith(reference: ChangelingReference, value: unknown, locale: Locale, custom = false) {
    const raw = String(value ?? "");
    const definition = findKithInCatalog(reference.kiths, value);
    if (custom || !definition) return { name: raw, description: "", blessing: "", skill: "" };
    return locale === "en-US"
        ? { name: definition.name, description: definition.description, blessing: definition.blessing, skill: definition.skill }
        : reference.kithPresentation[definition.id] ?? { name: definition.translatedName ?? definition.name, description: definition.description, blessing: definition.blessing, skill: definition.skill };
}

function findCourtInCatalog(catalog: readonly CourtDefinition[], value: unknown) {
    const normalized = String(value ?? "").trim().toLocaleLowerCase();
    return catalog.find((item) => [item.id, item.name, item.translatedName, item.name.replace(/ Court$/, "")].some((candidate) => candidate.toLocaleLowerCase() === normalized));
}

function presentCourt(catalog: readonly CourtDefinition[], value: unknown, locale: Locale) {
    const definition = findCourtInCatalog(catalog, value);
    if (!definition) return undefined;
    return {
        ...definition,
        name: locale === "en-US" ? definition.name : definition.translatedName,
        emotion: locale === "en-US" ? definition.emotion : definition.emotionPt,
        mantleBenefits: locale === "en-US" ? definition.mantleBenefits : definition.mantleBenefitsPt,
    };
}

function displayCourt(catalog: readonly CourtDefinition[], value: unknown, locale: Locale) {
    const raw = String(value ?? "");
    if (["sem corte", "courtless"].includes(raw.trim().toLocaleLowerCase())) return locale === "en-US" ? "Courtless" : "Sem Corte";
    return presentCourt(catalog, value, locale)?.name ?? raw;
}
export function ChangelingCharacterPaper({ character, updateState, updateSheet, catalogs, }: GameLineSheetProps) {
    if (!catalogs)
        throw new Error("Changeling sheet requires its catalog snapshot.");
    const contractCatalog = catalogs.get<readonly ContractDefinition[]>("changeling-contracts");
    const meritCatalog = [...catalogs.get<readonly MeritDefinition[]>("core-merits"), ...catalogs.get<readonly MeritDefinition[]>("changeling-merits")];
    const { locale, tr } = useLanguage();
    const coreReference = catalogs.get<{ conditions: ChangelingCondition[]; presentation: Record<string, Partial<ChangelingCondition>> }>("core-reference");
    const lineReference = catalogs.get<ChangelingReference>("changeling-reference");
    const conditionPresentation = { ...coreReference.presentation, ...lineReference.presentation };
    const conditionCatalog = [...coreReference.conditions, ...lineReference.conditions].map((condition) => locale === "pt-BR" ? { ...condition, ...conditionPresentation[condition.id] } : condition);
    const isMobile = useIsMobile();
    const [mobileTab, setMobileTab] = useState({ characterId: character.id, value: "resumo" });
    const sheetTab = mobileTab.characterId === character.id ? mobileTab.value : "resumo";
    const setSheetTab = (value: string) => setMobileTab({ characterId: character.id, value });
    const isExpanded = (name: string) => meritCatalog.some((item) => item.name === name && item.levels?.length) ||
        name === "Contacts" ||
        name === "Multilingual";
    const data = character.line_data;
    const entitlementMerit = character.merits.find((item) => item.name === "Entitlement" && !item.grantedBy);
    const hasCompanions = character.merits.some((item) => !item.grantedBy && ["Fae Mount", "Fae Pet"].includes(item.name)) || selectedConditionList(character.current_state?.conditions, conditionCatalog).some(item => item.id === "bonded");
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
    const kithDefinition = !data.kith_custom ? findKithInCatalog(lineReference.kiths, data.kith) : undefined;
    const kithChoiceDefinition = kithCreationChoice(kithDefinition?.id);
    const kithSkill = canonicalSkill(kithChoiceDefinition?.kind === "skill" ? data.kith_choice : data.kith_skill ?? kithDefinition?.skill);
    const highlightedSkills = new Set<string>((kithSkill ? [kithSkill] : []));
    const skillHighlightTone = "kith" as const;
    const aspirations = stringList(data.aspirations);
    const frailties = normalizeChangelingFrailties(data.frailties, Number(data.wyrd ?? 1));
    const touchstoneSlots = 1 + character.merits
        .filter((merit) => merit.name === "Touchstone" && !merit.grantedBy)
        .reduce((sum, merit) => sum + merit.dots, 0);
    const touchstones = stringList(data.touchstones);
    if (!touchstones.length)
        touchstones.push(String(data.touchstone ?? ""));
    while (touchstones.length < touchstoneSlots)
        touchstones.push("");
    touchstones.splice(touchstoneSlots);
    const oaths = stringList(data.oaths);
    const contracts = [
        ...objectList(data.contracts),
        ...objectList(data.learned_contracts),
    ];
    const powerRating = Number(data.wyrd ?? 1);
    const resource = powerResourceLimits(powerRating);
    const health = Math.max(1, Number(derived.Vitalidade ?? 5));
    const baseWillpower = Math.max(1, Number(derived.ForçaDeVontade ?? 1));
    const lostWillpower = boundedNumber(character.current_state?.willpower_lost_dots, baseWillpower - 1, 0);
    const willpower = Math.max(1, baseWillpower - lostWillpower);
    const damage = normalizeDamage(character.current_state?.health_damage, health);
    const clarityMaximum = Math.max(1, Number(derived.LucidezMaxima ?? derived.ClarezaMaxima ?? 1));
    const clarityDamage = normalizeClarityDamage(character.current_state?.clarity_damage, clarityMaximum);
    const currentWillpower = boundedNumber(character.current_state?.willpower_current, willpower, willpower);
    const resourceKey = "glamour_current";
    const currentResource = boundedNumber(character.current_state?.[resourceKey], resource.maximum, resource.maximum);
    const entitlementState = entitlementMerit ? normalizeEntitlementState(data.entitlement, powerRating, lineReference.entitlements) : null;
    const entitlementDefinition = lineReference.entitlements.find((item) => item.id === entitlementState?.definitionId);
    const hasStoredGlamour = Boolean(entitlementState?.accepted && entitlementState.allocations.some((item) => item.target === "blessing" && item.blessingId === "glamour-gain") && entitlementState.touchstone.status === "active" && entitlementState.touchstone.name.trim() && entitlementDefinition && entitlementPrerequisitesMet(entitlementDefinition, entitlementState, character));
    const storedGlamour = hasStoredGlamour ? boundedNumber(entitlementState?.token.storedGlamour, powerRating, 0) : 0;
    const setStoredGlamour = (value: number) => {
        if (!entitlementMerit || !entitlementState)
            return;
        const next = structuredClone(character), merit = next.merits.find((item) => item.name === "Entitlement" && !item.grantedBy);
        if (!merit)
            return;
        const state = normalizeEntitlementState(next.line_data.entitlement, powerRating, lineReference.entitlements);
        state.token = { ...state.token, storedGlamour: boundedNumber(value, powerRating, 0) };
        next.line_data.entitlement = state;
        updateSheet(synchronizeEntitlement(next, lineReference.entitlements));
    };
    const goblinDebt = boundedNumber(character.current_state?.goblin_debt, 10, 0);
    const expandedMerits = character.merits.filter((item) => isExpanded(item.name) && !item.grantedBy);
    const principalMerits = character.merits.filter((item) => !item.grantedBy || item.grantedBy === "Corte");
    const selectedConditions = [
        ...selectedConditionList(character.current_state?.conditions, conditionCatalog),
        ...stringList(data.merit_granted_conditions).map((id) => ({
            id,
            persistent: false,
        })),
    ].filter((item, index, all) => item.id === "bonded" || all.findIndex((other) => other.id === item.id) === index);
    const notes = String(character.current_state?.notes ?? "");
    const setState = (key: string, value: unknown) => updateState({ ...character.current_state, [key]: value });
    if (isMobile) {
        const identity = [
            ["Nome", character.character.name], ["Jogador", character.character.player],
            ["Crônica", character.character.chronicle], ["Agulha", changelingAnchorDisplayName("needle", data.needle, locale)], ["Fio", changelingAnchorDisplayName("thread", data.thread, locale)],
            ["Conceito", character.character.concept],
            ["Feição", seemingDisplayName(data.seeming, locale)],
            [tr("Frátria", "Kith"), presentKith(lineReference, data.kith, locale, Boolean(data.kith_custom)).name], [tr("Corte", "Court"), displayCourt(lineReference.courts, data.court, locale)],
        ];
        return (<CharacterPaperShell line="CtL" mobile title={"CHANGELING"} subtitle={tr("OS PERDIDOS", "THE LOST")}>
        <SwipeableSheetTabs value={sheetTab} onValueChange={setSheetTab} tabs={[
                { value: "resumo", label: tr("Resumo", "Summary") }, { value: "stats", label: "Stats" },
                { value: "detalhes", label: tr("Detalhes", "Details") },
                { value: "poderes", label: tr("Poderes", "Powers") },
                ...(entitlementMerit ? [{ value: "entitlement", label: "Entitlement" }] : []),
                ...([]),
                { value: "combate", label: tr("Combate", "Combat") },
                ...(hasCompanions ? [{ value: "companheiros", label: tr("Companheiros", "Companions") }] : []), { value: "anotacoes", label: tr("Anotações", "Notes") },
            ]}>
          {{
                resumo: <>
              <section className="sheet-identity-grid">{identity.map(([label, value]) => <SheetField key={String(label)} label={String(label)} value={value}/>)}{false}</section>
              <SheetHeading>Aspirações</SheetHeading><EditableList values={aspirations} minimum={3} maximum={3} placeholder={tr("Escreva uma Aspiração", "Write an Aspiration")} onChange={(value) => updateLineData(updateSheet, character, "aspirations", value)}/>
              <SheetHeading>Experiência</SheetHeading>
              {<ExperiencePanel character={character} updateSheet={updateSheet} catalogs={catalogs}/>}
              {false}
              {false}
            </>,
                stats: <>
              <SheetHeading className="ctl-attributes-heading">Atributos</SheetHeading>
              <div className="mobile-attribute-grid">{Object.entries(ATTRIBUTES).map(([category, names]) => <TraitBlock key={category} title={category} names={names} values={character.attributes} compactNames/>)}</div>
              <SheetHeading>Perícias</SheetHeading>
              <div className="mobile-trait-stack">{Object.entries(SKILLS).map(([category, names]) => <TraitBlock key={category} title={category} names={names} values={effectiveSkills} specialties={specialties} highlightedNames={highlightedSkills} highlightTone={skillHighlightTone}/>)}</div>
            </>,
                detalhes: <>
              <SheetHeading>Méritos</SheetHeading><MeritSheetList character={character} merits={principalMerits} updateSheet={updateSheet} catalog={meritCatalog} courtCatalog={lineReference.courts} entitlementCatalog={lineReference.entitlements}/>
              <SheetHeading>Méritos Expandidos</SheetHeading><CourtLore data={data} merits={character.merits} courtCatalog={lineReference.courts}/><ExpandedMeritList merits={expandedMerits} character={character} updateSheet={updateSheet} catalog={meritCatalog} courtCatalog={lineReference.courts} entitlementCatalog={lineReference.entitlements} hasAdjacentContent/>
              <SheetHeading>Fragilidades</SheetHeading><FrailtyList values={frailties} onChange={(value) => updateLineData(updateSheet, character, "frailties", value)}/>
              <SheetHeading>Pedras de Contato</SheetHeading><EditableList values={touchstones} minimum={touchstoneSlots} maximum={touchstoneSlots} placeholder={tr("Escreva uma Pedra de Contato", "Write a Touchstone")} onChange={(value) => updateLineData(updateSheet, character, "touchstones", value)}/>
              <SheetHeading>Lucidez</SheetHeading><ClarityTrack maximum={clarityMaximum} damage={clarityDamage} onChange={(value) => setState("clarity_damage", value)}/>
              <SheetHeading>Condições</SheetHeading><CoreConditionManager selected={selectedConditions} catalog={conditionCatalog} onChange={(value) => setState("conditions", value)}/>
            </>,
                poderes: <>
              <PowerResource name="Fado" rating={powerRating} summary={wyrdSummary(powerRating, locale)} resourceName="Glamour" current={currentResource} maximum={resource.maximum} perTurn={resource.perTurn} onChange={(value) => setState(resourceKey, value)} storedCurrent={hasStoredGlamour ? storedGlamour : undefined} storedMaximum={hasStoredGlamour ? powerRating : undefined} onStoredChange={setStoredGlamour}/>
              <SheetHeading>Regalias Favorecidas</SheetHeading><LineList items={changelingFavoredRegalia(data)}/>
              <SheetHeading>Contratos</SheetHeading><ContractPowerList contracts={contracts} catalog={contractCatalog} courtCatalog={lineReference.courts} seeming={String(data.seeming ?? "")} court={String(data.court ?? "")} extraBenefits={objectList(data.extra_contract_benefits)} extraClauses={objectList(data.extra_contract_clauses)}/>
              <SheetHeading>Débito Goblin</SheetHeading><GoblinDebtTrack value={goblinDebt} onChange={(value) => setState("goblin_debt", value)}/>
              <SheetHeading>Juramentos</SheetHeading><EditableList values={oaths} minimum={5} placeholder={tr("Escreva um Juramento", "Write an Oath")} onChange={(value) => updateLineData(updateSheet, character, "oaths", value)}/>
              <SeemingLore seeming={String(data.seeming ?? "")}/><KithLore data={data} reference={lineReference}/>
            </>,
                entitlement: <EntitlementPage character={character} updateSheet={updateSheet} catalog={lineReference.entitlements}/>,
                combate: <>
              <SheetHeading>Vitalidade</SheetHeading><HealthTrack health={health} damage={damage} onChange={(value) => setState("health_damage", value)}/>
              <SheetHeading>Força de Vontade</SheetHeading><ResourceTrack label="Força de Vontade" current={currentWillpower} maximum={willpower} onChange={(value) => setState("willpower_current", value)}/>
              <CombatPage character={character} derived={derived} updateSheet={updateSheet}/>
            </>,
                companheiros: <div className="companions-page"><CompanionPage character={character} updateSheet={updateSheet}/><CoreCompanionPage character={character} updateSheet={updateSheet}/></div>,
                anotacoes: <><SheetHeading>Anotações</SheetHeading><NotesArea value={notes} onChange={(value) => setState("notes", value)}/></>,
            }}
        </SwipeableSheetTabs>
      </CharacterPaperShell>);
    }
    return (<CharacterPaperShell line="CtL" title={"CHANGELING"} subtitle={tr("OS PERDIDOS", "THE LOST")}>
      {(<Tabs defaultValue="principal" className="ctl-sheet-tabs">
          <TabsList className="ctl-sheet-tab-list" aria-label={tr("Páginas da ficha", "Character pages")}>
            <TabsTrigger value="principal">{tr("Principal", "Main")}</TabsTrigger>
            <TabsTrigger value="poderes">{tr("Detalhes", "Details")}</TabsTrigger>
            {entitlementMerit && <TabsTrigger value="entitlement">Entitlement</TabsTrigger>}
            <TabsTrigger value="combate">{tr("Combate", "Combat")}</TabsTrigger>
          {hasCompanions && <TabsTrigger value="companheiros">{tr("Companheiros", "Companions")}</TabsTrigger>}
          </TabsList>
          <TabsContent value="principal" data-page-title="Principal" className="ctl-sheet-page">
            <section className="sheet-identity-grid">
              <SheetField label="Nome" value={character.character.name}/>
              <SheetField label="Agulha" value={changelingAnchorDisplayName("needle", data.needle, locale)}/>
              <SheetField label="Feição" value={seemingDisplayName(data.seeming, locale)}/>
              <SheetField label="Jogador" value={character.character.player}/>
              <SheetField label="Fio" value={changelingAnchorDisplayName("thread", data.thread, locale)}/>
              <SheetField label={tr("Frátria", "Kith")} value={presentKith(lineReference, data.kith, locale, Boolean(data.kith_custom)).name}/>
              <SheetField label="Crônica" value={character.character.chronicle}/>
              <SheetField label="Conceito" value={character.character.concept}/>
              <SheetField label={tr("Corte", "Court")} value={displayCourt(lineReference.courts, data.court, locale)}/>
            </section>
            <SheetHeading className="ctl-attributes-heading">Atributos</SheetHeading>
            <div className="official-trait-grid">
              {Object.entries(ATTRIBUTES).map(([category, names]) => (<TraitBlock key={category} title={category} names={names} values={character.attributes}/>))}
            </div>
            <div className="official-sheet-body">
              <div className="sheet-skills-column">
                <SheetHeading>Perícias</SheetHeading>
                {Object.entries(SKILLS).map(([category, names]) => (<TraitBlock key={category} title={category} names={names} values={effectiveSkills} specialties={specialties} highlightedNames={highlightedSkills} highlightTone="kith"/>))}
              </div>
              <div className="sheet-center-column">
                <SheetHeading>Méritos</SheetHeading>
                <MeritSheetList character={character} merits={principalMerits} updateSheet={updateSheet} catalog={meritCatalog} courtCatalog={lineReference.courts} entitlementCatalog={lineReference.entitlements}/>
                <SheetHeading>Corte</SheetHeading>
                <CourtLore data={data} merits={character.merits} courtCatalog={lineReference.courts} main/>
                <SheetHeading>Regalias Favorecidas</SheetHeading>
                <LineList items={changelingFavoredRegalia(data)}/>
                <SheetHeading>Fragilidades</SheetHeading>
                <FrailtyList values={frailties} onChange={(value) => updateLineData(updateSheet, character, "frailties", value)}/>
                <SheetHeading>Lucidez</SheetHeading>
                <ClarityTrack maximum={clarityMaximum} damage={clarityDamage} onChange={(value) => setState("clarity_damage", value)}/>
                <SheetHeading>Pedras de Contato</SheetHeading>
                <EditableList values={touchstones} minimum={touchstoneSlots} maximum={touchstoneSlots} placeholder={tr("Escreva uma Pedra de Contato", "Write a Touchstone")} onChange={(value) => updateLineData(updateSheet, character, "touchstones", value)}/>
              </div>
              <div className="sheet-right-column">
                <SheetHeading>Vitalidade</SheetHeading>
                <HealthTrack health={health} damage={damage} onChange={(value) => setState("health_damage", value)}/>
                <SheetHeading>Força de Vontade</SheetHeading>
                <ResourceTrack label="Força de Vontade" current={currentWillpower} maximum={willpower} onChange={(value) => setState("willpower_current", value)}/>
                <SheetHeading>Características da Linha</SheetHeading>
                <PowerResource name="Fado" rating={powerRating} summary={wyrdSummary(powerRating, locale)} resourceName="Glamour" current={currentResource} maximum={resource.maximum} perTurn={resource.perTurn} onChange={(value) => setState(resourceKey, value)} storedCurrent={hasStoredGlamour ? storedGlamour : undefined} storedMaximum={hasStoredGlamour ? powerRating : undefined} onStoredChange={setStoredGlamour}/>
                <ExperiencePanel character={character} updateSheet={updateSheet} catalogs={catalogs}/>
              </div>
            </div>
            <div className="sheet-bottom-grid mage-bottom-grid">
              <section>
                <SheetHeading>Condições</SheetHeading>
                <CoreConditionManager selected={selectedConditions} catalog={conditionCatalog} onChange={(value) => setState("conditions", value)}/>
              </section>
              <section>
                <SheetHeading>Aspirações</SheetHeading>
                <EditableList values={aspirations} minimum={3} maximum={3} placeholder={tr("Escreva uma Aspiração", "Write an Aspiration")} onChange={(value) => updateLineData(updateSheet, character, "aspirations", value)}/>
              </section>
              <section>
                <SheetHeading>Anotações</SheetHeading>
                <NotesArea value={notes} onChange={(value) => setState("notes", value)}/>
              </section>
            </div>
          </TabsContent>
          <TabsContent value="poderes" data-page-title="Detalhes" className="ctl-sheet-page powers-page">
            <SheetHeading>Contratos</SheetHeading>
            <ContractPowerList contracts={contracts} catalog={contractCatalog} courtCatalog={lineReference.courts} seeming={String(data.seeming ?? "")} court={String(data.court ?? "")} extraBenefits={objectList(data.extra_contract_benefits)} extraClauses={objectList(data.extra_contract_clauses)}/>
            <div className="powers-sheet-grid">
              <section>
                <SheetHeading>Outras Características</SheetHeading>
                <SeemingLore seeming={String(data.seeming ?? "")}/>
                <KithLore data={data} reference={lineReference}/>
                <GoblinDebtTrack value={goblinDebt} onChange={(value) => setState("goblin_debt", value)}/>
              </section>
              <section>
                <SheetHeading>Juramentos</SheetHeading>
                <EditableList values={oaths} minimum={5} placeholder={tr("Escreva um Juramento", "Write an Oath")} onChange={(value) => updateLineData(updateSheet, character, "oaths", value)}/>
                <SheetHeading>Méritos Expandidos</SheetHeading>
                <CourtLore data={data} merits={character.merits} courtCatalog={lineReference.courts}/>
                <ExpandedMeritList merits={expandedMerits} character={character} updateSheet={updateSheet} catalog={meritCatalog} courtCatalog={lineReference.courts} entitlementCatalog={lineReference.entitlements} hasAdjacentContent/>
              </section>
            </div>
          </TabsContent>
          {entitlementMerit && <TabsContent value="entitlement" data-page-title="Entitlement" className="ctl-sheet-page powers-page"><EntitlementPage character={character} updateSheet={updateSheet} catalog={lineReference.entitlements}/></TabsContent>}
          <TabsContent value="combate" data-page-title="Combate" className="ctl-sheet-page powers-page">
            <CombatPage character={character} derived={derived} updateSheet={updateSheet}/>
          </TabsContent>
          <TabsContent value="companheiros" data-page-title="Companheiros" className="ctl-sheet-page powers-page">
            <div className="companions-page"><CompanionPage character={character} updateSheet={updateSheet}/><CoreCompanionPage character={character} updateSheet={updateSheet}/></div>
          </TabsContent>
        </Tabs>)}
    </CharacterPaperShell>);
}
function SheetField({ label, value }: {
    label: string;
    value: unknown;
}) {
    const { locale } = useLanguage();
    const anchorKind = label === "Agulha" ? "needle" : label === "Fio" ? "thread" : null;
    const tooltip = anchorKind ? changelingAnchorRecovery(anchorKind, systemTerm(String(value ?? ""), "en-US"), locale) : "";
    return (<div className="official-field" title={tooltip || undefined} data-tooltip={tooltip || undefined} tabIndex={tooltip ? 0 : undefined}>
      <span>{workspaceTerm(label, locale)}</span>
      <strong>{String(value ?? "")}</strong>
    </div>);
}
function meritLabel(item: CharacterSheet["merits"][number], catalog: readonly MeritDefinition[], courtCatalog: readonly CourtDefinition[], locale: Locale = "en-US") {
    const definition = catalog.find((entry) => entry.name === item.name);
    const base = locale === "en-US"
        ? definition?.name ?? item.name
        : definition?.translatedName ??
            (item.name === "Hollow" ? "Recanto" : item.name), detail = meritConfigurationTitle(item.configuration, locale, courtCatalog);
    return detail ? `${base}: ${detail}` : base;
}
function ExpandedMeritList({ merits, character, updateSheet, catalog, courtCatalog, entitlementCatalog, hasAdjacentContent = false }: {
    merits: CharacterSheet["merits"];
    character?: CharacterSheet;
    updateSheet?: (sheet: CharacterSheet) => void;
    catalog: readonly MeritDefinition[];
    courtCatalog: readonly CourtDefinition[];
    entitlementCatalog: readonly EntitlementDefinition[];
    hasAdjacentContent?: boolean;
}) {
    const { locale, tr } = useLanguage();
    const trifleUses = (character?.current_state.trifle_uses && typeof character.current_state.trifle_uses === "object" && !Array.isArray(character.current_state.trifle_uses) ? character.current_state.trifle_uses : {}) as Record<string, number>;
    const setTrifleUses = (key: string, value: number) => {
        if (!character || !updateSheet)
            return;
        updateSheet({ ...character, current_state: { ...character.current_state, trifle_uses: { ...trifleUses, [key]: Math.max(0, Math.min(3, value)) } } });
    };
    const visible = merits.filter((item) => !item.grantedBy && !["Fae Mount", "Fae Pet"].includes(item.name));
    return (<div className="expanded-merit-list">
      {visible.map((item, itemIndex) => {
            const style = catalog.find((entry) => entry.name === item.name && entry.levels?.length), configured = expandedConfigurationLines(item.name, item.dots, item.configuration, locale, courtCatalog), tokenItems = item.name === "Token" ? decodeConfiguredRows<TokenConfigurationItem>(normalizeMeritConfiguration(item.configuration).items) : [], cult = String(normalizeMeritConfiguration(item.configuration).cult ?? ""), title = item.name === "Token"
                ? "Tokens"
                : meritLabel(item, catalog, courtCatalog, locale), meritIndex = character?.merits.indexOf(item) ?? -1, configurationEditor = character && updateSheet && findMeritConfiguration(item.name) && !isInlineMeritConfiguration(item.name) && !["Fae Mount", "Fae Pet", "Entitlement"].includes(item.name)
                ? <MeritConfigurationEditor compact merit={item} ownedMerits={character.merits} catalog={[...catalog]} definitions={CHANGELING_SHEET_MERIT_CONFIGURATIONS} renderStructured={(props) => renderChangelingStructuredMeritEditor(props, entitlementCatalog)} onChange={(configuration) => { const next = structuredClone(character); const target = next.merits[meritIndex]; if (target)
                    target.configuration = configuration; updateSheet(synchronizeMeritGrants(next, entitlementCatalog)); }}/>
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
                      {tokenItems[index]?.kind === "trifle" && <TrifleUseTrack used={Number(trifleUses[`trifle:${item.instanceId ?? itemIndex}:${tokenItems[index].id || index}`] ?? 0)} onChange={(value) => setTrifleUses(`trifle:${item.instanceId ?? itemIndex}:${tokenItems[index].id || index}`, value)}/>}
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
                  <> · {tr("Pré-requisitos", "Prerequisites")}: {style.prerequisites || tr("Nenhum", "None")}</>
                </small>
              </div>
              <DotValue value={item.dots}/>
            </summary>
            <div className="expanded-merit-body">
              {configured.length
                    ? <>{configured.map((line, index) => (<section key={`${style.name}-configured-${index}`}>
                      <strong>{line.split(":")[0]}</strong>
                      <p>{line.slice(line.indexOf(":") + 1).trim()}</p>
                    </section>))}{item.name === "Hedge Duelist" && (style.levels ?? []).filter((level) => level.rating > 1 && level.rating <= item.dots).map((level, index) => <section key={`${style.name}-shared-${level.rating}-${index}`}><strong>{"•".repeat(level.rating)} {level.name}</strong><p>{level.description}</p></section>)}</>
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
function TrifleUseTrack({ used, onChange }: {
    used: number;
    onChange: (value: number) => void;
}) {
    const { tr } = useLanguage();
    return <div className="trifle-use-block"><span>{tr("Trifles usadas", "Trifles used")}: {used}/3</span><div className="trifle-use-track" role="group" aria-label={tr(`${used} de 3 Trifles usadas`, `${used} of 3 Trifles used`)}>{Array.from({ length: 3 }, (_, index) => <button key={index} type="button" className={index < used ? "used" : ""} onClick={() => onChange(index < used ? index : index + 1)} aria-label={tr(`Definir Trifles usadas como ${index < used ? index : index + 1}`, `Set used Trifles to ${index < used ? index : index + 1}`)}/>)}</div></div>;
}
function ClarityTrack({ maximum, damage, onChange, }: {
    maximum: number;
    damage: ClarityDamageLevel[];
    onChange: (value: ClarityDamageLevel[]) => void;
}) {
    const { tr } = useLanguage();
    const current = Math.max(0, maximum - damage.length);
    const cycle = (index: number) => {
        const slots: Array<ClarityDamageLevel | undefined> = Array.from({ length: maximum }, (_, slot) => damage[slot]);
        const level = slots[index];
        slots[index] =
            level === "mild" ? "severe" : level === "severe" ? undefined : "mild";
        onChange(normalizeClarityDamage(slots, maximum));
    };
    return (<div className="tracker-block clarity-block">
      <div className="health-track clarity-track" role="group" aria-label={tr(`Lucidez atual ${current} de ${maximum}`, `Current Clarity ${current} of ${maximum}`)}>
        {Array.from({ length: maximum }, (_, index) => {
            const level = damage[index];
            return (<button type="button" key={index} className={`health-box clarity-box ${level ?? "empty"}`} onClick={() => cycle(index)} aria-label={tr(`Caixa ${index + 1}: ${level === "mild" ? "dano leve" : level === "severe" ? "dano grave" : "vazia"}. Clique para alterar.`, `Box ${index + 1}: ${level === "mild" ? "mild damage" : level === "severe" ? "severe damage" : "empty"}. Press to change.`)}>
              <span aria-hidden="true"/>
            </button>);
        })}
      </div>
      <div className="clarity-numbers" aria-hidden="true">
        {Array.from({ length: maximum }, (_, index) => (<span key={index}>{index === 0 ? "" : index}</span>))}
      </div>
      <div className="tracker-meta">
        <span>{tr("Lucidez atual", "Current Clarity")}</span>
        <strong>
          {current} / {maximum}
        </strong>
      </div>
      <p className="tracker-help">
        <span className="legend-mark mild"/>
        {tr("Leve", "Mild")} <span className="legend-mark severe"/>
        {tr("Grave · as três caixas à direita podem gerar Condições de Lucidez", "Severe · the three rightmost boxes may cause Clarity Conditions")}
      </p>
    </div>);
}
function GoblinDebtTrack({ value, onChange, }: {
    value: number;
    onChange: (value: number) => void;
}) {
    const { tr } = useLanguage();
    return (<div className="goblin-debt-block">
      <h4>{tr("Débito Goblin", "Goblin Debt")}</h4>
      <div className="goblin-debt-track" role="group" aria-label={tr(`Débito Goblin: ${value} de 10`, `Goblin Debt: ${value} of 10`)}>
        {Array.from({ length: 10 }, (_, index) => (<button type="button" key={index} className={index < value ? "filled" : ""} onClick={() => onChange(index < value ? index : index + 1)} aria-label={tr(`Definir Débito Goblin como ${index < value ? index : index + 1}`, `Set Goblin Debt to ${index < value ? index : index + 1}`)}/>))}
      </div>
      <p>
        {value}/10 · {tr("ao receber o décimo ponto, o personagem adquire a Condição Habitante da Sebe.", "upon receiving the tenth point, the character gains the Hedge Denizen Condition.")}
      </p>
    </div>);
}
function FrailtyList({ values, onChange }: {
    values: string[];
    onChange: (value: string[]) => void;
}) {
    const { locale, tr } = useLanguage();
    return (<div className="editable-lines frailty-lines">
      {values.map((value, index) => (<div className="editable-line-row" key={index}>
          <Input value={index === 0 ? systemTerm(value, locale) : value} readOnly={index === 0} aria-label={index === 0 ? tr("Fragilidade obrigatória: Ferro Frio", "Mandatory Frailty: Cold Iron") : tr(`Fragilidade de Fado ${index * 2}`, `Wyrd ${index * 2} Frailty`)} placeholder={index === 0 ? undefined : tr(`Fragilidade de Fado ${index * 2}`, `Wyrd ${index * 2} Frailty`)} onChange={(event) => {
                const next = [...values];
                next[index] = event.target.value;
                onChange(next);
            }}/>
        </div>))}
    </div>);
}
function LineList({ items }: {
    items: string[];
}) {
    return (<div className="official-lines">
      {items.filter(Boolean).map((item, index) => (<div key={`${item}-${index}`}>{item}</div>))}
      {!items.filter(Boolean).length && <div>&nbsp;</div>}
    </div>);
}
function MeritSheetList({ character, merits, updateSheet, catalog, courtCatalog, entitlementCatalog, }: {
    character: CharacterSheet;
    merits: CharacterSheet["merits"];
    updateSheet: (sheet: CharacterSheet) => void;
    catalog: readonly MeritDefinition[];
    courtCatalog: readonly CourtDefinition[];
    entitlementCatalog: readonly EntitlementDefinition[];
}) {
    const { locale, tr } = useLanguage();
    const availableCatalog = catalog, visible = merits.filter((item) => !item.grantedBy || item.grantedBy === "Corte");
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
                <span>{inline ? `${displayName}:` : meritLabel(item, catalog, courtCatalog, locale)}</span>
                {inlineField && <Input className="inline-merit-input" aria-label={`${displayName}: ${tr("descrição", "description")}`} value={String(configuration[inlineField.key] ?? "")} placeholder={tr("Escreva aqui", "Type here")} onChange={(event) => {
                        const next = structuredClone(character);
                        const target = next.merits[meritIndex];
                        if (target)
                            target.configuration = { ...configuration, [inlineField.key]: event.target.value };
                        updateSheet(synchronizeMeritGrants(next, entitlementCatalog));
                    }}/>}
                <DotValue value={item.dots} max={Math.max(5, item.dots)}/>
              </div>
            </div>);
        })) : (<em>{tr("Nenhum Mérito selecionado", "No Merit selected")}</em>)}
    </div>);
}
function ContractPowerList({ contracts, catalog, courtCatalog, seeming, court, extraBenefits = [], extraClauses = [], }: {
    contracts: Array<Record<string, unknown>>;
    catalog: readonly ContractDefinition[];
    courtCatalog: readonly CourtDefinition[];
    seeming: string;
    court: string;
    extraBenefits?: Array<Record<string, unknown>>;
    extraClauses?: Array<Record<string, unknown>>;
}) {
    const { locale, tr } = useLanguage();
    return (<div className="contract-power-list">
      {contracts
            .filter((item) => item.name)
            .map((item, index) => {
            const baseDefinition = catalog.find((entry) => entry.id === String(item.id ?? "") || entry.name === String(item.name ?? "")) ??
                (item as unknown as ContractDefinition);
            const definition = contractPresentation(contractWithSupplementalBenefits(baseDefinition, []), locale);
            const summary = contractSummary(baseDefinition, locale);
            if (!definition?.id)
                return null;
            const benefits = [
                seeming,
                ...extraBenefits
                    .filter((extra) => String(extra.contractId) === definition.id)
                    .map((extra) => String(extra.seeming)),
            ]
                .filter((value, item, array) => value && array.indexOf(value) === item)
                .map((key) => ({
                key,
                text: definition.seemingBenefits?.[key as keyof typeof definition.seemingBenefits],
            }))
                .filter((item) => item.text);
            const courtBenefit = (definition as ContractDefinition & {
                courtBenefits?: Record<string, string>;
            }).courtBenefits?.[court];
            const clauseCourtIds = [
                findCourtInCatalog(courtCatalog, court)?.id ?? String(court).trim(),
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
                  <dt>{tr("Ação / Duração", "Action / Duration")}</dt>
                  <dd>
                    {definition.action ?? tr("Instantânea", "Instant")} ·{" "}
                    {definition.duration ?? tr("Cena", "Scene")}
                  </dd>
                </div>
                {outcomeSections.slice(0, 1).map((section) => (<div key={section.label}>
                    <dt>{section.label}</dt>
                    <dd>{section.text}</dd>
                  </div>))}
                {displayOptions.length > 0 && (<div className="contract-options">
                    <dt>{tr("Opções", "Options")}</dt>
                    <dd><ul>{displayOptions.map((option) => <li key={option}>{option}</li>)}</ul></dd>
                  </div>)}
                {definition.detailTables?.map((table) => (<div className="contract-detail-table" key={table.title}>
                    <dt>{table.title}</dt>
                    <dd><table><thead><tr>{table.columns.map((column) => <th key={column}>{column}</th>)}</tr></thead><tbody>{table.rows.map((row) => <tr key={row.join("::")}>{row.map((cell, cellIndex) => <td key={cellIndex}>{cell}</td>)}</tr>)}</tbody></table></dd>
                  </div>))}
                {outcomeSections.slice(1).map((section) => (<div key={section.label}>
                    <dt>{section.label}</dt>
                    <dd>{section.text}</dd>
                  </div>))}
                <div>
                  <dt>{tr("Brecha", "Loophole")}</dt>
                  <dd>{definition.loophole}</dd>
                </div>
                {benefits.map((benefit) => (<div key={benefit.key}>
                    <dt>
                      {tr("Benefício de", "Benefit for")}{" "}
                      {seemingDisplayName(benefit.key, locale)}
                    </dt>
                    <dd>{benefit.text}</dd>
                  </div>))}
                {courtBenefit && (<div>
                    <dt>{tr("Benefício da Corte", "Court Benefit")} {court}</dt>
                    <dd>{courtBenefit}</dd>
                  </div>)}
                {clauses.map((clause) => (<div key={`clause-${clause.courtId}`}>
                    <dt>Clause · {displayCourt(courtCatalog, clause.courtId, locale)}</dt>
                    <dd>{clause.text}</dd>
                  </div>))}
                {definition.goblin && (<div className="goblin-debt-row">
                    <dt>{tr("Débito Goblin", "Goblin Debt")}</dt>
                    <dd>{definition.goblinDebt}</dd>
                  </div>)}
              </dl>;
            return (<details className="contract-power-card" key={`${definition.id}-${index}`}>
              <summary className="contract-power-summary">
                <strong>{locale === "en-US" ? definition.originalName ?? definition.name : definition.name}</strong>
                <Badge variant={definition.goblin ? "default" : "outline"}>{definition.goblin ? "Goblin" : definition.type === "Comum" ? tr("Comum", "Common") : tr("Real", "Royal")}</Badge>
                <small>{systemTerm(definition.regalia, locale)} · {definition.source}{definition.page ? ` · p. ${definition.page}` : ""}</small>
              </summary>
              <div className="contract-power-details">{details}</div>
            </details>);
        })}
    </div>);
}
function SeemingLore({ seeming }: {
    seeming: string;
}) {
    const { locale, tr } = useLanguage();
    const definition = CTL_SEEMINGS[seeming as keyof typeof CTL_SEEMINGS];
    if (!definition)
        return <LorePanel title={tr("Feição", "Seeming")} text={tr("Nenhuma Feição selecionada.", "No Seeming selected.")}/>;
    const page = ({
        Beast: 22,
        Darkling: 24,
        Elemental: 26,
        Fairest: 28,
        Ogre: 30,
        Wizened: 32,
    } as Record<string, number>)[seeming];
    return (<>
      <LorePanel title={tr(`Bênção de ${definition.translated}`, `${seeming} Blessing`)} text={locale === "en-US" ? definition.blessingEn : definition.blessing} source={`Changeling the Lost · p. ${page}`}/>
      <LorePanel title={tr(`Maldição de ${definition.translated}`, `${seeming} Curse`)} text={locale === "en-US" ? definition.curseEn : definition.curse} source={`Changeling the Lost · p. ${page}`}/>
    </>);
}
function KithLore({ data, reference }: {
    data: Record<string, unknown>;
    reference: ChangelingReference;
}) {
    const { locale, tr } = useLanguage();
    const definition = data.kith_custom ? undefined : findKithInCatalog(reference.kiths, data.kith);
    const presentation = data.kith_custom ? undefined : presentKith(reference, data.kith, locale);
    const name = data.kith_custom ? String(data.kith ?? "") : presentation?.name ?? "";
    const skill = String(presentation?.skill ?? definition?.skill ?? data.kith_skill ?? "");
    const description = String(presentation?.description ?? definition?.description ?? data.kith_description ?? "");
    const blessing = String(presentation?.blessing ?? definition?.blessing ?? data.kith_blessing ?? "");
    const source = String(definition?.source ?? data.kith_source ?? "");
    const page = Number(definition?.page ?? data.kith_page ?? 0);
    const choice = String(data.kith_choice ?? "").trim();
    const choiceDefinition = kithCreationChoice(definition?.id);
    const choiceLabel = choiceDefinition ? (locale === "pt-BR" ? choiceDefinition.labelPt : choiceDefinition.labelEn) : "";
    const choiceParts = choice.split(": ");
    const displayedChoice = choiceDefinition?.kind === "skill" ? systemTerm(choice, locale) : choiceDefinition?.kind === "specialty" && choiceParts.length > 1 ? `${systemTerm(choiceParts[0], locale)}: ${choiceParts.slice(1).join(": ")}` : choice;
    if (!name)
        return (<LorePanel title={tr("Bênção da Fratria", "Kith Blessing")} text={tr("Nenhuma Fratria selecionada.", "No Kith selected.")}/>);
    return (<LorePanel title={tr(`Bênção de ${name}`, `${name} Blessing`)} intro={data.kith_custom ? undefined : description} text={`${choice ? `${choiceLabel}: ${displayedChoice}. ` : ""}${skill ? `${skill}. ` : ""}${blessing || description}`} source={source ? `${source}${page ? ` · p. ${page}` : ""}` : undefined}/>);
}
function CourtLore({ data, merits, courtCatalog, main = false, }: {
    data: Record<string, unknown>;
    merits: CharacterSheet["merits"];
    courtCatalog: readonly CourtDefinition[];
    main?: boolean;
}) {
    const { locale, tr } = useLanguage();
    const raw = data.custom_court;
    const custom = raw && typeof raw === "object" ? raw as Record<string, unknown> : undefined;
    const official = custom ? undefined : presentCourt(courtCatalog, data.court, locale);
    if (!custom && !official)
        return null;
    const name = custom ? String(custom.name ?? data.court ?? "") : displayCourt(courtCatalog, data.court, locale);
    const emotion = custom ? String(custom.emotion ?? "") : String(official?.emotion ?? "");
    const benefits = custom && Array.isArray(custom.mantleBenefits)
        ? custom.mantleBenefits.map(String)
        : official?.mantleBenefits ?? [], dots = merits.find((item) => item.name === "Mantle" && item.grantedBy === "Corte")?.dots ?? 1;
    if (main)
        return (<details className="expanded-merit-card court-summary-card">
      <summary>
        <h4>{name}</h4>
        <DotValue value={dots}/>
      </summary>
      <div className="expanded-merit-body">
        {emotion && <section><strong>{tr("Sentimento da Corte", "Court emotion")}</strong><p>{emotion}</p></section>}
        {benefits.slice(0, 5).map((benefit, index) => (<section key={index} className={index >= dots ? "court-benefit-locked" : undefined}>
          <strong>{tr("Manto", "Mantle")} {index + 1}</strong>
          <p>{benefit}</p>
        </section>))}
        {official && <small>{official.source} · p. {[official.page, ...(official.additionalPages ?? [])].join(", ")}</small>}
      </div>
    </details>);
    return (<article className="lore-panel">
      <h4>{tr("Manto", "Mantle")}: {name}</h4>
      <small>{tr("Sentimento da Corte", "Court emotion")}: {emotion}</small>
      {benefits.slice(0, dots).map((benefit, index) => (<p key={index}>
          <strong>{tr("Manto", "Mantle")} {index + 1}:</strong> {benefit}
        </p>))}
      {official && <small>{official.source} · p. {[official.page, ...(official.additionalPages ?? [])].join(", ")}</small>}
    </article>);
}
function LorePanel({ title, intro, text, source, }: {
    title: string;
    intro?: string;
    text: string;
    source?: string;
}) {
    return (<article className="lore-panel">
      <h4>{title}</h4>
      {intro && intro !== text && <p className="lore-intro">{intro}</p>}
      <p>{text}</p>
      {source && <small>{source}</small>}
    </article>);
}
function selectedConditionList(value: unknown, catalog: readonly ChangelingCondition[]): CoreSelectedCondition[] {
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
