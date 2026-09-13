import type { GameLineRulesModule } from "@/lib/game-line-contracts/game-line-rules";
import { synchronizeMageBuilderMeritGrants } from "./builder-merit-grants";

/** Mage-owned persistence effects run only after the current schema is valid. */
export const mageRules: GameLineRulesModule = {
  synchronizeCharacter(character) {
    return synchronizeMageBuilderMeritGrants(structuredClone(character));
  },
};
