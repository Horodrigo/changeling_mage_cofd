import { ChangelingCharacterPaper } from "./sheet-view";
import type { GameLineSheetModule } from "@/lib/game-line-contracts/game-line-ui";

/** Changeling-owned sheet entry; its implementation closure contains no Mage UI. */
export const changelingSheet: GameLineSheetModule = { Component: ChangelingCharacterPaper };
