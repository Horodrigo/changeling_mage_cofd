import type { MeritSelection } from "./character-types";
import { resolveMeritDefinition } from "@/lib/merit-identity";

/** Small identity index for pure Core mechanics; tests reconcile it with the static catalog. */
export const COMMON_MERIT_IDENTITIES = [
  ["professional-training", "Professional Training"],
  ["mystery-cult-initiation", "Mystery Cult Initiation"],
  ["mystery-cult-influence", "Mystery Cult Influence"],
  ["contacts", "Contacts"],
  ["fast-reflexes", "Fast Reflexes"],
  ["fleet-of-foot", "Fleet of Foot"],
  ["giant", "Giant"],
  ["small-framed", "Small-Framed"],
].map(([slug, name]) => ({ id: `core-2ed:${slug}`, name, sourceId: "core-2ed" }));

/**
 * Pure grant/derived consumers cannot load catalogs. Their production schema-2 bridge uses only
 * the exact Core name/source index through the shared resolver; explicit IDs always win.
 * Delete the fallback when ID-less schema-2 Merit selections are no longer supported.
 */
export const commonMeritId = (merit: MeritSelection) => merit.definitionId ?? resolveMeritDefinition(merit, COMMON_MERIT_IDENTITIES)?.id;
