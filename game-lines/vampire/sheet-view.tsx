"use client";

import { type ReactNode, useEffect, useState } from "react";
import { Link2, Plus, Trash2 } from "lucide-react";
import { MeritConfigurationEditor } from "@/app/builder/merit-configuration-editor";
import { CharacterPaperShell, EditableList, NotesArea, PowerResource, ResourceTrack, SheetField, boundedNumber, updateLineData } from "@/app/workspace/character-paper-shell";
import { CombatPage } from "@/app/workspace/combat-page";
import { ConditionManager, type ConditionDefinition, type SelectedCondition } from "@/app/workspace/condition-manager";
import { HealthTrack, SheetHeading, TraitBlock, DotValue, stringList } from "@/app/workspace/sheet-primitives";
import { MainFuel, MainPowerStat, MainSheet } from "@/app/workspace/main-sheet";
import { commonExpandedConfigurationLines, configuredDefinitionLines } from "@/app/workspace/merit-configuration-presentation";
import { SwipeableSheetTabs } from "@/app/workspace/sheet-tabs";
import { RuleSelect } from "@/app/workspace/rule-select";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useIsMobile } from "@/hooks/use-mobile";
import type { CharacterSheet } from "@/lib/core/character/character-types";
import { ATTRIBUTES, SKILLS } from "@/lib/core/character/creation-rules";
import { meritConfigurationTitle } from "@/lib/core/character/merit-configuration";
import type { GameLineSheetProps } from "@/lib/game-line-contracts/game-line-ui";
import { useLanguage, type Locale } from "@/lib/i18n";
import type { MeritDefinition } from "@/lib/merits";
import { createRandomId } from "@/lib/random-id";
import { normalizeDamage } from "@/lib/resource-rules";
import type { VampireCondition, VampireMechanics, VampirePowers, VampireReference, VampireRitualDisciplineDefinition } from "./catalog-types";
import { bloodPotencyRow, objectArray, recordRatings, VAMPIRE_DISCIPLINES, vampireCovenantIds, vampireDerived, vampireDisciplineDisplayName, vampireSunlightSummary } from "./creation-rules";
import { VampireExperiencePanel } from "./experience-panel";
import { VampireCompanionPage } from "./companion-page";
import { DETACHMENT_BREAKING_POINT_OPTIONS, DETACHMENT_BREAKING_POINT_TIERS, VAST_DYNASTY_EMBRACE_BREAKING_POINT, vampireDetachmentBaseDice } from "./detachment";
import { vampireOwnedCoilRuleEffects, vampireRuleEffectsFor } from "./power-rule-effects";
import { VAMPIRE_MERIT_CONFIGURATIONS } from "./merit-configurations";
import { BloodlineJoinDialog, BloodlinePage } from "./bloodline-page";
import { useBloodlineHomebrews } from "./use-bloodline-homebrews";
import { useMeritHomebrews } from "@/app/use-merit-homebrews";
import { useHomebrewPreferences } from "@/app/use-homebrew";
import { mergeMeritHomebrews } from "@/lib/merit-homebrews";
import { vampireHomebrewContentActive } from "./homebrew-catalog";

type EditableRecord = { id: string; subject: string; stage?: number; notes: string };

function localized<T extends { name: string; translatedName: string }>(item: T | undefined, locale: string) {
  return item ? (locale === "pt-BR" ? item.translatedName : item.name) : "";
}

export function ownedVampireCoils(powers: Pick<VampirePowers, "coils">, ratings: Record<string, number>) {
  return powers.coils.filter((item) => Number(ratings[item.id] ?? 0) > 0);
}

export function ownedVampireRituals(powers: Pick<VampirePowers, "cruacRites" | "thebanMiracles" | "kimiyaFormulae" | "therionSacrileges" | "gildedInvocations">, discipline: VampireRitualDisciplineDefinition["id"], ids: unknown) {
  const selected = new Set(stringList(ids));
  const catalog = discipline === "cruac" ? powers.cruacRites : discipline === "theban" ? powers.thebanMiracles : discipline === "kimiya" ? powers.kimiyaFormulae : discipline === "therion" ? powers.therionSacrileges : powers.gildedInvocations;
  return catalog.filter((item) => selected.has(item.id));
}

