import { CharacterBuilder } from "@/app/character-builder";
import type { GameLineBuilderModule } from "@/lib/game-line-contracts/game-line-ui";

/** Temporary adapter while the common builder shell is separated from Mage UI. */
export const mageBuilder: GameLineBuilderModule = { Component: CharacterBuilder };
