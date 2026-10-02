import type { GameLineRegistration } from "@/lib/game-line-contracts/game-line-registration";

/** Metadata only: inactive lines never instantiate Werewolf mechanics or request its catalogs. */
export const werewolfRegistration: GameLineRegistration = {
  id: "WtF", slug: "werewolf", label: "Werewolf: The Forsaken", iconSrc: "/game-lines/werewolf/images/icon.webp",
  cardClass: "wtf-card", summaryClass: "wtf-summary",
  catalogGroups: {
    builder: ["core-merits", "werewolf-merits", "werewolf-reference", "werewolf-gifts", "werewolf-rites", "werewolf-fetishes", "werewolf-totem"],
    sheet: ["core-merits", "core-reference", "werewolf-merits", "werewolf-reference", "werewolf-gifts", "werewolf-rites", "werewolf-fetishes", "werewolf-totem"],
  },
  loadRules: () => import("./rules").then(({ loadWerewolfRules }) => loadWerewolfRules()),
  loadBuilder: () => import("./builder").then(({ werewolfBuilder }) => werewolfBuilder),
  loadSheet: () => import("./sheet").then(({ werewolfSheet }) => werewolfSheet),
};