const ritualFields = {
  cruac: ["cruac_rating", "cruac_rite_ids"],
  theban: ["theban_rating", "theban_miracle_ids"],
  kimiya: ["kimiya_rating", "kimiya_formula_ids"],
  therion: ["therion_rating", "therion_sacrilege_ids"],
  "gilded-cage": ["gilded_cage_rating", "gilded_invocation_ids"],
} as const;

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
  vastDynasty = false,
  clanBaneActive = true,
  bloodlineId = "",
}: {
  character: CharacterSheet;
  updateSheet: (sheet: CharacterSheet) => void;
  value: number;
  vastDynasty?: boolean;
  clanBaneActive?: boolean;
  bloodlineId?: string;
}) {
  const { t } = useLanguage();
  const baseSlot = String(character.line_data.clan_id ?? "") === "ventrue" && clanBaneActive ? 7 : 6;
  const allMeritPoints = getTouchstoneMeritPoints(character, baseSlot);
  const meritPoints = bloodlineId === "vilseduire" ? [] : allMeritPoints;
  const touchstones = objectArray(character.line_data.touchstones);
  const attachedTouchstones = bloodlineId === "vilseduire"
    ? Math.min(1, touchstones.filter((row) => !String(row.merit_point_key ?? "") && String(row.name ?? "").trim()).length)
    : touchstones.filter((row) => String(row.name ?? "").trim()).length;
  const activeBanes = objectArray(character.line_data.banes)
    .filter((bane) => String(bane.name ?? "").trim() && String(bane.breaking_point_id ?? "").trim())
    .slice(0, 3);
  const protectedBreakingPoints = new Set(activeBanes.map((bane) => String(bane.breaking_point_id)));
  const vastDynastyProtected = protectedBreakingPoints.has(VAST_DYNASTY_EMBRACE_BREAKING_POINT.id);
  const [open, setOpen] = useState(false);
  const detachmentHumanity = bloodlineId === "vilseduire" ? Math.floor(value / 2) : value;
  const firstAvailable = DETACHMENT_BREAKING_POINT_OPTIONS.find((item) => item.level <= detachmentHumanity && !protectedBreakingPoints.has(item.id));
  const [breakingPointId, setBreakingPointId] = useState(firstAvailable?.id ?? "");
  const [protectMasquerade, setProtectMasquerade] = useState(false);
  const [protectRequiem, setProtectRequiem] = useState(false);
  const [vastDynastyEmbrace, setVastDynastyEmbrace] = useState(false);
  const [result, setResult] = useState<"dramatic-failure" | "failure" | "success" | "exceptional-success">("success");
  const [beastCondition, setBeastCondition] = useState<"bestial" | "competitive" | "wanton">("bestial");

  useEffect(() => {
    const activePoints = new Map(getTouchstoneMeritPoints(character, baseSlot).map((point) => [point.key, point]));
    const currentRows = objectArray(character.line_data.touchstones);
    const unboundRows = currentRows.filter((row) => !String(row.merit_point_key ?? ""));
    const baseRow = unboundRows.find((row) => Number(row.humanity_slot) === baseSlot) ?? unboundRows[0];
    const nextRows: Record<string, unknown>[] = [];

    if (baseRow) nextRows.push({ ...baseRow, humanity_slot: baseSlot });

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
    next.line_data = { ...next.line_data, touchstones: nextRows };
    updateSheet(next);
  }, [baseSlot, character, updateSheet]);

  const setTouchstoneName = (slot: number, meritPoint: TouchstoneMeritPoint | undefined, name: string) => {
    const currentRows = objectArray(character.line_data.touchstones);
    const key = meritPoint?.key ?? "";
    const rowIndex = currentRows.findIndex((row) => key ? String(row.merit_point_key ?? "") === key : !String(row.merit_point_key ?? ""));
    const nextRows = [...currentRows];
    const existing = rowIndex >= 0 ? nextRows[rowIndex] : undefined;

    if (!name.trim()) {
      if (rowIndex >= 0) nextRows.splice(rowIndex, 1);
    } else {
      const row: Record<string, unknown> = {
        ...(existing ?? {}), id: String(existing?.id ?? createRandomId()), name,
        humanity_slot: slot, notes: String(existing?.notes ?? ""),
      };
      if (meritPoint) {
        row.merit_point_key = meritPoint.key;
        row.merit_instance_id = meritPoint.meritInstanceId;
        row.merit_dot = meritPoint.dot;
      } else {
        delete row.merit_point_key; delete row.merit_instance_id; delete row.merit_dot;
      }
      if (rowIndex >= 0) nextRows[rowIndex] = row; else nextRows.push(row);
    }

    const next = structuredClone(character);
    next.line_data = { ...next.line_data, touchstones: nextRows };
    updateSheet(next);
  };

  const requestedBreakingPoint = DETACHMENT_BREAKING_POINT_OPTIONS.find(
  (item) => item.id === breakingPointId
);

const selectedBreakingPoint =
  requestedBreakingPoint &&
  requestedBreakingPoint.level <= detachmentHumanity &&
  !protectedBreakingPoints.has(requestedBreakingPoint.id)
    ? requestedBreakingPoint
    : firstAvailable;

const effectiveBreakingPointId = selectedBreakingPoint?.id ?? "";
  const effectiveBreakingPoint = vastDynastyEmbrace ? 3 : Number(selectedBreakingPoint?.level ?? 0);
  const touchstoneModifier = bloodlineId === "liderc" && attachedTouchstones > 0 ? 1 : attachedTouchstones === 0 ? -2 : attachedTouchstones === 1 ? 2 : 3;
  const specialModifier = (protectMasquerade ? -1 : 0) + (protectRequiem ? 1 : 0) + (vastDynastyEmbrace ? 1 : 0);
  const detachmentPool = vampireDetachmentBaseDice(effectiveBreakingPoint) + touchstoneModifier + specialModifier - activeBanes.length;
  const applicable = vastDynastyEmbrace ? detachmentHumanity >= 3 && !vastDynastyProtected : Boolean(selectedBreakingPoint && selectedBreakingPoint.level <= detachmentHumanity && !protectedBreakingPoints.has(selectedBreakingPoint.id));

  const applyDetachment = () => {
    if (!applicable) return;
    const next = structuredClone(character);
    const losesHumanity = result === "dramatic-failure" || result === "failure";
    if (losesHumanity) next.line_data.humanity = Math.max(0, value - 1);

    const conditionId = result === "dramatic-failure" ? "jaded" : result === "exceptional-success" ? "inspired" : beastCondition;
    const currentConditions = Array.isArray(next.current_state.conditions)
      ? next.current_state.conditions as Array<Record<string, unknown>> : [];
    if (!currentConditions.some((item) => String(item.id ?? "") === conditionId)) {
      currentConditions.push({ id: conditionId, persistent: conditionId === "jaded", instanceId: createRandomId() });
    }
    if (bloodlineId === "icelus" && result === "failure" && !currentConditions.some((item) => String(item.id ?? "") === "mesmerized")) {
      currentConditions.push({ id: "mesmerized", persistent: false, instanceId: createRandomId() });
    }

    const currentBeats = Math.max(0, Math.min(4, Math.trunc(Number(next.current_state.beats ?? 0))));
    const currentAvailable = Math.max(0, Math.trunc(Number(next.current_state.experience_available ?? 0)));
    const currentSpent = Math.max(0, Math.trunc(Number(next.current_state.experience_spent ?? 0)));
    const currentTotal = Math.max(currentAvailable + currentSpent, Math.max(0, Math.trunc(Number(next.current_state.experience_total ?? 0))));
    const beatTotal = currentBeats + 1;
    const history = Array.isArray(next.current_state.vampire_experience_history) ? next.current_state.vampire_experience_history : [];
    next.current_state = {
      ...next.current_state,
      conditions: currentConditions,
      beats: beatTotal >= 5 ? beatTotal - 5 : beatTotal,
      experience_available: beatTotal >= 5 ? currentAvailable + 1 : currentAvailable,
      experience_spent: currentSpent,
      experience_total: beatTotal >= 5 ? currentTotal + 1 : currentTotal,
      vampire_experience_history: losesHumanity ? [...history, {
        id: createRandomId(),
        label: `${t("ui.detachment")}: ${t(result === "dramatic-failure" ? "ui.dramaticFailure" : "ui.failure")}`,
        cost: 0,
        createdAt: new Date().toISOString(),
        undo: { kind: "humanityLoss", amount: 1 },
      }] : history,
    };
    updateSheet(next);
    setOpen(false);
    setProtectMasquerade(false); setProtectRequiem(false); setVastDynastyEmbrace(false);
    setResult("success"); setBeastCondition("bestial");
  };

  return <div className="vampire-humanity-section">
    <div className="vampire-humanity-heading-row">
      <SheetHeading className="ctl-single-divider vampire-humanity-heading">{t("ui.humanity")}</SheetHeading>
      <Button type="button" size="sm" variant="outline" className="builder-add-action vampire-detachment-trigger" onClick={() => setOpen(true)} disabled={value <= 0}>
        {t("ui.detachment")}
      </Button>
    </div>
    <div className="vampire-humanity-track">
      {Array.from({ length: 10 }, (_, index) => 10 - index).map((rating) => {
        const meritPoint = meritPoints.find((point) => point.slot === rating);
        const isBaseTouchstone = rating === baseSlot;
        const canWriteTouchstone = isBaseTouchstone || Boolean(meritPoint);
        const row = canWriteTouchstone
  ? touchstones.find((item) =>
      meritPoint
        ? String(item.merit_point_key ?? "") === meritPoint.key
        : !String(item.merit_point_key ?? ""),
    )
  : undefined;

return (
  <div
    className={`vampire-humanity-row${canWriteTouchstone ? " touchstone-slot" : ""}`}
    key={rating}
  >
    {canWriteTouchstone ? (
      <Input
        className="vampire-humanity-touchstone"
        value={String(row?.name ?? "")}
        placeholder={t("ui.touchstone")}
        aria-label={t("ui.humanityTouchstone", { p1: rating })}
        onChange={(event) =>
          setTouchstoneName(rating, meritPoint, event.target.value)
        }
      />
    ) : (
      <span className="vampire-humanity-line" aria-hidden="true" />
    )}

    <strong>{rating}</strong>

    <span
      className={`vampire-humanity-dot${rating <= value ? " on" : ""}`}
      aria-label={`${t("ui.humanity")} ${rating}`}
    />
  </div>
);
})}
</div>

<Dialog open={open} onOpenChange={setOpen}>
  <DialogContent className="experience-dialog vtr-dialog vampire-detachment-dialog">
    <DialogHeader>
      <DialogTitle>{t("ui.detachment")}</DialogTitle>

      <DialogDescription>
        {t("ui.detachmentDescription")}
      </DialogDescription>
    </DialogHeader>

    <div className="vampire-detachment-form">
      {vastDynasty && (
        <label
          className={`vampire-detachment-check${
            vastDynastyProtected ? " bane-protected" : ""
          }`}
        >
          <input
            type="checkbox"
            checked={vastDynastyEmbrace}
            disabled={vastDynastyProtected}
            onChange={(event) =>
              setVastDynastyEmbrace(event.target.checked)
            }
          />

          <span>
            <strong>{t("ui.vastDynastyEmbrace")}</strong>

            <small>
              {vastDynastyProtected
                ? t("ui.protectedByBane")
                : t("ui.vastDynastyEmbraceBreakingPoint")}
            </small>
          </span>
        </label>
      )}

      {!vastDynastyEmbrace && (
        <div className="vampire-breaking-point-tiers">
          {DETACHMENT_BREAKING_POINT_TIERS
            .filter((tier) => tier.level <= value)
            .map((tier) => (
              <section key={tier.level}>
                <header>
                  <strong>
                    {t("ui.humanity")} {tier.level}
                  </strong>

                  <span>
                    {tier.dice === 0
                      ? t("ui.chanceDie")
                      : t("ui.diceCount", { p1: tier.dice })}
                  </span>
                </header>

                <div>
                  {tier.breakingPoints.map((point) => {
                    const protectedByBane =
                      protectedBreakingPoints.has(point.id);

                    return (
                      <label
                        className={`vampire-breaking-point-row${
                          protectedByBane ? " bane-protected" : ""
                        }`}
                        key={point.id}
                      >
                        <input
                          type="radio"
                          name="vampire-breaking-point"
                          value={point.id}
                          checked={effectiveBreakingPointId === point.id}
                          disabled={protectedByBane}
                          onChange={() => setBreakingPointId(point.id)}
                        />

                        <span>{point.label}</span>

                        {protectedByBane && (
                          <small>{t("ui.protectedByBane")}</small>
                        )}
                      </label>
                    );
                  })}
                </div>
              </section>
            ))}
        </div>
      )}

      <div className="vampire-detachment-reference">
        <strong>
          {t("ui.detachmentPool")}:{" "}
          {detachmentPool <= 0
            ? t("ui.chanceDie")
            : t("ui.diceCount", { p1: detachmentPool })}
        </strong>

        <small>
          {t("ui.detachmentBaseDice", {
            p1: vampireDetachmentBaseDice(effectiveBreakingPoint),
          })}
          {" · "}
          {t("ui.touchstones")}{" "}
          {touchstoneModifier >= 0 ? "+" : ""}
          {touchstoneModifier}
          {activeBanes.length
            ? ` · ${t("ui.banes")} −${activeBanes.length}`
            : ""}
          {specialModifier
            ? ` · ${t("ui.otherModifier")} ${
                specialModifier >= 0 ? "+" : ""
              }${specialModifier}`
            : ""}
        </small>
      </div>

      <div className="vampire-detachment-modifiers">
        <label>
          <input
            type="checkbox"
            checked={protectMasquerade}
            onChange={(event) =>
              setProtectMasquerade(event.target.checked)
            }
          />{" "}
          {t("ui.protectingMasquerade")}
        </label>

        <label>
          <input
            type="checkbox"
            checked={protectRequiem}
            onChange={(event) =>
              setProtectRequiem(event.target.checked)
            }
          />{" "}
          {t("ui.protectingRequiem")}
        </label>
      </div>

      <label>
        {t("ui.rollResult")}

        <RuleSelect
          value={result}
          onChange={(nextValue) =>
            setResult(nextValue as typeof result)
          }
          options={[
            {
              value: "dramatic-failure",
              label: t("ui.dramaticFailure"),
            },
            {
              value: "failure",
              label: t("ui.failure"),
            },
            {
              value: "success",
              label: t("ui.success"),
            },
            {
              value: "exceptional-success",
              label: t("ui.exceptionalSuccess"),
            },
          ]}
        />
      </label>

      {(result === "failure" || result === "success") && (
        <label>
          {t("ui.conditionGained")}

          <RuleSelect
            value={beastCondition}
            onChange={(nextValue) =>
              setBeastCondition(nextValue as typeof beastCondition)
            }
            options={[
              { value: "bestial", label: t("ui.bestial") },
              {
                value: "competitive",
                label: t("ui.competitive"),
              },
              { value: "wanton", label: t("ui.wanton") },
            ]}
          />
        </label>
      )}

      <div className="vampire-detachment-outcome">
        {result === "dramatic-failure" && (
          <p>{t("ui.detachmentDramaticFailure")}</p>
        )}

        {result === "failure" && (
          <p>
            {t("ui.detachmentFailure", {
              p1: beastCondition,
            })}
          </p>
        )}

        {result === "success" && (
          <p>
            {t("ui.detachmentSuccess", {
              p1: beastCondition,
            })}
          </p>
        )}

        {result === "exceptional-success" && (
          <p>{t("ui.detachmentExceptionalSuccess")}</p>
        )}
      </div>
    </div>

    <DialogFooter>
      <Button
        type="button"
        size="sm"
        variant="outline"
        className="catalog-dialog-done"
        onClick={() => setOpen(false)}
      >
        {t("common.cancel")}
      </Button>

      <Button
        type="button"
        size="sm"
        className="catalog-selection-action"
        onClick={applyDetachment}
        disabled={!applicable}
      >
        {t("ui.applyResult")}
      </Button>
    </DialogFooter>
  </DialogContent>
 </Dialog>
  </div>;
}

