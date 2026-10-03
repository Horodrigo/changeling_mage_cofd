import { resolveMeritDefinition } from "@/lib/merit-identity";
import type { MeritSelection } from "@/lib/core/character/character-types";

/** Identity-only index for pure Changeling mechanics, reconciled with static catalogs in tests. */
export const CHANGELING_MERIT_IDENTITIES = [
  ...[
    ["allies", "Allies"], ["barfly", "Barfly"], ["contacts", "Contacts"], ["indomitable", "Indomitable"],
    ["interdisciplinary-specialty", "Interdisciplinary Specialty"], ["library", "Library"], ["resources", "Resources"],
    ["retainer", "Retainer"], ["safe-place", "Safe Place"], ["trained-observer", "Trained Observer"],
  ].map(([slug, name]) => ({ id: `core-2ed:${slug}`, name, sourceId: "core-2ed" })),
  ...[
    ["arcadian-metabolism", "Arcadian Metabolism"], ["court-goodwill", "Court Goodwill"], ["diviner", "Diviner"],
    ["gentrified-bearing", "Gentrified Bearing"], ["hedge-sense", "Hedge Sense"], ["hob-kin", "Hob Kin"],
    ["mantle", "Mantle"], ["token", "Token"],
  ].map(([slug, name]) => ({ id: `ctl-2ed:${slug}`, name, sourceId: "ctl-2ed" })),
  { id: "oak-ash-thorn:entitlement", name: "Entitlement", sourceId: "ctl-oak-ash-thorn" },
];

/** Production schema-2 bridge for pure grant/access consumers; exact canonical name/source only.
 * Explicit IDs always win. Delete the bridge when ID-less selections are no longer supported. */
export const changelingMeritId = (merit: Pick<MeritSelection, "name" | "definitionId" | "sourceId">) =>
  merit.definitionId ?? resolveMeritDefinition(merit, CHANGELING_MERIT_IDENTITIES)?.id;
