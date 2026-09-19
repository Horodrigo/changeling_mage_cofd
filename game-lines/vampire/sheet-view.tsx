"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Plus, Trash2 } from "lucide-react";
import { CharacterPaperShell, EditableList, NotesArea, ResourceTrack, SheetField, boundedNumber, updateLineData } from "@/app/workspace/character-paper-shell";
import { CombatPage } from "@/app/workspace/combat-page";
import { ConditionManager, type ConditionDefinition, type SelectedCondition } from "@/app/workspace/condition-manager";
import { HealthTrack, SheetHeading, TraitBlock, DotValue, stringList } from "@/app/workspace/sheet-primitives";
import { MainFuel, MainPowerStat, MainSheet } from "@/app/workspace/main-sheet";
import { SwipeableSheetTabs } from "@/app/workspace/sheet-tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useIsMobile } from "@/hooks/use-mobile";
import type { CharacterSheet } from "@/lib/core/character/character-types";
import { ATTRIBUTES, SKILLS } from "@/lib/core/character/creation-rules";
import type { GameLineSheetProps } from "@/lib/game-line-contracts/game-line-ui";
import { useLanguage } from "@/lib/i18n";
import type { MeritDefinition } from "@/lib/merits";
import { createRandomId } from "@/lib/random-id";
import { normalizeDamage } from "@/lib/resource-rules";
import type { VampireCondition, VampireMechanics, VampirePowers, VampireReference, VampireRitualDisciplineDefinition } from "./catalog-types";
import { bloodPotencyRow, objectArray, recordRatings, VAMPIRE_DISCIPLINES, vampireCovenantStatus, vampireDerived, vampireDisciplineDisplayName, vampireSunlightSummary } from "./creation-rules";
import { VampireExperiencePanel } from "./experience-panel";
import { vampireOwnedCoilRuleEffects, vampireRuleEffectsFor } from "./power-rule-effects";

type EditableRecord = { id: string; subject: string; stage?: number; notes: string };

function localized<T extends { name: string; translatedName: string }>(item: T | undefined, locale: string) {
  return item ? (locale === "pt-BR" ? item.translatedName : item.name) : "";
}

function selectedConditions(value: unknown): SelectedCondition[] {
  return objectArray(value).map((item) => ({
    id: String(item.id ?? ""), persistent: Boolean(item.persistent),
    instanceId: item.instanceId ? String(item.instanceId) : undefined,
  })).filter((item) => item.id);
}

function VampireDecorativeFrame() {
  return <div className="vtr-decorative-frame" aria-hidden="true">
    <span className="vtr-frame-edge vtr-frame-edge-top" />
    <span className="vtr-frame-edge vtr-frame-edge-bottom" />
    <span className="vtr-frame-edge vtr-frame-edge-left" />
    <span className="vtr-frame-edge vtr-frame-edge-right" />

    <span className="vtr-frame-center vtr-frame-center-top" />
    <span className="vtr-frame-center vtr-frame-center-bottom" />

    <span className="vtr-frame-side vtr-frame-side-top-left" />
    <span className="vtr-frame-side vtr-frame-side-top-right" />
    <span className="vtr-frame-side vtr-frame-side-bottom-left" />
    <span className="vtr-frame-side vtr-frame-side-bottom-right" />

    <span className="vtr-frame-corner vtr-frame-corner-top-left" />
    <span className="vtr-frame-corner vtr-frame-corner-top-right" />
    <span className="vtr-frame-corner vtr-frame-corner-bottom-left" />
    <span className="vtr-frame-corner vtr-frame-corner-bottom-right" />
  </div>;
}


type TouchstoneMeritPoint = {
  key: string;
  meritInstanceId: string;
  dot: number;
  slot: number;
};

function getTouchstoneMeritPoints(character: CharacterSheet, baseSlot: number): TouchstoneMeritPoint[] {
  const minimumSlot = baseSlot === 7 ? 2 : 1;
  const points: TouchstoneMeritPoint[] = [];
  let offset = 0;

  character.merits.forEach((merit, meritIndex) => {
    if (merit.name !== "Touchstone") return;

    const meritInstanceId = String(merit.instanceId ?? `touchstone-merit-${meritIndex}`);
    const dots = Math.max(0, Math.floor(Number(merit.dots ?? 0)));

    for (let dot = 1; dot <= dots; dot += 1) {
      offset += 1;
      const slot = baseSlot - offset;
      if (slot < minimumSlot) continue;
      points.push({
        key: `${meritInstanceId}:${dot}`,
        meritInstanceId,
        dot,
        slot,
      });
    }
  });

  return points;
}

