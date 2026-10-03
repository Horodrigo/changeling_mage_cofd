import type { CharacterSheet } from "@/lib/core/character/character-types";
import { legacyUndoForEntry, refundMageAdvancement, type MageAdvancementUndo } from "./experience-refunds";

type LegacyUndo = Extract<MageAdvancementUndo, { kind: "legacyInitiation" | "legacyAttainment" }>;
type LegacyHistoryEntry = {
  id: string;
  regular: number;
  arcane: number;
  undo?: MageAdvancementUndo;
  before?: unknown;
};

function isLegacyPurchase(entry: LegacyHistoryEntry): entry is LegacyHistoryEntry & { undo: LegacyUndo } {
  return entry.undo?.kind === "legacyInitiation" || entry.undo?.kind === "legacyAttainment";
}

export function discardLegacyAdvancements(character: CharacterSheet) {
  const next = structuredClone(character);
  const history = Array.isArray(character.current_state.mage_experience_history)
    ? character.current_state.mage_experience_history as LegacyHistoryEntry[]
    : [];
  const selectedId = (character.line_data.legacy_state as { definitionId?: string } | undefined)?.definitionId;
  const purchases = history.filter(isLegacyPurchase);
  // An unidentified receipt cannot safely be assigned to the selected Legacy.
  if (purchases.some(entry => !legacyUndoForEntry(entry))) return null;
  const legacyEntries = purchases.filter(entry => legacyUndoForEntry(entry)?.definitionId === selectedId);

  // History is newest first. Reversing in that order restores converted Praxes at their recorded indexes.
  for (const entry of legacyEntries) {
    if (!refundLegacyExperiencePurchase(next, entry.id)) return null;
  }

  delete next.line_data.legacy_state;
  return next;
}

/** Mutates only after receipt, delta, and resource checks; both refund surfaces use it. */
export function refundLegacyExperiencePurchase(sheet: CharacterSheet, entryId: string) {
  const history = Array.isArray(sheet.current_state.mage_experience_history) ? sheet.current_state.mage_experience_history as LegacyHistoryEntry[] : [];
  const matches = history.filter(entry => entry.id === entryId);
  if (matches.length !== 1) return false;
  const entry = matches[0], undo = legacyUndoForEntry(entry);
  if (!undo || ![entry.regular, entry.arcane].every(value => Number.isInteger(value) && value >= 0) || entry.regular + entry.arcane !== 1) return false;
  const { creditedRegular, creditedArcane, creditedArcaneBeats } = undo;
  if (![creditedRegular, creditedArcane, creditedArcaneBeats].every(value => Number.isInteger(value) && value >= 0) || creditedRegular + creditedArcane > 1 || creditedArcaneBeats > 2 || (!undo.removedPraxis && creditedRegular + creditedArcane !== 0)) return false;
  const state = sheet.current_state;
  const available = Number(state.mage_experience_available ?? 0) + entry.regular - creditedRegular;
  const arcaneAvailable = Number(state.arcane_experience_available ?? 0) + entry.arcane - creditedArcane;
  const spent = Number(state.mage_experience_spent ?? 0) - entry.regular;
  const arcaneSpent = Number(state.arcane_experience_spent ?? 0) - entry.arcane;
  const beats = Number(state.arcane_experience_beats ?? 0) - creditedArcaneBeats;
  // Do not silently forgive credits already spent/converted or create negative pools.
  if (![available, arcaneAvailable, spent, arcaneSpent, beats].every(value => Number.isInteger(value) && value >= 0) || !refundMageAdvancement(sheet, undo)) return false;
  sheet.current_state = { ...state, mage_experience_available: available, arcane_experience_available: arcaneAvailable, mage_experience_spent: spent, arcane_experience_spent: arcaneSpent, arcane_experience_beats: beats, mage_experience_history: history.filter(item => item.id !== entryId) };
  return true;
}
