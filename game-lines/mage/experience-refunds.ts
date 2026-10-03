import type { CharacterSheet } from "@/lib/core/character/character-types";
import { refundMeritDots, subtractDots } from "@/lib/experience-refunds";
import { refundMagePowerRating } from "./builder-power-progression";

export type MageAdvancementUndo =
  | { kind: "trait"; group: "attributes" | "skills"; name: string; amount?: number }
  | { kind: "arcana"; name: string; amount?: number; creditedArcane?: number }
  | { kind: "gnosis" | "wisdom" | "wisdomLoss" | "willpower" | "willpowerLoss"; amount?: number }
  | { kind: "merit"; definitionId?: string; name: string; dots: number; instanceId?: string; index?: number }
  | { kind: "spell"; key: "learned_rotes" | "learned_praxes"; id: string }
  | { kind: "legacyInitiation"; definitionId?: string; previousState: unknown; removedPraxis?: {key:"praxes"|"learned_praxes";index:number;item:Record<string,unknown>}; creditedRegular:number; creditedArcane:number; creditedArcaneBeats:number }
  | { kind: "legacyAttainment"; definitionId?: string; rank:number; removedPraxis?: {key:"praxes"|"learned_praxes";index:number;item:Record<string,unknown>}; creditedRegular:number; creditedArcane:number; creditedArcaneBeats:number }
  | { kind: "specialty"; skill: string; name: string };

export type MageLegacyUndo = Extract<MageAdvancementUndo, { kind: "legacyInitiation" | "legacyAttainment" }>;

/** Schema-2 bridge for existing Legacy receipts, consumed by history/refund UI and discard.
 * Production: accepts only the explicit selection ID recorded before that purchase,
 * never labels/current selection. Delete when ID-less Legacy receipts are no longer supported.
 * Does not rewrite history, XP, or the saved character.
 */
export function legacyUndoForEntry(entry: { undo?: MageAdvancementUndo; before?: unknown }): MageLegacyUndo | undefined {
  const undo = entry.undo;
  if (undo?.kind !== "legacyInitiation" && undo?.kind !== "legacyAttainment") return undefined;
  if (undo.definitionId !== undefined) return typeof undo.definitionId === "string" && undo.definitionId ? undo : undefined;
  const prior = undo.kind === "legacyInitiation"
    ? undo.previousState
    : (entry.before as { line_data?: { legacy_state?: unknown } } | undefined)?.line_data?.legacy_state;
  if (!prior || typeof prior !== "object") return undefined;
  const state = prior as { definitionId?: unknown; joined?: unknown; attainmentRanks?: unknown };
  if (typeof state.definitionId !== "string" || !state.definitionId || !Array.isArray(state.attainmentRanks)) return undefined;
  if (undo.kind === "legacyInitiation" ? state.joined !== false || state.attainmentRanks.length !== 0
    : state.joined !== true || !Number.isInteger(undo.rank) || undo.rank < 2 || !state.attainmentRanks.includes(undo.rank - 1) || state.attainmentRanks.some(rank => !Number.isInteger(rank) || rank < 1 || rank >= undo.rank)) return undefined;
  return { ...undo, definitionId: state.definitionId };
}

/** Undo only this purchase's delta, never replace the sheet with an old snapshot. */
export function refundMageAdvancement(sheet: CharacterSheet, undo: MageAdvancementUndo) {
  if (undo.kind === "trait") sheet[undo.group][undo.name] = subtractDots(sheet[undo.group][undo.name], undo.amount ?? 1, undo.group === "attributes" ? 1 : 0);
  else if (undo.kind === "gnosis") for (let dot = 0; dot < (undo.amount ?? 1); dot += 1) sheet.line_data = refundMagePowerRating(sheet);
  else if (undo.kind === "wisdom") sheet.line_data.wisdom = subtractDots(sheet.line_data.wisdom, undo.amount ?? 1, 1);
  else if (undo.kind === "wisdomLoss") sheet.line_data.wisdom = Math.min(10, (Number(sheet.line_data.wisdom) || 1) + 1);
  else if (undo.kind === "arcana") {
    const arcana = { ...(sheet.line_data.arcana as Record<string, number>) };
    arcana[undo.name] = subtractDots(arcana[undo.name], undo.amount ?? 1);
    sheet.line_data.arcana = arcana;
  } else if (undo.kind === "merit") return refundMeritDots(sheet, undo.name, undo.dots, undo.instanceId, undo.index, undo.definitionId);
  else if (undo.kind === "spell") {
    const spells = sheet.line_data[undo.key];
    if (Array.isArray(spells)) sheet.line_data[undo.key] = spells.filter(item => item.id !== undo.id);
  } else if (undo.kind === "legacyInitiation" || undo.kind === "legacyAttainment") {
    const state = sheet.line_data.legacy_state as { definitionId?: string; joined?: boolean; attainmentRanks?: number[] } | undefined;
    const rank = undo.kind === "legacyInitiation" ? 1 : undo.rank;
    if (!undo.definitionId || state?.definitionId !== undo.definitionId || state.joined !== true || !Number.isInteger(rank) || rank < 1 || rank > 5 || !Array.isArray(state.attainmentRanks) || !state.attainmentRanks.includes(rank) || state.attainmentRanks.some(value => !Number.isInteger(value) || value < 1 || value > rank)) return false;
    if (undo.kind === "legacyInitiation" && undo.previousState !== undefined) {
      const previous = undo.previousState as { definitionId?: string; joined?: boolean; attainmentRanks?: number[] } | null;
      if (!previous || previous.definitionId !== undo.definitionId || previous.joined !== false || !Array.isArray(previous.attainmentRanks) || previous.attainmentRanks.length) return false;
    }
    const praxis = undo.removedPraxis;
    if (praxis && (!["praxes", "learned_praxes"].includes(praxis.key) || !Number.isInteger(praxis.index) || praxis.index < 0 || !praxis.item || typeof praxis.item.id !== "string" || !praxis.item.id || [sheet.line_data.praxes, sheet.line_data.learned_praxes].some(list => Array.isArray(list) && list.some(item => item.id === praxis.item.id)))) return false;
    if (undo.kind === "legacyInitiation") sheet.line_data.legacy_state = undo.previousState;
    else {
      state.attainmentRanks = state.attainmentRanks.filter(rank => rank !== undo.rank);
    }
    if (undo.removedPraxis) {
      const list = Array.isArray(sheet.line_data[undo.removedPraxis.key]) ? [...sheet.line_data[undo.removedPraxis.key] as Record<string,unknown>[]] : [];
      list.splice(undo.removedPraxis.index, 0, undo.removedPraxis.item);
      sheet.line_data[undo.removedPraxis.key] = list;
    }
  } else if (undo.kind === "specialty") {
    const index = sheet.specializations.findLastIndex(item => item.skill === undo.skill && item.name === undo.name);
    if (index >= 0) sheet.specializations.splice(index, 1);
  } else if (undo.kind === "willpower" || undo.kind === "willpowerLoss") sheet.current_state.willpower_lost_dots = Math.max(0, Number(sheet.current_state.willpower_lost_dots ?? 0) + (undo.kind === "willpower" ? undo.amount ?? 1 : -1));
  else return false;
  return true;
}
