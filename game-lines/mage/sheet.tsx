import { MageCharacterPaper } from "./sheet-view";
import type { GameLineSheetModule } from "@/lib/game-line-contracts/game-line-ui";

/** Mage-owned sheet entry; its implementation closure contains no Changeling UI. */
export const mageSheet: GameLineSheetModule = { Component: MageCharacterPaper };
