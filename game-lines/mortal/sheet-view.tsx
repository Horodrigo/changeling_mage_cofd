"use client";

import { useState } from "react";
import { CharacterPaperShell, EditableList, NotesArea, ResourceTrack, SheetField } from "@/app/workspace/character-paper-shell";
import { CombatPage } from "@/app/workspace/combat-page";
import { ConditionManager, type ConditionDefinition, type SelectedCondition } from "@/app/workspace/condition-manager";
import { derivedWithPermanentMerits } from "@/app/workspace/experience-shared";
import { MainSheet } from "@/app/workspace/main-sheet";
import { HealthTrack, SheetHeading, TraitBlock, DotValue, stringList } from "@/app/workspace/sheet-primitives";
import { SwipeableSheetTabs } from "@/app/workspace/sheet-tabs";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useIsMobile } from "@/hooks/use-mobile";
import { ATTRIBUTES, SKILLS } from "@/lib/core/character/creation-rules";
import { meritConfigurationTitle } from "@/lib/core/character/merit-configuration";
import type { CharacterSheet } from "@/lib/core/character/character-types";
import type { GameLineSheetProps } from "@/lib/game-line-contracts/game-line-ui";
import { useLanguage } from "@/lib/i18n";
import type { MeritDefinition } from "@/lib/merits";
import { normalizeDamage } from "@/lib/resource-rules";
import { boundedIntegrity } from "./creation-rules";

type CoreReference = {
  conditions: ConditionDefinition[];
  presentation: Record<string, Partial<ConditionDefinition>>;
};

function selectedConditions(value: unknown): SelectedCondition[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((entry) => {
    if (!entry || typeof entry !== "object") return [];
    const item = entry as Record<string, unknown>;
    const id = String(item.id ?? "");
    return id ? [{ id, persistent: Boolean(item.persistent), instanceId: item.instanceId ? String(item.instanceId) : undefined }] : [];
  });
}

