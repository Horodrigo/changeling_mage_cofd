import { ChangelingPrintSheet } from "./print-sheet";
import type { GameLinePrintModule } from "@/lib/game-line-contracts/game-line-ui";

/** Changeling-owned printable surface, loaded only when the user requests it. */
export const changelingPrintSheet: GameLinePrintModule = { Component: ChangelingPrintSheet };
