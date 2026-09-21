"use client";

import { useEffect, useState, type ComponentType } from "react";
import { getGameLineRegistration } from "@/game-lines/registry/game-line-registry";
import type { PersistedGameLineId } from "@/lib/core/character/game-line-ids";
import type { GameLineHomebrewProps } from "@/lib/game-line-contracts/game-line-ui";
import { useCatalogSnapshot } from "./catalog-boundary";
import { useLanguage } from "@/lib/i18n";

export function GameLineHomebrew({ gameLine }: { gameLine: PersistedGameLineId }) {
  const catalogs = useCatalogSnapshot(), { t } = useLanguage();
  const [Screen, setScreen] = useState<ComponentType<GameLineHomebrewProps> | null>(null);
  useEffect(() => {
    let cancelled = false;
    const loader = getGameLineRegistration(gameLine).loadHomebrew;
    if (!loader) return () => { cancelled = true; };
    void loader().then(({ Component }) => { if (!cancelled) setScreen(() => Component); });
    return () => { cancelled = true; };
  }, [gameLine]);
  return Screen ? <Screen catalogs={catalogs}/> : <div className="loading-card">{t("workspace.loading")}</div>;
}
