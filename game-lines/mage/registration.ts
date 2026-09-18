import type { GameLineRegistration } from "@/lib/game-line-contracts/game-line-registration";

/** Lightweight Mage metadata. Every implementation surface stays lazy. */
export const mageRegistration: GameLineRegistration = {
  id: "MtA",
  slug: "mage",
  label: "Mage: The Awakening",
  iconSrc: "/mage-skull.webp",
  cardClass: "mta-card",
  summaryClass: "mta-summary",
  catalogGroups: {
    builder: ["core-merits", "mage-merits", "mage-spells", "core-reference", "mage-reference"],
    sheet: ["core-merits", "mage-merits", "mage-spells", "core-reference", "mage-reference"],
  },
  loadRules: () => import("./rules").then(({ mageRules }) => mageRules),
  loadBuilder: () => import("./builder").then(({ mageBuilder }) => mageBuilder),
  loadSheet: () => import("./sheet").then(({ mageSheet }) => mageSheet),
};
