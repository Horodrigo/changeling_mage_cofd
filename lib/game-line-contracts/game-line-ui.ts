import type { ComponentType } from "react";
import type { CharacterSheet } from "@/lib/core/character/character-types";
import type { PersistedGameLineId } from "@/lib/core/character/game-line-ids";
import type { CharacterNarrativePatch } from "@/lib/core/character/narrative-update";
import type { CatalogSnapshot } from "./catalog-groups";

/** React-specific contracts are kept separate from the neutral rules contract. */
export type GameLineBuilderProps = {
  player: string;
  initial?: CharacterSheet | null;
  onCancel: () => void;
  onSave: (sheet: CharacterSheet) => void;
  onSaveDraft: (sheet: CharacterSheet) => void;
  catalogs?: CatalogSnapshot;
  fixedGameLine?: PersistedGameLineId;
};

export type GameLineSheetProps = {
  character: CharacterSheet;
  updateState: (state: Record<string, unknown>) => void;
  updateSheet: (sheet: CharacterSheet) => void;
  updateNarrative?: (patch: CharacterNarrativePatch) => void;
  catalogs?: CatalogSnapshot;
};

export type GameLinePrintOptions = {
  expandedMeritDetails: boolean;
  powerDetails: boolean;
  companionSheets: boolean;
};

export type GameLinePrintSheetProps = {
  character: CharacterSheet;
  options: GameLinePrintOptions;
  catalogs?: CatalogSnapshot;
  onReadyChange?: (ready: boolean) => void;
};

export type GameLineHomebrewProps = { catalogs?: CatalogSnapshot };

export type GameLineBuilderModule = { Component: ComponentType<GameLineBuilderProps> };
export type GameLineSheetModule = { Component: ComponentType<GameLineSheetProps> };
export type GameLineSheetToolbarModule = { default: ComponentType };
export type GameLinePrintModule = { Component: ComponentType<GameLinePrintSheetProps> };
export type GameLineHomebrewModule = { Component: ComponentType<GameLineHomebrewProps> };
