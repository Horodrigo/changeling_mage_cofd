import type { MeritSelection } from "./core/character/character-types";

// Only these place Merits accept a free contribution from other characters.
export const SHARED_DOT_MERIT_IDS = new Set([
  "core-2ed:safe-place", "mta-2ed:sanctum", "ctl-2ed:hollow",
  "vtr-haven", "wtf-2ed:residential-area", "wtf-2ed:dedicated-locus",
  "ctl-hedge:shared-bastion", "ctl-2ed:stable-trod",
]);

export function sharedMeritDots(merit: Pick<MeritSelection, "definitionId" | "configuration">): number {
  if (!merit.definitionId || !SHARED_DOT_MERIT_IDS.has(merit.definitionId)) return 0;
  const value = merit.configuration?.sharedDots;
  const dots = typeof value === "string" && /^(0|[1-9]\d*)$/.test(value) ? Number(value) : 0;
  return Number.isSafeInteger(dots) ? dots : 0;
}

export function effectiveMeritDots(merit: Pick<MeritSelection, "definitionId" | "dots" | "configuration">): number {
  return merit.dots + sharedMeritDots(merit);
}
