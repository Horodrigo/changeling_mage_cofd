import type { CharacterSheet } from "@/lib/core/character/character-types";
import { refundMeritDots, subtractDots } from "@/lib/experience-refunds";

export type MortalAdvancementUndo =
  | { kind: "trait"; group: "attributes" | "skills"; name: string; amount: number }
  | { kind: "specialty"; skill: string; name: string }
  | { kind: "merit"; name: string; dots: number; instanceId?: string; index?: number }
  | { kind: "integrity"; amount: number };

/** Undo only the selected purchase, preserving later character changes. */
export function refundMortalAdvancement(sheet: CharacterSheet, undo: MortalAdvancementUndo) {
  if (undo.kind === "trait") {
    sheet[undo.group][undo.name] = subtractDots(sheet[undo.group][undo.name], undo.amount, undo.group === "attributes" ? 1 : 0);
  } else if (undo.kind === "specialty") {
    const index = sheet.specializations.findLastIndex((item) => item.skill === undo.skill && item.name === undo.name);
    if (index >= 0) sheet.specializations.splice(index, 1);
  } else if (undo.kind === "merit") {
    refundMeritDots(sheet, undo.name, undo.dots, undo.instanceId, undo.index);
  } else {
    sheet.line_data.integrity = subtractDots(sheet.line_data.integrity, undo.amount);
  }
}