function HumanityTrack({
  character,
  updateSheet,
  value,
}: {
  character: CharacterSheet;
  updateSheet: (sheet: CharacterSheet) => void;
  value: number;
}) {
  const { t } = useLanguage();
  const baseSlot = String(character.line_data.clan_id ?? "") === "ventrue" ? 7 : 6;
  const meritPoints = getTouchstoneMeritPoints(character, baseSlot);
  const touchstones = objectArray(character.line_data.touchstones);

  /*
   * Keep each purchased Touchstone Merit dot tied to exactly one Humanity row.
   * If a dot disappears, its linked Touchstone is removed from persisted data.
   * Buying the dot again therefore unlocks a blank row rather than restoring
   * the old text.
   */
  useEffect(() => {
    const activePoints = new Map(getTouchstoneMeritPoints(character, baseSlot).map((point) => [point.key, point]));
    const currentRows = objectArray(character.line_data.touchstones);
    const unboundRows = currentRows.filter((row) => !String(row.merit_point_key ?? ""));
    const baseRow = unboundRows.find((row) => Number(row.humanity_slot) === baseSlot) ?? unboundRows[0];
    const nextRows: Record<string, unknown>[] = [];

    if (baseRow) {
      nextRows.push({
        ...baseRow,
        humanity_slot: baseSlot,
      });
    }

    for (const row of currentRows) {
      const key = String(row.merit_point_key ?? "");
      if (!key) continue;
      const point = activePoints.get(key);
      if (!point) continue;
      nextRows.push({
        ...row,
        humanity_slot: point.slot,
        merit_instance_id: point.meritInstanceId,
        merit_dot: point.dot,
      });
    }

    if (JSON.stringify(nextRows) === JSON.stringify(currentRows)) return;

    const next = structuredClone(character);
    next.line_data = {
      ...next.line_data,
      touchstones: nextRows,
    };
    updateSheet(next);
  }, [baseSlot, character, updateSheet]);

  const setHumanity = (rating: number) => {
    const next = structuredClone(character);
    next.line_data = {
      ...next.line_data,
      humanity: rating,
    };
    updateSheet(next);
  };

  const setTouchstoneName = (slot: number, meritPoint: TouchstoneMeritPoint | undefined, name: string) => {
    const currentRows = objectArray(character.line_data.touchstones);
    const key = meritPoint?.key ?? "";
    const rowIndex = currentRows.findIndex((row) =>
      key
        ? String(row.merit_point_key ?? "") === key
        : !String(row.merit_point_key ?? ""),
    );

    const nextRows = [...currentRows];
    const existing = rowIndex >= 0 ? nextRows[rowIndex] : undefined;

    if (!name.trim()) {
      if (rowIndex >= 0) nextRows.splice(rowIndex, 1);
    } else {
      const row: Record<string, unknown> = {
        ...(existing ?? {}),
        id: String(existing?.id ?? createRandomId()),
        name,
        humanity_slot: slot,
        notes: String(existing?.notes ?? ""),
      };

      if (meritPoint) {
        row.merit_point_key = meritPoint.key;
        row.merit_instance_id = meritPoint.meritInstanceId;
        row.merit_dot = meritPoint.dot;
      } else {
        delete row.merit_point_key;
        delete row.merit_instance_id;
        delete row.merit_dot;
      }

      if (rowIndex >= 0) nextRows[rowIndex] = row;
      else nextRows.push(row);
    }

    const next = structuredClone(character);
    next.line_data = {
      ...next.line_data,
      touchstones: nextRows,
    };
    updateSheet(next);
  };

  return <div className="vampire-humanity-track">
    {Array.from({ length: 10 }, (_, index) => 10 - index).map((rating) => {
      const meritPoint = meritPoints.find((point) => point.slot === rating);
      const isBaseTouchstone = rating === baseSlot;
      const canWriteTouchstone = isBaseTouchstone || Boolean(meritPoint);
      const row = canWriteTouchstone
        ? touchstones.find((item) => meritPoint
          ? String(item.merit_point_key ?? "") === meritPoint.key
          : !String(item.merit_point_key ?? ""))
        : undefined;

      return <div className={`vampire-humanity-row${canWriteTouchstone ? " touchstone-slot" : ""}`} key={rating}>
        {canWriteTouchstone
          ? <Input
              className="vampire-humanity-touchstone"
              value={String(row?.name ?? "")}
              placeholder="Touchstone"
              aria-label={t("ui.humanityTouchstone", { p1: rating })}
              onChange={(event) => setTouchstoneName(rating, meritPoint, event.target.value)}
            />
          : <span className="vampire-humanity-line" aria-hidden="true" />}
        <strong>{rating}</strong>
        <button
          type="button"
          className={`vampire-humanity-dot${value === rating ? " on" : ""}`}
          aria-pressed={value === rating}
          aria-label={t("ui.setHumanity", { p1: rating })}
          onClick={() => setHumanity(rating)}
        />
      </div>;
    })}
  </div>;
}

