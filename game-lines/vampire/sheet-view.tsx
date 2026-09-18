"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Plus, Trash2 } from "lucide-react";
import { CharacterPaperShell, EditableList, NotesArea, PowerResource, ResourceTrack, SheetField, boundedNumber, updateLineData } from "@/app/workspace/character-paper-shell";
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
import type { VampireCondition, VampirePowers, VampireReference } from "./catalog-types";
import { bloodPotencyRow, objectArray, recordRatings, VAMPIRE_DISCIPLINES, vampireCovenantStatus, vampireDerived, vampireDisciplineDisplayName } from "./creation-rules";
import { VampireExperiencePanel } from "./experience-panel";

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
  const { tr } = useLanguage();
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
              aria-label={tr(`Touchstone da Humanidade ${rating}`, `Humanity ${rating} Touchstone`)}
              onChange={(event) => setTouchstoneName(rating, meritPoint, event.target.value)}
            />
          : <span className="vampire-humanity-line" aria-hidden="true" />}
        <strong>{rating}</strong>
        <button
          type="button"
          className={`vampire-humanity-dot${value === rating ? " on" : ""}`}
          aria-pressed={value === rating}
          aria-label={tr(`Definir Humanidade ${rating}`, `Set Humanity ${rating}`)}
          onClick={() => setHumanity(rating)}
        />
      </div>;
    })}
  </div>;
}

