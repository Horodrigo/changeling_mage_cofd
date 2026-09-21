import type { GameLineRegistration } from "@/lib/game-line-contracts/game-line-registration";

/** Lightweight Vampire metadata. Every implementation surface stays lazy. */
export const vampireRegistration: GameLineRegistration = {
  id: "VtR",
  slug: "vampire",
  label: "Vampire: The Requiem",
  iconSrc: "/vampire-skull.webp",
  cardClass: "vtr-card",
  summaryClass: "vtr-summary",
  catalogGroups: {
    builder: ["core-merits", "vampire-merits", "vampire-powers", "vampire-reference"],
    sheet: ["core-merits", "vampire-merits", "vampire-powers", "core-reference", "vampire-reference", "vampire-conditions"],
    print: ["core-merits", "vampire-merits", "vampire-powers", "core-reference", "vampire-reference", "vampire-conditions"],
    homebrew: ["vampire-reference"],
  },
  loadRules: () => import("./rules").then(({ vampireRules }) => vampireRules),
  loadBuilder: () => import("./builder").then(({ vampireBuilder }) => vampireBuilder),
  loadSheet: () => import("./sheet").then(({ vampireSheet }) => vampireSheet),
  loadPrintSheet: () => import("./print").then(({ vampirePrintSheet }) => vampirePrintSheet),
  loadHomebrew: () => import("./homebrew").then(({ vampireHomebrew }) => vampireHomebrew),
};
