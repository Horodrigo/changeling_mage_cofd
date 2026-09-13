import type { GameLineRegistration } from "@/lib/game-line-contracts/game-line-registration";

/** Lightweight Changeling metadata. Every implementation surface stays lazy. */
export const changelingRegistration: GameLineRegistration = {
  id: "CtL",
  slug: "changeling",
  label: "Changeling: The Lost",
  catalogGroups: {
    builder: ["core-merits", "changeling-merits", "changeling-contracts", "changeling-reference"],
    sheet: ["core-merits", "changeling-merits", "changeling-contracts", "changeling-reference"],
    homebrew: ["core-merits", "changeling-merits", "changeling-contracts", "changeling-reference"],
  },
  loadRules: () => import("./rules").then(({ changelingRules }) => changelingRules),
  loadBuilder: () => import("./builder").then(({ changelingBuilder }) => changelingBuilder),
  loadSheet: () => import("./sheet").then(({ changelingSheet }) => changelingSheet),
  loadHomebrew: () => import("./homebrew").then(({ changelingHomebrew }) => changelingHomebrew),
};
