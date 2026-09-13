"use client";

import { EMPTY_HOMEBREWS, type HomebrewCatalog } from "@/lib/homebrews";

/**
 * The legacy Homebrew editor/storage is deferred. Surfaces receive an empty,
 * enabled catalog so bundled static material remains visible while user-defined
 * Homebrew data cannot affect the modular runtime.
 */
export function useHomebrews() {
  return EMPTY_HOMEBREWS as HomebrewCatalog;
}