export function VampireCharacterPaper({ character, updateState, updateSheet, catalogs }: GameLineSheetProps) {
  if (!catalogs) throw new Error("Vampire sheet requires its catalog snapshot.");
  const { locale, t, tr } = useLanguage();
  const isMobile = useIsMobile();
  const reference = catalogs.get<VampireReference>("vampire-reference");
  const powers = catalogs.get<VampirePowers>("vampire-powers");
  const merits = [...catalogs.get<readonly MeritDefinition[]>("core-merits"), ...catalogs.get<readonly MeritDefinition[]>("vampire-merits")];
  const coreConditions = catalogs.get<{ conditions: ConditionDefinition[] }>("core-reference").conditions;
  const vampireConditions = catalogs.get<readonly VampireCondition[]>("vampire-conditions") as readonly ConditionDefinition[];
  const conditionCatalog = [...coreConditions, ...vampireConditions];
  const data = character.line_data;
  const clan = reference.clans.find((item) => item.id === data.clan_id);
  const covenant = reference.covenants.find((item) => item.id === data.covenant_id);
  const mask = reference.anchors.find((item) => item.id === data.mask_id);
  const dirge = reference.anchors.find((item) => item.id === data.dirge_id);
  const disciplines = recordRatings(data.disciplines, VAMPIRE_DISCIPLINES, 10);
  const bloodPotency = Math.max(1, Math.min(10, Number(data.blood_potency ?? 1)));
  const limits = bloodPotencyRow(reference, bloodPotency);
  const feedingTierLabel = {
    Animals: tr("Animais", "Animals"),
    Humans: tr("Humanos", "Humans"),
    Kindred: tr("Vampiros", "Kindred"),
  } satisfies Record<typeof limits.feedingTier, string>;
  const derived = vampireDerived(character.attributes, character.skills, disciplines, bloodPotency, reference);
  const health = Math.max(1, Number(derived.Vitalidade ?? 5));
  const willpower = Math.max(1, Number(derived.ForçaDeVontade ?? 1));
  const vitaeMaximum = typeof limits.vitaeMaximum === "number" ? limits.vitaeMaximum : Number(character.attributes.Stamina ?? 1) + Number(disciplines.Resilience ?? 0);
  const vitae = boundedNumber(character.current_state.vitae_current, vitaeMaximum, vitaeMaximum);
  const currentWillpower = boundedNumber(character.current_state.willpower_current, willpower, willpower);
  const damage = normalizeDamage(character.current_state.health_damage, health);
  const humanity = Math.max(0, Math.min(10, Number(data.humanity ?? 7)));
  const torporReference = reference.torpor.find((row) => humanity >= row.humanityMinimum && humanity <= row.humanityMaximum);
  const conditions = selectedConditions(character.current_state.conditions);
  const aspirations = stringList(data.aspirations);
  const notes = String(character.current_state.notes ?? "");
  const [mobileTab, setMobileTab] = useState({ characterId: character.id, value: "summary" });
  const tab = mobileTab.characterId === character.id ? mobileTab.value : "summary";
  const setState = (key: string, value: unknown) => updateState({ ...character.current_state, [key]: value });
  const identity = <section className="sheet-identity-grid">
    <SheetField label={tr("Nome", "Name")} value={character.character.name} />
    <SheetField label={t("sheet.mask")} value={localized(mask, locale)} tooltip={mask?.singleWillpower} />
    <SheetField label={t("sheet.clan")} value={localized(clan, locale)} />
    <SheetField label={tr("Jogador", "Player")} value={character.character.player} />
    <SheetField label={t("sheet.dirge")} value={localized(dirge, locale)} tooltip={dirge?.allWillpower} />
    <SheetField label={t("sheet.bloodline")} value={String(data.bloodline ?? "")} />
    <SheetField label={tr("Crônica", "Chronicle")} value={character.character.chronicle} />
    <SheetField label={tr("Conceito", "Concept")} value={character.character.concept} />
    <SheetField label={t("sheet.covenant")} value={localized(covenant, locale)} />
  </section>;
  const attributes = <>
    <SheetHeading>{tr("Atributos", "Attributes")}</SheetHeading><div className={isMobile ? "mobile-attribute-grid" : "official-trait-grid"}>{Object.entries(ATTRIBUTES).map(([category, names]) => <TraitBlock key={category} title={category} names={names} values={character.attributes} compactNames={isMobile} />)}</div>
  </>;
  const skills = <>
  <SheetHeading>{tr("Perícias", "Skills")}</SheetHeading>

  <div className={isMobile ? "mobile-trait-stack" : "vampire-skill-grid"}>
    {Object.entries(SKILLS).map(([category, names]) =>
      <TraitBlock
        key={category}
        title={category}
        subtitle={
          category === "Mental"
            ? tr("(-3 se não treinado)", "(-3 if Untrained)")
            : tr("(-1 se não treinado)", "(-1 if Untrained)")
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
    <SheetHeading className="ctl-single-divider vampire-humanity-heading">{tr("Humanidade", "Humanity")}</SheetHeading>
    <HumanityTrack character={character} updateSheet={updateSheet} value={humanity} />
  </>;
  const summary = <>
    {identity}
    <SheetHeading>{tr("Aspirações", "Aspirations")}</SheetHeading>
    <EditableList values={aspirations} minimum={3} maximum={3} placeholder={tr("Escreva uma Aspiração", "Write an Aspiration")} onChange={(value) => updateLineData(updateSheet, character, "aspirations", value)} />
    {humanitySection}
    <SheetHeading>{tr("Condições", "Conditions")}</SheetHeading>
    <ConditionManager selected={conditions} catalog={conditionCatalog} onChange={(value) => setState("conditions", value)} />
    <SheetHeading>{tr("Experiência", "Experience")}</SheetHeading>
    <VampireExperiencePanel character={character} updateSheet={updateSheet} catalogs={catalogs} />
  </>;
  const powerPage = <>
    <PowerResource
      name={tr("Potência de Sangue", "Blood Potency")}
      rating={bloodPotency}
      resourceName="Vitae"
      current={vitae}
      maximum={vitaeMaximum}
      perTurn={limits.vitaePerTurn}
      onChange={(value) => setState("vitae_current", value)}
      summary={`${tr("Pode se alimentar de", "Can feed from")}: ${feedingTierLabel[limits.feedingTier]}`}
    />
    <SheetHeading>{tr("Disciplinas", "Disciplines")}</SheetHeading><div className="vampire-power-grid">{powers.disciplines.filter((item) => disciplines[item.name] > 0).map((item) => <article key={item.id}><header><strong>{localized(item, locale)}</strong><DotValue value={disciplines[item.name]} /></header><p>{item.summary}</p>{item.levels.filter((level) => level.rating <= disciplines[item.name]).map((level) => <div className="vampire-power-level" key={level.rating}><strong>{level.rating}. {localized(level, locale)}</strong><span>{level.summary}</span></div>)}</article>)}</div>
    {Number(disciplines.Protean ?? 0) >= 2 && <ProteanChoicesEditor character={character} updateSheet={updateSheet} rating={Number(disciplines.Protean ?? 0)} />}
    <PurchasedPowers character={character} powers={powers} locale={locale} scope="devotions" />
  </>;
  const covenantStatus = covenant ? vampireCovenantStatus(character, covenant.id, covenant.name, covenant.translatedName) : 0;
  const covenantPage = <><SheetHeading>Covenant</SheetHeading><article className="vampire-covenant-summary"><Image src="/vampire-skull.png" width={82} height={82} alt="" aria-hidden="true" /><div><h3>{localized(covenant, locale) || tr("Sem Covenant", "Covenantless")}</h3><p>{covenant?.description ?? tr("Este Kindred não pertence a um Covenant.", "This Kindred belongs to no Covenant.")}</p><strong>{tr("Vantagem", "Advantage")}: {covenant?.advantage ?? tr("Nenhuma", "None")}</strong><span>Kindred Status: <DotValue value={covenantStatus} /></span></div></article>{covenant?.id === "ordo-dracul" && <article className="vampire-lore-card"><strong>Mystery</strong><p>{String((data.ordo_dracul as Record<string, unknown> | undefined)?.mystery_id ?? tr("Não selecionado", "Not selected"))}</p></article>}<PurchasedPowers character={character} powers={powers} locale={locale} scope="covenant" /></>;
  const combat = <><div className="vampire-track-grid"><section><SheetHeading>{tr("Vitalidade", "Health")}</SheetHeading><HealthTrack health={health} damage={damage} onChange={(value) => setState("health_damage", value)} /></section><section><SheetHeading>{tr("Força de Vontade", "Willpower")}</SheetHeading><ResourceTrack label={tr("Força de Vontade", "Willpower")} current={currentWillpower} maximum={willpower} onChange={(value) => setState("willpower_current", value)} /></section></div><CombatPage character={character} derived={derived} updateSheet={updateSheet} /><SheetHeading>{tr("Referências Kindred", "Kindred References")}</SheetHeading><div className="vampire-reference-grid"><article className="vampire-lore-card"><strong>Physical Intensity</strong><p>{tr("Gaste 1 Vitae para receber +2 nas rolagens de um Atributo Físico escolhido durante o turno.", "Spend 1 Vitae for +2 on rolls using one chosen Physical Attribute for the turn.")}</p></article><article className="vampire-lore-card"><strong>{tr("Cura", "Healing")}</strong><p>{tr("1 Vitae cura dois níveis de dano contusivo ou um letal. Dano agravado exige cinco Vitae e um dia.", "1 Vitae heals two bashing or one lethal damage. Aggravated damage requires five Vitae and one day.")}</p></article><article className="vampire-lore-card"><strong>Predatory Aura</strong><p>{tr("Escolha o aspecto Monstrous, Seductive ou Competitive e resolva a interação conforme a regra da mesa.", "Choose the Monstrous, Seductive, or Competitive aspect and resolve the interaction at the table.")}</p></article><article className="vampire-lore-card"><strong>Frenzy</strong><p>{tr("A ficha mantém recursos e estados; resistência, Riding the Wave e consequências permanecem decisões da mesa.", "The sheet tracks resources and states; resistance, Riding the Wave, and consequences remain table decisions.")}</p></article></div></>;
  const records = <>
    <VampireStateControls character={character} setState={setState} baseTorpor={torporReference?.duration ?? "—"} bloodPotency={bloodPotency} />
    <SheetHeading>{tr("Maldições", "Banes")}</SheetHeading>
    <div className="vampire-main-banes">
      <article className="vampire-lore-card"><strong>{clan?.baneName ?? tr("Maldição do Clã", "Clan Bane")}</strong><p>{clan?.baneSummary ?? ""}</p></article>
      {objectArray(data.banes).map((bane, index) => <article className="vampire-lore-card" key={index}><strong>{String(bane.name ?? tr("Maldição", "Bane"))}</strong><p>{String(bane.notes ?? "")}</p></article>)}
    </div>
    <SheetHeading>{tr("Referências de Humanidade", "Humanity References")}</SheetHeading>
    <div className="vampire-reference-grid">
      <article className="vampire-lore-card"><strong>{tr("Torpor", "Torpor")}</strong><p>{tr("Duração-base para a Humanidade atual", "Base duration for current Humanity")}: <b>{torporReference?.duration ?? "—"}</b>. {tr("Multiplique pela Potência de Sangue.", "Multiply by Blood Potency.")}</p></article>
      <article className="vampire-lore-card"><strong>{tr("Sol e Humanidade", "Sunlight and Humanity")}</strong><p>{tr("A luz solar causa dano agravado. Consulte a intensidade da exposição e a Humanidade para determinar o intervalo do dano.", "Sunlight causes aggravated damage. Use exposure intensity and Humanity to determine the damage interval.")}</p></article>
    </div>
    <SheetHeading>Blood Bonds</SheetHeading>
    <StructuredRecords values={objectArray(character.current_state.blood_bonds)} levelLabel={tr("Estágio", "Stage")} onChange={(value) => setState("blood_bonds", value)} />
    <SheetHeading>{tr("Dependência de Vitae", "Vitae Addiction")}</SheetHeading>
    <StructuredRecords values={objectArray(character.current_state.vitae_addictions)} onChange={(value) => setState("vitae_addictions", value)} />
    <SheetHeading>{tr("Anotações", "Notes")}</SheetHeading>
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
      <EditableList values={aspirations} minimum={3} maximum={3} placeholder={tr("Escreva uma Aspiração", "Write an Aspiration")} onChange={(value) => updateLineData(updateSheet, character, "aspirations", value)} />
      {humanitySection}
    </>}
    conditions={<ConditionManager selected={conditions} catalog={conditionCatalog} onChange={(value) => setState("conditions", value)} />}
    health={<><SheetHeading>{tr("Vitalidade", "Health")}</SheetHeading><HealthTrack health={health} damage={damage} onChange={(value) => setState("health_damage", value)} /></>}
    willpower={<><SheetHeading>{tr("Força de Vontade", "Willpower")}</SheetHeading><ResourceTrack label={tr("Força de Vontade", "Willpower")} current={currentWillpower} maximum={willpower} onChange={(value) => setState("willpower_current", value)} /></>}
    specificPowersTitle={tr("Disciplinas", "Disciplines")}
    powerStat={
      <MainPowerStat
        label={tr("Potência de Sangue", "Blood Potency")}
        value={bloodPotency}
        summary={`${tr("Pode se alimentar de", "Can feed from")}: ${feedingTierLabel[limits.feedingTier]}`}
      />
    }
    fuel={<MainFuel label="Vitae" current={vitae} maximum={vitaeMaximum} onChange={(value) => setState("vitae_current", value)} />}
    stability={null}
    derived={derived}
    experience={<VampireExperiencePanel character={character} updateSheet={updateSheet} catalogs={catalogs} />}
  />;

  if (isMobile) return <CharacterPaperShell line="VtR" mobile title="VAMPIRE" subtitle="THE REQUIEM"><VampireDecorativeFrame /><SwipeableSheetTabs value={tab} onValueChange={(value) => setMobileTab({ characterId: character.id, value })} tabs={[
    { value: "summary", label: tr("Resumo", "Summary") },
    { value: "stats", label: "Stats" },
    { value: "powers", label: tr("Poderes", "Powers") },
    { value: "covenant", label: "Covenant" },
    { value: "combat", label: tr("Combate", "Combat") },
    { value: "records", label: tr("Registros", "Records") },
  ]}>{{ summary, stats, powers: powerPage, covenant: covenantPage, combat, records }}</SwipeableSheetTabs></CharacterPaperShell>;

  return <CharacterPaperShell line="VtR" title="VAMPIRE" subtitle="THE REQUIEM"><VampireDecorativeFrame /><Tabs defaultValue="main" className="vampire-sheet-tabs"><TabsList aria-label={tr("Páginas da ficha", "Character pages")}>
    <TabsTrigger value="main">{tr("Principal", "Main")}</TabsTrigger>
    <TabsTrigger value="powers">{tr("Poderes", "Powers")}</TabsTrigger>
    <TabsTrigger value="covenant">Covenant</TabsTrigger>
    <TabsTrigger value="combat">{tr("Combate", "Combat")}</TabsTrigger>
    <TabsTrigger value="records">{tr("Registros", "Records")}</TabsTrigger>
  </TabsList>
    <TabsContent value="main" className="vampire-sheet-page">{mainBody}</TabsContent>
    <TabsContent value="powers" className="vampire-sheet-page">{powerPage}</TabsContent>
    <TabsContent value="covenant" className="vampire-sheet-page">{covenantPage}</TabsContent>
    <TabsContent value="combat" className="vampire-sheet-page">{combat}</TabsContent>
    <TabsContent value="records" className="vampire-sheet-page">{records}</TabsContent>
  </Tabs></CharacterPaperShell>;
}

function VampireDisciplineLine({ name, value }: { name: string; value: number }) {
  return <div className="official-trait-line"><span className="official-trait-label"><span className="official-trait-name">{name}</span></span><DotValue value={value} /></div>;
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
  return <><SheetHeading>{t("sheet.otherPowers")}</SheetHeading><div className="vampire-power-grid">{selected.map((item) => { const rating = item.kind === "coil" ? Number(coilRatings[item.id] ?? 0) : item.rating; return <article key={item.id}><header><strong>{localized(item, locale)}</strong>{Boolean(rating) && <DotValue value={Number(rating)} />}</header><small>{item.kind}{item.prerequisites ? ` · ${item.prerequisites}` : ""}</small><p>{item.summary}</p>{item.levels?.filter((level) => level.rating <= Number(rating ?? 0)).map((level) => <div className="vampire-power-level" key={level.rating}><strong>{level.rating}. {localized(level, locale)}</strong><span>{level.summary}</span></div>)}</article>; })}</div></>;
}

function ProteanChoicesEditor({ character, updateSheet, rating }: { character: CharacterSheet; updateSheet: (sheet: CharacterSheet) => void; rating: number }) {
  const { tr } = useLanguage();
  const choices = character.line_data.discipline_choices && typeof character.line_data.discipline_choices === "object" && !Array.isArray(character.line_data.discipline_choices) ? character.line_data.discipline_choices as Record<string, unknown> : {};
  const set = (key: string, value: string[]) => { const next = structuredClone(character); next.line_data = { ...next.line_data, discipline_choices: { ...choices, [key]: value } }; updateSheet(next); };
  return <><SheetHeading>{tr("Escolhas de Protean", "Protean Choices")}</SheetHeading><div className="vampire-protean-choices">
    <section><strong>Predatory Aspect</strong><EditableList values={stringList(choices.protean_aspects)} minimum={3} maximum={3} placeholder={tr("Adaptação animal", "Animal adaptation")} onChange={(value) => set("protean_aspects", value)} /></section>
    {rating >= 3 && <section><strong>Beast&apos;s Skin</strong><EditableList values={stringList(choices.protean_forms)} minimum={1} placeholder={tr("Forma animal", "Animal form")} onChange={(value) => set("protean_forms", value)} /></section>}
    {rating >= 4 && <section><strong>Unnatural Aspect</strong><EditableList values={stringList(choices.protean_unnatural_aspect)} minimum={3} maximum={3} placeholder={tr("Aspecto monstruoso", "Monstrous adaptation")} onChange={(value) => set("protean_unnatural_aspect", value)} /></section>}
  </div></>;
}

function VampireStateControls({ character, setState, baseTorpor, bloodPotency }: { character: CharacterSheet; setState: (key: string, value: unknown) => void; baseTorpor: string; bloodPotency: number }) {
  const { tr } = useLanguage();
  const torpor = character.current_state.torpor && typeof character.current_state.torpor === "object" && !Array.isArray(character.current_state.torpor) ? character.current_state.torpor as Record<string, unknown> : {};
  const setTorpor = (patch: Record<string, unknown>) => setState("torpor", { ...torpor, ...patch });
  return <><SheetHeading>{tr("Estados Vampíricos", "Vampiric States")}</SheetHeading><div className="vampire-state-controls"><label><span>Blush of Life</span><Switch checked={Boolean(character.current_state.blush_of_life_active)} onCheckedChange={(checked) => setState("blush_of_life_active", checked)} /></label><label><span>{tr("Em torpor", "In torpor")}</span><Switch checked={Boolean(torpor.active)} onCheckedChange={(checked) => setTorpor({ active: checked })} /></label>{Boolean(torpor.active) && <><label>{tr("Início", "Started")}<Input type="date" value={String(torpor.started_at ?? "")} onChange={(event) => setTorpor({ started_at: event.target.value })} /></label><label>{tr("Fim estimado", "Expected end")}<Input type="date" value={String(torpor.expected_end ?? "")} onChange={(event) => setTorpor({ expected_end: event.target.value })} /></label><label className="wide">{tr("Notas de torpor", "Torpor notes")}<Input value={String(torpor.notes ?? "")} onChange={(event) => setTorpor({ notes: event.target.value })} /></label><p className="wide">{tr("Duração-base", "Base duration")}: <strong>{baseTorpor}</strong> × {tr("Potência de Sangue", "Blood Potency")} <strong>{bloodPotency}</strong>. {tr("A data permanece uma estimativa narrativa editável.", "The date remains an editable narrative estimate.")}</p></>}</div></>;
}

function StructuredRecords({ values, onChange, levelLabel }: { values: Record<string, unknown>[]; onChange: (value: EditableRecord[]) => void; levelLabel?: string }) {
  const { tr } = useLanguage();
  const rows = values.map((item, index): EditableRecord => ({ id: String(item.id ?? `record-${index}`), subject: String(item.subject ?? item.name ?? ""), stage: Number(item.stage ?? item.level ?? 1), notes: String(item.notes ?? "") }));
  const update = (index: number, patch: Partial<EditableRecord>) => onChange(rows.map((item, row) => row === index ? { ...item, ...patch } : item));
  return <div className="vampire-records">{rows.map((item, index) => <div key={item.id}><Input value={item.subject} placeholder={tr("Nome ou alvo", "Name or subject")} onChange={(event) => update(index, { subject: event.target.value })} />{levelLabel && <label>{levelLabel}<Input type="number" min={1} max={3} value={item.stage} onChange={(event) => update(index, { stage: Number(event.target.value) })} /></label>}<Input value={item.notes} placeholder={tr("Notas", "Notes")} onChange={(event) => update(index, { notes: event.target.value })} /><Button type="button" size="icon" variant="ghost" onClick={() => onChange(rows.filter((_, row) => row !== index))}><Trash2 /></Button></div>)}<Button type="button" size="sm" variant="outline" onClick={() => onChange([...rows, { id: createRandomId(), subject: "", stage: 1, notes: "" }])}><Plus /> {tr("Adicionar registro", "Add record")}</Button></div>;
}