export function VampireCharacterPaper({ character, updateState, updateSheet, catalogs }: GameLineSheetProps) {
  if (!catalogs) throw new Error("Vampire sheet requires its catalog snapshot.");
  const { locale, t } = useLanguage();
  const isMobile = useIsMobile();
  const reference = catalogs.get<VampireReference>("vampire-reference");
  const powers = catalogs.get<VampirePowers>("vampire-powers");
  const merits = [...catalogs.get<readonly MeritDefinition[]>("core-merits"), ...catalogs.get<readonly MeritDefinition[]>("vampire-merits")];
  const coreConditions = catalogs.get<{ conditions: ConditionDefinition[] }>("core-reference").conditions;
  const vampireConditions = catalogs.get<readonly VampireCondition[]>("vampire-conditions") as readonly ConditionDefinition[];
  const conditionCatalog = [...coreConditions, ...vampireConditions];
  const data = character.line_data;
  const bloodSorcery = data.blood_sorcery && typeof data.blood_sorcery === "object" && !Array.isArray(data.blood_sorcery)
    ? data.blood_sorcery as Record<string, unknown>
    : {};
  const cruacRating = Number(bloodSorcery.cruac_rating ?? 0);
  const thebanRating = Number(bloodSorcery.theban_rating ?? 0);
  const clan = reference.clans.find((item) => item.id === data.clan_id);
  const covenant = reference.covenants.find((item) => item.id === data.covenant_id);
  const mask = reference.anchors.find((item) => item.id === data.mask_id);
  const dirge = reference.anchors.find((item) => item.id === data.dirge_id);
  const disciplines = recordRatings(data.disciplines, VAMPIRE_DISCIPLINES, 10);
  const bloodPotency = Math.max(1, Math.min(10, Number(data.blood_potency ?? 1)));
  const limits = bloodPotencyRow(reference, bloodPotency);
  const feedingTierLabel = {
    Animals: t("ui.animals"),
    Humans: t("ui.humans"),
    Kindred: t("ui.kindred"),
  } satisfies Record<typeof limits.feedingTier, string>;
  const derived = vampireDerived(character.attributes, character.skills, disciplines, bloodPotency, reference);
  const health = Math.max(1, Number(derived.Vitalidade ?? 5));
  const willpower = Math.max(1, Number(derived.ForçaDeVontade ?? 1));
  const vitaeMaximum = typeof limits.vitaeMaximum === "number" ? limits.vitaeMaximum : Number(character.attributes.Stamina ?? 1) + Number(disciplines.Resilience ?? 0);
  const vitae = boundedNumber(character.current_state.vitae_current, vitaeMaximum, vitaeMaximum);
  const currentWillpower = boundedNumber(character.current_state.willpower_current, willpower, willpower);
  const damage = normalizeDamage(character.current_state.health_damage, health);
  const humanity = Math.max(0, Math.min(10, Number(data.humanity ?? 7)));
  const conditions = selectedConditions(character.current_state.conditions);
  const conditionIds = new Set(conditions.map((item) => item.id));
  const ordo = data.ordo_dracul && typeof data.ordo_dracul === "object" && !Array.isArray(data.ordo_dracul) ? data.ordo_dracul as Record<string, unknown> : {};
  const coilRatings = ordo.coil_ratings && typeof ordo.coil_ratings === "object" && !Array.isArray(ordo.coil_ratings) ? ordo.coil_ratings as Record<string, number> : {};
  const coilEffects = vampireOwnedCoilRuleEffects(powers, coilRatings);
  const hasRuleEffect = (rule: Parameters<typeof vampireRuleEffectsFor>[1], value?: string) => vampireRuleEffectsFor(coilEffects, rule).some((effect) => value === undefined || effect.value === value);
  const ruleSourceRating = (rule: Parameters<typeof vampireRuleEffectsFor>[1]) => Math.max(0, ...vampireRuleEffectsFor(coilEffects, rule).map((effect) => Number(coilRatings[effect.sourceId] ?? 0)));
  const sunlightSummary = vampireSunlightSummary(humanity, bloodPotency, locale);
  const blushDurationRule = String(vampireRuleEffectsFor(coilEffects, "blush-duration")[0]?.value ?? "");
  const blushDuration = blushDurationRule === "24 hours" ? (locale === "pt-BR" ? "24 horas" : "24 hours") : (locale === "pt-BR" ? "Cena" : "Scene");
  const frenzyActive = Boolean(character.current_state.frenzy_active);
  const hungerModifier = vitae <= 2 ? -4 : vitae <= 4 ? -2 : 0;
  const woundModifier = damage.length >= Math.max(1, health - 2) ? -3 : damage.length > 0 ? -1 : 0;
  const satedModifier = conditionIds.has("sated") ? 1 : 0;
  const frenzyBasePool = Number(character.attributes.Resolve ?? 1) + Number(character.attributes.Composure ?? 1);
  const frenzyAutomaticModifier = hungerModifier + woundModifier + satedModifier;
  const frenzyResistanceUncapped = frenzyBasePool + frenzyAutomaticModifier;
  const frenzyResistancePool = clan?.id === "gangrel" ? Math.min(humanity, frenzyResistanceUncapped) : frenzyResistanceUncapped;
  const rideWaveBonus = ruleSourceRating("ride-the-wave-pool");
  const rideWavePool = frenzyBasePool + frenzyAutomaticModifier + rideWaveBonus;
  const rideWaveWillpowerCost = conditionIds.has("raptured") || hasRuleEffect("ride-the-wave-cost") ? 0 : 1;
  const rideWaveTarget = conditionIds.has("raptured") ? 3 : 5;
  const frenzySenseBloodPotency = frenzyActive ? bloodPotency + ruleSourceRating("kindred-senses-blood-potency") : bloodPotency;
  const ignoresDaysleepWithBlush = hasRuleEffect("daysleep");
  const ignoresLethargicWithBlush = hasRuleEffect("lethargic");
  const beastPowerAvailable = hasRuleEffect("frenzy-defense") && hasRuleEffect("frenzy-health") && hasRuleEffect("frenzy-speed");
  const beastPowerActive = frenzyActive && beastPowerAvailable && Boolean(character.current_state.frenzy_beast_power_active);
  const combatDerived = beastPowerActive ? {
    ...derived,
    Defesa: Number(derived.Defesa ?? 0) + bloodPotency,
    Vitalidade: Number(derived.Vitalidade ?? 0) + bloodPotency,
    Deslocamento: Number(derived.Deslocamento ?? 0) + bloodPotency,
  } : derived;
  const combatHealth = Math.max(1, Number(combatDerived.Vitalidade ?? health));
  const combatDamage = normalizeDamage(character.current_state.health_damage, combatHealth);
  const aspirations = stringList(data.aspirations);
  const notes = String(character.current_state.notes ?? "");
  const [mobileTab, setMobileTab] = useState({ characterId: character.id, value: "summary" });
  const tab = mobileTab.characterId === character.id ? mobileTab.value : "summary";
  const setState = (key: string, value: unknown) => updateState({ ...character.current_state, [key]: value });
  const identity = <section className="sheet-identity-grid">
    <SheetField label={t("ui.name")} value={character.character.name} />
    <SheetField label={t("sheet.mask")} value={localized(mask, locale)} tooltip={mask?.singleWillpower} />
    <SheetField label={t("sheet.clan")} value={localized(clan, locale)} />
    <SheetField label={t("ui.player")} value={character.character.player} />
    <SheetField label={t("sheet.dirge")} value={localized(dirge, locale)} tooltip={dirge?.allWillpower} />
    <SheetField label={t("sheet.covenant")} value={localized(covenant, locale)} />
    <SheetField label={t("ui.chronicle")} value={character.character.chronicle} />
    <SheetField label={t("ui.concept")} value={character.character.concept} />
    <SheetField label={t("sheet.bloodline")} value={String(data.bloodline ?? "")} />
  </section>;
  const attributes = <>
    <SheetHeading>{t("ui.attributes")}</SheetHeading><div className={isMobile ? "mobile-attribute-grid" : "official-trait-grid"}>{Object.entries(ATTRIBUTES).map(([category, names]) => <TraitBlock key={category} title={category} names={names} values={character.attributes} compactNames={isMobile} />)}</div>
  </>;
  const skills = <>
  <SheetHeading>{t("ui.skills")}</SheetHeading>

  <div className={isMobile ? "mobile-trait-stack" : "vampire-skill-grid"}>
    {Object.entries(SKILLS).map(([category, names]) =>
      <TraitBlock
        key={category}
        title={category}
        subtitle={
          category === "Mental"
            ? t("ui.message3IfUntrained")
            : t("ui.message1IfUntrained")
        }
        names={names}
        values={character.skills}
        specialties={character.specializations.map((item) =>
          typeof item === "string"
            ? { skill: "", name: item }
            : item
        )}
      />
    )}
  </div>
</>;
  const stats = <>{attributes}{skills}</>;
  const humanitySection = <>
    <SheetHeading className="ctl-single-divider vampire-humanity-heading">{t("ui.humanity")}</SheetHeading>
    <HumanityTrack character={character} updateSheet={updateSheet} value={humanity} />
  </>;
  const summary = <>
    {identity}
    <SheetHeading>{t("ui.aspirations")}</SheetHeading>
    <EditableList values={aspirations} minimum={3} maximum={3} placeholder={t("ui.writeAnAspiration")} onChange={(value) => updateLineData(updateSheet, character, "aspirations", value)} />
    {humanitySection}
    <SheetHeading>{t("ui.conditions")}</SheetHeading>
    <ConditionManager selected={conditions} catalog={conditionCatalog} onChange={(value) => setState("conditions", value)} />
    <SheetHeading>{t("ui.experience")}</SheetHeading>
    <VampireExperiencePanel character={character} updateSheet={updateSheet} catalogs={catalogs} />
  </>;
  const covenantStatus = covenant ? vampireCovenantStatus(character, covenant.id, covenant.name, covenant.translatedName) : 0;
  const detailsPage = <>
    <SheetHeading>Covenant</SheetHeading>
    <article className="vampire-covenant-summary"><Image src="/vampire-skull.webp" width={82} height={82} alt="" aria-hidden="true" unoptimized /><div><h3>{localized(covenant, locale) || t("ui.covenantless")}</h3><p>{covenant?.description ?? t("ui.thisKindredBelongsToNoCovenant")}</p><strong>{t("ui.advantage")}: {covenant?.advantage ?? t("ui.none247448")}</strong><span>Kindred Status: <DotValue value={covenantStatus} /></span></div></article>
    {covenant?.id === "ordo-dracul" && <article className="vampire-lore-card"><strong>Mystery</strong><p>{String(ordo.mystery_id ?? t("ui.notSelected"))}</p></article>}
    <SheetHeading>{t("ui.disciplines")}</SheetHeading>
    <DisciplineCards powers={powers} disciplines={disciplines} locale={locale} />
    {Number(disciplines.Protean ?? 0) >= 2 && <ProteanChoicesEditor character={character} updateSheet={updateSheet} rating={Number(disciplines.Protean ?? 0)} />}
    <RitualDisciplines powers={powers} cruacRating={cruacRating} thebanRating={thebanRating} locale={locale} />
    <PurchasedPowers character={character} powers={powers} locale={locale} />
  </>;
  const combat = <>
    <div className="vampire-track-grid">
      <section><SheetHeading>{t("ui.health")}</SheetHeading><HealthTrack health={combatHealth} damage={combatDamage} onChange={(value) => setState("health_damage", value)} /></section>
      <section><SheetHeading>{t("ui.willpower")}</SheetHeading><ResourceTrack label={t("ui.willpower")} current={currentWillpower} maximum={willpower} onChange={(value) => setState("willpower_current", value)} /></section>
    </div>
    <CombatPage character={character} derived={combatDerived} updateSheet={updateSheet} />
    <VampireStateControls
      setState={setState}
      locale={locale}
      bloodPotency={bloodPotency}
      blushDuration={blushDuration}
      canReduceSunlightInterval={hasRuleEffect("sunlight-interval-blood-potency")}
      ignoresFireFrenzy={hasRuleEffect("frenzy-trigger", "fire")}
      ignoresSunlightFrenzy={hasRuleEffect("frenzy-trigger", "sunlight")}
      ignoresDaysleepWithBlush={ignoresDaysleepWithBlush}
      ignoresLethargicWithBlush={ignoresLethargicWithBlush}
      fireDowngraded={hasRuleEffect("fire-damage")}
      resilience={Number(disciplines.Resilience ?? 0)}
      frenzyActive={frenzyActive}
      frenzyResistancePool={frenzyResistancePool}
      frenzyBasePool={frenzyBasePool}
      frenzyAutomaticModifier={frenzyAutomaticModifier}
      rideWavePool={rideWavePool}
      rideWaveBonus={rideWaveBonus}
      rideWaveWillpowerCost={rideWaveWillpowerCost}
      rideWaveTarget={rideWaveTarget}
      frenzySenseBloodPotency={frenzySenseBloodPotency}
      beastPowerAvailable={beastPowerAvailable}
      beastPowerActive={beastPowerActive}
      combatDerived={combatDerived}
    />
    <SheetHeading>{t("ui.kindredReferences")}</SheetHeading>
    <div className="vampire-reference-grid">
      <article className="vampire-lore-card"><strong>Physical Intensity</strong><p>{t("ui.spend1VitaeFor2OnRollsUsing")}</p></article>
      <article className="vampire-lore-card"><strong>{t("ui.healing")}</strong><p>{t("ui.message1VitaeHealsTwoBashingOrOneLethal")}</p></article>
      <article className="vampire-lore-card"><strong>Predatory Aura</strong><p>{t("ui.chooseTheMonstrousSeductiveOrCompetitiveAspectAnd")}</p></article>
      <article className="vampire-lore-card"><strong>Frenzy</strong><p>{locale === "pt-BR" ? `Em frenesi, some Potência de Sangue ${bloodPotency} às rolagens/resistências de Força, Destreza e Vigor. Penalidades de ferimento são ignoradas.` : `While frenzied, add Blood Potency ${bloodPotency} to Strength, Dexterity, and Stamina rolls/resistances. Wound penalties are ignored.`}</p></article>
    </div>
  </>;
  const notesPage = <>
    <SheetHeading>{t("ui.banes")}</SheetHeading>
    <div className="vampire-main-banes">
      <article className="vampire-lore-card"><strong>{clan?.baneName ?? t("ui.clanBane")}</strong><p>{clan?.baneSummary ?? ""}</p></article>
      {objectArray(data.banes).map((bane, index) => <article className="vampire-lore-card" key={index}><strong>{String(bane.name ?? t("ui.bane"))}</strong><p>{String(bane.notes ?? "")}</p></article>)}
    </div>
    <SheetHeading>{t("ui.humanityReferences")}</SheetHeading>
    <div className="vampire-reference-grid">
      <article className="vampire-lore-card"><strong>{t("ui.sunlightAndHumanity")}</strong><p>{sunlightSummary}</p></article>
    </div>
    <SheetHeading>Blood Bonds</SheetHeading>
    <StructuredRecords values={objectArray(character.current_state.blood_bonds)} levelLabel={t("ui.stage")} onChange={(value) => setState("blood_bonds", value)} />
    <SheetHeading>{t("ui.notes")}</SheetHeading>
    <NotesArea value={notes} onChange={(value) => setState("notes", value)} />
  </>;
  const mainBody = <MainSheet className="vampire-main-body" identity={identity} attributes={attributes} skills={skills}
    specificPowers={
      <div className="vampire-main-disciplines">
        {VAMPIRE_DISCIPLINES
          .filter((name) =>
            clan?.disciplines.includes(name) ||
            Number(disciplines[name] ?? 0) > 0
          )
          .map((name) => (
            <VampireDisciplineLine
              key={name}
              name={vampireDisciplineDisplayName(name, powers.disciplines, locale)}
              value={Number(disciplines[name] ?? 0)}
            />
          ))}
      </div>
    }
    merits={<MeritList character={character} catalog={merits} locale={locale} />}
    aspirations={<>
      <EditableList values={aspirations} minimum={3} maximum={3} placeholder={t("ui.writeAnAspiration")} onChange={(value) => updateLineData(updateSheet, character, "aspirations", value)} />
      {humanitySection}
    </>}
    conditions={<ConditionManager selected={conditions} catalog={conditionCatalog} onChange={(value) => setState("conditions", value)} />}
    health={<><SheetHeading>{t("ui.health")}</SheetHeading><HealthTrack health={health} damage={damage} onChange={(value) => setState("health_damage", value)} /></>}
    willpower={<><SheetHeading>{t("ui.willpower")}</SheetHeading><ResourceTrack label={t("ui.willpower")} current={currentWillpower} maximum={willpower} onChange={(value) => setState("willpower_current", value)} /></>}
    specificPowersTitle={t("ui.disciplines")}
    powerStat={
      <MainPowerStat
        label={t("ui.bloodPotency")}
        value={bloodPotency}
        summary={`${t("ui.canFeedFrom")}: ${feedingTierLabel[limits.feedingTier]} · ${sunlightSummary}`}
      />
    }
    fuel={<MainFuel label="Vitae" current={vitae} maximum={vitaeMaximum} onChange={(value) => setState("vitae_current", value)} />}
    stability={null}
    derived={derived}
    experience={<VampireExperiencePanel character={character} updateSheet={updateSheet} catalogs={catalogs} />}
  />;

  if (isMobile) return <CharacterPaperShell line="VtR" mobile title="VAMPIRE" subtitle="THE REQUIEM"><VampireDecorativeFrame /><SwipeableSheetTabs value={tab} onValueChange={(value) => setMobileTab({ characterId: character.id, value })} tabs={[
    { value: "summary", label: t("ui.summary") },
    { value: "stats", label: "Stats" },
    { value: "details", label: t("ui.details") },
    { value: "combat", label: t("ui.combat") },
    { value: "notes", label: t("ui.notes") },
  ]}>{{ summary, stats, details: detailsPage, combat, notes: notesPage }}</SwipeableSheetTabs></CharacterPaperShell>;

  return <CharacterPaperShell line="VtR" title="VAMPIRE" subtitle="THE REQUIEM"><VampireDecorativeFrame /><Tabs defaultValue="main" className="vampire-sheet-tabs"><TabsList aria-label={t("ui.characterPages")}>
    <TabsTrigger value="main">{t("ui.main")}</TabsTrigger>
    <TabsTrigger value="details">{t("ui.details")}</TabsTrigger>
    <TabsTrigger value="combat">{t("ui.combat")}</TabsTrigger>
    <TabsTrigger value="notes">{t("ui.notes")}</TabsTrigger>
  </TabsList>
    <TabsContent value="main" className="vampire-sheet-page">{mainBody}</TabsContent>
    <TabsContent value="details" className="vampire-sheet-page">{detailsPage}</TabsContent>
    <TabsContent value="combat" className="vampire-sheet-page">{combat}</TabsContent>
    <TabsContent value="notes" className="vampire-sheet-page">{notesPage}</TabsContent>
  </Tabs></CharacterPaperShell>;

}

