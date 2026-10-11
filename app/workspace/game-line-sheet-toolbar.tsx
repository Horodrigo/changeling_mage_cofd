"use client";

import { lazy, Suspense } from "react";
import { listGameLineRegistrations } from "@/game-lines/registry/game-line-registry";
import type { PersistedGameLineId } from "@/lib/core/character/game-line-ids";

const toolbars = new Map(listGameLineRegistrations().flatMap(line => {
  if (!line.loadSheetToolbar) return [];
  const Toolbar = lazy(line.loadSheetToolbar);
  return [[line.id, <Suspense key={line.id} fallback={null}><Toolbar /></Suspense>] as const];
}));

export function GameLineSheetToolbar({ gameLine }: { gameLine: PersistedGameLineId }) {
  return toolbars.get(gameLine) ?? null;
}
