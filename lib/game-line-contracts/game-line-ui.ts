import type { ComponentType } from "react";
import type { CharacterSheet } from "@/lib/core/character/character-types";
import type { PersistedGameLineId } from "@/lib/core/character/game-line-ids";
import type { CatalogSnapshot } from "./catalog-groups";

/** React-specific contracts are kept separate from the neutral rules contract. */
export type GameLineBuilderProps = {
  player: string;
  initial?: CharacterSheet | null;
  onCancel: () => void;
  onSave: (sheet: CharacterSheet) => void;
  catalogs?: CatalogSnapshot;
  fixedGameLine?: PersistedGameLineId;
};

export type GameLineSheetProps = {
  character: CharacterSheet;
  updateState: (state: Record<string, unknown>) => void;
  updateSheet: (sheet: CharacterSheet) => void;
  catalogs?: CatalogSnapshot;
};

export type GameLineBuilderModule = { Component: ComponentType<GameLineBuilderProps> };
export type GameLineSheetModule = { Component: ComponentType<GameLineSheetProps> };