function BaneEditor({
  character,
  updateSheet,
  clanBaneName,
  clanBaneSummary,
  vastDynasty,
  clanBaneActive,
  bloodlineBane,
}: {
  character: CharacterSheet;
  updateSheet: (sheet: CharacterSheet) => void;
  clanBaneName: string;
  clanBaneSummary: string;
  vastDynasty: boolean;
  clanBaneActive: boolean;
  bloodlineBane?: { name: string; summary: string };
}) {
  const { t } = useLanguage();

  const rows = Array.from(
    { length: 3 },
    (_, index) => objectArray(character.line_data.banes)[index] ?? {},
  );

  const update = (index: number, patch: Record<string, unknown>) => {
    const nextRows = rows.map((row, rowIndex) =>
      rowIndex === index
        ? {
            ...row,
            ...patch,
            id: String(row.id ?? createRandomId()),
          }
        : row,
    );

    const next = structuredClone(character);

    next.line_data = {
      ...next.line_data,
      banes: nextRows.filter(
        (row) =>
          String(row.required_by ?? "") === "mekhet" ||
          String(row.name ?? "").trim() ||
          String(row.breaking_point_id ?? "").trim(),
      ),
    };

    updateSheet(next);
  };

  const selectedIds = new Set(
    rows
      .map((row) => String(row.breaking_point_id ?? ""))
      .filter(Boolean),
  );

  return (
    <>
      <SheetHeading>{t("ui.banes")}</SheetHeading>

      <div className="vampire-bane-lines">
        {rows.map((bane, index) => {
          const name = String(bane.name ?? "");
          const breakingPointId = String(bane.breaking_point_id ?? "");
          const requiredByMekhet = String(bane.required_by ?? "") === "mekhet";
          const missingLink = !requiredByMekhet && Boolean(name.trim()) && !breakingPointId;
          const missingRequired = requiredByMekhet && !name.trim();

          return (
            <div
              className={`vampire-bane-row${
                missingLink || missingRequired ? " missing-field" : ""
              }`}
              key={String(bane.id ?? index)}
            >
              <Input
                value={name}
                placeholder={requiredByMekhet ? t("ui.mekhetBaneRequired") : `${t("ui.bane")} ${index + 1}`}
                onChange={(event) =>
                  update(index, { name: event.target.value })
                }
              />

              {!requiredByMekhet && <Popover>
                <PopoverTrigger asChild>
                  <Button type="button" size="icon-xs" variant="ghost" className="vampire-bane-reference" aria-label={t("ui.linkBreakingPoint")} title={DETACHMENT_BREAKING_POINT_OPTIONS.find((point) => point.id === breakingPointId)?.label ?? t("ui.linkBreakingPoint")}>
                    <Link2 />
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="end" className="vampire-bane-reference-menu">
                  <Button type="button" size="xs" variant="ghost" onClick={() => update(index, { breaking_point_id: "", breaking_point_level: 0 })}>{t("ui.linkBreakingPoint")}</Button>
                  {[...DETACHMENT_BREAKING_POINT_OPTIONS, ...(vastDynasty ? [VAST_DYNASTY_EMBRACE_BREAKING_POINT] : [])]
                    .filter((point) => !selectedIds.has(point.id) || point.id === breakingPointId)
                    .map((point) => <Button type="button" size="xs" variant={point.id === breakingPointId ? "secondary" : "ghost"} key={point.id} onClick={() => update(index, { breaking_point_id: point.id, breaking_point_level: point.level })}>
                      <span>{point.label}</span><small>{t("ui.humanity")} {point.level}</small>
                    </Button>)}
                </PopoverContent>
              </Popover>}
              {requiredByMekhet && <span className="vampire-bane-required" title={t("ui.mekhetBaneRequired")}>!</span>}
            </div>
          );
        })}
      </div>

      <SheetHeading>{t("ui.clanBane")}</SheetHeading>

      <article className={`vampire-lore-card vampire-clan-bane${clanBaneActive ? " active" : " inactive"}`}>
        <header><strong>{clanBaneName || t("ui.clanBane")}</strong><label><span>{clanBaneActive ? t("ui.active") : t("ui.inactive")}</span><Switch size="sm" checked={clanBaneActive} onCheckedChange={(checked) => { const next = structuredClone(character); next.line_data = { ...next.line_data, clan_bane_active: checked }; updateSheet(next); }} /></label></header>
        <p>{clanBaneSummary}</p>
      </article>
      {bloodlineBane && <><SheetHeading>{t("ui.bloodlineBane")}</SheetHeading><article className="vampire-lore-card vampire-clan-bane active"><header><strong>{bloodlineBane.name}</strong><span>{t("ui.active")}</span></header><p>{bloodlineBane.summary}</p></article></>}
    </>
  );
}

