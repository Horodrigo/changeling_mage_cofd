import type { CharacterSheet } from "../app/character-builder";
import { refundMageAdvancement, type MageAdvancementUndo } from "./experience-refunds";

type LegacyUndo = Extract<MageAdvancementUndo, { kind: "legacyInitiation" | "legacyAttainment" }>;
type LegacyHistoryEntry = {
  id: string;
  regular: number;
  arcane: number;
  undo?: MageAdvancementUndo;
};

function isLegacyPurchase(entry: LegacyHistoryEntry): entry is LegacyHistoryEntry & { undo: LegacyUndo } {
  return entry.undo?.kind === "legacyInitiation" || entry.undo?.kind === "legacyAttainment";
}

export function discardLegacyAdvancements(character: CharacterSheet) {
  const next = structuredClone(character);
  const history = Array.isArray(character.current_state.mage_experience_history)
    ? character.current_state.mage_experience_history as LegacyHistoryEntry[]
    : [];
  const legacyEntries = history.filter(isLegacyPurchase);

  // History is newest first. Reversing in that order restores converted Praxes at their recorded indexes.
  for (const entry of legacyEntries) {
    refundMageAdvancement(next, entry.undo);
    const creditedRegular = Number(entry.undo.creditedRegular ?? 0);
    const creditedArcane = Number(entry.undo.creditedArcane ?? 0);
    const creditedBeats = Number(entry.undo.creditedArcaneBeats ?? 0);
    const refundedRegular = Number(entry.regular) || 0;
    const refundedArcane = Number(entry.arcane) || 0;
    next.current_state.mage_experience_available = Number(next.current_state.mage_experience_available ?? 0) + refundedRegular - creditedRegular;
    next.current_state.arcane_experience_available = Number(next.current_state.arcane_experience_available ?? 0) + refundedArcane - creditedArcane;
    next.current_state.mage_experience_spent = Math.max(0, Number(next.current_state.mage_experience_spent??0)-refundedRegular);
    next.current_state.arcane_experience_spent = Math.max(0,Number(next.current_state.arcane_experience_spent??0)-refundedArcane);
    next.current_state.arcane_experience_beats = Math.max(0,Number(next.current_state.arcane_experience_beats??0)-creditedBeats);
  }

  delete next.line_data.legacy_state;
  const legacyIds = new Set(legacyEntries.map((entry) => entry.id));
  next.current_state.mage_experience_history = history.filter((entry) => !legacyIds.has(entry.id));
  return next;
}
