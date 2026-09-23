"use client";

import { MeritHomebrewPanel } from "@/app/merit-homebrew-panel";
import type { GameLineHomebrewModule, GameLineHomebrewProps } from "@/lib/game-line-contracts/game-line-ui";
import type { MeritDefinition } from "@/lib/merits";

function MageHomebrew({ catalogs }: GameLineHomebrewProps) {
  if (!catalogs) throw new Error("Mage Homebrew requires its catalog snapshot.");
  return <MeritHomebrewPanel line="MtA" catalog={[...catalogs.get<readonly MeritDefinition[]>("core-merits"), ...catalogs.get<readonly MeritDefinition[]>("mage-merits")]}/>;
}

export const mageHomebrew: GameLineHomebrewModule = { Component: MageHomebrew };
