import { HomebrewsScreen } from "@/app/homebrews";
import type { GameLineHomebrewModule } from "@/lib/game-line-contracts/game-line-ui";

/** Compatibility adapter for the current global homebrew management screen. */
export const changelingHomebrew: GameLineHomebrewModule = { Component: HomebrewsScreen };
