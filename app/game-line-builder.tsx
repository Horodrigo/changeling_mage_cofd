"use client";

import { useEffect, useState, type ComponentType } from "react";
import { getGameLineRegistration } from "@/game-lines/registry/game-line-registry";
import type { GameLineBuilderProps } from "@/lib/game-line-contracts/game-line-ui";
import type { PersistedGameLineId } from "@/lib/core/character/game-line-ids";
import { useCatalogSnapshot } from "./catalog-boundary";
import { useLanguage } from "@/lib/i18n";

/** Loads only the selected line's builder surface through the lightweight registry. */
export function GameLineBuilder(props: GameLineBuilderProps & { gameLine: PersistedGameLineId }) {
  const catalogs = useCatalogSnapshot();
  const { t } = useLanguage();
  const [Builder, setBuilder] = useState<ComponentType<GameLineBuilderProps> | null>(null);

  useEffect(() => {
    let cancelled = false;
    void getGameLineRegistration(props.gameLine).loadBuilder().then(({ Component }) => {
      if (!cancelled) setBuilder(() => Component);
    });
    return () => { cancelled = true; };
  }, [props.gameLine]);

  return Builder ? <Builder {...props} fixedGameLine={props.gameLine} catalogs={catalogs} /> : <div className="loading-card">{t("workspace.loading")}</div>;
}