function VampireDisciplineLine({ name, value }: { name: string; value: number }) {
  return <div className="official-trait-line"><span className="official-trait-label"><span className="official-trait-name">{name}</span></span><DotValue value={value} /></div>;
}


function DisciplineCards({ powers, disciplines, locale }: { powers: VampirePowers; disciplines: Record<string, number>; locale: string }) {
  return <div className="vampire-power-grid">
    {powers.disciplines.filter((item) => Number(disciplines[item.name] ?? 0) > 0).map((item) => {
      const rating = Number(disciplines[item.name] ?? 0);
      return <details
      className="contract-power-card vampire-discipline-card"
      key={item.id}
      >
        <summary className="contract-power-summary">
          <strong>{localized(item, locale)}</strong>
          <DotValue value={rating} />
          <small>{item.summary}</small>
        </summary>
        <div className={`contract-power-details${item.levels.length ? " has-levels" : ""}`}>
          <PowerMechanics mechanics={item} locale={locale} />
          {item.levels.filter((level) => level.rating <= rating).map((level) => <details className="contract-power-card vampire-discipline-level" key={level.rating}>
            <summary className="contract-power-summary">
              <strong>{"•".repeat(level.rating)} {localized(level, locale)}</strong>
              <small>{level.summary}</small>
            </summary>
            <div className="contract-power-details"><PowerMechanics mechanics={level} locale={locale} compact /></div>
          </details>)}
        </div>
      </details>;
    })}
  </div>;
}

