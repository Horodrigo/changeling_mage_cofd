"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useLanguage } from "@/lib/i18n";
import type { CatalogGroupId, CatalogSnapshot } from "@/lib/game-line-contracts/catalog-groups";

const CatalogSnapshotContext = createContext<CatalogSnapshot | null>(null);

/** Catalog data for the active boundary; unavailable outside a loaded surface. */
export function useCatalogSnapshot(): CatalogSnapshot {
  const snapshot = useContext(CatalogSnapshotContext);
  if (!snapshot) throw new Error("Catalog snapshot is unavailable outside CatalogBoundary.");
  return snapshot;
}

export function CatalogBoundary({
  groups,
  children,
}: {
  groups: readonly CatalogGroupId[];
  children: ReactNode;
}) {
  const { tr } = useLanguage();
  const resourceKey = groups.join("|");
  const [result, setResult] = useState<{
    key: string;
    state: "loading" | "ready" | "error";
    snapshot: CatalogSnapshot | null;
  }>({ key: resourceKey, state: groups.length ? "loading" : "ready", snapshot: null });

  useEffect(() => {
    let cancelled = false;
    const requestedGroups = resourceKey
      ? resourceKey.split("|")
      : [];
    void import("@/game-lines/registry/catalog-group-registry").then(({ loadCatalogGroups }) =>
      loadCatalogGroups(requestedGroups),
    ).then(
      (snapshot) => { if (!cancelled) setResult({ key: resourceKey, state: "ready", snapshot }); },
      () => { if (!cancelled) setResult({ key: resourceKey, state: "error", snapshot: null }); },
    );
    return () => { cancelled = true; };
  }, [resourceKey]);

  const state = result.key === resourceKey ? result.state : "loading";

  if (state === "loading")
    return <div className="loading-card">{tr("Carregando catálogo…", "Loading catalog…")}</div>;
  if (state === "error")
    return (
      <div className="notice" role="alert">
        {tr(
          "O catálogo não está disponível neste dispositivo. Conecte-se e tente novamente.",
          "The catalog is not available on this device. Connect and try again.",
        )}
      </div>
    );
  return <CatalogSnapshotContext.Provider value={result.snapshot}>{children}</CatalogSnapshotContext.Provider>;
}
