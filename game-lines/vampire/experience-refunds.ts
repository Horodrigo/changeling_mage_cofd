import type { CharacterSheet } from "@/lib/core/character/character-types";
import { refundMeritDots, subtractDots } from "@/lib/experience-refunds";

export type VampireAdvancementUndo =
  | { kind: "trait"; group: "attributes" | "skills"; name: string; amount?: number }
  | { kind: "specialty"; skill: string; name: string }
  | { kind: "merit"; name: string; dots: number; instanceId?: string; index?: number }
  | { kind: "discipline"; name: string; amount?: number }
  | { kind: "bloodPotency" | "humanity" | "humanityLoss" | "willpower"; amount?: number }
  | { kind: "devotion"; id: string }
  | { kind: "cruac"; ids?: string[]; id?: string; humanityLost: number; amount?: number }
  | { kind: "theban"; ids?: string[]; id?: string; amount?: number }
  | { kind: "ritual"; key: "cruac_rite_ids" | "theban_miracle_ids"; id: string }
  | { kind: "coil"; id: string; amount?: number }
  | { kind: "scale"; id: string };

const without = (value: unknown, id: string) =>
  Array.isArray(value) ? value.map(String).filter((item) => item !== id) : [];
const withoutMany = (value: unknown, ids: readonly string[]) =>
  Array.isArray(value) ? value.map(String).filter((item) => !ids.includes(item)) : [];

/** Undo only one purchase delta so later Vampire purchases remain intact. */
export function refundVampireAdvancement(sheet: CharacterSheet, undo: VampireAdvancementUndo) {
  if (undo.kind === "trait") sheet[undo.group][undo.name] = subtractDots(sheet[undo.group][undo.name], undo.amount ?? 1, undo.group === "attributes" ? 1 : 0);
  else if (undo.kind === "specialty") {
    const index = sheet.specializations.findLastIndex((item) => item.skill === undo.skill && item.name === undo.name);
    if (index >= 0) sheet.specializations.splice(index, 1);
  } else if (undo.kind === "merit") refundMeritDots(sheet, undo.name, undo.dots, undo.instanceId, undo.index);
  else if (undo.kind === "discipline") {
    const disciplines = { ...(sheet.line_data.disciplines as Record<string, number> | undefined) };
    disciplines[undo.name] = subtractDots(disciplines[undo.name], undo.amount ?? 1);
    sheet.line_data.disciplines = disciplines;
  } else if (undo.kind === "bloodPotency") sheet.line_data.blood_potency = subtractDots(sheet.line_data.blood_potency, undo.amount ?? 1, 1);
  else if (undo.kind === "humanity") sheet.line_data.humanity = subtractDots(sheet.line_data.humanity, undo.amount ?? 1);
  else if (undo.kind === "humanityLoss") {
    const sorcery = sheet.line_data.blood_sorcery && typeof sheet.line_data.blood_sorcery === "object" && !Array.isArray(sheet.line_data.blood_sorcery) ? sheet.line_data.blood_sorcery as Record<string, unknown> : {};
    sheet.line_data.humanity = Math.min(10 - Number(sorcery.cruac_rating ?? 0), Number(sheet.line_data.humanity ?? 0) + (undo.amount ?? 1));
  }
  else if (undo.kind === "willpower") sheet.current_state.willpower_lost_dots = Math.max(0, Number(sheet.current_state.willpower_lost_dots ?? 0) + (undo.amount ?? 1));
  else if (undo.kind === "devotion") sheet.line_data.devotion_ids = without(sheet.line_data.devotion_ids, undo.id);
  else if (undo.kind === "cruac" || undo.kind === "theban" || undo.kind === "ritual") {
    const sorcery = sheet.line_data.blood_sorcery && typeof sheet.line_data.blood_sorcery === "object" && !Array.isArray(sheet.line_data.blood_sorcery)
      ? { ...sheet.line_data.blood_sorcery as Record<string, unknown> }
      : {};
    if (undo.kind === "cruac") {
      sorcery.cruac_rating = subtractDots(sorcery.cruac_rating, undo.amount ?? 1);
      sorcery.cruac_rite_ids = withoutMany(sorcery.cruac_rite_ids, [...(undo.ids ?? []), ...(undo.id ? [undo.id] : [])]);
      sheet.line_data.humanity = Math.min(10 - Number(sorcery.cruac_rating ?? 0), Number(sheet.line_data.humanity ?? 0) + undo.humanityLost);
    } else if (undo.kind === "theban") {
      sorcery.theban_rating = subtractDots(sorcery.theban_rating, undo.amount ?? 1);
      sorcery.theban_miracle_ids = withoutMany(sorcery.theban_miracle_ids, [...(undo.ids ?? []), ...(undo.id ? [undo.id] : [])]);
    } else sorcery[undo.key] = without(sorcery[undo.key], undo.id);
    sheet.line_data.blood_sorcery = sorcery;
  } else {
    const ordo = sheet.line_data.ordo_dracul && typeof sheet.line_data.ordo_dracul === "object" && !Array.isArray(sheet.line_data.ordo_dracul)
      ? { ...sheet.line_data.ordo_dracul as Record<string, unknown> }
      : {};
    if (undo.kind === "coil") {
      const ratings = { ...(ordo.coil_ratings as Record<string, number> | undefined) };
      ratings[undo.id] = subtractDots(ratings[undo.id], undo.amount ?? 1);
      ordo.coil_ratings = ratings;
    } else if (undo.kind === "scale") ordo.scale_ids = without(ordo.scale_ids, undo.id);
    sheet.line_data.ordo_dracul = ordo;
  }
}
