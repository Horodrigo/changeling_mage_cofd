import { resolveMeritDefinition } from "@/lib/merit-identity";
import type { MeritSelection } from "@/lib/core/character/character-types";

/** Identity-only index for pure Vampire mechanics; reconciled with static catalogs in tests. */
export const VAMPIRE_MERIT_IDENTITIES = [
  { id: "core-2ed:mystery-cult-initiation", name: "Mystery Cult Initiation", sourceId: "core-2ed" },
  ...[
    ["vtr-kindred-status", "Kindred Status"], ["vtr-pack-alpha", "Pack Alpha"],
    ["vtr-touchstone", "Touchstone"], ["vtr-feeding-grounds", "Feeding Grounds"],
  ].map(([id, name]) => ({ id, name, sourceId: "vtr-2ed" })),
];

/** Schema-2 bridge for canonical ID-less selections only; explicit unavailable/Homebrew IDs win.
 * Delete this bridge when ID-less schema-2 selections are no longer supported. */
export const vampireMeritId = (merit: Pick<MeritSelection, "definitionId" | "name" | "sourceId">) =>
  merit.definitionId ?? resolveMeritDefinition(merit, VAMPIRE_MERIT_IDENTITIES)?.id;
