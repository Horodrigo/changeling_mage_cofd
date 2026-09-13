"use client";

import { useEffect, useState, type ComponentType } from "react";
import { getGameLineRegistration } from "@/game-lines/registry/game-line-registry";
import type { GameLineBuilderProps } from "@/lib/game-line-contracts/game-line-ui";
import { useCatalogSnapshot } from "./catalog-boundary";

/** Loads only the selected line's builder surface through the lightweight registry. */
export function GameLineBuilder(props: GameLineBuilderProps & { gameLine: "CtL" | "MtA" }) {
  const catalogs = useCatalogSnapshot();
  const [Builder, setBuilder] = useState<ComponentType<GameLineBuilderProps> | null>(null);

  useEffect(() => {
    let cancelled = false;
    void getGameLineRegistration(props.gameLine).loadBuilder().then(({ Component }) => {
      if (!cancelled) setBuilder(() => Component);
    });
    return () => { cancelled = true; };
  }, [props.gameLine]);

  return Builder ? <Builder {...props} fixedGameLine={props.gameLine} catalogs={catalogs} /> : <div className="loading-card">Carregando…</div>;
}
