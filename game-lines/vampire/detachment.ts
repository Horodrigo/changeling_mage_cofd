import detachmentCatalog from "./catalog-data/detachment.json";

export type VampireDetachmentBreakingPoint = {
  id: string;
  level: number;
  label: string;
};

export type VampireDetachmentTier = {
  level: number;
  dice: number;
  breakingPoints: VampireDetachmentBreakingPoint[];
};

export const DETACHMENT_BREAKING_POINT_TIERS = detachmentCatalog.tiers as VampireDetachmentTier[];


export const VAST_DYNASTY_EMBRACE_BREAKING_POINT = detachmentCatalog.vastDynastyEmbrace as VampireDetachmentBreakingPoint;

/** Backward-compatible tier export used by older UI/tests. */
export const DETACHMENT_BREAKING_POINTS = DETACHMENT_BREAKING_POINT_TIERS.map((item) => ({
  level: item.level,
  dice: item.dice,
  examples: item.breakingPoints.map((point) => point.label),
}));

export const DETACHMENT_BREAKING_POINT_OPTIONS = DETACHMENT_BREAKING_POINT_TIERS.flatMap((item) => item.breakingPoints);

export function vampireDetachmentBaseDice(level: number) {
  const normalized = Math.max(1, Math.min(10, Math.trunc(Number(level) || 1)));
  return DETACHMENT_BREAKING_POINT_TIERS.find((item) => item.level === normalized)?.dice ?? 0;
}

export function vampireDetachmentTouchstoneModifier(attachedTouchstones: number) {
  const count = Math.max(0, Math.trunc(Number(attachedTouchstones) || 0));
  if (count === 0) return -2;
  if (count === 1) return 2;
  return 3;
}

export function vampireDetachmentPool(level: number, attachedTouchstones: number, otherModifier = 0, baneCount = 0) {
  return vampireDetachmentBaseDice(level)
    + vampireDetachmentTouchstoneModifier(attachedTouchstones)
    + Math.trunc(Number(otherModifier) || 0)
    - Math.max(0, Math.min(3, Math.trunc(Number(baneCount) || 0)));
}
