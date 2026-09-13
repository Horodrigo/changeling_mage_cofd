import type { GameLineRulesModule } from "@/lib/game-line-contracts/game-line-rules";
import { normalizeChangelingFrailties } from "@/lib/creation-rules";
import { synchronizeChangelingBuilderMeritGrants } from "./builder-merit-grants";

/** Pure normalization hook; no catalog or browser I/O is performed here. */
export const changelingRules: GameLineRulesModule = {
  normalizeCharacter(character) {
    const wyrd = Number(character.line_data.wyrd ?? 1);
    return {
      ...character,
      line_data: {
        ...character.line_data,
        frailties: normalizeChangelingFrailties(character.line_data.frailties, wyrd),
      },
    };
  },
  synchronizeCharacter(character) {
    return synchronizeChangelingBuilderMeritGrants(structuredClone(character));
  },
};