export function VampireCharacterPaper({ character, updateState, updateSheet, catalogs }: GameLineSheetProps) {
  if (!catalogs) throw new Error("Vampire sheet requires its catalog snapshot.");
  const { locale, t } = useLanguage();
  const preferences = useHomebrewPreferences();
  const isMobile = useIsMobile();
  const reference = catalogs.get<VampireReference>("vampire-reference");
  const customBloodlines = useBloodlineHomebrews();
  const bloodlines = [...reference.bloodlines, ...customBloodlines.filter((item) => !reference.bloodlines.some((official) => official.id === item.id))];
  const powers = catalogs.get<VampirePowers>("vampire-powers");
  const customMerits = useMeritHomebrews("VtR", true);
  const merits = mergeMeritHomebrews([...catalogs.get<readonly MeritDefinition[]>("core-merits"), ...catalogs.get<readonly MeritDefinition[]>("vampire-merits")], customMerits);
  const coreConditions = catalogs.get<{ conditions: ConditionDefinition[] }>("core-reference").conditions;
  const vampireConditions = catalogs.get<readonly VampireCondition[]>("vampire-conditions").filter((item) => vampireHomebrewContentActive(preferences, item)) as readonly ConditionDefinition[];
  const conditionCatalog = [...coreConditions, ...vampireConditions];
  const data = character.line_data;
  const bloodSorcery = data.blood_sorcery && typeof data.blood_sorcery === "object" && !Array.isArray(data.blood_sorcery)
    ? data.blood_sorcery as Record<string, unknown>
    : {};
  const clan = reference.clans.find((item) => item.id === data.clan_id);
  const bloodline = bloodlines.find((item) => item.id === data.bloodline_id);
  const covenants = reference.covenants.filter((item) => vampireCovenantIds(data).includes(item.id));
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
  const clanBaneActive = data.clan_bane_active !== false;
  const conditions = selectedConditions(character.current_state.conditions);
  const conditionIds = new Set(conditions.map((item) => item.id));
  const ordo = data.ordo_dracul && typeof data.ordo_dracul === "object" && !Array.isArray(data.ordo_dracul) ? data.ordo_dracul as Record<string, unknown> : {};
  const coilRatings = ordo.coil_ratings && typeof ordo.coil_ratings === "object" && !Array.isArray(ordo.coil_ratings) ? ordo.coil_ratings as Record<string, number> : {};
  const coilEffects = vampireOwnedCoilRuleEffects(powers, coilRatings);
  const hasRuleEffect = (rule: Parameters<typeof vampireRuleEffectsFor>[1], value?: string) => vampireRuleEffectsFor(coilEffects, rule).some((effect) => value === undefined || effect.value === value);
  const ruleSourceRating = (rule: Parameters<typeof vampireRuleEffectsFor>[1]) => Math.max(0, ...vampireRuleEffectsFor(coilEffects, rule).map((effect) => Number(coilRatings[effect.sourceId] ?? 0)));
  const baneHumanity = clan?.id === "mekhet" && clanBaneActive ? Math.max(0, humanity - 1) : humanity;
  const sunlightSummary = vampireSunlightSummary(baneHumanity, bloodPotency, locale);
  const blushDurationRule = String(vampireRuleEffectsFor(coilEffects, "blush-duration")[0]?.value ?? "");
  const blushDuration = blushDurationRule === "24 hours" ? (t("ui.twentyFourHours")) : (t("ui.scene"));
  const frenzyActive = Boolean(character.current_state.frenzy_active);
  const hungerModifier = vitae <= 2 ? -4 : vitae <= 4 ? -2 : 0;
  const woundModifier = damage.length >= Math.max(1, health - 2) ? -3 : damage.length > 0 ? -1 : 0;
  const satedModifier = conditionIds.has("sated") ? 1 : 0;
  const frenzyBasePool = Number(character.attributes.Resolve ?? 1) + Number(character.attributes.Composure ?? 1);
  const frenzyAutomaticModifier = hungerModifier + woundModifier + satedModifier;
  const frenzyResistanceUncapped = frenzyBasePool + frenzyAutomaticModifier;
  const frenzyResistancePool = clan?.id === "gangrel" && clanBaneActive ? Math.min(humanity, frenzyResistanceUncapped) : frenzyResistanceUncapped;
  const rideWaveBonus = ruleSourceRating("ride-the-wave-pool");
  const rideWavePool = frenzyBasePool + frenzyAutomaticModifier + rideWaveBonus;
  const rideWaveWillpowerCost = conditionIds.has("raptured") || hasRuleEffect("ride-the-wave-cost") ? 0 : 1;
  const rideWaveTarget = conditionIds.has("raptured") ? 3 : 5;
  const frenzySenseBloodPotency = frenzyActive ? bloodPotency + ruleSourceRating("kindred-senses-blood-potency") : bloodPotency;
  const predatoryAuraBloodPotency = frenzyActive ? bloodPotency + ruleSourceRating("predatory-aura-blood-potency") : bloodPotency;
  const ignoresDaysleepWithBlush = hasRuleEffect("daysleep");
  const ignoresLethargicWithBlush = hasRuleEffect("lethargic");
  const beastPowerAvailable = hasRuleEffect("frenzy-defense") && hasRuleEffect("frenzy-health") && hasRuleEffect("frenzy-speed");
  const eternalFrenzy = hasRuleEffect("torpor-on-lethal");
  const vitaeAddictionMultiplier = Number(vampireRuleEffectsFor(coilEffects, "vitae-addiction")[0]?.value ?? 0);
  const bloodSympathyFromBonds = hasRuleEffect("blood-sympathy");
  const acceleratedBloodBond = hasRuleEffect("blood-bond");
  const voivodeResistance = hasRuleEffect("discipline-resistance");
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
  const [desktopTab, setDesktopTab] = useState("main");
  const [bloodlineJoinOpen, setBloodlineJoinOpen] = useState(false);
  const tab = mobileTab.characterId === character.id ? mobileTab.value : "summary";
  const hasBloodline = Boolean(data.bloodline_id);
  const showBloodlineTab = () => isMobile ? setMobileTab({ characterId: character.id, value: "bloodlines" }) : setDesktopTab("bloodlines");
  const openBloodline = () => hasBloodline ? showBloodlineTab() : setBloodlineJoinOpen(true);
  const closeBloodline = () => isMobile ? setMobileTab({ characterId: character.id, value: "summary" }) : setDesktopTab("main");
  const openCompanions = () => isMobile ? setMobileTab({ characterId: character.id, value: "companions" }) : setDesktopTab("companions");
  const setState = (key: string, value: unknown) => updateState({ ...character.current_state, [key]: value });
  const identity = <section className="sheet-identity-grid">
    <SheetField label={t("ui.name")} value={character.character.name} />
    <SheetField label={t("sheet.mask")} value={localized(mask, locale)} tooltip={mask?.singleWillpower} />
    <SheetField label={t("sheet.clan")} value={localized(clan, locale)} />
    <SheetField label={t("ui.player")} value={character.character.player} />
    <SheetField label={t("sheet.dirge")} value={localized(dirge, locale)} tooltip={dirge?.allWillpower} />
    <SheetField label={t("sheet.covenant")} value={covenants.map((item) => localized(item, locale)).join(" · ")} />
    <SheetField label={t("ui.chronicle")} value={character.character.chronicle} />
    <SheetField label={t("ui.concept")} value={character.character.concept} />
    <BloodlineSheetField value={bloodline?.name ?? (hasBloodline ? String(data.bloodline_id) : t("ui.join"))} onOpen={openBloodline} />
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
  const humanitySection = <HumanityTrack character={character} updateSheet={updateSheet} value={humanity} vastDynasty={hasRuleEffect("embrace-humanity")} clanBaneActive={clanBaneActive} bloodlineId={bloodline?.id} />;
  const banesSection = <BaneEditor character={character} updateSheet={updateSheet} clanBaneName={clan?.baneName ?? t("ui.clanBane")} clanBaneSummary={clan?.baneSummary ?? ""} vastDynasty={hasRuleEffect("embrace-humanity")} clanBaneActive={clanBaneActive} bloodlineBane={bloodline ? { name: bloodline.baneName, summary: bloodline.baneSummary } : undefined} />;
  const expandedMerits = character.merits.filter((item) => (!item.grantedBy || ["Vampire Template", "Vampire Shadow Cult"].includes(item.grantedBy)) && (Boolean(VAMPIRE_MERIT_CONFIGURATIONS.find((definition) => definition.name === item.name)) || Boolean(merits.find((definition) => definition.name === item.name)?.levels?.length) || item.name === "Mystery Cult Initiation"));
  const summary = <>
    {identity}
    <SheetHeading>{t("ui.aspirations")}</SheetHeading>
    <EditableList values={aspirations} minimum={3} maximum={3} placeholder={t("ui.writeAnAspiration")} onChange={(value) => updateLineData(updateSheet, character, "aspirations", value)} />
    <SheetHeading>{t("ui.experience")}</SheetHeading>
    <VampireExperiencePanel character={character} updateSheet={updateSheet} catalogs={catalogs} />
  </>;
  const powersPage = <>
    {isMobile && <PowerResource name={t("ui.bloodPotency")} rating={bloodPotency} resourceName="Vitae" current={vitae} maximum={vitaeMaximum} perTurn={limits.vitaePerTurn} onChange={(value) => setState("vitae_current", value)} />}
    <SheetHeading>{t("ui.disciplines")}</SheetHeading>
    <DisciplineCards powers={powers} disciplines={disciplines} coilRatings={coilRatings} locale={locale} onRaiseFamiliar={openCompanions} />
    {Number(disciplines.Protean ?? 0) >= 2 && <ProteanChoicesEditor character={character} updateSheet={updateSheet} rating={Number(disciplines.Protean ?? 0)} />}
    <RitualDisciplines powers={powers} bloodSorcery={bloodSorcery} locale={locale} />
    <PurchasedPowers character={character} powers={powers} locale={locale} />
    <TricksOfTheDamned
      character={character}
      locale={locale}
      bloodPotency={bloodPotency}
      effectiveSenseBloodPotency={frenzySenseBloodPotency}
      effectiveAuraBloodPotency={predatoryAuraBloodPotency}
      feedingTier={feedingTierLabel[limits.feedingTier]}
      vitaeMaximum={vitaeMaximum}
      vitaePerTurn={limits.vitaePerTurn}
      blushDuration={blushDuration}
      canReduceSunlightInterval={hasRuleEffect("sunlight-interval-blood-potency")}
      ignoresDaysleepWithBlush={ignoresDaysleepWithBlush}
      ignoresLethargicWithBlush={ignoresLethargicWithBlush}
      fireDowngraded={hasRuleEffect("fire-damage")}
      resilience={Number(disciplines.Resilience ?? 0)}
    />
  </>;
  const detailsPage = <>
    {clan?.id === "hollow-mekhet" && <HollowKaCard data={data.hollow_ka} />}
    <SheetHeading>{t("ui.expandedMerits")}</SheetHeading>
    <VampireExpandedMeritList character={character} updateSheet={updateSheet} merits={expandedMerits} catalog={merits} locale={locale} />
    {isMobile && <>{humanitySection}{banesSection}<SheetHeading>{t("ui.conditions")}</SheetHeading><ConditionManager selected={conditions} catalog={conditionCatalog} onChange={(value) => setState("conditions", value)} /></>}
    {!isMobile && powersPage}
  </>;
  const combat = <>
    <div className="vampire-track-grid">
      <section><SheetHeading>{t("ui.health")}</SheetHeading><HealthTrack health={combatHealth} damage={combatDamage} onChange={(value) => setState("health_damage", value)} /></section>
      <section><SheetHeading>{t("ui.willpower")}</SheetHeading><ResourceTrack label={t("ui.willpower")} current={currentWillpower} maximum={willpower} onChange={(value) => setState("willpower_current", value)} /></section>
    </div>
    <CombatPage character={character} derived={combatDerived} updateSheet={updateSheet} />
    <FrenzyPanel
      setState={setState}
      locale={locale}
      bloodPotency={bloodPotency}
      frenzyActive={frenzyActive}
      frenzyResistancePool={frenzyResistancePool}
      frenzyBasePool={frenzyBasePool}
      frenzyAutomaticModifier={frenzyAutomaticModifier}
      rideWavePool={rideWavePool}
      rideWaveBonus={rideWaveBonus}
      rideWaveWillpowerCost={rideWaveWillpowerCost}
      rideWaveTarget={rideWaveTarget}
      ignoresFireFrenzy={hasRuleEffect("frenzy-trigger", "fire")}
      ignoresSunlightFrenzy={hasRuleEffect("frenzy-trigger", "sunlight")}
      beastPowerAvailable={beastPowerAvailable}
      beastPowerActive={beastPowerActive}
      combatDerived={combatDerived}
      eternalFrenzy={eternalFrenzy}
      lethalTrackFilled={combatDamage.length >= combatHealth && !combatDamage.includes("aggravated")}
    />
  </>;
  const companionsPage = Number(disciplines.Animalism ?? 0) >= 2
    ? <VampireCompanionPage character={character} updateSheet={updateSheet} bloodPotency={bloodPotency} />
    : null;
  const notesPage = <>
    <SheetHeading>{t("ui.bloodBonds")}</SheetHeading>
    <StructuredRecords
      values={objectArray(character.current_state.blood_bonds)}
      levelLabel={t("ui.stage")}
      onChange={(value) => setState("blood_bonds", value)}
      rowDetail={bloodSympathyFromBonds ? (record) => {
        const stage = Math.max(1, Math.min(3, Number(record.stage ?? 1)));
        const sympathy = t(stage === 1 ? "ui.bloodSympathyStage1" : stage === 2 ? "ui.bloodSympathyStage2" : "ui.bloodSympathyStage3");
        return `${t("ui.bloodSympathy")}: ${sympathy}${voivodeResistance ? ` · ${t("ui.voivodeResistanceSuffix")}` : ""}`;
      } : undefined}
    />
    {(vitaeAddictionMultiplier || acceleratedBloodBond || voivodeResistance) && <div className="vampire-coil-automations">
      {vitaeAddictionMultiplier > 0 && <p><strong>{t("ui.tasteOfFealty")}:</strong> {t("ui.tasteOfFealtyAutomation", { count: vitaeAddictionMultiplier })}</p>}
      {acceleratedBloodBond && <p><strong>{t("ui.callToServe")}:</strong> {t("ui.callToServeAutomation")}</p>}
      {voivodeResistance && <p><strong>{t("ui.voivodeUndisputed")}:</strong> {t("ui.voivodeUndisputedAutomation")}</p>}
    </div>}
    <SheetHeading>{t("ui.notes")}</SheetHeading>
    <NotesArea value={notes} onChange={(value) => setState("notes", value)} />
  </>;
  const bloodlinesPage = <BloodlinePage character={character} updateSheet={updateSheet} bloodlines={bloodlines} powers={powers} onRemoved={closeBloodline} />;
  const bloodlineJoinDialog = <BloodlineJoinDialog open={bloodlineJoinOpen} onOpenChange={setBloodlineJoinOpen} onJoined={showBloodlineTab} character={character} updateSheet={updateSheet} reference={reference} powers={powers} />;
  const mainBody = <MainSheet
    className="vampire-main-body"
    identity={identity}
    attributes={attributes}
    skills={skills}
    conditionsAfterSkills
    aspirationsAfterExperience
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
        {(powers.ritualDisciplines ?? []).filter((item) => Number(bloodSorcery[ritualFields[item.id][0]] ?? 0) > 0).map((item) => (
          <VampireDisciplineLine key={item.id} name={localized(item, locale)} value={Number(bloodSorcery[ritualFields[item.id][0]] ?? 0)} />
        ))}
        {ownedVampireCoils(powers, coilRatings).map((item) => (
          <VampireDisciplineLine key={item.id} name={localized(item, locale)} value={Number(coilRatings[item.id] ?? 0)} />
        ))}
      </div>
    }
    merits={<MeritList character={character} catalog={merits} locale={locale} />}
    lineSections={
      <>
        {humanitySection}
        {banesSection}
      </>
    }
    aspirations={
      <EditableList
        values={aspirations}
        minimum={3}
        maximum={3}
        placeholder={t("ui.writeAnAspiration")}
        onChange={(value) => updateLineData(updateSheet, character, "aspirations", value)}
      />
    }
    conditions={
      <ConditionManager
        selected={conditions}
        catalog={conditionCatalog}
        onChange={(value) => setState("conditions", value)}
      />
    }
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
    fuel={<MainFuel label={t("ui.vitae")} current={vitae} maximum={vitaeMaximum} onChange={(value) => setState("vitae_current", value)} />}
    stability={null}
    derived={derived}
    armorId={data.combat_armor}
    experience={<VampireExperiencePanel character={character} updateSheet={updateSheet} catalogs={catalogs} />}
  />;

  if (isMobile) return <><CharacterPaperShell line="VtR" mobile title={t("ui.vampireTitle")} subtitle="THE REQUIEM"><VampireDecorativeFrame /><SwipeableSheetTabs value={tab} onValueChange={(value) => setMobileTab({ characterId: character.id, value })} tabs={[
    { value: "summary", label: t("ui.summary") },
    { value: "stats", label: "Stats" },
    { value: "details", label: t("ui.details") },
    { value: "powers", label: t("ui.powers") },
    { value: "bloodlines", label: t("ui.bloodlines"), hidden: !hasBloodline },
    { value: "combat", label: t("ui.combat") },
    ...(companionsPage ? [{ value: "companions", label: t("ui.companions") }] : []),
    { value: "notes", label: t("ui.notes") },
  ]}>{{ summary, stats, details: detailsPage, powers: powersPage, bloodlines: bloodlinesPage, combat, ...(companionsPage ? { companions: companionsPage } : {}), notes: notesPage }}</SwipeableSheetTabs></CharacterPaperShell>{bloodlineJoinDialog}</>;

  return <><CharacterPaperShell line="VtR" title={t("ui.vampireTitle")} subtitle="THE REQUIEM"><VampireDecorativeFrame /><Tabs value={desktopTab} onValueChange={setDesktopTab} className="vampire-sheet-tabs"><TabsList aria-label={t("ui.characterPages")}>
    <TabsTrigger value="main">{t("ui.main")}</TabsTrigger>
    <TabsTrigger value="details">{t("ui.details")}</TabsTrigger>
    {hasBloodline && <TabsTrigger value="bloodlines">{t("ui.bloodlines")}</TabsTrigger>}
    <TabsTrigger value="combat">{t("ui.combat")}</TabsTrigger>
    {companionsPage && <TabsTrigger value="companions">{t("ui.companions")}</TabsTrigger>}
    <TabsTrigger value="notes">{t("ui.notes")}</TabsTrigger>
  </TabsList>
    <TabsContent value="main" className="vampire-sheet-page">{mainBody}</TabsContent>
    <TabsContent value="details" className="vampire-sheet-page">{detailsPage}</TabsContent>
    {hasBloodline && <TabsContent value="bloodlines" className="vampire-sheet-page">{bloodlinesPage}</TabsContent>}
    <TabsContent value="combat" className="vampire-sheet-page">{combat}</TabsContent>
    {companionsPage && <TabsContent value="companions" className="vampire-sheet-page">{companionsPage}</TabsContent>}
    <TabsContent value="notes" className="vampire-sheet-page">{notesPage}</TabsContent>
  </Tabs></CharacterPaperShell>{bloodlineJoinDialog}</>;

}

