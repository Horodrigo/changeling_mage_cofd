"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useLanguage } from "@/lib/i18n";
import type { CatalogGroupId } from "@/lib/game-line-contracts/catalog-groups";

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
  }>({ key: resourceKey, state: groups.length ? "loading" : "ready" });

  useEffect(() => {
    let cancelled = false;
    const requestedGroups = resourceKey
      ? resourceKey.split("|")
      : [];
    void import("@/game-lines/registry/catalog-group-registry").then(({ loadCatalogGroups }) =>
      loadCatalogGroups(requestedGroups),
    ).then(
      () => { if (!cancelled) setResult({ key: resourceKey, state: "ready" }); },
      () => { if (!cancelled) setResult({ key: resourceKey, state: "error" }); },
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
  return children;
}
