import type { GameLineRegistration } from "@/lib/game-line-contracts/game-line-registration";

/** Lightweight Mage metadata. Every implementation surface stays lazy. */
export const mageRegistration: GameLineRegistration = {
  id: "MtA",
  slug: "mage",
  label: "Mage: The Awakening",
  catalogGroups: {
    builder: ["core-merits", "mage-merits", "mage-spells", "core-reference"],
    sheet: ["core-merits", "mage-merits", "mage-spells", "core-reference"],
    homebrew: ["core-merits", "mage-merits", "mage-spells"],
  },
  loadRules: () => import("./rules").then(({ mageRules }) => mageRules),
  loadBuilder: () => import("./builder").then(({ mageBuilder }) => mageBuilder),
  loadSheet: () => import("./sheet").then(({ mageSheet }) => mageSheet),
  loadHomebrew: () => import("./homebrew").then(({ mageHomebrew }) => mageHomebrew),
};