function BloodlineSheetField({ value, onOpen }: { value: string; onOpen: () => void }) {
  const { t } = useLanguage();
  return <div className="official-field legacy-sheet-field enabled"><span>{t("sheet.bloodline")}</span><button type="button" onClick={onOpen}>{value}</button></div>;
}

function VampireDisciplineLine({ name, value }: { name: string; value: number }) {
  return <div className="official-trait-line"><span className="official-trait-label"><span className="official-trait-name">{name}</span></span><DotValue value={value} /></div>;
}


function DisciplineCards({ powers, disciplines, coilRatings, locale, onRaiseFamiliar }: { powers: VampirePowers; disciplines: Record<string, number>; coilRatings: Record<string, number>; locale: string; onRaiseFamiliar: () => void }) {
  const { t } = useLanguage();
  const selected = [
    ...powers.disciplines.filter((item) => Number(disciplines[item.name] ?? 0) > 0).map((item) => ({ item, rating: Number(disciplines[item.name] ?? 0) })),
    ...ownedVampireCoils(powers, coilRatings).map((item) => ({ item, rating: Number(coilRatings[item.id] ?? 0) })),
  ];
  return <div className="vampire-power-grid">
    {selected.map(({ item, rating }) => {
      return <details className="contract-power-card vampire-discipline-card" key={item.id}>
        <summary className="contract-power-summary">
          <strong>{localized(item, locale)}</strong>
          <DotValue value={rating} />
          <small>{item.summary}</small>
        </summary>
        <div className={`contract-power-details${item.levels?.length ? " has-levels" : ""}`}>
          <PowerMechanics mechanics={item} />
          {(item.levels ?? []).filter((level) => level.rating <= rating).map((level) => <details className="contract-power-card vampire-discipline-level" key={level.rating}>
            <summary className="contract-power-summary">
              <strong>{"•".repeat(level.rating)} {localized(level, locale)}</strong>
              <small>{level.summary}</small>
            </summary>
            <div className="contract-power-details"><PowerMechanics mechanics={level} compact />{item.id === "animalism" && level.rating === 2 && <Button type="button" size="sm" variant="outline" onClick={onRaiseFamiliar}>{t("ui.use")}</Button>}</div>
          </details>)}
        </div>
      </details>;
    })}
  </div>;
}

function PowerMechanics({ mechanics, compact = false }: { mechanics: VampireMechanics; compact?: boolean }) {
  const { t } = useLanguage();
  const rows: Array<[string, string | number | undefined]> = [
    [t("ui.cost"), mechanics.cost],
    [t("ui.requirement"), mechanics.requirement],
    [t("ui.condition"), mechanics.condition],
    [t("ui.dicePool"), mechanics.dicePool],
    [t("ui.action"), mechanics.action],
    [t("ui.duration"), mechanics.duration],
    [t("ui.targetSuccesses"), mechanics.targetSuccesses],
    [t("ui.contestedBy"), mechanics.contestedBy],
    [t("ui.resistedBy"), mechanics.resistedBy],
    [t("ui.sacrament"), mechanics.sacrament],
  ];
  const visibleRows = rows.filter(([, value]) => value !== undefined && value !== "");
  const results = mechanics.rollResults;
  if (!visibleRows.length && !mechanics.effect && !mechanics.procedure && !mechanics.outcome && !results) return null;
  return <div className={`vampire-power-mechanics${compact ? " compact" : ""}`}>
    {visibleRows.map(([label, value]) => <p key={label}><strong>{label}:</strong> {String(value)}</p>)}
    {mechanics.effect && <p><strong>{t("ui.effect")}:</strong> {mechanics.effect}</p>}
    {mechanics.procedure && <p><strong>{t("ui.procedure")}:</strong> {mechanics.procedure}</p>}
    {mechanics.outcome && <p><strong>{t("ui.outcome")}:</strong> {mechanics.outcome}</p>}
    {results && <div className="vampire-roll-results">
      {results.dramaticFailure && <p><strong>{t("ui.dramaticFailure")}:</strong> {results.dramaticFailure}</p>}
      {results.failure && <p><strong>{t("ui.failure")}:</strong> {results.failure}</p>}
      {results.success && <p><strong>{t("ui.success")}:</strong> {results.success}</p>}
      {results.exceptionalSuccess && <p><strong>{t("ui.exceptionalSuccess")}:</strong> {results.exceptionalSuccess}</p>}
    </div>}
    {mechanics.suggestedModifiers?.length ? <div className="vampire-suggested-modifiers">
      <strong>{t("ui.suggestedModifiers")}</strong>
      {mechanics.suggestedModifiers.map((item, index) => <p key={`${item.modifier}-${index}`}><b>{item.modifier}</b> {item.situation}</p>)}
    </div> : null}
  </div>;
}

