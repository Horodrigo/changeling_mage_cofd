/**
 * Stable identifiers used in persisted characters, exports, and homebrew data.
 * Human-readable slugs belong to the game-line registry.
 */
export const PERSISTED_GAME_LINE_IDS = ["CtL", "MtA"] as const;

export type PersistedGameLineId = (typeof PERSISTED_GAME_LINE_IDS)[number];
