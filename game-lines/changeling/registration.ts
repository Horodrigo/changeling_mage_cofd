import type { GameLineRegistration } from "@/lib/game-line-contracts/game-line-registration";

/** Lightweight Changeling metadata. Every implementation surface stays lazy. */
export const changelingRegistration: GameLineRegistration = {
  id: "CtL",
  slug: "changeling",
  label: "Changeling: The Lost",
  iconSrc: "/changeling-skull.png",
  cardClass: "ctl-card",
  summaryClass: "ctl-summary",
  catalogGroups: {
    builder: ["core-merits", "changeling-merits", "changeling-contracts", "changeling-reference"],
    sheet: ["core-merits", "changeling-merits", "changeling-contracts", "core-reference", "changeling-reference"],
  },
  loadRules: () => import("./rules").then(({ changelingRules }) => changelingRules),
  loadBuilder: () => import("./builder").then(({ changelingBuilder }) => changelingBuilder),
  loadSheet: () => import("./sheet").then(({ changelingSheet }) => changelingSheet),
};