function RitualDisciplines({ powers, bloodSorcery, locale }: { powers: VampirePowers; bloodSorcery: Record<string, unknown>; locale: string }) {
  const { t } = useLanguage();
  const selected = (powers.ritualDisciplines ?? []).filter((item) => Number(bloodSorcery[ritualFields[item.id][0]] ?? 0) > 0);
  if (!selected.length) return null;
  return <><SheetHeading>{t("ui.bloodSorceryDisciplines")}</SheetHeading>
    <div className="vampire-power-grid">
      {selected.map((item: VampireRitualDisciplineDefinition) => {
        const [ratingKey, idsKey] = ritualFields[item.id];
        const rating = Number(bloodSorcery[ratingKey] ?? 0);
        const rituals = ownedVampireRituals(powers, item.id, bloodSorcery[idsKey]);
        return <details className="contract-power-card vampire-discipline-card" key={item.id}>
          <summary className="contract-power-summary"><strong>{localized(item, locale)}</strong><DotValue value={rating} /><small>{item.summary}</small></summary>
          <div className="contract-power-details has-levels">
            <PowerMechanics mechanics={item} />
            <small>{t("ui.bloodSorceryFreeRitual")}</small>
            {rituals.map((ritual) => <details className="contract-power-card vampire-discipline-level" key={ritual.id}>
              <summary className="contract-power-summary"><strong>{"•".repeat(Number(ritual.rating ?? 0))} {localized(ritual, locale)}</strong><small>{ritual.summary}</small></summary>
              <div className="contract-power-details"><PowerMechanics mechanics={ritual} compact /></div>
            </details>)}
          </div>
        </details>;
      })}
    </div>
  </>;
}

function VampireExpandedMeritList({ character, updateSheet, merits, catalog, locale }: { character: CharacterSheet; updateSheet: (sheet: CharacterSheet) => void; merits: CharacterSheet["merits"]; catalog: readonly MeritDefinition[]; locale: Locale }) {
  const { t } = useLanguage();
  if (!merits.length) return <p className="rule-callout expanded-merit-empty">{t("ui.noExpandedMeritsPurchased")}</p>;
  return <div className="expanded-merit-list">{merits.map((merit, index) => {
    const definition = catalog.find((item) => item.name === merit.name);
    const configDefinition = VAMPIRE_MERIT_CONFIGURATIONS.find((item) => item.name === merit.name);
    const displayName = localized(definition, locale) || merit.name;
    const detail = meritConfigurationTitle(merit.configuration);
    const configured = configuredDefinitionLines(configDefinition, merit.dots, merit.configuration).length
      ? configuredDefinitionLines(configDefinition, merit.dots, merit.configuration)
      : commonExpandedConfigurationLines(merit.name, merit.dots, merit.configuration, locale) ?? [];
    const meritIndex = character.merits.indexOf(merit);
    const editor = configDefinition && !["Vampire Template", "Vampire Shadow Cult"].includes(String(merit.grantedBy ?? ""))
      ? <MeritConfigurationEditor compact merit={merit} ownedMerits={character.merits} catalog={[...catalog]} definitions={VAMPIRE_MERIT_CONFIGURATIONS} onChange={(configuration) => {
          const next = structuredClone(character);
          next.merits[meritIndex].configuration = configuration;
          updateSheet(next);
        }} />
      : null;
    return <details className="expanded-merit-card" key={`${merit.instanceId ?? merit.name}-${index}`}>
      <summary><div><h4>{displayName}{detail ? `: ${detail}` : ""}</h4>{definition && <small>{definition.source} · p. {definition.page}</small>}</div><DotValue value={merit.dots} max={Math.max(5, merit.dots)} /></summary>
      <div className="expanded-merit-body">
        {configured.map((line, lineIndex) => <section key={`${merit.name}-${lineIndex}`}><strong>{line.split(":")[0]}</strong><p>{line.slice(line.indexOf(":") + 1).trim()}</p></section>)}
        {!configured.length && definition?.description && <p>{definition.description}</p>}
        {editor}
      </div>
    </details>;
  })}</div>;
}

function MeritList({ character, catalog, locale }: { character: CharacterSheet; catalog: readonly MeritDefinition[]; locale: string }) {
  const { t } = useLanguage();
  const visible = character.merits.filter((item) => !item.grantedBy || ["Vampire Template", "Vampire Shadow Cult"].includes(item.grantedBy));
  if (!visible.length) return <em className="rule-callout merit-empty" >{t("ui.noMeritSelected")}</em>;
  return <div className="sheet-merits single-column">{visible.map((merit, index) => {
    const definition = catalog.find((item) => item.name === merit.name);
    const displayName = localized(definition, locale) || merit.name;
    const configuredName = meritConfigurationTitle(merit.configuration);
    const tooltip = definition ? `${definition.prerequisites ? `${t("ui.prerequisites")}: ${definition.prerequisites}\n` : ""}${definition.description}` : merit.source;
    return <div className="sheet-merit-row" key={`${merit.instanceId ?? merit.name}-${index}`} title={tooltip}>
      <div className="sheet-merit-main">
        <span>{displayName}{configuredName ? `: ${configuredName}` : ""}</span>
        <DotValue value={merit.dots} max={Math.max(5, merit.dots)} />
      </div>
    </div>;
  })}</div>;
}

function HollowKaCard({ data }: { data: unknown }) {
  const { t } = useLanguage();
  if (!data || typeof data !== "object" || Array.isArray(data)) return null;
  const ka = data as Record<string, unknown>;
  const list = (key: string) => stringList(ka[key]).join(" · ");
  return <><SheetHeading>{t("ui.ka")}</SheetHeading><article className="vampire-lore-card"><header><strong>{String(ka.name ?? "Ka")}</strong><span>{String(ka.concept ?? "")}</span></header>{ka.simplified ? <p><strong>{t("ui.simplifiedHollow")}:</strong> {t("ui.simplifiedHollowSheet")}</p> : <><p>{t("ui.kaTraits", { rank: Number(ka.rank ?? 1), power: Number(ka.power ?? 1), finesse: Number(ka.finesse ?? 1), resistance: Number(ka.resistance ?? 1) })}</p><p><strong>{t("ui.bane")}:</strong> {String(ka.bane ?? "")}</p><p><strong>{t("ui.anchors")}:</strong> {list("anchors")}</p><p><strong>{t("ui.influences")}:</strong> {list("influences")}</p><p><strong>{t("ui.manifestations")}:</strong> {list("manifestations")}</p><p><strong>{t("ui.numina")}:</strong> {list("numina")}</p></>}</article></>;
}

function PurchasedPowers({ character, powers, locale }: { character: CharacterSheet; powers: VampirePowers; locale: string }) {
  const { t } = useLanguage();
  const ids = new Set(stringList(character.line_data.devotion_ids));
  const ordo = character.line_data.ordo_dracul && typeof character.line_data.ordo_dracul === "object" && !Array.isArray(character.line_data.ordo_dracul) ? character.line_data.ordo_dracul as Record<string, unknown> : {};
  const scaleIds = new Set(stringList(ordo.scale_ids));
  const detournementIds = new Set(stringList(character.line_data.detournement_ids));
  const selected = [...powers.devotions.filter((item) => ids.has(item.id)), ...powers.scales.filter((item) => scaleIds.has(item.id)), ...powers.detournements.filter((item) => detournementIds.has(item.id))];
  if (!selected.length) return null;
  return <><SheetHeading>{t("sheet.otherPowers")}</SheetHeading><div className="vampire-power-grid">{selected.map((item) => {
    const rating = item.rating;
    return <article key={item.id}>
      <header><strong>{localized(item, locale)}</strong>{Boolean(rating) && <DotValue value={Number(rating)} />}</header>
      <small>{item.kind}{item.prerequisites ? ` · ${item.prerequisites}` : ""}</small>
      <p>{item.summary}</p>
      <PowerMechanics mechanics={item} />
      {item.levels?.filter((level) => level.rating <= Number(rating ?? 0)).map((level) => <div className="vampire-power-level" key={level.rating}>
        <strong>{level.rating}. {localized(level, locale)}</strong>
        <span>{level.summary}</span>
        <PowerMechanics mechanics={level} compact />
      </div>)}
    </article>;
  })}</div></>;
}

function ProteanChoicesEditor({ character, updateSheet, rating }: { character: CharacterSheet; updateSheet: (sheet: CharacterSheet) => void; rating: number }) {
  const { t } = useLanguage();
  const choices = character.line_data.discipline_choices && typeof character.line_data.discipline_choices === "object" && !Array.isArray(character.line_data.discipline_choices) ? character.line_data.discipline_choices as Record<string, unknown> : {};
  const set = (key: string, value: string[]) => { const next = structuredClone(character); next.line_data = { ...next.line_data, discipline_choices: { ...choices, [key]: value } }; updateSheet(next); };
  return <><SheetHeading>{t("ui.proteanChoices")}</SheetHeading><div className="vampire-protean-choices">
    <section><strong>{t("ui.predatoryAspect")}</strong><EditableList values={stringList(choices.protean_aspects)} minimum={3} maximum={3} placeholder={t("ui.animalAdaptation")} onChange={(value) => set("protean_aspects", value)} /></section>
    {rating >= 3 && <section><strong>{t("ui.beastSSkin")}</strong><EditableList values={stringList(choices.protean_forms)} minimum={1} placeholder={t("ui.animalForm")} onChange={(value) => set("protean_forms", value)} /></section>}
    {rating >= 4 && <section><strong>{t("ui.unnaturalAspect")}</strong><EditableList values={stringList(choices.protean_unnatural_aspect)} minimum={3} maximum={3} placeholder={t("ui.monstrousAdaptation")} onChange={(value) => set("protean_unnatural_aspect", value)} /></section>}
  </div></>;
}

