export const SHEET_BASE_WIDTH = 900;
export const SHEET_MAX_WIDTH = 1200;
export const SHEET_MAX_ZOOM = SHEET_MAX_WIDTH / SHEET_BASE_WIDTH;

export function maximumSheetZoom(availableWidth: number) {
  if (!Number.isFinite(availableWidth)) return 1;
  return Math.max(1, Math.min(SHEET_MAX_ZOOM, availableWidth / SHEET_BASE_WIDTH));
}

export function stepSheetZoom(current: number, direction: "in" | "out", maximum: number) {
  const boundedMaximum = Math.max(1, Math.min(SHEET_MAX_ZOOM, maximum));
  const levels = [...new Set([1, 1.1, 1.2, 1.3, boundedMaximum])].sort((left, right) => left - right);
  const epsilon = 0.001;
  if (direction === "in") return levels.find((level) => level > current + epsilon) ?? boundedMaximum;
  return [...levels].reverse().find((level) => level < current - epsilon) ?? 1;
}