function PowerMechanics({ mechanics, locale, compact = false }: { mechanics: VampireMechanics; locale: string; compact?: boolean }) {
  const rows: Array<[string, string | number | undefined]> = [
    [locale === "pt-BR" ? "Custo" : "Cost", mechanics.cost],
    [locale === "pt-BR" ? "Requisito" : "Requirement", mechanics.requirement],
    [locale === "pt-BR" ? "Condição" : "Condition", mechanics.condition],
    [locale === "pt-BR" ? "Parada de Dados" : "Dice Pool", mechanics.dicePool],
    [locale === "pt-BR" ? "Ação" : "Action", mechanics.action],
    [locale === "pt-BR" ? "Duração" : "Duration", mechanics.duration],
    [locale === "pt-BR" ? "Sucessos Alvo" : "Target Successes", mechanics.targetSuccesses],
    [locale === "pt-BR" ? "Contestado por" : "Contested by", mechanics.contestedBy],
    [locale === "pt-BR" ? "Resistido por" : "Resisted by", mechanics.resistedBy],
    [locale === "pt-BR" ? "Sacramento" : "Sacrament", mechanics.sacrament],
  ];
  const visibleRows = rows.filter(([, value]) => value !== undefined && value !== "");
  const results = mechanics.rollResults;
  if (!visibleRows.length && !mechanics.effect && !mechanics.procedure && !mechanics.outcome && !results) return null;
  return <div className={`vampire-power-mechanics${compact ? " compact" : ""}`}>
    {visibleRows.map(([label, value]) => <p key={label}><strong>{label}:</strong> {String(value)}</p>)}
    {mechanics.effect && <p><strong>{locale === "pt-BR" ? "Efeito" : "Effect"}:</strong> {mechanics.effect}</p>}
    {mechanics.procedure && <p><strong>{locale === "pt-BR" ? "Procedimento" : "Procedure"}:</strong> {mechanics.procedure}</p>}
    {mechanics.outcome && <p><strong>{locale === "pt-BR" ? "Resultado" : "Outcome"}:</strong> {mechanics.outcome}</p>}
    {results && <div className="vampire-roll-results">
      {results.dramaticFailure && <p><strong>{locale === "pt-BR" ? "Falha Dramática" : "Dramatic Failure"}:</strong> {results.dramaticFailure}</p>}
      {results.failure && <p><strong>{locale === "pt-BR" ? "Falha" : "Failure"}:</strong> {results.failure}</p>}
      {results.success && <p><strong>{locale === "pt-BR" ? "Sucesso" : "Success"}:</strong> {results.success}</p>}
      {results.exceptionalSuccess && <p><strong>{locale === "pt-BR" ? "Sucesso Excepcional" : "Exceptional Success"}:</strong> {results.exceptionalSuccess}</p>}
    </div>}
    {mechanics.suggestedModifiers?.length ? <div className="vampire-suggested-modifiers">
      <strong>{locale === "pt-BR" ? "Modificadores Sugeridos" : "Suggested Modifiers"}</strong>
      {mechanics.suggestedModifiers.map((item, index) => <p key={`${item.modifier}-${index}`}><b>{item.modifier}</b> {item.situation}</p>)}
    </div> : null}
  </div>;
}

