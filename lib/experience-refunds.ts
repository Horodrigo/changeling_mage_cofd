import type { CharacterSheet } from "../app/character-builder";
import { refundPowerRating } from "./power-progression";

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
  sheet.merits[index].dots = subtractDots(sheet.merits[index].dots, amount);
  if (sheet.merits[index].dots === 0) sheet.merits.splice(index, 1);
}

export type MageAdvancementUndo =
  | { kind: "trait"; group: "attributes" | "skills"; name: string }
  | { kind: "arcana"; name: string }
  | { kind: "gnosis" | "wisdom" | "willpower" | "willpowerLoss" }
  | { kind: "merit"; name: string; dots: number; instanceId?: string; index?: number }
  | { kind: "spell"; key: "learned_rotes" | "learned_praxes"; id: string }
  | { kind: "specialty"; skill: string; name: string };

/** Undo only this purchase's delta, never replace the sheet with an old snapshot. */
export function refundMageAdvancement(sheet: CharacterSheet, undo: MageAdvancementUndo) {
  if (undo.kind === "trait") sheet[undo.group][undo.name] = subtractDots(sheet[undo.group][undo.name], 1, undo.group === "attributes" ? 1 : 0);
  else if (undo.kind === "gnosis") sheet.line_data = refundPowerRating(sheet, "gnosis");
  else if (undo.kind === "wisdom") sheet.line_data.wisdom = subtractDots(sheet.line_data.wisdom, 1, 1);
  else if (undo.kind === "arcana") {
    const arcana = { ...(sheet.line_data.arcana as Record<string, number>) };
    arcana[undo.name] = subtractDots(arcana[undo.name]);
    sheet.line_data.arcana = arcana;
  } else if (undo.kind === "merit") refundMeritDots(sheet, undo.name, undo.dots, undo.instanceId, undo.index);
  else if (undo.kind === "spell") {
    const spells = sheet.line_data[undo.key];
    if (Array.isArray(spells)) sheet.line_data[undo.key] = spells.filter(item => item.id !== undo.id);
  } else if (undo.kind === "specialty") {
    const index = sheet.specializations.findLastIndex(item => item.skill === undo.skill && item.name === undo.name);
    if (index >= 0) sheet.specializations.splice(index, 1);
  } else sheet.current_state.willpower_lost_dots = Math.max(0, Number(sheet.current_state.willpower_lost_dots ?? 0) + (undo.kind === "willpower" ? 1 : -1));
}
