import type { GameLineRegistration } from "@/lib/game-line-contracts/game-line-registration";

/** Lightweight mortal/Core metadata. Every implementation surface stays lazy. */
export const mortalRegistration: GameLineRegistration = {
  id: "CofD",
  slug: "mortal",
  label: "Chronicles of Darkness",
  iconSrc: "/cod-emblem-256.webp",
  cardClass: "cofd-card",
  summaryClass: "cofd-summary",
  catalogGroups: {
    builder: ["core-merits"],
    sheet: ["core-merits", "core-reference"],
  },
  loadRules: () => import("./rules").then(({ mortalRules }) => mortalRules),
  loadBuilder: () => import("./builder").then(({ mortalBuilder }) => mortalBuilder),
  loadSheet: () => import("./sheet").then(({ mortalSheet }) => mortalSheet),
};