function RitualDisciplines({ powers, cruacRating, thebanRating, locale }: { powers: VampirePowers; cruacRating: number; thebanRating: number; locale: string }) {
  const selected = (powers.ritualDisciplines ?? []).filter((item) => item.id === "cruac" ? cruacRating > 0 : thebanRating > 0);
  if (!selected.length) return null;
  return <><SheetHeading>{locale === "pt-BR" ? "Disciplinas de Feitiçaria de Sangue" : "Blood Sorcery Disciplines"}</SheetHeading>
    <div className="vampire-power-grid">
      {selected.map((item: VampireRitualDisciplineDefinition) => {
        const rating = item.id === "cruac" ? cruacRating : thebanRating;
        return <article key={item.id}>
          <header><strong>{localized(item, locale)}</strong><DotValue value={rating} /></header>
          <p>{item.summary}</p>
          <PowerMechanics mechanics={item} locale={locale} />
          <small>{locale === "pt-BR" ? "Cada ponto normalmente concede um Rite/Miracle gratuito; o nível máximo do ritual é igual ao nível da Disciplina." : "Each dot normally grants one free rite/miracle; maximum ritual rating equals the Discipline rating."}</small>
        </article>;
      })}
    </div>
  </>;
}

function MeritList({ character, catalog, locale }: { character: CharacterSheet; catalog: readonly MeritDefinition[]; locale: string }) {
  if (!character.merits.length) return <em>—</em>;
  return <div className="official-lines">{character.merits.map((merit, index) => { const definition = catalog.find((item) => item.name === merit.name); return <div key={`${merit.instanceId ?? merit.name}-${index}`}><span>{locale === "pt-BR" ? definition?.translatedName ?? merit.name : merit.name}</span><DotValue value={merit.dots} /></div>; })}</div>;
}

