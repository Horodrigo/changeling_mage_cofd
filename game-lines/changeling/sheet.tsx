import { CharacterPaper } from "@/app/workspace/character-paper";
import type { GameLineSheetModule } from "@/lib/game-line-contracts/game-line-ui";

/** Temporary adapter while the common sheet shell is separated from Changeling UI. */
export const changelingSheet: GameLineSheetModule = { Component: CharacterPaper };
