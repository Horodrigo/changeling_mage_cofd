import type { CharacterSheet } from "./core/character/character-types";
import { refundPowerRating } from "./power-progression";
import { removeExperienceMeritDots } from "./merit-progression";

export function subtractDots(value: unknown, amount = 1, minimum = 0) {
  return Math.max(minimum, (Number(value) || 0) - amount);
}

export function refundMeritDots(sheet: CharacterSheet, name: string, amount: number, instanceId?: string, legacyIndex?: number) {
  const index = instanceId
    ? sheet.merits.findIndex(item => item.instanceId === instanceId)
    : legacyIndex !== undefined && sheet.merits[legacyIndex]?.name === name
      ? legacyIndex
      : sheet.merits.findIndex(item => item.name === name && !item.grantedBy);
  if (index < 0) return;
  if (removeExperienceMeritDots(sheet.merits[index], amount) === 0) sheet.merits.splice(index, 1);
}

export type MageAdvancementUndo =
  | { kind: "trait"; group: "attributes" | "skills"; name: string; amount?: number }
  | { kind: "arcana"; name: string; amount?: number; creditedArcane?: number }
  | { kind: "gnosis" | "wisdom" | "wisdomLoss" | "willpower" | "willpowerLoss"; amount?: number }
  | { kind: "merit"; name: string; dots: number; instanceId?: string; index?: number }
  | { kind: "spell"; key: "learned_rotes" | "learned_praxes"; id: string }
  | { kind: "legacyInitiation"; previousState: unknown; removedPraxis?: {key:"praxes"|"learned_praxes";index:number;item:Record<string,unknown>}; creditedRegular:number; creditedArcane:number; creditedArcaneBeats:number }
  | { kind: "legacyAttainment"; rank:number; removedPraxis?: {key:"praxes"|"learned_praxes";index:number;item:Record<string,unknown>}; creditedRegular:number; creditedArcane:number; creditedArcaneBeats:number }
  | { kind: "specialty"; skill: string; name: string };

/** Undo only this purchase's delta, never replace the sheet with an old snapshot. */
export function refundMageAdvancement(sheet: CharacterSheet, undo: MageAdvancementUndo) {
  if (undo.kind === "trait") sheet[undo.group][undo.name] = subtractDots(sheet[undo.group][undo.name], undo.amount ?? 1, undo.group === "attributes" ? 1 : 0);
  else if (undo.kind === "gnosis") for (let dot = 0; dot < (undo.amount ?? 1); dot += 1) sheet.line_data = refundPowerRating(sheet, "gnosis");
  else if (undo.kind === "wisdom") sheet.line_data.wisdom = subtractDots(sheet.line_data.wisdom, undo.amount ?? 1, 1);
  else if (undo.kind === "wisdomLoss") sheet.line_data.wisdom = Math.min(10, (Number(sheet.line_data.wisdom) || 1) + 1);
  else if (undo.kind === "arcana") {
    const arcana = { ...(sheet.line_data.arcana as Record<string, number>) };
    arcana[undo.name] = subtractDots(arcana[undo.name], undo.amount ?? 1);
    sheet.line_data.arcana = arcana;
  } else if (undo.kind === "merit") refundMeritDots(sheet, undo.name, undo.dots, undo.instanceId, undo.index);
  else if (undo.kind === "spell") {
    const spells = sheet.line_data[undo.key];
    if (Array.isArray(spells)) sheet.line_data[undo.key] = spells.filter(item => item.id !== undo.id);
  } else if (undo.kind === "legacyInitiation" || undo.kind === "legacyAttainment") {
    if (undo.kind === "legacyInitiation") sheet.line_data.legacy_state = undo.previousState;
    else {
      const state = sheet.line_data.legacy_state as {attainmentRanks?:number[]} | undefined;
      if (state) state.attainmentRanks = (state.attainmentRanks ?? []).filter(rank => rank !== undo.rank);
    }
    if (undo.removedPraxis) {
      const list = Array.isArray(sheet.line_data[undo.removedPraxis.key]) ? [...sheet.line_data[undo.removedPraxis.key] as Record<string,unknown>[]] : [];
      list.splice(undo.removedPraxis.index, 0, undo.removedPraxis.item);
      sheet.line_data[undo.removedPraxis.key] = list;
    }
  } else if (undo.kind === "specialty") {
    const index = sheet.specializations.findLastIndex(item => item.skill === undo.skill && item.name === undo.name);
    if (index >= 0) sheet.specializations.splice(index, 1);
  } else sheet.current_state.willpower_lost_dots = Math.max(0, Number(sheet.current_state.willpower_lost_dots ?? 0) + (undo.kind === "willpower" ? undo.amount ?? 1 : -1));
}