function PurchasedPowers({ character, powers, locale, scope = "all" }: { character: CharacterSheet; powers: VampirePowers; locale: string; scope?: "all" | "devotions" | "covenant" }) {
  const { t } = useLanguage();
  const ids = new Set(stringList(character.line_data.devotion_ids));
  const sorcery = character.line_data.blood_sorcery && typeof character.line_data.blood_sorcery === "object" && !Array.isArray(character.line_data.blood_sorcery) ? character.line_data.blood_sorcery as Record<string, unknown> : {};
  const ordo = character.line_data.ordo_dracul && typeof character.line_data.ordo_dracul === "object" && !Array.isArray(character.line_data.ordo_dracul) ? character.line_data.ordo_dracul as Record<string, unknown> : {};
  const sorceryIds = new Set([...stringList(sorcery.cruac_rite_ids), ...stringList(sorcery.theban_miracle_ids)]);
  const scaleIds = new Set(stringList(ordo.scale_ids));
  const coilRatings = ordo.coil_ratings && typeof ordo.coil_ratings === "object" && !Array.isArray(ordo.coil_ratings) ? ordo.coil_ratings as Record<string, unknown> : {};
  const selected = [...(scope !== "covenant" ? powers.devotions.filter((item) => ids.has(item.id)) : []), ...(scope !== "devotions" ? [...powers.cruacRites, ...powers.thebanMiracles].filter((item) => sorceryIds.has(item.id)) : []), ...(scope !== "devotions" ? powers.coils.filter((item) => Number(coilRatings[item.id] ?? 0) > 0) : []), ...(scope !== "devotions" ? powers.scales.filter((item) => scaleIds.has(item.id)) : [])];
  if (!selected.length) return null;
  return <><SheetHeading>{t("sheet.otherPowers")}</SheetHeading><div className="vampire-power-grid">{selected.map((item) => {
    const rating = item.kind === "coil" ? Number(coilRatings[item.id] ?? 0) : item.rating;
    return <article key={item.id}>
      <header><strong>{localized(item, locale)}</strong>{Boolean(rating) && <DotValue value={Number(rating)} />}</header>
      <small>{item.kind}{item.prerequisites ? ` · ${item.prerequisites}` : ""}</small>
      <p>{item.summary}</p>
      <PowerMechanics mechanics={item} locale={locale} />
      {item.levels?.filter((level) => level.rating <= Number(rating ?? 0)).map((level) => <div className="vampire-power-level" key={level.rating}>
        <strong>{level.rating}. {localized(level, locale)}</strong>
        <span>{level.summary}</span>
        <PowerMechanics mechanics={level} locale={locale} compact />
      </div>)}
    </article>;
  })}</div></>;
}

function ProteanChoicesEditor({ character, updateSheet, rating }: { character: CharacterSheet; updateSheet: (sheet: CharacterSheet) => void; rating: number }) {
  const { t } = useLanguage();
  const choices = character.line_data.discipline_choices && typeof character.line_data.discipline_choices === "object" && !Array.isArray(character.line_data.discipline_choices) ? character.line_data.discipline_choices as Record<string, unknown> : {};
  const set = (key: string, value: string[]) => { const next = structuredClone(character); next.line_data = { ...next.line_data, discipline_choices: { ...choices, [key]: value } }; updateSheet(next); };
  return <><SheetHeading>{t("ui.proteanChoices")}</SheetHeading><div className="vampire-protean-choices">
    <section><strong>Predatory Aspect</strong><EditableList values={stringList(choices.protean_aspects)} minimum={3} maximum={3} placeholder={t("ui.animalAdaptation")} onChange={(value) => set("protean_aspects", value)} /></section>
    {rating >= 3 && <section><strong>Beast&apos;s Skin</strong><EditableList values={stringList(choices.protean_forms)} minimum={1} placeholder={t("ui.animalForm")} onChange={(value) => set("protean_forms", value)} /></section>}
    {rating >= 4 && <section><strong>Unnatural Aspect</strong><EditableList values={stringList(choices.protean_unnatural_aspect)} minimum={3} maximum={3} placeholder={t("ui.monstrousAdaptation")} onChange={(value) => set("protean_unnatural_aspect", value)} /></section>}
  </div></>;
}

