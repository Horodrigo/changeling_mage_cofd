"use client";

import { useEffect, useState, type ComponentType } from "react";
import { getGameLineRegistration } from "@/game-lines/registry/game-line-registry";
import type { GameLineSheetProps } from "@/lib/game-line-contracts/game-line-ui";
import { useCatalogSnapshot } from "../catalog-boundary";

/** Loads only the active line's in-app sheet surface through the registry. */
export function GameLineSheet(props: GameLineSheetProps) {
  const catalogs = useCatalogSnapshot();
  const [Sheet, setSheet] = useState<ComponentType<GameLineSheetProps> | null>(null);

  useEffect(() => {
    let cancelled = false;
    void getGameLineRegistration(props.character.game_line).loadSheet().then(({ Component }) => {
      if (!cancelled) setSheet(() => Component);
    });
    return () => { cancelled = true; };
  }, [props.character.game_line]);

  return Sheet ? <Sheet {...props} catalogs={catalogs} /> : <div className="loading-card">Carregando…</div>;
}
