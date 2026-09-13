import type { ComponentType } from "react";
import type { CharacterSheet } from "@/lib/core/character/character-types";
import type { CatalogSnapshot } from "./catalog-groups";

/** React-specific contracts are kept separate from the neutral rules contract. */
export type GameLineBuilderProps = {
  player: string;
  initial?: CharacterSheet | null;
  onCancel: () => void;
  onSave: (sheet: CharacterSheet) => void;
  catalogs?: CatalogSnapshot;
};

export type GameLineSheetProps = {
  character: CharacterSheet;
  updateState: (state: Record<string, unknown>) => void;
  updateSheet: (sheet: CharacterSheet) => void;
  catalogs?: CatalogSnapshot;
};

export type GameLineHomebrewProps = { characters: CharacterSheet[] };

export type GameLineBuilderModule = { Component: ComponentType<GameLineBuilderProps> };
export type GameLineSheetModule = { Component: ComponentType<GameLineSheetProps> };
export type GameLineHomebrewModule = { Component: ComponentType<GameLineHomebrewProps> };