function VampireStateControls({
  setState, locale, bloodPotency, blushDuration,
  canReduceSunlightInterval, ignoresFireFrenzy, ignoresSunlightFrenzy,
  ignoresDaysleepWithBlush, ignoresLethargicWithBlush, fireDowngraded, resilience,
  frenzyActive, frenzyResistancePool, frenzyBasePool, frenzyAutomaticModifier,
  rideWavePool, rideWaveBonus, rideWaveWillpowerCost, rideWaveTarget,
  frenzySenseBloodPotency, beastPowerAvailable, beastPowerActive, combatDerived,
}: {
  setState: (key: string, value: unknown) => void;
  locale: string;
  bloodPotency: number;
  blushDuration: string;
  canReduceSunlightInterval: boolean;
  ignoresFireFrenzy: boolean;
  ignoresSunlightFrenzy: boolean;
  ignoresDaysleepWithBlush: boolean;
  ignoresLethargicWithBlush: boolean;
  fireDowngraded: boolean;
  resilience: number;
  frenzyActive: boolean;
  frenzyResistancePool: number;
  frenzyBasePool: number;
  frenzyAutomaticModifier: number;
  rideWavePool: number;
  rideWaveBonus: number;
  rideWaveWillpowerCost: number;
  rideWaveTarget: number;
  frenzySenseBloodPotency: number;
  beastPowerAvailable: boolean;
  beastPowerActive: boolean;
  combatDerived: Record<string, number>;
}) {
  const { t } = useLanguage();
  const pt = locale === "pt-BR";
  const resistanceLabel = frenzyResistancePool <= 0 ? (pt ? "Dado de chance" : "Chance die") : `${frenzyResistancePool} ${pt ? "dados" : "dice"}`;
  const rideLabel = rideWavePool <= 0 ? (pt ? "Dado de chance" : "Chance die") : `${rideWavePool} ${pt ? "dados" : "dice"}`;
  return <>
    <SheetHeading>{t("ui.vampiricStates")}</SheetHeading>
    <div className="vampire-state-controls">
      <p className="wide"><strong>Blush of Life:</strong> {pt ? "duração" : "duration"} {blushDuration}.</p>
      {(ignoresDaysleepWithBlush || ignoresLethargicWithBlush) && <p className="wide"><strong>Surmounting the Daysleep:</strong> {pt ? `${ignoresDaysleepWithBlush ? "enquanto usa Blush of Life, não precisa rolar para resistir ao sono diurno" : ""}${ignoresDaysleepWithBlush && ignoresLethargicWithBlush ? "; " : ""}${ignoresLethargicWithBlush ? "não recebe Lethargic por permanecer ativo durante o dia" : ""}.` : `${ignoresDaysleepWithBlush ? "while using Blush of Life, no roll is required to resist daysleep" : ""}${ignoresDaysleepWithBlush && ignoresLethargicWithBlush ? "; " : ""}${ignoresLethargicWithBlush ? "remaining active during the day does not inflict Lethargic" : ""}.`}</p>}
      {fireDowngraded && <p className="wide"><strong>Peace with the Flame:</strong> {pt ? `enquanto usa Blush of Life, fogo causa dano letal; Resilience ${resilience} pode reduzir pontos de letal para contusão.` : `while using Blush of Life, fire deals lethal damage; Resilience ${resilience} can downgrade lethal points to bashing.`}</p>}
      {canReduceSunlightInterval && <p className="wide"><strong>Sun&apos;s Forgotten Kiss:</strong> {pt ? "cada Vitae extra gasto ao ativar Blush of Life reduz em 1 a Potência de Sangue usada apenas para o intervalo de dano solar, até o mínimo de 1." : "each additional Vitae spent when activating Blush of Life reduces Blood Potency by 1 for sunlight-damage interval only, to a minimum of 1."}</p>}
      {(ignoresFireFrenzy || ignoresSunlightFrenzy) && <p className="wide"><strong>Conquer the Red Fear:</strong> {pt ? `não provoca Frenzy por ${[ignoresFireFrenzy && "fogo", ignoresSunlightFrenzy && "luz solar"].filter(Boolean).join(" ou ")}.` : `no Frenzy provocation from ${[ignoresFireFrenzy && "fire", ignoresSunlightFrenzy && "sunlight"].filter(Boolean).join(" or ")}.`}</p>}
      <label><span>Frenzy</span><Switch checked={frenzyActive} onCheckedChange={(checked) => setState("frenzy_active", checked)} /></label>
      <p className="wide"><strong>{pt ? "Resistir Frenzy" : "Resist Frenzy"}:</strong> {resistanceLabel} ({frenzyBasePool} {pt ? "base" : "base"} {frenzyAutomaticModifier >= 0 ? "+" : ""}{frenzyAutomaticModifier} {pt ? "automático" : "automatic"}). {pt ? "Outros modificadores situacionais são aplicados manualmente pelo jogador." : "Other situational modifiers are applied manually by the player."}</p>
      <p className="wide"><strong>Riding the Wave:</strong> {rideLabel}; {pt ? "custo" : "cost"} <strong>{rideWaveWillpowerCost} WP</strong>; {pt ? "alvo" : "target"} <strong>{rideWaveTarget} {pt ? "sucessos" : "successes"}</strong>{rideWaveBonus ? `; ${pt ? "bônus da Coil" : "Coil bonus"} +${rideWaveBonus}` : ""}.</p>
      {frenzyActive && <p className="wide"><strong>{pt ? "Frenzy ativo" : "Active Frenzy"}:</strong> +{bloodPotency} {pt ? "em rolagens/resistências de Força, Destreza e Vigor; sem penalidades de ferimento. Potência efetiva para sentidos/aura" : "to Strength, Dexterity, and Stamina rolls/resistances; ignore wound penalties. Effective Potency for senses/aura"}: <strong>{frenzySenseBloodPotency}</strong>.</p>}
      {beastPowerAvailable && frenzyActive && <label className="wide"><span>Beast&apos;s Power</span><Switch checked={beastPowerActive} onCheckedChange={(checked) => setState("frenzy_beast_power_active", checked)} /></label>}
      {beastPowerActive && <p className="wide"><strong>Beast&apos;s Power:</strong> Defense {combatDerived.Defesa}, Health {combatDerived.Vitalidade}, Speed {combatDerived.Deslocamento}.</p>}
      <p className="wide"><strong>Touchstone:</strong> {pt ? `requer ${bloodPotency * 3} sucessos em uma ação Social prolongada para encerrar Frenzy.` : `requires ${bloodPotency * 3} successes on an extended Social action to talk the vampire down.`}</p>
    </div>
  </>;
}

function StructuredRecords({ values, onChange, levelLabel }: { values: Record<string, unknown>[]; onChange: (value: EditableRecord[]) => void; levelLabel?: string }) {
  const { t } = useLanguage();
  const rows = values.map((item, index): EditableRecord => ({ id: String(item.id ?? `record-${index}`), subject: String(item.subject ?? item.name ?? ""), stage: Number(item.stage ?? item.level ?? 1), notes: String(item.notes ?? "") }));
  const update = (index: number, patch: Partial<EditableRecord>) => onChange(rows.map((item, row) => row === index ? { ...item, ...patch } : item));
  return <div className="vampire-records">{rows.map((item, index) => <div key={item.id}><Input value={item.subject} placeholder={t("ui.nameOrSubject")} onChange={(event) => update(index, { subject: event.target.value })} />{levelLabel && <label>{levelLabel}<Input type="number" min={1} max={3} value={item.stage} onChange={(event) => update(index, { stage: Number(event.target.value) })} /></label>}<Input value={item.notes} placeholder={t("ui.notes8c4aa0")} onChange={(event) => update(index, { notes: event.target.value })} /><Button type="button" size="icon" variant="ghost" onClick={() => onChange(rows.filter((_, row) => row !== index))}><Trash2 /></Button></div>)}<Button type="button" size="sm" variant="outline" onClick={() => onChange([...rows, { id: createRandomId(), subject: "", stage: 1, notes: "" }])}><Plus /> {t("ui.addRecord")}</Button></div>;
}