export function MortalCharacterPaper({ character, updateState, updateSheet, catalogs }: GameLineSheetProps) {
  const { locale, t } = useLanguage();
  const isMobile = useIsMobile();
  const [mobileTab, setMobileTab] = useState({ characterId: character.id, value: "summary" });
  const [desktopTab, setDesktopTab] = useState("main");
  const activeTab = isMobile ? (mobileTab.characterId === character.id ? mobileTab.value : "summary") : desktopTab;
  const setActiveTab = (value: string) => isMobile ? setMobileTab({ characterId: character.id, value }) : setDesktopTab(value);
  if (!catalogs) throw new Error("Mortal sheet requires its catalog snapshot.");

  const meritCatalog = catalogs.get<readonly MeritDefinition[]>("core-merits");
  const reference = catalogs.get<CoreReference>("core-reference");
  const conditionCatalog = reference.conditions.map((condition) =>
    locale === "pt-BR" ? { ...condition, ...(reference.presentation[condition.id] ?? {}) } : condition,
  );
  const data = character.line_data;
  const state = character.current_state;
  const derived = derivedWithPermanentMerits(character);
  const health = Math.max(1, Number(derived.Vitalidade ?? 5));
  const willpower = Math.max(0, Number(derived.ForçaDeVontade ?? 0));
  const currentWillpower = Math.max(0, Math.min(willpower, Number(state.willpower_current ?? willpower)));
  const integrity = boundedIntegrity(data.integrity);
  const aspirations = stringList(data.aspirations);
  const breakingPoints = stringList(data.breaking_points);
  const conditions = selectedConditions(state.conditions);
  const notes = String(state.notes ?? "");
  const setState = (key: string, value: unknown) => updateState({ ...state, [key]: value });
  const setLineValue = (key: string, value: unknown) => {
    const next = structuredClone(character);
    next.line_data = { ...next.line_data, [key]: value };
    updateSheet(next);
  };

  const identity = <section className="sheet-identity-grid">
    <SheetField label={t("ui.characterName")} value={character.character.name} />
    <SheetField label={t("ui.virtue")} value={data.virtue} />
    <SheetField label={t("ui.chronicle")} value={character.character.chronicle} />
    <SheetField label={t("ui.age")} value={data.age} />
    <SheetField label={t("ui.vice")} value={data.vice} />
    <SheetField label={t("ui.faction")} value={data.faction} />
    <SheetField label={t("ui.player")} value={character.character.player} />
    <SheetField label={t("ui.concept")} value={character.character.concept} />
    <SheetField label={t("ui.groupName")} value={data.group_name} />
  </section>;
  const attributes = <><SheetHeading>{t("ui.attributes")}</SheetHeading><div className="official-trait-grid">{Object.entries(ATTRIBUTES).map(([category, names]) => <TraitBlock key={category} title={category} names={names} values={character.attributes} />)}</div></>;
  const skills = <><SheetHeading>{t("ui.skills")}</SheetHeading>{Object.entries(SKILLS).map(([category, names]) => <TraitBlock key={category} title={category} subtitle={category === "Mental" ? t("ui.message3IfUntrained") : t("ui.message1IfUntrained")} names={names} values={character.skills} specialties={character.specializations} />)}</>;
  const merits = <MeritList character={character} catalog={meritCatalog} />;
  const aspirationList = <EditableList values={aspirations} minimum={3} maximum={3} placeholder={t("ui.writeAnAspiration")} onChange={(value) => setLineValue("aspirations", value)} />;
  const breakingPointList = <EditableList values={breakingPoints} minimum={5} placeholder={t("ui.writeBreakingPoint")} onChange={(value) => setLineValue("breaking_points", value)} />;
  const conditionList = <ConditionManager selected={conditions} catalog={conditionCatalog} onChange={(value) => setState("conditions", value)} />;
  const healthTrack = <><SheetHeading>{t("ui.health")}</SheetHeading><HealthTrack health={health} damage={normalizeDamage(state.health_damage, health)} onChange={(value) => setState("health_damage", value)} /></>;
  const willpowerTrack = <><SheetHeading>{t("ui.willpower")}</SheetHeading><ResourceTrack label={t("ui.willpower")} current={currentWillpower} maximum={willpower} onChange={(value) => setState("willpower_current", value)} /></>;
  const integrityTrack = <><SheetHeading>{t("ui.integrity")}</SheetHeading><ResourceTrack label={t("ui.integrity")} current={integrity} maximum={10} onChange={(value) => setLineValue("integrity", value)} /></>;

  if (isMobile) return <CharacterPaperShell line="CofD" mobile title={t("ui.mortal")} subtitle={t("ui.chroniclesOFDARKNESS")}>
    <SwipeableSheetTabs value={activeTab} onValueChange={setActiveTab} tabs={[
      { value: "summary", label: t("ui.summary") },
      { value: "stats", label: t("ui.traits") },
      { value: "details", label: t("ui.details") },
      { value: "combat", label: t("ui.combat") },
      { value: "notes", label: t("ui.notes") },
    ]}>{{
      summary: <>{identity}<SheetHeading>{t("ui.aspirations")}</SheetHeading>{aspirationList}{integrityTrack}</>,
      stats: <>{attributes}{skills}<SheetHeading>{t("ui.merits")}</SheetHeading>{merits}</>,
      details: <><SheetHeading>{t("ui.breakingPoints")}</SheetHeading>{breakingPointList}<SheetHeading>{t("ui.conditions")}</SheetHeading>{conditionList}</>,
      combat: <>{healthTrack}{willpowerTrack}<CombatPage character={character} derived={derived} updateSheet={updateSheet} /></>,
      notes: <><SheetHeading>{t("ui.notes")}</SheetHeading><NotesArea value={notes} onChange={(value) => setState("notes", value)} /></>,
    }}</SwipeableSheetTabs>
  </CharacterPaperShell>;

  return <CharacterPaperShell line="CofD" title={t("ui.mortal")} subtitle={t("ui.chroniclesOFDARKNESS")}>
    <Tabs value={activeTab} onValueChange={setActiveTab} className="cofd-sheet-tabs">
      <TabsList className="ctl-sheet-tab-list" aria-label={t("ui.characterPages")}>
        <TabsTrigger value="main">{t("ui.main")}</TabsTrigger>
        <TabsTrigger value="combat">{t("ui.combat")}</TabsTrigger>
        <TabsTrigger value="notes">{t("ui.notes")}</TabsTrigger>
      </TabsList>
      <TabsContent value="main" className="ctl-sheet-page">
        <MainSheet
          className="mortal-main-body"
          identity={identity}
          attributes={attributes}
          skills={skills}
          specificPowers={null}
          specificPowersTitle={null}
          merits={merits}
          aspirations={aspirationList}
          conditions={conditionList}
          health={healthTrack}
          willpower={willpowerTrack}
          powerStat={null}
          fuel={null}
          stability={integrityTrack}
          derived={derived}
          armorId={data.combat_armor}
          experience={null}
          lineSections={<><SheetHeading>{t("ui.breakingPoints")}</SheetHeading>{breakingPointList}</>}
        />
      </TabsContent>
      <TabsContent value="combat" className="ctl-sheet-page powers-page"><CombatPage character={character} derived={derived} updateSheet={updateSheet} /></TabsContent>
      <TabsContent value="notes" className="ctl-sheet-page powers-page"><SheetHeading>{t("ui.notes")}</SheetHeading><NotesArea value={notes} onChange={(value) => setState("notes", value)} /></TabsContent>
    </Tabs>
  </CharacterPaperShell>;
}

function MeritList({ character, catalog }: { character: CharacterSheet; catalog: readonly MeritDefinition[] }) {
  const { locale, t } = useLanguage();
  if (!character.merits.length) return <em>{t("ui.noMeritSelected")}</em>;
  return <div className="sheet-merits single-column">{character.merits.map((merit, index) => {
    const definition = catalog.find((item) => item.name === merit.name);
    const name = locale === "pt-BR" ? definition?.translatedName ?? merit.name : definition?.name ?? merit.name;
    const configured = meritConfigurationTitle(merit.configuration);
    const tooltip = definition ? `${definition.prerequisites ? `${t("ui.prerequisites")}: ${definition.prerequisites}\n` : ""}${definition.description}` : merit.source;
    return <div className="sheet-merit-row" key={`${merit.instanceId ?? merit.name}-${index}`} title={tooltip}>
      <div className="sheet-merit-main"><span>{name}{configured ? `: ${configured}` : ""}</span><DotValue value={merit.dots} max={Math.max(5, merit.dots)} /></div>
    </div>;
  })}</div>;
}