function TrickCard({ title, summary, children }: { title: string; summary: string; children: ReactNode }) {
  return <details className="vampire-trick">
    <summary className="vampire-trick-summary">
      <strong>{title}</strong>
      <small>{summary}</small>
    </summary>
    <div className="vampire-trick-details">{children}</div>
  </details>;
}

function TricksOfTheDamned({
  character, locale, bloodPotency, effectiveSenseBloodPotency, effectiveAuraBloodPotency,
  feedingTier, vitaeMaximum, vitaePerTurn, blushDuration, canReduceSunlightInterval,
  ignoresDaysleepWithBlush, ignoresLethargicWithBlush, fireDowngraded, resilience,
}: {
  character: CharacterSheet;
  locale: string;
  bloodPotency: number;
  effectiveSenseBloodPotency: number;
  effectiveAuraBloodPotency: number;
  feedingTier: string;
  vitaeMaximum: number;
  vitaePerTurn: number;
  blushDuration: string;
  canReduceSunlightInterval: boolean;
  ignoresDaysleepWithBlush: boolean;
  ignoresLethargicWithBlush: boolean;
  fireDowngraded: boolean;
  resilience: number;
}) {
  const { t } = useLanguage();
  const pt = locale === "pt-BR";
  const auspex = Math.max(0, Number((character.line_data.disciplines as Record<string, unknown> | undefined)?.Auspex ?? 0));
  const scentMultiplier = Math.max(1, auspex);
  const heartbeatRange = effectiveSenseBloodPotency * 3;
  const bloodScentRange = effectiveSenseBloodPotency * 10 * scentMultiplier;
  const tasteBloodPool = Number(character.attributes.Wits ?? 1) + Number(character.attributes.Composure ?? 1);
  const feedingGrounds = character.merits.filter((merit) => merit.name === "Feeding Grounds").reduce((sum, merit) => sum + Number(merit.dots ?? 0), 0);
  const monstrousPool = Number(character.attributes.Strength ?? 1) + effectiveAuraBloodPotency;
  const seductivePool = Number(character.attributes.Presence ?? 1) + effectiveAuraBloodPotency;
  const competitivePool = Number(character.attributes.Intelligence ?? 1) + effectiveAuraBloodPotency;

  return <>
    <SheetHeading>{t("ui.tricksOfTheDamned")}</SheetHeading>
    <div className="vampire-tricks-list">
      <TrickCard title={t("ui.blushOfLife")} summary={pt ? `1 Vitae · duração ${blushDuration}` : `1 Vitae · duration ${blushDuration}`}>
        <p>{pt ? "Por 1 Vitae, o vampiro simula vida: aquece o corpo, apresenta pulso, fluidos naturais, funções sexuais e pode manter comida e bebida durante a duração." : "For 1 Vitae, the vampire mimics life: body warmth, pulse, natural fluids, sexual function, and the ability to keep food and drink down for the duration."}</p>
        {(ignoresDaysleepWithBlush || ignoresLethargicWithBlush) && <p><strong>{t("ui.surmountingTheDaysleep")}:</strong> {pt ? `${ignoresDaysleepWithBlush ? "com Blush ativo, não é preciso rolar para resistir ao sono diurno" : ""}${ignoresDaysleepWithBlush && ignoresLethargicWithBlush ? "; " : ""}${ignoresLethargicWithBlush ? "permanecer ativo de dia não causa Lethargic" : ""}.` : `${ignoresDaysleepWithBlush ? "with Blush active, no roll is required to resist daysleep" : ""}${ignoresDaysleepWithBlush && ignoresLethargicWithBlush ? "; " : ""}${ignoresLethargicWithBlush ? "remaining active during the day does not inflict Lethargic" : ""}.`}</p>}
        {fireDowngraded && <p><strong>{t("ui.peaceWithTheFlame")}:</strong> {pt ? `com Blush ativo, fogo causa dano letal; Resilience ${resilience} pode converter um ponto de letal em contusão por ponto.` : `with Blush active, fire deals lethal damage; Resilience ${resilience} can downgrade one lethal point to bashing per dot.`}</p>}
        {canReduceSunlightInterval && <p><strong>{t("ui.sunsForgottenKiss")}:</strong> {pt ? "cada Vitae adicional gasto ao ativar Blush reduz em 1 a Blood Potency usada somente para o intervalo de dano solar, até o mínimo de 1." : "each additional Vitae spent when activating Blush reduces Blood Potency by 1 for sunlight-damage interval only, to a minimum of 1."}</p>}
      </TrickCard>

      <TrickCard title={t("ui.kindredSenses")} summary={pt ? `Blood Potency efetiva ${effectiveSenseBloodPotency}` : `Effective Blood Potency ${effectiveSenseBloodPotency}`}>
        <p>{pt ? `Escuridão total impõe apenas −2 em rolagens que exigem visão. Batimentos podem ser ouvidos a ${heartbeatRange} m; sangue pode ser percebido pelo cheiro a aproximadamente ${bloodScentRange} m${auspex > 0 ? ` com Auspex ${auspex}` : ""}.` : `Full darkness imposes only −2 on rolls requiring vision. Heartbeats can be heard at ${heartbeatRange} m; blood can be smelled at roughly ${bloodScentRange} m${auspex > 0 ? ` with Auspex ${auspex}` : ""}.`}</p>
        <p>{pt ? `Quando os sentidos Kindred se aplicam, +${effectiveSenseBloodPotency} dados para detectar pessoas ou detalhes ocultos por traços de sangue. Após provar o sangue de um humano, o mesmo bônus se aplica para rastreá-lo pelo cheiro.` : `When Kindred senses apply, add +${effectiveSenseBloodPotency} dice to detect hidden people or details through traces of blood. After tasting a human's blood, the same bonus applies to tracking that person by scent.`}</p>
      </TrickCard>

      <TrickCard title={t("ui.tasteOfBlood")} summary={`${pt ? "Parada" : "Pool"}: Wits + Composure = ${tasteBloodPool}`}>
        <p>{pt ? "Provar sangue revela informações sobre sua origem e condição. Um sucesso identifica detalhes básicos; sucesso excepcional revela detalhes mais específicos." : "Tasting blood reveals information about its origin and condition. A success identifies basic details; an exceptional success reveals finer details."}</p>
        <p><strong>{pt ? "Modificadores" : "Modifiers"}:</strong>{t("ui.auspex")}{pt ? "ativo" : "active"}{t("ui.auspexBonus")}{pt ? "faminto" : "hungry"} +2; {pt ? "sangue com 1 hora" : "hour-old blood"} −1; {pt ? "1 dia" : "day-old"} −3; {pt ? "1 semana ou mais" : "week or older"} −5.</p>
      </TrickCard>

      <TrickCard title={t("ui.physicalIntensity")} summary={pt ? "1 Vitae · +2 dados por um turno" : "1 Vitae · +2 dice for one turn"}>
        <p>{pt ? "Escolha Strength, Dexterity ou Stamina. Adicione +2 dados às rolagens que usam esse Atributo durante o turno. Isso aumenta resistências relevantes, mas não altera características derivadas." : "Choose Strength, Dexterity, or Stamina. Add +2 dice to rolls using that Attribute for the turn. Relevant resistances improve, but derived traits do not."}</p>
      </TrickCard>

      <TrickCard title={t("ui.healing")} summary={pt ? "Vitae reconstrói o corpo morto" : "Vitae reconstructs the dead body"}>
        <p>{pt ? "1 Vitae cura 2 de contusão ou 1 letal. Um ferimento agravado exige 5 Vitae e um dia completo de sono." : "1 Vitae heals 2 bashing or 1 lethal. One aggravated wound requires 5 Vitae and a full day's sleep."}</p>
      </TrickCard>

      <TrickCard title={t("ui.theCleansing")} summary={pt ? "O daysleep restaura o corpo ao estado do Embrace" : "Daysleep restores the body toward its Embrace state"}>
        <p>{pt ? "Alterações menores que não equivalem a níveis de Health desaparecem durante o sono. Ferimentos que exigem Vitae são curados automaticamente, consumindo Vitae; gastar 1 Willpower por ferimento permite preservá-lo. Marcas como cicatrizes, tatuagens ou piercings também podem ser mantidas dessa forma." : "Changes smaller than Health-level damage disappear during sleep. Wounds that require Vitae heal automatically and spend Vitae; 1 Willpower per wound can preserve it. Scars, tattoos, piercings, and similar changes can be preserved the same way."}</p>
      </TrickCard>

      <TrickCard title={t("ui.predatoryAura")} summary={pt ? `Blood Potency efetiva ${effectiveAuraBloodPotency}` : `Effective Blood Potency ${effectiveAuraBloodPotency}`}>
        <p>{pt ? "Lashing Out é uma ação instantânea. Contra Kindred custa 1 Willpower; contra mortais é gratuito. Disciplines não acrescentam dados a menos que digam explicitamente o contrário." : "Lashing Out is an instant action. Against Kindred it costs 1 Willpower; against mortals it is free. Disciplines do not add dice unless they explicitly say otherwise."}</p>
        <p><strong>{t("ui.bestialTriad")}:</strong>{t("ui.bestialTriadConditions")}</p>
        <p><strong>{pt ? "Lashing Out" : "Lashing Out"}:</strong>{t("ui.monstrousPoolPrefix")}{monstrousPool}{t("ui.seductivePoolPrefix")}{seductivePool}{t("ui.competitivePoolPrefix")}{competitivePool}).</p>
        <p><strong>{pt ? "Modificadores" : "Modifiers"}:</strong> {pt ? "em seu território" : "on your territory"}{t("ui.feedingGroundsPrefix")}{feedingGrounds}); {pt ? "faminto" : "hungry"} +1; {pt ? "starving" : "starving"} +2; {pt ? "alvo já afetado pela aura nesta cena" : "target already affected by the aura this scene"} −1 {pt ? "cumulativo" : "cumulative"}.</p>
        <p>{pt ? "O alvo escolhe Fight ou Flight. Fight contesta com um Power Attribute + Blood Potency; Flight concede uma saída razoável e aplica a Condition associada ao aspecto do agressor." : "The target chooses Fight or Flight. Fight contests with a Power Attribute + Blood Potency; Flight grants a reasonable exit and applies the Condition associated with the aggressor's aspect."}</p>
      </TrickCard>

      <TrickCard title={t("ui.feeding")} summary={`${pt ? "Pode alimentar-se de" : "Can feed from"}: ${feedingTier}`}>
        <p><strong>{t("ui.bloodPotency")}{bloodPotency}:</strong> {pt ? `máximo ${vitaeMaximum} Vitae; até ${vitaePerTurn} Vitae por turno.` : `maximum ${vitaeMaximum} Vitae; up to ${vitaePerTurn} Vitae per turn.`}</p>
        <p>{pt ? "Ao alimentar-se de uma fonte abaixo da restrição da Blood Potency, gaste 1 Willpower para cada Vitae obtido." : "Feeding from a source below the Blood Potency restriction costs 1 Willpower for each Vitae gained."}</p>
        <p>{pt ? "Mordida violenta: presas funcionam como arma 0L com Brawl; após uma mordida em grapple, Feed rouba 1 Vitae por sucesso, limitado pela Blood Potency. Contra mortais, cada Vitae causa 1 letal adicional." : "Violent bite: fangs act as a 0L Brawl weapon; after biting in a grapple, Feed steals 1 Vitae per success, capped by Blood Potency. Against mortals, each Vitae causes 1 additional lethal damage."}</p>
        <p>{pt ? "Mordida sutil: até 1 Vitae por turno; um mortal recebe Swooning e a ferida pode ser fechada sem deixar traço ao ser lambida." : "Subtle bite: up to 1 Vitae per turn; a mortal gains Swooning and the wound can be licked closed without leaving a trace."}</p>
        <p>{pt ? "De humanos vivos, cada Vitae retirado causa 1 letal; retirar mais Vitae que a Stamina da vítima causa Drained. Sangue frio exige 2 × Blood Potency pints por Vitae." : "From living humans, each Vitae taken causes 1 lethal; taking more Vitae than the victim's Stamina inflicts Drained. Cold blood requires 2 × Blood Potency pints per Vitae."}</p>
        <p>{pt ? `Starting Vitae: role 1d10 e some Feeding Grounds (${feedingGrounds}).` : `Starting Vitae: roll 1d10 and add Feeding Grounds (${feedingGrounds}).`}</p>
      </TrickCard>
    </div>
  </>;
}

function FrenzyPanel({
  setState, locale, bloodPotency, frenzyActive, frenzyResistancePool, frenzyBasePool,
  frenzyAutomaticModifier, rideWavePool, rideWaveBonus, rideWaveWillpowerCost, rideWaveTarget,
  ignoresFireFrenzy, ignoresSunlightFrenzy, beastPowerAvailable, beastPowerActive, combatDerived, eternalFrenzy, lethalTrackFilled,
}: {
  setState: (key: string, value: unknown) => void;
  locale: string;
  bloodPotency: number;
  frenzyActive: boolean;
  frenzyResistancePool: number;
  frenzyBasePool: number;
  frenzyAutomaticModifier: number;
  rideWavePool: number;
  rideWaveBonus: number;
  rideWaveWillpowerCost: number;
  rideWaveTarget: number;
  ignoresFireFrenzy: boolean;
  ignoresSunlightFrenzy: boolean;
  beastPowerAvailable: boolean;
  beastPowerActive: boolean;
  combatDerived: Record<string, number>;
  eternalFrenzy: boolean;
  lethalTrackFilled: boolean;
}) {
  const { t } = useLanguage();
  const pt = locale === "pt-BR";
  const resistanceLabel = frenzyResistancePool <= 0 ? (pt ? "Dado de chance" : "Chance die") : `${frenzyResistancePool} ${pt ? "dados" : "dice"}`;
  const rideLabel = rideWavePool <= 0 ? (pt ? "Dado de chance" : "Chance die") : `${rideWavePool} ${pt ? "dados" : "dice"}`;
  return <>
    <SheetHeading>{t("ui.frenzy")}</SheetHeading>
    <div className="vampire-state-controls">
      <label><span>{t("ui.frenzy")}</span><Switch checked={frenzyActive} onCheckedChange={(checked) => setState("frenzy_active", checked)} /></label>
      {beastPowerAvailable && <label><span>{t("ui.beastsPower")}</span><Switch disabled={!frenzyActive} checked={beastPowerActive} onCheckedChange={(checked) => setState("frenzy_beast_power_active", checked)} /></label>}
      {(ignoresFireFrenzy || ignoresSunlightFrenzy) && <p className="wide"><strong>{t("ui.conquerTheRedFear")}:</strong> {pt ? `não provoca Frenzy por ${[ignoresFireFrenzy && "fogo", ignoresSunlightFrenzy && "luz solar"].filter(Boolean).join(" ou ")}.` : `no Frenzy provocation from ${[ignoresFireFrenzy && "fire", ignoresSunlightFrenzy && "sunlight"].filter(Boolean).join(" or ")}.`}</p>}
      <p className="wide"><strong>{t("ui.resistFrenzy")}:</strong> {resistanceLabel} ({frenzyBasePool} {pt ? "base" : "base"} {frenzyAutomaticModifier >= 0 ? "+" : ""}{frenzyAutomaticModifier} {pt ? "automático" : "automatic"}). {pt ? "Outros modificadores situacionais são aplicados manualmente pelo jogador." : "Other situational modifiers are applied manually by the player."}</p>
      <p className="wide"><strong>{t("ui.ridingTheWave")}:</strong> {rideLabel}; {pt ? "custo" : "cost"} <strong>{rideWaveWillpowerCost}{t("ui.willpowerAbbreviation")}</strong>; {pt ? "alvo" : "target"} <strong>{rideWaveTarget} {pt ? "sucessos" : "successes"}</strong>{rideWaveBonus ? `; ${pt ? "bônus da Coil" : "Coil bonus"} +${rideWaveBonus}` : ""}.</p>
      {frenzyActive && <p className="wide"><strong>{t("ui.activeFrenzy")}:</strong> +{bloodPotency} {pt ? "em rolagens/resistências de Strength, Dexterity e Stamina; penalidades de ferimento são ignoradas." : "to Strength, Dexterity, and Stamina rolls/resistances; wound penalties are ignored."}</p>}
      {beastPowerActive && <p className="wide"><strong>{t("ui.beastsPower")}:</strong>{t("ui.defense")}{combatDerived.Defesa}, {t("ui.health")} {combatDerived.Vitalidade}, {t("ui.speed")} {combatDerived.Deslocamento}.</p>}
      {eternalFrenzy && <p className="wide"><strong>{t("ui.eternalFrenzy")}:</strong> {t(frenzyActive ? lethalTrackFilled ? "ui.eternalFrenzyFilled" : "ui.eternalFrenzyReady" : "ui.eternalFrenzyInactive")}</p>}
      <p className="wide"><strong>{t("ui.touchstone")}:</strong> {pt ? `requer ${bloodPotency * 3} sucessos em uma ação Social prolongada para encerrar Frenzy.` : `requires ${bloodPotency * 3} successes on an extended Social action to talk the vampire down.`}</p>
    </div>
  </>;
}

function StructuredRecords({ values, onChange, levelLabel, rowDetail }: { values: Record<string, unknown>[]; onChange: (value: EditableRecord[]) => void; levelLabel?: string; rowDetail?: (record: EditableRecord) => string }) {
  const { t } = useLanguage();
  const rows = values.map((item, index): EditableRecord => ({ id: String(item.id ?? `record-${index}`), subject: String(item.subject ?? item.name ?? ""), stage: Number(item.stage ?? item.level ?? 1), notes: String(item.notes ?? "") }));
  const update = (index: number, patch: Partial<EditableRecord>) => onChange(rows.map((item, row) => row === index ? { ...item, ...patch } : item));
  return <div className="vampire-records">{rows.map((item, index) => <div key={item.id}><Input value={item.subject} placeholder={t("ui.nameOrSubject")} onChange={(event) => update(index, { subject: event.target.value })} />{levelLabel && <label>{levelLabel}<Input type="number" min={1} max={3} value={item.stage} onChange={(event) => update(index, { stage: Number(event.target.value) })} /></label>}<Input value={item.notes} placeholder={t("ui.notes8c4aa0")} onChange={(event) => update(index, { notes: event.target.value })} /><Button type="button" size="icon" variant="ghost" onClick={() => onChange(rows.filter((_, row) => row !== index))}><Trash2 /></Button>{rowDetail && <small>{rowDetail(item)}</small>}</div>)}<Button type="button" size="sm" variant="outline" onClick={() => onChange([...rows, { id: createRandomId(), subject: "", stage: 1, notes: "" }])}><Plus /> {t("ui.addRecord")}</Button></div>;
}
